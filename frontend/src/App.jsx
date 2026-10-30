import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Chatbot from './components/Chatbot';

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
                    <Route path="/admin/packages" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManagePackages />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/coverage" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageCoverage />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/agents" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <ManageAgents />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <OrdersList />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/callbacks" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <LeadsAndCallbacks />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/leads" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <LeadsAndCallbacks />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Chatbot />
        </div>
    );
}