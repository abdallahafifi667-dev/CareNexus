import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PharmacyLayout from './components/PharmacyLayout/PharmacyLayout';
import Loader from '../../shared/components/loader/Loader';

const NotFound = lazy(() => import('../public/NotFound/NotFound'));
const PharmacyDashboard = lazy(() => import('./Dashboard/PharmacyDashboard'));
const ProductList = lazy(() => import('./Products/ProductList'));
const PharmacyOrders = lazy(() => import('./Orders/PharmacyOrders'));
const PharmacyContracts = lazy(() => import('./Contracts/PharmacyContracts'));
const DrugSearch = lazy(() => import('../public/DrugSearch/DrugSearch'));
const PharmacyFeed = lazy(() => import('./Feed/PharmacyFeed'));
const PharmacyProfile = lazy(() => import('./Profile/PharmacyProfile'));
const SocialChat = lazy(() => import('../../shared/components/Social/SocialChat'));

const PharmacyRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <PharmacyLayout>
                <Routes>
                    <Route path="/" element={<PharmacyDashboard />} />
                    <Route path="/feed" element={<PharmacyFeed />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<PharmacyOrders />} />
                    <Route path="/contracts" element={<PharmacyContracts />} />
                    <Route path="/profile" element={<PharmacyProfile />} />
                    <Route path="/chat" element={<SocialChat />} />
                    <Route path="/drug-search" element={<DrugSearch />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </PharmacyLayout>
        </Suspense>
    );
};

export default PharmacyRoute;
