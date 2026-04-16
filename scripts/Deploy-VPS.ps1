<#
.SYNOPSIS
  Lokalny build VitePress, synchronizacja plików Node + dist na VPS, npm ci + PM2 reload.

.DESCRIPTION
  Brak haseł i kluczy w repozytorium — uwierzytelnianie przez ssh-agent, ~/.ssh/config lub interaktywne SSH.
  Katalog na serwerze musi być zgodny z ecosystem.config.js (domyślnie /var/www/vcms/current).
  Logi PM2: /var/www/vcms/logs (utwórz ręcznie przy pierwszym razie, jeśli brak).

.PARAMETER SshTarget
  Cel SSH, np. root@cmd.example.com

.PARAMETER RemotePath
  Ścieżka cwd aplikacji na VPS (np. /var/www/vcms/current).

.PARAMETER SkipBuild
  Pomiń npm run docs:build (zakłada istniejący docs/.vitepress/dist).

.PARAMETER WhatIf
  Wypisz kroki i komendy bez wykonania build/scp/ssh.

.EXAMPLE
  .\scripts\Deploy-VPS.ps1 -SshTarget 'root@host' -WhatIf

.EXAMPLE
  .\scripts\Deploy-VPS.ps1 -SshTarget 'root@host'
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
$requiredRootFiles = @("server.js", "package.json", "package-lock.json", "ecosystem.config.js")
$requiredDirectories = @("public", "src", "deploy-context")

function Write-Plan {
    param([string]$Line)
    Write-Host "[Plan] $Line" -ForegroundColor Cyan
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

# Senior Pre-flight: Check if dist is actually built and not empty
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

$remoteDist = ($RemotePath.TrimEnd("/") + "/docs/.vitepress/dist")
$remoteVite = ($RemotePath.TrimEnd("/") + "/docs/.vitepress")
$logDir = "/var/www/vcms/logs"

$sshMkdir = "mkdir -p `"$remoteDist`"; mkdir -p `"$logDir`""
Write-Plan "ssh $SshTarget `"$sshMkdir`""
if (-not $WhatIf) {
    ssh $SshTarget $sshMkdir
}

foreach ($f in $requiredRootFiles) {
    $local = Join-Path $RepoRoot $f
    $dest = "$($RemotePath.TrimEnd("/"))/"
    Write-Plan "scp `"$local`" ${SshTarget}:$dest"
    if (-not $WhatIf) {
        scp $local "${SshTarget}:$dest"
    }
}

foreach ($d in $requiredDirectories) {
    if ($d -eq "deploy-context") { continue } # Obsłużymy to osobno na końcu dla atomowości
    $local = Join-Path $RepoRoot $d
    $dest = "$($RemotePath.TrimEnd("/"))/"
    Write-Plan "scp -r `"$local`" ${SshTarget}:$dest"
    if (-not $WhatIf) {
        scp -r $local "${SshTarget}:$dest"
    }
}

# --- Atomic Context Swap ---
$localCtx = Join-Path $RepoRoot "deploy-context"
$remoteCtxTmp = ($RemotePath.TrimEnd("/") + "/deploy-context_tmp")
$remoteCtxFinal = ($RemotePath.TrimEnd("/") + "/deploy-context")

Write-Plan "Atomic Swap: scp `deploy-context` -> $remoteCtxTmp"
if (-not $WhatIf) {
    # Clean tmp on remote first
    ssh $SshTarget "rm -rf `"$remoteCtxTmp`""
    scp -r $localCtx "${SshTarget}:$remoteCtxTmp"
}

Write-Plan "scp -r dist -> ${SshTarget}:$remoteDist/"
if (-not $WhatIf) {
    scp -r "$distLocal\*" "${SshTarget}:$remoteDist/"
}

$remoteShell = "cd `"$RemotePath`"; rm -rf `"$remoteCtxFinal`"; mv `"$remoteCtxTmp`" `"$remoteCtxFinal`"; npm ci --omit=dev; pm2 reload ecosystem.config.js --update-env"
Write-Plan "ssh $SshTarget `"$remoteShell`""
if (-not $WhatIf) {
    ssh $SshTarget $remoteShell
}

Write-Plan "Post-Deploy Health Check: curl -s http://127.0.0.1:8001/health"
if (-not $WhatIf) {
    Write-Host "Waiting for service to stabilize..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    $health = ssh $SshTarget "curl -s http://127.0.0.1:8001/health"
    if ($health -match '"status":"OK"') {
        Write-Host "Health Check: PASSED" -ForegroundColor Green
    } else {
        Write-Host "Health Check: FAILED! Output: $health" -ForegroundColor Red
        Write-Warning "Check PM2 logs on VPS: pm2 logs vcms"
    }
}

Write-Host "Deploy-VPS: complete." -ForegroundColor Green

if ($WhatIf) {
    Write-Host "Running in -WhatIf mode - no changes made." -ForegroundColor Yellow
}
