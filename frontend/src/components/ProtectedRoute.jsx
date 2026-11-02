import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, loginPath = '/login' }) {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) return <Navigate to={loginPath} state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
}
