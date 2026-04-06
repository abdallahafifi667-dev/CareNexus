import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle, X, Send, Sparkles, Navigation } from "lucide-react";
import { GeminiAPI } from "../../../../utils/gemini";
import "./GlobalAssistant.scss";

const GlobalAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const chatEndRef = useRef(null);
  const assistantRef = useRef(null);

  const language = i18n.language;

  // Handle resize to track mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        assistantRef.current &&
        !assistantRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          text:
            language === "ar"
              ? "مرحباً! أنا مساعد CareNexus الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني تحويلك لأي صفحة أو الإجابة على استفساراتك."
              : "Hello! I am CareNexus AI Assistant. How can I help you today? I can guide you to any page or answer your questions.",
          isBot: true,
        },
      ]);
    }
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const prompt = `
            You are a navigation and information assistant for "CareNexus" - a premium healthcare platform.
            Current Page: ${location.pathname}
            User Language: ${language}

            CareNexus Pages/Paths:
            - Home: /
            - About: /about
            - Services: /services
            - Support: /support
            - Medical AI (Pill/X-ray Analysis): /medical-ai
            - Contact: /contact
            - FAQ: /faq
            - Login: /auth/login
            - Register: /auth/register

            Task:
            1. If the user wants to go to a specific page or section (e.g., "وديني للدعم", "أبي أسجل", "Go to contact"), detect the path.
            2. Provide a helpful response in ${language === "ar" ? "Arabic" : "English"}.
            3. If a navigation is detected, append [NAV: path] at the end of your message.

            Examples:
            User: "وديني لصفحة الدعم"
            Response: "بكل سرور، سأقوم بتحويلك لمركز الدعم الآن. [NAV: /support]"

            User: "Tell me about CareNexus"
            Response: "CareNexus is an advanced healthcare platform that bridge the gap between patients and technology..."

            Keep it concise and premium.
            `;

      const responseText = await GeminiAPI.sendMessage(input, {
        hasContext: true,
        analysis: prompt,
      });

      const navMatch = responseText.match(/\[NAV: (.*?)\]/);
      const cleanText = responseText.replace(/\[NAV: .*?\]/, "").trim();

      const botMsg = {
        id: Date.now() + 1,
        text: cleanText,
        isBot: true,
        nav: navMatch ? navMatch[1] : null,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (navMatch) {
        setTimeout(() => {
          navigate(navMatch[1]);
        }, 1500);
      }
    } catch (error) {
      console.error("Assistant Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text:
            language === "ar"
              ? "عذراً، واجهت مشكلة تقنية."
              : "Sorry, I encountered an error.",
          isBot: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Hide on Knowledge AI page for mobile users
  if (location.pathname.includes("knowledge-ai") && isMobile) {
    return null;
  }

  return (
    <div className="global-assistant-container" ref={assistantRef}>
      {isOpen && (
        <div className="assistant-window">
          <div className="window-header">
            <div className="info">
              <h3>CareNexus Assistant</h3>
              <p>
                {isTyping
                  ? language === "ar"
                    ? "جاري التفكير..."
                    : "Thinking..."
                  : language === "ar"
                    ? "متصل"
                    : "Online"}
              </p>
            </div>
          </div>

          <div className="chat-area">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`assistant-message ${msg.isBot ? "bot" : "user"}`}
              >
                {msg.text}
                {msg.nav && (
                  <div className="nav-hint">
                    <Navigation size={12} />
                    <span>
                      {language === "ar" ? "جاري التحويل..." : "Redirecting..."}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {isTyping && <div className="assistant-message bot">...</div>}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                language === "ar" ? "اسألني أي شيء..." : "Ask me anything..."
              }
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        className={`assistant-toggle ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
};

export default GlobalAssistant;
