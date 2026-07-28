import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles, MapPin, Phone, Mail, ArrowRight, Check } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer = () => {
  const { navigateTo, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      showToast("Thank you for subscribing to Gandhorbi Folk Arts Gazette!");
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--text-charcoal)',
        color: '#F7F4EE',
        paddingTop: '5rem',
        paddingBottom: '2.5rem',
        borderTop: '3px solid var(--highlight-mustard)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem'
          }}
        >
          {/* Brand Column */}
          <div>
            <div
              onClick={() => navigateTo('home')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Sparkles size={18} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.7rem',
                fontWeight: 700,
                color: '#FFFDF8',
                letterSpacing: '0.04em'
              }}>
                Gandhorbi Folk Arts
              </span>
            </div>
            
            <p style={{
              color: '#D5D5D5',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: '1.5rem'
            }}>
              A premier Bengali heritage brand dedicated to preserving centuries-old royal craftsmanship—handcrafted Nakshi Kantha textiles, ancient Dokra lost-wax bronze sculptures, and traditional wooden artifacts.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--highlight-mustard)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--highlight-mustard)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <FacebookIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              color: 'var(--highlight-mustard)',
              marginBottom: '1.2rem',
              letterSpacing: '0.05em'
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                { label: 'Home Page', id: 'home' },
                { label: 'Browse Collections', id: 'collections' },
                { label: 'Our Story & Heritage', id: 'about' },
                { label: 'Upcoming Exhibitions', id: 'events' },
                { label: 'Contact Us', id: 'contact' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigateTo(item.id)}
                    style={{
                      color: '#D5D5D5',
                      fontSize: '0.95rem',
                      transition: 'var(--transition-fast)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-terracotta)'}
                    onMouseLeave={(e) => e.target.style.color = '#D5D5D5'}
                  >
                    <ArrowRight size={14} style={{ color: 'var(--highlight-mustard)' }} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              color: 'var(--highlight-mustard)',
              marginBottom: '1.2rem',
              letterSpacing: '0.05em'
            }}>
              Heritage Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {[
                'Kantha Sarees',
                'Kantha Dupattas',
                'Kantha Creations',
                'Dokra Art',
                'Wooden Crafts',
                'Designer Dhotis',
                'Punjabi Wear',
                'Exclusive Apparel'
              ].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigateTo('collections', cat)}
                    style={{
                      color: '#D5D5D5',
                      fontSize: '0.95rem',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-terracotta)'}
                    onMouseLeave={(e) => e.target.style.color = '#D5D5D5'}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Gazette */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.3rem',
              color: 'var(--highlight-mustard)',
              marginBottom: '1.2rem',
              letterSpacing: '0.05em'
            }}>
              Contact Atelier
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem', fontSize: '0.95rem', color: '#D5D5D5' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-terracotta)', marginTop: '3px', flexShrink: 0 }} />
                <span>14/B Heritage Crafts Avenue, Ballygunge, Kolkata, West Bengal 700019, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Phone size={18} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                <a href="tel:+916291261549" style={{ color: 'inherit' }}>+91 6291261549</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Mail size={18} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                <a href="mailto:info@gandhorbifolkarts.com" style={{ color: 'inherit' }}>info@gandhorbifolkarts.com</a>
              </div>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.75rem 1.2rem' }}
              >
                {subscribed ? <Check size={18} /> : 'Subscribe'}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#A0A0A0'
          }}
        >
          <p>© 2026 Gandhorbi Folk Arts. All Rights Reserved. Handcrafted in Bengal.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Artisan Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
