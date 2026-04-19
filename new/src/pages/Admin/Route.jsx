import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '../../shared/components/loader/Loader';
import AdminLayout from './AdminLayout';

// Lazy load pages
const AdminDashboard = lazy(() => import('./Dashboard/AdminDashboard'));
const UserManagement = lazy(() => import('./Users/UserManagement'));
const VerificationCenter = lazy(() => import('./Verification/VerificationCenter'));
const StoreManagement = lazy(() => import('./Ecommerce/StoreManagement'));
const ContentModeration = lazy(() => import('./Blog/ContentModeration'));
const AdminSettings = lazy(() => import('./AdminSettings'));
const NotFound = lazy(() => import('../public/NotFound/NotFound'));

const AdminRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="verification" element={<VerificationCenter />} />
                    <Route path="ecommerce" element={<StoreManagement />} />
                    <Route path="blog" element={<ContentModeration />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoute;
