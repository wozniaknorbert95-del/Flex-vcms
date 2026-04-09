import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "VCMS",
  description: "Visual Content Management System",
  appearance: 'dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Start (SOP)', link: '/PORADNIK_UZYTKOWNIKA' },
      { text: 'Manifesto', link: '/core/manifesto' },
      { text: 'Ecosystem', link: '/ecosystem/report' },
      { text: 'KODA Chat', link: '/koda' }
    ],
    sidebar: [
      {
        text: 'START',
        items: [
          { text: 'Poradnik użytkownika', link: '/PORADNIK_UZYTKOWNIKA' },
          { text: 'Jeśli zgubiony', link: '/if-lost' },
          { text: 'Quickstart (Orchestrator)', link: '/core/quickstart' },
          { text: 'Brain Dowódcy (render)', link: '/brain' },
          { text: 'KODA — czat', link: '/koda' },
          { text: 'Ewolucja systemu', link: '/system-evolution' }
        ]
      },
      {
        text: 'CORE',
        collapsible: true,
        items: [
          { text: 'Manifesto', link: '/core/manifesto' },
          { text: 'Global Rules', link: '/core/global-rules' },
          { text: 'Workflow Manual', link: '/core/workflow-manual' },
          { text: 'Assistant Workflow Contract', link: '/core/assistant-workflow-contract' },
          { text: 'Orchestration Commands', link: '/core/orchestration-commands' },
          { text: 'Session Anchor + Handoff', link: '/core/session-anchor-and-handoff-spec' },
          { text: 'Artifacts Standard', link: '/core/artifacts-standard' },
          { text: 'Security Policy', link: '/core/security-policy' },
          { text: 'Planner Spec', link: '/core/planner-spec' },
          { text: 'Phase Waivers', link: '/core/phase-waivers' },
          { text: 'Ownership & Escalation', link: '/core/ownership-and-escalation' },
          { text: 'Repo Page Standard', link: '/core/repo-page-standard' }
        ]
      },
      {
        text: 'ECOSYSTEM',
        collapsible: true,
        items: [
          { text: 'Report (dashboard)', link: '/ecosystem/report' },
          { text: 'Map', link: '/ecosystem/map' },
          { text: 'Conflicts', link: '/ecosystem/conflicts' },
          { text: 'Repo: flex-vcms', link: '/ecosystem/repos/flex-vcms' },
          { text: 'Repo: zzpackage', link: '/ecosystem/repos/zzpackage-flexgrafik-nl' },
          { text: 'Repo: jadzia-core', link: '/ecosystem/repos/jadzia-core' },
          { text: 'Repo: app.flexgrafik.nl', link: '/ecosystem/repos/app-flexgrafik-nl' },
          { text: 'Repo: flexgrafik-nl', link: '/ecosystem/repos/flexgrafik-nl' },
          { text: 'Repo: flexgrafik-meta', link: '/ecosystem/repos/flexgrafik-meta' }
        ]
      },
      {
        text: 'PLANS',
        collapsible: true,
        items: [
          { text: '5-Phase Ecosystem Plan', link: '/plans/flex-vcms-ecosystem-5-phase-plan' }
        ]
      },
      {
        text: 'HANDOFFS',
        collapsible: true,
        items: [
          { text: 'Handoffs — indeks', link: '/handoffs/handoffs-index' }
        ]
      },
      {
        text: 'AGENTS',
        collapsible: true,
        items: [
          { text: 'KODA (profil docs)', link: '/agents/koda' },
          { text: 'Antigravity', link: '/agents/antigravity' },
          { text: 'Gemini CLI', link: '/agents/gemini-cli' },
          { text: 'Boot: Senior Agency', link: '/agents/boot-senior-agency' },
          { text: 'Agent Boundaries', link: '/agents/agent-boundaries' },
          { text: 'NotebookLM Roadmap', link: '/agents/notebooklm-roadmap' }
        ]
      },
      {
        text: 'PLAYBOOKS',
        collapsible: true,
        items: [
          { text: 'Feature Loop', link: '/playbooks/feature-loop' },
          { text: 'Patch-Only Surgery', link: '/playbooks/patch-only-surgery' },
          { text: 'Manual Release', link: '/playbooks/manual-release' }
        ]
      },
      {
        text: 'CHECKLISTS',
        collapsible: true,
        items: [
          { text: 'Prep Deploy', link: '/checklists/prep-deploy' },
          { text: 'Pre-Commit', link: '/checklists/pre-commit' },
          { text: 'Verification (legacy)', link: '/checklists/verification' },
          { text: 'Phase 3 — Verification', link: '/checklists/phase-3-verification' },
          { text: 'Phase 3 — Test Scenarios', link: '/checklists/phase-3-test-scenarios' },
          { text: 'VCMS prod smoke', link: '/checklists/vcms-prod-smoke' }
        ]
      },
      {
        text: 'REFERENCE',
        collapsible: true,
        items: [
          { text: 'VPS runbook (Command Center)', link: '/reference/vcms-vps-runbook' },
          { text: 'Glossary', link: '/reference/glossary' },
          { text: 'Anti-Patterns', link: '/reference/anti-patterns' },
          { text: 'Prompt Formulas', link: '/reference/prompt-formulas' },
          { text: 'Tags and Statuses', link: '/reference/tags-and-statuses' },
          { text: 'Writing Standard', link: '/reference/writing-standard' }
        ]
      },
      {
        text: 'TEMPLATES',
        collapsible: true,
        items: [
          { text: 'Session Brief + Context Packet', link: '/templates/tmpl-session-brief' },
          { text: 'Session Log', link: '/templates/tmpl-session-log' },
          { text: 'Incident', link: '/templates/tmpl-incident' },
          { text: 'Playbook', link: '/templates/tmpl-playbook' },
          { text: 'Weekly Review', link: '/templates/tmpl-weekly-review' },
          { text: 'Change', link: '/templates/tmpl-change' },
          { text: 'PH4-011 mobile (prod)', link: '/templates/tmpl-ph4-011-mobile' }
        ]
      },
      {
        text: 'JOURNAL',
        collapsible: true,
        items: [
          { text: 'Logs Index', link: '/journal/logs-index' }
        ]
      },
      {
        text: 'LAB',
        collapsible: true,
        items: [
          { text: 'Lab Index', link: '/lab/lab-index' }
        ]
      },
      {
        text: 'STUDY',
        collapsible: true,
        items: [
          { text: 'Study Index', link: '/study/study-index' }
        ]
      },
      {
        text: 'ARCHIVE',
        collapsible: true,
        items: [
          { text: 'Archive Index', link: '/archive/archive-index' }
        ]
      }
    ]
  }
})
