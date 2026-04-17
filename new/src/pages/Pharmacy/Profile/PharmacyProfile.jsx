import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { setCurrentTitle } from "../stores/pharmacySlice";
import {
  updateDoctorProfile as updateProfile,
  uploadProfileImage,
} from "../../Doctor/stores/doctorService"; // Reusing these as they are generic profile update thunks
import { updateUser } from "../../Auth/stores/authSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Save,
  X,
  ClipboardCheck,
  Edit3,
  Camera,
  Plus,
  MessageSquare,
  Globe,
  MoreHorizontal,
  Pencil,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDoctorPosts as fetchPharmacyPosts } from "../../Doctor/stores/postSlice";
import CreatePostModal from "../../../shared/components/CreatePostModal/CreatePostModal";
import PostCard from "../../../shared/components/PostCard/PostCard";
import "./PharmacyProfile.scss";

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

const PharmacyProfile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Reusing actionLoading from doctor state as I haven't added it to pharmacy slice yet
  const { actionLoading } = useSelector((state) => state.doctor) || { actionLoading: false };
  const isRtl = i18n.language === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null); 
  const [uploading, setUploading] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    gender: user?.gender || "male",
    specialization: user?.specialization || "",
    description: user?.description || "",
  });

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const { posts, isLoading: isPostsLoading } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    dispatch(setCurrentTitle(t("nav.profile", { defaultValue: "Profile" })));
    if (user?.id) {
        dispatch(fetchPharmacyPosts(user.id));
    }
  }, [dispatch, t, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const result = await dispatch(
      updateProfile({
        userId: user?.id,
        data: formData,
      }),
    );

    if (updateProfile.fulfilled.match(result)) {
      dispatch(updateUser(formData));
      setIsEditing(false);
      setEditSection(null);
      toast.success(
        t("common.update_success", {
          defaultValue: "Profile updated successfully!",
        }),
      );
    } else if (updateProfile.rejected.match(result)) {
      toast.error(
        result.payload ||
          t("common.update_error", {
            defaultValue: "Failed to update profile",
          }),
      );
    }
  };

  const handleFileChange = async (e, uploadType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await dispatch(
        uploadProfileImage({
          userId: user?.id,
          file,
          uploadType,
        }),
      ).unwrap();

      toast.success(t("common.update_success", "Image uploaded successfully!"));
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(error || t("common.update_error", "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const toggleEdit = (section = null) => {
    setEditSection(section);
    setIsEditing(!!section);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`pharmacy-profile-redesign ${isRtl ? "rtl" : ""}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-layout-grid">
        {/* Main Column */}
        <div className="main-column">
          {/* Header Card */}
          <section className="linkedin-card header-card">
            <div
              className="cover-photo"
              style={
                user?.coverPhoto
                  ? {
                      backgroundImage: `url(${user.coverPhoto})`,
                      backgroundSize: "cover",
                    }
                  : {}
              }
            >
              <div className="overlay"></div>
              <button
                className="edit-cover-btn"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploading}
              >
                <Camera size={20} />
              </button>
              <input
                type="file"
                ref={coverInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverPhoto")}
              />
            </div>
            <div className="header-content">
              <div className="avatar-container">
                <div className="avatar-circle">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      <Store size={80} />
                    </div>
                  )}
                  <button
                    className="change-photo-btn"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Camera size={20} />
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "avatar")}
                  />
                </div>
              </div>

              <div className="identity-section">
                <div className="top-row">
                  <h1>{user?.username}</h1>
                  <button
                    className="icon-btn edit-main"
                    onClick={() => toggleEdit("header")}
                  >
                    <Pencil size={20} />
                  </button>
                </div>
                <p className="headline">
                  {user?.specialization ||
                    t("pharmacy.specialty_placeholder", "Medical & Pharmaceutical Provider")}
                </p>
                <div className="location-info">
                  <span className="text-muted">
                    {user?.location || user?.country || t("common.no_location", "No location")}
                  </span>
                  <span className="dot">•</span>
                  <button
                    className="contact-info-trigger"
                    onClick={() => toggleEdit("contact")}
                  >
                    {t("pharmacy.contact_info", "Contact info")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* About Card */}
          <ProfileCard
            title={t("pharmacy.about", "About")}
            onEdit={() => toggleEdit("about")}
          >
            <p className="bio-text">
              {user?.description ||
                t(
                  "pharmacy.no_bio_yet",
                  "No detailed description provided yet. Add information about your pharmacy.",
                )}
            </p>
          </ProfileCard>

          {/* Activity Card */}
          <section className="linkedin-card activity-section">
            <div className="card-header">
              <div className="header-left">
                <h3>{t("posts.activity", "Activity")}</h3>
              </div>
              <button
                className="outline-btn"
                onClick={() => setIsCreatePostOpen(true)}
              >
                {t("posts.create_post", "Create a post")}
              </button>
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
          <section className="linkedin-card contact-card">
            <div className="card-header">
              <h3>{t("auth.section_location")}</h3>
              <button
                className="icon-btn"
                onClick={() => toggleEdit("contact")}
              >
                <Pencil size={18} />
              </button>
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
            </div>
          </section>
        </aside>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="edit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="edit-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <h3>
                  {t("common.edit")} {editSection}
                </h3>
                <button className="close-btn" onClick={() => toggleEdit(null)}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                {editSection === "header" && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t("pharmacy.specialty", "Specialization")}</label>
                      <input
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
                {editSection === "about" && (
                  <div className="form-group">
                    <label>{t("pharmacy.description", "Description")}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="6"
                    />
                  </div>
                )}
                {editSection === "contact" && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t("auth.phone_label")}</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? t("common.loading")
                    : t("common.save_changes")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </motion.div>
  );
};

export default PharmacyProfile;
