import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories, addToCart, setFilters } from "../../../store/slices/ecommerceSlice";
import { setHeaderTitle as setDoctorTitle } from "../../../pages/Doctor/stores/doctorSlice";
import { setHeaderTitle as setPatientTitle } from "../../../pages/Patient/stores/patientSlice";
import ProductCard from "./ProductCard";

import ecommerceApi from "../../../utils/ecommerceApi";
import Loader from "../loader/Loader";
import { toast } from "react-hot-toast";
import { ShoppingBag, Search, Filter, ChevronLeft, ChevronRight, Star, Info, ShoppingCart, ShieldCheck, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./Marketplace.scss";
import "../../../scss/premium_theme.scss";
import { resolveImgPath } from "../../../utils/imageUtils";

const Marketplace = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products, categories, loading, pagination, activeFilters } = useSelector(
    (state) => state.ecommerce,
  );
  const [searchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const title = t("nav.marketplace", "Marketplace");
    if (user?.role === "doctor" || user?.role === "nursing") {
      dispatch(setDoctorTitle(title));
    } else if (user?.role === "patient") {
      dispatch(setPatientTitle(title));
    }
    dispatch(fetchCategories());
  }, [dispatch, user?.role, t]);

  // Sync URL search param with Redux filter
  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query !== activeFilters.search) {
      dispatch(setFilters({ search: query, page: 1 }));
    }
  }, [searchParams, dispatch]);

  // Fetch products whenever filters change
  useEffect(() => {
    dispatch(fetchProducts(activeFilters));
  }, [activeFilters, dispatch]);

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        product: product.id,
        quantity: 1,
        price: product.price,
      }),
    );
    toast.success(`${product.name} added to cart!`);
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const categoriesWithAll = [{ id: "all", text: t("common.all", "All") }, ...categories];

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    dispatch(setFilters({ category: catId === "all" ? "" : catId, page: 1 }));
  };

  return (
    <div className="premium-ui">
      <div className={`marketplace-page ${isFilterOpen ? "filter-open" : ""}`}>

        <div className="marketplace-header-section">
          <div className="search-and-filter">
            <div className="filter-chips">
              {categoriesWithAll.map((cat) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={cat.id}
                  className={`chip ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  {cat.text || cat.name || cat.id}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="marketplace-content-wrapper">
          <aside className="marketplace-master">
            {loading ? (
              <div className="marketplace-loader">
                <Loader loading={true} inline={true} />
              </div>
            ) : products.length > 0 ? (
              <div className="product-list-master">
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={product.id}
                      className={`master-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="item-img">
                        <img src={resolveImgPath(product.images?.[0]?.url || product.image)} alt={product.name} />
                      </div>
                      <div className="item-info">
                        <div className="item-top">
                          <h4>{product.name}</h4>
                          <span className="stock-badge">{product.stock > 0 ? t('ecommerce.in_stock') : t('ecommerce.out_of_stock')}</span>
                        </div>
                        <p className="category">{product.category?.text || product.category}</p>
                        <div className="item-bottom">
                          <p className="price">${product.price}</p>
                          <div className="rating">
                            <Star size={12} fill="#FFC107" color="#FFC107" />
                            <span>{product.avgRating || 4.5}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button 
                      className="p-btn" 
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="page-info">{pagination.page} / {pagination.pages}</span>
                    <button 
                      className="p-btn" 
                      onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
                      disabled={pagination.page === pagination.pages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={48} />
                <h3>{t('ecommerce.no_products_found')}</h3>
                <p>{t('ecommerce.try_adjusting_filters')}</p>
              </div>
            )}
          </aside>

          <main className="marketplace-detail">
            <AnimatePresence mode="wait">
              {selectedProduct ? (
                <motion.div 
                  key={selectedProduct.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="detail-panel"
                >
                  <div className="detail-header">
                    <div className="main-image-container">
                      <div className="main-image">
                        <img src={resolveImgPath(selectedProduct.images?.[0]?.url || selectedProduct.image)} alt={selectedProduct.name} />
                      </div>
                      <div className="image-overlay-actions">
                        <button className="expand-btn" onClick={() => navigate(`${user?.role === 'patient' ? '/patient' : '/doctor'}/marketplace/${selectedProduct.id}`)}>
                          <Info size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="header-meta">
                      <div className="meta-top">
                        <span className="brand-tag">{selectedProduct.brand || "Medical Grade"}</span>
                        <div className="rating-badge">
                          <Star size={14} fill="#FFC107" color="#FFC107" />
                          <span>{selectedProduct.avgRating || 4.5}</span>
                        </div>
                      </div>
                      <h1>{selectedProduct.name}</h1>
                      <div className="price-container">
                        <span className="currency">$</span>
                        <span className="amount">{selectedProduct.price}</span>
                      </div>
                      <div className="category-label">
                        <ShoppingCart size={14} />
                        {selectedProduct.category?.text || selectedProduct.category}
                      </div>
                    </div>
                  </div>

                  <div className="detail-body">
                    <div className="detail-tabs">
                      <button className="tab active">{t('ecommerce.overview')}</button>
                    </div>
                    
                    <section className="description-section">
                      <p>{selectedProduct.description || "No description available for this medical product."}</p>
                    </section>
                    
                    <div className="quick-specs">
                      <div className="spec-card">
                        <ShieldCheck size={20} />
                        <span>{t('ecommerce.certified')}</span>
                      </div>
                      <div className="spec-card">
                        <Truck size={20} />
                        <span>{t('ecommerce.fast_delivery')}</span>
                      </div>
                    </div>

                    <div className="detail-actions">
                      <button 
                        className="add-cart-btn primary-grad"
                        onClick={() => handleAddToCart(selectedProduct)}
                      >
                        <ShoppingCart size={20} />
                        {t('ecommerce.add_to_cart')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="select-prompt">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ShoppingBag size={80} />
                  </motion.div>
                  <h3>{t('ecommerce.explore_store')}</h3>
                  <p>{t('ecommerce.select_hint')}</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
