import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
    fetchGlobalFeed,
    fetchCategories,
    resetPostState,
} from "../../Doctor/stores/postSlice";
import { setCurrentTitle } from "../stores/pharmacySlice";
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
    Filter,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../../../shared/components/PostCard/PostCard";
import CreatePostModal from "../../../shared/components/CreatePostModal/CreatePostModal";
import FloatingChatBox from "../../../shared/components/Social/FloatingChatBox/FloatingChatBox";
import useInfiniteScroll from "../../../shared/hooks/useInfiniteScroll";
import socialApi from "../../../utils/socialApi";
import { toast } from "react-hot-toast";
import "./PharmacyFeed.scss";
import "../../../scss/premium_theme.scss";

const PharmacyFeed = () => {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { globalPosts, categories, isLoading, totalPages, currentPage } =
        useSelector((state) => state.post);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loadingFriends, setLoadingFriends] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const isRtl = i18n.language === "ar";

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.feed", { defaultValue: "Feed" })));
        dispatch(fetchGlobalFeed(1));
        dispatch(fetchCategories());
        loadFriends();

        return () => {
            dispatch(resetPostState());
        };
    }, [dispatch, t]);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredPosts(
                globalPosts.filter(
                    (post) =>
                        post.category === selectedCategory ||
                        post.categoryId === selectedCategory ||
                        post.category?.id === selectedCategory ||
                        post.category?._id === selectedCategory
                )
            );
        } else {
            setFilteredPosts(globalPosts);
        }
    }, [selectedCategory, globalPosts]);

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

    const displayPosts = selectedCategory ? filteredPosts : globalPosts;

    return (
        <div className="premium-ui">
            <div className={`pharmacy-feed-container ${isRtl ? "rtl" : ""}`}>
            <div className="feed-layout">
                {/* Left Sidebar: User Summary & Topics */}
                <aside className="feed-sidebar-left">
                    <div className="user-short-profile">
                        <div className="cover-bg"></div>
                        <div className="avatar-wrapper">
                            <img
                                src={
                                    user?.avatar ||
                                    "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
                                }
                                alt="user"
                            />
                        </div>
                        <div className="user-details">
                            <h3>{user?.username}</h3>
                            <p>{t("common.pharmacy", "Pharmacy")}</p>
                        </div>
                        <div className="stats-row">
                            <div className="stat">
                                <span className="label">
                                    {t("posts.my_posts", "My Posts")}
                                </span>
                                <span className="value">0</span>
                            </div>
                        </div>
                    </div>

                    <div className="categories-card floating-card">
                        <div className="categories-header">
                            <h4>{t("posts.health_topics", "Health Topics")}</h4>
                            {selectedCategory && (
                                <button
                                    className="clear-filter-btn"
                                    onClick={() => setSelectedCategory(null)}
                                    title={t("common.clear_filter", "Clear filter")}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <div className="tags-list">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id || cat._id || cat.name}
                                    className={`tag-item ${selectedCategory === (cat.id || cat._id || cat.name) ? "active" : ""}`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === (cat.id || cat._id || cat.name)
                                                ? null
                                                : cat.id || cat._id || cat.name
                                        )
                                    }
                                >
                                    <span className="hash">#</span>
                                    <span>{cat.text || cat.name}</span>
                                </div>
                            ))}
                            {categories.length === 0 && !isLoading && (
                                <p className="no-categories">{t("posts.no_categories", "No categories available")}</p>
                            )}
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
                            {selectedCategory ? (
                                <span className="filter-active">
                                    <Filter size={14} />
                                    {t("posts.filtered_by", "Filtered by")}:{" "}
                                    <b>{categories.find(c => (c.id || c._id || c.name) === selectedCategory)?.text || categories.find(c => (c.id || c._id || c.name) === selectedCategory)?.name || selectedCategory}</b>
                                </span>
                            ) : (
                                <>
                                    {t("posts.sort_by", "Sort by")}:{" "}
                                    <b>{t("posts.recent", "Recent")}</b>
                                </>
                            )}
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
                            {displayPosts.map((post, index) => (
                                <motion.div
                                    key={post.id || post._id || index}
                                    variants={itemVariants}
                                    ref={index === displayPosts.length - 1 ? lastElementRef : null}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="feed-loader">
                                    <div className="spinner"></div>
                                </div>
                            )}

                            {!isLoading && displayPosts.length === 0 && (
                                <div className="empty-feed">
                                    <MessageSquare size={64} />
                                    <h3>
                                        {selectedCategory
                                            ? t("posts.no_posts_in_category", "No posts in this category")
                                            : t("posts.empty_feed", "No posts available yet.")}
                                    </h3>
                                    <p>
                                        {selectedCategory
                                            ? t("posts.try_other_category", "Try selecting a different category")
                                            : t(
                                                "posts.empty_feed_hint",
                                                "Be the first to share something with the community!",
                                            )}
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
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
                                    <p>{t("chat.no_friends", "Connect with others to start chatting")}</p>
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
        </div>
    );
};

export default PharmacyFeed;
