<#
.SYNOPSIS
  Lokalny build VitePress, synchronizacja plików Node + dist na VPS, npm ci + PM2 reload.

.DESCRIPTION
  Brak haseł i kluczy w repozytorium — uwierzytelnianie przez ssh-agent, ~/.ssh/config lub interaktywne SSH.
  Katalog na serwerze musi być zgodny z ecosystem.config.js (domyślnie /var/www/vcms/current).
  Logi PM2: /var/www/vcms/logs (utwórz ręcznie przy pierwszym razie, jeśli brak).

  VCMS-DEPLOY-FIX-01: Invoke-Remote (BatchMode + ConnectTimeout) + Send-TarDir
  zamiast scp -r / zagnieżdżonych cudzysłowów PowerShell (Windows hang).

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
    & ssh -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "$RemoteCmd"
    if ($LASTEXITCODE -ne 0) {
        throw "Remote command failed (exit $LASTEXITCODE): $RemoteCmd"
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
    & scp -o BatchMode=yes -o ConnectTimeout=20 $LocalPath "${SshTarget}:$RemoteDest"
    if ($LASTEXITCODE -ne 0) {
        throw "scp failed (exit $LASTEXITCODE): $LocalPath -> $RemoteDest"
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

# 2. Root files (single-file scp)
foreach ($f in $requiredRootFiles) {
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
    $health = & ssh -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -sf http://127.0.0.1:8001/health"
    if ($LASTEXITCODE -ne 0 -or $health -notmatch '"status":"OK"') {
        Write-Host "Health Check: FAILED! Output: $health" -ForegroundColor Red
        throw "Health check failed after deploy. Check: pm2 logs vcms-core"
    }
    Write-Host "Health Check: PASSED ($health)" -ForegroundColor Green

    $hb = & ssh -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/coi-commander-ops-handbook"
    $si = & ssh -o BatchMode=yes -o ConnectTimeout=20 $SshTarget "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8001/docs/study/study-index"
    Write-Host "Docs smoke: handbook=$hb study-index=$si" -ForegroundColor Gray
    if ($hb -ne "200" -or $si -ne "200") {
        throw "Docs smoke failed (handbook=$hb study-index=$si). Expected 200/200."
    }
    Write-Host "Docs smoke: PASSED" -ForegroundColor Green
}

Write-Host "Deploy-VPS: complete." -ForegroundColor Green

if ($WhatIf) {
    Write-Host "Running in -WhatIf mode - no changes made." -ForegroundColor Yellow
}
