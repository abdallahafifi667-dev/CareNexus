import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    setCurrentTitle, 
    fetchPharmacyProducts, 
    addPharmacyProduct, 
    updatePharmacyProduct, 
    deletePharmacyProduct 
} from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";
import { 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Package, 
    X,
    Camera,
    UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import "./ProductList.scss";
import "../../../scss/premium_theme.scss";

const ProductList = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { products, loading } = useSelector((state) => state.pharmacy);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        category: "Medicine",
        price: "",
        quantity: "",
        description: "",
        manufacturingDate: "",
        expiryDate: "",
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.products", { defaultValue: "Inventory Management" })));
        dispatch(fetchPharmacyProducts());
    }, [dispatch, t]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
            setFormData({
                name: product.name || "",
                category: product.category || "Medicine",
                price: product.price || "",
                quantity: product.quantity || "",
                description: product.description || "",
                manufacturingDate: product.manufacturingDate ? product.manufacturingDate.split('T')[0] : "",
                expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : "",
            });
            setPreviews(product.images || []);
        } else {
            setIsEditing(false);
            setCurrentProduct(null);
            setFormData({
                name: "",
                category: "Medicine",
                price: "",
                quantity: "",
                description: "",
                manufacturingDate: "",
                expiryDate: "",
            });
            setPreviews([]);
            setSelectedFiles([]);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentProduct(null);
        setSelectedFiles([]);
        setPreviews([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removePreview = (index) => {
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        selectedFiles.forEach(file => data.append("files", file));

        try {
            if (isEditing) {
                await dispatch(updatePharmacyProduct({ id: currentProduct._id, data: formData })).unwrap();
                toast.success(t("common.update_success", "Product updated successfully"));
            } else {
                await dispatch(addPharmacyProduct(data)).unwrap();
                toast.success(t("common.add_success", "Product added successfully"));
            }
            handleCloseModal();
            dispatch(fetchPharmacyProducts());
        } catch (error) {
            toast.error(error.message || "Failed to save product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm(t("common.confirm_delete", "Are you sure you want to delete this product?"))) {
            try {
                await dispatch(deletePharmacyProduct(id)).unwrap();
                toast.success(t("common.delete_success", "Product deleted successfully"));
            } catch (error) {
                toast.error(error.message || "Failed to delete product");
            }
        }
    };

    const filteredProducts = products?.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <div className="premium-ui">
            <div className="pharmacy-products-container">
            <div className="products-header">
                <div className="title-section">
                    <h1>{t("pharmacy.inventory", "Inventory Management")}</h1>
                    <p className="subtitle">{t("pharmacy.manage_desc", "Manage your medicines and medical supplies")}</p>
                </div>
                <button className="add-product-btn" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>{t("pharmacy.add_product", "Add New Medicine")}</span>
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={18} />
                    <input 
                        type="text" 
                        placeholder={t("common.search_placeholder", "Search medicines...")} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="merchant-product-card">
                            <div className="product-image">
                                {product.images?.length > 0 ? (
                                    <img src={product.images[0]} alt={product.name} />
                                ) : (
                                    <div className="no-image"><Package size={48} /></div>
                                )}
                                <span className="badge">{product.category}</span>
                            </div>
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <p className="category">{product.category}</p>
                                <div className="stock-info">
                                    <span className={product.quantity < 10 ? "low-stock" : ""}>
                                        {t("pharmacy.stock", "Stock")}: {product.quantity}
                                    </span>
                                </div>
                                <p className="price">${product.price}</p>
                            </div>
                            <div className="product-actions">
                                <button className="edit-btn" onClick={() => handleOpenModal(product)}>
                                    <Edit size={16} />
                                    <span>{t("common.edit")}</span>
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(product._id)}>
                                    <Trash2 size={16} />
                                    <span>{t("common.delete")}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-products">
                    <Package size={64} />
                    <h3>{t("pharmacy.no_products", "No products found")}</h3>
                    <p>{t("pharmacy.no_products_desc", "Start by adding your first medicine to the inventory.")}</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="add-product-modal-overlay">
                        <motion.div 
                            className="modal-content"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="modal-header">
                                <h2>{isEditing ? t("pharmacy.edit_product") : t("pharmacy.add_product")}</h2>
                                <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>{t("pharmacy.prod_name", "Medicine Name")}</label>
                                            <input 
                                                name="name" 
                                                value={formData.name} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("pharmacy.prod_category", "Category")}</label>
                                            <select name="category" value={formData.category} onChange={handleInputChange}>
                                                <option value="Medicine">Medicine</option>
                                                <option value="Supplements">Supplements</option>
                                                <option value="Equipment">Equipment</option>
                                                <option value="Personal Care">Personal Care</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>{t("pharmacy.prod_price", "Price ($)")}</label>
                                            <input 
                                                type="number" 
                                                name="price" 
                                                value={formData.price} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("pharmacy.prod_quantity", "Quantity in Stock")}</label>
                                            <input 
                                                type="number" 
                                                name="quantity" 
                                                value={formData.quantity} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t("pharmacy.expiry_date", "Expiry Date")}</label>
                                            <input 
                                                type="date" 
                                                name="expiryDate" 
                                                value={formData.expiryDate} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>{t("pharmacy.prod_desc", "Description")}</label>
                                            <textarea 
                                                name="description" 
                                                value={formData.description} 
                                                onChange={handleInputChange} 
                                                rows="3" 
                                            />
                                        </div>
                                    </div>

                                    {!isEditing && (
                                        <div className="image-upload-section">
                                            <label>{t("pharmacy.prod_images", "Product Images")}</label>
                                            <div className="image-preview-grid">
                                                {previews.map((src, i) => (
                                                    <div key={i} className="preview-item">
                                                        <img src={src} alt="preview" />
                                                        <button type="button" className="remove-img" onClick={() => removePreview(i)}>×</button>
                                                    </div>
                                                ))}
                                                <div className="upload-trigger" onClick={() => fileInputRef.current.click()}>
                                                    <UploadCloud size={24} />
                                                    <span>Upload</span>
                                                </div>
                                            </div>
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                multiple 
                                                accept="image/*" 
                                                style={{ display: "none" }} 
                                                onChange={handleFileChange} 
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="cancel-btn" onClick={handleCloseModal}>
                                        {t("common.cancel")}
                                    </button>
                                    <button type="submit" className="submit-btn">
                                        {isEditing ? t("common.save_changes") : t("pharmacy.add_product")}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </div>
    );
};

export default ProductList;
