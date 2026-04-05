import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchKnowledge } from "../stores/knowledgeService";
import { setHeaderTitle } from "../../Doctor/stores/doctorSlice";
import "./KnowledgeAI.scss";
import { Send, Stethoscope } from "lucide-react";

const KnowledgeAI = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [chatHistory, setChatHistory] = useState([
    {
      id: "welcome",
      text: "WELCOME_KEY",
      sender: "ai",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    dispatch(
      setHeaderTitle(t("nav.knowledge_ai", { defaultValue: "Knowledge AI" })),
    );
  }, [dispatch, t]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const currentQuery = query.trim();
    setQuery("");

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      text: currentQuery,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMsg]);

    // 2. Perform Search
    setIsLoading(true);
    try {
      const response = await searchKnowledge({
        query: currentQuery,
        lang: i18n.language,
      });
      const results = response.results || [];

      // 3. Add AI Response
      let aiResponseText = t(
        "knowledge.found_results",
        "لقد وجدت بعض المعلومات المتعلقة ببحثك:",
      );
      if (results.length === 0) {
        aiResponseText = t(
          "knowledge.no_results",
          "عذراً، لم أجد معلومات واضحة حول هذا الموضوع في قاعدة بياناتي حالياً.",
        );
      }

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: aiResponseText,
          sender: "ai",
          results: results,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t(
            "knowledge.error",
            "حدث خطأ أثناء محاولة البحث. يرجى المحاولة مرة أخرى.",
          ),
          sender: "ai",
          results: [],
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="knowledge-ai-page">
      <div className="knowledge-container">
        <div className="chat-header">
          <div className="ai-icon">
            <Stethoscope size={26} />
          </div>
          <div className="header-info">
            <h2>{t("knowledge.title", "المساعد الطبي الذكي")}</h2>
            <p className="status-line">
              <span className="status-dot" />
              {t("knowledge.status", "متاح لمساعدتك 24/7")}
            </p>
          </div>
        </div>

        <div className="messages-area">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="msg-bubble">
                {msg.text === "WELCOME_KEY"
                  ? t("knowledge.welcome_message")
                  : msg.text}

                {msg.results && msg.results.length > 0 && (
                  <div className="results-grid">
                    {msg.results.map((res, idx) => (
                      <div key={idx} className="result-card">
                        <div className="result-header">
                          <span className={`source-badge source-${res.source}`}>
                            {res.source === "wikipedia"
                              ? "📖 Wikipedia"
                              : res.source === "openFDA"
                                ? "💊 OpenFDA"
                                : res.source === "local"
                                  ? "🏥 قاعدة البيانات"
                                  : "🤖 AI"}
                          </span>
                          {res.title && res.title !== msg.text && (
                            <h4 className="result-title">{res.title}</h4>
                          )}
                        </div>
                        <div className="result-content">
                          {res.content
                            ?.split("\n")
                            .filter((p) => p.trim())
                            .map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="msg-bubble flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSearch}>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder={t(
                "knowledge.input_placeholder",
                "اسأل عن دواء، مرض، أو نصيحة طبية...",
              )}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="send-btn" disabled={isLoading || !query.trim()}>
              <Send size={18} />
              <span>{t("medical_ai.chat.send")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KnowledgeAI;
