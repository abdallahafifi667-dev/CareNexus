import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle } from "../stores/shippingSlice";

const ShippingDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentTitle("Dashboard"));
    }, [dispatch]);

    return (
        <div className="shipping-dashboard">
            <h1>Shipping Dashboard</h1>
            <p>Welcome to the shipping company dashboard!</p>
        </div>
    );
};

export default ShippingDashboard;
