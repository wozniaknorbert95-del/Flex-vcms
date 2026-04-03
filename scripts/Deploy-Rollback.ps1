# Deploy-Rollback.ps1
# Uzyj tego, kiedy VCMS zlapie kolizje HTTP Error po wrzuceniu Deploy-VPS.

$ServerIP = "185.243.54.115"
$User = "root"
$BaseDir = "/var/www/vcms"

Write-Host "=== INCJOWANIE ROLLBACKU VCMS ===" -ForegroundColor Red

$Command = @"
cd $BaseDir/releases &&
LAST_TWO=\$(ls -dt * | head -n 2) &&
if [ \$(echo "\$LAST_TWO" | wc -w) -lt 2 ]; then
  echo "Brak odpowiedniej sterty plikow aby wykonac Rollback."
else
  PREV_RELEASE=\$(echo "\$LAST_TWO" | awk 'NR==2') &&
  echo "Wycofuje wpadke z produkcji. Namierzono bezpieczny stabilny punkt: \$PREV_RELEASE" &&
  rm -f $BaseDir/current &&
  ln -s $BaseDir/releases/\$PREV_RELEASE $BaseDir/current &&
  pm2 restart vcms-core &&
  echo "ROLLBACK WYKONANY."
fi
"@

ssh ${User}@${ServerIP} $Command

Write-Host "ZAKONCZONO PROCES. Sprawdz strone." -ForegroundColor Cyan
