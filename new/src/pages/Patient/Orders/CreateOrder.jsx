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
      coordinates: [31.2357, 30.0444], // Default Cairo [lng, lat]
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
      icon: User,
      label: t("medical_service.doctor_visit", "Doctor Visit"),
    },
    {
      id: "nursing",
      icon: Activity,
      label: t("medical_service.nursing", "Nursing"),
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
      <header className="page-header">
        <h1>{t("orders.request_new_service", "Request a New Service")}</h1>
        <div className="step-indicator">
          <span className={step >= 1 ? "active" : ""}>1</span>
          <div className="line"></div>
          <span className={step >= 2 ? "active" : ""}>2</span>
          <div className="line"></div>
          <span className={step >= 3 ? "active" : ""}>3</span>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="order-form">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-step"
            >
              <h3>
                {t("orders.select_service_type", "What service do you need?")}
              </h3>
              <div className="service-grid">
                {serviceTypes.map((service) => (
                  <div
                    key={service.id}
                    className={`service-card ${formData.medicalServiceType === service.id ? "selected" : ""}`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        medicalServiceType: service.id,
                      }))
                    }
                  >
                    <service.icon size={32} />
                    <span>{service.label}</span>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <label>{t("orders.title", "Request Title")}</label>
                <input
                  type="text"
                  name="title"
                  placeholder={t(
                    "orders.title_placeholder",
                    "e.g. General Checkup",
                  )}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>{t("orders.description", "Problem Description")}</label>
                <textarea
                  name="description"
                  placeholder={t(
                    "orders.desc_placeholder",
                    "Describe your symptoms...",
                  )}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="button"
                className="next-btn"
                onClick={() => setStep(2)}
              >
                {t("common.next", "Next Step")} <ChevronRight size={18} />
              </button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-step"
            >
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
                    <Clock size={16} />{" "}
                    {t("orders.duration", "Duration (Hours)")}
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

              <div className="urgency-selector">
                <label>{t("orders.urgency", "Urgency Level")}</label>
                <div className="urgency-options">
                  <button
                    type="button"
                    className={
                      formData.urgencyLevel === "normal" ? "active" : ""
                    }
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        urgencyLevel: "normal",
                      }))
                    }
                  >
                    {t("orders.normal", "Normal")}
                  </button>
                  <button
                    type="button"
                    className={`emergency ${formData.urgencyLevel === "emergency" ? "active" : ""}`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        urgencyLevel: "emergency",
                      }))
                    }
                  >
                    <AlertCircle size={16} />{" "}
                    {t("orders.emergency", "Emergency")}
                  </button>
                </div>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(1)}
                >
                  {t("common.back", "Back")}
                </button>
                <button
                  type="button"
                  className="next-btn"
                  onClick={() => setStep(3)}
                >
                  {t("common.next", "Next Step")}
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="form-step"
            >
              <h3>
                <MapPin size={20} />{" "}
                {t("orders.meeting_point", "Meeting Point")}
              </h3>
              <p className="hint">
                {t(
                  "orders.location_hint",
                  "Point on the map where you want to receive the service.",
                )}
              </p>

              <div className="map-container">
                <OrderMap
                  latitude={formData.meetingPoint.coordinates[1]}
                  longitude={formData.meetingPoint.coordinates[0]}
                  label={user?.username}
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep(2)}
                >
                  {t("common.back", "Back")}
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? t("common.sending", "Sending...")
                    : t("orders.send_request", "Send Request")}
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
