<#
.SYNOPSIS
  PH4-018 — Run weekly prod audit verification via SSH and optionally sync report to repo.

.PARAMETER SshTarget
  SSH target (default: root@185.243.54.115)

.PARAMETER SyncReport
  Copy latest report from VPS to docs/audits/latest-verification.md

.PARAMETER InstallCron
  Run install-weekly-audit-cron.sh on VPS (one-time setup)

.EXAMPLE
  .\scripts\Invoke-WeeklyAudit.ps1 -SyncReport
#>
[CmdletBinding()]
param(
    [string] $SshTarget = "root@185.243.54.115",
    [string] $RemotePath = "/var/www/vcms/current",
    [switch] $SyncReport,
    [switch] $InstallCron,
    [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$LocalAudits = Join-Path $RepoRoot "docs\audits"
$RemoteReport = "/var/log/vcms-audit/reports/latest-verification.md"

function Invoke-Step {
    param([string]$Label, [scriptblock]$Action)
    Write-Host "[Audit] $Label" -ForegroundColor Cyan
    if ($WhatIf) { return }
    & $Action
}

# Ensure scripts exist on VPS
foreach ($script in @("ph4-016-verify.sh", "weekly-audit-check.sh")) {
    $local = Join-Path $RepoRoot "scripts\$script"
    if (-not (Test-Path $local)) { throw "Missing $local" }
    Invoke-Step "Upload scripts/$script" {
        ssh $SshTarget "mkdir -p ${RemotePath}/scripts"
        scp $local "${SshTarget}:${RemotePath}/scripts/$script"
        ssh $SshTarget "chmod +x ${RemotePath}/scripts/$script"
    }
}

if ($InstallCron) {
    $install = Join-Path $RepoRoot "scripts\install-weekly-audit-cron.sh"
    Invoke-Step "Install cron on VPS" {
        scp $install "${SshTarget}:/tmp/install-weekly-audit-cron.sh"
        ssh $SshTarget "chmod +x /tmp/install-weekly-audit-cron.sh && VCMS_ROOT=$RemotePath bash /tmp/install-weekly-audit-cron.sh"
    }
    return
}

Invoke-Step "Run weekly-audit-check.sh" {
    ssh $SshTarget "VCMS_ROOT=$RemotePath bash ${RemotePath}/scripts/weekly-audit-check.sh"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Audit verification reported failures (exit $LASTEXITCODE)"
    }
}

if ($SyncReport) {
    Invoke-Step "Sync report to docs/audits/" {
        New-Item -ItemType Directory -Force -Path $LocalAudits | Out-Null
        $dated = Join-Path $LocalAudits "$(Get-Date -Format 'yyyy-MM-dd')-verification.md"
        scp "${SshTarget}:${RemoteReport}" $dated
        Copy-Item $dated (Join-Path $LocalAudits "latest-verification.md") -Force
        Write-Host "Synced: $dated" -ForegroundColor Green
    }
}
