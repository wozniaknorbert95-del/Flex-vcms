# VCMS
Stage 1 Skeleton

## Quickstart (Phase 3)

- **Start here**: `docs/core/quickstart.md`
- **Verify (local)**:

```powershell
Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
node tools\vcms-scan.js
```

Expected: `Conflicts: 0` and refreshed artifacts in `docs/ecosystem/*` + `data/vcms-index.json`.

## Contributing (PR-only)

- **No direct pushes to `master`**: use branch → PR → review → merge.
- **PR body**: include `## Summary` and `## Test plan` (even if `N/A` for docs-only).
- **Gate evidence** (Phase 3): if you touch orchestration workflow, attach evidence via a handoff in `docs/handoffs/`.
