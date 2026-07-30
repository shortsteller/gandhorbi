import React from 'react';
import { WhatsAppIcon, FacebookIcon, InstagramIcon } from './SocialIcons';

export const FloatingSideTab = () => {
  return (
    <div
      className="floating-side-contact-panel"
      aria-label="Floating Official Quick Contact Panel"
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 8500,
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderLeft: 'none'
      }}
    >
      {/* Section 1 (Top): Official WhatsApp (Green #25D366) */}
      <a
        href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20am%20interested%20in%20your%20handcrafted%20collection."
        target="_blank"
        rel="noreferrer"
        className="side-tab-btn side-tab-whatsapp"
        title="Chat on WhatsApp (+91 6291261549)"
        aria-label="WhatsApp Contact"
      >
        <WhatsAppIcon size={22} color="#ffffff" />
      </a>

      {/* Thin divider line */}
      <div className="side-tab-divider" />

      {/* Section 2 (Middle): Official Facebook (Blue #1877F2) */}
      <a
        href="https://facebook.com/gandhorbifolkarts"
        target="_blank"
        rel="noreferrer"
        className="side-tab-btn side-tab-facebook"
        title="Official Facebook Page"
        aria-label="Facebook Page"
      >
        <FacebookIcon size={22} color="#ffffff" />
      </a>

      {/* Thin divider line */}
      <div className="side-tab-divider" />

      {/* Section 3 (Bottom): Official Instagram (Gradient #E4405F) */}
      <a
        href="https://instagram.com/gandhorbifolkarts"
        target="_blank"
        rel="noreferrer"
        className="side-tab-btn side-tab-instagram"
        title="Official Instagram Page"
        aria-label="Instagram Page"
      >
        <InstagramIcon size={22} color="#ffffff" />
      </a>

      {/* Official Brand Logo & Color Styles */}
      <style>{`
        .side-tab-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: transform 0.2s ease, filter 0.2s ease;
          text-decoration: none;
        }

        .side-tab-whatsapp {
          background-color: #25D366 !important;
        }

        .side-tab-facebook {
          background-color: #1877F2 !important;
        }

        .side-tab-instagram {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%) !important;
        }

        .side-tab-btn:hover {
          filter: brightness(1.1);
        }

        .side-tab-btn:hover svg {
          transform: scale(1.18);
          transition: transform 0.2s ease;
        }

        .side-tab-divider {
          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.35);
        }

        @media (max-width: 768px) {
          .side-tab-btn {
            width: 38px;
            height: 38px;
          }
          .side-tab-btn svg {
            width: 19px;
            height: 19px;
          }
        }
      `}</style>
    </div>
  );
};
