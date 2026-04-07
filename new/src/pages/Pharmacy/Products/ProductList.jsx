import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchPharmacyProducts } from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";

const ProductList = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.products", { defaultValue: "Products" })));
        dispatch(fetchPharmacyProducts());
    }, [dispatch, t]);

    return (
        <div className="pharmacy-products">
            <h1>Products List</h1>
            <p>Manage your pharmacy products here.</p>
        </div>
    );
};

export default ProductList;
