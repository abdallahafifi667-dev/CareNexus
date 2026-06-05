import React from "react";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { resolveImgPath } from "../../../utils/imageUtils";
import { motion } from "framer-motion";
import "./ProductCard.scss";

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  
  // Safe extraction of product ID given backend changes
  const productId = product.id || product._id;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`product-card ${isRtl ? "rtl" : ""}`}
    >
      <div className="product-image-wrapper" onClick={() => onViewDetails(productId)}>
        <img 
          src={resolveImgPath(product.imageUrl?.[0] || product.image)} 
          alt={product.name} 
          className="product-image" 
        />
        <div className="product-overlay">
          <button className="icon-btn view-btn" onClick={(e) => { e.stopPropagation(); onViewDetails(productId); }}>
            <Eye size={20} />
          </button>
        </div>
        {product.discount > 0 && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>

      <div className="product-body">
        <div className="product-info-top">
          <div className="product-category">
            {product.categoryDetails?.name || 
             (typeof product.category === 'object' ? product.category.text || product.category.name : product.category) || 
             t("ecommerce.category", "Category")}
          </div>
          <div className="product-rating">
            <Star size={14} fill="#FFC107" color="#FFC107" />
            <span>{Number(product.avgRating || 0).toFixed(1)}</span>
          </div>
        </div>

        <h3 className="product-title" onClick={() => onViewDetails(productId)}>
          {product.name}
        </h3>
        
        <div className="product-footer">
          <div className="price-block">
            <span className="current-price">${Number(product.price).toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="old-price">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          
          <button 
            className="add-to-cart-btn" 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
