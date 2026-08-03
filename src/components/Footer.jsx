import React from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon } from './SocialIcons';

export const Footer = () => {
  const { navigateTo } = useShop();

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
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}
            >
              <img
                src="/gandhorbi-logo.png"
                alt="Gandhorbi Official Logo"
                style={{
                  height: '48px',
                  width: 'auto',
                  maxHeight: '52px',
                  objectFit: 'contain',
                  borderRadius: 'var(--radius-sm)'
                }}
              />
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
              A premier Bengali heritage brand dedicated to preserving centuries-old royal craftsmanship—handcrafted Nakshi Kantha textiles, ancient Dokra sculptures, and traditional wooden artifacts.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a
                href="https://www.instagram.com/folkartsgandhorbi/"
                target="_blank"
                rel="noopener noreferrer"
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
                href="https://www.facebook.com/gandhorbi.folkarts.2025"
                target="_blank"
                rel="noopener noreferrer"
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
                'Kantha Dupattas',
                'Traditional Kantha Creations',
                'Dokra Art',
                'Wooden Crafts',
                'Designer Dhotis',
                'Exclusive Designer Punjabis',
                'Exclusive Apparels for Men & Women',
                'Home Decor'
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

          {/* Contact Atelier */}
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: '#D5D5D5' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary-terracotta)', marginTop: '3px', flexShrink: 0 }} />
                <span>11/25G, Jheel Rd, Newland, Jadavpur, Kolkata, West Bengal 700075</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Phone size={18} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                <a href="tel:+916291261549" style={{ color: 'inherit' }}>+91 6291261549</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <Mail size={18} style={{ color: 'var(--primary-terracotta)', flexShrink: 0 }} />
                <a href="mailto:gandhorbifolkarts@gmail.com" style={{ color: 'inherit' }}>gandhorbifolkarts@gmail.com</a>
              </div>
            </div>
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
