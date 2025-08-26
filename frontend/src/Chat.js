import { useState, useEffect, useRef } from "react";
import { API_URL, MAX_MESSAGES, sendErrorMessage } from "./config";
import "./style/chat.css";
import refreshIcon from './vendors/refresh-icon.png';


async function refreshChat(setMessages = () => {}, setCanSend = () => {}) {
  setMessages([{ role: "bot", content: "Hi! How can I help you today?" }]);
  
  try {
    await fetch(`${API_URL}/api/chat`, {
      method: "DELETE",
      headers: {
        chatId: localStorage.getItem('chat_id'),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    sendErrorMessage('The bot encountered an error. Please try again later.');
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
      sendErrorMessage('Message limit reached. Refreshing chat...');
      refreshChat(setMessages, setCanSend);
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
        chatId: localStorage.getItem('chat_id'),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: trimmedInput }),
      });
    } catch (error) {
      console.error("Error:", error);
      sendErrorMessage('The bot encountered an error. Please try again later.');
      setCanSend(true);
      return;
    }

    const data = await result.json();
    
    if (!result.ok) {
      console.error("Error:", data?.error || 'The bot encountered an error. Please try again later.');
      setMessages((prev) => [...prev, { role: "bot", content: data?.error || 'The bot encountered an error. Please try again later.' }]);
      setCanSend(true);
      return;
    }

    if (!data || !data.body.reply) {
      setMessages((prev) => [...prev, { role: "bot", content: 'The bot encountered an error. Please try again later.' }]);
      setCanSend(true);
      return;
    }

    localStorage.setItem('chat_id', data.body.chatId);
    const botMsg = {
      role: "bot",
      content: data.body.reply,
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
        <button type="button" onClick={() => refreshChat(setMessages, setCanSend)} className="refresh-button"><img src={refreshIcon} alt="Refresh" /></button>
        <button type="submit" disabled={!canSend} className={`send-button ${canSend ? '' : 'busy'}`}>Send</button>
      </form>
    </section>
  );
}
