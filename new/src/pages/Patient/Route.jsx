import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PatientLayout from "./components/PatientLayout/PatientLayout";
import Loader from "../../shared/components/loader/Loader";

const NotFound = lazy(() => import("../public/NotFound/NotFound"));
const KnowledgeAI = lazy(() => import("../public/KnowledgeAI/KnowledgeAI"));
const MedicalAI = lazy(() => import("../public/MedicalAI/MedicalAI"));

const PatientDashboard = lazy(() => import("./Dashboard/PatientDashboard"));
const PatientOrders = lazy(() => import("./Orders/PatientOrders"));
const CreateOrder = lazy(() => import("./Orders/CreateOrder"));
const OrderDetails = lazy(() => import("./Orders/OrderDetails"));
const PatientChat = lazy(() => import("./Chat/PatientChat"));
const PatientFeed = lazy(() => import("./Feed/PatientFeed"));
const PatientProfile = lazy(() => import("./Profile/PatientProfile"));
const PatientSettings = lazy(() => import("./Settings/PatientSettings"));
const AdvancedSearchPage = lazy(() => import("../../shared/components/Search/AdvancedSearchPage"));
const SocialChat = lazy(() => import("../../shared/components/Social/SocialChat"));
const PublicProfile = lazy(() => import("../../shared/components/Social/PublicProfile/PublicProfile"));
const PostDetail = lazy(() => import("../Doctor/Feed/PostDetail"));
const Marketplace = lazy(
  () => import("../../shared/components/Ecommerce/Marketplace"),
);
const ProductDetails = lazy(
  () => import("../../shared/components/Ecommerce/ProductDetails"),
);
const CheckoutPage = lazy(
  () => import("../../shared/components/Ecommerce/CheckoutPage"),
);

const PatientRoute = () => {
  return (
    <Suspense fallback={<Loader loading={true} />}>
      <PatientLayout>
        <Routes>
          <Route index element={<PatientDashboard />} />
          <Route path="orders" element={<PatientOrders />} />
          <Route path="orders/create" element={<CreateOrder />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="chat" element={<PatientChat />} />
          <Route path="feed" element={<PatientFeed />} />
          <Route path="feed/post/:id" element={<PostDetail />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="profile/:userId" element={<PublicProfile />} />
          <Route path="settings" element={<PatientSettings />} />
          <Route path="search" element={<AdvancedSearchPage />} />
          <Route path="social-chat" element={<SocialChat />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Public AI routes integrated for Patients */}
          <Route path="medical-ai" element={<MedicalAI />} />
          <Route path="knowledge-ai" element={<KnowledgeAI />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </PatientLayout>
    </Suspense>
  );
};

export default PatientRoute;
