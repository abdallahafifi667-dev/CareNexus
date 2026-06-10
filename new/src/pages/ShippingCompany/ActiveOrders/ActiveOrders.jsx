import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setCurrentTitle,
  fetchShippedOrders,
  markOrderPickedUp,
  markOrderDelivered,
} from "../stores/shippingSlice";
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  User,
  AlertCircle,
  RefreshCw,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";
import "./ActiveOrders.scss";

const ActiveOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeOrders, loading, error } = useSelector((state) => state.shipping);

  const [filter, setFilter] = useState("all");

  const loadOrders = useCallback(() => {
    dispatch(fetchShippedOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentTitle(t("nav.active_orders", { defaultValue: "Active Deliveries" })));
    loadOrders();
  }, [dispatch, t, loadOrders]);

  const handlePickup = async (orderId) => {
    try {
      await dispatch(markOrderPickedUp(orderId)).unwrap();
      toast.success(t("shipping.picked_up", "Order picked up successfully!"));
      loadOrders();
    } catch (err) {
      toast.error(err.message || "Failed to mark as picked up");
    }
  };

  const handleDeliver = async (orderId) => {
    try {
      await dispatch(markOrderDelivered(orderId)).unwrap();
      toast.success(t("shipping.delivered", "Order delivered successfully!"));
      loadOrders();
    } catch (err) {
      toast.error(err.message || "Failed to mark as delivered");
    }
  };

  const filteredOrders = activeOrders.filter((order) => {
    if (filter === "all") return true;
    return order.orderStatus === filter;
  });

  const statusGroups = [
    { key: "all", label: t("shipping.all", "All"), count: activeOrders.length },
    { key: "ready", label: t("shipping.ready_pickup", "Ready for Pickup"), count: activeOrders.filter((o) => o.orderStatus === "ready").length },
    { key: "shipped", label: t("shipping.in_transit", "In Transit"), count: activeOrders.filter((o) => o.orderStatus === "shipped").length },
  ];

  return (
    <div className="shipping-active-page">
      <header className="page-header">
        <div className="header-text">
          <h1>{t("shipping.active_deliveries", "Active Deliveries")}</h1>
          <p>{t("shipping.active_desc", "Manage your current delivery assignments and track progress.")}</p>
        </div>
        <button className="refresh-btn" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spinning" : ""} />
          <span>{t("common.refresh", "Refresh")}</span>
        </button>
      </header>

      <div className="status-tabs">
        {statusGroups.map((group) => (
          <button
            key={group.key}
            className={`status-tab ${filter === group.key ? "active" : ""}`}
            onClick={() => setFilter(group.key)}
          >
            <span>{group.label}</span>
            <span className="count">{group.count}</span>
          </button>
        ))}
      </div>

      {loading && activeOrders.length === 0 ? (
        <div className="loading-state">
          <Loader loading={true} />
        </div>
      ) : error ? (
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>{t("common.error_occurred", "Something went wrong")}</h3>
          <p>{error}</p>
          <button onClick={loadOrders}>{t("common.retry", "Retry")}</button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <Truck size={64} />
          <h3>{t("shipping.no_active", "No active deliveries")}</h3>
          <p>{t("shipping.no_active_desc", "New delivery assignments will appear here.")}</p>
        </div>
      ) : (
        <div className="deliveries-grid">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              className="delivery-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="card-top">
                <div className="order-info">
                  <span className="order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                  <span className={`status-dot ${order.orderStatus}`}>
                    {order.orderStatus === "ready" ? t("shipping.ready_pickup", "Ready for Pickup") : t("shipping.in_transit", "In Transit")}
                  </span>
                </div>
                <span className="order-time">
                  <Clock size={14} />
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="card-body">
                <div className="route-info">
                  <div className="route-point">
                    <div className="point-icon pickup">
                      <Package size={16} />
                    </div>
                    <div className="point-details">
                      <span className="label">{t("shipping.pickup_from", "Pickup from")}</span>
                      <span className="value">{order.pharmacy?.username || order.pharmacy?.name || "Pharmacy"}</span>
                      <span className="address">{order.pharmacy?.Address || order.pickupAddress || "N/A"}</span>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-point">
                    <div className="point-icon deliver">
                      <MapPin size={16} />
                    </div>
                    <div className="point-details">
                      <span className="label">{t("shipping.deliver_to", "Deliver to")}</span>
                      <span className="value">{order.userId?.username || order.patient?.name || "Patient"}</span>
                      <span className="address">{order.shippingAddress || order.deliveryAddress || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="order-meta">
                  <div className="meta-item">
                    <Package size={14} />
                    <span>{order.items?.length || 0} {t("shipping.items", "items")}</span>
                  </div>
                  <div className="meta-item">
                    <span className="price">${order.totalPrice || order.deliveryFee || "0.00"}</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                {order.orderStatus === "ready" && (
                  <button
                    className="action-btn pickup-btn"
                    onClick={() => handlePickup(order._id)}
                  >
                    <Navigation size={16} />
                    {t("shipping.mark_picked_up", "Mark Picked Up")}
                  </button>
                )}
                {order.orderStatus === "shipped" && (
                  <button
                    className="action-btn deliver-btn"
                    onClick={() => handleDeliver(order._id)}
                  >
                    <CheckCircle2 size={16} />
                    {t("shipping.mark_delivered", "Mark Delivered")}
                  </button>
                )}
                <button className="action-btn contact-btn">
                  <Phone size={16} />
                  {t("shipping.contact", "Contact")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
