import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Stethoscope, Bot, User } from 'lucide-react';
import './KnowledgeAI.scss';
import { mockKnowledgeAIResponse } from '../mockData';

const KnowledgeAI = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'ai', text: t('knowledge.welcome_message', 'Hello! I am your medical knowledge assistant. Ask me about medications, diseases, or medical advice.'), results: [] },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesAreaRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTo({ top: messagesAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;
        const currentQuery = query.trim();
        setQuery('');
        setMessages(prev => [...prev, { sender: 'user', text: currentQuery, results: [] }]);
        setIsLoading(true);
        setTimeout(() => {
            setMessages(prev => [...prev, {
                sender: 'ai',
                text: t('knowledge.found_results', 'I found some information related to your search:'),
                results: mockKnowledgeAIResponse.results,
            }]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="knowledge-ai-page public-knowledge-page">
            <div className="knowledge-container">
                <div className="chat-header">
                    <div className="ai-icon">
                        <Stethoscope size={26} />
                    </div>
                    <div className="header-info">
                        <h2>{t('knowledge.title', 'المساعد الطبي الذكي')}</h2>
                        <p className="status-line">
                            <span className="status-dot" />
                            {t('knowledge.status', 'متاح لمساعدتك 24/7')}
                        </p>
                    </div>
                </div>

                <div ref={messagesAreaRef} className="messages-area">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.sender}`}>
                            <div className="msg-avatar">{msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}</div>
                            <div className="msg-bubble">
                                {msg.text}
                                {msg.results && msg.results.length > 0 && (
                                    <div className="results-grid">
                                        {msg.results.map((res, idx) => (
                                            <div key={idx} className="result-card">
                                                <span className="source-tag">{res.source}</span>
                                                <h4>{res.title}</h4>
                                                <p>{res.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai">
                            <div className="msg-avatar"><Bot size={20} /></div>
                            <div className="msg-bubble loading">
                                <div className="dot" /><div className="dot" /><div className="dot" />
                            </div>
                        </div>
                    )}
                </div>

                <form className="chat-input-area" onSubmit={handleSearch}>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder={t('knowledge.input_placeholder', 'اسأل عن دواء، مرض، أو نصيحة طبية...')}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            className="send-btn" disabled={isLoading || !query.trim()}>
                            <Send size={18} />
                            <span>{t('medical_ai.chat.send')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KnowledgeAI;
