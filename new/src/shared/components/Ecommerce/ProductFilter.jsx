import React, { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./ProductFilter.scss";

const ProductFilter = ({ categories, onFilterChange }) => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [isOpen, setIsOpen] = useState(false);

  const isRtl = i18n.language === "ar";

  const handleApply = () => {
    onFilterChange({
      search: searchTerm,
      category: selectedCategory,
      price: maxPrice
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMaxPrice(5000);
    onFilterChange({
      search: "",
      category: "",
      price: 5000
    });
  };

  return (
    <>
      <button className="mobile-filter-btn" onClick={() => setIsOpen(true)}>
        <Filter size={20} />
        {t("ecommerce.filters", "Filters")}
      </button>

      <div className={`product-filter-container ${isOpen ? "open" : ""} ${isRtl ? "rtl" : ""}`}>
        <div className="filter-header">
          <h3>
            <Filter size={18} />
            {t("ecommerce.filters", "Filters")}
          </h3>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="filter-section">
          <label>{t("common.search", "Search")}</label>
          <div className="search-input">
            <Search size={16} />
            <input 
              type="text" 
              placeholder={t("ecommerce.search_placeholder", "Search products...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <label>{t("ecommerce.category", "Category")}</label>
          <div className="category-list">
            <div 
              className={`category-item ${selectedCategory === "" ? "active" : ""}`}
              onClick={() => setSelectedCategory("")}
            >
              {t("ecommerce.all_categories", "All Categories")}
            </div>
            {categories.map((cat) => (
              <div 
                key={cat.id || cat._id}
                className={`category-item ${selectedCategory === (cat.id || cat._id) ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id || cat._id)}
              >
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <label>{t("ecommerce.max_price", "Max Price")}: ${maxPrice}</label>
          <input 
            type="range" 
            min="10" 
            max="10000" 
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="price-slider"
          />
          <div className="price-labels">
            <span>$10</span>
            <span>$5000+</span>
          </div>
        </div>

        <div className="filter-actions">
          <button className="apply-btn" onClick={handleApply}>
            {t("common.apply", "Apply")}
          </button>
          <button className="clear-btn" onClick={handleClear}>
            {t("common.clear", "Clear")}
          </button>
        </div>
      </div>
      
      {isOpen && <div className="filter-overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
};

export default ProductFilter;
