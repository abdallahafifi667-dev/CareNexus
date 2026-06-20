import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  AlertCircle,
  User,
  CheckCircle2,
  Activity,
  Stethoscope,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  Send,
  Shield,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder } from "../stores/patientService";
import OrderMap from "../../../shared/components/common/OrderMap/OrderMap";
import "./CreateOrder.scss";

const CreateOrder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { actionLoading, error } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: "with_provider",
    medicalServiceType: "doctor",
    title: "",
    description: "",
    appointmentDate: "",
    duration: 2,
    urgencyLevel: "normal",
    meetingPoint: {
      type: "Point",
      coordinates: [31.2357, 30.0444],
    },
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (coords) => {
    setFormData((prev) => ({
      ...prev,
      meetingPoint: {
        ...prev.meetingPoint,
        coordinates: [coords.lng, coords.lat],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createOrder(formData));
    if (createOrder.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/patient/orders"), 2000);
    }
  };

  const serviceTypes = [
    {
      id: "doctor",
      icon: Stethoscope,
      label: t("medical_service.doctor_visit", "Doctor Visit"),
      desc: t("orders.doctor_desc", "General consultation & examination"),
      color: "#3b82f6",
    },
    {
      id: "nursing",
      icon: HeartPulse,
      label: t("medical_service.nursing", "Nursing"),
      desc: t("orders.nursing_desc", "Home care & nursing services"),
      color: "#10b981",
    },
  ];

  const urgencyOptions = [
    {
      id: "normal",
      label: t("orders.normal", "Normal"),
      icon: Clock,
      color: "#3b82f6",
      desc: t("orders.normal_desc", "Within 24 hours"),
    },
    {
      id: "emergency",
      label: t("orders.emergency", "Emergency"),
      icon: Zap,
      color: "#ef4444",
      desc: t("orders.emergency_desc", "As soon as possible"),
    },
  ];

  if (success) {
    return (
      <div className="success-overlay">
        <motion.div
          className="success-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="icon-circle">
            <CheckCircle2 size={64} />
          </div>
          <h2>{t("orders.request_sent", "Request Sent Successfully!")}</h2>
          <p>
            {t(
              "orders.request_sent_desc",
              "Providers near you will be notified immediately.",
            )}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="create-order-page">
      {/* Hero Header */}
      <div className="co-hero">
        <div className="co-hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("orders.request_new_service", "Request a New Service")}
          </motion.h1>
          <p>{t("orders.request_desc", "Fill in the details to find a provider near you.")}</p>
        </div>

        {/* Step Indicator */}
        <div className="co-steps">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`co-step ${step >= s ? "active" : ""} ${step > s ? "done" : ""}`}>
                <div className="co-step-circle">
                  {step > s ? <CheckCircle2 size={18} /> : s}
                </div>
                <span className="co-step-label">
                  {s === 1 && t("orders.step_service", "Service")}
                  {s === 2 && t("orders.step_details", "Details")}
                  {s === 3 && t("orders.step_location", "Location")}
                </span>
              </div>
              {s < 3 && <div className={`co-step-line ${step > s ? "filled" : ""}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        <AnimatePresence mode="wait">
          {/* STEP 1: Service Selection */}
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="form-step"
            >
              <div className="step-header">
                <h3>{t("orders.select_service_type", "What service do you need?")}</h3>
                <p className="step-subtitle">{t("orders.select_service_desc", "Choose the type of medical service you need")}</p>
              </div>

              <div className="service-grid">
                {serviceTypes.map((service) => (
                  <motion.div
                    key={service.id}
                    className={`service-card ${formData.medicalServiceType === service.id ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        medicalServiceType: service.id,
                      }))
                    }
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="service-card-icon" style={{ backgroundColor: `${service.color}15`, color: service.color }}>
                      <service.icon size={36} />
                    </div>
                    <h4>{service.label}</h4>
                    <p>{service.desc}</p>
                    {formData.medicalServiceType === service.id && (
                      <motion.div
                        className="check-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ backgroundColor: service.color }}
                      >
                        <CheckCircle2 size={16} color="white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="form-fields">
                <div className="input-group">
                  <label>{t("orders.title", "Request Title")}</label>
                  <input
                    type="text"
                    name="title"
                    placeholder={t("orders.title_placeholder", "e.g. General Checkup")}
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label>{t("orders.description", "Problem Description")}</label>
                  <textarea
                    name="description"
                    placeholder={t("orders.desc_placeholder", "Describe your symptoms...")}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => setStep(2)}
                >
                  {t("common.next", "Next Step")}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.section>
          )}

          {/* STEP 2: Details & Urgency */}
          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="form-step"
            >
              <div className="step-header">
                <h3>{t("orders.step_details", "Appointment Details")}</h3>
                <p className="step-subtitle">{t("orders.step_details_desc", "When and how urgent is your request?")}</p>
              </div>

              <div className="form-fields">
                <div className="grid-2">
                  <div className="input-group">
                    <label>
                      <Calendar size={16} /> {t("orders.date", "Date & Time")}
                    </label>
                    <input
                      type="datetime-local"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <Clock size={16} /> {t("orders.duration", "Duration (Hours)")}
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      max="24"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>{t("orders.urgency", "Urgency Level")}</label>
                  <div className="urgency-options">
                    {urgencyOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`urgency-btn ${formData.urgencyLevel === opt.id ? "active" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            urgencyLevel: opt.id,
                          }))
                        }
                        style={{
                          "--urgency-color": opt.color,
                        }}
                      >
                        <opt.icon size={20} />
                        <div className="urgency-info">
                          <strong>{opt.label}</strong>
                          <span>{opt.desc}</span>
                        </div>
                        {formData.urgencyLevel === opt.id && (
                          <CheckCircle2 size={18} className="urgency-check" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={18} />
                  {t("common.back", "Back")}
                </button>
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => setStep(3)}
                >
                  {t("common.next", "Next Step")}
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.section>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <motion.section
              key="step3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="form-step"
            >
              <div className="step-header">
                <h3>
                  <MapPin size={22} /> {t("orders.meeting_point", "Meeting Point")}
                </h3>
                <p className="step-subtitle">
                  {t("orders.location_hint", "Point on the map where you want to receive the service.")}
                </p>
              </div>

              <div className="map-container">
                <OrderMap
                  latitude={formData.meetingPoint.coordinates[1]}
                  longitude={formData.meetingPoint.coordinates[0]}
                  label={user?.username}
                />
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="step-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={18} />
                  {t("common.back", "Back")}
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <div className="btn-spinner"></div>
                      {t("common.sending", "Sending...")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("orders.send_request", "Send Request")}
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default CreateOrder;
