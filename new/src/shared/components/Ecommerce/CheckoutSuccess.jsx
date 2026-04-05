import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "./PaymentStatus.scss";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGoOrders = () => {
    const rolePath = user?.role === "patient" ? "/patient" : "/doctor";
    navigate(`${rolePath}/orders`);
  };

  return (
    <div className="payment-status-page success">
      <motion.div
        className="status-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="icon-wrapper">
          <CheckCircle size={64} />
        </div>
        <h1>Payment Successful!</h1>
        <p>
          Thank you for your purchase. Your order has been placed and is being
          processed by our pharmacy partners.
        </p>
        <div className="action-buttons">
          <button className="primary-btn" onClick={handleGoOrders}>
            View My Orders
            <ArrowRight size={20} />
          </button>
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
