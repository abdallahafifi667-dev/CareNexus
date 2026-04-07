import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchPharmacyOrders } from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";

const PharmacyOrders = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.orders", { defaultValue: "Orders" })));
        dispatch(fetchPharmacyOrders());
    }, [dispatch, t]);

    return (
        <div className="pharmacy-orders">
            <h1>Orders Management</h1>
            <p>View and manage incoming orders from patients.</p>
        </div>
    );
};

export default PharmacyOrders;
