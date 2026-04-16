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
        chatInput: document.getElementById('chat-input'),
        chatMessages: document.getElementById('chat-messages'),
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
            elements.latency.innerText = (data.llm.last_latency_ms || 0) + 'ms';
            elements.requests.innerText = data.llm.total_requests;
            elements.knowledge.innerText = data.knowledge?.file_count || '0';
            if (data.uncle_tip) elements.tipText.innerText = data.uncle_tip;

            if (data.llm.history) {
                elements.logContainer.innerHTML = data.llm.history.slice(-5).map(item => `
                    <div class="log-row">
                        <span style="color:var(--accent)">${item.time}</span>
                        <span>ANALYSIS_ENGINE</span>
                        <span>${item.latency}ms</span>
                        <span style="color: ${item.status === 'success' ? 'var(--accent)' : 'var(--danger)'}">${item.status.toUpperCase()}</span>
                    </div>
                `).join('');
            }
        } catch (e) {}
    };

    const fetchBacklog = async () => {
        try {
            const data = await safeFetch('/api/v1/backlog');
            if (data.next_task) {
                elements.backlogTitle.innerText = data.next_task.title;
                elements.backlogDesc.innerText = data.next_task.description;
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

    const fetchEcosystem = async () => {
        try {
            const data = await safeFetch('/api/v1/ecosystem/status');
            if (data.repos) {
                elements.ecosystemTable.innerHTML = data.repos.map(repo => `
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
                `).join('');
            }
        } catch (e) {}
    };

    window.triggerScan = async () => {
        window.showToast('Zwalnianie skanera ekosystemu...');
        try {
            const data = await safeFetch('/api/v1/scan', { method: 'POST' });
            window.showToast('Skanowanie zakończone pomyślnie.');
            fetchEcosystem();
        } catch (e) {}
    };

    // --- Chat Logic ---

    window.sendMessage = async () => {
        const text = elements.chatInput.value.trim();
        if (!text) return;

        // XSS Protection for User Messages
        const userMsgDiv = document.createElement('div');
        userMsgDiv.className = 'msg msg-user';
        userMsgDiv.textContent = text;
        elements.chatMessages.appendChild(userMsgDiv);
        elements.chatInput.value = '';

        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg msg-ai';
        typingDiv.id = typingId;
        typingDiv.innerHTML = `<span class="skeleton-text skeleton" style="width: 100px;"></span> Analyzing...`;
        elements.chatMessages.appendChild(typingDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

        try {
            const data = await safeFetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [{ role: 'user', parts: [{ text }] }] })
            });

            document.getElementById(typingId).remove();
            const aiMsg = data.candidates[0].content.parts[0].text;
            
            // XSS Protection for AI Messages (Clean markdown)
            const aiMsgDiv = document.createElement('div');
            aiMsgDiv.className = 'msg msg-ai msg-content';
            aiMsgDiv.innerHTML = DOMPurify.sanitize(marked.parse(aiMsg));
            elements.chatMessages.appendChild(aiMsgDiv);
            elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
        } catch (err) {
            const el = document.getElementById(typingId);
            if (el) el.remove();
        }
    };

    // --- Init ---

    function init() {
        lucide.createIcons();
        
        // Markdown setup
        const renderer = new marked.Renderer();
        renderer.code = (code) => {
            const id = 'code-' + Math.random().toString(36).substr(2, 9);
            return `<pre style="position:relative;"><button class="copy-btn" onclick="copyCode('${id}')">Copy</button><code id="${id}">${code}</code></pre>`;
        };
        marked.setOptions({ renderer });

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
