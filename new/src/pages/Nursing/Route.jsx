import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const NotFound = lazy(() => import('../public/NotFound/NotFound'));
import Loader from '../../components/loader/Loader';

const NursingRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <Routes>
                <Route path="/" element={<div><h1>Nursing Dashboard</h1></div>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default NursingRoute;
