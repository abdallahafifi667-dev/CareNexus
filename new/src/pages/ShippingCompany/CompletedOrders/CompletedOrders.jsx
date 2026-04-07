import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchCompletedDeliveries } from "../stores/shippingSlice";
import { useTranslation } from "react-i18next";

const CompletedOrders = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.completed", { defaultValue: "Completed Deliveries" })));
        dispatch(fetchCompletedDeliveries());
    }, [dispatch, t]);

    return (
        <div className="shipping-completed-orders">
            <h1>Completed Deliveries</h1>
            <p>History of all delivered orders.</p>
        </div>
    );
};

export default CompletedOrders;
