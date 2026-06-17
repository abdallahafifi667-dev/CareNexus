import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTitle, fetchPharmacyProducts, fetchPharmacyOrders, fetchContracts } from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";
import { 
    LayoutDashboard, 
    Package, 
    ClipboardList, 
    Handshake, 
    TrendingUp, 
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import "./PharmacyDashboard.scss";

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <motion.div 
        className="stat-card"
        whileHover={{ translateY: -5 }}
    >
        <div className="card-body">
            <div className={`icon-container ${color}`}>
                <Icon size={24} />
            </div>
            <div className="stat-info">
                <p className="stat-label">{title}</p>
                <h3 className="stat-value">{value}</h3>
                {trend && (
                    <div className={`stat-trend ${trend}`}>
                        {trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);

const PharmacyDashboard = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { products, orders, contracts, loading } = useSelector((state) => state.pharmacy);

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.dashboard", "Dashboard Overview")));
        dispatch(fetchPharmacyProducts());
        dispatch(fetchPharmacyOrders());
        dispatch(fetchContracts());
    }, [dispatch, t]);

    const stats = [
        {
            title: t("pharmacy.total_inventory", "Total Inventory"),
            value: products?.length || 0,
            icon: Package,
            color: "blue",
            trend: "up",
            trendValue: "+12%"
        },
        {
            title: t("pharmacy.active_orders", "Active Orders"),
            value: orders?.filter(o => o.status !== "delivered" && o.status !== "cancelled").length || 0,
            icon: ClipboardList,
            color: "orange",
            trend: "up",
            trendValue: "+5%"
        },
        {
            title: t("pharmacy.shipping_contracts", "Shipping Contracts"),
            value: contracts?.filter(c => c.status === "accepted").length || 0,
            icon: Handshake,
            color: "green",
            trend: "up",
            trendValue: "+2"
        },
        {
            title: t("pharmacy.total_revenue", "Total Revenue"),
            value: "$12,450",
            icon: TrendingUp,
            color: "purple",
            trend: "up",
            trendValue: "+18%"
        }
    ];

    return (
        <div className="pharmacy-dashboard-container">
            <header className="dashboard-header">
                <div className="welcome-section">
                    <h1>{t("pharmacy.daily_performance", "Daily Performance")}</h1>
                    <p className="text-muted">{t("pharmacy.monitor_operations", "Monitor your pharmacy's operations and inventory at a glance.")}</p>
                </div>
                <div className="date-display">
                    <Activity size={18} className="text-green" />
                    <span>{t("pharmacy.system_online", "System Online")} • {new Date().toLocaleDateString()}</span>
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-main-grid">
                <section className="recent-activity floating-card">
                    <div className="card-header">
                        <h3>{t("pharmacy.recent_orders", "Recent Orders")}</h3>
                        <button className="view-all-btn">{t("common.view_all", "View All")}</button>
                    </div>
                    <div className="card-content">
                        {orders?.length > 0 ? (
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>{t("pharmacy.order_id", "Order ID")}</th>
                                        <th>{t("pharmacy.date", "Date")}</th>
                                        <th>{t("pharmacy.status", "Status")}</th>
                                        <th>{t("pharmacy.total", "Total")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id.slice(-6)}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`status-pill ${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>${order.totalPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <ClipboardList size={40} />
                                <p>{t("pharmacy.no_recent_orders", "No recent orders found")}</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="inventory-status floating-card">
                    <div className="card-header">
                        <h3>{t("pharmacy.inventory_alerts", "Inventory Alerts")}</h3>
                    </div>
                    <div className="card-content">
                        {products?.filter(p => p.quantity < 10).length > 0 ? (
                            <div className="alert-list">
                                {products.filter(p => p.quantity < 10).slice(0, 4).map(product => (
                                    <div key={product._id} className="alert-item">
                                        <AlertCircle size={18} className="text-red" />
                                        <div className="alert-info">
                                            <p className="product-name">{product.name}</p>
                                            <p className="stock-count">{t("pharmacy.low_stock_alert", "Low stock: {{count}} units", { count: product.quantity })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="success-state">
                                <Package size={40} className="text-green" />
                                <p>{t("pharmacy.all_in_stock", "All items in stock")}</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
