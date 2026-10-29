import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('isp_user') || 'null'); }
        catch { return null; }
    });

    const value = useMemo(() => ({
        user,
        login(userData) {
            localStorage.setItem('isp_user', JSON.stringify(userData));
            setUser(userData);
        },
        logout() {
            localStorage.removeItem('isp_user');
            setUser(null);
        }
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
}
