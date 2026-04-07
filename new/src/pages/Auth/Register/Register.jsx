import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { clearError } from '../stores/authSlice';
import { registerUser } from '../stores/authService';
import Input from '../../../shared/components/ui/Input/Input';
import Select from '../../../shared/components/ui/Select/Select';
import AuthVisual from '../../../shared/components/ui/AuthVisual/AuthVisual';
import { getDeviceMetadata } from '../../../shared/components/common/DeviceUtils/DeviceUtils';
import './Register.scss';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [metadata, setMetadata] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        country: '',
        Address: '',
        identityNumber: '',
        gender: '',
        role: ''
    });

    useEffect(() => {
        const fetchMetadata = async () => {
            const data = await getDeviceMetadata();
            setMetadata(data);
        };
        fetchMetadata();
    }, []);

    // Handle incoming Redux server errors with toast
    useEffect(() => {
        if (error) {
            const message = typeof error === 'string' 
                ? error 
                : (Array.isArray(error) ? error[0]?.message : (error.message || JSON.stringify(error)));
            toast.error(message);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    // Clear Redux errors when component unmounts
    useEffect(() => {
        return () => { dispatch(clearError()); };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.role || !formData.username || !formData.email || !formData.password ||
            !formData.phone || !formData.country || !formData.Address || !formData.identityNumber || !formData.gender) {
            toast.error(t('auth.all_fields_required', 'All fields are strictly required.'));
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error(t('auth.invalid_email', 'Please enter a valid email.'));
            return false;
        }

        if (formData.password.length < 8) {
            toast.error(t('auth.password_too_short', 'Password must be at least 8 characters long.'));
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error(t('auth.password_mismatch', 'Passwords do not match.'));
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Longitude/Latitude mock defaults if metadata GPS disabled
        const longitude = metadata?.location?.longitude || 0.0;
        const latitude = metadata?.location?.latitude || 0.0;

        const payload = {
            role: formData.role,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
            Address: formData.Address,
            identityNumber: formData.identityNumber,
            gender: formData.gender,
            IpPhone: metadata?.deviceInfo?.os || 'Unknown',
            longitude,
            latitude
        };

        const resultAction = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(resultAction)) {
            toast.success("Registration Successful!");
            setTimeout(() => {
                navigate('/auth/verify-email');
            }, 1000);
        }
    };

    return (
        <div className="register-page">
            <Toaster position="top-right" />
            <div className="register-card">
                <div className="register-header">
                    <h1>{t('auth.signup_title')}</h1>
                    <p>{t('auth.signup_subtitle')}</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>

                    {/* Role Selection */}
                    <div className="form-section full-width">
                        <Select
                            name="role"
                            label={t('auth.role_label')}
                            value={formData.role}
                            onChange={handleChange}
                            options={[
                                { value: 'patient', label: t('auth.role_patient') },
                                { value: 'doctor', label: t('auth.role_doctor') },
                                { value: 'nursing', label: t('auth.role_nursing') }, // Backend expects 'nursing' over 'nurse'
                                { value: 'pharmacy', label: t('auth.role_pharmacist') },
                                { value: 'shipping_company', label: t('auth.role_shipping_company', 'Shipping Company') }
                            ]}
                            required
                        />
                    </div>

                    {/* Section: Account Info */}
                    <h3 className="section-title">{t('auth.section_account')}</h3>
                    <div className="form-grid">
                        <Input
                            type="text"
                            name="username"
                            label={t('auth.username_label')}
                            placeholder={t('auth.username_placeholder')}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            label={t('auth.email_label')}
                            placeholder={t('auth.email_placeholder')}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            label={t('auth.password_label')}
                            placeholder={t('auth.password_placeholder')}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            type="password"
                            name="confirmPassword"
                            label={t('auth.confirm_password_label')}
                            placeholder={t('auth.confirm_password_placeholder')}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Section: Personal Info */}
                    <h3 className="section-title">{t('auth.section_personal')}</h3>
                    <div className="form-grid">
                        <Select
                            name="gender"
                            label={t('auth.gender_label')}
                            value={formData.gender}
                            onChange={handleChange}
                            options={[
                                { value: 'male', label: t('auth.gender_male') },
                                { value: 'female', label: t('auth.gender_female') }
                            ]}
                            required
                        />
                        <Input
                            type="text"
                            name="identityNumber"
                            label={t('auth.id_label')}
                            placeholder={t('auth.id_placeholder')}
                            value={formData.identityNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Section: Location & Contact */}
                    <h3 className="section-title">{t('auth.section_location')}</h3>
                    <div className="form-grid">
                        <Input
                            type="tel"
                            name="phone"
                            label={t('auth.phone_label')}
                            placeholder={t('auth.phone_placeholder')}
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <Select
                            name="country"
                            label={t('auth.country_label')}
                            value={formData.country}
                            onChange={handleChange}
                            options={[
                                { value: 'EG', label: 'Egypt' },
                                { value: 'SA', label: 'Saudi Arabia' },
                                { value: 'OM', label: 'Oman' },
                                { value: 'AE', label: 'UAE' },
                                { value: 'KW', label: 'Kuwait' }
                            ]}
                            required
                        />
                        <div className="full-width">
                            <Input
                                type="text"
                                name="Address"
                                label={t('auth.address_label')}
                                placeholder={t('auth.address_placeholder')}
                                value={formData.Address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="register-btn disabled:opacity-70 flex justify-center items-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            t('auth.signup_btn')
                        )}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        {t('auth.have_account')}{' '}
                        <Link to="/auth/login">{t('auth.signin')}</Link>
                    </p>
                </div>
            </div>

            <AuthVisual />
        </div>
    );
};

export default Register;
