---
status: "[ACTIVE]"
title: "Deploy certainty C1 PROOF"
gate: "CERTAINTY-C1"
updated: "2026-07-19"
result: "PASS"
---

# Deploy certainty C1

| ID | Status | Detail |
|----|--------|--------|
| C1.0-build | PASS | npm run docs:build exit 0 |
| C1.1-pipe | PASS | exit 0 in 51.9s; Tee-Object OK |
| C1.2-nopipe | PASS | exit 0 in 47.2s |
| C1.3-revision | PASS | git=bb54cb3be07e45cc1e8c11b2fb21c135954c64b5 git_short=bb54cb3 |
| C1.4-local-smoke | PASS | hb=200 sm=200 |
| C1.4-public | PASS | cmd handbook HTTP 401 |

REVISION (remote):

```
git=bb54cb3be07e45cc1e8c11b2fb21c135954c64b5
git_short=bb54cb3
built_at=2026-07-19T07:02:04.9904337+02:00
host=DESKTOP-ECTP1JE
sha256:index.html=07a1ce31c0c5caa54a61d399daf14d82de4439d8f16df3c01a389da230e908c6
sha256:study/coi-commander-ops-handbook.html=0959b7d7ce3e798f79dbee9828d970710fa56546bbdb355123b0b024aa224325
sha256:study/surfaces-map.html=ef9d892f9176311cb5c44fd10e62ac0116b29bb1be374cd6a6728161508b2dae
sha256:assets/style.9GXyv41r.css=6884007709eff50490383e0e312ee2c45c38d4b78f6f73ee397e7bcf292b180d
```
