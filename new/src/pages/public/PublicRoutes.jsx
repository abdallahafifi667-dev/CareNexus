import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header/header';
import Loader from '../../shared/components/loader/Loader';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('./Home/Home'));
const About = lazy(() => import('./About/About'));
const Support = lazy(() => import('./Support/Support'));
const Contact = lazy(() => import('./Contact/Contact'));
const FAQ = lazy(() => import('./FAQ/FAQ'));
const MedicalAI = lazy(() => import('./MedicalAI/MedicalAI'));
const KnowledgeAI = lazy(() => import('./KnowledgeAI/KnowledgeAI'));
const DrugSearch = lazy(() => import('./DrugSearch/DrugSearch'));
const NotFound = lazy(() => import('./NotFound/NotFound'));
const Services = lazy(() => import('./Services/Services'));
const GettingStarted = lazy(() => import('./Support/categories/GettingStarted'));
const SecurityPrivacy = lazy(() => import('./Support/categories/SecurityPrivacy'));
const PlatformFeatures = lazy(() => import('./Support/categories/PlatformFeatures'));

const PublicRoutes = () => {
    const location = useLocation();

    // Define all valid public paths to exclude NotFound
    const publicPaths = ['/', '/about', '/services', '/support', '/contact', '/faq', '/medical-ai', '/knowledge-ai'];
    const isNotFound = !publicPaths.includes(location.pathname);

    return (
        <>
            {!isNotFound && <Header />}
            <Suspense fallback={<Loader loading={true} />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/support/getting-started" element={<GettingStarted />} />
                    <Route path="/support/security-privacy" element={<SecurityPrivacy />} />
                    <Route path="/support/platform-features" element={<PlatformFeatures />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/medical-ai" element={<MedicalAI />} />
                    <Route path="/knowledge-ai" element={<KnowledgeAI />} />
                    <Route path="/drug-search" element={<DrugSearch />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default PublicRoutes;