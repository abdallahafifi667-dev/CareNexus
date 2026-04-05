import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { fetchCartItems } from "../../../store/slices/ecommerceSlice";
import { setHeaderTitle as setDoctorTitle } from "../../../pages/Doctor/stores/doctorSlice";
import { setHeaderTitle as setPatientTitle } from "../../../pages/Patient/stores/patientSlice";
import ecommerceApi from "../../../utils/ecommerceApi";

import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.scss";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.ecommerce);
  const { user } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(user?.Address || "");
  const [paymentMethod, setPaymentMethod] = useState("monetary");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const title = t("ecommerce.checkout", "Checkout");
    if (user?.role === "doctor" || user?.role === "nursing") {
      dispatch(setDoctorTitle(title));
    } else if (user?.role === "patient") {
      dispatch(setPatientTitle(title));
    }
    dispatch(fetchCartItems());
  }, [dispatch, user?.role, t]);

  const handlePlaceOrder = async () => {
    if (!address) {
      return toast.error("Please provide a shipping address");
    }

    setProcessing(true);
    try {
      const res = await ecommerceApi.checkout({
        address,
        paymentMethod,
      });

      if (paymentMethod === "credit_card" && res.data.session?.url) {
        // Redirect to Stripe
        window.location.href = res.data.session.url;
      } else {
        toast.success("Order placed successfully!");
        const rolePath = user?.role === "patient" ? "/patient" : "/doctor";
        navigate(`${rolePath}/orders`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h3>Your cart is empty</h3>
        <button onClick={() => navigate(-1)}>Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <section className="checkout-section">
            <div className="section-header">
              <MapPin size={24} />
              <h2>Delivery Address</h2>
            </div>
            <div className="address-box">
              <textarea
                placeholder="Enter your full delivery address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </section>

          <section className="checkout-section">
            <div className="section-header">
              <CreditCard size={24} />
              <h2>Payment Method</h2>
            </div>
            <div className="payment-options">
              <div
                className={`payment-option ${paymentMethod === "monetary" ? "active" : ""}`}
                onClick={() => setPaymentMethod("monetary")}
              >
                <Banknote size={24} />
                <div className="option-info">
                  <span className="option-title">Cash on Delivery</span>
                  <span className="option-desc">
                    Pay when your order arrives
                  </span>
                </div>
              </div>

              <div
                className={`payment-option ${paymentMethod === "credit_card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <CreditCard size={24} />
                <div className="option-info">
                  <span className="option-title">Credit / Debit Card</span>
                  <span className="option-desc">Secure payment via Stripe</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="checkout-sidebar">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-list">
              {cart.items.map((item) => {
                const productId = item.product.id || item.product._id;
                return (
                <div key={productId} className="summary-item">
                  <span className="item-name">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              )})}
            </div>

            <div className="summary-divider" />

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="safety-badge">
              <ShieldCheck size={18} />
              <span>Secure Checkout Protected</span>
            </div>

            <button
              className={`place-order-btn ${processing ? "loading" : ""}`}
              onClick={handlePlaceOrder}
              disabled={processing}
            >
              {processing ? "Processing..." : "Complete Purchase"}
              {!processing && <ChevronRight size={20} />}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
