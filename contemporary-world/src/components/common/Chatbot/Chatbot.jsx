import { useState, useRef, useEffect } from "react";
import { config } from "../../../config";
import "./Chatbot.css";

const SYSTEM_PROMPT = `You are a helpful and knowledgeable AI tutor for the college course 'The Contemporary World'. Your task is to help the user understand global themes, globalization, global governance, media and technology, global divisions, global cities, global culture, migration, food security, agriculture, and sustainable development.
Maintain an academic, encouraging, engaging, and clear tone. Provide structured answers using simple formatting (like bullet points or short paragraphs) when explaining complex concepts, and ensure the explanations remain highly relevant to contemporary world issues and academic discussions. Keep responses concise so they fit well in a chat window.`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm KyleGPT, your Contemporary World AI tutor. Ask me anything about globalization, migration, global cities, media, or any topic covered in our syllabus!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat when messages update or open/close toggles
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");

    const newMessages = [
      ...messages,
      {
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Map history to OpenAI format expected by Groq
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...newMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        }))
      ];

      const response = await fetch(config.groq.endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.groq.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: config.groq.model,
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0]?.message?.content || "I couldn't process that request.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (error) {
      console.error("Chatbot API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm experiencing connectivity issues reaching the Groq AI service. Please make sure your internet is working or try again in a few moments.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? "chat-open" : "chat-closed"}`}>
      {/* Floating Action Button (FAB) */}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat assistant"
        data-tooltip="Ask KyleGPT"
      >
        {isOpen ? (
          // Close Icon
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // KyleGPT Image Icon
          <img src="/kylegpt.png" alt="KyleGPT" className="fab-icon-img" />
        )}
      </button>
      <span className="chatbot-tooltip">Ask KyleGPT</span>

      {/* Floating Chat Panel */}
      <div className="chatbot-panel">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <img src="/kylegpt.png" alt="KyleGPT" className="header-avatar-img" />
            </div>
            <div>
              <h4 className="chat-header-title">KyleGPT</h4>
              <div className="chat-status">
                <span className="status-dot"></span>
                <span>Active now</span>
              </div>
            </div>
          </div>
          <button 
            className="chat-close-btn" 
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Messages list */}
        <div className="chat-messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender === "user" ? "row-user" : "row-bot"}`}>
              {msg.sender === "bot" && (
                <div className="message-avatar">
                  <img src="/kylegpt.png" alt="KyleGPT" className="message-avatar-img" />
                </div>
              )}
              <div className="message-content-wrapper">
                <div className="message-bubble">
                  <p className="message-text">{msg.text}</p>
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message-row row-bot">
              <div className="message-avatar">
                <img src="/kylegpt.png" alt="KyleGPT" className="message-avatar-img" />
              </div>
              <div className="message-content-wrapper">
                <div className="message-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="chat-input-form">
          <input 
            type="text" 
            placeholder="Ask a question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            className="chat-input-field"
            maxLength={1000}
          />
          <button 
            type="submit" 
            className="chat-send-btn" 
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
