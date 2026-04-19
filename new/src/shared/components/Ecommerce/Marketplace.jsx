import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchProducts, addToCart } from "../../../store/slices/ecommerceSlice";
import { setHeaderTitle as setDoctorTitle } from "../../../pages/Doctor/stores/doctorSlice";
import { setHeaderTitle as setPatientTitle } from "../../../pages/Patient/stores/patientSlice";
import ProductCard from "./ProductCard";

import ProductFilter from "./ProductFilter";
import ecommerceApi from "../../../utils/ecommerceApi";
import Loader from "../loader/Loader";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import "./Marketplace.scss";
import "../../../scss/premium_theme.scss";
import { resolveImgPath } from "../../../utils/imageUtils";

const Marketplace = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { products, loading, pagination } = useSelector(
    (state) => state.ecommerce,
  );

  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    price: 2000,
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    const title = t("nav.marketplace", "Marketplace");
    if (user?.role === "doctor" || user?.role === "nursing") {
      dispatch(setDoctorTitle(title));
    } else if (user?.role === "patient") {
      dispatch(setPatientTitle(title));
    }
    loadCategories();
  }, [dispatch, user?.role, t]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [filters, dispatch]);

  const loadCategories = async () => {
    try {
      const res = await ecommerceApi.getCategories();
      // Safe filter - handle cases where res.data.data might not be an array
      const allCats = res.data?.data || res.data || [];
      const ecomCategories = Array.isArray(allCats) 
        ? allCats.filter((cat) => cat.type === "ecommerce")
        : [];
      setCategories(ecomCategories);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

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
    setFilters((prev) => ({ ...prev, page }));
  };

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="premium-ui">
      <div className={`marketplace-page ${isFilterOpen ? "filter-open" : ""}`}>
      <div className="marketplace-header">
        <div className="header-content">
          <h1>{t("ecommerce.marketplace_title", "Medical Marketplace")}</h1>
          <p>
            {t(
              "ecommerce.marketplace_subtitle",
              "Browse and shop for medical supplies and equipment safely.",
            )}
          </p>
          <button 
            className="mobile-filter-trigger"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            {isFilterOpen ? t("common.close", "Close Filters") : t("common.filter", "Show Filters")}
          </button>
        </div>
      </div>

      <div className="marketplace-layout">
        <aside className={`marketplace-sidebar ${isFilterOpen ? "show" : ""}`}>
          <div className="sidebar-inner">
            <ProductFilter
              categories={categories}
              onFilterChange={(f) => {
                handleFilterChange(f);
                if (window.innerWidth < 1024) setIsFilterOpen(false);
              }}
            />
          </div>
        </aside>

        <main className="marketplace-main">
          {loading ? (
            <div className="marketplace-loader">
              <Loader loading={true} />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(id) => {
                      const baseRoute = user?.role === 'patient' ? '/patient' : '/doctor';
                      navigate(`${baseRoute}/marketplace/${id}`);
                    }}
                  />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${pagination.page === i + 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <ShoppingBag size={64} />
              <h3>No products found</h3>
              <p>Try adjusting your search or filters.</p>
            </div>
          )}
        </main>
    </div>
      </div>
    </div>
  );
};

export default Marketplace;
