import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchPatientOrders } from "../stores/patientService";
import "./PatientOrders.scss";

const PatientOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchPatientOrders());
  }, [dispatch]);

  const getStatusInfo = (status) => {
    const statuses = {
      open: { color: "#fbbf24", icon: Search, label: t("status.open", "Open") },
      awaiting_provider_confirmation: {
        color: "#6366f1",
        icon: Clock,
        label: t("status.awaiting", "Awaiting Confirmation"),
      },
      confirmed: {
        color: "#3b82f6",
        icon: CheckCircle2,
        label: t("status.confirmed", "Confirmed"),
      },
      in_progress: {
        color: "#a855f7",
        icon: Activity,
        label: t("status.in_progress", "In Progress"),
      },
      completed: {
        color: "#10b981",
        icon: CheckCircle2,
        label: t("status.completed", "Completed"),
      },
      cancelled: {
        color: "#ef4444",
        icon: AlertCircle,
        label: t("status.cancelled", "Cancelled"),
      },
    };
    return statuses[status] || statuses.open;
  };

  return (
    <div className="patient-orders-page">
      <header className="page-header">
        <div className="header-text">
          <h1>{t("orders.my_requests", "My Trip Requests")}</h1>
          <p>
            {t(
              "orders.manage_desc",
              "Track and manage your requested medical services.",
            )}
          </p>
        </div>
        <Link to="/patient/orders/create" className="add-request-btn">
          <Plus size={20} />
          <span>{t("orders.new_request", "New Request")}</span>
        </Link>
      </header>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t(
              "orders.search_placeholder",
              "Find a previous request...",
            )}
          />
        </div>
        <div className="filter-actions">
          <button className="filter-btn">
            <Filter size={18} />
            <span>{t("common.filter", "All Services")}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t("common.loading", "Loading your requests...")}</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>{t("common.error_occurred", "Oops! Something went wrong")}</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(fetchPatientOrders())}>
            {t("common.retry", "Retry")}
          </button>
        </div>
      ) : orders?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrapper">
            <Calendar size={64} />
          </div>
          <h2>{t("orders.no_orders", "No requests found")}</h2>
          <p>
            {t(
              "orders.no_orders_desc",
              "You haven't made any medical service requests yet.",
            )}
          </p>
          <Link to="/patient/orders/create" className="empty-action-btn">
            {t("orders.create_first", "Request your first service")}
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders?.map((order, index) => {
            const status = getStatusInfo(order.status);
            return (
              <motion.div
                key={order._id}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="card-header">
                  <div
                    className="status-badge"
                    style={{
                      backgroundColor: `${status.color}15`,
                      color: status.color,
                    }}
                  >
                    <status.icon size={14} />
                    <span>{status.label}</span>
                  </div>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="card-body">
                  <h3 className="order-title">{order.title}</h3>
                  <p className="order-desc">{order.description}</p>

                  <div className="order-meta">
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{order.medicalServiceType}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>
                        {new Date(order.appointmentDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="price-tag">
                    <span className="currency">EGP</span>
                    <span className="amount">{order.price}</span>
                  </div>
                  <Link
                    to={`/patient/orders/${order._id}`}
                    className="details-link"
                  >
                    {t("common.view_details", "Details")}
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientOrders;
