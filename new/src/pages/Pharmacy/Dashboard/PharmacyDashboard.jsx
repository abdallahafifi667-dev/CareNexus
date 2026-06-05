import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { setCurrentTitle, fetchPharmacyProducts, fetchPharmacyOrders, fetchContracts } from "../stores/pharmacySlice";
import { 
    Package, 
    ClipboardList, 
    Handshake, 
    TrendingUp, 
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    CheckCircle,
    ArrowRight,
    Clock
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../../../shared/components/loader/Loader";
import "./PharmacyDashboard.scss";

const StatCard = ({ title, value, icon: Icon, color, suffix = "" }) => (
    <div className={`stat-card ${color}`}>
        <div className="stat-icon">
            <Icon size={24} />
        </div>
        <div className="stat-content">
            <span className="stat-label">{title}</span>
            <div className="stat-value">
                <span>{value?.toLocaleString() || 0}</span>
                {suffix && <span className="suffix">{suffix}</span>}
            </div>
        </div>
    </div>
);

const PharmacyDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { products, orders, contracts, loading } = useSelector((state) => state.pharmacy);

    useEffect(() => {
        dispatch(setCurrentTitle("Dashboard Overview"));
        dispatch(fetchPharmacyProducts());
        dispatch(fetchPharmacyOrders());
        dispatch(fetchContracts());
    }, [dispatch]);

    // Only show full loader on initial load if we have no products yet
    if (loading && (!products || (Array.isArray(products) && products.length === 0))) {
        return <Loader loading={true} inline={true} />;
    }

    const safeProducts = Array.isArray(products) ? products : [];
    const safeOrders = Array.isArray(orders) ? orders : [];
    const safeContracts = Array.isArray(contracts) ? contracts : [];

    const stats = [
        {
            title: t("pharmacy.stats.inventory", { defaultValue: "Total Inventory" }),
            value: safeProducts.length || 0,
            icon: Package,
            color: "blue",
        },
        {
            title: t("pharmacy.stats.orders", { defaultValue: "Active Orders" }),
            value: safeOrders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length || 0,
            icon: ClipboardList,
            color: "orange",
        },
        {
            title: t("pharmacy.stats.contracts", { defaultValue: "Shipping Contracts" }),
            value: safeContracts.filter(c => c.status === "accepted").length || 0,
            icon: Handshake,
            color: "green",
        },
        {
            title: t("pharmacy.stats.revenue", { defaultValue: "Monthly Revenue" }),
            value: 12450,
            icon: TrendingUp,
            color: "purple",
            suffix: ` $`,
        }
    ];

    return (
        <div className="pharmacy-dashboard">
            <div className="welcome-banner">
                <div className="banner-content">
                    <div className="banner-greeting">
                        <span className="date-badge">
                            {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </span>
                        <h1>{t('common.welcome_back', { name: user?.username?.split(' ')[0] || "Pharmacist" })}!</h1>
                        <p>{t('pharmacy.dashboard_intro', { defaultValue: 'Manage your pharmacy stock, orders, and contracts efficiently.' })}</p>

                        <div className="banner-stats-preview">
                            <div className="mini-stat">
                                <span className="label">{t('pharmacy.stats.active_orders', { defaultValue: "Orders" })}</span>
                                <span className="value">{safeOrders.length || 0}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="mini-stat">
                                <span className="label">{t('pharmacy.stats.low_stock', { defaultValue: "Low Stock" })}</span>
                                <span className="value">{safeProducts.filter(p => p.quantity < 10).length || 0}</span>
                            </div>
                        </div>

                        <button className="banner-cta" onClick={() => navigate('/pharmacy/products')}>
                            {t('pharmacy.manage_inventory', { defaultValue: "Manage Inventory" })}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="banner-illustration">
                    <div className="circle-bg"></div>
                    <Package className="floating-icon" size={120} />
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-main-grid">
                <section className="recent-activity floating-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="card-content">
                        {orders?.length > 0 ? (
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeOrders.slice(0, 5).map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id?.slice(-6) || "---"}</td>
                                            <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "---"}</td>
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
                                <p>No recent orders found</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="inventory-status floating-card">
                    <div className="card-header">
                        <h3>Inventory Alerts</h3>
                    </div>
                    <div className="card-content">
                        {safeProducts.filter(p => p.quantity < 10).length > 0 ? (
                            <div className="alert-list">
                                {safeProducts.filter(p => p.quantity < 10).slice(0, 4).map(product => (
                                    <div key={product._id} className="alert-item">
                                        <AlertCircle size={18} className="text-red" />
                                        <div className="alert-info">
                                            <p className="product-name">{product.name}</p>
                                            <p className="stock-count">Low stock: {product.quantity} units</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="success-state">
                                <Package size={40} className="text-green" />
                                <p>All items in stock</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
