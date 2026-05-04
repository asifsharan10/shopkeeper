(function () {
  const SHOPKEEPER_API = "https://shopkeeper-api.onrender.com";
  const API_KEY = document.currentScript.getAttribute("data-api-key") || "";
  let sessionId = null;
  let isOpen = false;
  let chatHistory = [];
  let isTyping = false;

  async function initWidget() {
    let color = "#2563eb";
    let welcome = "Hi there! 👋 How can I help you today?";

    try {
      const res = await fetch(`${SHOPKEEPER_API}/store-config`, {
        headers: { "x-api-key": API_KEY }
      });
      const config = await res.json();
      color = config.widget_color || color;
      welcome = config.welcome_message || welcome;
    } catch (e) {}

    buildWidget(color, welcome);
  }

  function buildWidget(color, welcome) {
    const style = document.createElement("style");
    style.innerHTML = `
      #sk-bubble {
        position: fixed; bottom: 24px; right: 24px;
        width: 52px; height: 52px; border-radius: 50%;
        background: ${color}; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 99999; transition: transform 0.2s;
      }
      #sk-bubble:hover { transform: scale(1.08); }
      #sk-bubble svg { width: 26px; height: 26px; fill: white; }
      #sk-window {
        position: fixed; bottom: 90px; right: 24px;
        width: 340px; height: 480px;
        background: white; border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        display: none; flex-direction: column;
        z-index: 99999; font-family: sans-serif;
        overflow: hidden;
      }
      #sk-window.open { display: flex; }
      #sk-header {
        background: ${color}; color: white;
        padding: 14px 18px; font-size: 15px;
        font-weight: 500; display: flex;
        justify-content: space-between; align-items: center;
      }
      #sk-header span { font-size: 13px; opacity: 0.85; }
      #sk-close { cursor: pointer; font-size: 20px; line-height: 1; opacity: 0.8; }
      #sk-close:hover { opacity: 1; }
      #sk-messages {
        flex: 1; overflow-y: auto;
        padding: 14px; display: flex;
        flex-direction: column; gap: 10px;
      }
      .sk-msg {
        max-width: 80%; padding: 9px 13px;
        border-radius: 14px; font-size: 13px; line-height: 1.5;
      }
      .sk-msg.bot {
        background: #f1f5f9; color: #1e293b;
        align-self: flex-start; border-bottom-left-radius: 4px;
      }
      .sk-msg.user {
        background: ${color}; color: white;
        align-self: flex-end; border-bottom-right-radius: 4px;
      }
      .sk-typing {
        display: flex; gap: 4px; align-items: center;
        padding: 9px 13px; background: #f1f5f9;
        border-radius: 14px; border-bottom-left-radius: 4px;
        align-self: flex-start; width: fit-content;
      }
      .sk-typing span {
        width: 7px; height: 7px; background: #94a3b8;
        border-radius: 50%; animation: sk-bounce 1.2s infinite;
      }
      .sk-typing span:nth-child(2) { animation-delay: 0.2s; }
      .sk-typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes sk-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
      #sk-input-area {
        display: flex; gap: 8px;
        padding: 12px; border-top: 1px solid #e2e8f0;
      }
      #sk-input {
        flex: 1; border: 1px solid #e2e8f0;
        border-radius: 20px; padding: 8px 14px;
        font-size: 13px; outline: none; font-family: sans-serif;
      }
      #sk-input:focus { border-color: ${color}; }
      #sk-send {
        background: ${color}; color: white;
        border: none; border-radius: 50%;
        width: 36px; height: 36px;
        cursor: pointer; font-size: 16px;
        display: flex; align-items: center; justify-content: center;
      }
      #sk-send:hover { opacity: 0.9; }
      #sk-footer {
        text-align: center; font-size: 10px;
        color: #94a3b8; padding: 0 0 10px;
      }
    `;
    document.head.appendChild(style);

    const bubble = document.createElement("div");
    bubble.id = "sk-bubble";
    bubble.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>`;

    const win = document.createElement("div");
    win.id = "sk-window";
    win.innerHTML = `
      <div id="sk-header">
        <div>
          <div>Shopkeeper AI</div>
          <span>Ask me anything about our store</span>
        </div>
        <div id="sk-close">✕</div>
      </div>
      <div id="sk-messages">
        <div class="sk-msg bot">${welcome}</div>
      </div>
      <div id="sk-input-area">
        <input id="sk-input" type="text" placeholder="Type a message..." />
        <button id="sk-send">➤</button>
      </div>
      <div id="sk-footer">Powered by Shopkeeper</div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    bubble.addEventListener("click", () => {
      isOpen = !isOpen;
      win.classList.toggle("open", isOpen);
      if (isOpen) document.getElementById("sk-input").focus();
    });

    document.getElementById("sk-close").addEventListener("click", () => {
      isOpen = false;
      win.classList.remove("open");
    });

    document.getElementById("sk-input").addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    document.getElementById("sk-send").addEventListener("click", sendMessage);
  }

  async function sendMessage() {
    const input = document.getElementById("sk-input");
    const message = input.value.trim();
    if (!message || isTyping) return;

    input.value = "";
    addMessage(message, "user");
    chatHistory.push({ role: "user", content: message });
    showTyping();

    try {
      const res = await fetch(`${SHOPKEEPER_API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify({
          message,
          chat_history: chatHistory.slice(-6),
          session_id: sessionId
        })
      });

      const data = await res.json();
      if (data.session_id) sessionId = data.session_id;
      hideTyping();

      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";
      addMessage(reply, "bot");
      chatHistory.push({ role: "assistant", content: reply });

    } catch (err) {
      hideTyping();
      addMessage("Connection error. Please try again.", "bot");
    }
  }

  function addMessage(text, role) {
    const messages = document.getElementById("sk-messages");
    const div = document.createElement("div");
    div.className = `sk-msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    isTyping = true;
    const messages = document.getElementById("sk-messages");
    const div = document.createElement("div");
    div.className = "sk-typing";
    div.id = "sk-typing";
    div.innerHTML = `<span></span><span></span><span></span>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    isTyping = false;
    const el = document.getElementById("sk-typing");
    if (el) el.remove();
  }

  initWidget();
})();