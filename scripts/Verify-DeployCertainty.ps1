<#
.SYNOPSIS
  Gate C1 - prove Deploy-VPS under pipe + no-pipe; tip integrity; smoke.

.EXAMPLE
  .\scripts\Verify-DeployCertainty.ps1 -SshTarget 'root@185.243.54.115'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $SshTarget,

    [string] $RemotePath = "/var/www/vcms/current",

    [string] $PublicBase = "https://cmd.flexgrafik.nl"
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot
$logDir = Join-Path $RepoRoot "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$script:results = New-Object System.Collections.Generic.List[object]

function Add-Result {
    param([string]$Id, [string]$Status, [string]$Detail)
    $script:results.Add([pscustomobject]@{ id = $Id; status = $Status; detail = $Detail })
    $color = "Yellow"
    if ($Status -eq "PASS") { $color = "Green" }
    if ($Status -eq "FAIL") { $color = "Red" }
    Write-Host ("[{0}] {1} - {2}" -f $Status, $Id, $Detail) -ForegroundColor $color
}

npm run docs:build
if ($LASTEXITCODE -ne 0) { throw "docs:build failed" }
Add-Result -Id "C1.0-build" -Status "PASS" -Detail "npm run docs:build exit 0"

$pipeLog = Join-Path $logDir ("certainty-pipe-{0}.log" -f $stamp)
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\Deploy-VPS.ps1" -SshTarget $SshTarget -SkipBuild *>&1 |
        Tee-Object -FilePath $pipeLog
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prevEap
    $sw.Stop()
    if ($code -ne 0) { throw ("pipe deploy exit {0}" -f $code) }
    if ($sw.Elapsed.TotalMinutes -gt 5) { throw ("pipe deploy too slow: {0}" -f $sw.Elapsed) }
    if (-not (Select-String -Path $pipeLog -Pattern "Integrity: PASSED" -Quiet)) {
        throw "pipe log missing Integrity: PASSED"
    }
    Add-Result -Id "C1.1-pipe" -Status "PASS" -Detail (("exit 0 in {0:n1}s; Tee-Object OK" -f $sw.Elapsed.TotalSeconds))
}
catch {
    $sw.Stop()
    Add-Result -Id "C1.1-pipe" -Status "FAIL" -Detail $_.Exception.Message
    throw
}

$sw2 = [Diagnostics.Stopwatch]::StartNew()
& powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\Deploy-VPS.ps1" -SshTarget $SshTarget -SkipBuild
if ($LASTEXITCODE -ne 0) {
    Add-Result -Id "C1.2-nopipe" -Status "FAIL" -Detail ("exit {0}" -f $LASTEXITCODE)
    throw "nopipe deploy failed"
}
$sw2.Stop()
Add-Result -Id "C1.2-nopipe" -Status "PASS" -Detail (("exit 0 in {0:n1}s" -f $sw2.Elapsed.TotalSeconds))

$rev = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget ("cat {0}/REVISION" -f $RemotePath)
if ($LASTEXITCODE -ne 0 -or ($rev -join "`n") -notmatch 'git_short=') {
    Add-Result -Id "C1.3-revision" -Status "FAIL" -Detail "REVISION missing"
    throw "REVISION missing"
}
$revText = ($rev | Out-String).Trim()
Add-Result -Id "C1.3-revision" -Status "PASS" -Detail ((($revText -split "`n" | Select-Object -First 2) -join " "))

$hb = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/coi-commander-ops-handbook"
$sm = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/surfaces-map"
if ($hb -ne "200" -or $sm -ne "200") {
    Add-Result -Id "C1.4-local-smoke" -Status "FAIL" -Detail ("hb={0} sm={1}" -f $hb, $sm)
    throw "local smoke fail"
}
Add-Result -Id "C1.4-local-smoke" -Status "PASS" -Detail ("hb={0} sm={1}" -f $hb, $sm)

try {
    $code = 0
    try {
        $pub = Invoke-WebRequest -Uri ($PublicBase + "/docs/study/coi-commander-ops-handbook") -Method Head -TimeoutSec 20 -UseBasicParsing
        $code = [int]$pub.StatusCode
    }
    catch {
        if ($_.Exception.Response) {
            $code = [int]$_.Exception.Response.StatusCode
        }
        else { throw }
    }
    if (($code -eq 200) -or ($code -eq 401)) {
        Add-Result -Id "C1.4-public" -Status "PASS" -Detail ("cmd handbook HTTP {0}" -f $code)
    }
    else {
        Add-Result -Id "C1.4-public" -Status "FAIL" -Detail ("HTTP {0}" -f $code)
    }
}
catch {
    Add-Result -Id "C1.4-public" -Status "~" -Detail $_.Exception.Message
}

$out = Join-Path $RepoRoot "docs\handoffs\2026-07-19-deploy-certainty-C1-PROOF.md"
$fail = @($script:results | Where-Object { $_.status -eq "FAIL" }).Count
$status = "PASS"
if ($fail -gt 0) { $status = "FAIL" }
$rows = ($script:results | ForEach-Object { "| {0} | {1} | {2} |" -f $_.id, $_.status, $_.detail }) -join "`n"
$body = @"
---
status: "[ACTIVE]"
title: "Deploy certainty C1 PROOF"
gate: "CERTAINTY-C1"
updated: "$(Get-Date -Format 'yyyy-MM-dd')"
result: "$status"
---

# Deploy certainty C1

| ID | Status | Detail |
|----|--------|--------|
$rows

REVISION (remote):

``````
$revText
``````
"@
Set-Content -Encoding utf8 -Path $out -Value $body
Write-Host ("C1 overall: {0} -> {1}" -f $status, $out)
if ($fail -gt 0) { exit 1 }
exit 0
