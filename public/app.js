/**
 * Flex-VCMS — Dashboard Logic (Modularized ES6)
 * Swiss Watch v3.0 Hardened
 */

(function() {
    'use strict';

    // UI Elements
    const elements = {
        latency: document.getElementById('val-latency'),
        uptime: document.getElementById('val-uptime'),
        requests: document.getElementById('val-requests'),
        knowledge: document.getElementById('val-knowledge'),
        contextHealth: document.getElementById('context-health-list'),
        backlogTitle: document.getElementById('next-task-title'),
        backlogDesc: document.getElementById('next-task-desc'),
        backlogSync: document.getElementById('backlog-sync-info'),
        ecosystemTable: document.getElementById('ecosystem-table-body'),
        logContainer: document.getElementById('log-container'),
        tipText: document.getElementById('uncle-tip-text')
    };

    // --- Core Functions ---

    window.showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        lucide.createIcons({ props: { width: 18, height: 18 } });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    window.showTab = (tabName) => {
        if (!tabName) return;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));
        
        const targetContent = document.getElementById('tab-' + tabName);
        if (targetContent) targetContent.classList.add('active');
        
        // Find links by data-tab or fallback to onclick matching
        document.querySelectorAll(`[data-tab="${tabName}"], [onclick*="'${tabName}'"]`).forEach(nav => nav.classList.add('active'));
    };

    window.copyCode = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        navigator.clipboard.writeText(el.innerText);
        const btn = el.parentElement.querySelector('.copy-btn');
        btn.innerText = 'Copied!';
        btn.style.background = 'var(--accent)';
        setTimeout(() => { 
            btn.innerText = 'Copy'; 
            btn.style.background = '';
        }, 2000);
    };

    window.loadDoc = (path) => {
        const iframe = document.getElementById('docs-iframe');
        iframe.src = '/docs/' + path;
        window.showTab('knowledge');
    };

    // --- API Calls ---

    async function safeFetch(url, options = {}) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Server Error ${res.status}`);
            }
            return await res.json();
        } catch (err) {
            console.error(`[Fetch Error] ${url}:`, err.message);
            window.showToast(err.message, 'error');
            throw err;
        }
    }

    const fetchStats = async () => {
        try {
            const data = await safeFetch('/api/v1/status');
            elements.uptime.innerText = data.uptime + 's';
            elements.knowledge.innerText = data.knowledge?.file_count || '0';
            if (data.uncle_tip) elements.tipText.innerText = data.uncle_tip;

            elements.logContainer.innerHTML = `
                <div class="log-row">
                    <span style="color:var(--accent)">${new Date().toLocaleTimeString()}</span>
                    <span>ORCHESTRATOR</span>
                    <span>—</span>
                    <span style="color:var(--text-dim)">Scan: npm run scan · Audit: docs/audits/latest-verification.md</span>
                </div>
            `;
        } catch (e) {}
    };

    const fetchBacklog = async () => {
        try {
            const data = await safeFetch('/api/v1/backlog');
            if (data.next_task) {
                elements.backlogTitle.innerText = data.next_task.title || data.next_task.task_id || '—';
                elements.backlogDesc.innerText = data.next_task.before_you_start
                    || data.next_task.description
                    || data.next_task.note
                    || 'Brak opisu w backlogu.';
                elements.backlogSync.innerText = `Synced: ${new Date(data.last_sync_ms).toLocaleTimeString()}`;
            }
        } catch (e) {}
    };

    const fetchHealth = async () => {
        try {
            const data = await safeFetch('/api/v1/context/health');
            if (data.modules) {
                elements.contextHealth.innerHTML = data.modules.map(mod => `
                    <div class="status-pill">
                        <div class="dot ${mod.status}"></div>
                        ${mod.name}
                    </div>
                `).join('');
            }
        } catch (e) {}
    };

    const renderEcosystemRow = (repo) => {
        if (!repo.git) {
            const risk = repo.risk_level ? ` · ${repo.risk_level}` : '';
            return `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 1.2rem; font-weight: 600;">${repo.name}</td>
                    <td style="padding: 1.2rem;"><span class="tag" style="background: rgba(255,255,255,0.05);">${repo.type}${risk}</span></td>
                    <td style="padding: 1.2rem; font-family: 'JetBrains Mono'; color: var(--text-dim);">—</td>
                    <td style="padding: 1.2rem;">
                        <span class="tag" style="background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2);">REMOTE</span>
                    </td>
                    <td style="padding: 1.2rem; font-size: 0.75rem; color: var(--text-dim);">Git scan lokalnie</td>
                </tr>
            `;
        }

        return `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 1.2rem; font-weight: 600;">${repo.name}</td>
                <td style="padding: 1.2rem;"><span class="tag" style="background: rgba(255,255,255,0.05);">${repo.type}</span></td>
                <td style="padding: 1.2rem; font-family: 'JetBrains Mono';">${repo.git.branch || '—'}</td>
                <td style="padding: 1.2rem;">
                    <span class="tag ${repo.git.status === 'clean' ? 'tag-success' : ''}" 
                          style="${repo.git.status === 'dirty' ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);' : ''}">
                        ${repo.git.status.toUpperCase()}
                    </span>
                </td>
                <td style="padding: 1.2rem; font-size: 0.75rem; color: var(--text-dim);">${repo.git.last_commit}</td>
            </tr>
        `;
    };

    const fetchEcosystem = async () => {
        try {
            const data = await safeFetch('/api/v1/ecosystem/status');
            if (data.repos) {
                const noteRow = data.status === 'remote' && data.note
                    ? `<tr><td colspan="5" style="padding: 1rem 1.2rem; font-size: 0.85rem; color: var(--text-dim); background: rgba(234,179,8,0.05);">${data.note}</td></tr>`
                    : '';
                elements.ecosystemTable.innerHTML = noteRow + data.repos.map(renderEcosystemRow).join('');
            }
            if (elements.latency) elements.latency.innerText = data.status === 'remote' ? 'Remote' : 'Local';
            if (elements.requests) elements.requests.innerText = String(data.repos?.length || 0);
        } catch (e) {}
    };

    window.triggerScan = async () => {
        window.showToast('Uruchamianie skanu ekosystemu...');
        try {
            await safeFetch('/api/v1/scan', { method: 'POST' });
            window.showToast('Skan zakończony.');
            fetchEcosystem();
        } catch (e) {
            window.showToast('Deep Scan wymaga lokalnej maszyny dev (repos.yaml). Użyj: npm run scan', 'error');
        }
    };

    // --- Init ---

    function init() {
        lucide.createIcons();
        
        const renderer = new marked.Renderer();
        renderer.code = (code) => {
            const id = 'code-' + Math.random().toString(36).substr(2, 9);
            return `<pre style="position:relative;"><button class="copy-btn" onclick="copyCode('${id}')">Copy</button><code id="${id}">${code}</code></pre>`;
        };
        marked.setOptions({ renderer });
        
        // Robust Navigation
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
            el.addEventListener('click', () => {
                const tab = el.getAttribute('data-tab');
                if (tab) window.showTab(tab);
            });
        });

        // Action Buttons
        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        };

        bind('btn-refresh-health', fetchHealth);
        bind('btn-refresh-ecosystem', fetchEcosystem);
        bind('btn-execute-task', () => window.loadDoc('VCMS_PORTFOLIO_TRUTH.html'));
        bind('btn-deep-scan', window.triggerScan);

        fetchStats();
        fetchBacklog();
        fetchHealth();
        fetchEcosystem();
        setInterval(fetchStats, 5000);
        setInterval(fetchEcosystem, 120000);
    }

    // Export minimal set if needed, or just run
    document.addEventListener('DOMContentLoaded', init);
    
    // Bind public triggers (required due to old-school onclick in HTML)
    // In v4.0 we should move to addEventListener
    window.fetchEcosystem = fetchEcosystem;
    window.fetchBacklog = fetchBacklog;
    window.fetchHealth = fetchHealth;

})();
