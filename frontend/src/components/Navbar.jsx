import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Radio, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const signOut = () => { logout(); navigate('/'); };

    return (
        <header className="site-nav">
            <div className="nav-inner">
                <Link to="/" className="brand" aria-label="Northline Fiber home" title="Go to home"><span className="brand-mark"><Radio size={19} /></span><span>Northline<span className="brand-light"> Fiber</span></span></Link>
                <nav className="nav-links" aria-label="Main navigation">
                    <NavLink to="/packages">Plans</NavLink>
                    {user?.role === 'admin' && <NavLink to="/admin/dashboard">Admin</NavLink>}
                    {user?.role === 'sales_agent' && <NavLink to="/agent/orders">Orders</NavLink>}
                </nav>
                <div className="nav-account">
                    {user ? <><span className="account-name"><UserRound size={15} />{user.name}</span><button className="icon-button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button></> : <Link to="/login" className="button button-dark">Staff sign in</Link>}
                </div>
            </div>
        </header>
    );
}
