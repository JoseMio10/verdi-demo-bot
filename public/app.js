// ============ Verdi Bot Frontend ============

const messagesEl = document.getElementById('messages');
const formEl = document.getElementById('chatForm');
const inputEl = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const suggestedEl = document.getElementById('suggestedQuestions');

// Conversación in-memory
let conversation = [];

// ============ Mensaje de bienvenida ============
const welcomeMessage = {
  role: 'assistant',
  content: '¡Hola! 🌿 Soy *Verdi*, el asistente de **Inversiones Verdi**. Estoy aquí para ayudarte con cualquier consulta sobre nuestros suplementos naturales, envíos, pagos y más.\n\n¿En qué te puedo ayudar hoy?'
};

function init() {
  renderMessage(welcomeMessage);
  inputEl.focus();
}

// ============ Render mensaje ============
function renderMessage(msg) {
  const wrap = document.createElement('div');
  wrap.className = `message ${msg.role === 'user' ? 'user' : 'bot'}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = formatContent(msg.content);

  const time = document.createElement('div');
  time.className = 'timestamp';
  time.textContent = formatTime();

  wrap.appendChild(bubble);
  wrap.appendChild(time);
  messagesEl.appendChild(wrap);
  scrollToBottom();
}

function formatContent(text) {
  // Escape HTML, then re-allow basic markdown-like formatting
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    // **bold**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // *bold* (single asterisk - WhatsApp style)
    .replace(/(?<!\w)\*([^\*\n]+?)\*(?!\w)/g, '<strong>$1</strong>')
    // _italic_
    .replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '<em>$1</em>')
    // links [text](url)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // bare URLs
    .replace(/(?<!["\(>=])(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

function formatTime() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// ============ Typing indicator ============
function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'message bot';
  wrap.id = 'typingIndicator';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `<div class="typing">
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  </div>`;

  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  scrollToBottom();
}

function hideTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

// ============ Envío al backend ============
async function sendMessage(text) {
  // Agregar a la UI
  const userMsg = { role: 'user', content: text };
  conversation.push(userMsg);
  renderMessage(userMsg);

  inputEl.value = '';
  sendBtn.disabled = true;
  showTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }

    const data = await res.json();
    hideTyping();

    const botMsg = { role: 'assistant', content: data.reply };
    conversation.push(botMsg);
    renderMessage(botMsg);

  } catch (e) {
    hideTyping();
    renderMessage({
      role: 'assistant',
      content: `⚠️ Disculpa, tuve un problema técnico: ${e.message}\n\nIntenta de nuevo en un momento.`
    });
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

// ============ Eventos ============
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  sendMessage(text);
});

suggestedEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  const q = chip.dataset.q;
  if (q) sendMessage(q);
});

resetBtn.addEventListener('click', () => {
  if (confirm('¿Empezar una conversación nueva?')) {
    conversation = [];
    messagesEl.innerHTML = '';
    renderMessage(welcomeMessage);
    inputEl.focus();
  }
});

// Ctrl+Enter to send
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    formEl.requestSubmit();
  }
});

init();
