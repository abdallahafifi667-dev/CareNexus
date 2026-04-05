import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ChevronRight } from "lucide-react";
import {
  fetchCartItems,
  removeFromCart,
  addToCart,
} from "../../../store/slices/ecommerceSlice";
import { toast } from "react-hot-toast";

import "./CartDrawer.scss";

const CartDrawer = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.ecommerce);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      dispatch(fetchCartItems());
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, dispatch]);

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.success(t("ecommerce.item_removed", "Item removed from cart"));
    } catch (err) {
      toast.error(err?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (product, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(
        addToCart({
          product: product.id || product._id, // Support both during migration
          quantity: newQuantity,
          price: product.price,
        })
      ).unwrap();
    } catch (err) {
      toast.error(err?.message || "Failed to update quantity");
    }
  };

  const handleCheckout = () => {
    onClose();
    const basePath = user?.role === "patient" ? "/patient" : "/doctor";
    navigate(`${basePath}/checkout`);
  };

  const handleContinueShopping = () => {
    onClose();
    const basePath = user?.role === "patient" ? "/patient" : "/doctor";
    navigate(`${basePath}/marketplace`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`cart-drawer ${i18n.language === "ar" ? "rtl" : ""}`}
            initial={{ x: i18n.language === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: i18n.language === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="drawer-header">
              <h2>
                <ShoppingBag size={24} />
                {t("ecommerce.your_cart", "Your Cart")}
              </h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {loading && !cart ? (
                <div className="empty-cart">
                  <p>{t("common.loading", "Loading...")}</p>
                </div>
              ) : !cart || cart.items?.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={64} />
                  <p>{t("ecommerce.cart_empty", "Your cart is currently empty")}</p>
                  <button onClick={handleContinueShopping}>
                    {t("ecommerce.start_shopping", "Start Shopping")}
                  </button>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.items.map((item) => {
                    const productObj = item.product;
                    const productId = productObj?.id || productObj?._id;
                    return (
                      <div className="cart-item" key={productId}>
                        <div className="item-image">
                          <img
                            src={
                              productObj?.imageUrl?.[0] ||
                              "https://via.placeholder.com/150"
                            }
                            alt={productObj?.name}
                          />
                        </div>
                        <div className="item-details">
                          <h4>{productObj?.name}</h4>
                          <span className="item-price">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                          <div className="item-actions">
                            <div className="quantity-controls">
                              <button
                                onClick={() =>
                                  updateQuantity(productObj, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1 || loading}
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(productObj, item.quantity + 1)
                                }
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => handleRemove(productId)}
                              disabled={loading}
                              title={t("common.remove", "Remove")}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart && cart.items?.length > 0 && (
              <div className="drawer-footer">
                <div className="subtotal-row">
                  <span className="label">
                    {t("ecommerce.subtotal", "Subtotal")}
                  </span>
                  <span className="value">
                    ${cart.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {t("ecommerce.proceed_to_checkout", "Proceed to Checkout")}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
