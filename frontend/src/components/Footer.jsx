import { Link } from 'react-router-dom';
import { ArrowUpRight, CreditCard, Mail, MapPin, Phone, Radio } from 'lucide-react';

const paymentMethods = [
    { name: 'VISA', className: 'visa' },
    { name: 'Mastercard', className: 'mastercard' },
    { name: 'AMERICAN EXPRESS', className: 'amex' },
    { name: 'BRAC BANK', className: 'brac' },
    { name: 'DBBL NEXUS', className: 'nexus' },
    { name: 'Citytouch', className: 'citytouch' },
    { name: 'Bank Asia', className: 'bank-asia' },
    { name: 'Islami Bank', className: 'islami' },
    { name: 'AB Bank', className: 'ab-bank' },
    { name: 'City Bank', className: 'city-bank' },
    { name: 'Fastcash', className: 'fastcash' },
    { name: 'MTB', className: 'mtb' },
    { name: 'bKash', className: 'bkash' },
    { name: 'MTB CASH', className: 'mtb-cash' },
    { name: 'MyCash', className: 'mycash' },
    { name: 'Nagad', className: 'nagad' },
    { name: 'Rocket', className: 'rocket' },
    { name: 'Upay', className: 'upay' },
    { name: 'Tap', className: 'tap' },
    { name: 'SureCash', className: 'surecash' },
];

export default function Footer() {
    return <footer className="circle-footer">
        <div className="circle-footer-main">
            <div className="circle-footer-about">
                <Link to="/" className="circle-footer-brand"><span className="circle-footer-mark"><Radio size={19} /></span><span>Circle <b>Network</b><small>Connected to the world.</small></span></Link>
                <p>Premium nationwide connectivity for modern homes and forward-thinking businesses.</p>
                <a href="tel:16237"><Phone size={15} /> 16237</a>
                <a href="mailto:support@circlenetworkbd.net"><Mail size={15} /> support@circlenetworkbd.net</a>
                <span><MapPin size={15} /> Dhaka, Bangladesh</span>
            </div>
            <div className="circle-footer-links"><h3>COMPANY</h3><a href="#advantages">Why Circle Network</a><a href="#packages">Our packages</a><a href="mailto:support@circlenetworkbd.net">Contact us</a></div>
            <div className="circle-footer-links"><h3>SERVICES</h3><Link to="/packages">Home internet</Link><a href="#packages">Fiber packages</a><a href="mailto:support@circlenetworkbd.net">Coverage availability</a></div>
            <div className="circle-footer-links"><h3>ACCOUNT</h3><Link to="/agent/login">Sales agent sign in <ArrowUpRight size={13} /></Link><Link to="/admin/login">Admin sign in <ArrowUpRight size={13} /></Link><a href="mailto:support@circlenetworkbd.net">Customer support</a></div>
        </div>
        <div className="circle-payment-strip">
            <span className="circle-payment-label"><CreditCard size={15} /> Pay with</span>
            <div className="circle-payment-methods">{paymentMethods.map((method) => <span className={`payment-method ${method.className}`} key={method.className}>{method.name}</span>)}</div>
            <span className="sslcommerz-verified"><small>Verified by</small><strong>SSLCommerz</strong></span>
        </div>
        <div className="circle-footer-bottom"><span>© {new Date().getFullYear()} Circle Network BD. All rights reserved.</span><span>Reliable fiber. Connected Bangladesh.</span></div>
    </footer>;
}