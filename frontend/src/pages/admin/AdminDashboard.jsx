import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, CircleCheck, Clock3, ClipboardList, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';

const cards = [
    { key: 'totalOrders', label: 'Total orders', icon: ClipboardList, color: 'teal' },
    { key: 'pendingOrders', label: 'Pending requests', icon: Clock3, color: 'amber' },
    { key: 'completedConnections', label: 'Connected', icon: CircleCheck, color: 'green' },
    { key: 'totalAgents', label: 'Sales agents', icon: Users, color: 'blue' }
];

export default function AdminDashboard() {
    const { data: stats = {}, isLoading, isError } = useQuery({ queryKey: ['adminStats'], queryFn: async () => (await api.get('/admin/stats')).data });
    return <AdminLayout title="Overview"><div className="stats-grid">{cards.map(({ key, label, icon: Icon, color }) => <article className="metric-card" key={key}><div className={`metric-icon ${color}`}><Icon size={19} /></div><span className="metric-label">{label}</span><strong>{isLoading ? '—' : stats[key] ?? 0}</strong><span className="metric-foot">Current totals</span></article>)}</div>{isError && <p className="notice-error">Could not load dashboard metrics. Confirm your admin access and API connection.</p>}<section className="workspace-section"><div className="section-title"><div><span className="eyebrow">QUICK ACCESS</span><h2>Manage your operation</h2></div></div><div className="quick-grid"><Link to="/admin/orders"><span><ClipboardList size={20} /></span><strong>Customer orders</strong><small>Review and update connection requests</small><ArrowUpRight size={17} /></Link><Link to="/admin/packages"><span><CircleCheck size={20} /></span><strong>Internet plans</strong><small>Update available speeds and pricing</small><ArrowUpRight size={17} /></Link><Link to="/admin/agents"><span><Users size={20} /></span><strong>Sales team</strong><small>Manage staff access</small><ArrowUpRight size={17} /></Link></div></section><section className="dashboard-note"><span className="live-dot" /><p><strong>Service desk is online</strong><br />New customer requests appear in the orders workspace.</p><Link className="text-link" to="/admin/orders">Open orders <ArrowUpRight size={15} /></Link></section></AdminLayout>;
}
