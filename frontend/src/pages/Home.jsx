import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, Gamepad2, Headphones, LockKeyhole, Router, Signal, Wifi, Zap } from 'lucide-react';
import api from '../api/axiosInstance';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=88',
        alt: 'Family using fast home internet for work and learning',
        eyebrow: 'MADE FOR EVERY MOMENT',
        title: <>Bring every<br /><em>moment online.</em></>,
        description: 'Work, learn, stream and play with dependable fiber from Circle Network.',
    },
    {
        image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=2000&q=88',
        alt: 'Friends enjoying online gaming together',
        eyebrow: 'LOW LATENCY. BIG WINS.',
        title: <>Game without<br /><em>the lag.</em></>,
        description: 'A steady connection that keeps your team in sync and your play uninterrupted.',
    },
    {
        image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=88',
        alt: 'Team collaborating remotely over a reliable internet connection',
        eyebrow: 'YOUR WORK, IN FULL FLOW',
        title: <>More done.<br /><em>Less waiting.</em></>,
        description: 'Reliable home internet for video calls, big uploads, and all the tabs in between.',
    },
];

const fallbackPackages = [
    { _id: '', name: 'Circle Home 70', speed: '70 Mbps', price: 999 },
    { _id: '', name: 'Streaming Pro 100', speed: '100 Mbps', price: 1260 },
    { _id: '', name: 'Power User 150', speed: '150 Mbps', price: 1500 },
    { _id: '', name: 'Gamer Ultra 200', speed: '200 Mbps', price: 2000 },
];

const packageFeatures = [
    ['Best ping for gaming', 'Bufferless HD video', 'Unlimited browsing', '24/7 customer support', 'Free installation (T&C apply)'],
    ['Smooth streaming and gaming', 'Bufferless 2K video', 'Unlimited browsing', '24/7 customer support', 'Free installation (T&C apply)'],
    ['Ultra-low latency', 'Bufferless 4K streaming', 'Unlimited browsing', '24/7 customer support', 'Free installation (T&C apply)'],
    ['Power gaming performance', 'Bufferless 4K streaming', 'Unlimited browsing', '24/7 customer support', 'Free installation (T&C apply)'],
];

const advantages = [
    { icon: Headphones, title: 'Local help, always close', description: 'Real support from people who know your neighborhood and are ready to help.' },
    { icon: Gamepad2, title: 'Lag-free gaming', description: 'Consistent speeds and responsive routing for a smoother online game.' },
    { icon: Signal, title: 'A connection you can trust', description: 'Stable fiber built for busy homes, multiple devices, and everyday streaming.' },
    { icon: Zap, title: 'Powerful internet', description: 'The speed for work, learning, entertainment, and everything happening at once.' },
    { icon: LockKeyhole, title: 'Safer browsing', description: 'A reliable connection backed by a team that takes your service seriously.' },
    { icon: Router, title: 'Fiber to your home', description: 'Modern fiber service designed to keep your home connected at full speed.' },
];

function choosePlan(packageId) {
    window.dispatchEvent(new CustomEvent('open-connection-chat', { detail: { packageId } }));
}

export default function Home() {
    const [activeSlide, setActiveSlide] = useState(0);
    const { data: packages = [], isLoading, isError } = useQuery({
        queryKey: ['packages'],
        queryFn: async () => (await api.get('/packages')).data,
    });
    const activePackages = packages.filter((pkg) => pkg.isActive !== false).slice(0, 4);
    const featuredPackages = isError ? fallbackPackages : activePackages;

    useEffect(() => {
        const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % slides.length), 5500);
        return () => window.clearInterval(timer);
    }, []);

    const moveSlide = (direction) => setActiveSlide((current) => (current + direction + slides.length) % slides.length);
    const slide = slides[activeSlide];

    return <main className="circle-home">
        <section className="circle-hero" aria-label="Circle Network internet services">
            {slides.map((item, index) => <img className={`circle-hero-image${index === activeSlide ? ' is-active' : ''}`} key={item.image} src={item.image} alt={item.alt} />)}
            <div className="circle-hero-shade" />
            <div className="circle-hero-copy" key={activeSlide}>
                <span className="circle-kicker"><span /> {slide.eyebrow}</span>
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <div className="circle-hero-actions"><a className="circle-button circle-button-gold" href="#packages">Explore packages <ArrowRight size={17} /></a><a className="circle-hero-secondary" href="#advantages">Why Circle Network?</a></div>
            </div>
            <div className="circle-hero-control">
                <span className="circle-slide-count">0{activeSlide + 1}<i />0{slides.length}</span>
                <div className="circle-slide-dots" aria-label="Choose hero slide">{slides.map((item, index) => <button key={item.image} className={index === activeSlide ? 'is-active' : ''} onClick={() => setActiveSlide(index)} aria-label={`Show slide ${index + 1}`} />)}</div>
                <div className="circle-slide-arrows"><button onClick={() => moveSlide(-1)} aria-label="Previous slide"><ArrowLeft size={17} /></button><button onClick={() => moveSlide(1)} aria-label="Next slide"><ArrowRight size={17} /></button></div>
            </div>
            <span className="circle-hero-brand">CIRCLE NETWORK <b>BD</b></span>
        </section>

        <section className="circle-packages" id="packages">
            <div className="circle-section-heading"><span className="circle-section-tag">INTERNET PACKAGES</span><h2>Find your speed.<br /><em>Feel the difference.</em></h2><p>Powerful fiber packages for streaming, gaming, working, and everything your home does online.</p></div>
            {isLoading ? <div className="circle-package-state">Loading Circle Network packages…</div> : featuredPackages.length === 0 ? <div className="circle-package-state">No active packages are available right now.</div> : <>{isError && <p className="circle-package-warning">Featured plans are shown below. Live availability is confirmed when you request service.</p>}<div className="circle-package-grid">{featuredPackages.map((pkg, index) => <article className={`circle-package-card${index === 0 || index === 3 ? ' is-featured' : ''}`} key={pkg._id || pkg.name}>
                <div className="circle-package-ribbon">{index === 0 ? <><Zap size={13} fill="currentColor" /> MOST POPULAR</> : index === 1 ? 'STREAMING PRO' : index === 2 ? 'POWER USER' : <><Zap size={13} fill="currentColor" /> GAMER’S CHOICE</>}</div>
                <div className="circle-speed"><strong>{pkg.speed.match(/[0-9]+/)?.[0] || pkg.speed}</strong><span>{pkg.speed.match(/[a-zA-Z]+/)?.[0] || 'Mbps'}</span><small><Zap size={12} /> OPTICAL FIBER</small></div>
                <p className="circle-package-fit">{['Ideal for multiple devices', 'Great for streaming and gaming', 'Maximum performance', 'Pro gaming & heavy use'][index]}</p>
                <div className="circle-price"><strong>৳{Number(pkg.price).toLocaleString()}</strong><span>/month</span></div>
                <span className="circle-install"><Check size={13} /> FREE Installation (T&C apply)</span>
                <ul>{(packageFeatures[index] || packageFeatures[1]).map((feature) => <li key={feature}><span><Check size={12} /></span>{feature}</li>)}</ul>
                <button className="circle-package-cta" onClick={() => choosePlan(pkg._id || undefined)}>{['Choose Popular', 'Stream Pro', 'Upgrade Now', 'Go Ultra'][index]} <ArrowRight size={16} /></button>
            </article>)}</div></>}
            <div className="circle-package-footnote">All packages are subject to coverage availability and technical feasibility.</div>
        </section>

        <section className="circle-advantages" id="advantages">
            <div className="circle-section-heading"><span className="circle-section-tag">CORE ADVANTAGES</span><h2>Why choose <em>Circle Network?</em></h2><p>We connect Bangladesh with dependable fiber and helpful local service.</p></div>
            <div className="circle-advantage-grid">{advantages.map(({ icon: Icon, title, description }, index) => <article className={`circle-advantage${index === 0 || index === 5 ? ' is-highlighted' : ''}`} key={title}><span className="circle-advantage-icon"><Icon size={20} /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
        </section>
    </main>;
}