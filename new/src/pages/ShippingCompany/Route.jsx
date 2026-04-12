import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../../shared/components/loader/Loader';
import ShippingLayout from './components/ShippingLayout/ShippingLayout';

const NotFound = lazy(() => import('../public/NotFound/NotFound'));
const ShippingDashboard = lazy(() => import('./Dashboard/ShippingDashboard'));
const ActiveOrders = lazy(() => import('./ActiveOrders/ActiveOrders'));
const CompletedOrders = lazy(() => import('./CompletedOrders/CompletedOrders'));
const ShippingContracts = lazy(() => import('./Contracts/ShippingContracts'));
const DrugSearch = lazy(() => import('../public/DrugSearch/DrugSearch'));

const ShippingCompanyRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <ShippingLayout>
                <Routes>
                    <Route path="/" element={<ShippingDashboard />} />
                    <Route path="/active-orders" element={<ActiveOrders />} />
                    <Route path="/completed" element={<CompletedOrders />} />
                    <Route path="/contracts" element={<ShippingContracts />} />
                    <Route path="/drug-search" element={<DrugSearch />} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ShippingLayout>
        </Suspense>
    );
};

export default ShippingCompanyRoute;
