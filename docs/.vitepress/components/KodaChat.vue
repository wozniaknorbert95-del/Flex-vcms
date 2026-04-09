<template>
  <div class="koda-chat-container">
    <div class="chat-header">
      <h2>🤖 KODA - Vibe Coding Mentor</h2>
    </div>
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role]">
        <div class="content" v-html="formatMarkdown(msg.parts[0].text)"></div>
      </div>
      <div v-if="isLoading" class="message model loading">
        <div class="content">Piszę...</div>
      </div>
    </div>
    <div class="chat-input">
      <textarea 
        v-model="input" 
        @keydown.enter.prevent="sendMessage"
        placeholder="Napisz do Kody... (Enter by wysłać)"
      ></textarea>
      <button @click="sendMessage" :disabled="isLoading || !input.trim()">Wyślij</button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { marked } from 'marked';

const endpoint = '/api/chat';

// System prompt i pełny kontekst (VCMS docs + moduły) ustawia wyłącznie backend: server.js → Gemini system_instruction.

const messages = ref([
  { role: 'model', parts: [{ text: 'Zrozumiałem wytyczne Dowódco. System KODA Web-App zainicjalizowany ze zintegrowanym kluczem API. Na ile masz dziś energię 1–10? Na co masz dziś ochotę robić?' }] }
]);
const input = ref('');
const isLoading = ref(false);
const chatBox = ref(null);

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
};

const formatMarkdown = (text) => {
  return marked.parse(text);
};

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return;
  
  const userMsg = input.value.trim();
  messages.value.push({ role: 'user', parts: [{ text: userMsg }] });
  input.value = '';
  isLoading.value = true;
  await scrollToBottom();
  
  try {
    const payloadHistory = messages.value.map(m => ({
        role: m.role,
        parts: [{ text: m.parts[0].text }]
    }));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: payloadHistory
      })
    });
    
    if (!response.ok) {
       const errBody = await response.text();
       throw new Error(`API Error: ${response.status} - ${errBody}`);
    }
    
    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      const gptMsg = data.candidates[0].content.parts[0].text;
      messages.value.push({ role: 'model', parts: [{ text: gptMsg }] });
    } else {
      throw new Error("No response content");
    }
  } catch (e) {
    console.error(e);
    messages.value.push({ role: 'model', parts: [{ text: `Wystąpił błąd systemu komunikacji z centralą Gemini: ${e.message}` }] });
  } finally {
    isLoading.value = false;
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
  background-color: #111;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  font-family: var(--vp-font-family-base, 'Inter', sans-serif);
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.koda-chat-container ::v-deep(p) {
  margin: 0 0 10px 0;
}
.koda-chat-container ::v-deep(pre) {
  background: #000;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
.koda-chat-container ::v-deep(code) {
  background: #000;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}

.chat-header {
  background-color: #0A0A0A;
  padding: 16px 20px;
  border-bottom: 1px solid #333;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #0d0d0d;
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.5;
  color: #e5e7eb;
}

.message.user {
  align-self: flex-end;
  background-color: #2b2b2b;
  border: 1px solid #444;
}

.message.model {
  align-self: flex-start;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-left: 4px solid #10b981;
}

.message.loading {
  color: #888;
  font-style: italic;
  border-left: 4px solid #888;
}

.chat-input {
  display: flex;
  padding: 16px;
  background-color: #0A0A0A;
  border-top: 1px solid #333;
  gap: 12px;
}

.chat-input textarea {
  flex: 1;
  resize: none;
  background-color: #1a1a1a;
  color: #fff;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 12px;
  font-family: inherit;
  font-size: 1rem;
  outline: none;
  height: 60px;
  transition: border-color 0.2s;
}

.chat-input textarea:focus {
  border-color: #10b981;
}

.chat-input button {
  background-color: #10b981;
  color: #000;
  border: none;
  border-radius: 6px;
  padding: 0 24px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background-color: #059669;
}

.chat-input button:disabled {
  background-color: #333;
  color: #666;
  cursor: not-allowed;
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0A0A0A; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #444; }
</style>
