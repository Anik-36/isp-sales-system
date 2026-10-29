import { NavLink } from 'react-router-dom';
import { Boxes, ChartNoAxesCombined, ClipboardList, MapPinned, Users, UserRoundSearch } from 'lucide-react';

const links = [
    { to: '/admin/dashboard', label: 'Overview', icon: ChartNoAxesCombined },
    { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { to: '/admin/packages', label: 'Internet plans', icon: Boxes },
    { to: '/admin/coverage', label: 'Coverage areas', icon: MapPinned },
    { to: '/admin/agents', label: 'Sales agents', icon: Users },
    { to: '/admin/leads', label: 'Leads & callbacks', icon: UserRoundSearch }
];

export default function AdminLayout({ title, eyebrow = 'OPERATIONS', children }) {
    return <section className="admin-layout"><aside className="admin-sidebar"><div className="sidebar-label">WORKSPACE</div><nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}><Icon size={17} />{label}</NavLink>)}</nav><div className="sidebar-foot"><span className="live-dot" /> SYSTEM OPERATIONAL</div></aside><div className="admin-content"><header className="admin-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1></div><span className="admin-date">ISP SALES MANAGEMENT</span></header>{children}</div></section>;
}
