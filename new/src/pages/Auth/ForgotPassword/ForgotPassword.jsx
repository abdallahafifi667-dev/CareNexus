import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { resetPasswordPhase, clearError } from '../stores/authSlice';
import { sendResetCode, verifyResetCode, createNewPassword } from '../stores/authService';
import Input from '../../../shared/components/ui/Input/Input';
import AuthVisual from '../../../shared/components/ui/AuthVisual/AuthVisual';
import './ForgotPassword.scss';

const ForgotPassword = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { isLoading, error, resetPhase } = useSelector((state) => state.auth);
    
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle Redux state errors with toast
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Clear Redux errors when component unmounts
    useEffect(() => {
        return () => { 
            dispatch(resetPasswordPhase('email'));
            dispatch(clearError()); 
        };
    }, [dispatch]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            toast.error(t('auth.email_required', 'Email is required'));
            return;
        }

        await dispatch(sendResetCode(email.trim()));
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();

        if (!code) {
           toast.error(t('auth.code_required', 'Verification code is required'));
           return;
        }

        await dispatch(verifyResetCode({ email: email.trim(), code: code.trim() }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error(t('auth.password_too_short', 'Password must be at least 8 characters long'));
            return;
        }
        if (password !== confirmPassword) {
            toast.error(t('auth.password_mismatch', 'Passwords do not match'));
            return;
        }

        const resultAction = await dispatch(createNewPassword({ email: email.trim(), password }));
        
        if (createNewPassword.fulfilled.match(resultAction)) {
            toast.success(t('auth.reset_success_msg', "Password Reset Successfully!"));
            // Wait slightly and redirect to home or dashboard
            setTimeout(() => {
                dispatch(resetPasswordPhase('email')); // reset state upon leaving
                navigate('/'); 
            }, 2000);
        }
    };

    return (
        <div className="forgot-password-page">
            <Toaster position="top-right" />
            <div className="forgot-password-card">
                <div className="forgot-password-header mb-6">
                    <h1>{t('auth.forgot_password_title')}</h1>
                    <p>{t('auth.forgot_password_subtitle')}</p>
                </div>

                {/* --- PHASE 1: EMAIL REQUEST --- */}
                {resetPhase === 'email' && (
                    <form className="forgot-password-form" onSubmit={handleEmailSubmit}>
                        <Input
                            type="email"
                            name="email"
                            label={t('auth.email_label')}
                            placeholder={t('auth.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="forgot-password-btn flex justify-center items-center" disabled={isLoading}>
                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('auth.send_code_btn', 'Send Recovery Code')}
                        </button>
                    </form>
                )}

                {/* --- PHASE 2: VERIFY CODE --- */}
                {resetPhase === 'code' && (
                    <form className="forgot-password-form" onSubmit={handleCodeSubmit}>
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
                            {t('auth.code_sent_to', 'A code has been sent to')}: <b>{email}</b>
                            <button 
                                onClick={() => {
                                    dispatch(resetPasswordPhase('email'));
                                    dispatch(clearError());
                                }}
                                className="block mt-2 font-bold hover:underline"
                            >
                                {t('auth.change_email', 'Change Email')}
                            </button>
                        </div>
                        <Input
                            type="text"
                            name="code"
                            label={t('auth.verification_code', 'Verification Code')}
                            placeholder="123456"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                        <button type="submit" className="forgot-password-btn flex justify-center items-center" disabled={isLoading}>
                            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('auth.verify_code_btn', 'Verify Code')}
                        </button>
                    </form>
                )}

                {/* --- PHASE 3: NEW PASSWORD --- */}
                {resetPhase === 'new_password' && (
                    <form className="forgot-password-form" onSubmit={handlePasswordSubmit}>
                        <Input
                            type="password"
                            name="password"
                            label={t('auth.new_password', 'New Password')}
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                         <Input
                            type="password"
                            name="confirmPassword"
                            label={t('auth.confirm_new_password', 'Confirm New Password')}
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="forgot-password-btn flex justify-center items-center mt-2" disabled={isLoading}>
                             {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t('auth.reset_password_btn', 'Reset Password')}
                        </button>
                    </form>
                )}

                {/* --- SUCCESS STATE --- */}
                {resetPhase === 'success' && (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('auth.reset_success_title', 'Success!')}</h2>
                        <p className="text-gray-600 mb-6">{t('auth.reset_success_msg', 'Your password has been changed.')}</p>
                        <Link to="/auth/login" className="forgot-password-btn inline-block text-center">{t('auth.back_to_login')}</Link>
                    </div>
                )}

                <div className="forgot-password-footer mt-6">
                    <Link to="/auth/login" className="back-link">
                        &larr; {t('auth.back_to_login')}
                    </Link>
                </div>
            </div>

            <AuthVisual />
        </div>
    );
};

export default ForgotPassword;
