import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PackagesPage from './pages/PackagesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageCoverage from './pages/admin/ManageCoverage';
import ManageAgents from './pages/admin/ManageAgents';
import OrdersList from './pages/admin/OrdersList';
import LeadsAndCallbacks from './pages/admin/LeadsAndCallbacks';
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentCallbacks from './pages/agent/AgentCallbacks';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

export default function App() {
    const { user } = useAuth();
    const location = useLocation();
    const isAuthPage = /^\/(admin|agent)\/(login|register)$/.test(location.pathname);
    const showPublicFooter = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/agent') && !isAuthPage;
    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-between">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                    <Route path="/admin/login" element={<Login role="admin" />} />
                    <Route path="/agent/login" element={<Login role="sales_agent" />} />
                    <Route path="/admin/register" element={<Login role="admin" register />} />
                    <Route path="/agent/register" element={<Login role="sales_agent" register />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/agent/orders" element={
                        <ProtectedRoute allowedRoles={['sales_agent']} loginPath="/agent/login">
                            <AgentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/agent/callbacks" element={
                        <ProtectedRoute allowedRoles={['sales_agent']} loginPath="/agent/login">
                            <AgentCallbacks />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/packages" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <ManagePackages />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/coverage" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <ManageCoverage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/agents" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <ManageAgents />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <OrdersList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/callbacks" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <LeadsAndCallbacks />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/leads" element={
                        <ProtectedRoute allowedRoles={['admin']} loginPath="/admin/login">
                            <LeadsAndCallbacks />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            {showPublicFooter && <Footer />}
            {!user && !isAuthPage && <Chatbot />}
        </div>
    );
}