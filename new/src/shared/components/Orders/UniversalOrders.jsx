/**
 * UniversalOrders - Shared orders page for all roles
 * Detects the current role from URL and renders the appropriate orders view
 * For provider roles (doctor, nursing), shows available/active/history tabs
 * For patient role, shows all orders with status filter
 * For other roles, shows a simplified orders list
 */
import React from "react";
import DoctorOrders from "../../../pages/Doctor/Orders/DoctorOrders";
import PatientOrders from "../../../pages/Patient/Orders/PatientOrders";

const UniversalOrders = () => {
  const path = window.location.pathname;

  // Patient gets the patient-specific orders view
  if (path.startsWith("/patient")) {
    return <PatientOrders />;
  }

  // All other roles (doctor, nursing, pharmacy, shipping_company, admin) use doctor orders view
  // This works because the order data structure is the same - just filtered differently
  return <DoctorOrders />;
};

export default UniversalOrders;
