import { useState, useEffect, useRef } from "react";
import { API_URL, MAX_MESSAGES, sendErrorMessage } from "./config";
import "./style/chat.css";
import refreshIcon from './vendors/refresh-icon.png';


function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function refreshChat(messages, setMessages = () => {}, setCanSend = () => {}) {

  if (messages.length === 0) {
    return;
  }
  setMessages([{ role: "bot", content: "Hi! How can I help you today?" }]);


  try {
    await fetch(`${API_URL}/api/chat`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId: localStorage.getItem('chat_id'),
      })
    });
  } catch (error) {
    console.error("Error:", error);
    sendErrorMessage('The bot encountered an error. Please refresh.');
    setCanSend(true);
    return;
  }
  
  setCanSend(true);
  localStorage.removeItem("chat_messages");
  localStorage.removeItem("chat_id");
}


export default function ChatPage() {
  // State for chat messages, each with a unique id
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [ { role: "bot", content: "Hi! How can I help you today?" } ];
  });

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const [input, setInput] = useState("");

  const [canSend, setCanSend] = useState(true);
  
  const [subtext, setSubtext] = useState("");

  const messagesEndRef = useRef(null);


  useEffect(() => { // Create a thinking indicator
    if (canSend) {
      setSubtext("");
      return;
    }
    const forms = ["Thinking", "Thinking.", "Thinking..", "Thinking..."];
    let index = 0;
    const interval = setInterval(() => {
      setSubtext(forms[index]);
      index = (index + 1) % forms.length;
    }, 300);

    return () => clearInterval(interval);
  }, [canSend]);

  const sendMessage = async () => {  // Handle sending a message

    if (!canSend) 
      return;
    setCanSend(false);
    
    if (messages.length >= MAX_MESSAGES * 2) { // To accommodate bot responses
      setMessages((prev) => [...prev, { role: "assistant", content: 'Message limit reached. Refreshing chat...' }]);
      setCanSend(false);
      setTimeout(async () => {
        await refreshChat(messages, setMessages, setCanSend);
      }, 2000);
      return;
    }


    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setInput("");
    let result;
    try {
      result = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: trimmedInput,
        chatId: localStorage.getItem('chat_id'),
      })
    });
    } catch (error) {
      console.error("Error:", error);
      sendErrorMessage('The bot encountered an error. Please refresh.');
      refreshChat(messages, setMessages, setCanSend);
      setCanSend(true);
      return;
    }

    const data = await result.json();
    
    if (!result.ok) {
      console.error("Error:", 'The bot encountered an error. Please refresh.');
      setMessages((prev) => [...prev, { role: "bot", content: 'The bot encountered an error. Please refresh.' }]);
      setCanSend(true);
      return;
    }

    if (!data || !data.reply) {
      setMessages((prev) => [...prev, { role: "bot", content: 'The bot encountered an error. Please refresh.' }]);
      setCanSend(true);
      return;
    }

    localStorage.setItem('chat_id', data.chatId);
    const botMsg = {
      role: "bot",
      content: data.reply,
    };

    setMessages((prev) => [...prev, botMsg]);

    setCanSend(true);
    
  };

  
  useEffect(() => { // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter key in input

  return (
    <section className="chat-section">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble-item ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))
        }
        <div ref={messagesEndRef} />
      </div>

      <p className="chat-subtext">{subtext}</p>
      <p className="chat-subtext">{clamp(Math.floor(MAX_MESSAGES - (messages.length - 1) / 2), 0, MAX_MESSAGES)} messages left</p>
      <form
        className="chat-input"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        autoComplete="on"
        >
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          />
        <button type="button" onClick={() => refreshChat(messages, setMessages, setCanSend)} className="refresh-button"><img src={refreshIcon} alt="Refresh" /></button>
        <button type="submit" disabled={!canSend} className={`send-button ${canSend ? '' : 'busy'}`}>Send</button>
      </form>
    </section>
  );
}
