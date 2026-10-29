import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PackagesPage from './pages/PackagesPage';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePackages from './pages/admin/ManagePackages';
import ManageCoverage from './pages/admin/ManageCoverage';
import ManageAgents from './pages/admin/ManageAgents';
import OrdersList from './pages/admin/OrdersList';
import LeadsAndCallbacks from './pages/admin/LeadsAndCallbacks';
import AgentDashboard from './pages/agent/AgentDashboard';

const admin = (page) => <ProtectedRoute allowedRoles={['admin']}>{page}</ProtectedRoute>;

export default function App() {
    return <><Navbar /><main className="app-main"><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agent/orders" element={<ProtectedRoute allowedRoles={['sales_agent', 'admin']}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={admin(<AdminDashboard />)} />
        <Route path="/admin/packages" element={admin(<ManagePackages />)} />
        <Route path="/admin/coverage" element={admin(<ManageCoverage />)} />
        <Route path="/admin/agents" element={admin(<ManageAgents />)} />
        <Route path="/admin/orders" element={admin(<OrdersList />)} />
        <Route path="/admin/leads" element={admin(<LeadsAndCallbacks />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></main><Footer /><Chatbot /></>;
}
