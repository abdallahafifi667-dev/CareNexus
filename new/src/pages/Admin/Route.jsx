import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const NotFound = lazy(() => import('../public/NotFound/NotFound'));
import Loader from '../../shared/components/loader/Loader';

const AdminRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <Routes>
                <Route path="/" element={<div><h1>Admin Dashboard</h1></div>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AdminRoute;
