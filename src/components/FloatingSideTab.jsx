import React from 'react';
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from './SocialIcons';

export const FloatingSideTab = () => {
  return (
    <div
      className="floating-side-contact-panel"
      aria-label="Floating Quick Contact Panel"
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8500,
        backgroundColor: 'var(--primary-terracotta)',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: '0 4px 20px rgba(43, 43, 43, 0.28)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(212, 164, 78, 0.35)',
        borderLeft: 'none'
      }}
    >
      {/* Section 1 (Top): WhatsApp */}
      <a
        href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20am%20interested%20in%20your%20handcrafted%20collection."
        target="_blank"
        rel="noreferrer"
        className="side-tab-button"
        title="Chat on WhatsApp (+91 6291261549)"
        aria-label="WhatsApp Contact"
      >
        <WhatsAppIcon size={20} color="#FFFDF8" />
      </a>

      {/* Thin divider line */}
      <div className="side-tab-divider" />

      {/* Section 2 (Middle): Facebook */}
      <a
        href="https://facebook.com/gandhorbifolkarts"
        target="_blank"
        rel="noreferrer"
        className="side-tab-button"
        title="Official Facebook Page"
        aria-label="Facebook Page"
      >
        <FacebookIcon size={20} color="#FFFDF8" />
      </a>

      {/* Thin divider line */}
      <div className="side-tab-divider" />

      {/* Section 3 (Bottom): Instagram */}
      <a
        href="https://instagram.com/gandhorbifolkarts"
        target="_blank"
        rel="noreferrer"
        className="side-tab-button"
        title="Official Instagram Page"
        aria-label="Instagram Page"
      >
        <InstagramIcon size={20} color="#FFFDF8" />
      </a>

      {/* Responsive Styles */}
      <style>{`
        .side-tab-button {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFDF8;
          transition: var(--transition-fast);
          text-decoration: none;
        }
        .side-tab-button:hover {
          background-color: var(--primary-terracotta-hover);
        }
        .side-tab-button:hover svg {
          transform: scale(1.15);
          transition: transform 0.2s ease;
        }
        .side-tab-divider {
          width: 100%;
          height: 1px;
          background-color: rgba(255, 253, 248, 0.25);
        }
        @media (max-width: 768px) {
          .side-tab-button {
            width: 38px;
            height: 38px;
          }
          .side-tab-button svg {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </div>
  );
};
