---
status: "[STABLE]"
title: "PH4-011 / smoke prod — przyklady curl (Basic Auth z env)"
updated: "2026-04-11"
---

# Smoke prod — przyklady `curl` (bez sekretow w repo)

Caly zestaw kontrolny jest w [vcms-prod-smoke](/checklists/vcms-prod-smoke). Tu: **jak** uderzyc endpointy z Basic Auth, nie wklejajac hasla do plikow.

## PowerShell (zalecane)

Ustaw zmienne **tylko w biezacej sesji** (nie commituj):

```powershell
$env:VCMS_BASE_URL = "https://cmd.flexgrafik.nl"   # dostosuj
$env:VCMS_BASIC_USER = "twoj-login"
$env:VCMS_BASIC_PASS = "twoje-haslo"

# /health (u Ciebie caly vhost moze byc za auth — patrz smoke checklist)
curl.exe -s -S -u "$($env:VCMS_BASIC_USER):$($env:VCMS_BASIC_PASS)" "$($env:VCMS_BASE_URL)/health"

# Strona glowna (naglowki)
curl.exe -s -S -o NUL -w "%{http_code}" -u "$($env:VCMS_BASIC_USER):$($env:VCMS_BASIC_PASS)" "$($env:VCMS_BASE_URL)/"

# GET /api/knowledge
curl.exe -s -S -u "$($env:VCMS_BASIC_USER):$($env:VCMS_BASIC_PASS)" "$($env:VCMS_BASE_URL)/api/knowledge"

# POST /api/chat — pusty body (oczekiwane 400 walidacji)
curl.exe -s -S -u "$($env:VCMS_BASIC_USER):$($env:VCMS_BASIC_PASS)" `
  -X POST "$($env:VCMS_BASE_URL)/api/chat" `
  -H "Content-Type: application/json" `
  -d ""
```

Po sesji:

```powershell
Remove-Item Env:VCMS_BASIC_USER, Env:VCMS_BASIC_PASS -ErrorAction SilentlyContinue
```

## Interpretacja

- Oczekiwania dokladnie jak w [vcms-prod-smoke](/checklists/vcms-prod-smoke) (200/400/500 swiadome; brak 502 „golego” Nginx).
- Jesli `curl` nie laczy sie w ogole — problem DNS/TLS/sieci, nie aplikacji.
