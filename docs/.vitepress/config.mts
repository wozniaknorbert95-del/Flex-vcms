import { defineConfig } from 'vitepress'

export default defineConfig({
  // External / generated paths only — archive is srcExcluded (not built).
  ignoreDeadLinks: [
    /repos\/index/,
    /szlif%20pod%20portfolio/,
    /^\.\/\.$/,
  ],
  srcExclude: ['**/archive/**'],
  base: '/docs/',
  title: "VCMS",
  description: "Visual Content Management System",
  appearance: 'dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'COI Commander', link: '/study/coi-commander-ops-handbook' },
      { text: 'Surfaces', link: '/study/surfaces-map' },
      { text: 'Start (SOP)', link: '/PORADNIK_UZYTKOWNIKA' },
      { text: 'Ecosystem', link: '/ecosystem/report' },
      { text: 'KODA Chat', link: '/koda' }
    ],
    // Exactly 6 LIVE top-level groups (ECO-POLISH-01).
    sidebar: [
      {
        text: 'OPS',
        items: [
          { text: 'COI Commander — instrukcja', link: '/study/coi-commander-ops-handbook' },
          { text: 'Mapa powierzchni', link: '/study/surfaces-map' },
          { text: 'Deploy contract', link: '/study/deploy-contract' },
          { text: 'Study index', link: '/study/study-index' },
          { text: 'Jeśli zgubiony', link: '/if-lost' },
          { text: 'AI OS Knowledge', link: '/ecosystem/ai-os-knowledge' },
          { text: 'AI OS Processes', link: '/ecosystem/ai-os-processes' }
        ]
      },
      {
        text: 'START',
        items: [
          { text: 'Poradnik użytkownika', link: '/PORADNIK_UZYTKOWNIKA' },
          { text: 'Quickstart (Orchestrator)', link: '/core/quickstart' },
          { text: 'Brain Dowódcy (render)', link: '/brain' },
          { text: 'KODA — czat', link: '/koda' },
          { text: 'Ewolucja systemu', link: '/system-evolution' },
          { text: 'Global Rules (→ meta)', link: '/core/global-rules' },
          { text: 'Workflow Manual (→ meta)', link: '/core/workflow-manual' }
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
          { text: 'Repo: flexgrafik-meta', link: '/ecosystem/repos/flexgrafik-meta' },
          { text: 'Repo: agent-os', link: '/ecosystem/repos/agent-os' },
          { text: 'Repo: agent-os-ui', link: '/ecosystem/repos/agent-os-ui' }
        ]
      },
      {
        text: 'AGENTS',
        collapsible: true,
        items: [
          { text: 'KODA (profil docs)', link: '/agents/koda' },
          { text: 'Boot: Senior Agency', link: '/agents/boot-senior-agency' },
          { text: 'Agent Boundaries', link: '/agents/agent-boundaries' }
        ]
      },
      {
        text: 'OPS-RUN',
        collapsible: true,
        items: [
          { text: 'Handoffs — indeks', link: '/handoffs/handoffs-index' },
          { text: 'Feature Loop', link: '/playbooks/feature-loop' },
          { text: 'Patch-Only Surgery', link: '/playbooks/patch-only-surgery' },
          { text: 'Manual Release', link: '/playbooks/manual-release' },
          { text: 'Prep Deploy', link: '/checklists/prep-deploy' },
          { text: 'Pre-Commit', link: '/checklists/pre-commit' },
          { text: 'VCMS prod smoke', link: '/checklists/vcms-prod-smoke' },
          { text: 'VPS runbook', link: '/reference/vcms-vps-runbook' },
          { text: 'Glossary', link: '/reference/glossary' },
          { text: 'Anti-Patterns', link: '/reference/anti-patterns' },
          { text: 'Security Policy', link: '/core/security-policy' }
        ]
      },
      {
        text: 'PORTFOLIO',
        collapsible: true,
        collapsed: true,
        items: [
          { text: 'Portfolio Truth', link: '/VCMS_PORTFOLIO_TRUTH' },
          { text: 'Readiness Audit', link: '/VCMS_READINESS_AUDIT' },
          { text: 'DoD Scorecard', link: '/VCMS_DOD_SCORECARD' },
          { text: 'Sales Report', link: '/VCMS_SALES_REPORT' },
          { text: 'Demo Script (75s)', link: '/VCMS_DEMO_SCRIPT' },
          { text: 'Demo: Scan Report', link: '/demo/SCAN-REPORT' }
        ]
      }
    ]
  }
})
