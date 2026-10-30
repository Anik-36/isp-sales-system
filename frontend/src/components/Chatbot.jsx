// import React, { useState } from 'react';
import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MessageCircle, X, ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import api from '../api/axiosInstance';

const emptyForm = { name: '', phone: '', address: '' };

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState('MENU');
    const [city, setCity] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedPkg, setSelectedPkg] = useState('');
    const [formData, setFormData] = useState(emptyForm);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        const open = () => setIsOpen(true);
        window.addEventListener('open-connection-chat', open);
        return () => window.removeEventListener('open-connection-chat', open);
    }, []);
    const { data: packages = [] } = useQuery({ queryKey: ['packages'], queryFn: async () => (await api.get('/packages')).data });
    const { data: areas = [] } = useQuery({ queryKey: ['coverage'], queryFn: async () => (await api.get('/coverage')).data });
    const complete = (text) => { setMessage(text); setError(''); setStep('SUCCESS'); };
    const fail = (reason) => setError(reason?.response?.data?.message || 'Request failed. Please try again.');
    const orderMutation = useMutation({ mutationFn: (order) => api.post('/orders', order), onSuccess: () => complete('Your connection request is in. Our team will be in touch soon.'), onError: fail });
    const leadMutation = useMutation({ mutationFn: (lead) => api.post('/leads', lead), onSuccess: () => complete('Thanks. We have noted your interest and will update you when service reaches your area.'), onError: fail });
    const callbackMutation = useMutation({ mutationFn: (callback) => api.post('/callbacks', callback), onSuccess: () => complete('Callback requested. A sales agent will contact you shortly.'), onError: fail });
    const pending = orderMutation.isPending || leadMutation.isPending || callbackMutation.isPending;
    const reset = () => { setStep('MENU'); setCity(''); setSelectedArea(''); setSelectedPkg(''); setFormData(emptyForm); setMessage(''); setError(''); };
    const updateForm = (event) => setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    const inputClass = 'chat-input';

    return <div className="chat-launcher">
        {!isOpen ? <button className="chat-trigger" onClick={() => setIsOpen(true)} aria-label="Open connection assistant"><MessageCircle size={22} /><span>Need a hand?</span></button> :
            <section className="chat-panel" aria-label="Northline connection assistant">
                <header className="chat-header"><div><span className="chat-status-dot" /><strong>Northline Assistant</strong><small>Here to help you connect</small></div><button className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close assistant"><X size={18} /></button></header>
                <div className="chat-content">
                    {step === 'MENU' && <><p className="chat-intro">What can we help you with today?</p><button className="chat-option" onClick={() => setStep('PACKAGES')}><span>Browse internet plans</span><ArrowRight size={16} /></button><button className="chat-option" onClick={() => setStep('CITY_SELECT')}><span>Request a new connection</span><ArrowRight size={16} /></button><button className="chat-option" onClick={() => setStep('CALLBACK')}><span>Talk to a sales agent</span><ArrowRight size={16} /></button></>}
                    {step === 'PACKAGES' && <><p className="chat-intro">Plans available now</p>{packages.map((pkg) => <div className="chat-plan" key={pkg._id}><span><strong>{pkg.name}</strong><small>{pkg.speed}</small></span><b>৳{pkg.price}<small>/month</small></b></div>)}{packages.length === 0 && <p className="muted">No active plans are available yet.</p>}<button className="text-action" onClick={reset}><ArrowLeft size={14} /> Main menu</button></>}
                    {step === 'CITY_SELECT' && <><p className="chat-intro">Choose your city</p>{['Dhaka', 'Chattogram'].map((name) => <button className="chat-option" key={name} onClick={() => { setCity(name); setStep('AREA_SELECT'); }}>{name}<ArrowRight size={16} /></button>)}<button className="chat-option" onClick={() => { setCity(''); setStep('CUSTOM_AREA'); }}>Another city<ArrowRight size={16} /></button><button className="text-action" onClick={reset}><ArrowLeft size={14} /> Main menu</button></>}
                    {step === 'AREA_SELECT' && <><p className="chat-intro">Select an area in {city}</p>{areas.filter((area) => area.city === city).map((area) => <button className="chat-option" key={area._id} onClick={() => { setSelectedArea(area.areaName); setStep('ORDER_FORM'); }}>{area.areaName}<ArrowRight size={16} /></button>)}<button className="chat-option" onClick={() => setStep('CUSTOM_AREA')}>My area is not listed<ArrowRight size={16} /></button><button className="text-action" onClick={() => setStep('CITY_SELECT')}><ArrowLeft size={14} /> Change city</button></>}
                    {step === 'CUSTOM_AREA' && <form className="chat-form" onSubmit={(event) => { event.preventDefault(); leadMutation.mutate({ customerName: formData.name, phone: formData.phone, city, areaName: selectedArea }); }}><p className="chat-intro">Tell us where you need service</p><input className={inputClass} name="area" placeholder="Area name" required value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} /><input className={inputClass} name="name" placeholder="Your name" required value={formData.name} onChange={updateForm} /><input className={inputClass} name="phone" type="tel" placeholder="Phone number" required value={formData.phone} onChange={updateForm} /><button className="button button-dark full-width" disabled={pending}>{pending && <LoaderCircle className="spin" size={16} />}Send interest</button></form>}
                    {step === 'ORDER_FORM' && <form className="chat-form" onSubmit={(event) => { event.preventDefault(); orderMutation.mutate({ customerName: formData.name, phone: formData.phone, address: formData.address, city, area: selectedArea, packageId: selectedPkg }); }}><p className="chat-location">{city} / {selectedArea}</p><select className={inputClass} required value={selectedPkg} onChange={(event) => setSelectedPkg(event.target.value)}><option value="">Choose a plan</option>{packages.map((pkg) => <option key={pkg._id} value={pkg._id}>{pkg.name} · {pkg.speed} · ৳{pkg.price}</option>)}</select><input className={inputClass} name="name" placeholder="Full name" required value={formData.name} onChange={updateForm} /><input className={inputClass} name="phone" type="tel" placeholder="Phone number" required value={formData.phone} onChange={updateForm} /><textarea className={inputClass} name="address" placeholder="Full installation address" required value={formData.address} onChange={updateForm} /><button className="button button-dark full-width" disabled={pending}>{pending && <LoaderCircle className="spin" size={16} />}Request connection</button></form>}
                    {step === 'CALLBACK' && <form className="chat-form" onSubmit={(event) => { event.preventDefault(); callbackMutation.mutate({ customerName: formData.name, phone: formData.phone }); }}><p className="chat-intro">Leave your details and we’ll call you back.</p><input className={inputClass} name="name" placeholder="Your name" required value={formData.name} onChange={updateForm} /><input className={inputClass} name="phone" type="tel" placeholder="Phone number" required value={formData.phone} onChange={updateForm} /><button className="button button-dark full-width" disabled={pending}>{pending && <LoaderCircle className="spin" size={16} />}Request a callback</button></form>}
                    {step === 'SUCCESS' && <div className="chat-success"><span>✓</span><h3>Request received</h3><p>{message}</p><button className="button button-dark full-width" onClick={reset}>Start again</button></div>}
                    {error && <p className="form-error" role="alert">{error}</p>}
                </div>
            </section>}
    </div>;
}
