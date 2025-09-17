import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './style.scss';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', JSON.stringify({ email: formData.email }));
            navigate('/users');
        }, 1000);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Section - Visuals */}
                <div className="login-visual-wrapper">
                    <div className="login-visual">
                        <div className="logo">
                            <img
                                src="/images/logo.png"
                                alt="Logo"
                            />
                        </div>

                        <div className="illustration">
                            <img
                                src="/images/pablo-sign-in.png"
                                alt="Pablo Sign In Illustration"
                                className="illustration-image"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section - Login Form */}
                <div className="login-form-section">
                    <div className="login-form-container">
                        <h1 className="welcome-title">Welcome!</h1>
                        <p className="welcome-subtitle">Enter details to login.</p>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div className="password-input-container">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="show-password-btn"
                                        onClick={togglePasswordVisibility}
                                    >
                                        SHOW
                                    </button>
                                </div>
                            </div>

                            <div className="forgot-password">
                                <button
                                    type="button"
                                    className="forgot-password-link"
                                    onClick={() => console.log('Forgot password clicked')}
                                >
                                    FORGOT PASSWORD?
                                </button>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                disabled={isLoading}
                                className="login-btn"
                            >
                                {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
