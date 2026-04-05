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
import ecommerceApi from "../../../utils/ecommerceApi";
import Loader from "../loader/Loader";
import { toast } from "react-hot-toast";
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
        <Loader loading={true} />
      </div>
    );
  if (!product) return null;

  return (
    <div
      className={`product-details-page ${i18n.language === "ar" ? "rtl" : ""}`}
    >
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> {t("common.back", "Back")}
      </button>

      <div className="details-container">
        <div className="product-visuals">
          <div className="main-image">
            <img
              src={
                product.imageUrl?.[activeImage] ||
                "https://via.placeholder.com/600"
              }
              alt={product.name}
            />
          </div>
          {product.imageUrl?.length > 1 && (
            <div className="image-thumbnails">
              {product.imageUrl.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumb ${activeImage === idx ? "active" : ""}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`${product.name} view ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-panel">
          <div className="category-tag">
            {product.categoryDetails?.name || "Medical Supply"}
          </div>
          <h1 className="product-title">{product.name}</h1>

          <div className="rating-summary">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.round(product.avgRating) ? "#FFC107" : "none"}
                  color="#FFC107"
                />
              ))}
            </div>
            <span className="count">
              ({product.totalRatings || 0} {t("ecommerce.reviews", "reviews")})
            </span>
          </div>

          <div className="price-tag">${product.price.toFixed(2)}</div>

          <div className="description-section">
            <h3>{t("ecommerce.description", "Description")}</h3>
            <p>{product.description}</p>
          </div>

          <div className="purchase-controls">
            <div className="quantity-selector">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
            <button className="add-cart-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} />{" "}
              {t("ecommerce.add_to_cart", "Add to Cart")}
            </button>
          </div>

          <div className="trust-badges">
            <div className="badge">
              <ShieldCheck size={24} />
              <div>
                <strong>
                  {t("ecommerce.secure_payment", "Secure Payment")}
                </strong>
                <span>
                  {t(
                    "ecommerce.secure_payment_desc",
                    "100% Secure Transaction",
                  )}
                </span>
              </div>
            </div>
            <div className="badge">
              <Truck size={24} />
              <div>
                <strong>{t("ecommerce.fast_shipping", "Fast Shipping")}</strong>
                <span>
                  {t(
                    "ecommerce.fast_shipping_desc",
                    "Delivered within 2-3 days",
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
