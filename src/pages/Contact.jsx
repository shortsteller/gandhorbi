import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from '../components/SocialIcons';

export const Contact = () => {
  const { showToast } = useShop();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent! Our atelier concierge will get back to you shortly.");
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="fade-in" style={{ paddingTop: '110px', paddingBottom: '5rem', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Atelier Concierge
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginTop: '4px' }}>
            Connect with Gandhorbi
          </h1>
          <p style={{ color: 'var(--text-warm-grey)', marginTop: '0.8rem', maxWidth: '600px', margin: '0.8rem auto 0 auto' }}>
            We welcome patrons, curators, and craft enthusiasts to visit our Ballygunge studio or get in touch directly.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: LEFT DETAILS & FORM / RIGHT GOOGLE MAP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          alignItems: 'start'
        }}>
          
          {/* LEFT SIDE: BUSINESS INFORMATION & CONTACT FORM */}
          <div>
            
            {/* Info Cards */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-charcoal)', marginBottom: '1.2rem' }}>
                Atelier Location & Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.95rem' }}>
                
                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <MapPin size={20} style={{ color: 'var(--primary-terracotta)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Atelier Address:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '2px', lineHeight: 1.5 }}>
                      14/B Heritage Crafts Avenue, Ballygunge, Kolkata, West Bengal 700019, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Phone size={20} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Phone / Call Center:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                      <a href="tel:+916291261549" style={{ color: 'inherit', fontWeight: 600 }}>+91 6291261549</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <Mail size={20} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Email Desk:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                      <a href="mailto:info@gandhorbifolkarts.com" style={{ color: 'inherit' }}>info@gandhorbifolkarts.com</a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <Clock size={20} style={{ color: 'var(--primary-terracotta)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Studio Hours:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                      Monday – Saturday: 10:00 AM – 8:00 PM IST<br />
                      Sunday: 11:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct WhatsApp CTA */}
              <div style={{ marginTop: '1.8rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)' }}>
                <a
                  href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20collections."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <MessageCircle size={20} /> Chat Directly on WhatsApp (+91 6291261549)
                </a>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-charcoal)', marginBottom: '1.2rem' }}>
                Send Us an Inquiry
              </h3>

              {submitted ? (
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--bg-soft-sage)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  color: 'var(--secondary-olive)'
                }}>
                  <CheckCircle2 size={40} style={{ margin: '0 auto 0.8rem auto' }} />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Thank You for Writing!</h4>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>We have received your message and will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@domain.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Subject</label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', outline: 'none', backgroundColor: '#ffffff' }}
                    >
                      <option value="General Inquiry">General Craft Inquiry</option>
                      <option value="Custom Order">Custom Kantha Saree / Dhoti Order</option>
                      <option value="Bulk / Export">Bulk Architectural Dokra Order</option>
                      <option value="Exhibition RSVP">Exhibition & Workshop Registration</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can our master craftsmen assist you today?"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', outline: 'none', fontFamily: 'var(--font-body)' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: EMBEDDED GOOGLE MAP */}
          <div style={{
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            height: '100%',
            minHeight: '550px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '1rem 1rem 1.2rem 1.rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Kolkata Heritage Location
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-charcoal)', marginTop: '2px' }}>
                Visit Ballygunge Atelier
              </h3>
            </div>

            {/* Embedded Google Map iframe */}
            <div style={{ flex: 1, borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: '480px' }}>
              <iframe
                title="Gandhorbi Folk Arts Ballygunge Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14741.054452179836!2d88.35824905!3d22.53181825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276e18f2d56a3%3A0xb304b50c0b9d997!2sBallygunge%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '480px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
