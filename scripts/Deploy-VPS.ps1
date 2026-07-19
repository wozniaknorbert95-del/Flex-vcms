<#
.SYNOPSIS
  Lokalny build VitePress, synchronizacja plików Node + dist na VPS, npm ci + PM2 reload.

.DESCRIPTION
  Brak haseł i kluczy w repozytorium — uwierzytelnianie przez ssh-agent, ~/.ssh/config lub interaktywne SSH.
  Katalog na serwerze musi być zgodny z ecosystem.config.js (domyślnie /var/www/vcms/current).
  Logi PM2: /var/www/vcms/logs (utwórz ręcznie przy pierwszym razie, jeśli brak).

  VCMS-DEPLOY-FIX-01: Invoke-Remote (BatchMode + ConnectTimeout) + Send-TarDir
  zamiast scp -r / zagnieżdżonych cudzysłowów PowerShell (Windows hang).

  ECO-POLISH certainty: ssh -n (never read stdin — PowerShell pipelines hang OpenSSH).
  Writes REVISION + dist SHA256 manifest; verifies remote checksums after upload.
  CONTRACT: do NOT pipe this script (| Tee-Object / Select-Object -Last). Run directly.

.PARAMETER SshTarget
  Cel SSH, np. root@185.243.54.115

.PARAMETER RemotePath
  Ścieżka cwd aplikacji na VPS (np. /var/www/vcms/current).

.PARAMETER SkipBuild
  Pomiń npm run docs:build (zakłada istniejący docs/.vitepress/dist).

.PARAMETER WhatIf
  Wypisz kroki i komendy bez wykonania build/scp/ssh.

.EXAMPLE
  .\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115' -WhatIf

.EXAMPLE
  .\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115'
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $SshTarget,

    [Parameter(Mandatory = $false)]
    [string] $RemotePath = "/var/www/vcms/current",

    [switch] $SkipBuild,

    [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot

$distLocal = Join-Path $RepoRoot "docs\.vitepress\dist"
$requiredRootFiles = @(
    "server.js",
    "package.json",
    "package-lock.json",
    "ecosystem.config.js",
    "repos.yaml",
    "flex-vcms-todo.json",
    "brain.md"
)
# REVISION is generated after dist exists (tip + hashes), then uploaded with root files.
# Large trees — transferred via tar (not scp -r)
$tarDirectories = @("public", "src", "tools", "scripts")

function Write-Plan {
    param([string]$Line)
    $ts = Get-Date -Format "HH:mm:ss"
    Write-Host "[$ts][Plan] $Line" -ForegroundColor Cyan
}

function Invoke-Remote {
    param(
        [Parameter(Mandatory = $true)]
        [string] $RemoteCmd
    )
    # Pass remote command as ONE string arg. Avoid bare `[` / `]` (PowerShell wildcards)
    # and nested quote mangling that hung Windows OpenSSH.
    Write-Plan "ssh $SshTarget :: $RemoteCmd"
    if ($WhatIf) {
        Write-Host "  (skipped ssh - WhatIf)"
        return
    }
    # -n: do not read stdin (PowerShell pipelines / Tee-Object otherwise hang OpenSSH)
    # Continue: native stderr (npm warn) must not terminate under $ErrorActionPreference Stop
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & ssh -n -o BatchMode=yes -o ConnectTimeout=20 -o ServerAliveInterval=15 $SshTarget "$RemoteCmd"
    $ec = $LASTEXITCODE
    $ErrorActionPreference = $prevEap
    if ($ec -ne 0) {
        throw "Remote command failed (exit $ec): $RemoteCmd"
    }
}

function Send-ScpFile {
    param(
        [Parameter(Mandatory = $true)]
        [string] $LocalPath,
        [Parameter(Mandatory = $true)]
        [string] $RemoteDest
    )
    Write-Plan "scp `"$LocalPath`" ${SshTarget}:$RemoteDest"
    if ($WhatIf) {
        Write-Host "  (skipped scp - WhatIf)"
        return
    }
    if (-not (Test-Path -LiteralPath $LocalPath)) {
        throw "Missing local file: $LocalPath"
    }
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & scp -o BatchMode=yes -o ConnectTimeout=20 $LocalPath "${SshTarget}:$RemoteDest"
    $ec = $LASTEXITCODE
    $ErrorActionPreference = $prevEap
    if ($ec -ne 0) {
        throw "scp failed (exit $ec): $LocalPath -> $RemoteDest"
    }
}

function Send-TarDir {
    param(
        [Parameter(Mandatory = $true)]
        [string] $LocalDir,
        [Parameter(Mandatory = $true)]
        [string] $RemoteDest,
        [switch] $AtomicSwap
    )
    if (-not (Test-Path -LiteralPath $LocalDir)) {
        throw "Missing local directory: $LocalDir"
    }

    $stamp = Get-Date -Format "yyyyMMddHHmmss"
    $tmpName = "vcms-upload-$stamp-$([Guid]::NewGuid().ToString('N').Substring(0,8)).tgz"
    $localTgz = Join-Path $env:TEMP $tmpName
    $remoteTgz = "/tmp/$tmpName"

    Write-Plan "tar -czf $tmpName <- $LocalDir"
    if ($WhatIf) {
        Write-Host "  (skipped tar/scp/extract - WhatIf) -> $RemoteDest"
        return
    }

    if (Test-Path -LiteralPath $localTgz) { Remove-Item -Force -LiteralPath $localTgz }
    & tar -czf $localTgz -C $LocalDir .
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path -LiteralPath $localTgz)) {
        throw "tar create failed for $LocalDir"
    }

    try {
        Send-ScpFile -LocalPath $localTgz -RemoteDest $remoteTgz

        if ($AtomicSwap) {
            $remoteTmp = ($RemoteDest.TrimEnd("/") + "_tmp")
            Invoke-Remote -RemoteCmd "rm -rf $remoteTmp && mkdir -p $remoteTmp && tar -xzf $remoteTgz -C $remoteTmp && rm -f $remoteTgz && rm -rf $RemoteDest && mv $remoteTmp $RemoteDest"
        }
        else {
            Invoke-Remote -RemoteCmd "mkdir -p $RemoteDest && tar -xzf $remoteTgz -C $RemoteDest && rm -f $remoteTgz"
        }
    }
    finally {
        if (Test-Path -LiteralPath $localTgz) { Remove-Item -Force -LiteralPath $localTgz -ErrorAction SilentlyContinue }
    }
}

# 0. Sync Context (Senior Edition)
Write-Plan "node tools/vcms-sync-context.js"
if ($WhatIf) {
    Write-Host "  (skipped sync - WhatIf)"
} else {
    node tools/vcms-sync-context.js
}

if (-not $SkipBuild) {
    Write-Plan "npm run docs:build"
    if ($WhatIf) {
        Write-Host "  (skipped - WhatIf)"
    }
    else {
        npm run docs:build
    }
}

foreach ($f in $requiredRootFiles) {
    $p = Join-Path $RepoRoot $f
    if (-not (Test-Path $p)) {
        throw "Missing required file: $p"
    }
}

if (-not (Test-Path $distLocal)) {
    throw "Missing dist directory: $distLocal - run 'npm run docs:build' or remove -SkipBuild."
}

# Tip + dist integrity manifest (SoT tip↔VPS)
$gitTip = (git -C $RepoRoot rev-parse HEAD).Trim()
$gitTipShort = (git -C $RepoRoot rev-parse --short HEAD).Trim()
$probeRel = @(
    "index.html",
    "study\coi-commander-ops-handbook.html",
    "study\surfaces-map.html",
    "assets\style.9GXyv41r.css"
)
# Prefer real hashed CSS if style.* exists
$css = Get-ChildItem (Join-Path $distLocal "assets") -Filter "style.*.css" -File -ErrorAction SilentlyContinue | Select-Object -First 1
$hashLines = New-Object System.Collections.Generic.List[string]
$hashLines.Add("git=$gitTip")
$hashLines.Add("git_short=$gitTipShort")
$hashLines.Add("built_at=$(Get-Date -Format 'o')")
$hashLines.Add("host=$env:COMPUTERNAME")
$probeFiles = @("index.html", "study/coi-commander-ops-handbook.html", "study/surfaces-map.html")
if ($css) { $probeFiles += ("assets/" + $css.Name) }
foreach ($rel in $probeFiles) {
    $fp = Join-Path $distLocal ($rel -replace "/", [IO.Path]::DirectorySeparatorChar)
    if (-not (Test-Path -LiteralPath $fp)) {
        Write-Host "REVISION probe missing (skip): $rel" -ForegroundColor Yellow
        continue
    }
    $sha = (Get-FileHash -LiteralPath $fp -Algorithm SHA256).Hash.ToLowerInvariant()
    $hashLines.Add("sha256:$rel=$sha")
}
$revisionPath = Join-Path $RepoRoot "REVISION"
# Pure LF bytes — avoid CRLF mismatch vs Linux cat
$revBody = (($hashLines -join "`n") + "`n")
[IO.File]::WriteAllText($revisionPath, $revBody, [Text.UTF8Encoding]::new($false))
Write-Plan "Wrote REVISION tip=$gitTipShort probes=$($probeFiles.Count)"
if (-not (Test-Path -LiteralPath $revisionPath)) {
    throw "Failed to write REVISION"
}

$indexFile = Join-Path $distLocal "index.html"
if (-not (Test-Path $indexFile)) {
    throw "Build Error: docs/.vitepress/dist/index.html does not exist. Build might have failed."
}
if ((Get-Item $indexFile).Length -lt 1kb) {
    throw "Build Error: index.html in dist is suspiciously small (< 1KB). Check docs build."
}
if ((Get-ChildItem $distLocal -Recurse | Measure-Object -Property Length -Sum).Sum -lt 100kb) {
    throw "Build Error: The entire dist folder is too small (< 100KB). Build likely failed."
}

$remoteRoot = $RemotePath.TrimEnd("/")
$remoteDist = "$remoteRoot/docs/.vitepress/dist"
$logDir = "/var/www/vcms/logs"
$localCtx = Join-Path $RepoRoot "deploy-context"
$remoteCtxFinal = "$remoteRoot/deploy-context"
$ts = Get-Date -Format "yyyyMMdd-HHmmss"

# 1. Prep remote dirs + backup dist (no `[` test — PowerShell expands brackets)
Invoke-Remote -RemoteCmd "mkdir -p $remoteDist $logDir $remoteRoot/docs/.vitepress $remoteRoot/docs/ecosystem"
Invoke-Remote -RemoteCmd "test -f $remoteDist/index.html && cp -a $remoteDist ${remoteDist}.bak.$ts || true"

# 2. Root files (single-file scp) + REVISION tip manifest
foreach ($f in ($requiredRootFiles + @("REVISION"))) {
    $local = Join-Path $RepoRoot $f
    Send-ScpFile -LocalPath $local -RemoteDest "$remoteRoot/"
}

# 3. App directories via tar
foreach ($d in $tarDirectories) {
    $local = Join-Path $RepoRoot $d
    if (-not (Test-Path -LiteralPath $local)) {
        throw "Missing required directory: $local"
    }
    Send-TarDir -LocalDir $local -RemoteDest "$remoteRoot/$d"
}

# 4. Docs dist via tar (overwrite into place)
Send-TarDir -LocalDir $distLocal -RemoteDest $remoteDist

# 5. deploy-context atomic swap via tar
if (-not (Test-Path -LiteralPath $localCtx)) {
    throw "Missing deploy-context: $localCtx"
}
Send-TarDir -LocalDir $localCtx -RemoteDest $remoteCtxFinal -AtomicSwap

# 6. conflicts.md (optional)
$conflictsLocal = Join-Path $RepoRoot "docs\ecosystem\conflicts.md"
if (Test-Path $conflictsLocal) {
    $remoteEco = "$remoteRoot/docs/ecosystem"
    Invoke-Remote -RemoteCmd "mkdir -p $remoteEco"
    Send-ScpFile -LocalPath $conflictsLocal -RemoteDest "$remoteEco/conflicts.md"
}

# 7. Deps + reload
Invoke-Remote -RemoteCmd "cd $remoteRoot && npm ci --omit=dev && pm2 reload ecosystem.config.js --update-env"

# 8. Health + docs smoke
Write-Plan "Post-Deploy Health Check: curl http://127.0.0.1:8001/health"
if ($WhatIf) {
    Write-Host "  (skipped health - WhatIf)"
}
else {
    Write-Host "Waiting for service to stabilize..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $health = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -sf http://127.0.0.1:8001/health"
    $healthEc = $LASTEXITCODE
    $hb = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/coi-commander-ops-handbook"
    $si = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/surfaces-map"
    $si2 = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/study-index"
    $ErrorActionPreference = $prevEap
    if ($healthEc -ne 0 -or $health -notmatch '"status":"OK"') {
        Write-Host "Health Check: FAILED! Output: $health" -ForegroundColor Red
        throw "Health check failed after deploy. Check: pm2 logs vcms-core"
    }
    Write-Host "Health Check: PASSED ($health)" -ForegroundColor Green
    Write-Host "Docs smoke: handbook=$hb surfaces-map=$si study-index=$si2" -ForegroundColor Gray
    if ($hb -ne "200" -or $si -ne "200") {
        throw "Docs smoke failed (handbook=$hb surfaces-map=$si). Expected 200/200."
    }
    Write-Host "Docs smoke: PASSED" -ForegroundColor Green

    # Tip↔dist integrity vs local REVISION
    Write-Plan "Verify remote REVISION + dist SHA256"
    $prevEap = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $remoteRev = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "cat $remoteRoot/REVISION"
    $revEc = $LASTEXITCODE
    $ErrorActionPreference = $prevEap
    if ($revEc -ne 0 -or -not $remoteRev) {
        throw "Remote REVISION missing after deploy"
    }
    $localRev = ([IO.File]::ReadAllText($revisionPath) -replace "`r`n", "`n" -replace "`r", "`n").Trim()
    $remoteRevText = (($remoteRev | Out-String) -replace "`r`n", "`n" -replace "`r", "`n").Trim()
    if ($remoteRevText -ne $localRev) {
        Write-Host "LOCAL REVISION:`n$localRev" -ForegroundColor Yellow
        Write-Host "REMOTE REVISION:`n$remoteRevText" -ForegroundColor Yellow
        throw "REVISION mismatch local vs remote"
    }
    foreach ($line in ($localRev -split "`n")) {
        if ($line -notmatch '^sha256:(.+)=([a-f0-9]{64})$') { continue }
        $rel = $Matches[1]
        $want = $Matches[2]
        $ErrorActionPreference = "Continue"
        $got = & ssh -n -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "sha256sum `"$remoteDist/$rel`" | cut -d' ' -f1"
        $ErrorActionPreference = $prevEap
        $got = ($got | Out-String).Trim().ToLowerInvariant()
        if ($got -ne $want) {
            throw "Checksum mismatch $rel want=$want got=$got"
        }
        Write-Host "Checksum OK: $rel" -ForegroundColor Green
    }
    Write-Host "Integrity: PASSED tip=$gitTipShort" -ForegroundColor Green
}

Write-Host "Deploy-VPS: complete tip=$gitTipShort" -ForegroundColor Green

if ($WhatIf) {
    Write-Host "Running in -WhatIf mode - no changes made." -ForegroundColor Yellow
}
