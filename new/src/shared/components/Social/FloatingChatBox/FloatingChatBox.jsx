import React, { useState, useEffect, useRef } from "react";
import { X, Send, Minus, Maximize2, Paperclip, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import socialApi from "../../../../utils/socialApi";
import { closeChat, toggleMinimize } from "../../../stores/chatSlice";
import { toast } from "react-hot-toast";
import "./FloatingChatBox.scss";

const FloatingChatBox = ({ activeFriend, onClose }) => {
  const { t, i18n } = useTranslation();
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // Local state for minimize is okay, but Redux is better for global control
  const isMinimized = activeFriend.isMinimized || false;
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    if (activeFriend) {
      loadMessages(activeFriend.id || activeFriend._id);
      setIsMinimized(false);
    }
  }, [activeFriend]);

  useEffect(() => {
    if (!socket || !activeFriend) return;

    const friendId = activeFriend.id || activeFriend._id;

    socket.on("newSocialMessage", (msg) => {
      const msgFromId = msg.from.id || msg.from;
      if (msgFromId === friendId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("user_typing", (data) => {
      if (data.from === friendId) {
        setPartnerTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("newSocialMessage");
      socket.off("user_typing");
    };
  }, [socket, activeFriend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, partnerTyping, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (friendId) => {
    try {
      const res = await socialApi.getMessages(friendId);
      setMessages(res.data.data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !activeFriend) return;

    const friendId = activeFriend.id || activeFriend._id;
    const messageText = newMessage;

    setNewMessage("");
    handleTyping(false);

    try {
      const res = await socialApi.sendMessage(friendId, messageText);
      setMessages((prev) => [...prev, res.data.data]);
    } catch (err) {
      toast.error(t("errors.action_failed"));
    }
  };

  const handleTyping = (typing) => {
    if (!socket || !activeFriend) return;
    const friendId = activeFriend.id || activeFriend._id;

    if (typing !== isTyping) {
      setIsTyping(typing);
      socket.emit("typing", {
        to: friendId,
        from: user.id || user._id,
        isTyping: typing,
      });
    }

    if (typing) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        handleTyping(false);
      }, 3000);
    }
  };

  if (!activeFriend) return null;

  return (
    <div className={`floating-chat-container ${isMinimized ? "minimized" : ""} ${isRtl ? "rtl" : ""}`}>
      <div className="chat-header" onClick={() => dispatch(toggleMinimize(activeFriend.id || activeFriend._id))}>
        <div className="user-info">
          <div className="status-dot online"></div>
          <img src={activeFriend.avatar || "/default-avatar.png"} alt="" className="avatar" />
          <div className="text">
            <h4>{activeFriend.username}</h4>
            <span>{partnerTyping ? t("chat.typing", "typing...") : t("chat.online", "Online")}</span>
          </div>
        </div>
        <div className="actions" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => dispatch(toggleMinimize(activeFriend.id || activeFriend._id))}>
            {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
          </button>
          <button onClick={onClose} className="close">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="chat-body">
            {messages.length === 0 && (
              <div className="empty-state">
                <p>{t("chat.start_conversation", "Say hello to start a conversation!")}</p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = (msg.from.id || msg.from) === (user.id || user._id);
              return (
                <div key={msg.id || idx} className={`message-bubble ${isMe ? "sent" : "received"}`}>
                  <div className="bubble-content">
                    <p>{msg.message}</p>
                    <span className="time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            {partnerTyping && (
              <div className="message-bubble received typing">
                <div className="bubble-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <form onSubmit={handleSend}>
              <button type="button" className="icon-btn"><Smile size={20} /></button>
              <button type="button" className="icon-btn"><Paperclip size={20} /></button>
              <input 
                type="text" 
                placeholder={t("chat.type_message", "Type a message...")}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping(true);
                }}
              />
              <button type="submit" disabled={!newMessage.trim()} className="send-btn">
                <Send size={18} />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChatBox;
