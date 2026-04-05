import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit2,
  Camera,
  MessageSquare,
  Globe,
  Clock,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchDoctorPosts as fetchUserPosts } from "../../Doctor/stores/postSlice"; // Reuse fetch posts
import PostCard from "../../../shared/components/PostCard/PostCard";
import "./PatientProfile.scss";

const ProfileCard = ({ title, children, onEdit, isEditable = true }) => {
  const { t } = useTranslation();
  return (
    <section className="linkedin-card">
      <div className="card-header">
        <h3>{title}</h3>
        {isEditable && onEdit && (
          <button
            className="icon-btn edit-pencil"
            onClick={onEdit}
            title={t("common.edit")}
          >
            <Pencil size={20} />
          </button>
        )}
      </div>
      <div className="card-content">{children}</div>
    </section>
  );
};

const PatientProfile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading: isPostsLoading } = useSelector(
    (state) => state.post,
  );
  const isRtl = i18n.language === "ar";

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts(user.id));
    }
  }, [dispatch, user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`patient-profile-unified ${isRtl ? "rtl" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-layout-grid">
        {/* Main Column */}
        <div className="main-column">
          {/* Header Card */}
          <section className="linkedin-card header-card">
            <div className="cover-photo">
              <div className="overlay"></div>
            </div>
            <div className="header-content">
              <div className="avatar-container">
                <div className="avatar-circle">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={80} />
                    </div>
                  )}
                  <button className="change-photo-btn">
                    <Camera size={20} />
                  </button>
                </div>
              </div>

              <div className="identity-section">
                <div className="top-row">
                  <h1>{user?.username}</h1>
                  <button className="icon-btn edit-main">
                    <Pencil size={20} />
                  </button>
                </div>
                <p className="headline">{t(`auth.role_${user?.role}`)}</p>
                <div className="location-info">
                  <span className="text-muted">
                    {user?.location || user?.country || t("common.no_location", "No location")}
                  </span>
                  <span className="dot">•</span>
                  <button className="contact-info-trigger">
                    {t("profile.contact_info", "Contact info")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* About Card */}
          <ProfileCard title={t("profile.about", "About")}>
            <p className="bio-text">
              {user?.description ||
                t(
                  "profile.no_bio_yet",
                  "No bio provided yet. Share a bit about your health journey.",
                )}
            </p>
          </ProfileCard>

          {/* Activity Card - Moved up */}
          <section className="linkedin-card activity-section">
            <div className="card-header">
              <div className="header-left">
                <h3>{t("posts.activity", "Activity")}</h3>
              </div>
            </div>
            <div className="doctor-posts-feed">
              {isPostsLoading ? (
                <div className="loading-spinner"></div>
              ) : posts.length > 0 ? (
                posts
                  .slice(0, 3)
                  .map((post) => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="no-activity">
                  <MessageSquare size={48} />
                  <p>{t("posts.no_posts_yet")}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Side Column */}
        <aside className="side-column">
          <section className="linkedin-card language-card">
            <div className="card-header">
              <h3>{t("profile.profile_language", "Profile Language")}</h3>
            </div>
            <div className="card-content">
              <p className="lang-status">{isRtl ? "العربية" : "English"}</p>
            </div>
          </section>

          <section className="linkedin-card contact-card">
            <div className="card-header">
              <h3>{t("profile.contact_info", "Contact Info")}</h3>
            </div>
            <div className="card-content contact-list">
              <div className="contact-item">
                <Mail size={18} className="text-muted" />
                <span>{user?.email?.address || user?.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={18} className="text-muted" />
                <span>{user?.phone || "---"}</span>
              </div>
              <div className="contact-item">
                <MapPin size={18} className="text-muted" />
                <span>{user?.Address || "---"}</span>
              </div>
              <div className="contact-item">
                <Shield
                  size={18}
                  className={
                    user?.documentation ? "text-success" : "text-warning"
                  }
                />
                <span>
                  {user?.documentation
                    ? t("profile.verified", "Verified")
                    : t("profile.pending", "Pending Verification")}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
};

export default PatientProfile;
