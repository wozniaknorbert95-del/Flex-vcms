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

function Write-Plan {
    param([string]$Line)
    Write-Host "[Plan] $Line" -ForegroundColor Cyan
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
        throw "Brak wymaganego pliku: $p"
    }
}

if (-not (Test-Path $distLocal)) {
    throw "Brak katalogu dist: $distLocal - uruchom npm run docs:build lub usun -SkipBuild."
}

$remoteDist = ($RemotePath.TrimEnd("/") + "/docs/.vitepress/dist")
$remoteVite = ($RemotePath.TrimEnd("/") + "/docs/.vitepress")
$logDir = "/var/www/vcms/logs"

$sshMkdir = "mkdir -p `"$remoteDist`" && mkdir -p `"$logDir`""
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

Write-Plan "scp -r dist -> ${SshTarget}:$remoteDist/"
if (-not $WhatIf) {
    scp -r "$distLocal\*" "${SshTarget}:$remoteDist/"
}

$remoteShell = "cd `"$RemotePath`" && npm ci --omit=dev && pm2 reload ecosystem.config.js --update-env"
Write-Plan "ssh $SshTarget `"$remoteShell`""
if (-not $WhatIf) {
    ssh $SshTarget $remoteShell
}

Write-Host "Deploy-VPS: zakonczono." -ForegroundColor Green
if ($WhatIf) {
    Write-Host "Uruchomiono w trybie -WhatIf - nic nie wykonano." -ForegroundColor Yellow
}
