import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, PhoneCall, UserRoundSearch } from 'lucide-react';
import api from '../../api/axiosInstance';
import AdminLayout from '../../components/AdminLayout';

export default function LeadsAndCallbacks() {
    const client = useQueryClient();
    const leadsQuery = useQuery({ queryKey: ['leads'], queryFn: async () => (await api.get('/leads')).data });
    const callbacksQuery = useQuery({ queryKey: ['callbacks'], queryFn: async () => (await api.get('/callbacks')).data, refetchInterval: 5000 });
    const agentsQuery = useQuery({ queryKey: ['agents'], queryFn: async () => (await api.get('/admin/agents')).data });
    const assign = useMutation({
        mutationFn: ({ id, agentId }) => api.patch(`/callbacks/${id}/assign`, { agentId }),
        onSuccess: () => client.invalidateQueries({ queryKey: ['callbacks'] }),
    });
    const updateLead = useMutation({
        mutationFn: ({ id, coverageStatus }) => api.patch(`/leads/${id}/coverage`, { coverageStatus }),
        onSuccess: () => client.invalidateQueries({ queryKey: ['leads'] }),
    });
    const agents = (agentsQuery.data || []).filter((agent) => agent.accountStatus !== 'pending');

    return <AdminLayout title="Leads & callbacks">
        <div className="lead-columns">
            <section className="table-panel">
                <div className="panel-heading"><div><span className="eyebrow">EXPANSION INTEREST</span><h2><UserRoundSearch size={19} /> Future leads <span className="count-pill">{leadsQuery.data?.length || 0}</span></h2></div></div>
                {leadsQuery.isLoading ? <LoaderCircle className="spin" /> : leadsQuery.isError ? <p className="notice-error">Could not load leads.</p> : !leadsQuery.data?.length ? <p className="empty-state">No future leads at this time.</p> : <div className="data-list">{leadsQuery.data.map((lead) => <article className="lead-row" key={lead._id}><div className="data-main"><strong>{lead.customerName}</strong><span>{lead.city ? `${lead.city} · ` : ''}{lead.areaName}</span></div><a className="contact-action" href={`tel:${lead.phone}`}><PhoneCall size={14} /> Call customer</a><select className={`status-select status-${(lead.coverageStatus || 'NOT_COVERED').toLowerCase()}`} aria-label={`Coverage status for ${lead.areaName}`} value={lead.coverageStatus || 'NOT_COVERED'} disabled={updateLead.isPending} onChange={(event) => updateLead.mutate({ id: lead._id, coverageStatus: event.target.value })}><option value="NOT_COVERED">Not covered</option><option value="COVERED">Covered</option></select></article>)}</div>}
            </section>
            <section className="table-panel">
                <div className="panel-heading"><div><span className="eyebrow">CUSTOMER CONTACT</span><h2><PhoneCall size={19} /> Callback requests <span className="count-pill">{callbacksQuery.data?.length || 0}</span></h2></div></div>
                {callbacksQuery.isLoading || agentsQuery.isLoading ? <LoaderCircle className="spin" /> : callbacksQuery.isError || agentsQuery.isError ? <p className="notice-error">Could not load callbacks or sales agents.</p> : !callbacksQuery.data?.length ? <p className="empty-state">No callback requests at this time.</p> : <div className="data-list">{callbacksQuery.data.map((callback) => <article className="lead-row callback-admin-row" key={callback._id}><div className="data-main"><strong>{callback.customerName}</strong><span>{callback.phone}</span></div><label className="assignment-field"><span>Assigned agent</span><select className={`assignment-select ${callback.assignedAgent ? 'is-assigned' : 'is-unassigned'}`} value={callback.assignedAgent?._id || ''} disabled={assign.isPending} onChange={(event) => assign.mutate({ id: callback._id, agentId: event.target.value })}><option value="">Unassigned</option>{agents.map((agent) => <option value={agent._id} key={agent._id}>{agent.name}</option>)}</select></label><span className={`status-select callback-contact-status status-${(callback.status || 'NOT_CONTACTED').toLowerCase()}`}>{callback.status === 'CONTACTED' ? 'Contacted' : 'Not contacted'}</span></article>)}</div>}
            </section>
        </div>
    </AdminLayout>;
}