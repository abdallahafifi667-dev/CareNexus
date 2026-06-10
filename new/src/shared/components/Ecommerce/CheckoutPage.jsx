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
import ecommerceApi from "../../../utils/ecommerceApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getRoleBasePath } from "../../../shared/utils/roleRoutes";
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
    dispatch(fetchCartItems());
  }, [dispatch]);

  const getRolePath = () => getRoleBasePath(user?.role);

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
        window.location.href = res.data.session.url;
      } else {
        toast.success("Order placed successfully!");
        navigate(`${getRolePath()}/orders`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h3>Your cart is empty</h3>
        <button onClick={() => navigate(-1)}>Back to Shop</button>
      </div>
    );
  }

  const totalAmount = typeof cart.totalAmount === "number" ? cart.totalAmount : 0;

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
                  <span className="option-desc">Pay when your order arrives</span>
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
              {cart.items.map((item, idx) => {
                const productName = item.product?.name || item.name || "Product";
                const qty = item.quantity || 1;
                const price = item.price || 0;
                return (
                  <div key={idx} className="summary-item">
                    <span className="item-name">{productName} x {qty}</span>
                    <span className="item-price">${(price * qty).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="summary-divider" />

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
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
