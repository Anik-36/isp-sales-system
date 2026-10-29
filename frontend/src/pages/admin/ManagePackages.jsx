import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Pencil, Plus, Trash2, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';

const blank = { name: '', speed: '', price: '', isActive: true };

export default function ManagePackages() {
    const client = useQueryClient();
    const [form, setForm] = useState(blank);
    const [editing, setEditing] = useState(null);
    const [error, setError] = useState('');
    const { data: packages = [], isLoading } = useQuery({ queryKey: ['packages', 'admin'], queryFn: async () => (await api.get('/packages?all=true')).data });
    const refresh = () => client.invalidateQueries({ queryKey: ['packages'] });
    const save = useMutation({ mutationFn: () => editing ? api.put(`/packages/${editing}`, form) : api.post('/packages', form), onSuccess: () => { refresh(); setForm(blank); setEditing(null); setError(''); }, onError: (e) => setError(e.response?.data?.message || 'Could not save this plan.') });
    const remove = useMutation({ mutationFn: (id) => api.delete(`/packages/${id}`), onSuccess: refresh, onError: (e) => setError(e.response?.data?.message || 'Could not delete this plan.') });
    const edit = (pkg) => { setEditing(pkg._id); setForm({ name: pkg.name, speed: pkg.speed, price: pkg.price, isActive: pkg.isActive }); };
    return <AdminLayout title="Internet plans"><div className="admin-columns"><form className="form-panel" onSubmit={(event) => { event.preventDefault(); save.mutate(); }}><div className="panel-heading"><div><span className="eyebrow">{editing ? 'EDIT PLAN' : 'NEW PLAN'}</span><h2>{editing ? 'Update details' : 'Add a plan'}</h2></div>{editing && <button type="button" className="icon-button" onClick={() => { setEditing(null); setForm(blank); }} aria-label="Cancel editing"><X size={17} /></button>}</div><label>Plan name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label>Speed<input value={form.speed} onChange={(e) => setForm({ ...form, speed: e.target.value })} placeholder="50 Mbps" required /></label><label>Monthly price (৳)<input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label><label className="check-label"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Available to customers</label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" disabled={save.isPending}>{save.isPending ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}{editing ? 'Save changes' : 'Create plan'}</button></form><section className="table-panel"><div className="panel-heading"><div><span className="eyebrow">CATALOG</span><h2>All plans <span className="count-pill">{packages.length}</span></h2></div></div>{isLoading ? <p className="muted">Loading plans…</p> : packages.length === 0 ? <p className="empty-state">No plans created yet.</p> : <div className="data-list">{packages.map((pkg) => <article className="data-row" key={pkg._id}><div className="data-main"><strong>{pkg.name}</strong><span>{pkg.speed} · ৳{pkg.price}/month</span></div><span className={`status-pill ${pkg.isActive ? 'status-connected' : 'status-cancelled'}`}>{pkg.isActive ? 'ACTIVE' : 'HIDDEN'}</span><button className="icon-button" title="Edit plan" onClick={() => edit(pkg)}><Pencil size={15} /></button><button className="icon-button danger-icon" title="Delete plan" onClick={() => { if (window.confirm(`Delete ${pkg.name}?`)) remove.mutate(pkg._id); }}><Trash2 size={15} /></button></article>)}</div>}</section></div></AdminLayout>;
}
