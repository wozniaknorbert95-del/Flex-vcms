/**
 * Flex-VCMS — Dashboard Logic (Modularized ES6)
 * Swiss Watch v3.0 Hardened + locale + terminal UI v2
 */

(function() {
    'use strict';

    const t = (key, fallback) => {
        if (window.VCMS_LOCALE && typeof window.VCMS_LOCALE.t === 'function') {
            return window.VCMS_LOCALE.t(key, fallback);
        }
        return fallback !== undefined ? fallback : key;
    };

    const apiUrl = (path) => {
        const sep = path.includes('?') ? '&' : '?';
        const q = window.VCMS_LOCALE ? window.VCMS_LOCALE.apiQuery() : 'locale=pl';
        return `${path}${sep}${q}`;
    };

    const elements = {
        latency: document.getElementById('val-latency'),
        uptime: document.getElementById('val-uptime'),
        requests: document.getElementById('val-requests'),
        knowledge: document.getElementById('val-knowledge'),
        conflicts: document.getElementById('val-conflicts'),
        conflictsCard: document.getElementById('stat-conflicts-card'),
        contextHealth: document.getElementById('context-health-list'),
        backlogTitle: document.getElementById('next-task-title'),
        backlogDesc: document.getElementById('next-task-desc'),
        backlogSync: document.getElementById('backlog-sync-info'),
        ecosystemTable: document.getElementById('ecosystem-table-body'),
        logContainer: document.getElementById('log-container'),
        tipText: document.getElementById('uncle-tip-text'),
        kodaInput: document.getElementById('koda-input'),
        kodaMessages: document.getElementById('koda-messages'),
        kodaSend: document.getElementById('koda-send')
    };

    const kodaHistory = [];

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
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item, .vcms-nav__item, .mobile-nav-item').forEach(el => el.classList.remove('active'));

        const targetContent = document.getElementById('tab-' + tabName);
        if (targetContent) targetContent.classList.add('active');

        document.querySelectorAll(`.nav-item[data-tab="${tabName}"], .vcms-nav__item[data-tab="${tabName}"], .mobile-nav-item[data-tab="${tabName}"]`)
            .forEach(nav => nav.classList.add('active'));
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

    window.loadDoc = (docPath) => {
        const iframe = document.getElementById('docs-iframe');
        if (!iframe) return;
        const normalized = String(docPath || '')
            .replace(/^\//, '')
            .replace(/\.html$/i, '');
        if (!normalized || normalized === 'index') {
            iframe.src = '/docs/';
        } else {
            iframe.src = `/docs/${normalized}.html`;
        }
        window.showTab('knowledge');
    };

    const POLL_INTERVAL_MS = 15000;
    const toastThrottle = new Map();

    async function safeFetch(url, options = {}) {
        try {
            const res = await fetch(url, options);
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const err = new Error(data.error || `Server Error ${res.status}`);
                err.status = res.status;
                throw err;
            }
            return await res.json();
        } catch (err) {
            console.error(`[Fetch Error] ${url}:`, err.message);
            const isRateLimited = err.status === 429;
            const now = Date.now();
            const lastToast = toastThrottle.get(url) || 0;
            if (!isRateLimited || now - lastToast >= 60000) {
                if (isRateLimited) toastThrottle.set(url, now);
                window.showToast(err.message, 'error');
            }
            throw err;
        }
    }

    const fetchStats = async () => {
        try {
            const data = await safeFetch(apiUrl('/api/v1/status'));
            elements.uptime.innerText = data.uptime + 's';
            elements.knowledge.innerText = data.knowledge?.file_count || '0';

            const cf = data.conflicts;
            if (elements.conflicts) {
                if (cf && cf.count !== null && cf.count !== undefined) {
                    elements.conflicts.innerText = String(cf.count);
                    if (elements.conflictsCard) {
                        elements.conflictsCard.style.borderLeftColor = cf.count === 0
                            ? 'var(--accent-primary)'
                            : '#ef4444';
                    }
                } else {
                    elements.conflicts.innerText = '—';
                }
            }

            if (data.uncle_tip && elements.tipText) elements.tipText.innerText = data.uncle_tip;
        } catch (e) {}
    };

    const renderAuditLog = (entries) => {
        if (!elements.logContainer) return;
        if (!entries || entries.length === 0) {
            elements.logContainer.innerHTML = `
                <div class="log-row vcms-action-log__entry" style="color:var(--text-dim)">
                    <span>—</span>
                    <span>system</span>
                    <span>NO_EVENTS</span>
                    <span>${t('action_log.empty_hint')}</span>
                </div>`;
            return;
        }

        elements.logContainer.innerHTML = entries.map((entry) => {
            const ts = entry.ts ? new Date(entry.ts).toLocaleString() : '—';
            const detail = [entry.target, entry.reason].filter(Boolean).join(' · ');
            return `
                <div class="log-row vcms-action-log__entry">
                    <span style="color:var(--accent)">${ts}</span>
                    <span>${entry.actor || '—'}</span>
                    <span>${entry.action || '—'}</span>
                    <span style="color:var(--text-dim)">${detail || '—'}${entry.conflicts !== undefined ? ` · conflicts: ${entry.conflicts}` : ''}</span>
                </div>`;
        }).join('');
    };

    const fetchAuditLog = async () => {
        try {
            const data = await safeFetch(apiUrl('/api/v1/audit-log?limit=15'));
            renderAuditLog(data.entries);
        } catch (e) {
            if (elements.logContainer) {
                elements.logContainer.innerHTML = `
                    <div class="log-row vcms-action-log__entry" style="color:var(--text-dim)">${t('action_log.unavailable')}</div>`;
            }
        }
    };

    const appendKodaMessage = (role, html, extraClass = '') => {
        if (!elements.kodaMessages) return;
        const wrap = document.createElement('div');
        wrap.className = `msg ${role === 'user' ? 'msg-user' : 'msg-ai'} ${extraClass}`.trim();
        const inner = document.createElement('div');
        inner.className = 'msg-content';
        inner.innerHTML = html;
        wrap.appendChild(inner);
        elements.kodaMessages.appendChild(wrap);
        elements.kodaMessages.scrollTop = elements.kodaMessages.scrollHeight;
        return wrap;
    };

    const sendKodaMessage = async () => {
        if (!elements.kodaInput || !elements.kodaSend) return;
        const text = elements.kodaInput.value.trim();
        if (!text) return;

        elements.kodaInput.value = '';
        elements.kodaSend.disabled = true;

        appendKodaMessage('user', DOMPurify.sanitize(marked.parse(text)));
        kodaHistory.push({ role: 'user', parts: [{ text }] });

        const loadingEl = appendKodaMessage('model', t('koda.thinking'), 'msg-loading');

        try {
            const data = await safeFetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: kodaHistory })
            });

            loadingEl.remove();
            const reply = data.message?.parts?.[0]?.text || t('koda.no_reply');
            kodaHistory.push({ role: 'model', parts: [{ text: reply }] });
            appendKodaMessage('model', DOMPurify.sanitize(marked.parse(reply)));
        } catch (err) {
            loadingEl.remove();
            appendKodaMessage('model', `<span style="color:var(--danger)">${err.message || t('koda.error')}</span>`);
        } finally {
            elements.kodaSend.disabled = false;
            elements.kodaInput.focus();
        }
    };

    const fetchBacklog = async () => {
        try {
            const data = await safeFetch(apiUrl('/api/v1/backlog'));
            if (data.next_task) {
                elements.backlogTitle.innerText = data.next_task.title || data.next_task.task_id || '—';
                elements.backlogDesc.innerText = data.next_task.before_you_start
                    || data.next_task.description
                    || data.next_task.note
                    || t('backlog.no_desc');
                elements.backlogSync.innerText = `${t('backlog.synced')}: ${new Date(data.last_sync_ms).toLocaleTimeString()}`;
            }
        } catch (e) {}
    };

    const fetchHealth = async () => {
        try {
            const data = await safeFetch(apiUrl('/api/v1/context/health'));
            if (data.modules) {
                elements.contextHealth.innerHTML = data.modules.map(mod => {
                    const ledClass = ['healthy', 'stale', 'missing'].includes(mod.status)
                        ? `led--${mod.status}`
                        : '';
                    return `
                    <div class="status-pill">
                        <span class="led ${ledClass}"></span>
                        ${mod.name}
                    </div>
                `;
                }).join('');
            }
        } catch (e) {}
    };

    const renderEcosystemRow = (repo) => {
        if (!repo.git) {
            const risk = repo.risk_level ? ` · ${repo.risk_level}` : '';
            return `
                <tr>
                    <td>${repo.name}</td>
                    <td><span class="tag" style="background: rgba(255,255,255,0.05);">${repo.type}${risk}</span></td>
                    <td style="color: var(--text-dim);">—</td>
                    <td>
                        <span class="tag" style="background: rgba(234, 179, 8, 0.1); color: #eab308; border: 1px solid rgba(234, 179, 8, 0.2);">REMOTE</span>
                    </td>
                    <td style="font-size: 0.75rem; color: var(--text-dim);">${t('ecosystem.git_local')}</td>
                </tr>
            `;
        }

        return `
            <tr>
                <td>${repo.name}</td>
                <td><span class="tag" style="background: rgba(255,255,255,0.05);">${repo.type}</span></td>
                <td>${repo.git.branch || '—'}</td>
                <td>
                    <span class="tag ${repo.git.status === 'clean' ? 'tag-success' : ''}"
                          style="${repo.git.status === 'dirty' ? 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);' : ''}">
                        ${repo.git.status.toUpperCase()}
                    </span>
                </td>
                <td style="font-size: 0.75rem; color: var(--text-dim);">${repo.git.last_commit}</td>
            </tr>
        `;
    };

    const applyScanButtonState = (ecosystemStatus) => {
        const btn = document.getElementById('btn-deep-scan');
        if (!btn) return;
        const isRemote = ecosystemStatus === 'remote';
        btn.disabled = isRemote;
        btn.title = isRemote ? t('scan.title_remote') : t('scan.title_local');
        btn.classList.toggle('btn-disabled', isRemote);
    };

    const fetchEcosystem = async () => {
        try {
            const data = await safeFetch(apiUrl('/api/v1/ecosystem/status'));
            if (data.repos) {
                const noteRow = data.status === 'remote' && data.note
                    ? `<tr><td colspan="5" style="padding: 1rem; font-size: 0.85rem; color: var(--text-dim); background: rgba(234,179,8,0.05);">${data.note}</td></tr>`
                    : '';
                elements.ecosystemTable.innerHTML = noteRow + data.repos.map(renderEcosystemRow).join('');
            }
            if (elements.latency) elements.latency.innerText = data.status === 'remote' ? 'Remote' : 'Local';
            if (elements.requests) elements.requests.innerText = String(data.repos?.length || 0);
            applyScanButtonState(data.status);
        } catch (e) {}
    };

    window.triggerScan = async () => {
        const scanBtn = document.getElementById('btn-deep-scan');
        if (scanBtn?.disabled) {
            window.showToast(t('scan.remote_toast'), 'error');
            return;
        }
        window.showToast(t('scan.starting'));
        try {
            await safeFetch('/api/v1/scan', { method: 'POST' });
            window.showToast(t('scan.done'));
            fetchEcosystem();
            fetchAuditLog();
        } catch (e) {
            window.showToast(t('scan.error'), 'error');
        }
    };

    async function init() {
        if (window.VCMS_LOCALE) {
            await window.VCMS_LOCALE.init();
        }

        lucide.createIcons();

        const renderer = new marked.Renderer();
        renderer.code = (code) => {
            const id = 'code-' + Math.random().toString(36).substr(2, 9);
            return `<pre style="position:relative;"><button class="copy-btn" onclick="copyCode('${id}')">Copy</button><code id="${id}">${code}</code></pre>`;
        };
        marked.setOptions({ renderer });

        document.querySelectorAll('.nav-item, .vcms-nav__item, .mobile-nav-item').forEach(el => {
            el.addEventListener('click', () => {
                const tab = el.getAttribute('data-tab');
                if (tab) window.showTab(tab);
            });
        });

        document.querySelectorAll('[data-quick-doc]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.loadDoc(el.getAttribute('data-quick-doc') || '');
            });
        });

        const bind = (id, fn) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', fn);
        };

        bind('btn-refresh-health', fetchHealth);
        bind('btn-refresh-ecosystem', fetchEcosystem);
        bind('btn-deep-scan', window.triggerScan);
        bind('koda-send', sendKodaMessage);

        if (elements.kodaInput) {
            elements.kodaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendKodaMessage();
                }
            });
        }

        fetchStats();
        fetchBacklog();
        fetchHealth();
        fetchEcosystem();
        fetchAuditLog();

        let statsTimer = null;
        let ecosystemTimer = null;

        const startPolling = () => {
            if (statsTimer) return;
            statsTimer = setInterval(fetchStats, POLL_INTERVAL_MS);
            ecosystemTimer = setInterval(fetchEcosystem, 120000);
        };

        const stopPolling = () => {
            if (statsTimer) {
                clearInterval(statsTimer);
                statsTimer = null;
            }
            if (ecosystemTimer) {
                clearInterval(ecosystemTimer);
                ecosystemTimer = null;
            }
        };

        startPolling();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopPolling();
            } else {
                fetchStats();
                startPolling();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.fetchEcosystem = fetchEcosystem;
    window.fetchBacklog = fetchBacklog;
    window.fetchHealth = fetchHealth;

})();
