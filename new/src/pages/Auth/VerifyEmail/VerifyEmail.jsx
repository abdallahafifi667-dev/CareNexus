import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { verifyEmail } from '../stores/authService';
import { clearError } from '../stores/authSlice';
import AuthVisual from '../../../shared/components/ui/AuthVisual/AuthVisual';
import './VerifyEmail.scss';

const VerifyEmail = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isLoading, error, user } = useSelector((state) => state.auth);

    const [code, setCode] = useState('');

    // Handle incoming Redux server errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code || code.length < 6) {
            toast.error(t('auth.invalid_code', 'Please enter a valid 6-digit code.'));
            return;
        }

        const resultAction = await dispatch(verifyEmail({ code }));

        if (verifyEmail.fulfilled.match(resultAction)) {
            toast.success(t('auth.verification_success', 'Email verified successfully!'));
            
            const currentUser = resultAction.payload.user || resultAction.payload;
            const roleRoutes = {
                doctor: '/doctor',
                nursing: '/nursing',
                patient: '/patient',
                pharmacy: '/pharmacy',
                admin: '/admin',
                shipping_company: '/shipping-company'
            };

            setTimeout(() => {
                navigate(roleRoutes[currentUser.role] || '/');
            }, 1000);
        }
    };

    return (
        <div className="verify-email-page">
            <Toaster position="top-right" />
            <div className="verify-card">
                <div className="verify-header">
                    <h1>{t('auth.verify_email_title', 'Verify Your Email')}</h1>
                    <p>{t('auth.verify_email_subtitle', 'Enter the 6-digit code sent to your email.')}</p>
                </div>

                <form className="verify-form" onSubmit={handleSubmit}>
                    <div className="code-input-wrapper">
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            className="code-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="verify-btn disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : (
                            t('auth.verify_email_btn', 'Verify')
                        )}
                    </button>
                </form>

                <div className="verify-footer">
                    <p>
                        {t('auth.verify_email_no_code', "Didn't receive a code?")}{' '}
                        <button className="resend-link" disabled={isLoading}>
                            {t('auth.verify_email_resend', 'Resend')}
                        </button>
                    </p>
                </div>
            </div>
            <AuthVisual />
        </div>
    );
};

export default VerifyEmail;
