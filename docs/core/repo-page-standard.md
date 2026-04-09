---
status: "[STABLE]"
title: "Repo Page Standard — Machine-readable Derived Pages (PH3-008)"
updated: "2026-04-09"
---

# Repo Page Standard — Machine-readable Derived Pages (PH3-008)

Ten dokument jest kanonicznym standardem dla `docs/ecosystem/repos/*.md` w Orchestratorze `flex-vcms`.
Repo pages są jednocześnie:\n
- szybkim “snapshotem” dla człowieka\n
- kontraktem danych dla Orchestratora (parsowalny frontmatter)

---

## Classification (SSoT vs Derived)

- Repo pages (`docs/ecosystem/repos/*.md`) są **Derived**.\n
  Generuje je wyłącznie `node tools/vcms-scan.js`.\n
- Nie edytujemy ich ręcznie — ręczne zmiany zostaną nadpisane przy OP-001.

## Zależności (SSoT)

- Gates: [phase-3-verification.md](/checklists/phase-3-verification) (Gate 4)\n
- Ops: [orchestration-commands.md](/core/orchestration-commands) (OP-001)\n
- Artifacts: [artifacts-standard.md](/core/artifacts-standard)

---

## Required headings (human-readable contract)

Repo page musi zawierać poniższe nagłówki w tej kolejności:\n
\n
1) `## <repo_name>`\n
2) `## Canonical pointers (truth)`\n
3) `## Status`\n
4) `## Quick links (by file type)`\n
5) `## Warnings` (tylko jeśli istnieją warnings)\n
6) `## Back`\n
\n
Wymagania Gate 4 spełniają sekcje:\n
- Canonical pointers (truth)\n
- Status\n
- Quick links (by file type)

---

## Required frontmatter keys (machine-readable contract)

Frontmatter jest YAML i jest **stabilnym kontraktem** (klucze stałe, proste typy).\n
\n
### 1) Meta (jak dziś + rozszerzenie)\n
\n
- `status`: string (np. `[DRAFT]`)\n
- `title`: string (`Repo: <repo_name>`)\n
- `updated`: string ISO (wartość z `stableUpdatedAt(index)`) — nie “czas uruchomienia”\n
\n
### 2) Repo identity\n
\n
- `repo_name`: string\n
- `repo_slug`: string\n
- `repo_type`: string|null\n
- `repo_path`: string (absolute path; evidence)\n
- `repo_exists`: boolean\n
\n
### 3) Canonical pointers\n
\n
- `canonical_brain`: string|null\n
- `canonical_todo`: string|null\n
\n
### 4) Readiness / status\n
\n
- `guardrails_present`: boolean\n
- `handoffs_ready`: boolean\n
- `last_handoff_rel`: string|null\n
- `last_handoff_mtime`: string|null (ISO)\n
\n
### 5) Warnings\n
\n
- `warnings`: string[] (może być puste)\n
\n
### 6) Quick links (optional, informative)\n
\n
Możemy dodać listy ścieżek (nie są gate-critical, ale pomagają):\n
\n
- `links_agents`: string[]\n
- `links_cursor_rules`: string[]\n
- `links_recent_handoffs`: string[] (max 3)\n
\n
Reguły:\n
- boolean w frontmatter: `true/false`\n
- w treści (body) bool wyświetlamy jako `yes/no` dla czytelności\n
- brak wartości “—” w frontmatter — zamiast tego `null` lub puste listy\n

