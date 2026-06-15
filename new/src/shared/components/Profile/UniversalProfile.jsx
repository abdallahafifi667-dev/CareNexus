/**
 * UniversalProfile - Shared profile page for all roles
 * Wraps role-specific profile components with a unified layout
 * 
 * Usage: Each role's Route.jsx imports this instead of separate profile pages
 * The component detects the current role from the URL path and renders appropriately
 */
import React from "react";
import DoctorProfile from "../../../pages/Doctor/Profile/DoctorProfile";
import PatientProfile from "../../../pages/Patient/Profile/PatientProfile";
import PharmacyProfile from "../../../pages/Pharmacy/Profile/PharmacyProfile";
import ShippingProfile from "../../../pages/ShippingCompany/Profile/ShippingProfile";
import AdminProfile from "../../../pages/Admin/Profile/AdminProfile";

const UniversalProfile = () => {
  // Detect role from current URL path
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return <AdminProfile />;
  }

  if (path.startsWith("/patient")) {
    return <PatientProfile />;
  }

  if (path.startsWith("/pharmacy")) {
    return <PharmacyProfile />;
  }

  if (path.startsWith("/shipping")) {
    return <ShippingProfile />;
  }

  // Default: Doctor/Nursing profile (most feature-rich, works for all provider roles)
  return <DoctorProfile />;
};

export default UniversalProfile;
