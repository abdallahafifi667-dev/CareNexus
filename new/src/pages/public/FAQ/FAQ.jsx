import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, CheckCircle } from 'lucide-react';
import './FAQ.scss';

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    const items = t('faq.items', { returnObjects: true });
    const questions = Array.isArray(items) ? items : [];

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    return (
        <div className="faq-page">
            {/* Hero */}
            <section className="faq-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="hero-content"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="icon-badge"
                        >
                            <HelpCircle size={40} />
                        </motion.div>
                        <h1 className="title">{t('faq.title')}</h1>
                        <p className="subtitle">{t('faq.subtitle')}</p>
                    </motion.div>
                </div>
            </section>

            {/* Accordion */}
            <section className="faq-accordion-section">
                <div className="container">
                    {questions.length === 0 && (
                        <p className="empty-faq">Loading FAQs…</p>
                    )}
                    <div className="accordion">
                        {questions.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`accordion-item ${openIndex === i ? 'open' : ''}`}
                                initial={false}
                            >
                                <button
                                    className="accordion-header"
                                    onClick={() => toggle(i)}
                                >
                                    <div className="header-left">
                                        <span className="q-number">{(i + 1).toString().padStart(2, '0')}</span>
                                        <span className="question">{item.q}</span>
                                    </div>
                                    <ChevronDown className="chevron" size={20} />
                                </button>

                                <AnimatePresence initial={false}>
                                    {openIndex === i && (
                                        <motion.div
                                            key="body"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="accordion-body-wrapper"
                                        >
                                            <div className="accordion-body">
                                                <p>{item.a}</p>
                                                <div className="verified-tag">
                                                    <CheckCircle size={14} />
                                                    <span>CareNexus Verified</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
