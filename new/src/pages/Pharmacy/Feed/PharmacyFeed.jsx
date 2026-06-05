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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../../../shared/components/PostCard/PostCard";
import CreatePostModal from "../../../shared/components/CreatePostModal/CreatePostModal";
import useInfiniteScroll from "../../../shared/hooks/useInfiniteScroll";
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
    const isRtl = i18n.language === "ar";

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.feed", { defaultValue: "Feed" })));
        dispatch(fetchGlobalFeed(1));
        dispatch(fetchCategories());

        return () => {
            dispatch(resetPostState());
        };
    }, [dispatch, t]);


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
            </div>

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
            />
        </div>
        </div>
    );
};

export default PharmacyFeed;
