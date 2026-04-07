import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle, fetchContracts } from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";

const PharmacyContracts = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.contracts", { defaultValue: "Contracts" })));
        dispatch(fetchContracts());
    }, [dispatch, t]);

    return (
        <div className="pharmacy-contracts">
            <h1>Contracts with Shipping Companies</h1>
            <p>Manage your delivery contracts here.</p>
        </div>
    );
};

export default PharmacyContracts;
