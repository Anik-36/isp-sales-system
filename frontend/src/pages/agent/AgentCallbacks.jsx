import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, PhoneCall } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AgentCallbacks() {
    const client = useQueryClient();
    const callbacksQuery = useQuery({
        queryKey: ['agentCallbacks'],
        queryFn: async () => (await api.get('/agent/callbacks')).data,
        refetchInterval: 5000,
    });
    const update = useMutation({
        mutationFn: ({ id, status }) => api.patch(`/callbacks/${id}/status`, { status }),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['agentCallbacks'] });
            client.invalidateQueries({ queryKey: ['callbacks'] });
        },
    });

    return <section className="agent-page">
        <div className="agent-heading"><div><span className="eyebrow">SALES WORKSPACE</span><h1>Assigned callbacks</h1></div><p>Contact the customers assigned to you and update their contact status.</p></div>
        <section className="table-panel">
            <div className="panel-heading"><div><span className="eyebrow">CUSTOMER CONTACT</span><h2><PhoneCall size={19} /> Callback requests <span className="count-pill">{callbacksQuery.data?.length || 0}</span></h2></div></div>
            {callbacksQuery.isLoading ? <div className="loading-state"><LoaderCircle className="spin" /> Loading callbacks…</div> : callbacksQuery.isError ? <p className="notice-error">Could not load assigned callbacks.</p> : !callbacksQuery.data?.length ? <p className="empty-state">No callbacks have been assigned to you.</p> : <div className="data-list">{callbacksQuery.data.map((callback) => <article className="lead-row callback-admin-row" key={callback._id}><div className="data-main"><strong>{callback.customerName}</strong><small>Requested {new Date(callback.createdAt).toLocaleDateString()}</small></div><a className="agent-callback-phone" href={`tel:${callback.phone}`}><PhoneCall size={15} />{callback.phone}</a><select className={`status-select status-${(callback.status || 'NOT_CONTACTED').toLowerCase()}`} aria-label={`Contact status for ${callback.customerName}`} value={callback.status || 'NOT_CONTACTED'} disabled={update.isPending} onChange={(event) => update.mutate({ id: callback._id, status: event.target.value })}><option value="NOT_CONTACTED">Not contacted</option><option value="CONTACTED">Contacted</option></select></article>)}</div>}
        </section>
    </section>;
}
