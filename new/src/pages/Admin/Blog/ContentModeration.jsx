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
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";

// Mock data for posts
const mockPosts = Array.from({ length: 12 }, (_, i) => ({
  _id: `post_${i}`,
  title: [
    "Understanding Heart Disease: A Complete Guide",
    "The Importance of Vaccination for Children",
    "10 Superfoods for Better Health",
    "Managing Stress in the Modern World",
    "New Breakthroughs in Cancer Treatment",
    "Understanding Diabetes: Type 1 vs Type 2",
    "Heart Attack Prevention Tips",
    "The Benefits of Regular Exercise",
    "Sleep Hygiene: How to Improve Your Sleep",
    "Understanding Blood Pressure Readings",
    "Childhood Obesity: Causes and Prevention",
    "Mental Health Awareness: Breaking the Stigma",
  ][i],
  description: "Comprehensive article covering essential information, prevention strategies, and treatment options.",
  status: i % 5 === 0 ? "pending" : "published",
  image: i % 3 === 0 ? `https://picsum.photos/seed/post${i}/400/300` : null,
  userId: { username: ["Dr. Ahmed Hassan", "Dr. Sara Mahmoud", "Dr. Omar Farouk", "Dr. Fatma El-Sayed"][i % 4] },
  likes: { length: Math.floor(Math.random() * 50) },
  comments: { length: Math.floor(Math.random() * 20) },
  createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
}));

const mockComments = Array.from({ length: 8 }, (_, i) => ({
  _id: `comment_${i}`,
  text: [
    "Great article! Very informative.",
    "Thank you for sharing this valuable information.",
    "This is exactly what I was looking for.",
    "Very well written. Keep up the good work!",
    "I learned a lot from this post. Thanks!",
    "Could you share more details about this topic?",
    "Excellent insights! This should be shared more widely.",
    "My patients will definitely benefit from this information.",
  ][i],
  userId: { username: ["Khaled Mostafa", "Nour El-Hassan", "Layla Ahmed", "Yousef Samir"][i % 4] },
  reported: i % 6 === 0,
  createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
}));

const ContentModeration = () => {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      // Use mock data for now
      setPosts(mockPosts);
      setComments(mockComments);
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
      toast.success(t("admin.deleted", "Post deleted"));
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
    <div className={`admin-blog-moderation admin-settings-page ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 1rem" }}>
          <div>
            <h2>{t("admin.content_moderation", "Content & Community")}</h2>
            <p>{t("admin.content_desc", "Moderate blog posts and user comments to maintain quality.")}</p>
          </div>
          <button className="refresh-btn" onClick={fetchContent} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
          </button>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            {["posts", "comments", "reported"].map((tab) => (
              <button
                key={tab}
                className={`tab-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "posts" ? t("admin.posts", "Posts") :
                  tab === "comments" ? t("admin.comments", "Comments") :
                    t("admin.reported", "Reported")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="search-box" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(15, 23, 42, 0.05)", padding: "0.8rem 1rem", borderRadius: "12px", marginBottom: "1.5rem" }}>
        <Search size={18} />
        <input
          type="text"
          placeholder={t("admin.search_content", "Search content...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ background: "none", border: "none", outline: "none", width: "100%" }}
        />
      </div>

      {loading && posts.length === 0 && comments.length === 0 ? (
        <div className="content-card">
          <div className="skeleton-loading-list">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))}
          </div>
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
                  <div className="content-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", padding: "10px" }}>
                    {filteredPosts.map((post, index) => (
                      <motion.div
                        key={post._id || post.id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="content-item"
                        style={{ display: "flex", flexDirection: "column", padding: "24px", borderRadius: "20px", backgroundColor: "#fff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)", transition: "all 0.3s ease" }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                           {post.image ? (
                             <img src={post.image} alt="" style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", boxShadow: "0 4px 10px rgba(0,0,0,0.08)" }} />
                           ) : (
                             <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.1)" }}>
                               <FileText size={26} strokeWidth={2.5} />
                             </div>
                           )}
                           <span style={{ fontSize: "11px", padding: "6px 14px", borderRadius: "20px", background: post.status === 'pending' ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)", color: post.status === 'pending' ? "#d97706" : "#10b981", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", border: `1px solid ${post.status === 'pending' ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)"}` }}>
                             {post.status || t("admin.published", "Published")}
                           </span>
                        </div>
                        
                        <div className="item-body" style={{ flex: 1 }}>
                          <h5 style={{ fontSize: "17px", fontWeight: "800", margin: "0 0 12px 0", color: "#0f172a", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title || t("admin.untitled", "Untitled")}</h5>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#475569", marginBottom: "20px", backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                              <User size={14} />
                            </div>
                            <span style={{ fontWeight: "700" }}>{post.userId?.username || t("common.unknown", "Unknown")}</span>
                          </div>
                        </div>

                        <div className="item-actions" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "2px dashed #f1f5f9", paddingTop: "20px", marginTop: "auto" }}>
                          <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "13px", fontWeight: "700" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><ThumbsUp size={16} color="#94a3b8" /> {post.likes?.length || 0}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MessageSquare size={16} color="#94a3b8" /> {post.comments?.length || 0}</span>
                          </div>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => handleDeletePost(post._id || post.id)} style={{ padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)"} title={t("admin.delete", "Delete")}>
                              <Trash2 size={18} strokeWidth={2.5} />
                            </button>
                            <button style={{ padding: "10px", borderRadius: "10px", border: "none", backgroundColor: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.15)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.08)"} title={t("admin.feature", "Feature")}>
                              <Shield size={18} strokeWidth={2.5} />
                            </button>
                          </div>
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
                            <span className="comment-author">{comment.userId?.username || t("common.unknown", "Unknown")}</span>
                            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="comment-text">{comment.text || comment.content || t("admin.no_content", "No content")}</p>
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
