# PLAN AKTUALIZACJI SKILLI — Cursor + OpenCode

**Status:** SZKIC do sesji agentowej  
**Cel sesji:** Zaprojektowanie brakujących Cursor Skills + OpenCode agents dla całego ekosystemu  
**Metoda:** Senior Vibe Coding — uzycie skills.sh + agent teams  
**Uwaga:** To jest dokument wejściowy. Agent ma na jego podstawie zaproponować konkretne skille.

---

## 1. STAN OBECNY (GAP ANALYSIS)

### 1.1 Cursor — istniejące skille i workflowy

| Repo | Cursor Skills | Workflowy (.agents/workflows/) | Cursor Rules (.cursor/rules/) |
|------|--------------|-------------------------------|------------------------------|
| `flex-vcms` | **BRAK** | **BRAK** | **BRAK** |
| `zzpackage.flexgrafik.nl` | `vibe-init`, `handoff`, `deploy` | 19 plików (blast, audit-red-team, implement, verify, debug, context-reset, deploy-*, itd.) | 3 pliki (00-project-index, wizard-ssot, playwright-e2e) |
| `jadzia-core` | **BRAK** | **BRAK** | 1 plik (jadzia-core.mdc) |
| `app.flexgrafik.nl` | `game-workflow-engine`, `verifi` | 22 pliki (full pipeline) | 2 pliki (app-flexgrafik-game, app-flexgrafik-e2e) |
| `flexgrafik-nl` | `vibe-init`, `handoff`, `deploy`, `deploy-handoff`, `antigravity-deploy-handoff` | 1 plik (ag-deploy-description) | 1 plik (flexgrafik-portal.mdc) |
| `flexgrafik-meta` | **BRAK** | **BRAK** | **BRAK** |
| `agent-os` | **BRAK** | **BRAK** | **BRAK** |
| `agent-os-ui` | **BRAK** | **BRAK** | **BRAK** |

### 1.2 OpenCode — stan

**OpenCode ma ZERO skilli, ZERO agentów, ZERO slash commandów** w całym ekosystemie.

Global config (`~/.config/opencode/opencode.jsonc`) zawiera tylko:
- model, MCP (chrome-devtools), permisje
- instructions: `["AGENTS.md", "brain.md"]` (ale ładuje tylko CWD)

Projektowy `agent-os/opencode.json`:
- `{"lsp": true}` — zero konfiguracji dla workflow

---

## 2. ARCHITEKTURA DOCELOWA

### 2.1 Layered Skill Architecture

```
POZIOM 1 — GLOBALNE (flexgrafik-meta + flex-vcms)
  ├── Cursor Rules: global-rules.mdc, workflow-manual.mdc, master-plan.mdc
  ├── OpenCode: agents/flexgrafik-core.yaml
  └── Cel: Definiuja CORE workflow, read-only przez inne repo

POZIOM 2 — ORCHESTRATOR (flex-vcms)
  ├── Cursor Skills: vibe-init, blast, deploy-cf, audit-red-team, handoff, debug, context-reset, checkpoint
  ├── OpenCode: agents/vcms-orchestrator.yaml
  └── Cel: Obowiązkowe dla wszystkich repo (CORE workflow z PORADNIKA)

POZIOM 3 — REPO-SPECIFIC
  ├── Zalezy od typu repo (wp-shop / ai-core / game / portal / agent-orchestrator)
  └── Cursor Skills + OpenCode agents dedykowane dla danego modulu
```

### 2.2 Universal Slash Commands (CORE — kazde repo)

Z PORADNIKA UZYTKOWNIKA + workflow-manual:

| Komenda | Faza | Status |
|---------|------|--------|
| `/vibe-init` | F1-Plan | Istnieje w 2 repo jako Cursor Skill, brak jako OpenCode |
| `/blast` | F2-Design | Workflow istnieje w 2 repo, brak Cursor Skill, brak OpenCode |
| `/audit-red-team` | F4-Test | Workflow istnieje w 2 repo, brak Cursor Skill, brak OpenCode |
| `/deploy-cf` | F5-Launch | Wzmiankowany w dokumentacji, brak implementacji |
| `/deploy-wp` | F5-Launch | Workflow istnieje w 1 repo, brak Cursor Skill |
| `/debug` | F4-Test | Workflow istnieje w 2 repo, brak Cursor Skill |
| `/context-reset` | Recovery | Workflow istnieje w 2 repo, brak Cursor Skill |
| `/handoff` | F6-Iterate | Istnieje w 2 repo jako Cursor Skill, brak jako OpenCode |

### 2.3 Tool binding matrix (kto co uruchamia)

| Narzedzie | Główna rola | Skills | MCP | Workflowy |
|-----------|------------|--------|-----|-----------|
| **Cursor Pro** | IDE cockpit, kodowanie z kontekstem | `.cursor/skills/*/SKILL.md` | `.cursor/mcp.json` | `.agents/workflows/*.md` |
| **OpenCode** | CLI agent, CI/CD, złożone zadania | `~/.config/opencode/agents/*.yaml` | `opencode.jsonc` MCP | Wbudowane w agent |
| **Agent OS** | LangGraph pipeline | N/A (orchestruje OpenCode) | N/A | `src/graph.py` |

---

## 3. MASTER PROMPT DLA AGENTÓW (skills designers)

Poniższy prompt jest przeznaczony dla sesji agentowej, która zaprojektuje skille. Agent ma go wczytać jako primary directive.

---

```
# MASTER PROMPT — Skill Design Session

## TWOJA ROLA
Jesteś seniorem Vibe Coding architect. Twoim zadaniem jest zaprojektowanie brakujących Cursor Skills i OpenCode agents dla całego ekosystemu FlexGrafik (8 repo). Działasz w trybie "skills.sh" — generujesz gotowe pliki SKILL.md, agent YAML, i konfiguracje.

## KONTEKST EKOSYSTEMU

FlexGrafik to ekosystem 8 repozytoriów:
1. `flexgrafik-meta` — strategia, globalne zasady, workflow
2. `Flex-vcms/flex-vcms` — orchestrator, skaner, command center
3. `zzpackage.flexgrafik.nl` — Wizard sklep (WP/WooCommerce, cash engine)
4. `jadzia-core` — AI backend (Python/FastAPI, automatyzacja)
5. `app.flexgrafik.nl` — Gra advergame (Vite/React)
6. `flexgrafik-nl` — Portal marki (WP/custom theme)
7. `agent-os` — LangGraph orchestrator (Python, :8080)
8. `agent-os-ui` — Mission Control (Next.js, :3000)

## ARCHITEKTURA SKILLI

Trzy poziomy:
1. GLOBALNE — w flexgrafik-meta (reguły, constraints dla wszystkich)
2. CORE — w flex-vcms (obowiązkowe slash commands dla kazdego repo)
3. REPO-SCOPED — specyficzne dla danego modułu

## WYMAGANE SLASH COMMANDS (CORE)

Kazde repo musi mieć te komendy (universal workflow):
- `/vibe-init` — start sesji, klasyfikacja taska, routing
- `/blast` — BLAST framework (Background/Limitations/Actions/Success/Tests)
- `/audit-red-team` — security audit przed deployem
- `/deploy-cf` — deploy na Cyber-Folks (Zasada 11)
- `/deploy-wp` — deploy Wordpress
- `/debug` — 5-krokowa diagnostyka
- `/context-reset` — reset gdy agent sie gubi (>2 proby)
- `/handoff` — koniec sesji, state transfer

## CO MASZ ZAPROJEKTOWAĆ (konkretne artefakty)

### Dla CURSOR:

Dla kazdego repo (tam gdzie brakuje), wygeneruj:
1. `.cursor/skills/<name>/SKILL.md` dla kazdej brakujacej komendy frontmatter:
   ```yaml
   ---
   name: <slash-name>
   description: >-
     <2-3 zdania co i kiedy>
   disable-model-invocation: true
   ---
   ```
2. `.cursor/rules/<repo>-<scope>.mdc` dla guardrails specyficznych dla repo

### Dla OPENCODE:

1. Stwórz strukture `~/.config/opencode/`:
   - `agents/` — definicje agentów (YAML)
   - `skills/` — implementacje slash commandów
   - `config/` — zdalne reguły

2. `opencode.jsonc` rozszerz o:
   - agents (referencje do agent YAML)
   - MCP servers per-agent
   - Context packets (co ladowac dla kazdego repo)

3. Dla kazdego repo: `.opencode/agents.yaml` lub `opencode.json` z:
   - agents specyficzne dla modulu
   - instructions = ["AGENTS.md", "brain.md", ...]
   - skill bindings

## ZASADY PROJEKTOWANIA SKILLI (senior level)

1. **disable-model-invocation: true** dla skilli proceduralnych (blast, handoff, context-reset)
2. **Każdy skill ma:**
   - Goal (1 zdanie)
   - When to use (lista triggerów)
   - Canonical workflow (link do pliku workflow jeśli istnieje)
   - Input (co dostaje)
   - Agent procedure (lista krokow)
   - Do / Don't (hard constraints)
   - Output (blok do skopiowania, strukturalny)
   - Done when (definition of done)
3. **Routing** — kazdy skill konczy sie RECOMMENDED_NEXT
4. **Workflow istnieja w `.agents/workflows/`** — skill ma do nich linkowac, nie duplikowac
5. **Context minimalny** — skill ma ladowac tylko to co potrzebne (least privilege)

## KLASYFIKACJA REPO TYPOW

Przy projektowaniu skilli uwzglednij typ repo:
- **wp-shop** (zzpackage): deploy WP + WooCommerce, audit produktow, Wizard flow
- **ai-core** (jadzia): Python/FastAPI, migracje DB, testy pytest, restart serwisu
- **game** (app.flexgrafik.nl): Vite/React, 60fps, game mechanics, assets, build
- **portal** (flexgrafik-nl): WordPress, brand, content, menu, deploy
- **meta** (flexgrafik-meta): tylko dokumentacja, READ-ONLY, zero kodu
- **vcms-orchestrator** (flex-vcms): Node.js tools, skaner, SSoT, dokumentacja
- **agent-orchestrator** (agent-os): LangGraph, Python, API, checkpoints
- **agent-ui** (agent-os-ui): Next.js, Mission Control, dashboard

## WERYFIKACJA PROJEKTU

Po zaprojektowaniu kazdego skilla, odpowiedz:
1. Czy ten skill ma odpowiednik workflow file w `.agents/workflows/`?
2. Czy output skilla zawiera CURRENT_STAGE + RECOMMENDED_NEXT?
3. Czy Do/Don't sa jednoznaczne?
4. Czy routing do nastepnego skilla jest poprawny?
5. Czy uwzgledniono zasady globalne (Zasada 11, 1-1-1, handoff)?

## OUTPUT SESJI

Zwroc:
1. Dla kazdego repo: liste plików do utworzenia (sciezka + 1 zdanie opisu)
2. Dla kazdego nowego skilla: pelna tresc SKILL.md
3. Dla OpenCode: pelna konfiguracja (opencode.jsonc + agents YAML)
4. Ryzyka i zależności (np. "najpierw flex-vcms CORE zanim repo-specific")
5. Kolejnosc wdrozenia (co w Stage 1, co w Stage 2, ...)

---
```

---

## 4. PLAN PER-REPO (SCOPE OF WORK)

### STAGE 1 — Core Foundation (priorytet: najwyzszy)

#### A) `flexgrafik-meta` — Global rules & constraints
**Cursor:**
- `.cursor/rules/00-global-rules.mdc` — wskaznik do docs/core/global-rules.md
- `.cursor/rules/00-master-plan.mdc` — wskaznik do docs/core/master-plan.md
- `.cursor/rules/00-workflow-manual.mdc` — wskaznik do docs/core/workflow-manual.md
- `.cursor/rules/00-agents-hierarchy.mdc` — wskaznik do docs/core/agents.md

**OpenCode:**
- `.opencode/agents/strategist.yaml` — agent dla F1-Plan (czyta master-plan, global-rules)
- `.opencode/agents/planner.yaml` — agent dla F2-Design (blast, task decomposition)

#### B) `Flex-vcms/flex-vcms` — CORE workflow orchestrator
**Cursor Skills (8 sztuk — wszystkie brakujące):**
- `.cursor/skills/vibe-init/SKILL.md` — start sesji
- `.cursor/skills/blast/SKILL.md` — BLAST planning
- `.cursor/skills/audit-red-team/SKILL.md` — security audit
- `.cursor/skills/deploy-cf/SKILL.md` — deploy Cyber-Folks
- `.cursor/skills/deploy-wp/SKILL.md` — deploy WordPress
- `.cursor/skills/debug/SKILL.md` — diagnostyka
- `.cursor/skills/context-reset/SKILL.md` — reset agenta
- `.cursor/skills/handoff/SKILL.md` — koniec sesji
- `.cursor/skills/checkpoint/SKILL.md` — sesja checkpoint

**Cursor Rules:**
- `.cursor/rules/vcms-scan-rules.mdc` — zasady skanu
- `.cursor/rules/vcms-workflow-rules.mdc` — CORE workflow guardrails

**Workflow files (.agents/workflows/):**
- Utworzyc dla kazdej komendy (lub przeniesc z zzpackage do shared location)

**OpenCode:**
- `.opencode/agents/vcms-orchestrator.yaml` — glowny orchestrator agent
- `.opencode/skills/` — skills dla kazdej CORE komendy
- `opencode.json` — pelna konfiguracja dla VCMS workspace

---

### STAGE 2 — Repo-specific Skills (po CORE)

#### C) `zzpackage.flexgrafik.nl` — Wizard (Cash Engine)
**Cursor — rozszerzenie:**
- Już ma: `vibe-init`, `handoff`, `deploy`
- Brakuje Cursor Skills: `blast`, `audit-red-team`, `debug`, `context-reset`, `deploy-wp`
- Dodatkowe repo-specific: `wizard-audit`, `ssot-validate`, `woo-sync`

**OpenCode — od zera:**
- `.opencode/agents/wizard-builder.yaml` — builder dla Wizard JS/PHP
- `.opencode/agents/wizard-qa.yaml` — QA dla produktow i audytu

#### D) `jadzia-core` — AI Backend
**Cursor — od zera:**
- `.cursor/skills/vibe-init/SKILL.md`
- `.cursor/skills/blast/SKILL.md`
- `.cursor/skills/audit-red-team/SKILL.md`
- `.cursor/skills/debug/SKILL.md`
- `.cursor/skills/handoff/SKILL.md`
- `.cursor/skills/context-reset/SKILL.md`
- Repo-specific: `jadzia-migrate`, `jadzia-test`, `jadzia-deploy`

**Cursor Rules:**
- `.cursor/rules/jadzia-python.mdc` — Python/FastAPI standards
- `.cursor/rules/jadzia-db.mdc` — SQLite migracje

**OpenCode — od zera:**
- `.opencode/agents/jadzia-builder.yaml`
- `.opencode/agents/jadzia-tester.yaml`

#### E) `app.flexgrafik.nl` — Game
**Cursor — rozszerzenie:**
- Już ma: `game-workflow-engine`, `verifi`
- Brakuje dedykowanych Cursor Skills dla kazdego stage (teraz wszystko przez jeden engine skill)
- Opcja: rozbic na osobne skille lub pozostawic jeden engine skill (decyzja architektoniczna)

**OpenCode — od zera:**
- `.opencode/agents/game-builder.yaml`
- `.opencode/agents/game-tester.yaml`

#### F) `flexgrafik-nl` — Brand Portal
**Cursor — rozszerzenie:**
- Już ma: `vibe-init`, `handoff`, `deploy`, `deploy-handoff`, `antigravity-deploy-handoff`
- Brakuje: `blast`, `audit-red-team`, `debug`, `context-reset`
- Problem: ma 2 dodatkowe skille (deploy-handoff, antigravity) ktore nie sa w CORE — do konsolidacji

**OpenCode — od zera:**
- `.opencode/agents/portal-builder.yaml`

#### G) `agent-os` — LangGraph orchestrator
**Cursor — od zera:**
- `.cursor/skills/vibe-init/SKILL.md`
- `.cursor/skills/blast/SKILL.md`
- `.cursor/skills/handoff/SKILL.md`
- `.cursor/skills/debug/SKILL.md`
- Repo-specific: `agent-os-test`, `agent-os-deploy`

**OpenCode — od zera:**
- `.opencode/agents/agent-os-builder.yaml`
- Rozszerzyc istniejący `opencode.json` o skills i agents

#### H) `agent-os-ui` — Mission Control
**Cursor — od zera (lekki):**
- Tylko podstawowe CORE skille (jest lekko zależne od agent-os)
- `.cursor/rules/agent-os-ui-nextjs.mdc`

**OpenCode — od zera (minimal):**
- `.opencode/agents/ui-builder.yaml`

---

### STAGE 3 — OpenCode Global Config + Duplicate Cleanup

#### Global OpenCode config
- Rozszerzyc `~/.config/opencode/opencode.jsonc`:
  - Dodac globalne agents referencje
  - Zwiększyc context packets
  - Dodac MCP per-agent
- Utworzyc `~/.config/opencode/agents/` z:
  - `strategist.yaml` (czyta master-plan, global-rules)
  - `planner.yaml` (blast, task decomposition)
  - `executor.yaml` (builder, tester, deployer)

#### Duplicate cleanup
- `vibe-init` istnieje w zzpackage + flexgrafik-nl — zunifikowac
- `handoff` istnieje w zzpackage + flexgrafik-nl — zunifikowac
- `deploy` istnieje w zzpackage + flexgrafik-nl — zunifikowac
- Rozwiazanie: CORE skille w flex-vcms, kazde repo ma tylko override/extend

---

## 5. ZALEŻNOŚCI I RYZYKA

| Ryzyko | Impact | Mitigacja |
|--------|--------|-----------|
| Rozjazd wersji skilli miedzy repo | Medium | Unified CORE w flex-vcms, repo tylko extend |
| OpenCode nie wspiera skills YAML tak jak Cursor | High | Sprawdzic dokumentację OpenCode przed projektem |
| Zbyt duzo skilli = chaos | Medium | Trzymac sie minimum: CORE 8 komend + max 3 repo-specific |
| Workflow w `.agents/workflows/` a skill w `.cursor/skills/` sie rozjezdzaja | Medium | Skill ZAWSZE linkuje do workflow, nigdy nie duplikuje |
| Zmiana w OpenCode API (nowa wersja) | Medium | Monitorowac changelog opencode-ai |

## 6. KOLEJNOŚĆ WDROŻENIA

```
Stage 1: flexgrafik-meta rules → flex-vcms CORE skills + workflow
Stage 2: repo-specific (zzpackage → jadzia → app → flexgrafik-nl → agent-os → agent-os-ui)
Stage 3: OpenCode global config + cleanup duplikatów
```

---

*Koniec planu. Przekazac agentom jako input do sesji skill design.*

---

## STAGE 1 — DONE (2026-05-23)

- flexgrafik-meta: 4× pointer `.mdc` + OpenCode strategist/planner
- flex-vcms: 9× CORE skill + 9× workflow + 2× rule + OpenCode orchestrator + `opencode.json`
- Weryfikacja: [STAGE1-CORE-DONE.md](./STAGE1-CORE-DONE.md)
- Desktop sync: `cursor opencode skill optymalizacja/flex-vcms` + `flexgrafik-meta`

