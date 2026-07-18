# PLAN NAPRAWCZY — VCMS-DEPLOY-FIX-01

**Date:** 2026-07-18  
**Gate:** `VCMS-DEPLOY-FIX-01` (NEW)  
**Repo:** `flex-vcms`  
**Trigger:** `Deploy-VPS.ps1` zawisł po `docs:build` podczas GO OPS-GUIDE (handbook LIVE tylko przez tarball-workaround)  
**Priority:** high — bez naprawy każdy kolejny Deploy-VPS na Windows jest loterią

---

## 0) Diagnoza (root cause)

### Objaw
- Sync + VitePress build: **OK** (~4s)
- Pierwszy `ssh … mkdir`: **hang** (brak outputu >10 min), exit dopiero po kill
- Workaround: lokalny `tar.gz` + `scp` + extract + `pm2 reload` → handbook **200** LIVE

### Przyczyna (Windows OpenSSH + PowerShell quoting)

Skrypt buduje:

```powershell
$sshMkdir = "mkdir -p `"$remoteDist`"; mkdir -p `"$logDir`""
ssh $SshTarget $sshMkdir
```

Log `[Plan]` pokazał zniekształcone cudzysłowy:

```text
ssh root@… "mkdir -p "/var/www/vcms/current/docs/.vitepress/dist"; …
```

Skutek: zła składnia remote shell / zawieszone oczekiwanie.  
Dodatkowo: `scp -r` całych drzew (`public`, `src`, `tools`, `deploy-context`) jest wolne i kruche na Win→Linux.

### Stan AS-IS vs TO-BE

| Warstwa | AS-IS (po workaround) | TO-BE |
|---------|------------------------|--------|
| Docs `dist` | LIVE (tarball) | LIVE via naprawiony skrypt |
| `deploy-context` | LIVE (atomic swap ręczny) | LIVE via skrypt |
| Root (`server.js`, lockfile) + `npm ci` | **nie odświeżone** w ostatnim GO | Jedna pełna ścieżka po FIX |
| `Deploy-VPS.ps1` | zawodny na Windows | deterministic: ssh helper + tar |

**PARK (bez zmian):** Gate D, Mollie, mint/recover, OS↔jadzia merge.

---

## 1) Cel naprawczy (DoD)

1. `Deploy-VPS.ps1` kończy się w ≤15 min na Windows z `cyberfolks_key` / `~/.ssh/config`.
2. Zero hang na pierwszym SSH.
3. Transfer `dist` + `deploy-context` przez **tarball** (nie `scp -r *`).
4. Post-check: health OK + handbook HTTP 200 + study-index 200.
5. Runbook zaktualizowany (jedna komenda GO).
6. Handoff PROOF w `docs/handoffs/`.

---

## 2) Pipeline (1-1-1 — jedna sesja implement)

```text
F0  Register gate + ten PLAN          ← DONE (ten plik)
F1  /implement Deploy-VPS.ps1 FIX     ← NEXT
F2  WhatIf + dry SSH smoke (mkdir)
F3  GO pełny Deploy-VPS (jedna próba)
F4  PROOF handoff + todo close
```

### F1 — Zmiany w `scripts/Deploy-VPS.ps1`

1. **Helper `Invoke-Remote`**
   - `ssh -o BatchMode=yes -o ConnectTimeout=20 $SshTarget $RemoteCmd`
   - Komenda jako **jedna** argument string bez zagnieżdżonych `"` w ścieżkach (użyj single-quote po stronie remote albo bez spacji problematycznych).
   - Prefer: `ssh $SshTarget -- mkdir -p $remoteDist $logDir` (OpenSSH `--`).

2. **Helper `Send-TarDir`**
   - Lokalnie: `tar -czf $tmp.tgz -C $LocalDir .`
   - `scp` jeden plik → `/tmp/vcms-*.tgz`
   - Remote: `mkdir -p DEST && tar -xzf … -C DEST && rm tgz`
   - Użyć dla: `docs/.vitepress/dist`, `deploy-context` (tmp→atomic mv), opcjonalnie `public`/`src`/`tools` jeśli nadal potrzebne.

3. **Timeouts / progress**
   - `ConnectTimeout=20`, fail-fast jeśli SSH nie wraca.
   - Log każdej fazy z timestampem.

4. **Nie zmieniać** RemotePath default `/var/www/vcms/current`, health URL `:8001/health`.

### F2 — Weryfikacja lokalna (przed GO)

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115' -WhatIf
# + smoke:
ssh root@185.243.54.115 -- mkdir -p /tmp/vcms-deploy-smoke && echo OK
```

### F3 — GO deploy (pełny)

```powershell
.\scripts\Deploy-VPS.ps1 -SshTarget 'root@185.243.54.115'
```

Checks:

| Check | Pass |
|-------|------|
| Script exit 0 | tak |
| `curl :8001/health` | `"status":"OK"` |
| handbook | 200 |
| study-index | 200 |
| Context Health | nie MISSING |

### F4 — Closeout

- `docs/handoffs/2026-07-18-vcms-deploy-fix-01-PROOF.md`
- `docs/reference/vcms-vps-runbook.md` — sekcja „Windows: tar deploy”
- `flex-vcms-todo.json` — gate completed

---

## 3) Rollback

Jeśli F3 psuje PM2:

```bash
cd /var/www/vcms/current
pm2 logs vcms-core --lines 80
# przywróć poprzedni dist z backupu jeśli zrobiony; lub git checkout poprzedniego artefaktu lokalnego + re-tar
pm2 reload ecosystem.config.js
```

Przed F3: opcjonalnie `cp -a docs/.vitepress/dist docs/.vitepress/dist.bak.$TS` na VPS.

---

## 4) Estymata

| Faza | Czas |
|------|------|
| F1 implement | 30–45 min |
| F2 smoke | 10 min |
| F3 GO | 10–15 min |
| F4 proof | 10 min |

**Razem:** ≤1 sesja agenta + jedno GO Dowódcy (lub GO w tej samej sesji jeśli już dane).

---

## 5) Decyzja (no-ask)

**Ścieżka:** naprawić `Deploy-VPS.ps1` (ssh helper + tar), potem **jeden** pełny GO deploy — nie zostawiać workaroundu jako SoT.

```text
PLAN_ANCHOR: docs/handoffs/2026-07-18-vcms-deploy-fix-01-PLAN.md
BACKLOG_ID: VCMS-DEPLOY-FIX-01
RECOMMENDED_NEXT: /implement
WHY_NEXT: Root cause znany; handbook LIVE, skrypt nadal broken
```
