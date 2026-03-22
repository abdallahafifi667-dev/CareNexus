import { Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Header from './components/header/header';
import Loader from '../../components/loader/Loader';

// Auth Pages (Lazy Loaded)
const Login = lazy(() => import('./Login/Login'));
const Register = lazy(() => import('./Register/Register'));
const ForgotPassword = lazy(() => import('./ForgotPassword/ForgotPassword'));
const VerifyEmail = lazy(() => import('./VerifyEmail/VerifyEmail'));
const NotFound = lazy(() => import('../public/NotFound/NotFound'));

const AuthRoutes = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader loading={true} />}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AuthRoutes;
