import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  title: "VCMS",
  description: "Visual Content Management System",
  appearance: 'dark',
  vite: {
    plugins: [
      {
        name: 'koda-backend',
        configureServer(server) {
          server.middlewares.use('/api/knowledge', (req, res) => {
            const getFile = (p) => {
              try { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '[BRAK PLIKU LUB PUSTY]'; }
              catch(e) { return '[BŁĄD ODCZYTU: ' + e + ']'; }
            }
            
            const vcmsBase = 'C:/Users/FlexGrafik/Desktop/vcms';
            const githubBase = 'C:/Users/FlexGrafik/FlexGrafik/github';
            
            const contextData = {
              "KNOWLEDGE_STUDY": {
                 "study-index.md": getFile(`${vcmsBase}/docs/study/study-index.md`),
                 "skill-gap-matrix.md": getFile(`${vcmsBase}/docs/study/skill-gap-matrix.md`)
              },
              "KNOWLEDGE_WORKFLOW": {
                 "global-rules.md": getFile(`${vcmsBase}/docs/core/global-rules.md`),
                 "sprint-plan.md": getFile(`${vcmsBase}/.agent/workflows/sprint-plan.md`),
                 "blokady": getFile(`${vcmsBase}/docs/study/blocker-decision-tree.md`)
              },
              "KNOWLEDGE_PROJECT_ZZP": {
                 "brain-zzp.md": getFile(`${githubBase}/flexgrafik-nl/brain-zzp.md`),
                 "todo.json": getFile(`${githubBase}/flexgrafik-nl/todo.json`)
              },
              "KNOWLEDGE_PROJECT_APP": {
                 "brain-app.md": getFile(`${githubBase}/app.flexgrafik.nl/brain-app.md`),
                 "todo.json": getFile(`${githubBase}/app.flexgrafik.nl/todo.json`)
              },
              "KNOWLEDGE_PROJECT_ZZPACKAGE": {
                 "brain-zzpackage.md": getFile(`${githubBase}/zzpackage.flexgrafik.nl/brain-zzpackage.md`),
                 "todo.json": getFile(`${githubBase}/zzpackage.flexgrafik.nl/todo.json`)
              }
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(contextData));
          })
        }
      }
    ]
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'KODA (Agent)', link: '/koda' },
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
