import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, MapPinned, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';

export default function ManageCoverage() {
    const client = useQueryClient();
    const [city, setCity] = useState('Dhaka');
    const [areaName, setAreaName] = useState('');
    const [error, setError] = useState('');
    const { data: areas = [], isLoading } = useQuery({ queryKey: ['coverage'], queryFn: async () => (await api.get('/coverage')).data });
    const add = useMutation({ mutationFn: () => api.post('/coverage', { city, areaName }), onSuccess: () => { client.invalidateQueries({ queryKey: ['coverage'] }); setAreaName(''); setError(''); }, onError: (e) => setError(e.response?.data?.message || 'Could not add area.') });
    const remove = useMutation({ mutationFn: (id) => api.delete(`/coverage/${id}`), onSuccess: () => client.invalidateQueries({ queryKey: ['coverage'] }), onError: (e) => setError(e.response?.data?.message || 'Could not remove area.') });
    const cities = [...new Set([...areas.map((area) => area.city), 'Dhaka', 'Chattogram'])].sort();
    return <AdminLayout title="Coverage areas"><div className="admin-columns"><form className="form-panel" onSubmit={(event) => { event.preventDefault(); add.mutate(); }}><div className="panel-heading"><div><span className="eyebrow">EXPAND SERVICE</span><h2>Add coverage</h2></div><MapPinned size={20} /></div><label>City<input list="coverage-cities" value={city} onChange={(e) => setCity(e.target.value)} required /><datalist id="coverage-cities">{cities.map((name) => <option key={name} value={name} />)}</datalist></label><label>Area name<input value={areaName} onChange={(e) => setAreaName(e.target.value)} required placeholder="Neighborhood or district" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-dark full-width" disabled={add.isPending}>{add.isPending ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}Add area</button></form><section className="table-panel"><div className="panel-heading"><div><span className="eyebrow">SERVICE MAP</span><h2>Current coverage <span className="count-pill">{areas.length}</span></h2></div></div>{isLoading ? <p className="muted">Loading coverage…</p> : <div className="data-list">{cities.map((name) => { const cityAreas = areas.filter((area) => area.city === name); return <div className="coverage-group" key={name}><h3>{name}<span>{cityAreas.length} areas</span></h3>{cityAreas.map((area) => <article className="coverage-row" key={area._id}><span className="live-dot" />{area.areaName}<button className="icon-button danger-icon" title={`Remove ${area.areaName}`} onClick={() => { if (window.confirm(`Remove ${area.areaName} from coverage?`)) remove.mutate(area._id); }}><Trash2 size={15} /></button></article>)}</div>; })}</div>}</section></div></AdminLayout>;
}
