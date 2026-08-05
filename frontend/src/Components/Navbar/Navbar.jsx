import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
// Import your logo image from assets
import logoImg from '../../assets/Young Drives Logo (1).png'; 
import './Navbar.css';

const navLinks = [
  { title: 'Home', path: '/' },
  { title: 'About Us', path: '/about' },
  { title: 'Services', path: '/services' },
  { title: 'Projects', path: '/projects' },
  { title: 'Pricing', path: '/pricing' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulated active pathname (Replace with useLocation() from react-router-dom if needed)
  const currentPath = '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="navbar__container">
        
        {/* Brand Logo */}
        <a href="/" className="navbar__logo">
          <img 
            src={logoImg} 
            alt="AuraTech Logo" 
            className="navbar__logo-img" 
          />
          <span className="navbar__logo-text">AuraTech</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar__nav">
          <ul className="navbar__menu">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <li key={link.path} className="navbar__menu-item">
                  <a
                    href={link.path}
                    className={`navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                  >
                    {link.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right Action Button (Desktop) */}
        <div className="navbar__action">
          <a href="/contact" className="navbar__contact-btn">
            <span>Contact Us</span>
            <ArrowRight className="navbar__btn-icon" size={16} />
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar__toggle-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <ul className="navbar__mobile-list">
          {navLinks.map((link) => (
            <li key={link.path} className="navbar__mobile-item">
              <a
                href={link.path}
                className="navbar__mobile-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.title}
              </a>
            </li>
          ))}
          <li className="navbar__mobile-item">
            <a
              href="/contact"
              className="navbar__mobile-contact-btn"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;