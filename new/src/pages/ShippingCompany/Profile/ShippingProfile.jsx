import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { setCurrentTitle } from "../stores/shippingSlice";
import { 
  updateDoctorProfile as updateProfile, 
  uploadProfileImage 
} from "../../Doctor/stores/doctorService";
import { updateUser } from "../../Auth/stores/authSlice";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Truck,
  Globe,
  Pencil,
  X,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Award,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./ShippingProfile.scss";

const ProfileCard = ({ title, children, onEdit, isEditable = true }) => {
  const { t } = useTranslation();
  return (
    <section className="linkedin-card">
      <div className="card-header">
        <h3>{title}</h3>
        {isEditable && onEdit && (
          <button className="icon-btn edit-pencil" onClick={onEdit}>
            <Pencil size={20} />
          </button>
        )}
      </div>
      <div className="card-content">{children}</div>
    </section>
  );
};

const ShippingProfile = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isRtl = i18n.language === "ar";

  const [isEditing, setIsEditing] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [uploading, setUploading] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    description: user?.description || "",
    location: user?.location || "",
  });

  useEffect(() => {
    dispatch(setCurrentTitle(t("nav.profile", { defaultValue: "Profile" })));
  }, [dispatch, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const result = await dispatch(updateProfile({ userId: user?.id, data: formData }));
    if (updateProfile.fulfilled.match(result)) {
      dispatch(updateUser(formData));
      setIsEditing(false);
      setEditSection(null);
      toast.success(t("common.update_success", "Profile updated successfully"));
    } else {
      toast.error(result.payload || t("common.update_error", "Failed to update profile"));
    }
  };

  const handleFileChange = async (e, uploadType) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      await dispatch(uploadProfileImage({ userId: user?.id, file, uploadType })).unwrap();
      toast.success(t("common.update_success", "Image uploaded successfully"));
      setTimeout(() => window.location.reload(), 2000);
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

  return (
    <motion.div 
      className={`shipping-profile-redesign ${isRtl ? "rtl" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-layout-grid">
        <div className="main-column">
          <section className="linkedin-card header-card">
            <div className="cover-photo" style={user?.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundSize: "cover" } : {}}>
              <div className="overlay"></div>
              <button className="edit-cover-btn" onClick={() => coverInputRef.current?.click()} disabled={uploading}>
                <Camera size={20} />
              </button>
              <input type="file" ref={coverInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileChange(e, "coverPhoto")} />
            </div>
            <div className="header-content">
              <div className="avatar-container">
                <div className="avatar-circle">
                  {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <div className="avatar-placeholder"><Truck size={80} /></div>}
                  <button className="change-photo-btn" onClick={() => avatarInputRef.current?.click()} disabled={uploading}>
                    <Camera size={20} />
                  </button>
                  <input type="file" ref={avatarInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
                </div>
              </div>
              <div className="identity-section">
                <div className="top-row">
                  <h1>{user?.username}</h1>
                  <button className="icon-btn edit-main" onClick={() => toggleEdit("header")}>
                    <Pencil size={20} />
                  </button>
                </div>
                <p className="headline">{user?.role === "shipping_company" ? t("common.shipping_company", "Logistics & Delivery Provider") : user?.role}</p>
                <div className="location-info">
                  <span className="text-muted"><MapPin size={16} /> {user?.location || t("common.no_location", "No location")}</span>
                  <span className="dot">•</span>
                  <button className="contact-info-trigger" onClick={() => toggleEdit("contact")}>
                    {t("doctor.contact_info", "Contact info")}
                  </button>
                </div>
                <div className="connection-count">
                  <span className="count">{user?.connectionsCount || 0}</span>
                  <span className="label text-muted">{t("doctor.connections", "connections")}</span>
                </div>
              </div>
            </div>
          </section>

          <ProfileCard title={t("doctor.about", "About")} onEdit={() => toggleEdit("about")}>
            <p className="bio-text">{user?.description || t("doctor.no_bio_yet", "No bio provided yet.")}</p>
          </ProfileCard>

          <section className="linkedin-card activity-section">
            <div className="card-header">
              <div className="header-left">
                <h3>{t("posts.activity", "Activity")}</h3>
                <span className="sub-header">{user?.connectionsCount || 0} {t("posts.followers", "followers")}</span>
              </div>
            </div>
            <div className="activity-tabs">
              <button className="active">{t("posts.posts", "Posts")}</button>
              <button>{t("posts.comments", "Comments")}</button>
            </div>
            <div className="no-activity">
              <MessageSquare size={48} className="text-muted" />
              <p>{t("posts.no_posts_yet")}</p>
            </div>
          </section>

          <ProfileCard title={t("shipping.fleet_info", "Service Details")} isEditable={false}>
            <div className="pro-info-grid">
              <div className="info-row">
                <Award className="icon text-muted" size={24} />
                <div className="text">
                  <h4>Service Type</h4>
                  <p>{t("common.shipping_company", "Logistics & Delivery Provider")}</p>
                </div>
              </div>
              <div className="info-row">
                <CheckCircle className="icon text-muted" size={24} />
                <div className="text">
                  <h4>Status</h4>
                  <p>{t("common.verified", "Verified Partner")}</p>
                </div>
              </div>
            </div>
          </ProfileCard>
        </div>

        <aside className="side-column">
          <section className="linkedin-card language-card">
            <div className="card-header"><h3>{t("doctor.profile_language", "Profile Language")}</h3></div>
            <div className="card-content"><p className="lang-status">{isRtl ? "العربية" : "English"}</p></div>
          </section>

          <section className="linkedin-card contact-card">
            <div className="card-header">
              <h3>Contact Info</h3>
              <button className="icon-btn" onClick={() => toggleEdit("contact")}>
                <Pencil size={18} />
              </button>
            </div>
            <div className="card-content contact-list">
              <div className="contact-item"><Mail size={18} className="text-muted" /> <span>{user?.email}</span></div>
              <div className="contact-item"><Phone size={18} className="text-muted" /> <span>{user?.phone || "---"}</span></div>
              <div className="contact-item"><MapPin size={18} className="text-muted" /> <span>{user?.location || "---"}</span></div>
            </div>
          </section>
        </aside>
      </div>

      <AnimatePresence>
        {isEditing && (
          <div className="edit-overlay" onClick={() => toggleEdit(null)}>
            <motion.div 
              className="edit-modal" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <h3>{t("common.edit")} {editSection}</h3>
                <button onClick={() => toggleEdit(null)}><X size={24} /></button>
              </div>
              <div className="modal-body">
                {editSection === "about" && (
                  <div className="form-group">
                    <label>{t("doctor.bio")}</label>
                    <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="6" />
                  </div>
                )}
                {editSection === "contact" && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>{t("auth.phone_label")}</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label>{t("auth.section_location")}</label>
                      <input name="location" value={formData.location} onChange={handleInputChange} />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="save-btn" onClick={handleSave}>Save changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShippingProfile;
