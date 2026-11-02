import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Radio, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signOut = () => { logout(); navigate('/'); };

    return (
        <header className="site-nav">
            <div className="nav-inner">
                <Link to="/" className="brand" aria-label="Circle Network BD home" title="Go to home"><span className="brand-mark"><Radio size={19} /></span><span>Circle<span className="brand-light"> Network</span><small className="brand-country">BD</small></span></Link>
                <nav className="nav-links" aria-label="Main navigation">
                    <NavLink to="/packages">Plans</NavLink>
                    {user?.role === 'admin' && <NavLink to="/admin/dashboard" className={location.pathname.startsWith('/admin/') ? 'active' : ''}>Admin</NavLink>}
                    {user?.role === 'sales_agent' && <NavLink to="/agent/orders">Orders</NavLink>}
                    {user?.role === 'sales_agent' && <NavLink to="/agent/callbacks">Callbacks</NavLink>}
                </nav>
                <div className="nav-account">
                    {user ? <><span className="account-name"><UserRound size={15} />{user.name}</span><button className="icon-button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button></> : <div className="nav-links"><NavLink to="/agent/login" className={location.pathname.startsWith('/agent/') ? 'active' : ''}>Sales agent</NavLink><NavLink to="/admin/login" className={location.pathname.startsWith('/admin/') ? 'active' : ''}>Admin</NavLink></div>}
                </div>
            </div>
        </header>
    );
}
