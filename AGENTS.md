# AGENTS — flex-vcms (Orchestrator)

**Repo:** lokalny orchestrator dokumentacji + skaner ekosystemu FlexGrafik.  
**Canonical backlog:** `flex-vcms-todo.json` (root `todo.json` = wyłącznie wskaźnik).

## Obowiązki agentów w tym repozytorium

- Trzymać się **SSoT** w `docs/core/*` i [security policy](docs/core/security-policy.md): brak `.env`, brak deployu na prod z poziomu agenta.
- **Read-only** wobec modułów spoza tego workspace (skaner tylko czyta ścieżki z `repos.yaml`).
- Zmiany w `docs/ecosystem/*` i `data/vcms-index.json` wynikają z `node tools/vcms-scan.js` — commituj tylko gdy skan jest świadomy i `Conflicts: 0`. Pełna tabela kroków: [Workflow Manual — Rytm orchestratora](docs/core/workflow-manual.md#rytm-orchestratora).

## Granice

- Nie edytować `.cursor/plans/*` (plany IDE).
- PR-only workflow; bez pushy na `main` bez review.

## Kontekst startowy

- [Quickstart](docs/core/quickstart.md)  
- [Workflow manual](docs/core/workflow-manual.md)  
- [Assistant workflow contract](docs/core/assistant-workflow-contract.md)
