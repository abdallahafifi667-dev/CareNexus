import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Clock,
  MapPin,
  Calendar,
  User,
  Phone,
  MessageSquare,
  XCircle,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  fetchOrderDetails,
  cancelOrder,
  markArrival,
  confirmCompletion,
} from "../stores/patientService";
import OrderMap from "../../../shared/components/common/OrderMap/OrderMap";
import { motion } from "framer-motion";
import "./OrderDetails.scss";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentOrder, loading, actionLoading, error } = useSelector(
    (state) => state.patient,
  );
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const handleCancel = () => {
    if (
      window.confirm(
        t(
          "orders.confirm_cancel",
          "Are you sure you want to cancel this request?",
        ),
      )
    ) {
      dispatch(cancelOrder({ orderId: id, reason: "Patient cancelled" }));
    }
  };

  const handleMarkArrival = () => {
    dispatch(markArrival(id));
  };

  const handleConfirmCompletion = () => {
    dispatch(confirmCompletion({ orderId: id, feedback }));
  };

  if (loading)
    return (
      <div className="details-loading">
        <div className="spinner"></div>
      </div>
    );
  if (error)
    return (
      <div className="details-error">
        <AlertCircle size={48} />
        <p>{error}</p>
      </div>
    );
  if (!currentOrder) return null;

  const statusColors = {
    open: "#fbbf24",
    confirmed: "#3b82f6",
    in_progress: "#a855f7",
    completed: "#10b981",
    cancelled: "#ef4444",
  };

  return (
    <div className="order-details-page">
      <header className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="header-info">
          <h1>{currentOrder.title}</h1>
          <div className="status-indicator">
            <span
              className="dot"
              style={{ backgroundColor: statusColors[currentOrder.status] }}
            ></span>
            <span className="status-text">
              {t(`status.${currentOrder.status}`, currentOrder.status)}
            </span>
          </div>
        </div>
      </header>

      <div className="details-grid">
        <div className="main-info">
          <section className="info-card">
            <h3>{t("orders.service_info", "Service Information")}</h3>
            <div className="info-item">
              <Calendar size={20} />
              <div>
                <span>{t("orders.appointment_time", "Appointment Time")}</span>
                <strong>
                  {new Date(currentOrder.appointmentDate).toLocaleString()}
                </strong>
              </div>
            </div>
            <div className="info-item">
              <Clock size={20} />
              <div>
                <span>{t("orders.duration", "Expected Duration")}</span>
                <strong>
                  {currentOrder.duration} {t("common.hours", "Hours")}
                </strong>
              </div>
            </div>
            <div className="info-item">
              <MapPin size={20} />
              <div>
                <span>{t("orders.location", "Location")}</span>
                <strong>
                  {t("orders.current_location", "User Registered Address")}
                </strong>
              </div>
            </div>
            <div className="description">
              <p>{currentOrder.description}</p>
            </div>
          </section>

          {currentOrder.provider && (
            <section className="provider-card info-card">
              <h3>{t("orders.provider_details", "Assigned Provider")}</h3>
              <div className="provider-info">
                <div className="avatar">
                  <img
                    src={currentOrder.provider.avatar}
                    alt={currentOrder.provider.username}
                  />
                </div>
                <div className="text">
                  <strong>{currentOrder.provider.username}</strong>
                  <span>{currentOrder.provider.role}</span>
                </div>
                <div className="provider-actions">
                  <button className="icon-btn">
                    <Phone size={20} />
                  </button>
                  <button className="icon-btn">
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {currentOrder.status === "in_progress" && (
            <section className="completion-card info-card">
              <h3>{t("orders.complete_service", "Finalize Service")}</h3>
              <p>
                {t(
                  "orders.feedback_desc",
                  "Please provide feedback and confirm completion.",
                )}
              </p>
              <textarea
                placeholder={t(
                  "orders.feedback_placeholder",
                  "Your experience with this provider...",
                )}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <button
                className="confirm-btn"
                onClick={handleConfirmCompletion}
                disabled={actionLoading}
              >
                <CheckCircle2 size={20} />{" "}
                {t("orders.confirm_completion", "Confirm Completion")}
              </button>
            </section>
          )}
        </div>

        <div className="side-content">
          <div className="map-container">
            <OrderMap
              latitude={currentOrder.meetingPoint?.coordinates[1]}
              longitude={currentOrder.meetingPoint?.coordinates[0]}
              patientName={user?.username}
            />
          </div>

          <div className="financial-card info-card">
            <div className="price-row">
              <span>{t("orders.agreed_price", "Agreed Price")}</span>
              <strong>{currentOrder.price} EGP</strong>
            </div>
            <div className="payment-method">
              <span>{t("orders.payment_method", "Payment Method")}</span>
              <strong>{currentOrder.paymentMethod || "Cash"}</strong>
            </div>
          </div>

          <div className="action-buttons">
            {currentOrder.status === "confirmed" && (
              <button
                className="arrival-btn secondary-action"
                onClick={handleMarkArrival}
                disabled={actionLoading}
              >
                {t("orders.i_arrived", "I Have Arrived")}
              </button>
            )}
            {["open", "confirmed", "awaiting_provider_confirmation"].includes(
              currentOrder.status,
            ) && (
              <button
                className="cancel-btn secondary-action"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                <XCircle size={18} />{" "}
                {t("orders.cancel_request", "Cancel Request")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
