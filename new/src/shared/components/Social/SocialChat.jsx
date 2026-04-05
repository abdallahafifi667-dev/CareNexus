import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Search,
  User,
  Check,
  CheckCheck,
  Smile,
  MessageSquare,
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import socialApi from "../../../utils/socialApi";
import { toast } from "react-hot-toast";
import "./SocialChat.scss";

const SocialChat = () => {
  const { t } = useTranslation();
  const socket = useSocket();
  const { user } = useSelector((state) => state.auth);

  const [friends, setFriends] = useState([]);
  const [activeFriend, setActiveFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [partnerTyping, setPartnerTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (activeFriend) {
      loadMessages(activeFriend.id);
    }
  }, [activeFriend]);

  // Socket Events
  useEffect(() => {
    if (!socket) return;

    socket.on("newSocialMessage", (msg) => {
      if (
        activeFriend &&
        (msg.from.id === activeFriend.id || msg.from === activeFriend.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      } else {
        // Update friends list with unread indicator or last message
        updateFriendsList(msg);
      }
    });

    socket.on("user_typing", (data) => {
      if (activeFriend && data.from === activeFriend.id) {
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
  }, [messages, partnerTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadFriends = async () => {
    try {
      const res = await socialApi.getFriends();
      setFriends(res.data.data);
    } catch (err) {
      toast.error(t("errors.failed_to_fetch_friends"));
    } finally {
      setLoadingFriends(false);
    }
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

    const friendId = activeFriend.id;
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeFriend) return;

    const formData = new FormData();
    formData.append("media", file);

    setUploading(true);
    toast.loading(t("common.uploading", "Uploading file..."), { id: "upload" });

    try {
      // Upload to Cloudinary via backend
      const res = await axiosInstance.post("/social/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url;
      let type = "image";
      if (file.type.startsWith("video/")) type = "video";
      if (file.type.startsWith("audio/")) type = "audio";

      // Send as message
      const msgRes = await socialApi.sendMessage(
        activeFriend.id,
        fileUrl,
        type,
      );
      setMessages((prev) => [...prev, msgRes.data.data]);
      toast.success(t("common.upload_success", "File sent"), { id: "upload" });
    } catch (err) {
      toast.error(t("errors.action_failed"), { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleTyping = (typing) => {
    if (!socket || !activeFriend) return;

    if (typing !== isTyping) {
      setIsTyping(typing);
      socket.emit("typing", {
        to: activeFriend.id,
        from: user.id || user.id,
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

  const updateFriendsList = (msg) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === msg.from.id || f.id === msg.from) {
          return {
            ...f,
            lastMessage: msg.message,
            lastMessageAt: msg.createdAt,
            unread: true,
          };
        }
        return f;
      }),
    );
  };

  return (
    <div className="social-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <div className="user-profile">
            <img src={user?.avatar || "/default-avatar.png"} alt="My Profile" />
          </div>
          <div className="header-actions">
            <Smile size={22} className="icon" />
            <MessageSquare size={22} className="icon" />
            <MoreVertical size={22} className="icon" />
          </div>
        </div>

        <div className="search-box">
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={t(
                "chat.search_placeholder",
                "Search or start new chat",
              )}
            />
          </div>
        </div>

        <div className="friends-list">
          {loadingFriends ? (
            <div className="loading-friends">Loading...</div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className={`friend-item ${activeFriend?.id === friend.id ? "active" : ""}`}
                onClick={() => setActiveFriend(friend)}
              >
                <div className="friend-avatar">
                  <img
                    src={friend.avatar || "/default-avatar.png"}
                    alt={friend.username}
                  />
                </div>
                <div className="friend-info">
                  <div className="info-top">
                    <span className="username">{friend.username}</span>
                    <span className="time">12:45 PM</span>
                  </div>
                  <div className="info-bottom">
                    <p className="last-message">
                      {friend.lastMessage ||
                        t("chat.start_conversation", "Click to chat")}
                    </p>
                    {friend.unread && <span className="unread-badge">1</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-view">
        {activeFriend ? (
          <>
            <div className="view-header">
              <div className="partner-profile">
                <Link to={`/profile/${activeFriend.id}`}>
                  <img
                    src={activeFriend.avatar || "/default-avatar.png"}
                    alt={activeFriend.username}
                  />
                </Link>
                <div className="partner-status">
                  <Link to={`/profile/${activeFriend.id}`}>
                    <h3>{activeFriend.username}</h3>
                  </Link>
                  <span>
                    {partnerTyping
                      ? t("chat.typing", "typing...")
                      : t("chat.online", "online")}
                  </span>
                </div>
              </div>
              <div className="header-actions">
                <Search size={20} className="icon" />
                <MoreVertical size={20} className="icon" />
              </div>
            </div>

            <div className="messages-area">
              {messages.map((msg, idx) => {
                const isMe = (msg.from.id || msg.from) === (user.id || user.id);
                return (
                  <div
                    key={msg.id || idx}
                    className={`message-bubble ${isMe ? "sent" : "received"}`}
                  >
                    <div className="bubble-content">
                      {msg.messageType === "text" ? (
                        <p>{msg.message}</p>
                      ) : msg.messageType === "image" ? (
                        <img
                          src={msg.message}
                          alt="attachment"
                          className="chat-img"
                          onClick={() => window.open(msg.message, "_blank")}
                        />
                      ) : msg.messageType === "video" ? (
                        <video
                          src={msg.message}
                          controls
                          className="chat-video"
                        />
                      ) : msg.messageType === "audio" ? (
                        <audio
                          src={msg.message}
                          controls
                          className="chat-audio"
                        />
                      ) : (
                        <a
                          href={msg.message}
                          target="_blank"
                          rel="noreferrer"
                          className="chat-file"
                        >
                          <Paperclip size={16} />{" "}
                          {t("chat.file_attachment", "File Attachment")}
                        </a>
                      )}

                      <div className="bubble-meta">
                        <span className="time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {isMe && (
                          <CheckCheck size={16} className="status-icon" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileUpload}
                accept="image/*,video/*,audio/*"
              />
              <form onSubmit={handleSend}>
                <div className="action-buttons">
                  <Smile size={24} className="icon" />
                  <Paperclip
                    size={24}
                    className={`icon ${uploading ? "animate-pulse" : ""}`}
                    onClick={() => fileInputRef.current.click()}
                  />
                </div>

                <input
                  type="text"
                  placeholder={t("chat.type_placeholder", "Type a message")}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping(true);
                  }}
                />
                <div className="send-action">
                  {newMessage.trim() ? (
                    <button type="submit">
                      <Send size={24} />
                    </button>
                  ) : (
                    <Mic size={24} className="icon" />
                  )}
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="no-chat-container">
            <div className="no-chat-content">
              <div className="icon-circle">
                <User size={100} />
              </div>
              <h1>CareNexus Social Chat</h1>
              <p>Send and receive messages with your friends in real-time.</p>
              <div className="encryption-notice">
                <CheckCheck size={14} /> End-to-end encrypted
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialChat;
