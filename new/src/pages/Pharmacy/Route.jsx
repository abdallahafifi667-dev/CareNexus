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
const PharmacyRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <PharmacyLayout>
                <Routes>
                    <Route path="/" element={<PharmacyDashboard />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/orders" element={<PharmacyOrders />} />
                    <Route path="/contracts" element={<PharmacyContracts />} />
                    <Route path="/drug-search" element={<DrugSearch />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </PharmacyLayout>
        </Suspense>
    );
};

export default PharmacyRoute;
