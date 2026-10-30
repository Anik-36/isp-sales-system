// import React, { useState } from 'react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function submit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            const destination = location.state?.from?.pathname || (data.role === 'admin' ? '/admin/dashboard' : '/agent/orders');
            navigate(destination, { replace: true });
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to sign in. Check your connection and try again.');
        } finally { setLoading(false); }
    }

    return <section className="login-page"><div className="login-art"><span className="eyebrow">NORTHLINE FIBER / TEAM</span><div className="login-art-title">Connected<br /><em>from here.</em></div><div className="art-lines" /><span className="login-art-caption">STAFF ACCESS · 2026</span></div><div className="login-form-wrap"><form className="login-form" onSubmit={submit}><span className="form-icon"><LockKeyhole size={19} /></span><span className="eyebrow">STAFF PORTAL</span><h1>Welcome back.</h1><p>Sign in to manage connections and customers.</p><label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@northline.com" /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /></label>{error && <div className="form-error" role="alert">{error}</div>}<button className="button button-dark full-width" disabled={loading}>{loading ? <LoaderCircle className="spin" size={17} /> : <>Sign in <ArrowRight size={17} /></>}</button></form></div></section>;
}
