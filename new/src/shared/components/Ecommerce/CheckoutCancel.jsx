import React from "react";
import { XCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./PaymentStatus.scss";

const CheckoutCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-status-page cancel">
      <motion.div
        className="status-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="icon-wrapper">
          <XCircle size={64} />
        </div>
        <h1>Payment Cancelled</h1>
        <p>
          Your payment session was cancelled. Don't worry, your cart is still
          safe and you can try again whenever you're ready.
        </p>
        <div className="action-buttons">
          <button className="primary-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Go Back to Cart
          </button>
          <button className="secondary-btn" onClick={() => navigate("/")}>
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutCancel;
