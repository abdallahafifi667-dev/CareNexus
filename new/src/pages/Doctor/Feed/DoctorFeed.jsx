import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    fetchGlobalFeed,
    fetchCategories,
    resetPostState,
} from "../stores/postSlice";
import { setHeaderTitle } from "../stores/doctorSlice";
import {
    User,
    Image,
    Video,
    Calendar,
    Newspaper,
    Search,
    TrendingUp,
    MessageSquare,
    Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../../../shared/components/PostCard/PostCard";
import CreatePostModal from "../../../shared/components/CreatePostModal/CreatePostModal";
import FloatingChatBox from "../../../shared/components/Social/FloatingChatBox/FloatingChatBox";
import useInfiniteScroll from "../../../shared/hooks/useInfiniteScroll";
import socialApi from "../../../utils/socialApi";
import { toast } from "react-hot-toast";
import "./DoctorFeed.scss";

const DoctorFeed = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { globalPosts, categories, isLoading, totalPages, currentPage } =
        useSelector((state) => state.post);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const isRtl = i18n.language === "ar";

    useEffect(() => {
        dispatch(setHeaderTitle(t("nav.feed")));
        dispatch(fetchGlobalFeed(1));
        dispatch(fetchCategories());
        loadFriends();

        return () => {
            dispatch(resetPostState());
        };
    }, [dispatch, t]);

    const loadFriends = async () => {
        setLoadingFriends(true);
        try {
            const res = await socialApi.getFriends();
            if (res.data && res.data.success) {
                setFriends(res.data.data || []);
            }
        } catch (err) {
            if (err.response?.status !== 404) {
                console.error("Failed to load friends", err);
            }
        } finally {
            setLoadingFriends(false);
        }
    };

    const loadMore = useCallback(() => {
        if (currentPage < totalPages && !isLoading) {
            dispatch(fetchGlobalFeed(currentPage + 1));
        }
    }, [currentPage, totalPages, isLoading, dispatch]);

    const { lastElementRef } = useInfiniteScroll(
        loadMore,
        currentPage < totalPages,
        isLoading,
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className={`doctor-feed-container ${isRtl ? "rtl" : ""}`}>
            <div className="feed-layout">
                {/* Left Sidebar: User Summary & Topics */}
                <aside className="feed-sidebar-left">
                    <div className="user-short-profile floating-card">
                        <div
                            className="cover-bg"
                            style={{
                                height: "60px",
                                background: "linear-gradient(135deg, #378fe9, #6366f1)",
                            }}
                        ></div>
                        <div
                            className="avatar-wrapper"
                            style={{
                                margin: "-30px auto 10px",
                                width: "72px",
                                height: "72px",
                                borderRadius: "50%",
                                border: "4px solid white",
                                background: "white",
                                overflow: "hidden",
                            }}
                        >
                            <img
                                src={
                                    user?.avatar ||
                                    "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
                                }
                                alt="user"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <div
                            className="user-details"
                            style={{ textAlign: "center", padding: "0 10px 15px" }}
                        >
                            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                                {user?.username}
                            </h3>
                            <p
                                style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#666" }}
                            >
                                {user?.role === "doctor"
                                    ? t("common.doctor", "Doctor")
                                    : user?.role}
                            </p>
                        </div>
                        <div
                            className="stats-row"
                            style={{ borderTop: "1px solid #f3f2ef", padding: "12px" }}
                        >
                            <div
                                className="stat"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.8rem",
                                }}
                            >
                                <span
                                    className="label"
                                    style={{ color: "#666", fontWeight: 600 }}
                                >
                                    {t("posts.my_posts", "My Posts")}
                                </span>
                                <span
                                    className="value"
                                    style={{ color: "#378fe9", fontWeight: 700 }}
                                >
                                    12
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content: Feed */}
                <main className="feed-main-content">
                    {/* Start Post Banner */}
                    <div className="start-post-card floating-card">
                        <div className="input-row">
                            <img
                                src={
                                    user?.avatar ||
                                    "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
                                }
                                alt="user"
                                className="mini-avatar"
                            />
                            <button
                                className="trigger-btn"
                                onClick={() => setIsCreatePostOpen(true)}
                            >
                                {t("posts.start_post_placeholder", "Start a post...")}
                            </button>
                        </div>
                        <div className="action-row">
                            <button
                                className="feed-action-btn"
                                onClick={() => setIsCreatePostOpen(true)}
                            >
                                <Image size={20} color="#378fe9" />
                                <span>{t("posts.photo", "Photo")}</span>
                            </button>
                            <button
                                className="feed-action-btn"
                                onClick={() => setIsCreatePostOpen(true)}
                            >
                                <Video size={20} color="#5f9b41" />
                                <span>{t("posts.video", "Video")}</span>
                            </button>
                            <button
                                className="feed-action-btn"
                                onClick={() => setIsCreatePostOpen(true)}
                            >
                                <Calendar size={20} color="#c37d16" />
                                <span>{t("posts.event", "Event")}</span>
                            </button>
                            <button
                                className="feed-action-btn"
                                onClick={() => setIsCreatePostOpen(true)}
                            >
                                <Newspaper size={20} color="#e16745" />
                                <span>{t("posts.article", "Write article")}</span>
                            </button>
                        </div>
                    </div>

                    <div className="feed-divider">
                        <hr />
                        <span>
                            {t("posts.sort_by", "Sort by")}:{" "}
                            <b>{t("posts.recent", "Recent")}</b>
                        </span>
                    </div>

                    {/* Posts List */}
                    <motion.div
                        className="posts-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <AnimatePresence>
                            {globalPosts.map((post, index) => (
                                <motion.div
                                    key={post.id || index}
                                    variants={itemVariants}
                                    ref={index === globalPosts.length - 1 ? lastElementRef : null}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isLoading && (
                            <div className="feed-loader">
                                <div className="spinner"></div>
                            </div>
                        )}

                        {!isLoading && globalPosts.length === 0 && (
                            <div className="empty-feed">
                                <MessageSquare size={64} />
                                <h3>{t("posts.empty_feed", "No posts available yet.")}</h3>
                                <p>
                                    {t(
                                        "posts.empty_feed_hint",
                                        "Be the first to share something with the community!",
                                    )}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </main>

                {/* Right Sidebar: Messaging/Contacts */}
                <aside className="feed-sidebar-right">
                    <div className="messenger-card floating-card">
                        <div className="header">
                            <h4>{t("chat.messaging", "Messaging")}</h4>
                            <MessageSquare size={18} />
                        </div>
                        <div className="contacts-list">
                            {loadingFriends ? (
                                <div className="loading-contacts">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="skeleton-contact"></div>
                                    ))}
                                </div>
                            ) : friends.length > 0 ? (
                                friends.map((friend) => (
                                    <div
                                        key={friend.id || friend._id}
                                        className={`contact-item ${activeChat?.id === (friend.id || friend._id) ? "active" : ""}`}
                                        onClick={() => setActiveChat(friend)}
                                    >
                                        <div className="contact-avatar">
                                            <img
                                                src={friend.avatar || "/default-avatar.png"}
                                                alt={friend.username}
                                            />
                                            <span className="status-indicator online"></span>
                                        </div>
                                        <div className="contact-info">
                                            <p className="name">{friend.username}</p>
                                            <p className="last-msg">
                                                {friend.lastMessage || t("chat.click_to_chat", "Click to chat")}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-contacts">
                                    <p>{t("chat.no_friends", "Connect with doctors to start chatting")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div>

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
            />

            <AnimatePresence>
                {activeChat && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <FloatingChatBox
                            activeFriend={activeChat}
                            onClose={() => setActiveChat(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorFeed;

