import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, LoaderCircle, RefreshCw } from 'lucide-react';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const statuses = ['PENDING', 'CONFIRMED', 'CONNECTED', 'CANCELLED'];

function OrdersTable() {
    const client = useQueryClient();
    const { data: orders = [], isLoading, isError } = useQuery({ queryKey: ['orders'], queryFn: async () => (await api.get('/orders')).data });
    const update = useMutation({ mutationFn: ({ id, status }) => api.patch(`/orders/${id}/status`, { status }), onSuccess: () => client.invalidateQueries({ queryKey: ['orders'] }) });
    if (isLoading) return <div className="loading-state"><LoaderCircle className="spin" /> Loading orders…</div>;
    if (isError) return <p className="notice-error">Could not load orders. Please sign in again or check the API.</p>;
    if (!orders.length) return <div className="empty-panel"><ClipboardList size={26} /><h2>No orders yet</h2><p>Customer connection requests will appear here.</p></div>;
    return <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>Customer</th><th>Phone</th><th>Location</th><th>Plan</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td><strong>{order.customerName}</strong><small>{order.address}</small></td><td><a href={`tel:${order.phone}`}>{order.phone}</a></td><td>{order.city}<small>{order.area}</small></td><td>{order.package?.name || 'Plan removed'}<small>{order.package?.speed || ''}</small></td><td><select className={`status-select status-${order.status.toLowerCase()}`} value={order.status} disabled={update.isPending} onChange={(event) => update.mutate({ id: order._id, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>;
}

export default function AgentDashboard({ adminView = false }) {
    const { user } = useAuth();
    const content = <><div className="table-toolbar"><p>Review connection requests and keep each customer updated.</p><span><RefreshCw size={14} /> Live from customer requests</span></div><OrdersTable /></>;
    if (adminView) return <AdminLayout title="Customer orders">{content}</AdminLayout>;
    return <section className="agent-page"><div className="agent-heading"><div><span className="eyebrow">{user?.role === 'admin' ? 'ADMIN WORKSPACE' : 'SALES WORKSPACE'}</span><h1>Customer orders</h1></div><p>Review requests and update connection progress.</p></div>{content}</section>;
}
