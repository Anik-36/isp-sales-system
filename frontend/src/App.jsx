import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import PackagesPage from './pages/PackagesPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import Chatbot from './components/Chatbot';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};

export default function App() {
    return (
        <div className="min-h-screen bg-base-200 flex flex-col justify-between">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/agent/orders" element={
                        <ProtectedRoute allowedRoles={['sales_agent', 'admin']}>
                            <AgentDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Chatbot />
        </div>
    );
}