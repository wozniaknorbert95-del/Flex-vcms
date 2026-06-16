# Stage 1 Verification — CORE Foundation

**Date:** 2026-05-23  
**Status:** DONE  
**Repos:** flexgrafik-meta, flex-vcms

## Artifact counts

| Repo | Item | Count |
|------|------|-------|
| flex-vcms | `.cursor/skills/` | 9 |
| flex-vcms | `.agents/workflows/` | 9 |
| flex-vcms | `.cursor/rules/` | 2 |
| flexgrafik-meta | `.cursor/rules/` | 4 |
| flex-vcms | OpenCode | orchestrator + 2 skill bindings |
| flexgrafik-meta | OpenCode | strategist + planner |

## Per-skill checklist (plan section 6)

| Skill | Workflow 1:1 | CURRENT_STAGE + NEXT | Do/Don't clear | Routing | Global rules |
|-------|--------------|----------------------|----------------|---------|--------------|
| vibe-init | yes | yes | yes | yes | scan + 1-1-1 |
| blast | yes | yes | yes | yes | anchor |
| audit-red-team | yes | yes | yes (no patch) | yes | global-rules check |
| debug | yes | yes | yes | yes | — |
| context-reset | yes | yes | yes | yes | handoff path |
| handoff | yes | yes | yes | yes | SESSIONANCHOR |
| deploy-cf | yes | yes | yes (Zasada 11) | yes | manual deploy |
| deploy-wp | yes | yes | yes (Zasada 11) | yes | manual deploy |
| checkpoint | yes | yes | yes | yes | 1 next step |

## Scan

```
node tools/vcms-scan.js → Conflicts: 0
```

(SQLite sync warning pre-existing — scan artifacts updated.)

## Smoke /vibe-init

Skill requires: `node tools/vcms-scan.js`, Conflicts gate, TASK_CLASSIFICATION router, RECOMMENDED_NEXT block — verified in `.cursor/skills/vibe-init/SKILL.md` + workflow.

## Desktop sync

Source of truth: `FlexGrafik\github\`  
Synced to: `Desktop\cursor opencode skill optymalizacja\flex-vcms` and `flexgrafik-meta`

## Next

Stage 2: repo-specific skills (zzpackage → jadzia → app → portal → agent-os → agent-os-ui).
