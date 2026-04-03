param (
    [string]$Type = "session"
)
$dateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$templatePath = "$PSScriptRoot\..\docs\templates\tmpl-$Type.md"
$destPath = "$PSScriptRoot\..\docs\journal\_log_$dateStr.md"

if (Test-Path $templatePath) {
    Copy-Item -Path $templatePath -Destination $destPath
    code $destPath
} else {
    Write-Host "Template for $Type not found! Available options: session, incident, playbook, weekly-review"
}
