import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentTitle, fetchPharmacyProducts, fetchPharmacyOrders, fetchContracts } from "../stores/pharmacySlice";
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
    const dispatch = useDispatch();
    const { products, orders, contracts, loading } = useSelector((state) => state.pharmacy);

    useEffect(() => {
        dispatch(setCurrentTitle("Dashboard Overview"));
        dispatch(fetchPharmacyProducts());
        dispatch(fetchPharmacyOrders());
        dispatch(fetchContracts());
    }, [dispatch]);

    const stats = [
        {
            title: "Total Inventory",
            value: products?.length || 0,
            icon: Package,
            color: "blue",
            trend: "up",
            trendValue: "+12%"
        },
        {
            title: "Active Orders",
            value: orders?.filter(o => o.status !== "delivered" && o.status !== "cancelled").length || 0,
            icon: ClipboardList,
            color: "orange",
            trend: "up",
            trendValue: "+5%"
        },
        {
            title: "Shipping Contracts",
            value: contracts?.filter(c => c.status === "accepted").length || 0,
            icon: Handshake,
            color: "green",
            trend: "up",
            trendValue: "+2"
        },
        {
            title: "Total Revenue",
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
                    <h1>Daily Performance</h1>
                    <p className="text-muted">Monitor your pharmacy's operations and inventory at a glance.</p>
                </div>
                <div className="date-display">
                    <Activity size={18} className="text-green" />
                    <span>System Online • {new Date().toLocaleDateString()}</span>
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
                        {products?.filter(p => p.quantity < 10).length > 0 ? (
                            <div className="alert-list">
                                {products.filter(p => p.quantity < 10).slice(0, 4).map(product => (
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
