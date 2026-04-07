import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchShippingContracts } from "../stores/shippingSlice";
import { useTranslation } from "react-i18next";

const ShippingContracts = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.contracts", { defaultValue: "Contracts" })));
        dispatch(fetchShippingContracts());
    }, [dispatch, t]);

    return (
        <div className="shipping-contracts">
            <h1>Contracts with Pharmacies</h1>
            <p>Manage your delivery contracts here.</p>
        </div>
    );
};

export default ShippingContracts;
