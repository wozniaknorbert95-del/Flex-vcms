#!/usr/bin/env node
/**
 * PH4-012: po zmianie repos.yaml / scan-rules.json / tools/vcms-scan.js
 * uruchamia skan i wymaga, żeby artefakty były zsynchronizowane z HEAD (brak zmian w working tree).
 */
const path = require("path");
const { execSync, spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const TRIGGER_FILES = ["repos.yaml", "scan-rules.json", "tools/vcms-scan.js"];
const ARTIFACT_PREFIXES = ["data/vcms-index.json", "docs/ecosystem/"];

function norm(p) {
  return String(p || "").replace(/\\/g, "/").trim();
}

function git(args, opts = {}) {
  return execSync(["git", ...args].join(" "), {
    cwd: REPO_ROOT,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    ...opts,
  });
}

function isTriggerPath(rel) {
  const n = norm(rel);
  if (!n) return false;
  return TRIGGER_FILES.some((t) => n === t || n.endsWith("/" + t));
}

function listChangedPaths() {
  const out = [];
  for (const cmd of [["diff", "--name-only"], ["diff", "--cached", "--name-only"]]) {
    try {
      const s = git(cmd).trim();
      if (s) out.push(...s.split(/\r?\n/).filter(Boolean));
    } catch {
      /* ignore */
    }
  }
  return [...new Set(out.map(norm))];
}

function main() {
  try {
    git(["rev-parse", "--git-dir"], { stdio: "pipe" });
  } catch {
    console.error("verify:scan: to nie jest repozytorium git lub brak polecenia git.");
    process.exit(1);
  }

  const changed = listChangedPaths();
  const triggered = changed.some(isTriggerPath);

  if (!triggered) {
    console.log("verify:scan: skip (brak zmian w rejestrze/skanerze względem ostatniego commita / indeksu).");
    process.exit(0);
  }

  const scan = spawnSync(process.execPath, [path.join(REPO_ROOT, "tools", "vcms-scan.js")], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: false,
  });

  if (scan.status !== 0) {
    process.exit(scan.status ?? 1);
  }

  let dirty = "";
  try {
    dirty = git(["status", "--porcelain", "--", ...ARTIFACT_PREFIXES]).trim();
  } catch (e) {
    console.error("verify:scan: nie udało się sprawdzić git status artefaktów:", e.message);
    process.exit(1);
  }

  if (dirty) {
    console.error(
      "verify:scan: FAIL — po skanie są niezcommitowane zmiany w data/vcms-index.json lub docs/ecosystem/.\n" +
        "Zcommituj wygenerowane artefakty albo cofnij zmiany w repos.yaml / scan-rules.json / tools/vcms-scan.js.\n" +
        "---\n" +
        dirty +
        "\n---"
    );
    process.exit(1);
  }

  console.log("verify:scan: OK — artefakty skanu są zsynchronizowane z repozytorium.");
  process.exit(0);
}

main();
