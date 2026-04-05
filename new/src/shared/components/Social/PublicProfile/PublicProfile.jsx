import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  UserPlus,
  UserCheck,
  Clock,
  ArrowLeft,
  MessageCircle,
  MapPin,
  Mail,
  Award,
  Rss,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import socialApi from "../../../../utils/socialApi";
import { fetchDoctorPosts } from "../../../../pages/Doctor/stores/postSlice";
import PostCard from "../../PostCard/PostCard";
import "./PublicProfile.scss";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { user: authUser } = useSelector((state) => state.auth);
  const { posts, isLoading: postsLoading } = useSelector((state) => state.post);

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState("none"); // none | pending | friends
  const [friends, setFriends] = useState([]);

  const isOwnProfile =
    authUser?.id === userId || authUser?._id === userId;

  useEffect(() => {
    loadProfile();
    loadFriends();
    if (userId) {
      dispatch(fetchDoctorPosts(userId));
    }
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await socialApi.getUserProfile(userId);
      setProfileUser(res.data.data || res.data);
    } catch (err) {
      toast.error(t("errors.user_not_found", "User not found"));
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const res = await socialApi.getFriends();
      const friendList = res.data.data || [];
      setFriends(friendList);
      const isFriend = friendList.some(
        (f) => f.id === userId || f._id === userId,
      );
      if (isFriend) setFriendStatus("friends");
    } catch (err) {
      console.error("Failed to load friends", err);
    }
  };

  const handleAddFriend = async () => {
    try {
      await socialApi.sendFriendRequest(userId);
      setFriendStatus("pending");
      toast.success(t("social.request_sent", "Friend request sent!"));
    } catch (err) {
      toast.error(err.response?.data?.message || t("errors.action_failed"));
    }
  };

  if (loading) {
    return (
      <div className="public-profile-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!profileUser) return null;

  const userPosts = posts.filter(
    (p) =>
      p.user?.id === userId ||
      p.user?._id === userId ||
      p.userId === userId,
  );

  return (
    <motion.div
      className={`public-profile-page ${isRtl ? "rtl" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        <span>{t("common.back", "Back")}</span>
      </button>

      {/* Hero Section */}
      <div className="profile-hero">
        <div
          className="cover-photo"
          style={
            profileUser.coverPhoto
              ? { backgroundImage: `url(${profileUser.coverPhoto})` }
              : {}
          }
        >
          <div className="cover-overlay" />
        </div>

        <div className="hero-content">
          <div className="avatar-wrapper">
            {profileUser.avatar ? (
              <img src={profileUser.avatar} alt={profileUser.username} />
            ) : (
              <div className="avatar-fallback">
                {profileUser.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="user-identity">
            <h1 className="username">{profileUser.username}</h1>
            <p className="role-badge">
              {t(`auth.role_${profileUser.role}`, profileUser.role)}
            </p>
            {profileUser.specialization && (
              <p className="specialization">
                <Award size={14} />
                {profileUser.specialization}
              </p>
            )}
            {(profileUser.location || profileUser.country) && (
              <p className="location">
                <MapPin size={14} />
                {profileUser.location || profileUser.country}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <div className="profile-actions">
              {friendStatus === "friends" ? (
                <button className="btn-friends" disabled>
                  <UserCheck size={18} />
                  {t("social.friends", "Friends")}
                </button>
              ) : friendStatus === "pending" ? (
                <button className="btn-pending" disabled>
                  <Clock size={18} />
                  {t("social.pending", "Pending")}
                </button>
              ) : (
                <button className="btn-add-friend" onClick={handleAddFriend}>
                  <UserPlus size={18} />
                  {t("social.add_friend", "Add Friend")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="profile-content-grid">
        {/* Left: Info Cards */}
        <aside className="info-sidebar">
          {profileUser.description && (
            <div className="info-card">
              <h3>{t("profile.about", "About")}</h3>
              <p>{profileUser.description}</p>
            </div>
          )}

          <div className="info-card contact-card">
            <h3>{t("profile.contact_info", "Contact Info")}</h3>
            {profileUser.email && (
              <div className="contact-row">
                <Mail size={16} />
                <span>{profileUser.email?.address || profileUser.email}</span>
              </div>
            )}
            {profileUser.phone && (
              <div className="contact-row">
                <MessageCircle size={16} />
                <span>{profileUser.phone}</span>
              </div>
            )}
          </div>

          {profileUser.academicDegrees?.length > 0 && (
            <div className="info-card">
              <h3>{t("doctor.education", "Education")}</h3>
              <ul className="degrees-list">
                {profileUser.academicDegrees.map((edu, i) => (
                  <li key={i}>
                    <strong>{edu.institution}</strong>
                    <span>
                      {edu.degree} · {edu.field} · {edu.graduationYear}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Right: Posts Feed */}
        <div className="activity-feed">
          <div className="feed-header">
            <Rss size={20} />
            <h3>{t("posts.activity", "Activity")}</h3>
            <span className="post-count">
              {userPosts.length} {t("posts.posts", "posts")}
            </span>
          </div>

          {postsLoading ? (
            <div className="feed-loading">
              <div className="spinner" />
            </div>
          ) : userPosts.length > 0 ? (
            <div className="posts-list">
              {userPosts.map((post) => (
                <PostCard key={post.id || post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <Rss size={48} opacity={0.2} />
              <p>{t("posts.no_posts_yet", "No posts yet")}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PublicProfile;
