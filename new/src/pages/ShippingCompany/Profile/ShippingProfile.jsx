import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
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

  return (
    <motion.div 
      className={`shipping-profile-redesign ${isRtl ? "rtl" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="profile-layout-grid">
        <div className="main-column">
          <section className="linkedin-card header-card">
            <div className="cover-photo" style={user?.coverPhoto ? { backgroundImage: `url(${user.coverPhoto})`, backgroundSize: "cover" } : {}}>
              <button className="edit-cover-btn" onClick={() => coverInputRef.current.click()} disabled={uploading}>
                <Camera size={20} />
              </button>
              <input type="file" ref={coverInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileChange(e, "coverPhoto")} />
            </div>
            <div className="header-content">
              <div className="avatar-container">
                <div className="avatar-circle">
                  {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <div className="avatar-placeholder"><Truck size={80} /></div>}
                  <button className="change-photo-btn" onClick={() => avatarInputRef.current.click()} disabled={uploading}>
                    <Camera size={20} />
                  </button>
                  <input type="file" ref={avatarInputRef} style={{ display: "none" }} accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
                </div>
              </div>
              <div className="identity-section">
                <div className="top-row">
                  <h1>{user?.username}</h1>
                  <button className="icon-btn" onClick={() => setEditSection("header")}>
                    <Pencil size={20} />
                  </button>
                </div>
                <p className="headline">{user?.role === "shipping_company" ? t("common.shipping_company", "Logistics & Delivery Provider") : user?.role}</p>
                <div className="location-info">
                  <span className="text-muted"><MapPin size={16} /> {user?.location || t("common.no_location", "No location")}</span>
                </div>
              </div>
            </div>
          </section>

          <ProfileCard title={t("common.about", "About")} onEdit={() => setEditSection("about")}>
            <p className="bio-text">{user?.description || t("common.no_bio", "No description provided yet.")}</p>
          </ProfileCard>

          <ProfileCard title={t("shipping.fleet_info", "Fleet Information")} isEditable={false}>
            <div className="pro-info-grid">
              <div className="info-row">
                <CheckCircle className="text-muted" size={24} />
                <div className="text">
                  <h4>Status</h4>
                  <p>{t("common.verified", "Verified Partner")}</p>
                </div>
              </div>
            </div>
          </ProfileCard>
        </div>

        <aside className="side-column">
          <section className="linkedin-card">
            <div className="card-header"><h3>Contact Info</h3></div>
            <div className="card-content contact-list">
              <div className="contact-item"><Mail size={18} className="text-muted" /> <span>{user?.email}</span></div>
              <div className="contact-item"><Phone size={18} className="text-muted" /> <span>{user?.phone || "---"}</span></div>
            </div>
          </section>
        </aside>
      </div>

      <AnimatePresence>
        {editSection && (
          <div className="edit-overlay" onClick={() => setEditSection(null)}>
            <motion.div className="edit-modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              {/* Simplified Modal Content */}
              <div className="modal-header"><h3>Edit Profile</h3> <button onClick={() => setEditSection(null)}><X size={24} /></button></div>
              <div className="modal-body" style={{ padding: "1.5rem" }}>
                <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} rows="5" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }} />
              </div>
              <div className="modal-footer" style={{ padding: "1rem", textAlign: "right", borderTop: "1px solid #eee" }}>
                <button className="save-btn" onClick={handleSave} style={{ background: "#3b82f6", color: "white", padding: "8px 20px", borderRadius: "20px", border: "none" }}>Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShippingProfile;
