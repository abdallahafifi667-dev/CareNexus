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

  // Determine base path from current URL (works for all roles)
  const getBasePath = () => {
    const path = window.location.pathname;
    if (path.startsWith("/patient")) return "/patient";
    if (path.startsWith("/pharmacy")) return "/pharmacy";
    if (path.startsWith("/admin")) return "/admin";
    if (path.startsWith("/shipping-company")) return "/shipping-company";
    return "/doctor";
  };
  const basePath = getBasePath();

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
        <div className="marketplace-content-wrapper">
          <aside className="marketplace-master">
            {loading ? (
              <div className="marketplace-loader">
                <Loader loading={true} />
              </div>
            ) : normalizedProducts.length > 0 ? (
              <div className="product-list-master">
                {normalizedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`master-item ${normalizedSelected?.id === product.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="item-img">
                      <img src={product.image} alt={product.name} />
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
                <p>No products found</p>
              </div>
            )}
          </aside>

          <main className="marketplace-detail">
            {normalizedSelected ? (
              <div className="detail-panel">
                <div className="detail-header">
                  <div className="main-image">
                    <img src={normalizedSelected.image} alt={normalizedSelected.name} />
                  </div>
                  <div className="header-meta">
                    <h1>{normalizedSelected.name}</h1>
                    <p className="brand">{normalizedSelected.brand || "Medical Grade"}</p>
                    <div className="detail-price">${normalizedSelected.price}</div>
                    <div className="badge">{normalizedSelected.categoryName}</div>
                  </div>
                </div>

                <div className="detail-body">
                  <section>
                    <h3>Description</h3>
                    <p>{normalizedSelected.description || "No description available for this medical product."}</p>
                  </section>
                  
                  <section className="specs">
                    <h3>Highlights</h3>
                    <ul>
                      {normalizedSelected.stock > 0 ? (
                        <li className="in-stock">In Stock: {normalizedSelected.stock} units</li>
                      ) : (
                        <li className="out-of-stock">Out of Stock</li>
                      )}
                      <li>Fast Delivery</li>
                      <li>Quality Certified</li>
                    </ul>
                  </section>

                  <div className="detail-actions">
                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(normalizedSelected)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="view-full-btn"
                      onClick={() => {
                        navigate(`${basePath}/marketplace/${normalizedSelected.id}`);
                      }}
                    >
                      View Technical Specs
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="select-prompt">
                <ShoppingBag size={64} />
                <p>Select a product to view details</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
