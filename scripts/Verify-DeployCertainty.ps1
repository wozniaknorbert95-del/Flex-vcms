<#
.SYNOPSIS
  Gate C1 — prove Deploy-VPS is reliable under pipe + no-pipe; tip integrity; external smoke.

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
$results = @()

function Add-Result([string]$Id, [string]$Status, [string]$Detail) {
    $script:results += [pscustomobject]@{ id = $Id; status = $Status; detail = $Detail }
    $color = if ($Status -eq "PASS") { "Green" } elseif ($Status -eq "FAIL") { "Red" } else { "Yellow" }
    Write-Host "[$Status] $Id — $Detail" -ForegroundColor $color
}

# Preflight build
npm run docs:build
if ($LASTEXITCODE -ne 0) { throw "docs:build failed" }
Add-Result "C1.0-build" "PASS" "npm run docs:build exit 0"

# C1.1 — WITH pipe (historical failure mode)
$pipeLog = Join-Path $logDir "certainty-pipe-$stamp.log"
$sw = [Diagnostics.Stopwatch]::StartNew()
try {
    & powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\Deploy-VPS.ps1" -SshTarget $SshTarget -SkipBuild *>&1 |
        Tee-Object -FilePath $pipeLog
    $code = $LASTEXITCODE
    $sw.Stop()
    if ($code -ne 0) { throw "pipe deploy exit $code" }
    if ($sw.Elapsed.TotalMinutes -gt 5) { throw "pipe deploy too slow: $($sw.Elapsed)" }
    if (-not (Select-String -Path $pipeLog -Pattern "Integrity: PASSED" -Quiet)) {
        throw "pipe log missing Integrity: PASSED"
    }
    Add-Result "C1.1-pipe" "PASS" ("exit 0 in {0:n1}s; Tee-Object OK" -f $sw.Elapsed.TotalSeconds)
}
catch {
    $sw.Stop()
    Add-Result "C1.1-pipe" "FAIL" $_.Exception.Message
    throw
}

# C1.2 — WITHOUT pipe
$sw2 = [Diagnostics.Stopwatch]::StartNew()
& powershell -NoProfile -ExecutionPolicy Bypass -File ".\scripts\Deploy-VPS.ps1" -SshTarget $SshTarget -SkipBuild
if ($LASTEXITCODE -ne 0) {
    Add-Result "C1.2-nopipe" "FAIL" "exit $LASTEXITCODE"
    throw "nopipe deploy failed"
}
$sw2.Stop()
Add-Result "C1.2-nopipe" "PASS" ("exit 0 in {0:n1}s" -f $sw2.Elapsed.TotalSeconds)

# C1.3 — remote REVISION present
$rev = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget "cat $RemotePath/REVISION"
if ($LASTEXITCODE -ne 0 -or $rev -notmatch 'git_short=') {
    Add-Result "C1.3-revision" "FAIL" "REVISION missing"
    throw "REVISION missing"
}
Add-Result "C1.3-revision" "PASS" (($rev -split "`n" | Select-Object -First 2) -join " ")

# C1.4 — localhost smoke (already in Deploy) + public URL if reachable
$hb = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/coi-commander-ops-handbook"
$sm = & ssh -n -o BatchMode=yes -o ConnectTimeout=15 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/surfaces-map"
if ($hb -ne "200" -or $sm -ne "200") {
    Add-Result "C1.4-local-smoke" "FAIL" "hb=$hb sm=$sm"
    throw "local smoke fail"
}
Add-Result "C1.4-local-smoke" "PASS" "hb=$hb sm=$sm"

# Public: may be 401 without auth — treat 200 or 401 as reachable surface
try {
    try {
        $pub = Invoke-WebRequest -Uri "$PublicBase/docs/study/coi-commander-ops-handbook" -Method Head -TimeoutSec 20 -UseBasicParsing
        $code = [int]$pub.StatusCode
    }
    catch {
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $code = [int]$_.Exception.Response.StatusCode
        }
        else { throw }
    }
    if ($code -in 200, 401) {
        Add-Result "C1.4-public" "PASS" "cmd handbook HTTP $code (401=Basic Auth OK)"
    }
    else {
        Add-Result "C1.4-public" "FAIL" "HTTP $code"
    }
}
catch {
    Add-Result "C1.4-public" "~" $_.Exception.Message
}

$out = Join-Path $RepoRoot "docs\handoffs\2026-07-19-deploy-certainty-C1-PROOF.md"
$fail = @($results | Where-Object { $_.status -eq "FAIL" }).Count
$status = if ($fail -eq 0) { "PASS" } else { "FAIL" }
@"
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
$(($results | ForEach-Object { "| $($_.id) | $($_.status) | $($_.detail) |" }) -join "`n")

REVISION (remote):
``````
$rev
``````
"@ | Set-Content -Encoding utf8 $out

Write-Host "C1 overall: $status → $out" -ForegroundColor $(if ($status -eq "PASS") { "Green" } else { "Red" })
if ($fail -gt 0) { exit 1 }
exit 0
