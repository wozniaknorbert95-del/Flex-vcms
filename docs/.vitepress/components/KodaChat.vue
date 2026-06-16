<template>
  <div class="koda-chat-container">
    <div class="chat-header">
      <h2>KODA — Governance Assistant</h2>
      <span class="koda-badge">RAG · read-only</span>
    </div>
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
        <div class="content" v-html="formatMarkdown(msg.parts[0].text)"></div>
      </div>
      <div v-if="loading" class="message model loading">KODA myśli…</div>
    </div>
    <div class="chat-input">
      <textarea
        v-model="input"
        :disabled="loading"
        placeholder="Zapytaj o konflikty SSoT, mapę ekosystemu, handoffy…"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button :disabled="loading || !input.trim()" @click="sendMessage">Wyślij</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { marked } from 'marked';

const messages = ref([
  {
    role: 'model',
    parts: [{
      text: 'Cześć — jestem KODA, asystent governance FlexGrafik. Pomogę przeanalizować docs, logi i SSoT. Nie deployuję ani nie edytuję kodu — do egzekucji użyj Agent OS UI.'
    }]
  }
]);
const input = ref('');
const loading = ref(false);
const chatBox = ref(null);

const formatMarkdown = (text) => marked.parse(text || '');

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
};

const sendMessage = async () => {
  const text = input.value.trim();
  if (!text || loading.value) return;

  messages.value.push({ role: 'user', parts: [{ text }] });
  input.value = '';
  loading.value = true;
  await scrollToBottom();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.value })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Błąd serwera (${res.status})`);
    }

    const reply = data.message?.parts?.[0]?.text || 'Brak treści odpowiedzi.';
    messages.value.push({ role: 'model', parts: [{ text: reply }] });
  } catch (err) {
    messages.value.push({
      role: 'model',
      parts: [{ text: `**Błąd:** ${err.message || 'Nie udało się połączyć z KODA.'}` }]
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
};
</script>

<style scoped>
.koda-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100dvh - 140px);
  max-height: 850px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background-color: #0b0d12;
  border: 1px solid #252937;
  border-radius: 8px;
  overflow: hidden;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

.koda-chat-container ::v-deep(p) {
  margin: 0 0 10px 0;
}
.koda-chat-container ::v-deep(pre) {
  background: #050608;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  border: 1px solid #252937;
}
.koda-chat-container ::v-deep(code) {
  background: #050608;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
}

.chat-header {
  background-color: #11141b;
  padding: 14px 20px;
  border-bottom: 1px solid #252937;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.chat-header h2 {
  margin: 0;
  font-size: 1rem;
  color: #e5e7ef;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-family: "JetBrains Mono", ui-monospace, monospace;
}

.koda-badge {
  font-size: 0.7rem;
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.45);
  background: rgba(168, 85, 247, 0.1);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  text-transform: uppercase;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background-color: #050608;
}

.message {
  max-width: 85%;
  padding: 12px 14px;
  border-radius: 6px;
  font-size: 0.95rem;
  line-height: 1.55;
  color: #e5e7ef;
}

.message.user {
  align-self: flex-end;
  background-color: rgba(168, 85, 247, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.35);
}

.message.model {
  align-self: flex-start;
  background-color: #11141b;
  border: 1px solid #252937;
  border-left: 3px solid #a855f7;
}

.message.loading {
  color: #9ca3c7;
  font-style: italic;
}

.chat-input {
  display: flex;
  padding: 14px 16px;
  background-color: #11141b;
  border-top: 1px solid #252937;
  gap: 10px;
  align-items: flex-end;
}

.chat-input textarea {
  flex: 1;
  resize: vertical;
  background-color: #050608;
  color: #e5e7ef;
  border: 1px solid #252937;
  border-radius: 6px;
  padding: 10px 12px;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 0.88rem;
  outline: none;
  min-height: 52px;
}

.chat-input textarea:focus {
  border-color: #a855f7;
}

.chat-input button {
  background-color: #8b5cf6;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0 20px;
  min-height: 44px;
  font-weight: 600;
  cursor: pointer;
}

.chat-input button:hover:not(:disabled) {
  background-color: #7c3aed;
}

.chat-input button:disabled {
  background-color: #252937;
  color: #6b7280;
  cursor: not-allowed;
}

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #050608; }
::-webkit-scrollbar-thumb { background: #252937; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #3a3f55; }
</style>
