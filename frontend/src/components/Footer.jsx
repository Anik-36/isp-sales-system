import { Link } from 'react-router-dom';
import { Radio } from 'lucide-react';

export default function Footer() {
    return <footer className="site-footer"><div className="footer-inner"><Link to="/" className="brand"><span className="brand-mark"><Radio size={18} /></span><span>Northline<span className="brand-light"> Fiber</span></span></Link><span>Reliable connections, built for everyday life.</span><span>Dhaka · Chattogram</span></div></footer>;
}
