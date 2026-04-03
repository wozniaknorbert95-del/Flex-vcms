param(
    [string]$Type = "session-log"
)

Set-Location -Path "$PSScriptRoot\.."
$tmplPath = "docs/templates/tmpl-$Type.md"

if (-not (Test-Path $tmplPath)) {
    Write-Host "ERROR: Template '$tmplPath' not found!" -ForegroundColor Red
    exit 1
}

$date = Get-Date -Format "yyyy-MM-dd"
$time = Get-Date -Format "HHmm"
$content = Get-Content $tmplPath -Raw
$content = $content -replace "{{CURRENT_DATE}}", $date

$newFileName = "$date" + "_" + "$time" + "_" + "$Type.md"
$newFilePath = "docs/journal/$newFileName"

Set-Content -Path $newFilePath -Value $content -Encoding utf8
Write-Host "Created new log: $newFilePath" -ForegroundColor Green

# Try to open in VS Code
try {
    code $newFilePath
} catch {
    Write-Host "VS Code not found in PATH. Opening with default editor..."
    Invoke-Item $newFilePath
}
