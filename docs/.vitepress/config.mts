import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "VCMS",
  description: "Visual Content Management System",
  appearance: 'dark',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Manifesto', link: '/core/manifesto' }
    ],
    sidebar: [
      {
        text: 'CORE',
        items: [
          { text: 'Manifesto', link: '/core/manifesto' },
          { text: 'Global Rules', link: '/core/global-rules' }
        ]
      },
      {
        text: 'AGENTS',
        items: [
          { text: 'Antigravity', link: '/agents/antigravity' },
          { text: 'Gemini CLI', link: '/agents/gemini-cli' },
          { text: 'Agent Boundaries', link: '/agents/agent-boundaries' },
          { text: 'NotebookLM Roadmap', link: '/agents/notebooklm-roadmap' }
        ]
      },
      {
        text: 'PLAYBOOKS',
        items: [
          { text: 'Feature Loop', link: '/playbooks/feature-loop' },
          { text: 'Patch-Only Surgery', link: '/playbooks/patch-only-surgery' },
          { text: 'Manual Release', link: '/playbooks/manual-release' }
        ]
      },
      {
        text: 'CHECKLISTS',
        items: [
          { text: 'Prep Deploy', link: '/checklists/prep-deploy' },
          { text: 'Pre-Commit', link: '/checklists/pre-commit' },
          { text: 'Verification', link: '/checklists/verification' }
        ]
      },
      {
        text: 'REFERENCE',
        items: [
          { text: 'Glossary', link: '/reference/glossary' },
          { text: 'Anti-Patterns', link: '/reference/anti-patterns' },
          { text: 'Prompt Formulas', link: '/reference/prompt-formulas' },
          { text: 'Tags and Statuses', link: '/reference/tags-and-statuses' },
          { text: 'Writing Standard', link: '/reference/writing-standard' }
        ]
      },
      {
        text: 'TEMPLATES',
        items: [
          { text: 'Session Log', link: '/templates/tmpl-session-log' },
          { text: 'Incident', link: '/templates/tmpl-incident' },
          { text: 'Playbook', link: '/templates/tmpl-playbook' },
          { text: 'Weekly Review', link: '/templates/tmpl-weekly-review' },
          { text: 'Change', link: '/templates/tmpl-change' }
        ]
      },
      {
        text: 'JOURNAL',
        items: [
          { text: 'Logs Index', link: '/journal/logs-index' }
        ]
      },
      {
        text: 'LAB',
        items: [
          { text: 'Lab Index', link: '/lab/lab-index' }
        ]
      },
      {
        text: 'STUDY',
        items: [
          { text: 'Study Index', link: '/study/study-index' }
        ]
      },
      {
        text: 'ARCHIVE',
        items: [
          { text: 'Archive Index', link: '/archive/archive-index' }
        ]
      }
    ]
  }
})
