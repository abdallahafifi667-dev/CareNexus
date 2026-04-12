import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
const NotFound = lazy(() => import("../public/NotFound/NotFound"));
import Loader from "../../shared/components/loader/Loader";
import Seo from "../../shared/components/seo/Seo";
import { doctorRouteMeta, defaultDoctorMeta } from "../../shared/components/seo/routeMeta";

// Placeholder children pages can be imported here

import DoctorLayout from "./components/DoctorLayout/DoctorLayout";
import KnowledgeAI from "../public/KnowledgeAI/KnowledgeAI";
import MedicalAI from "../public/MedicalAI/MedicalAI";
const DoctorOrders = lazy(() => import("./Orders/DoctorOrders"));
const DoctorDashboard = lazy(() => import("./Dashboard/DoctorDashboard"));
const DoctorProfile = lazy(() => import("./Profile/DoctorProfile"));
const DoctorSettings = lazy(() => import("./Settings/DoctorSettings"));
const OrderDetails = lazy(() => import("./OrderDetails/OrderDetails"));
const DoctorChat = lazy(() => import("./Chat/DoctorChat"));
const DoctorReviews = lazy(() => import("./Reviews/DoctorReviews"));
const DoctorFeed = lazy(() => import("./Feed/DoctorFeed"));
const PostDetail = lazy(() => import("./Feed/PostDetail"));
const AdvancedSearchPage = lazy(() => import("../../shared/components/Search/AdvancedSearchPage"));
const SocialChat = lazy(() => import("../../shared/components/Social/SocialChat"));
const PublicProfile = lazy(() => import("../../shared/components/Social/PublicProfile/PublicProfile"));
const Marketplace = lazy(
  () => import("../../shared/components/Ecommerce/Marketplace"),
);
const ProductDetails = lazy(
  () => import("../../shared/components/Ecommerce/ProductDetails"),
);
const CheckoutPage = lazy(
  () => import("../../shared/components/Ecommerce/CheckoutPage"),
);

import { useSelector } from "react-redux";
import { canAccess } from "./utils/permissions";

const DoctorRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const getRouteMetaKey = (pathname) => {
    if (/^\/doctor\/orders\/[^/]+$/.test(pathname)) return '/doctor/orders/:id';
    if (/^\/doctor\/feed\/post\/[^/]+$/.test(pathname)) return '/doctor/feed/post/:id';
    if (/^\/doctor\/profile\/[^/]+$/.test(pathname)) return '/doctor/profile/:userId';
    if (/^\/doctor\/marketplace\/[^/]+$/.test(pathname)) return '/doctor/marketplace/:id';
    return pathname;
  };

  const routeMeta = doctorRouteMeta[getRouteMetaKey(location.pathname)] || defaultDoctorMeta;

  return (
    <Suspense fallback={<Loader loading={true} />}>
      <Seo {...routeMeta} path={location.pathname} />
      <DoctorLayout>
        <Routes>
          <Route index element={<DoctorDashboard />} />
          <Route path="orders" element={<DoctorOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="feed" element={<DoctorFeed />} />
          <Route path="feed/post/:id" element={<PostDetail />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="profile/:userId" element={<PublicProfile />} />
          <Route path="settings" element={<DoctorSettings />} />
          <Route path="chat" element={<DoctorChat />} />
          <Route path="search" element={<AdvancedSearchPage />} />
          <Route path="social-chat" element={<SocialChat />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Role-specific or Permission-specific routes */}
          {canAccess(role, "reviews") && (
            <Route path="reviews" element={<DoctorReviews />} />
          )}

          <Route path="medical-ai" element={<MedicalAI />} />
          <Route path="knowledge-ai" element={<KnowledgeAI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DoctorLayout>
    </Suspense>
  );

};

export default DoctorRoute;
