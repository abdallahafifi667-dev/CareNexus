import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  User,
  Clock,
  Heart,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toggleLike, requestAddComment } from "../../../pages/Doctor/stores/postSlice";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./PostCard.scss";

const PostCard = ({ post }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  const role = authUser?.role || "doctor";
  const profileBase = role === "patient" ? "/patient" : "/doctor";

  const isLiked = post.like?.some(id => id === authUser?.id || id === authUser?._id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const TRUNCATE_LIMIT = 180;
  const isLongDescription = (post.description || "").length > TRUNCATE_LIMIT;
  const displayDescription = isExpanded
    ? post.description
    : (post.description || "").substring(0, TRUNCATE_LIMIT) +
      (isLongDescription ? "..." : "");

  const handleLike = () => {
    dispatch(toggleLike({ postId: post.id || post._id, isLiked }));
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: `${window.location.origin}/doctor/feed/post/${post.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success(t("posts.shared_success", "Shared successfully!"));
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(t("posts.link_copied", "Link copied to clipboard!"));
      }
    } catch (err) {
      console.error("Share failed:", err);
      if (err.name !== "AbortError") {
        toast.error(t("posts.share_failed", "Failed to share post"));
      }
    }
  };

  const navigateToDetail = () => {
    navigate(`/doctor/feed/post/${post.id}`);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await dispatch(requestAddComment({ 
        postId: post.id || post._id, 
        commentData: { text: commentText } 
      })).unwrap();
      setCommentText("");
      toast.success(t("posts.comment_added", "Comment added!"));
    } catch (err) {
      toast.error(t("errors.action_failed", "Action failed"));
    }
  };

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : "";

  return (
    <div className={`post-card ${i18n.language === "ar" ? "rtl" : ""}`}>
      <div className="post-header">
        <div className="author-info">
          <Link
            to={`${profileBase}/profile/${post.user?._id || post.user?.id}`}
            className="author-avatar"
            onClick={(e) => e.stopPropagation()}
          >
            {post.user?.avatar ? (
              <img src={post.user.avatar} alt="Avatar" />
            ) : (
              <div className="avatar-placeholder">
                <User size={24} />
              </div>
            )}
          </Link>
          <div className="author-meta">
            <Link
              to={`${profileBase}/profile/${post.user?._id || post.user?.id}`}
              className="author-name"
              onClick={(e) => e.stopPropagation()}
            >
              {post.user?.username || "User"}
            </Link>
            <div className="post-time" onClick={navigateToDetail}>
              <Clock size={12} />
              <span>{timeAgo}</span>
              <span className="dot">•</span>
              <span className="category-tag">
                {post.categoryName || 
                  (post.category && !post.category.match(/^[0-9a-fA-F-]{36}$/) ? post.category : "General")}
              </span>
            </div>
          </div>
        </div>
        <button className="more-btn">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div
        className="post-content"
        onClick={navigateToDetail}
        style={{ cursor: "pointer" }}
      >
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">
          {displayDescription}
          {isLongDescription && !isExpanded && (
            <button
              className="see-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              {t("posts.see_more", "(see more)")}
            </button>
          )}
        </p>

        {post.media && post.media.length > 0 && (
          <div className={`post-media grid-${Math.min(post.media.length, 3)}`}>
            {post.media.map((item, idx) => (
              <div key={idx} className="media-item">
                {item.resourceType === "video" ? (
                  <video src={item.url} controls />
                ) : (
                  <img src={item.url} alt="Post media" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="post-stats">
        <div className="stat-item">
          <div className="icon-group">
            <Heart
              size={14}
              fill={post.like?.length > 0 ? "#df4d4d" : "none"}
              color={post.like?.length > 0 ? "#df4d4d" : "#666"}
            />
          </div>
          <span>
            {post.like?.length || 0} {t("posts.likes", "Likes")}
          </span>
        </div>
        <div className="stat-item">
          <span>
            {post.commentsCount || post.comments?.length || 0}{" "}
            {t("posts.comments_count", "Comments")}
          </span>
        </div>
      </div>

      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <ThumbsUp size={20} />
          <span>
            {isLiked ? t("posts.liked", "Liked") : t("posts.like", "Like")}
          </span>
        </button>

        {post.allowComments !== false && (
          <button className="action-btn" onClick={() => setShowComments(!showComments)}>
            <MessageCircle size={20} />
            <span>{t("posts.comment", "Comment")}</span>
          </button>
        )}

        <button className="action-btn" onClick={handleShare}>
          <Share2 size={20} />
          <span>{t("posts.share", "Share")}</span>
        </button>
      </div>

      {showComments && post.allowComments !== false && (
        <div className="comments-section">
          <div className="comment-input-wrapper">
            <img
              src={
                authUser?.avatar ||
                "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"
              }
              alt="user"
              className="mini-avatar"
            />
            <div className="input-group">
              <input
                type="text"
                placeholder={t("posts.write_comment", "Add a comment...")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button className="send-btn" onClick={handleCommentSubmit}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
