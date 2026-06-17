/**
 * KODA — governance RAG chat (read-only assistant).
 * Provider: OpenRouter (preferred) or Gemini direct.
 */

const MAX_CONTEXT_CHARS = 100_000;
const MAX_MESSAGE_CHARS = 8_000;

const KODA_SYSTEM_BASE = `You are KODA, the governance assistant for FlexGrafik VCMS (Versioned Content Management & Supervision).

ROLE:
- Help the Commander analyze ecosystem docs, scan results, handoffs, and SSoT status.
- Explain systems, conflicts, and workflows from the provided context.
- You are READ-ONLY: you do NOT deploy, edit repos, or execute agent tasks.

BOUNDARIES:
- VCMS = Governance / supervision (this system).
- Agent OS UI = Execution + HITL (approve deploys, run agents).
- Never claim you changed code or deployed anything.

STYLE:
- Concise, technical, ADHD-friendly: what → why → next step.
- Polish when the user writes in Polish; English for code paths and file names.
- Cite doc paths when relevant (e.g. docs/ecosystem/conflicts.md).

CONTEXT (RAG — truncated if large):
`;

function normalizeMessages(messages) {
  return messages
    .map((m) => {
      const text = (m.parts?.[0]?.text ?? m.content ?? m.text ?? '').slice(0, MAX_MESSAGE_CHARS);
      let role = m.role;
      if (role === 'model') role = 'assistant';
      if (role !== 'user' && role !== 'assistant') role = 'assistant';
      return { role, content: text };
    })
    .filter((m) => m.content.trim().length > 0);
}

function buildSystemPrompt(contextData) {
  let block = JSON.stringify(contextData);
  if (block.length > MAX_CONTEXT_CHARS) {
    block = block.slice(0, MAX_CONTEXT_CHARS) + '\n...[context truncated]';
  }
  return KODA_SYSTEM_BASE + block;
}

function mapUpstreamError(status, bodyText) {
  const lower = (bodyText || '').toLowerCase();
  if (status === 403 && (lower.includes('leaked') || lower.includes('permission_denied'))) {
    return 'LLM odrzucił wejście (klucz API zablokowany upstream). Wygeneruj nowy klucz w .env.';
  }
  if (status === 402 || lower.includes('insufficient credits')) {
    return 'Brak kredytów OpenRouter — doładuj konto lub ustaw OPENROUTER_MODEL=openrouter/free w .env.';
  }
  if (status === 429) {
    return 'Limit zapytań LLM — spróbuj za chwilę.';
  }
  try {
    const parsed = JSON.parse(bodyText || '{}');
    const msg = parsed?.error?.message;
    if (msg) return `LLM upstream: ${msg}`;
  } catch {}
  return 'LLM niedostępny — sprawdź klucz API i OPENROUTER_MODEL w .env.';
}

function resolveOpenRouterModel() {
  const env = process.env.OPENROUTER_MODEL?.trim();
  if (!env || env === 'openrouter/auto') return 'openrouter/free';
  return env;
}

async function chatWithOpenRouter(normalized, systemPrompt, apiKey) {
  const model = resolveOpenRouterModel();
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.VCMS_PUBLIC_URL || 'https://cmd.flexgrafik.nl',
      'X-Title': 'FlexGrafik VCMS KODA',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...normalized],
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    const err = new Error(mapUpstreamError(res.status, raw));
    err.status = res.status >= 500 ? 502 : 502;
    throw err;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Nieprawidłowa odpowiedź OpenRouter.');
  }

  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Pusta odpowiedź modelu.');
  return { text, provider: 'openrouter', model };
}

async function chatWithGemini(normalized, systemPrompt, apiKey) {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const contents = normalized.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    const err = new Error(mapUpstreamError(res.status, raw));
    err.status = 502;
    throw err;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Nieprawidłowa odpowiedź Gemini.');
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Pusta odpowiedź modelu.');
  return { text, provider: 'gemini', model };
}

async function runKodaChat(messages, contextData) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openRouterKey && !geminiKey) {
    return {
      ok: false,
      status: 503,
      error:
        'LLM nie skonfigurowany — ustaw OPENROUTER_API_KEY lub GEMINI_API_KEY w .env na serwerze.',
    };
  }

  const normalized = normalizeMessages(messages);
  if (normalized.length === 0) {
    return { ok: false, status: 400, error: 'Brak treści wiadomości.' };
  }

  const systemPrompt = buildSystemPrompt(contextData);

  try {
    const result = openRouterKey
      ? await chatWithOpenRouter(normalized, systemPrompt, openRouterKey)
      : await chatWithGemini(normalized, systemPrompt, geminiKey);

    return {
      ok: true,
      message: {
        role: 'model',
        parts: [{ text: result.text }],
      },
      provider: result.provider,
      model: result.model,
    };
  } catch (err) {
    return {
      ok: false,
      status: err.status || 502,
      error: err.message || 'Błąd komunikacji z LLM.',
    };
  }
}

module.exports = {
  runKodaChat,
  normalizeMessages,
  buildSystemPrompt,
  MAX_MESSAGE_CHARS,
};
