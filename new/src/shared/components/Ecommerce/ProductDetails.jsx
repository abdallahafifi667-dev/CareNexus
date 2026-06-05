import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { addToCart } from "../../../store/slices/ecommerceSlice";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { resolveImgPath } from "../../../utils/imageUtils";
import "./ProductDetails.scss";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await ecommerceApi.getProductById(id);
      setProduct(res.data.data);
    } catch (err) {
      toast.error(t("errors.product_not_found", "Product not found"));
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        product: product.id,
        quantity,
        price: product.price,
      }),
    );
    toast.success(
      `${product.name} ${t("ecommerce.added_to_cart", "added to cart!")}`,
    );
  };

  if (loading)
    return (
      <div className="details-loader">
        <Loader loading={true} inline={true} />
      </div>
    );
  if (!product) return null;

  return (
    <div className={`product-details-page ${i18n.language === "ar" ? "rtl" : ""}`}>
      <div className="details-header-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span>{t("common.back", "Back")}</span>
        </button>
      </div>

      <div className="details-grid">
        <div className="visuals-column">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="main-image-viewport"
          >
            <img
              src={resolveImgPath(product.imageUrl?.[activeImage] || product.image)}
              alt={product.name}
            />
          </motion.div>
          {product.imageUrl?.length > 1 && (
            <div className="thumbnails-strip">
              {product.imageUrl.map((img, idx) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={idx}
                  className={`thumb-card ${activeImage === idx ? "active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={resolveImgPath(img)} alt={`${product.name} view ${idx}`} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="info-column">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="info-content"
          >
            <div className="top-meta">
              <span className="category-tag">
                {product.categoryDetails?.name || product.category?.text || "Medical Supply"}
              </span>
              <div className="rating-pill">
                <Star size={16} fill="#FFC107" color="#FFC107" />
                <span>{Number(product.avgRating || 4.5).toFixed(1)}</span>
                <span className="sep">|</span>
                <span className="rev-count">{product.totalRatings || 12} {t("ecommerce.reviews")}</span>
              </div>
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="price-display">
              <span className="symbol">$</span>
              <span className="val">{product.price.toFixed(2)}</span>
            </div>

            <div className="description-box">
              <h3>{t("ecommerce.description")}</h3>
              <p>{product.description}</p>
            </div>

            <div className="action-hub">
              <div className="qty-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                <input type="number" value={quantity} readOnly />
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
              <button 
                className="add-to-cart-cta" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart size={22} />
                <span>{t("ecommerce.add_to_cart")}</span>
              </button>
            </div>

            <div className="trust-grid">
              <div className="trust-item">
                <div className="icon-wrap"><ShieldCheck size={24} /></div>
                <div className="txt">
                  <strong>{t("ecommerce.secure_payment")}</strong>
                  <span>{t("ecommerce.secure_payment_desc")}</span>
                </div>
              </div>
              <div className="trust-item">
                <div className="icon-wrap"><Truck size={24} /></div>
                <div className="txt">
                  <strong>{t("ecommerce.fast_shipping")}</strong>
                  <span>{t("ecommerce.fast_shipping_desc")}</span>
                </div>
              </div>
              <div className="trust-item">
                <div className="icon-wrap"><RotateCcw size={24} /></div>
                <div className="txt">
                  <strong>{t("ecommerce.easy_returns")}</strong>
                  <span>{t("ecommerce.easy_returns_desc", { defaultValue: "30 Days Return" })}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
