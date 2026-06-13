import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  MessageSquare,
  Trash2,
  Shield,
  Eye,
  AlertCircle,
  RefreshCw,
  Search,
  ThumbsUp,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import "./ContentModeration.scss";
import Loader from "../../../shared/components/loader/Loader";

const ContentModeration = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, commentsRes] = await Promise.allSettled([
        axiosInstance.get("/admin/posts/Admin"),
        axiosInstance.get("/admin/Allcomments"),
      ]);

      if (postsRes.status === "fulfilled") {
        setPosts(postsRes.value.data.posts || postsRes.value.data || []);
      }
      if (commentsRes.status === "fulfilled") {
        setComments(commentsRes.value.data.comments || commentsRes.value.data || []);
      }
    } catch (err) {
      setError(t("admin.fetch_error", "Failed to fetch content"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm(t("admin.confirm_delete_post", "Delete this post?"))) return;
    try {
      await axiosInstance.delete(`/api/posts/${postId}`);
      toast.success(t("admin.post_deleted", "Post deleted"));
      fetchContent();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm(t("admin.confirm_delete_comment", "Delete this comment?"))) return;
    try {
      await axiosInstance.delete(`/api/comments/${commentId}`);
      toast.success(t("admin.comment_deleted", "Comment deleted"));
      fetchContent();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const handleApproveContent = async (type, id) => {
    try {
      await axiosInstance.patch(`/admin/moderate/${type}/${id}/approve`);
      toast.success(t("admin.content_approved", "Content approved"));
      fetchContent();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredComments = comments.filter(
    (c) =>
      c.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-blog-moderation admin-settings-page">
      <div className="page-header">
        <div className="header-info">
          <h2>{t("admin.content_moderation", "Content & Community")}</h2>
          <p>{t("admin.content_desc", "Moderate blog posts and user comments to maintain quality.")}</p>
        </div>
        <button className="refresh-btn" onClick={fetchContent} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* Tabs */}
      <div className="moderation-tabs">
        {["posts", "comments", "reported"].map((tab) => (
          <button
            key={tab}
            className={`mod-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "posts" ? t("admin.posts", "Posts") :
             tab === "comments" ? t("admin.comments", "Comments") :
             t("admin.reported", "Reported")}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder={t("admin.search_content", "Search content...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && posts.length === 0 && comments.length === 0 ? (
        <div className="content-card">
          <Loader loading={true} />
        </div>
      ) : error ? (
        <div className="content-card">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      ) : (
        <div className="moderation-grid">
          <div className="main-content">
            {activeTab === "posts" && (
              <div className="content-card">
                <div className="card-title">
                  <FileText size={18} />
                  <h3>{t("admin.recent_posts", "Recent Posts")}</h3>
                </div>
                {filteredPosts.length === 0 ? (
                  <div className="empty-content">
                    <FileText size={32} />
                    <p>{t("admin.no_posts", "No posts found")}</p>
                  </div>
                ) : (
                  <div className="content-list">
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post._id || post.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="content-item"
                      >
                        {post.image ? (
                          <div className="item-thumb"><img src={post.image} alt="" /></div>
                        ) : (
                          <div className="item-thumb"><FileText size={20} /></div>
                        )}
                        <div className="item-body">
                          <h5 className="item-title">{post.title || "Untitled"}</h5>
                          <p className="item-meta">
                            {t("admin.author", "Author")}: {post.userId?.username || "Unknown"} • {post.likes?.length || 0} {t("admin.likes", "likes")} • {post.comments?.length || 0} {t("admin.comments_count", "comments")}
                          </p>
                        </div>
                        <div className="item-actions">
                          <button className="action-btn delete" onClick={() => handleDeletePost(post._id || post.id)} title={t("admin.delete", "Delete")}>
                            <Trash2 size={16} />
                          </button>
                          <button className="action-btn feature" title={t("admin.feature", "Feature")}>
                            <Shield size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(activeTab === "comments" || activeTab === "reported") && (
              <div className="content-card">
                <div className="card-title">
                  <MessageSquare size={18} />
                  <h3>{activeTab === "reported" ? t("admin.reported_comments", "Reported Comments") : t("admin.all_comments", "All Comments")}</h3>
                </div>
                {filteredComments.length === 0 ? (
                  <div className="empty-content">
                    <MessageSquare size={32} />
                    <p>{t("admin.no_comments", "No comments found")}</p>
                  </div>
                ) : (
                  <div className="content-list">
                    {filteredComments.map((comment, index) => (
                      <motion.div
                        key={comment._id || comment.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="content-item"
                      >
                        <div className="item-body">
                          <div className="comment-header">
                            <span className="comment-author">{comment.userId?.username || "Unknown"}</span>
                            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="comment-text">{comment.text || comment.content || "No content"}</p>
                        </div>
                        <div className="item-actions">
                          <button className="action-btn delete" onClick={() => handleDeleteComment(comment._id || comment.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="sidebar">
            <div className="sidebar-card">
              <div className="sidebar-title">
                <MessageSquare size={18} />
                <h3>{t("admin.moderation_queue", "Moderation Queue")}</h3>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t("admin.pending_posts", "Pending Posts")}</span>
                <span className="stat-val amber">{posts.filter((p) => p.status === "pending").length}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t("admin.reported_content", "Reported Content")}</span>
                <span className="stat-val red">{comments.filter((c) => c.reported).length}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t("admin.total_posts", "Total Posts")}</span>
                <span className="stat-val main">{posts.length}</span>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="sidebar-title">
                <h3>{t("admin.quick_actions", "Quick Actions")}</h3>
              </div>
              <button className="quick-action-btn">{t("admin.bulk_approve", "Bulk Approve Pending")}</button>
              <button className="quick-action-btn">{t("admin.export_report", "Export Moderation Report")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;
