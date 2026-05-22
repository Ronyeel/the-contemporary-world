import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import mammoth from "mammoth";
import { config } from "../../../config";
import "./Chatbot.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

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
  const [attachedFile, setAttachedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please select a file under 5MB.");
      return;
    }

    setAttachedFile(file);
    setIsExtracting(true);

    try {
      let text = "";
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === "application/pdf") {
        const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
          // Break early if we've already exceeded the limit safely
          if (text.length > 30000) break;
        }
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.name.endsWith(".docx")
      ) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        alert("Unsupported file type. Please upload a PDF or DOCX.");
        setAttachedFile(null);
        setIsExtracting(false);
        return;
      }

      // Truncate to ~25,000 chars to avoid exceeding token limits, approx 6k tokens
      if (text.length > 25000) {
        text = text.substring(0, 25000) + "... [Content Truncated]";
      }
      setExtractedText(text);
    } catch (error) {
      console.error("File extraction error:", error);
      alert("Failed to extract text from the file.");
      setAttachedFile(null);
      setExtractedText("");
    } finally {
      setIsExtracting(false);
      // Reset input so the same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    setExtractedText("");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() && !extractedText) return;

    const userText = inputValue.trim();
    setInputValue("");

    const newMessages = [
      ...messages,
      {
        sender: "user",
        text: userText || "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        file: attachedFile ? { name: attachedFile.name, size: attachedFile.size } : null
      }
    ];
    setMessages(newMessages);
    setIsTyping(true);

    // If there is an attachment, construct a special prompt payload invisibly
    let finalPayloadText = userText;
    if (extractedText) {
      finalPayloadText = `[Context from attached document "${attachedFile.name}"]:\n${extractedText}\n\n[Instruction]: Extract the main ideas from the document if requested, or use the context to answer the following user question:\n[User Question]: ${userText || "What is this document about?"}`;
      removeAttachment(); // clear attachment after sending
    }

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        // Use all previous messages
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text
        })),
        // Add the new message with context if any
        {
          role: "user",
          content: finalPayloadText
        }
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
                {/* File attachment bubble */}
                {msg.file && (
                  <div className="message-file-bubble">
                    <div className="message-file-icon">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div className="message-file-info">
                      <span className="message-file-name">{msg.file.name}</span>
                      <span className="message-file-size">{(msg.file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                )}
                {/* Text bubble (only if there is text) */}
                {msg.text && (
                  <div className="message-bubble">
                    <p className="message-text">{msg.text}</p>
                  </div>
                )}
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

        {/* Input Form Wrapper */}
        <div className="chat-input-wrapper">
          {/* Attachment Preview */}
          {attachedFile && (
            <div className="chat-attachment-preview">
              <span title={attachedFile.name}>
                📄 {attachedFile.name} {isExtracting && "(Processing...)"}
              </span>
              <button 
                className="chat-attachment-remove" 
                onClick={removeAttachment}
                title="Remove attachment"
                disabled={isExtracting}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="chat-input-form">
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="chat-attach-container">
              <button 
                type="button" 
                className="chat-attach-btn" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping || isExtracting}
                aria-label="Attach file"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <div className="chat-attach-tooltip">
                <strong>Supported:</strong> PDF, DOCX (Max 5MB)<br/>
                <span style={{opacity: 0.8, fontSize: '0.7rem'}}>*Long documents are truncated to ~15 pages to balance AI tokens.</span>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Ask a question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping || isExtracting}
              className="chat-input-field"
              maxLength={1000}
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={(!inputValue.trim() && !attachedFile) || isTyping || isExtracting}
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
    </div>
  );
};

export default Chatbot;
