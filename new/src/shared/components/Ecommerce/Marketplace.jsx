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
import { ShoppingBag } from "lucide-react";
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

  return (
    <div className="premium-ui">
      <div className={`marketplace-page ${isFilterOpen ? "filter-open" : ""}`}>

      <div className="marketplace-content-wrapper">
        <aside className="marketplace-master">
          {loading ? (
            <div className="marketplace-loader">
              <Loader loading={true} />
            </div>
          ) : products.length > 0 ? (
            <div className="product-list-master">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className={`master-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="item-img">
                    <img src={resolveImgPath(product.images?.[0]?.url || product.image)} alt={product.name} />
                  </div>
                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p className="category">{product.category?.text || product.category}</p>
                    <p className="price">${product.price}</p>
                  </div>
                </div>
              ))}
              
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
            </div>
          ) : (
            <div className="empty-state">
              <ShoppingBag size={48} />
              <p>No products found</p>
            </div>
          )}
        </aside>

        <main className="marketplace-detail">
          {selectedProduct ? (
            <div className="detail-panel">
              <div className="detail-header">
                <div className="main-image">
                   <img src={resolveImgPath(selectedProduct.images?.[0]?.url || selectedProduct.image)} alt={selectedProduct.name} />
                </div>
                <div className="header-meta">
                  <h1>{selectedProduct.name}</h1>
                  <p className="brand">{selectedProduct.brand || "Medical Grade"}</p>
                  <div className="detail-price">${selectedProduct.price}</div>
                  <div className="badge">{selectedProduct.category?.text || selectedProduct.category}</div>
                </div>
              </div>

              <div className="detail-body">
                <section>
                  <h3>Description</h3>
                  <p>{selectedProduct.description || "No description available for this medical product."}</p>
                </section>
                
                <section className="specs">
                  <h3>Highlights</h3>
                  <ul>
                    {selectedProduct.stock > 0 ? (
                      <li className="in-stock">In Stock: {selectedProduct.stock} units</li>
                    ) : (
                      <li className="out-stock">Out of Stock</li>
                    )}
                    <li>Fast Delivery</li>
                    <li>Quality Certified</li>
                  </ul>
                </section>

                <div className="detail-actions">
                  <button 
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="view-full-btn"
                    onClick={() => {
                      const baseRoute = user?.role === 'patient' ? '/patient' : '/doctor';
                      navigate(`${baseRoute}/marketplace/${selectedProduct.id}`);
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
