import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export default defineConfig({
  title: "VCMS",
  description: "Visual Content Management System",
  appearance: 'dark',
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        manifest: {
          name: 'VCMS Command Center',
          short_name: 'VCMS',
          description: 'Dowództwo Agencji i Vibe Codingu (Standalone)',
          theme_color: '#0A0A0A',
          background_color: '#111111',
          display: 'standalone',
          icons: [
            {
              src: 'icon.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon-512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      }),
      {
        name: 'koda-backend',
        configureServer(server) {
          const scanDocsRecursively = (dir, baseDir = '') => {
            let results = {};
            try {
              const list = fs.readdirSync(dir);
              list.forEach(file => {
                  const filePath = path.join(dir, file);
                  const relativePath = path.join(baseDir, file).replace(/\\/g, '/');
                  const stat = fs.statSync(filePath);

                  if (stat && stat.isDirectory()) {
                      // Ignorujemy foldery techniczne
                      if (file !== '.vitepress' && file !== 'node_modules') {
                          Object.assign(results, scanDocsRecursively(filePath, relativePath));
                      }
                  } else if (file.endsWith('.md')) {
                      try {
                          results[relativePath] = fs.readFileSync(filePath, 'utf8');
                      } catch (e) {
                          results[relativePath] = '[BŁĄD ODCZYTU]';
                      }
                  }
              });
            } catch(ex) {
              console.error("[DEV SERVER] Error scanning docs: " + ex);
            }
            return results;
          };

          const getContextData = () => {
            const getFile = (p) => {
              try { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '[BRAK PLIKU LUB PUSTY]'; }
              catch(e) { return '[BŁĄD ODCZYTU: ' + e + ']'; }
            };
            
            const vcmsBase = process.env.VCMS_DIR || path.resolve(__dirname, '../../..');
            const githubBase = process.env.GITHUB_DIR || path.resolve(__dirname, '../../../..');
            
            const vcmsDocs = scanDocsRecursively(path.join(vcmsBase, 'docs'));
            
            return {
              "VCMS_INTERNAL_KNOWLEDGE": vcmsDocs,
              "PROJECT_CONTEXT_ZZP": {
                 "brain-zzp.md": getFile(`${githubBase}/flexgrafik-nl/brain-zzp.md`),
                 "todo.json": getFile(`${githubBase}/flexgrafik-nl/todo.json`)
              },
              "PROJECT_CONTEXT_APP": {
                 "brain-app.md": getFile(`${githubBase}/app.flexgrafik.nl/brain-app.md`),
                 "todo.json": getFile(`${githubBase}/app.flexgrafik.nl/todo.json`)
              },
              "PROJECT_CONTEXT_ZZPACKAGE": {
                 "brain-zzpackage.md": getFile(`${githubBase}/zzpackage.flexgrafik.nl/brain-zzp.md`),
                 "todo.json": getFile(`${githubBase}/zzpackage.flexgrafik.nl/todo.json`)
              }
            };
          };

          server.middlewares.use('/api/knowledge', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(getContextData()));
          });
          
          server.middlewares.use('/api/chat', (req, res) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body);
                  const apiKey = process.env.GEMINI_API_KEY;
                  if (!apiKey) throw new Error("Missing GEMINI_API_KEY in .env");

                  const systemPrompt = `🎯 ROLA
Jesteś moim osobistym mentorem, trenerem i „aniołem stróżem” w vibe-codingu.

Twoje zadanie:
- prowadzić mnie krok po kroku
- motywować mnie
- pilnować mojej konsekwencji
- sprawdzać wykonanie zadań
- NIE pozwalać mi się wycofać ani rozproszyć

Jesteś:
- spokojny, konkretny, męski w komunikacji
- wspierający, ale wymagający
- skupiony na działaniu, nie teorii

🧬 DOPASOWANIE DO MNIE (KLUCZOWE)
Działam jak Generator (Human Design):
- najlepiej działam, gdy reaguję, nie gdy jestem zmuszany
- mam dużo energii, ale tylko do rzeczy, które mnie angażują
- blokuję się przy presji i nadmiarze

Twoje zasady pracy ze mną:
- dawaj mi małe, konkretne kroki
- zadawaj pytania zamiast narzucać
- pomagaj mi poczuć „czy to mnie kręci”
- jeśli tracę energię → pomóż mi zmienić podejście, nie zmuszaj

🧭 CEL GŁÓWNY
Pomóż mi:
- nauczyć się vibe-codingu w praktyce
- budować realne projekty
- wejść w stan flow i regularnej pracy
- stać się samodzielnym twórcą / programistą

🔥 MOTYWACJA I TRYB STRAŻNIKA
- Jeśli unikam działania, zatrzymaj mnie: "Unikasz. Wracamy do zadania."
- Zawsze dawaj najmniejszy krok.
- Nie dawaj długich wykładów, najwyżej 3 mocne zdania.`;

                  const enrichedSystemPrompt = systemPrompt + "\n\n" +
                    "===== KONTEKST PROJEKTÓW I ZASAD DOWÓDCY =====\n" +
                    "Poniżej znajduje się absolutnie aktualny zrzut plików Twojego dowódcy na ten moment. \n" +
                    "Masz czytać ten kontekst jako wiedzę bieżącą, szczególnie zadania w todo.json oraz stany z plików brain.\n" +
                    JSON.stringify(getContextData(), null, 2);

                  const geminiPayload = {
                    system_instruction: { parts: [{ text: enrichedSystemPrompt }] },
                    contents: payload.messages
                  };
                  
                  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
                  const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(geminiPayload)
                  });
                  
                  const data = await response.text();
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = response.status;
                  res.end(data);
                } catch (e) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: String(e) }));
                }
              });
            } else {
              res.statusCode = 405;
              res.end();
            }
          });
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
          { text: 'Global Rules', link: '/core/global-rules' },
          { text: 'System Evolution', link: '/system-evolution' },
          { text: 'IF LOST (Ratunek)', link: '/if-lost' }
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
