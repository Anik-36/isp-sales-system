import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Login({ role = 'admin', register = false }) {
    const [name, setName] = useState('');
    const [setupKey, setSetupKey] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function submit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const rolePath = role === 'sales_agent' ? 'agent' : 'admin';
            const endpoint = register ? `/auth/${rolePath}/register` : `/auth/${rolePath}/login`;
            const payload = register ? { name, email, password, ...(role === 'admin' ? { setupKey } : {}) } : { email, password };
            const { data } = await api.post(endpoint, payload);
            if (register && role === 'sales_agent') {
                setSuccess(data.message);
                return;
            }
            login(data);
            const destination = location.state?.from?.pathname || (data.role === 'admin' ? '/admin/dashboard' : '/agent/orders');
            navigate(destination, { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
        } finally { setLoading(false); }
    }

    return (
        <section className="login-page">
            <div className="login-art">
                <span className="eyebrow">CIRCLE NETWORK BD / {role === 'admin' ? 'ADMIN' : 'SALES AGENT'}</span>
                <div className="login-art-title">{register ? <>Start<br /><em>with access.</em></> : <>Connected<br /><em>from here.</em></>}</div>
                <div className="art-lines" />
                <span className="login-art-caption">{register ? (role === 'admin' ? 'KEY-PROTECTED ADMIN SIGNUP' : 'AGENT ACCESS REQUEST') : (role === 'admin' ? 'ADMIN ACCESS' : 'SALES TEAM ACCESS')} · 2026</span>
            </div>
            <div className="login-form-wrap">
                <form className="login-form" onSubmit={submit}>
                    <span className="form-icon"><LockKeyhole size={19} /></span>
                    <span className="eyebrow">{role === 'admin' ? 'ADMIN PORTAL' : 'SALES AGENT PORTAL'}</span>
                    <h1>{register ? (role === 'admin' ? 'Set up admin access.' : 'Request agent access.') : (role === 'admin' ? 'Admin sign in.' : 'Agent sign in.')}</h1>
                    <p>{register ? (role === 'admin' ? 'Admin signup requires the private setup key configured on the server.' : 'Create an agent account request. An admin must approve it before you can sign in.') : (role === 'admin' ? 'Manage plans, coverage, staff, and customer activity.' : 'Review customer orders and update connection statuses.')}</p>
                    {register && <label>Full name<input autoComplete="name" maxLength={100} required value={name} onChange={(event) => setName(event.target.value)} /></label>}
                    {register && role === 'admin' && <label>Admin setup key<input type="password" autoComplete="off" required value={setupKey} onChange={(event) => setSetupKey(event.target.value)} /></label>}
                    <label>
                        Email address
                        <input
                            type="email"
                            autoComplete="username"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@circlenetworkbd.net"
                        />
                    </label>
                    <label>
                        Password
                        <span className="password-field">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                            />
                            <button
                                className="password-toggle"
                                type="button"
                                onClick={() => setShowPassword((visible) => !visible)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                aria-pressed={showPassword}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </span>
                    </label>
                    {error && <div className="form-error" role="alert">{error}</div>}
                    {success && <div className="notice-success" role="status">{success}</div>}
                    <button className="button button-dark full-width" disabled={loading || Boolean(success)}>
                        {loading ? <LoaderCircle className="spin" size={17} /> : <>{register ? (role === 'admin' ? 'Create admin account' : 'Submit agent request') : 'Sign in'} <ArrowRight size={17} /></>}
                    </button>
                    <p className="customer-access-switch">
                        {register ? 'Already have an account?' : (role === 'admin' ? 'Sales team member?' : 'Administrator?')}{' '}
                        {register ? <Link to={`/${role === 'admin' ? 'admin' : 'agent'}/login`}>Sign in</Link> : <Link to={role === 'admin' ? '/agent/login' : '/admin/login'}>{role === 'admin' ? 'Agent sign in' : 'Admin sign in'}</Link>}
                    </p>
                    {!register && <p className="customer-access-switch">Need an account? <Link to={`/${role === 'admin' ? 'admin' : 'agent'}/register`}>{role === 'admin' ? 'Initial admin setup' : 'Sign up as an agent'}</Link></p>}
                </form>
            </div>
        </section>
    );
}
