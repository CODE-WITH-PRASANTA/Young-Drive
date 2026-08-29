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

// =====================================================
// CONTACT COMPONENT
// =====================================================

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE FORM SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    alert('Thank you! Your message has been sent.');

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="contact-page">

      {/* =====================================================
          1. HERO HEADER
      ====================================================== */}

      <section className="contact-hero">
        <div className="contact-hero__container">

          <div className="contact-hero__text">
            <h1 className="contact-hero__title">
              CONTACT{' '}
              <span className="contact-hero__title-accent">
                US
              </span>
            </h1>

            <p className="contact-hero__subtitle">
              Get in touch with Young Drives
            </p>
          </div>

          <div className="contact-hero__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80"
              alt="Young Drives Luxury Car"
              className="contact-hero__image"
            />
          </div>

        </div>
      </section>


      {/* =====================================================
          2. MAIN CONTENT - INFO + FORM
      ====================================================== */}

      <section className="contact-content">
        <div className="contact-content__container">

          {/* =================================================
              LEFT PANEL - COMPANY INFORMATION
          ================================================= */}

          <div className="contact-card contact-info">

            <h2 className="contact-card__title">
              YOUNG DRIVES
            </h2>

            <div className="contact-card__divider" />

            <div className="contact-info__list">

              {/* ADDRESS */}
              <div className="contact-info__item">

                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <MapPin size={20} />
                </div>

                <div className="contact-info__details">

                  <h3 className="contact-info__label">
                    Address
                  </h3>

                  <p className="contact-info__text">
                    Plot No: 001, CRP Square<br />
                    Vanik Road, Back Side of Ama Bus Stand<br />
                    751011, Bhubaneswar, Odisha
                  </p>

                </div>

              </div>


              {/* PHONE */}
              <div className="contact-info__item">

                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Phone size={20} />
                </div>

                <div className="contact-info__details">

                  <h3 className="contact-info__label">
                    Phone
                  </h3>

                  <p className="contact-info__text">
                    +91 90784 55208
                  </p>

                </div>

              </div>


              {/* EMAIL */}
              <div className="contact-info__item">

                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Mail size={20} />
                </div>

                <div className="contact-info__details">

                  <h3 className="contact-info__label">
                    Email
                  </h3>

                  <p className="contact-info__text">
                    support@youngdrives.com
                  </p>

                </div>

              </div>


              {/* WORKING HOURS */}
              <div className="contact-info__item">

                <div className="contact-info__icon-box contact-info__icon-box--blue">
                  <Clock size={20} />
                </div>

                <div className="contact-info__details">

                  <h3 className="contact-info__label">
                    Working Hours
                  </h3>

                  <p className="contact-info__text">
                    Mon – Sun<br />
                    24/7 Support
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT PANEL - CONTACT FORM
          ================================================= */}

          <div className="contact-card contact-form">

            <h2 className="contact-card__title">
              SEND US A MESSAGE
            </h2>

            <div className="contact-card__divider" />

            <form
              onSubmit={handleSubmit}
              className="contact-form__body"
            >

              {/* FULL NAME */}
              <div className="contact-form__field">

                <User
                  size={18}
                  className="contact-form__icon"
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* EMAIL */}
              <div className="contact-form__field">

                <AtSign
                  size={18}
                  className="contact-form__icon"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* PHONE */}
              <div className="contact-form__field">

                <Smartphone
                  size={18}
                  className="contact-form__icon"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />

              </div>


              {/* SUBJECT */}
              <div className="contact-form__field">

                <FileText
                  size={18}
                  className="contact-form__icon"
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                />

              </div>


              {/* MESSAGE */}
              <div className="contact-form__field contact-form__field--textarea">

                <MessageSquare
                  size={18}
                  className="contact-form__icon"
                />

                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="contact-form__btn"
              >
                <Send size={16} />
                <span>SEND MESSAGE</span>
              </button>

            </form>

          </div>

        </div>
      </section>


      {/* =====================================================
          3. MAP SECTION
      ====================================================== */}

      <section className="contact-map">

        <div className="contact-map__container">

          <div className="contact-map__wrapper">

            <iframe
              title="Young Drives Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59885.111867184285!2d85.78926210000001!3d20.2960587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa8%3A0xfc580e2b68b33fa8!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="280"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          4. GET IN TOUCH - CALL & WHATSAPP
      ====================================================== */}

      <section className="contact-social">

        <div className="contact-social__container">

          {/* HEADING */}

          <h3 className="contact-social__title">
            GET IN TOUCH
          </h3>

          <div className="contact-social__divider" />

          <p className="contact-social__subtitle">
            Have questions or need assistance? We’re just a call
            or message away.
            <br />
            Connect with Young Drives today!
          </p>


          {/* =================================================
              CALL + WHATSAPP
          ================================================= */}

          <div className="contact-social__grid contact-social__grid--actions">

            {/* =================================================
                CALL US
            ================================================= */}

            <a
              href="tel:+919078455208"
              className="contact-social-action contact-social-action--call"
            >

              <div className="contact-social-action__icon">

                <PhoneCall size={42} strokeWidth={2.2} />

              </div>

              <h4 className="contact-social-action__title">
                Call Us
              </h4>

              <p className="contact-social-action__number">
                +91 90784 55208
              </p>

            </a>


            {/* =================================================
                WHATSAPP
            ================================================= */}

            <a
              href="https://wa.me/919078455208"
              target="_blank"
              rel="noreferrer"
              className="contact-social-action contact-social-action--whatsapp"
            >

              <div className="contact-social-action__icon">

                <MessageCircle
                  size={42}
                  strokeWidth={2.2}
                />

              </div>

              <h4 className="contact-social-action__title">
                WhatsApp
              </h4>

              <p className="contact-social-action__number">
                +91 90784 55208
              </p>

            </a>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Contact;