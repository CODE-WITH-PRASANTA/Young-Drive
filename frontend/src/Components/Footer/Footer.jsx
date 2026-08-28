import React from 'react';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import logoImg from '../../assets/Young Drives Logo (1).png';
import './Footer.css';

// SVG Icons for Social Media
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const footerNavSections = [
  {
    title: 'Car Rental Services',
    links: [
      { name: 'Self Drive Car Rental', path: '/services/self-drive' },
      { name: 'Car Rental with Driver', path: '/services/chauffeur-drive' },
      { name: 'Airport Pickup & Drop', path: '/services/airport-transfer' },
      { name: 'Wedding & Luxury Cars', path: '/services/wedding-cars' },
      { name: 'EV Car Hire Bhubaneswar', path: '/services/ev-rental' },
      { name: 'Outstation Tour Packages', path: '/services/outstation' },
    ],
  },
  {
    title: 'Featured Fleets',
    links: [
      { name: 'Hatchbacks (Swift, Baleno)', path: '/fleet/hatchback' },
      { name: 'Sedans (Dzire, Verna)', path: '/fleet/sedan' },
      { name: 'SUVs (Thar, Scorpio, Creta)', path: '/fleet/suv' },
      { name: '7 Seaters (Innova, Ertiga)', path: '/fleet/7-seater' },
      { name: 'EV Rentals (Nexon EV)', path: '/fleet/ev' },
      { name: 'Tariff & Rental Plans', path: '/pricing' },
    ],
  },
  {
    title: 'Help & Policy',
    links: [
      { name: 'About Young Drives', path: '/about' },
      { name: 'Rental Terms & Conditions', path: '/terms' },
      { name: 'Refund & Security Policy', path: '/refund-policy' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Rental FAQs', path: '/faq' },
      { name: 'Customer Testimonials', path: '/reviews' },
    ],
  },
];

const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
  { icon: LinkedinIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
];

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="footer" itemScope itemType="https://schema.org/AutoRental">
      {/* Decorative Accent Glow */}
      <div className="footer__glow-sphere" />

      <div className="footer__container">
        
        {/* Top Grid Area */}
        <div className="footer__grid">
          
          {/* Brand & Local SEO Column */}
          <div className="footer__brand-col">
            <a href="/" className="footer__logo">
              <img src={logoImg} alt="Young Drives Car Rental Logo" className="footer__logo-img" />
            </a>

            <p className="footer__description">
              <strong itemProp="name">Young Drives</strong> is Bhubaneswar’s trusted car rental service offering well-maintained self-drive cars, chauffeured fleets, EV rentals, and airport taxis across Odisha at transparent pricing.
            </p>

            <address className="footer__contact-info">
              <div className="footer__contact-item">
                <MapPin size={17} className="footer__contact-icon" />
                <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="streetAddress">Plot No. 001, CRP Square, Vanik Road, Back Side of Ama Bus Stand</span>,{' '}
                  <span itemProp="addressLocality">Bhubaneswar</span>,{' '}
                  <span itemProp="addressRegion">Odisha</span>, India
                </span>
              </div>

              <div className="footer__contact-item">
                <Phone size={17} className="footer__contact-icon" />
                <a href="tel:+919078455208" className="footer__contact-link" itemProp="telephone">
                  +91 90784 55208
                </a>
              </div>

              <div className="footer__contact-item">
                <Mail size={17} className="footer__contact-icon" />
                <a href="mailto:booking@youngdrives.com" className="footer__contact-link" itemProp="email">
                  booking@youngdrives.com
                </a>
              </div>

              <div className="footer__contact-item">
                <Clock size={17} className="footer__contact-icon" />
                <span>Available 24/7 for Car Bookings</span>
              </div>
            </address>
          </div>

          {/* Quick Links Columns */}
          {footerNavSections.map((section, idx) => (
            <div key={idx} className="footer__nav-col">
              <h4 className="footer__col-title">{section.title}</h4>
              <ul className="footer__link-list">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="footer__link-item">
                    <a href={link.path} className="footer__link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="footer__newsletter-col">
            <h4 className="footer__col-title">Rental Offers</h4>
            <p className="footer__newsletter-desc">
              Subscribe to get exclusive road trip discounts, coupon codes, and weekend offers.
            </p>
            
            <form className="footer__newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="footer__input-wrapper">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="footer__newsletter-input"
                  required
                />
                <button type="submit" className="footer__newsletter-btn" aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </div>
            </form>

            <div className="footer__trust-card">
              <ShieldCheck size={18} className="footer__trust-icon" />
              <span>100% Verified Fleet & Zero Hidden Charges</span>
            </div>
          </div>

        </div>

        {/* SEO Keywords Tag Cloud */}
        <div className="footer__seo-tags">
          <span className="footer__seo-title">
            <Sparkles size={14} className="footer__seo-icon" /> Popular Searches:
          </span>
          <div className="footer__tags-list">
            <a href="/services/self-drive">Self Drive Car Bhubaneswar</a>
            <a href="/services/airport-transfer">Bhubaneswar Airport Taxi</a>
            <a href="/fleet/suv">Mahindra Thar on Rent</a>
            <a href="/fleet/7-seater">Innova Crysta Rental</a>
            <a href="/services/wedding-cars">Wedding Luxury Car Odisha</a>
            <a href="/services/ev-rental">Electric Car Hire</a>
            <a href="/services/outstation">Puri Konark Sightseeing Cabs</a>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="footer__divider" />

        {/* Bottom Copyright & Social Area */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} <strong>Young Drives</strong>. All rights reserved. Designed & Developed by{' '}
            <span className="footer__creator">PR WEBSTOCK</span>.
          </p>

          <div className="footer__socials">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-btn"
                  aria-label={social.label}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;