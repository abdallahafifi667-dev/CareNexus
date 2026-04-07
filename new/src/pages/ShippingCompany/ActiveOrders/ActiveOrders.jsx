import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchShippedOrders } from "../stores/shippingSlice";
import { useTranslation } from "react-i18next";

const ActiveOrders = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.active_orders", { defaultValue: "Active Deliveries" })));
        dispatch(fetchShippedOrders());
    }, [dispatch, t]);

    return (
        <div className="shipping-active-orders">
            <h1>Active Deliveries</h1>
            <p>Ready for pickup and on-the-way orders.</p>
        </div>
    );
};

export default ActiveOrders;
