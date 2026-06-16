<#
.SYNOPSIS
  PH4-016 Session A — VPS infra hardening (apply or verify-only).

.DESCRIPTION
  Apply mode: uploads and runs scripts/ph4-016-harden-vps.sh on the VPS.
  Verify mode: runs scripts/ph4-016-verify.sh remotely (no changes).

  Session A covers: F1 fail2ban, F4 nginx headers, F6 pm2-logrotate,
  F7 server_tokens, F13 TLS 1.2+, F14 remove port 8010.

.PARAMETER SshTarget
  SSH target, e.g. root@185.243.54.115

.PARAMETER VerifyOnly
  Skip hardening; only run verification script.

.PARAMETER WhatIf
  Print planned commands without executing.

.EXAMPLE
  .\scripts\Invoke-PH4-016-SessionA.ps1 -SshTarget root@185.243.54.115 -VerifyOnly

.EXAMPLE
  .\scripts\Invoke-PH4-016-SessionA.ps1 -SshTarget root@185.243.54.115
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string] $SshTarget,

    [switch] $VerifyOnly,
    [switch] $WhatIf
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$HardenScript = Join-Path $RepoRoot "scripts\ph4-016-harden-vps.sh"
$VerifyScript = Join-Path $RepoRoot "scripts\ph4-016-verify.sh"
$RemoteTmp = "/tmp/ph4-016"

function Invoke-Remote {
    param([string]$Command)
    Write-Host "[SSH] $Command" -ForegroundColor Cyan
    if ($WhatIf) { return }
    ssh $SshTarget $Command
    if ($LASTEXITCODE -ne 0) { throw "Remote command failed (exit $LASTEXITCODE)" }
}

function Send-Script {
    param([string]$LocalPath, [string]$RemoteName)
    Write-Host "[SCP] $LocalPath -> ${SshTarget}:${RemoteTmp}/${RemoteName}" -ForegroundColor Cyan
    if ($WhatIf) { return }
    Invoke-Remote "mkdir -p $RemoteTmp"
    scp $LocalPath "${SshTarget}:${RemoteTmp}/${RemoteName}"
}

if (-not $VerifyOnly) {
    if (-not (Test-Path $HardenScript)) { throw "Missing $HardenScript" }
    Send-Script -LocalPath $HardenScript -RemoteName "harden.sh"
    Invoke-Remote "chmod +x ${RemoteTmp}/harden.sh && bash ${RemoteTmp}/harden.sh"
}

if (-not (Test-Path $VerifyScript)) { throw "Missing $VerifyScript" }
Send-Script -LocalPath $VerifyScript -RemoteName "verify.sh"
Invoke-Remote "chmod +x ${RemoteTmp}/verify.sh && bash ${RemoteTmp}/verify.sh"

Write-Host ""
Write-Host "Session A complete. For F2/F3 with auth:" -ForegroundColor Green
Write-Host "  ssh $SshTarget `"VCMS_AUTH='user:pass' bash ${RemoteTmp}/verify.sh`"" -ForegroundColor Gray
