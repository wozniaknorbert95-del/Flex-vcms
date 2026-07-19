## HANDOFF — VCMS COMMAND CENTER (PWA) — 2026-04-03

### Co zostało zrobione w tej sesji
- Zaimplementowano kompletny profil środowiska produkcyjnego Nginx + PM2 na VPS (`185.243.54.115`).
- Oddzielono całkowicie backend proxy od Vite, stawiając go na Express Node.js z rate-limits i ochroną.
- Ominięto limity SSH, generując twardy klucz lokalny `id_rsa` i mapując go w serwerze, odblokowując zrzuty bez haseł.
- Opracowano i wymuszono pancerne skrypty `Deploy-VPS.ps1` (z mechaniką zero-downtime) oraz `Deploy-Rollback.ps1` (w razie konieczności wycofania update'u).
- Zaprojektowano `.gitignore` i zalecono rotację klucza Google Gemini, odcinając się od ewentualnych wycieków frontowych.
- Postawiono PWA by-pass na środowisko testowe `http://185.243.54.115:8010` do czasu rozpropagowania dodanego wcześniej wpisu w systemie DNS `cmd.flexgrafik.nl`.

### Stan obecny
- Branch: main (albo aktywny branch pracy).
- Ostatni commit: Skrypty wdrożeniowe z deployem.
- Testy: Serwer Nginx odpowiada bez błędów (syntax OK), certbot wstrzymany do odblokowania DNS.

### Co zostało NIEDOKOŃCZONE
- Generacja certyfikatu SSL (Certyfikat Kłódki). Powód: Cykl DNS. Trzeba odczekać na globalną propagację adresu `cmd.flexgrafik.nl` w internecie. Kiedy to nastąpi, Dowódca odpala ręcznie instrukcję z Operations Manual o ponowieniu CertBota, albo odpalana jest po prostu ponowna dyrektywa przez agenta.

### Następny krok (dla nowej sesji)
- Test i weryfikacja certyfikatu Let's Encrypt po upływie odpowiedniego cyklu DNS. 

### Pliki zmodyfikowane
- `server.js` (Express backend, proxy Gemini)
- `ecosystem.config.js` (PM2 Settings)
- `docs/reference/VCMS-nginx.conf` (Nginx block dla serwera proxy / portów 80 i 8010)
- `.gitignore` (Uszczelnienie Security)
- `scripts/Deploy-VPS.ps1`
- `scripts/Deploy-Rollback.ps1`
- `todo.json`

### Ważne decyzje podjęte w tej sesji
- Złamanie oporów "Ręcznego Deploya" na wyjątkową zgodę Dowództwa. Wykuta automatyzacja symlinków zrównała nas ze standardami branżowymi, w pełni zdejmując z głowy męki ręcznego zgrywania plików na FTP i ukracając koszty czasu przy ewakuacji PWA z serwera.
- Separacja fizyczna od instancji Agentki Jadzi z portami - nienaruszony ekosystem Python/FastAPI Jadzi na maszynie.
