import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories, addToCart, setFilters } from "../../../store/slices/ecommerceSlice";
import ProductCard from "./ProductCard";
import ecommerceApi from "../../../utils/ecommerceApi";
import Loader from "../loader/Loader";
import { toast } from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { getRoleBasePath } from "../../../shared/utils/roleRoutes";
import "./Marketplace.scss";

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

  const basePath = getRoleBasePath(user?.role);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
        product: product.id || product._id,
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

  // Normalize product data (handle both backend response formats)
  const normalizeProduct = (p) => ({
    ...p,
    id: p.id || p._id,
    image: p.imageUrl?.[0] || p.image || "",
    images: p.imageUrl ? p.imageUrl.map((url, i) => ({ url, id: i })) : [],
    stock: p.stockQuantity || 0,
    rating: p.avgRating || 0,
    reviewCount: p.totalRatings || 0,
    categoryName: p.category?.text || p.category || "",
  });

  const normalizedProducts = products.map(normalizeProduct);
  const normalizedSelected = selectedProduct ? normalizeProduct(selectedProduct) : null;

  return (
    <div className="premium-ui">
      <div className={`marketplace-page ${isFilterOpen ? "filter-open" : ""}`}>
        <div className="marketplace-hero">
          <div className="hero-copy">
            <p className="eyebrow">{t("marketplace.hero_label", "Care marketplace")}</p>
            <h1>{t("marketplace.heading", "Marketplace")}</h1>
            <p>
              {t(
                "marketplace.subtitle",
                "Browse trusted essentials, wellness products, and medical tools in one calm and clear experience.",
              )}
            </p>
          </div>
          <div className="hero-pill">
            <ShoppingBag size={16} />
            <span>{t("marketplace.quick_delivery", "Fast delivery • Verified stock")}</span>
          </div>
        </div>

        <div className="marketplace-content-wrapper">
          <aside className="marketplace-master">
            <div className="master-header">
              <h2>{t("marketplace.products", "Products")}</h2>
              <span>{normalizedProducts.length} {t("marketplace.items", "items")}</span>
            </div>

            {loading ? (
              <div className="marketplace-loader">
                <Loader loading={true} />
              </div>
            ) : normalizedProducts.length > 0 ? (
              <div className="product-list-master">
                {normalizedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`master-item ${normalizedSelected?.id === product.id ? "selected" : ""}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="item-img">
                      <img src={product.image || "https://placehold.co/300x300?text=CareNexus"} alt={product.name} />
                    </div>
                    <div className="item-info">
                      <h4>{product.name}</h4>
                      <p className="category">{product.categoryName}</p>
                      <p className="price">${product.price}</p>
                    </div>
                  </div>
                ))}

                {pagination?.pages > 1 && (
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
              </div>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={48} />
                <p>{t("marketplace.empty", "No products found")}</p>
              </div>
            )}
          </aside>

          <main className="marketplace-detail">
            {normalizedSelected ? (
              <div className="detail-panel">
                <div className="detail-header">
                  <div className="main-image">
                    <img src={normalizedSelected.image || "https://placehold.co/600x400?text=CareNexus"} alt={normalizedSelected.name} />
                  </div>
                  <div className="header-meta">
                    <h1>{normalizedSelected.name}</h1>
                    <p className="brand">{normalizedSelected.brand || t("marketplace.medical_grade", "Medical Grade")}</p>
                    <div className="detail-price">${normalizedSelected.price}</div>
                    <div className="badge">{normalizedSelected.categoryName}</div>
                  </div>
                </div>

                <div className="detail-body">
                  <section>
                    <h3>{t("marketplace.description", "Description")}</h3>
                    <p>{normalizedSelected.description || t("marketplace.no_description", "No description available for this medical product.")}</p>
                  </section>

                  <section className="specs">
                    <h3>{t("marketplace.highlights", "Highlights")}</h3>
                    <ul>
                      {normalizedSelected.stock > 0 ? (
                        <li className="in-stock">{t("marketplace.in_stock", "In Stock")}: {normalizedSelected.stock} {t("marketplace.units", "units")}</li>
                      ) : (
                        <li className="out-of-stock">{t("marketplace.out_of_stock", "Out of Stock")}</li>
                      )}
                      <li>{t("marketplace.fast_delivery", "Fast Delivery")}</li>
                      <li>{t("marketplace.quality_certified", "Quality Certified")}</li>
                    </ul>
                  </section>

                  <div className="detail-actions">
                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(normalizedSelected)}
                    >
                      {t("marketplace.add_to_cart", "Add to Cart")}
                    </button>
                    <button
                      className="view-full-btn"
                      onClick={() => {
                        navigate(`${basePath}/marketplace/${normalizedSelected.id}`);
                      }}
                    >
                      {t("marketplace.view_specs", "View Technical Specs")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="select-prompt">
                <ShoppingBag size={64} />
                <p>{t("marketplace.select_product", "Select a product to view details")}</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
