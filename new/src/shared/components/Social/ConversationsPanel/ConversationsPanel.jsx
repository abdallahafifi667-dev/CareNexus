import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../context/SocketContext";
import socialApi from "../../../utils/socialApi";
import { closeChat, toggleMinimize } from "../../stores/chatSlice";
import { X, Send, Minus, Maximize2, Search, MessageSquare, Circle } from "lucide-react";
import { toast } from "react-hot-toast";
import "./ConversationsPanel.scss";

const ConversationsPanel = ({ onOpenChat }) => {
  const { t, i18n } = useTranslation();
  const socket = useSocket();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeChats } = useSelector((state) => state.chat);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const isRtl = i18n.language === "ar";

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("newSocialMessage", (msg) => {
      const msgFromId = msg.from?.id || msg.from;
      const msgToId = msg.to?.id || msg.to;

      // If message belongs to currently open conversation
      if (selectedConversation) {
        const convPartnerId = selectedConversation.partner?.id || selectedConversation.partner?._id;
        if (msgFromId === convPartnerId || msgToId === convPartnerId) {
          setMessages((prev) => [...prev, msg]);
        }
      }

      // Update conversations list
      loadConversations();
    });

    return () => {
      socket.off("newSocialMessage");
    };
  }, [socket, selectedConversation]);

  const loadConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const res = await socialApi.getConversations();
      const convs = res.data?.data || res.data || [];
      setConversations(Array.isArray(convs) ? convs : []);
    } catch (err) {
      console.error("Failed to load conversations", err);
      // Fallback: show empty list
      setConversations([]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadMessages = async (conversation) => {
    setIsLoadingMessages(true);
    setSelectedConversation(conversation);
    try {
      const conversationId = conversation.id || conversation._id;
      const res = await socialApi.getConversationMessages(conversationId);
      const msgs = res.data?.data || res.data || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await socialApi.searchUsers(query);
      const users = res.data?.data || res.data || [];
      setSearchResults(Array.isArray(users) ? users : []);
    } catch (err) {
      console.error("Search failed", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const startNewChat = async (targetUser) => {
    try {
      await socialApi.startConversation(targetUser.id || targetUser._id);
      setSearchQuery("");
      setSearchResults([]);
      await loadConversations();
      // Open the new conversation
      const newConv = {
        partner: targetUser,
        lastMessage: null,
        unreadCount: 0,
      };
      loadMessages(newConv);
    } catch (err) {
      toast.error(t("errors.action_failed"));
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const partnerId = selectedConversation.partner?.id || selectedConversation.partner?._id;
    const messageText = newMessage;
    setNewMessage("");

    try {
      const res = await socialApi.sendMessage(partnerId, messageText);
      const sentMsg = res.data?.data || { from: user, to: partnerId, message: messageText, createdAt: new Date() };
      setMessages((prev) => [...prev, sentMsg]);
    } catch (err) {
      toast.error(t("errors.action_failed"));
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return t("common.yesterday", "Yesterday");
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: "short" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className={`conversations-panel ${isRtl ? "rtl" : "ltr"}`}>
      {/* Conversations List */}
      <div className={`conversations-list ${selectedConversation ? "hidden-mobile" : ""}`}>
        <div className="panel-header">
          <h3>{t("chat.conversations", "Conversations")}</h3>
          <span className="conv-count">{conversations.length}</span>
        </div>

        {/* Search */}
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder={t("chat.search_users", "Search users...")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((u) => (
              <div
                key={u.id || u._id}
                className="search-result-item"
                onClick={() => startNewChat(u)}
              >
                <img src={u.avatar || "/default-avatar.png"} alt="" />
                <div>
                  <p className="name">{u.username}</p>
                  <p className="role">{u.role || ""}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversations */}
        <div className="conversations-scroll">
          {isLoadingConversations ? (
            <div className="loading-conversations">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-conversation" />
              ))}
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => {
              const partner = conv.partner || conv.user || conv;
              const partnerId = partner.id || partner._id;
              const lastMsg = conv.lastMessage || conv.latestMessage;
              const unread = conv.unreadCount || 0;
              const isActive = selectedConversation?.partner?.id === partnerId || selectedConversation?.partner?._id === partnerId;

              return (
                <div
                  key={conv.id || conv._id || partnerId}
                  className={`conversation-item ${isActive ? "active" : ""}`}
                  onClick={() => loadMessages(conv)}
                >
                  <div conv-avatar>
                    <img src={partner.avatar || "/default-avatar.png"} alt="" />
                    {partner.isOnline && <span className="online-dot" />}
                  </div>
                  <div className="conv-info">
                    <div className="conv-top">
                      <p className="conv-name">{partner.username}</p>
                      <span className="conv-time">{formatTime(lastMsg?.createdAt || conv.updatedAt)}</span>
                    </div>
                    <div className="conv-bottom">
                      <p className="conv-last-msg">
                        {lastMsg?.message || t("chat.no_messages", "No messages yet")}
                      </p>
                      {unread > 0 && <span className="unread-badge">{unread}</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-conversations">
              <MessageSquare size={48} />
              <p>{t("chat.no_conversations", "No conversations yet")}</p>
              <p className="hint">{t("chat.search_to_start", "Search for users to start chatting")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`chat-window ${selectedConversation ? "" : "hidden-mobile"}`}>
        {selectedConversation ? (
          <>
            <div className="chat-window-header">
              <button className="back-btn" onClick={() => setSelectedConversation(null)}>
                ←
              </button>
              <img
                src={selectedConversation.partner?.avatar || "/default-avatar.png"}
                alt=""
                className="header-avatar"
              />
              <div className="header-info">
                <h4>{selectedConversation.partner?.username}</h4>
                <span className="status">
                  {selectedConversation.partner?.isOnline
                    ? t("chat.online", "Online")
                    : t("chat.offline", "Offline")}
                </span>
              </div>
            </div>

            <div className="chat-messages">
              {isLoadingMessages ? (
                <div className="loading-messages">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-message" />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-messages">
                  <p>{t("chat.start_conversation", "Say hello to start a conversation!")}</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = (msg.from?.id || msg.from) === (user?.id || user?._id);
                  return (
                    <div key={msg.id || msg._id || idx} className={`msg-bubble ${isMe ? "sent" : "received"}`}>
                      <p>{msg.message}</p>
                      <span className="msg-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder={t("chat.type_message", "Type a message...")}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <MessageSquare size={64} />
            <p>{t("chat.select_conversation", "Select a conversation to start chatting")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPanel;
