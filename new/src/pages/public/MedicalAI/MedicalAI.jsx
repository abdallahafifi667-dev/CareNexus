import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Pill, Activity, Stethoscope, Globe, Upload, Send, Bot, User } from 'lucide-react';
import './MedicalAI.scss';
import { mockMedicalAIResponse } from '../mockData';

const MedicalAI = () => {
    const { t } = useTranslation();
    const [chatMessages, setChatMessages] = useState([
        { from: 'bot', text: 'Hello! I am your Medical AI assistant. How can I help you today?' },
    ]);
    const [chatInput, setChatInput] = useState('');
    const [showAnalysis, setShowAnalysis] = useState(false);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        setChatMessages(prev => [...prev, { from: 'user', text: chatInput }]);
        setChatInput('');
        setTimeout(() => {
            setChatMessages(prev => [...prev, {
                from: 'bot',
                text: 'Based on your symptoms, I recommend consulting with a healthcare provider for a proper diagnosis. Would you like me to help you find a doctor?'
            }]);
        }, 1000);
    };

    const handleUpload = () => {
        setShowAnalysis(true);
    };

    const features = [
        {
            icon: <Pill size={32} />,
            title: t('medical_ai.features.medication.title'),
            description: t('medical_ai.features.medication.desc')
        },
        {
            icon: <Activity size={32} />,
            title: t('medical_ai.features.xray.title'),
            description: t('medical_ai.features.xray.desc')
        },
        {
            icon: <Stethoscope size={32} />,
            title: t('medical_ai.features.diagnosis.title'),
            description: t('medical_ai.features.diagnosis.desc')
        },
        {
            icon: <Globe size={32} />,
            title: t('medical_ai.features.language.title'),
            description: t('medical_ai.features.language.desc')
        }
    ];

    return (
        <div className="medical-ai-page">
            <header className="ai-hero">
                <div className="container">
                    <div className="ai-badge">CareNexus AI</div>
                    <h1>{t('medical_ai.hero.title', 'Your Smart Medical Assistant')}</h1>
                    <p>{t('medical_ai.hero.subtitle', 'Get instant medical insights powered by AI')}</p>
                </div>
            </header>

            <main className="container ai-content">
                <div className="ai-grid">
                    <div className="uploader-section">
                        <div className="upload-card">
                            <Upload size={48} />
                            <h3>Upload Medical Image</h3>
                            <p>Upload an X-ray, skin condition, or medication image for AI analysis</p>
                            <button className="btn-upload" onClick={handleUpload}>Upload Image</button>
                        </div>
                        {showAnalysis && (
                            <div className="analysis-result">
                                <h3>{mockMedicalAIResponse.result.title}</h3>
                                <p>{mockMedicalAIResponse.result.summary}</p>
                                <ul>
                                    {mockMedicalAIResponse.result.findings.map((f, i) => (
                                        <li key={i}>{f}</li>
                                    ))}
                                </ul>
                                <p className="disclaimer">{mockMedicalAIResponse.result.disclaimer}</p>
                            </div>
                        )}
                    </div>
                    <div className="chat-section">
                        <div className="chat-header">
                            <Bot size={24} />
                            <span>Medical AI Chat</span>
                        </div>
                        <div className="chat-messages">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-msg ${msg.from}`}>
                                    {msg.from === 'bot' ? <Bot size={20} /> : <User size={20} />}
                                    <span>{msg.text}</span>
                                </div>
                            ))}
                        </div>
                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Ask a medical question..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button type="submit"><Send size={18} /></button>
                        </form>
                    </div>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MedicalAI;
