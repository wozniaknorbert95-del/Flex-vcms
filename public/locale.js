/**
 * VCMS dashboard locale — ?locale=en|pl, default pl
 */
(function (global) {
    'use strict';

    const SUPPORTED = ['pl', 'en'];
    const DEFAULT_LOCALE = 'pl';
    let strings = {};
    let currentLocale = DEFAULT_LOCALE;

    function resolveLocale() {
        const params = new URLSearchParams(window.location.search);
        const fromQuery = params.get('locale');
        if (fromQuery && SUPPORTED.includes(fromQuery)) return fromQuery;
        const stored = localStorage.getItem('vcms_locale');
        if (stored && SUPPORTED.includes(stored)) return stored;
        return DEFAULT_LOCALE;
    }

    async function loadLocale(locale) {
        const res = await fetch(`/locales/${locale}.json`);
        if (!res.ok) throw new Error(`Locale load failed: ${locale}`);
        strings = await res.json();
        currentLocale = locale;
        document.documentElement.lang = locale;
        if (new URLSearchParams(window.location.search).has('locale')) {
            localStorage.setItem('vcms_locale', locale);
        }
    }

    function t(key, fallback) {
        if (strings[key] !== undefined) return strings[key];
        return fallback !== undefined ? fallback : key;
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val) el.textContent = val;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            const val = t(key);
            if (val) el.setAttribute('placeholder', val);
        });
        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const key = el.getAttribute('data-i18n-title');
            const val = t(key);
            if (val) el.setAttribute('title', val);
        });
        document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
            const key = el.getAttribute('data-i18n-aria');
            const val = t(key);
            if (val) el.setAttribute('aria-label', val);
        });
    }

    async function initLocale() {
        const locale = resolveLocale();
        await loadLocale(locale);
        applyI18n();
        return locale;
    }

    function apiQuery() {
        return `locale=${currentLocale}`;
    }

    global.VCMS_LOCALE = {
        init: initLocale,
        t,
        applyI18n,
        get locale() { return currentLocale; },
        apiQuery
    };
})(window);
