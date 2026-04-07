import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentTitle } from "../stores/pharmacySlice";

const PharmacyDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setCurrentTitle("Dashboard"));
    }, [dispatch]);

    return (
        <div className="pharmacy-dashboard">
            <h1>Pharmacy Dashboard</h1>
            <p>Welcome to the pharmacy dashboard!</p>
        </div>
    );
};

export default PharmacyDashboard;
