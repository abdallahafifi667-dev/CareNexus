import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './Message.scss';

const Message = ({ message }) => {
  const { t } = useTranslation();
  const language = useSelector((state) => state.aiApp.language);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`message-container ${message.isUser ? 'user' : 'ai'}`}>
      <div className={`message-bubble ${message.isUser ? 'user-bubble' : 'ai-bubble'}`}>
        <div className="message-header">
          {message.isUser
            ? t('medical_ai.msg.you')
            : t('medical_ai.msg.assistant')
          }
        </div>
        <div className="message-text">
          {message.text}
        </div>
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
