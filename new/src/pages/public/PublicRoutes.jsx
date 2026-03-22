import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import Loader from '../../components/loader/Loader';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('./Home/Home'));
const About = lazy(() => import('./About/About'));
const Support = lazy(() => import('./Support/Support'));
const Contact = lazy(() => import('./Contact/Contact'));
const FAQ = lazy(() => import('./FAQ/FAQ'));
const MedicalAI = lazy(() => import('./MedicalAI/MedicalAI'));
const KnowledgeAI = lazy(() => import('./KnowledgeAI/KnowledgeAI'));
const NotFound = lazy(() => import('./NotFound/NotFound'));
const Services = lazy(() => import('./Services/Services'));

const PublicRoutes = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Loader loading={true} />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/medical-ai" element={<MedicalAI />} />
                    <Route path="/knowledge-ai" element={<KnowledgeAI />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default PublicRoutes;
