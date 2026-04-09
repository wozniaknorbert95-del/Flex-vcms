/* eslint-disable no-console */
/**
 * Flex VCMS — Local-first scanner (read-only)
 *
 * Generates:
 * - data/vcms-index.json (file inventory + hashes)
 * - docs/ecosystem/conflicts.md (conflict report)
 * - docs/ecosystem/map.md (ecosystem map + canonical pointers)
 *
 * Run (PowerShell):
 *   Set-Location "C:\Users\FlexGrafik\Desktop\flex-vcms"
 *   node tools/vcms-scan.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const VCMS_ROOT = path.resolve(__dirname, "..");
const REPOS_YAML = path.join(VCMS_ROOT, "repos.yaml");
const RULES_JSON = path.join(VCMS_ROOT, "scan-rules.json");

const OUT_INDEX = path.join(VCMS_ROOT, "data", "vcms-index.json");
const OUT_CONFLICTS = path.join(VCMS_ROOT, "docs", "ecosystem", "conflicts.md");
const OUT_MAP = path.join(VCMS_ROOT, "docs", "ecosystem", "map.md");
const OUT_REPO_PAGES_DIR = path.join(VCMS_ROOT, "docs", "ecosystem", "repos");

function readText(p) {
  return fs.readFileSync(p, "utf8");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function sha256File(p) {
  const h = crypto.createHash("sha256");
  const fd = fs.openSync(p, "r");
  try {
    const buf = Buffer.alloc(1024 * 128);
    while (true) {
      const n = fs.readSync(fd, buf, 0, buf.length, null);
      if (!n) break;
      h.update(buf.subarray(0, n));
    }
    return h.digest("hex");
  } finally {
    fs.closeSync(fd);
  }
}

function safeStat(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

function listDirFiles(dirPath) {
  const st = safeStat(dirPath);
  if (!st || !st.isDirectory()) return [];
  const out = [];
  for (const name of fs.readdirSync(dirPath)) {
    out.push(path.join(dirPath, name));
  }
  return out;
}

/**
 * Minimal YAML parser for this repo schema:
 * - top-level keys: version, updated, root, repos
 * - repos is an array of objects (2-space indentation)
 * - supports nested objects of one level (canonical_* / deploy_notes / post_deploy array)
 */
function parseReposYaml(yamlText) {
  const lines = yamlText
    .split(/\r?\n/)
    .map((l) => l.replace(/\t/g, "  "))
    .filter((l) => !l.trim().startsWith("#"));

  const doc = {};
  let i = 0;

  function parseScalar(v) {
    const t = v.trim();
    if (t === "true") return true;
    if (t === "false") return false;
    if (/^\".*\"$/.test(t)) return t.slice(1, -1);
    return t;
  }

  function indentOf(l) {
    const m = l.match(/^ */);
    return m ? m[0].length : 0;
  }

  function parseKeyVal(l) {
    const idx = l.indexOf(":");
    if (idx === -1) return null;
    const key = l.slice(0, idx).trim();
    const rest = l.slice(idx + 1);
    return { key, rest };
  }

  // Parse simple top-level + repos array
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const kv = parseKeyVal(line);
    if (!kv) {
      i++;
      continue;
    }
    if (kv.key === "repos") {
      doc.repos = [];
      i++;
      // array entries start with "  - "
      while (i < lines.length) {
        const l = lines[i];
        if (!l.trim()) {
          i++;
          continue;
        }
        const ind = indentOf(l);
        if (ind === 0) break; // end of repos
        if (l.trim().startsWith("- ")) {
          const obj = {};
          // consume this item
          // line is like: "  - name: "x""
          const first = l.trim().slice(2);
          const firstKv = parseKeyVal(first);
          if (firstKv) obj[firstKv.key] = parseScalar(firstKv.rest);
          i++;
          // parse subsequent lines until next "- " at same indent or end
          while (i < lines.length) {
            const l2 = lines[i];
            if (!l2.trim()) {
              i++;
              continue;
            }
            const ind2 = indentOf(l2);
            if (ind2 === ind && l2.trim().startsWith("- ")) break;
            if (ind2 < ind) break;

            const trimmed = l2.trim();
            const kv2 = parseKeyVal(trimmed);
            if (!kv2) {
              i++;
              continue;
            }

            // Nested object: key: (empty rest)
            if (kv2.rest.trim() === "") {
              const parentKey = kv2.key;
              // arrays: post_deploy:
              if (parentKey === "post_deploy") {
                obj.deploy_notes = obj.deploy_notes || {};
                obj.deploy_notes.post_deploy = [];
                i++;
                while (i < lines.length) {
                  const l3 = lines[i];
                  if (!l3.trim()) {
                    i++;
                    continue;
                  }
                  const ind3 = indentOf(l3);
                  if (ind3 <= ind2) break;
                  const tr3 = l3.trim();
                  if (tr3.startsWith("- ")) {
                    obj.deploy_notes.post_deploy.push(parseScalar(tr3.slice(2)));
                  }
                  i++;
                }
                continue;
              }

              // generic nested object block (one level)
              const nested = {};
              i++;
              while (i < lines.length) {
                const l3 = lines[i];
                if (!l3.trim()) {
                  i++;
                  continue;
                }
                const ind3 = indentOf(l3);
                if (ind3 <= ind2) break;
                const kv3 = parseKeyVal(l3.trim());
                if (kv3) nested[kv3.key] = parseScalar(kv3.rest);
                i++;
              }
              obj[parentKey] = nested;
              continue;
            }

            // Simple scalar
            obj[kv2.key] = parseScalar(kv2.rest);
            i++;
          }
          doc.repos.push(obj);
          continue;
        }
        i++;
      }
      continue;
    }

    doc[kv.key] = parseScalar(kv.rest);
    i++;
  }

  // Normalize deploy_notes nesting (because parser treats nested blocks as obj[key]=nested)
  for (const r of doc.repos || []) {
    // If deploy_notes exists from YAML nested block, keep it; else build from flat keys
    if (r.deploy_notes && typeof r.deploy_notes === "object") continue;
    r.deploy_notes = { manual_only: true };
  }

  return doc;
}

function loadConfig() {
  const rules = JSON.parse(readText(RULES_JSON));
  const reposDoc = parseReposYaml(readText(REPOS_YAML));
  return { rules, reposDoc };
}

function isDeniedByRules(rel, rules) {
  const lower = rel.toLowerCase();
  for (const needle of rules.denylist.paths_contains) {
    if (lower.includes(String(needle).toLowerCase())) return true;
  }
  for (const ext of rules.denylist.extensions) {
    if (lower.endsWith(ext.toLowerCase())) return true;
  }
  const base = path.basename(rel).toLowerCase();
  for (const fn of rules.denylist.file_names) {
    if (base === String(fn).toLowerCase()) return true;
  }
  return false;
}

function classifyFile(rel) {
  const base = path.basename(rel).toLowerCase();
  if (base === "ag" || base === "agents.md") return "AGENTS";
  if (base === "todo.json") return "TODO";
  if (base === "audit-todo.json") return "AUDIT_TODO";
  if (base === "master-brain.md") return "BRAIN";
  if (base === "brain.md" || base === "brain.md") return "BRAIN";
  if (rel.toLowerCase().includes("handoffs")) return "HANDOFF";
  if (rel.toLowerCase().includes(".cursor\\rules") || rel.toLowerCase().includes(".cursor/rules")) return "CURSOR_RULE";
  if (rel.toLowerCase().includes("global-rules.md")) return "GLOBAL_RULES";
  if (rel.toLowerCase().includes("workflow-manual.md")) return "WORKFLOW_MANUAL";
  if (rel.toLowerCase().includes("master-plan.md")) return "MASTER_PLAN";
  return "DOC";
}

function collectRepoFiles(repoAbs, rules) {
  const files = [];

  const addIfFile = (absPath) => {
    const st = safeStat(absPath);
    if (!st || !st.isFile()) return;
    const rel = path.relative(repoAbs, absPath);
    if (isDeniedByRules(rel, rules)) return;
    if (st.size > rules.whitelist.max_file_bytes) return;
    files.push({ abs: absPath, rel });
  };

  // root files
  for (const f of rules.whitelist.root_files) {
    addIfFile(path.join(repoAbs, f));
  }

  // known paths (limited)
  for (const p of rules.whitelist.paths) {
    const abs = path.join(repoAbs, p);
    const st = safeStat(abs);
    if (!st) continue;
    const relBase = path.relative(repoAbs, abs);
    if (isDeniedByRules(relBase, rules)) continue;

    if (st.isFile()) addIfFile(abs);
    if (st.isDirectory()) {
      // one-level deep enumeration, with safe recursion for handoffs and cursor rules
      const names = fs.readdirSync(abs);
      for (const name of names) {
        const child = path.join(abs, name);
        const stc = safeStat(child);
        if (!stc) continue;
        const rel = path.relative(repoAbs, child);
        if (isDeniedByRules(rel, rules)) continue;
        if (stc.isFile()) {
          const ext = path.extname(child).toLowerCase();
          if (rules.whitelist.extensions.includes(ext)) addIfFile(child);
        } else if (stc.isDirectory()) {
          // only recurse into docs/handoffs/* and .cursor/rules/*
          const relLower = rel.toLowerCase().replace(/\\/g, "/");
          const allowDeep =
            relLower.startsWith("docs/handoffs/") ||
            relLower.startsWith(".cursor/rules/") ||
            relLower.startsWith("system/audit/");
          if (!allowDeep) continue;
          for (const grand of listDirFiles(child)) {
            const stg = safeStat(grand);
            if (!stg || !stg.isFile()) continue;
            const relg = path.relative(repoAbs, grand);
            if (isDeniedByRules(relg, rules)) continue;
            const ext = path.extname(grand).toLowerCase();
            if (!rules.whitelist.extensions.includes(ext)) continue;
            addIfFile(grand);
          }
        }
      }
    }
  }

  // de-dup by rel
  const seen = new Set();
  return files.filter((f) => {
    const key = f.rel.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildIndex(reposDoc, rules) {
  const index = {
    meta: {
      generated_at: new Date().toISOString(),
      vcms_root: VCMS_ROOT,
      rules_version: rules.version,
      repos_version: reposDoc.version || null,
    },
    repos: [],
  };

  for (const repo of reposDoc.repos) {
    const repoAbs = repo.path;
    const st = safeStat(repoAbs);
    const repoEntry = {
      name: repo.name,
      type: repo.type,
      path: repoAbs,
      exists: !!st,
      files: [],
      warnings: [],
      canonical: {
        brain: repo.canonical_brain ? repo.canonical_brain.path : null,
        todo: repo.canonical_todo ? repo.canonical_todo.path : null,
      },
    };

    if (!st || !st.isDirectory()) {
      repoEntry.warnings.push({ code: "MISSING_REPO", detail: "Directory not found" });
      index.repos.push(repoEntry);
      continue;
    }

    const files = collectRepoFiles(repoAbs, rules);
    for (const f of files) {
      const stf = fs.statSync(f.abs);
      repoEntry.files.push({
        rel: f.rel.replace(/\\/g, "/"),
        type: classifyFile(f.rel),
        bytes: stf.size,
        mtime: stf.mtime.toISOString(),
        sha256: sha256File(f.abs),
      });
    }

    index.repos.push(repoEntry);
  }

  return index;
}

function detectConflicts(index) {
  const out = [];

  for (const repo of index.repos) {
    if (!repo.exists) continue;

    const todos = repo.files.filter((f) => f.type === "TODO" || f.type === "AUDIT_TODO");
    const brains = repo.files.filter((f) => f.type === "BRAIN");
    const handoffs = repo.files.filter((f) => f.type === "HANDOFF");
    const guardrails = repo.files.filter((f) => f.type === "AGENTS" || f.type === "CURSOR_RULE");
    const handoffsDirExists = safeStat(path.join(repo.path, "docs", "handoffs"))?.isDirectory() || false;

    // Duplicate TODO candidates: any todo.json outside archive is a candidate
    const todoCandidates = repo.files.filter((f) => f.rel.toLowerCase().endsWith("todo.json"));
    const todoNonArchive = todoCandidates.filter((f) => !f.rel.toLowerCase().includes("/archive/") && !f.rel.toLowerCase().includes("_legacy"));
    if (todoNonArchive.length > 1) {
      out.push({
        repo: repo.name,
        code: "DUPLICATE_TODO",
        detail: todoNonArchive.map((t) => t.rel),
        recommend: `Keep ONE canonical todo (prefer ${repo.canonical.todo || "todo.json"}) and archive/rename the rest.`,
      });
    }

    if (brains.length > 1) {
      out.push({
        repo: repo.name,
        code: "DUPLICATE_BRAIN",
        detail: brains.map((b) => b.rel),
        recommend: `Keep ONE canonical brain (prefer ${repo.canonical.brain || "brain.md"}) and archive/rename the rest.`,
      });
    }

    if (handoffs.length === 0 && !handoffsDirExists) {
      out.push({
        repo: repo.name,
        code: "MISSING_HANDOFFS",
        detail: [],
        recommend: "Create docs/handoffs/ and adopt a consistent handoff template (Phase 1).",
      });
    }

    if (guardrails.length === 0) {
      out.push({
        repo: repo.name,
        code: "MISSING_GUARDRAILS",
        detail: [],
        recommend: "Add AGENTS.md and/or .cursor/rules/*.mdc with module-specific guardrails (Phase 1).",
      });
    }

    // Missing canonical pointers
    if (repo.canonical.todo && !todos.some((t) => t.rel === repo.canonical.todo)) {
      out.push({
        repo: repo.name,
        code: "CANONICAL_TODO_MISSING",
        detail: [repo.canonical.todo],
        recommend: "Either create the canonical file, or update repos.yaml to point to the real one.",
      });
    }
    if (repo.canonical.brain && !repo.files.some((t) => t.rel === repo.canonical.brain)) {
      out.push({
        repo: repo.name,
        code: "CANONICAL_BRAIN_MISSING",
        detail: [repo.canonical.brain],
        recommend: "Either create the canonical file, or update repos.yaml to point to the real one.",
      });
    }
  }

  return out;
}

function writeJson(p, obj) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), "utf8");
}

function slugifyRepoName(name) {
  const base = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return base || "repo";
}

function buildRepoSlugs(index) {
  const used = new Map(); // baseSlug -> count
  const slugByName = new Map(); // repo.name -> slug
  for (const repo of index.repos) {
    const base = slugifyRepoName(repo.name);
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    const slug = n === 1 ? base : `${base}-${n}`;
    slugByName.set(repo.name, slug);
  }
  return slugByName;
}

function latestHandoff(repo) {
  const handoffs = repo.files.filter((f) => f.type === "HANDOFF");
  if (handoffs.length === 0) return null;
  let best = handoffs[0];
  let bestT = Date.parse(best.mtime) || 0;
  for (let i = 1; i < handoffs.length; i++) {
    const t = Date.parse(handoffs[i].mtime) || 0;
    if (t > bestT) {
      best = handoffs[i];
      bestT = t;
    }
  }
  return best;
}

function repoHasFile(repo, rel) {
  const needle = String(rel || "").replace(/\\/g, "/");
  return repo.files.some((f) => f.rel === needle);
}

function stableUpdatedAt(index) {
  let best = 0;
  for (const repo of index.repos || []) {
    for (const f of repo.files || []) {
      const t = Date.parse(f.mtime) || 0;
      if (t > best) best = t;
    }
  }
  if (!best) return index.meta.generated_at;
  return new Date(best).toISOString();
}

function writeRepoPages(index) {
  const when = stableUpdatedAt(index);
  const slugByName = buildRepoSlugs(index);

  ensureDir(OUT_REPO_PAGES_DIR);

  for (const repo of index.repos) {
    const slug = slugByName.get(repo.name) || slugifyRepoName(repo.name);
    const outPath = path.join(OUT_REPO_PAGES_DIR, `${slug}.md`);

    const canonicalBrain = repo.canonical.brain || null;
    const canonicalTodo = repo.canonical.todo || null;

    const guardrails = repo.files.some((f) => f.type === "AGENTS" || f.type === "CURSOR_RULE");
    const handoffsDirExists = safeStat(path.join(repo.path, "docs", "handoffs"))?.isDirectory() || false;
    const hasHandoffFiles = repo.files.some((f) => f.type === "HANDOFF");
    const handoffsReady = hasHandoffFiles || handoffsDirExists;

    const last = latestHandoff(repo);

    const warnings = [];
    for (const w of repo.warnings || []) warnings.push(w.code);
    if (canonicalBrain && !repoHasFile(repo, canonicalBrain)) warnings.push("CANONICAL_BRAIN_MISSING");
    if (canonicalTodo && !repoHasFile(repo, canonicalTodo)) warnings.push("CANONICAL_TODO_MISSING");
    if (!guardrails) warnings.push("MISSING_GUARDRAILS");
    if (!handoffsReady) warnings.push("MISSING_HANDOFFS");

    const uniqueWarnings = [...new Set(warnings)];

    const agents = repo.files.filter((f) => f.type === "AGENTS").map((f) => f.rel);
    const cursorRules = repo.files.filter((f) => f.type === "CURSOR_RULE").map((f) => f.rel);
    const handoffFiles = repo.files
      .filter((f) => f.type === "HANDOFF")
      .sort((a, b) => (Date.parse(b.mtime) || 0) - (Date.parse(a.mtime) || 0))
      .slice(0, 3)
      .map((f) => `${f.rel} (${f.mtime})`);

    const lines = [];
    lines.push("---");
    lines.push('status: "[DRAFT]"');
    lines.push(`title: "Repo: ${repo.name}"`);
    lines.push(`updated: "${when}"`);
    // Machine-readable contract (PH3-008)
    lines.push(`repo_name: "${repo.name}"`);
    lines.push(`repo_slug: "${slug}"`);
    lines.push(`repo_type: ${repo.type ? `"${repo.type}"` : "null"}`);
    lines.push(`repo_path: "${repo.path}"`);
    lines.push(`repo_exists: ${repo.exists ? "true" : "false"}`);
    lines.push(`canonical_brain: ${canonicalBrain ? `"${canonicalBrain}"` : "null"}`);
    lines.push(`canonical_todo: ${canonicalTodo ? `"${canonicalTodo}"` : "null"}`);
    lines.push(`guardrails_present: ${guardrails ? "true" : "false"}`);
    lines.push(`handoffs_ready: ${handoffsReady ? "true" : "false"}`);
    lines.push(`last_handoff_rel: ${last ? `"${last.rel}"` : "null"}`);
    lines.push(`last_handoff_mtime: ${last ? `"${last.mtime}"` : "null"}`);
    lines.push(`warnings: [${uniqueWarnings.map((w) => `"${w}"`).join(", ")}]`);
    lines.push(`links_agents: [${agents.map((p) => `"${p}"`).join(", ")}]`);
    lines.push(`links_cursor_rules: [${cursorRules.map((p) => `"${p}"`).join(", ")}]`);
    lines.push(`links_recent_handoffs: [${handoffFiles.map((p) => `"${p}"`).join(", ")}]`);
    lines.push("---");
    lines.push("");
    lines.push(`## ${repo.name}`);
    lines.push("");
    lines.push("- **Type**: " + (repo.type || "—"));
    lines.push("- **Path**: `" + repo.path + "`");
    lines.push("- **Exists**: " + (repo.exists ? "yes" : "no"));
    lines.push("");
    lines.push("## Canonical pointers (truth)");
    lines.push("");
    lines.push("- **Canonical brain**: " + (canonicalBrain ? `\`${canonicalBrain}\`` : "—"));
    lines.push("- **Canonical todo**: " + (canonicalTodo ? `\`${canonicalTodo}\`` : "—"));
    lines.push("");
    lines.push("## Status");
    lines.push("");
    lines.push("- **Guardrails present**: " + (guardrails ? "yes" : "no"));
    lines.push("- **Handoffs ready**: " + (handoffsReady ? "yes" : "no"));
    lines.push("- **Last handoff**: " + (last ? `\`${last.rel}\` (${last.mtime})` : "—"));
    lines.push("");
    lines.push("## Quick links (by file type)");
    lines.push("");
    lines.push("- **AGENTS**:");
    if (agents.length) for (const p of agents) lines.push(`  - \`${p}\``);
    else lines.push("  - —");
    lines.push("- **Cursor rules**:");
    if (cursorRules.length) for (const p of cursorRules) lines.push(`  - \`${p}\``);
    else lines.push("  - —");
    lines.push("- **Recent handoffs (up to 3)**:");
    if (handoffFiles.length) for (const p of handoffFiles) lines.push(`  - \`${p}\``);
    else lines.push("  - —");
    lines.push("");
    if (uniqueWarnings.length) {
      lines.push("## Warnings");
      lines.push("");
      for (const w of uniqueWarnings) lines.push(`- **${w}**`);
      lines.push("");
    }
    lines.push("## Back");
    lines.push("");
    lines.push("- [Ecosystem map](../map)");
    lines.push("");

    fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  }
}

function writeConflictsMd(conflicts, index) {
  const when = stableUpdatedAt(index);
  const lines = [];
  lines.push("---");
  lines.push('status: "[DRAFT]"');
  lines.push('title: "Ecosystem Conflicts — VCMS Scanner Report"');
  lines.push(`updated: "${when}"`);
  lines.push("---");
  lines.push("");
  lines.push("## Summary");
  lines.push(`Generated at: \`${when}\``);
  lines.push(`Repos scanned: **${index.repos.length}**`);
  lines.push(`Conflicts found: **${conflicts.length}**`);
  lines.push("");

  const byRepo = new Map();
  for (const c of conflicts) {
    if (!byRepo.has(c.repo)) byRepo.set(c.repo, []);
    byRepo.get(c.repo).push(c);
  }

  for (const repo of index.repos) {
    lines.push(`## ${repo.name}`);
    if (!repo.exists) {
      lines.push("- **MISSING_REPO**: folder not found");
      lines.push("");
      continue;
    }
    const list = byRepo.get(repo.name) || [];
    if (list.length === 0) {
      lines.push("- ✅ No conflicts detected.");
      lines.push("");
      continue;
    }
    for (const c of list) {
      lines.push(`- **${c.code}**`);
      if (c.detail && c.detail.length) {
        for (const d of c.detail) lines.push(`  - \`${d}\``);
      }
      if (c.recommend) lines.push(`  - **recommendation**: ${c.recommend}`);
    }
    lines.push("");
  }

  ensureDir(path.dirname(OUT_CONFLICTS));
  fs.writeFileSync(OUT_CONFLICTS, lines.join("\n"), "utf8");
}

function writeMapMd(index) {
  const when = stableUpdatedAt(index);
  const slugByName = buildRepoSlugs(index);
  const lines = [];
  lines.push("---");
  lines.push('status: "[DRAFT]"');
  lines.push('title: "FlexGrafik Ecosystem Map (Local-First)"');
  lines.push(`updated: "${when}"`);
  lines.push("---");
  lines.push("");
  lines.push("## System diagram");
  lines.push("");
  lines.push("```mermaid");
  lines.push("flowchart LR");
  lines.push("  Meta[flexgrafik-meta] -->|rules_workflow| VCMS[flex-vcms]");
  lines.push("  Meta -->|strategy| Wizard[zzpackage.flexgrafik.nl]");
  lines.push("  Meta -->|strategy| Jadzia[jadzia-core]");
  lines.push("  Meta -->|strategy| Game[app.flexgrafik.nl]");
  lines.push("  Meta -->|strategy| Portal[flexgrafik-nl]");
  lines.push("  Wizard <--> Jadzia");
  lines.push("  Game --> Jadzia");
  lines.push("  Portal --> Wizard");
  lines.push("  Portal --> Game");
  lines.push("```");
  lines.push("");

  lines.push("## Where is the truth (canonical pointers)");
  lines.push("");
  lines.push("| Repo | Repo page | Canonical brain | Canonical todo | Guardrails | Handoffs |");
  lines.push("|------|----------|------------------|----------------|------------|----------|");

  for (const repo of index.repos) {
    const slug = slugByName.get(repo.name) || slugifyRepoName(repo.name);
    const repoPage = `[open](./repos/${slug})`;
    const guard = repo.files.some((f) => f.type === "AGENTS" || f.type === "CURSOR_RULE") ? "yes" : "no";
    const handoffsDirExists = safeStat(path.join(repo.path, "docs", "handoffs"))?.isDirectory() || false;
    const handoffs = repo.files.some((f) => f.type === "HANDOFF") || handoffsDirExists ? "yes" : "no";
    const brain = repo.canonical.brain ? `\`${repo.canonical.brain}\`` : "—";
    const todo = repo.canonical.todo ? `\`${repo.canonical.todo}\`` : "—";
    lines.push(`| ${repo.name} | ${repoPage} | ${brain} | ${todo} | ${guard} | ${handoffs} |`);
  }

  lines.push("");
  lines.push("## Notes");
  lines.push("- This map is generated by `node tools/vcms-scan.js`.");
  lines.push("- Phase 0 goal is to eliminate ambiguity: one canonical brain/todo per repo.");
  lines.push("- `archive/` is intentionally ignored by the scanner (legacy does not participate in conflict detection).");
  lines.push("");

  ensureDir(path.dirname(OUT_MAP));
  fs.writeFileSync(OUT_MAP, lines.join("\n"), "utf8");
}

function main() {
  const { rules, reposDoc } = loadConfig();
  const index = buildIndex(reposDoc, rules);
  const conflicts = detectConflicts(index);

  writeJson(OUT_INDEX, index);
  writeConflictsMd(conflicts, index);
  writeMapMd(index);
  writeRepoPages(index);

  console.log("VCMS scan complete.");
  console.log(" -", path.relative(VCMS_ROOT, OUT_INDEX));
  console.log(" -", path.relative(VCMS_ROOT, OUT_CONFLICTS));
  console.log(" -", path.relative(VCMS_ROOT, OUT_MAP));
  console.log(" -", path.relative(VCMS_ROOT, OUT_REPO_PAGES_DIR) + path.sep + "*.md");
  console.log("Conflicts:", conflicts.length);
}

main();

