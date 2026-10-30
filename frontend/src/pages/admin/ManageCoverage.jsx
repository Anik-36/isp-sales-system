import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, MapPinned, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';

const DIVISIONS = ['Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'];

export default function ManageCoverage() {
    const client = useQueryClient();
    const [division, setDivision] = useState('Dhaka');
    const [city, setCity] = useState('Dhaka');
    const [areaName, setAreaName] = useState('');
    const [error, setError] = useState('');

    const { data: areas = [], isLoading } = useQuery({
        queryKey: ['coverage'],
        queryFn: async () => (await api.get('/coverage')).data,
    });

    const add = useMutation({
        mutationFn: () => api.post('/coverage', { division, city: city.trim(), areaName: areaName.trim() }),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['coverage'] });
            setAreaName('');
            setError('');
        },
        onError: (e) => setError(e.response?.data?.message || 'Could not add area.'),
    });

    const remove = useMutation({
        mutationFn: (id) => api.delete(`/coverage/${id}`),
        onSuccess: () => client.invalidateQueries({ queryKey: ['coverage'] }),
        onError: (e) => setError(e.response?.data?.message || 'Could not remove area.'),
    });

    // City suggestions: only cities already used inside the selected division
    const citySuggestions = useMemo(
        () => [...new Set(areas.filter((a) => a.division === division).map((a) => a.city))].sort(),
        [areas, division]
    );

    // Group: division -> city -> areas (all sorted)
    const grouped = useMemo(() => {
        const byDivision = {};
        areas.forEach((a) => {
            const d = a.division || 'Unassigned';
            byDivision[d] ??= {};
            byDivision[d][a.city] ??= [];
            byDivision[d][a.city].push(a);
        });
        return Object.keys(byDivision)
            .sort()
            .map((d) => ({
                division: d,
                total: Object.values(byDivision[d]).reduce((sum, list) => sum + list.length, 0),
                cities: Object.keys(byDivision[d])
                    .sort()
                    .map((c) => ({
                        city: c,
                        areas: byDivision[d][c].sort((x, y) => x.areaName.localeCompare(y.areaName)),
                    })),
            }));
    }, [areas]);

    const handleRemove = (area) => {
        if (window.confirm(`Remove ${area.areaName} from coverage?`)) remove.mutate(area._id);
    };

    return (
        <AdminLayout title="Coverage areas">
            <div className="admin-columns">
                <form
                    className="form-panel"
                    onSubmit={(event) => {
                        event.preventDefault();
                        add.mutate();
                    }}
                >
                    <div className="panel-heading">
                        <div>
                            <span className="eyebrow">EXPAND SERVICE</span>
                            <h2>Add coverage</h2>
                        </div>
                        <MapPinned size={20} />
                    </div>

                    <label>
                        Division
                        <select value={division} onChange={(e) => setDivision(e.target.value)} required>
                            {DIVISIONS.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </label>

                    <label>
                        City
                        <input
                            list="coverage-cities"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            placeholder="City or district"
                        />
                        <datalist id="coverage-cities">
                            {citySuggestions.map((name) => (
                                <option key={name} value={name} />
                            ))}
                        </datalist>
                    </label>

                    <label>
                        Area name
                        <input
                            value={areaName}
                            onChange={(e) => setAreaName(e.target.value)}
                            required
                            placeholder="Neighborhood or thana"
                        />
                    </label>

                    {error && <p className="form-error">{error}</p>}

                    <button className="button button-dark full-width" disabled={add.isPending}>
                        {add.isPending ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />}
                        Add area
                    </button>
                </form>

                <section className="table-panel">
                    <div className="panel-heading">
                        <div>
                            <span className="eyebrow">SERVICE MAP</span>
                            <h2>Current coverage <span className="count-pill">{areas.length}</span></h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="muted">Loading coverage…</p>
                    ) : grouped.length === 0 ? (
                        <p className="muted">No coverage areas yet. Add the first one from the form.</p>
                    ) : (
                        <div className="data-list">
                            {grouped.map((group) => (
                                <div className="coverage-group" key={group.division}>
                                    <h3>
                                        {group.division}
                                        <span>{group.total} areas · {group.cities.length} cities</span>
                                    </h3>

                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="coverage-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th style={th}>City</th>
                                                    <th style={th}>Area</th>
                                                    <th style={{ ...th, width: 56, textAlign: 'right' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {group.cities.map((c) =>
                                                    c.areas.map((area, index) => (
                                                        <tr key={area._id}>
                                                            {index === 0 && (
                                                                <td style={{ ...td, fontWeight: 600, verticalAlign: 'top' }} rowSpan={c.areas.length}>
                                                                    {c.city}
                                                                    <div className="muted" style={{ fontWeight: 400, fontSize: 12 }}>
                                                                        {c.areas.length} {c.areas.length === 1 ? 'area' : 'areas'}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td style={td}>
                                                                <span className="live-dot" /> {area.areaName}
                                                            </td>
                                                            <td style={{ ...td, textAlign: 'right' }}>
                                                                <button
                                                                    type="button"
                                                                    className="icon-button danger-icon"
                                                                    title={`Remove ${area.areaName}`}
                                                                    disabled={remove.isPending}
                                                                    onClick={() => handleRemove(area)}
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AdminLayout>
    );
}

const th = { textAlign: 'left', padding: '8px 12px', fontSize: 13, borderBottom: '1px solid rgba(128,128,128,.35)' };
const td = { padding: '8px 12px', borderBottom: '1px solid rgba(128,128,128,.18)' };