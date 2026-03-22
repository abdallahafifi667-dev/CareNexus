import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
const NotFound = lazy(() => import('../public/NotFound/NotFound'));
import Loader from '../../components/loader/Loader';

// Placeholder children pages can be imported here
// import DoctorDashboard from './Dashboard/DoctorDashboard';

const DoctorRoute = () => {
    return (
        <Suspense fallback={<Loader loading={true} />}>
            <Routes>
                <Route path="/" element={<div><h1>Doctor Dashboard</h1></div>} />
                <Route path="*" element={<NotFound />} />
                {/* Add more doctor-specific routes here */}
            </Routes>
        </Suspense>
    );
};

export default DoctorRoute;
