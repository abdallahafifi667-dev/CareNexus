import { Routes, Route, useLocation } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';
import Header from './components/header/header';
import Loader from '../../shared/components/loader/Loader';
import PublicRoute from '../../shared/components/common/PublicRoute/PublicRoute';
import Seo from '../../shared/components/seo/Seo';
import { authRouteMeta, defaultAuthMeta } from '../../shared/components/seo/routeMeta';
// Auth Pages (Lazy Loaded)
const Login = lazy(() => import('./Login/Login'));
const Register = lazy(() => import('./Register/Register'));
const ForgotPassword = lazy(() => import('./ForgotPassword/ForgotPassword'));
const VerifyEmail = lazy(() => import('./VerifyEmail/VerifyEmail'));
const DocumentUpload = lazy(() => import('./DocumentUpload/DocumentUpload'));
const NotFound = lazy(() => import('../public/NotFound/NotFound'));

const AuthRoutes = () => {
    const location = useLocation();

    // Define all valid auth paths to exclude NotFound
    const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify-email', '/auth/document-upload'];
    const isAuthPath = authPaths.includes(location.pathname);
    const routeMeta = authRouteMeta[location.pathname] || defaultAuthMeta;

    return (
        <>
            <Seo {...routeMeta} path={location.pathname} />
            {isAuthPath && <Header />}
            <Suspense fallback={<Loader loading={true} />}>
                <Routes>
                    {/* PublicRoute redirects authenticated users to their dashboard */}
                    <Route
                        path="/login"
                        element={<PublicRoute><Login /></PublicRoute>}
                    />
                    <Route
                        path="/register"
                        element={<PublicRoute><Register /></PublicRoute>}
                    />
                    <Route
                        path="/forgot-password"
                        element={<PublicRoute><ForgotPassword /></PublicRoute>}
                    />
                    {/* VerifyEmail is reachable even after login (token might be present but email unverified) */}
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/document-upload" element={<DocumentUpload />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default AuthRoutes;
