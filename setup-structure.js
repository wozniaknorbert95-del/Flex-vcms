const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'docs');
const scriptsDir = path.join(__dirname, 'scripts');

[
  'agents', 'playbooks', 'checklists', 'reference', 'templates', 'journal', 'lab', 'study', 'archive'
].forEach(dir => fs.mkdirSync(path.join(baseDir, dir), { recursive: true }));

fs.mkdirSync(scriptsDir, { recursive: true });

const files = {
  'agents/antigravity.md': '---\ntitle: "Agent Antigravity"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'agents/gemini-cli.md': '---\ntitle: "Agent Gemini CLI"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'agents/notebooklm-roadmap.md': '---\ntitle: "NotebookLM Roadmap"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'playbooks/feature-loop.md': '---\ntitle: "Feature Loop"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'playbooks/patch-only-surgery.md': '---\ntitle: "Patch-Only Surgery"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'playbooks/manual-release.md': '---\ntitle: "Manual Release"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'checklists/prep-deploy.md': '---\ntitle: "Prep Deploy Checklist"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'checklists/pre-commit.md': '---\ntitle: "Pre-Commit Checklist"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'checklists/verification.md': '---\ntitle: "Verification Checklist"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'reference/anti-patterns.md': '---\ntitle: "Anti-Patterns"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'reference/prompt-formulas.md': '---\ntitle: "Prompt Formulas"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  'reference/glossary.md': '---\ntitle: "Glossary"\n---\n\n> Zostanie uzupełnione w trakcie pracy wg wytycznych z pliku planu.',
  
  'agents/agent-boundaries.md': '---\ntitle: "Agent Boundaries"\n---\n\n# Izolacja Agenta\nTwarda definicja gdzie kończy się wola Antigravity, a zaczyna wsparcie KODA. Zawsze traktuj Antigravity lub Gemini CLI jako egzekutorów technologii (Backend, Wdrażanie systemów plików). Z kolei wsparcie Kody na PWA używaj do planowania mentalnego.',
  'reference/tags-and-statuses.md': '---\ntitle: "Tagi i Statusy"\n---\n\n# System Flagowania\nKażdy projekt w tytule powinien określać swój stan życia:\n- `[STABLE]` - kod gotowy na produkcję.\n- `[WORKING]` - kod wdrożeniowy w fazie iteracji.\n- `[EXPERIMENTAL]` - prace w katalogu Lab, niewpływające na rdzeń.\n- `[ARCHIVED]` - zamknięta sprawa / cmentarzysko kodu.',
  'reference/writing-standard.md': '---\ntitle: "Writing Standard"\n---\n\n# Konwencja Pisania dla Modeli i AI\nDokumentacja czytana przez NoteBookLM (M2M) opiera się o twarde wypunktowania i małe bloki danych. Omijaj metafory, buduj zbiory oparte o JSON-like lub listowanie.',
  
  'templates/tmpl-session-log.md': '---\ntitle: "Szablon: Dziennik Sesji"\n---\n\n# Session Log [RRRR-MM-DD]\n\n**Start:** \n**Koniec:** \n**Status:** `[WORKING]`\n\n## Cel Sesji\n\n## Przełomy / Blokady\n\n## Następne kroki',
  'templates/tmpl-incident.md': '---\ntitle: "Szablon: Incydent"\n---\n\n# Raport Incydentu [CODE]\n\n**Data Awarii:** \n**Poziom Ryzyka:** KRYTYCZNY / ŚREDNI\n\n## Symptomy\n(Co poszło nie tak?)\n\n## Diagnoza Root Cause\n(Dlaczego poszło nie tak?)\n\n## Wdrożone Środki Ochronne\n(Procedura naprawcza)',
  'templates/tmpl-playbook.md': '---\ntitle: "Szablon: Playbook"\n---\n\n# [Nazwa Procedury]\n\n**Decyzja wejścia (Trigger):** Kiedy sięgamy po ten dokument?\n\n## 1. Faza Przygotowawcza\n- \n- \n\n## 2. Faza Wykonawcza (Krok po Kroku)\n1. \n2. ',
  'templates/tmpl-weekly-review.md': '---\ntitle: "Szablon: Weekly Review"\n---\n\n# Tygodniowy Raport Bojowy (Week X)\n\n**Skupienie Główne:** \n\n## Zrealizowane Sprinty\n- \n\n## Wąskie Gardła do eliminacji w Week Y\n- ',
  
  'journal/logs-index.md': '---\ntitle: "Logs Index"\n---\n\n# Dziennik Operacyjny\nWszystkie wygenerowane przez skrypty logi ułożą się w tym archiwum systemowym.',
  'lab/lab-index.md': '---\ntitle: "Lab Index"\n---\n\n# Zespół Rozwojowy (Laboratorium)\nMiejsce odseparowanej piaskownicy na testy i skrypty niegotowe.',
  'study/study-index.md': '---\ntitle: "Study Index"\n---\n\n# Architektura Wiedzy\nObszar zrzutu wiedzy ogólnej na temat systemów.',
  'archive/archive-index.md': '---\ntitle: "Archive Index"\n---\n\n# Cmentarzysko Kodu i Praw\nWskazane do usunięcia pliki trafiające w niebyt, które mają zapisaną wartość sentymentalną lub strukturyzującą AI.'
};

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, file), content);
}

const startCockpit = `Set-Location -Path $PSScriptRoot\\..
npm run docs:dev
`;

const newLog = `param (
    [string]$Type = "session"
)
$dateStr = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$templatePath = "$PSScriptRoot\\..\\docs\\templates\\tmpl-$Type.md"
$destPath = "$PSScriptRoot\\..\\docs\\journal\\_log_$dateStr.md"

if (Test-Path $templatePath) {
    Copy-Item -Path $templatePath -Destination $destPath
    code $destPath
} else {
    Write-Host "Template for $Type not found! Available options: session, incident, playbook, weekly-review"
}
`;

fs.writeFileSync(path.join(scriptsDir, 'Start-Cockpit.ps1'), startCockpit);
fs.writeFileSync(path.join(scriptsDir, 'New-Log.ps1'), newLog);

console.log("Struktura PWA Placeholder/Template/Script Gotowa.");
