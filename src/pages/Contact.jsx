import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export const Contact = () => {
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
            We welcome patrons, curators, and craft enthusiasts to visit our Jadavpur studio or get in touch directly.
          </p>
        </div>

        {/* 2-COLUMN LAYOUT: LEFT DETAILS & RIGHT GOOGLE MAP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          alignItems: 'stretch'
        }}>
          
          {/* LEFT SIDE: BUSINESS INFORMATION */}
          <div style={{
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-charcoal)', marginBottom: '1.5rem' }}>
                Atelier Location & Contact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', fontSize: '1rem' }}>
                
                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <MapPin size={22} style={{ color: 'var(--primary-terracotta)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Atelier Address:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '3px', lineHeight: 1.6 }}>
                      11/25G, Jheel Rd, Newland, Jadavpur, Kolkata, West Bengal 700075
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <Phone size={22} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Phone / Call Center:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '3px' }}>
                      <a href="tel:+916291261549" style={{ color: 'inherit', fontWeight: 600 }}>+91 6291261549</a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <Mail size={22} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Email Desk:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '3px' }}>
                      <a href="mailto:gandhorbifolkarts@gmail.com" style={{ color: 'inherit', fontWeight: 600 }}>gandhorbifolkarts@gmail.com</a>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                  <Clock size={22} style={{ color: 'var(--primary-terracotta)', flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Studio Hours:</strong>
                    <p style={{ color: 'var(--text-warm-grey)', marginTop: '3px', lineHeight: 1.5 }}>
                      Monday – Saturday: 10:00 AM – 8:00 PM IST<br />
                      Sunday: 11:00 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <a
                href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20would%20like%20to%20inquire%20about%20your%20handcrafted%20collections."
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
              >
                <MessageCircle size={20} /> Chat Directly on WhatsApp (+91 6291261549)
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: EMBEDDED GOOGLE MAP WITH EXACT COORDINATES */}
          <div style={{
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '0.5rem 0.5rem 1rem 0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Kolkata Heritage Location (22°29'59.2"N 88°22'29.4"E)
              </span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-charcoal)', marginTop: '2px' }}>
                Visit Jadavpur Atelier
              </h3>
            </div>

            {/* Embedded Google Map iframe focused on 22°29'59.2"N 88°22'29.4"E */}
            <div style={{ flex: 1, borderRadius: 'var(--radius-md)', overflow: 'hidden', minHeight: '400px' }}>
              <iframe
                title="Gandhorbi Folk Arts Jadavpur Location"
                src="https://maps.google.com/maps?q=22.499778,88.374833&hl=en&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
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
