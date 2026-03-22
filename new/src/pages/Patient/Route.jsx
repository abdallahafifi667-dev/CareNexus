import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const NotFound = lazy(() => import('../public/NotFound/NotFound'));
import Loader from '../../components/loader/Loader';

const PatientRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <Routes>
                <Route path="/" element={<div><h1>Patient Dashboard</h1></div>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default PatientRoute;
