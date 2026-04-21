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
import { toggleLike, requestAddComment, fetchComments } from "../../../pages/Doctor/stores/postSlice";
import CommentItem from "../CommentItem/CommentItem";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import "./PostCard.scss";

const PostCard = ({ post }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: authUser } = useSelector((state) => state.auth);
  const { comments: globalComments, isCommentLoading } = useSelector((state) => state.post);
  const role = authUser?.role || "doctor";
  const profileBase = role === "patient" ? "/patient" : "/doctor";

  const isLiked = post.like?.some(id => 
    id === authUser?.id || id === authUser?._id || 
    id === String(authUser?.id) || id === String(authUser?._id)
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [commentText, setCommentText] = useState("");

  const TRUNCATE_LIMIT = 180;
  const isLongDescription = (post.description || "").length > TRUNCATE_LIMIT;
  const displayDescription = isExpanded
    ? post.description
    : (post.description || "").substring(0, TRUNCATE_LIMIT) +
      (isLongDescription ? "..." : "");

  const userReaction = post.likesDetails?.find(l => 
    l.userId === authUser?.id || l.userId === authUser?._id ||
    l.userId === String(authUser?.id) || l.userId === String(authUser?._id)
  )?.reactionType;

  const handleLike = (reactionType = "like") => {
    dispatch(toggleLike({ 
      postId: post.id || post._id, 
      isLiked, 
      reactionType,
      currentReaction: userReaction 
    }));
    setShowReactions(false);
  };

  const reactionIcons = {
    like: { emoji: "👍", label: t("posts.like", "Like"), color: "#007bff" },
    heart: { emoji: "❤️", label: t("posts.heart", "Love"), color: "#e44d26" },
    haha: { emoji: "😆", label: t("posts.haha", "Haha"), color: "#f7b125" },
    wow: { emoji: "😮", label: t("posts.wow", "Wow"), color: "#f7b125" },
    sad: { emoji: "😢", label: t("posts.sad", "Sad"), color: "#f7b125" },
    angry: { emoji: "😡", label: t("posts.angry", "Angry"), color: "#df4d4d" },
  };

  const activeReaction = reactionIcons[userReaction] || { emoji: <ThumbsUp size={20} />, label: t("posts.like", "Like"), color: "#666" };

  // Group reactions for summary
  const reactionCounts = post.likesDetails?.reduce((acc, curr) => {
    acc[curr.reactionType] = (acc[curr.reactionType] || 0) + 1;
    return acc;
  }, {}) || {};

  const topReactions = Object.entries(reactionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const toggleComments = () => {
    if (!showComments) {
      dispatch(fetchComments(post.id || post._id));
    }
    setShowComments(!showComments);
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
    navigate(`/doctor/feed/post/${post.id || post._id}`);
  };

  const handleReply = async (parentCommentId, text) => {
    try {
      await dispatch(requestAddComment({ 
        postId: post.id || post._id, 
        commentData: { text, parentComment: parentCommentId } 
      })).unwrap();
      toast.success(t("posts.reply_added", "Reply added!"));
    } catch (err) {
      console.error("Reply failed:", err);
      toast.error(t("errors.action_failed", "Action failed"));
    }
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
      console.error("Comment submission failed:", err);
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
        <div className="stat-item reaction-summary" onClick={navigateToDetail}>
          {topReactions.length > 0 ? (
            <div className="reaction-icons-list">
              {topReactions.map(([type]) => (
                <span key={type} className="mini-reaction-icon">
                  {reactionIcons[type]?.emoji}
                </span>
              ))}
              <span className="reaction-total-count">{post.like?.length || 0}</span>
            </div>
          ) : (
            <>
              <ThumbsUp size={14} color="#666" />
              <span>0 {t("posts.reactions", "Reactions")}</span>
            </>
          )}
        </div>
        <div className="stat-item" onClick={toggleComments}>
          <span>
            {post.commentsCount || post.comments?.length || 0}{" "}
            {t("posts.comments_count", "Comments")}
          </span>
        </div>
      </div>

      <div className="post-actions">
        <div 
          className="reaction-picker-container"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {showReactions && (
            <div className="reaction-picker">
              {Object.entries(reactionIcons).map(([type, { emoji, label }]) => (
                <div 
                  key={type} 
                  className="reaction-item" 
                  onClick={() => handleLike(type)}
                  title={label}
                >
                  <span className="emoji">{emoji}</span>
                  <span className="label">{label}</span>
                </div>
              ))}
            </div>
          )}
          <button
            className={`action-btn ${isLiked ? "active" : ""}`}
            style={{ color: isLiked ? activeReaction.color : "" }}
            onClick={() => handleLike("like")}
          >
            <span className="action-icon">
              {isLiked ? activeReaction.emoji : <ThumbsUp size={20} />}
            </span>
            <span className="action-label">
              {isLiked ? activeReaction.label : t("posts.like", "Like")}
            </span>
          </button>
        </div>

        {post.allowComments !== false && (
          <button className="action-btn" onClick={toggleComments}>
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
                onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
              />
              <button className="send-btn" onClick={handleCommentSubmit}>
                <Send size={18} />
              </button>
            </div>
          </div>

          <div className="comments-list">
            {isCommentLoading ? (
              <div className="comments-loader">{t("common.loading", "Loading...")}</div>
            ) : (
              // Filter comments for this post if they are stored globally
              globalComments
                .filter(c => (c.post === (post.id || post._id) || c.postId === (post.id || post._id)))
                .map((comment) => (
                  <CommentItem 
                    key={comment.id || comment._id} 
                    comment={comment} 
                    onReply={handleReply}
                  />
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
