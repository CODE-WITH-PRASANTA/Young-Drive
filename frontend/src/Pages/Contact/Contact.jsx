import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  AtSign,
  Smartphone,
  FileText,
  MessageSquare,
  PhoneCall,
  MessageCircle,
  Navigation,
} from 'lucide-react';
import './Contact.css';

// SVG Brand Icons to avoid external library conflicts
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XTwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been sent.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* ---------------- 1. HERO HEADER ---------------- */}
      <section className="contact-hero">
        <div className="contact-hero__container">
          <div className="contact-hero__text">
            <h1 className="contact-hero__title">
              CONTACT <span className="contact-hero__title-accent">US</span>
            </h1>
            <p className="contact-hero__subtitle">
              Get in touch with our support team
            </p>
          </div>
          <div className="contact-hero__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
              alt="White Luxury Sedan"
              className="contact-hero__image"
            />
          </div>
        </div>
      </section>

      {/* ---------------- 2. MAIN CONTENT (INFO + FORM) ---------------- */}
      <section className="contact-content">
        <div className="contact-content__container">
          {/* Left Panel: Get in Touch */}
          <div className="contact-card contact-info">
            <h2 className="contact-card__title">GET IN TOUCH</h2>
            <div className="contact-card__divider" />

            <div className="contact-info__list">
              <div className="contact-info__item">
                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <MapPin size={20} />
                </div>
                <div className="contact-info__details">
                  <h3 className="contact-info__label">Address</h3>
                  <p className="contact-info__text">
                    Bhubaneswar, Odisha<br />India - 751024
                  </p>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Phone size={20} />
                </div>
                <div className="contact-info__details">
                  <h3 className="contact-info__label">Phone</h3>
                  <p className="contact-info__text">+91 98765 43210</p>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Mail size={20} />
                </div>
                <div className="contact-info__details">
                  <h3 className="contact-info__label">Email</h3>
                  <p className="contact-info__text">support@vehicleapp.com</p>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Clock size={20} />
                </div>
                <div className="contact-info__details">
                  <h3 className="contact-info__label">Working Hours</h3>
                  <p className="contact-info__text">
                    Mon – Sun<br />24/7 Support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Send Us a Message Form */}
          <div className="contact-card contact-form">
            <h2 className="contact-card__title">SEND US A MESSAGE</h2>
            <div className="contact-card__divider" />

            <form onSubmit={handleSubmit} className="contact-form__body">
              <div className="contact-form__field">
                <User size={18} className="contact-form__icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form__field">
                <AtSign size={18} className="contact-form__icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form__field">
                <Smartphone size={18} className="contact-form__icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form__field">
                <FileText size={18} className="contact-form__icon" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-form__field contact-form__field--textarea">
                <MessageSquare size={18} className="contact-form__icon" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="contact-form__btn">
                <Send size={16} />
                <span>SEND MESSAGE</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------------- 3. MAP SECTION ---------------- */}
      <section className="contact-map">
        <div className="contact-map__container">
          <div className="contact-map__wrapper">
            <iframe
              title="AutoDrive Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59885.111867184285!2d85.78926210000001!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ---------------- 4. QUICK ACTIONS ---------------- */}
      <section className="contact-actions">
        <div className="contact-actions__container">
          <a href="tel:+919876543210" className="contact-action-card">
            <div className="contact-action-card__icon-box contact-action-card__icon-box--blue">
              <PhoneCall size={22} />
            </div>
            <div className="contact-action-card__text">
              <h4 className="contact-action-card__title">Call Us</h4>
              <p className="contact-action-card__sub">+91 98765 43210</p>
            </div>
          </a>

          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="contact-action-card">
            <div className="contact-action-card__icon-box contact-action-card__icon-box--green">
              <MessageCircle size={22} />
            </div>
            <div className="contact-action-card__text">
              <h4 className="contact-action-card__title">WhatsApp</h4>
              <p className="contact-action-card__sub">Chat with us</p>
            </div>
          </a>

          <a href="mailto:support@vehicleapp.com" className="contact-action-card">
            <div className="contact-action-card__icon-box contact-action-card__icon-box--purple">
              <Mail size={22} />
            </div>
            <div className="contact-action-card__text">
              <h4 className="contact-action-card__title">Email Us</h4>
              <p className="contact-action-card__sub">support@vehicleapp.com</p>
            </div>
          </a>

          <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="contact-action-card">
            <div className="contact-action-card__icon-box contact-action-card__icon-box--orange">
              <Navigation size={22} />
            </div>
            <div className="contact-action-card__text">
              <h4 className="contact-action-card__title">Navigate</h4>
              <p className="contact-action-card__sub">Get Directions</p>
            </div>
          </a>
        </div>
      </section>

      {/* ---------------- 5. SOCIAL MEDIA ---------------- */}
      <section className="contact-social">
        <div className="contact-social__container">
          <h3 className="contact-social__title">FOLLOW US</h3>
          <div className="contact-social__divider" />

          <div className="contact-social__grid">
            <a href="#facebook" className="social-item">
              <div className="social-item__btn social-item__btn--facebook">
                <FacebookIcon />
              </div>
              <span className="social-item__label">Facebook</span>
            </a>

            <a href="#instagram" className="social-item">
              <div className="social-item__btn social-item__btn--instagram">
                <InstagramIcon />
              </div>
              <span className="social-item__label">Instagram</span>
            </a>

            <a href="#linkedin" className="social-item">
              <div className="social-item__btn social-item__btn--linkedin">
                <LinkedinIcon />
              </div>
              <span className="social-item__label">LinkedIn</span>
            </a>

            <a href="#twitter" className="social-item">
              <div className="social-item__btn social-item__btn--twitter">
                <XTwitterIcon />
              </div>
              <span className="social-item__label">X (Twitter)</span>
            </a>

            <a href="#youtube" className="social-item">
              <div className="social-item__btn social-item__btn--youtube">
                <YoutubeIcon />
              </div>
              <span className="social-item__label">YouTube</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;