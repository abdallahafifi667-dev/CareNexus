import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, RotateCcw, Check } from "lucide-react";
import { setFilters, fetchProducts } from "../../../store/slices/ecommerceSlice";

import "./MarketplaceFilterDrawer.scss";

const MarketplaceFilterDrawer = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { categories, activeFilters } = useSelector((state) => state.ecommerce);
  
  const [localFilters, setLocalFilters] = useState(activeFilters);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setLocalFilters(activeFilters);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, activeFilters]);

  const handleCategoryToggle = (id) => {
    setLocalFilters(prev => ({
      ...prev,
      category: prev.category === id ? "" : id
    }));
  };

  const handleApply = () => {
    dispatch(setFilters({ ...localFilters, page: 1 }));
    dispatch(fetchProducts({ ...localFilters, page: 1 }));
    onClose();
  };

  const handleReset = () => {
    const reset = { search: "", category: "", price: 5000, page: 1 };
    setLocalFilters(reset);
    dispatch(setFilters(reset));
    dispatch(fetchProducts(reset));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="filter-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={`filter-drawer ${i18n.language === "ar" ? "rtl" : ""}`}
            initial={{ x: i18n.language === "ar" ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: i18n.language === "ar" ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="drawer-header">
              <h2>
                <Filter size={20} />
                {t("ecommerce.filters", "Filters")}
              </h2>
              <button className="close-btn" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">
              <section className="filter-group">
                <h3>{t("ecommerce.category", "Category")}</h3>
                <div className="category-grid">
                  <button 
                    className={`cat-pill ${localFilters.category === "" ? "active" : ""}`}
                    onClick={() => handleCategoryToggle("")}
                  >
                    {t("ecommerce.all_categories", "All")}
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id || cat._id}
                      className={`cat-pill ${localFilters.category === (cat.id || cat._id) ? "active" : ""}`}
                      onClick={() => handleCategoryToggle(cat.id || cat._id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>

              <section className="filter-group">
                <div className="group-header">
                  <h3>{t("ecommerce.max_price", "Max Price")}</h3>
                  <span className="price-value">${localFilters.price}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="50"
                  value={localFilters.price}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="premium-range"
                />
                <div className="range-labels">
                  <span>$10</span>
                  <span>$10,000+</span>
                </div>
              </section>
            </div>

            <div className="drawer-footer">
              <button className="reset-btn" onClick={handleReset}>
                <RotateCcw size={18} />
                {t("common.reset", "Reset")}
              </button>
              <button className="apply-btn" onClick={handleApply}>
                <Check size={18} />
                {t("common.apply", "Apply")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MarketplaceFilterDrawer;
