import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Check, LoaderCircle, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function PackagesPage() {
    const { data: packages = [], isLoading, isError } = useQuery({ queryKey: ['packages'], queryFn: async () => (await api.get('/packages')).data });
    return <section className="content-page plans-page"><div className="page-heading"><div><span className="eyebrow">PICK YOUR PACE</span><h1>Plans that fit<br />your kind of day.</h1></div><p>Simple monthly pricing. Reliable fiber. Choose a speed and we’ll take it from here.</p></div>
        {isLoading ? <div className="loading-state"><LoaderCircle className="spin" /> Loading plans...</div> : isError ? <p className="notice-error">Could not load plans. Check that the API is running.</p> : packages.length === 0 ? <p className="empty-state">No active plans are available right now.</p> : <div className="plan-grid">{packages.map((pkg, index) => <article className={`plan-card ${index === 1 ? 'plan-featured' : ''}`} key={pkg._id}><div className="plan-card-top"><span className="plan-icon"><Wifi size={20} /></span>{index === 1 && <span className="plan-badge">MOST POPULAR</span>}</div><h2>{pkg.name}</h2><p className="plan-speed">{pkg.speed}</p><p className="plan-price"><strong>৳{pkg.price.toLocaleString()}</strong><span>/ month</span></p><div className="plan-rule" /><ul><li><Check size={15} /> Unlimited usage</li><li><Check size={15} /> Fiber-to-home connection</li><li><Check size={15} /> Local support team</li></ul><Link to="/#" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('open-connection-chat')); }} className="button button-dark full-width">Get connected <ArrowRight size={16} /></Link></article>)}</div>}
        <div className="coverage-callout"><span>Need a recommendation?</span><p>Our team can help you choose the right speed for your home.</p><button className="text-link" onClick={() => window.dispatchEvent(new Event('open-connection-chat'))}>Talk to us <ArrowRight size={16} /></button></div>
    </section>;
}
