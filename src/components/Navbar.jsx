import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { categories } from '../data/categories';

export const Navbar = () => {
  const {
    currentPage,
    navigateTo,
    totalCartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsUserAccountOpen
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Collections', id: 'collections' },
    { name: 'About', id: 'about' },
    { name: 'Events', id: 'events' },
    { name: 'Contact Us', id: 'contact' }
  ];

  const isHeroOverlay = currentPage === 'home' && !isScrolled;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        transition: 'all 0.4s ease',
        backgroundColor: isScrolled
          ? 'rgba(255, 253, 248, 0.96)'
          : isHeroOverlay
          ? 'transparent'
          : 'var(--bg-soft-ivory)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        borderBottom: isScrolled
          ? '1px solid rgba(184, 92, 56, 0.15)'
          : isHeroOverlay
          ? '1px solid rgba(255,255,255,0.18)'
          : '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => {
            navigateTo('home');
            setMobileMenuOpen(false);
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}
        >
          <img
            src="/gandhorbi-logo.png"
            alt="Gandhorbi Official Logo"
            className="brand-logo-img"
            style={{
              height: '44px',
              width: 'auto',
              maxHeight: '48px',
              objectFit: 'contain',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              transition: 'var(--transition-fast)'
            }}
          />
          <div>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              textTransform: 'uppercase',
              lineHeight: 1,
              display: 'block'
            }}>
              Gandhorbi
            </span>
            <span className="brand-tagline" style={{
              fontFamily: 'var(--font-nav)',
              fontSize: '0.62rem',
              letterSpacing: '0.22em',
              color: isHeroOverlay ? '#E5DFC9' : 'var(--primary-terracotta)',
              textTransform: 'uppercase',
              marginTop: '2px',
              display: 'block'
            }}>
              Folk Arts • Bengal Heritage
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop Only) */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.2rem' }}>
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                style={{
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isHeroOverlay
                    ? isActive ? '#D4A44E' : 'rgba(255,255,255,0.9)'
                    : isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                  position: 'relative',
                  padding: '0.5rem 0',
                  transition: 'var(--transition-fast)'
                }}
              >
                {link.name}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isHeroOverlay ? '#D4A44E' : 'var(--primary-terracotta)',
                      borderRadius: '2px'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search Products"
            style={{
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
          >
            <Search size={22} />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            aria-label="Wishlist"
            style={{
              position: 'relative',
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
          >
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="badge-count">{wishlist.length}</span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            style={{
              position: 'relative',
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
          >
            <ShoppingBag size={22} />
            {totalCartCount > 0 && (
              <span className="badge-count">{totalCartCount}</span>
            )}
          </button>

          {/* User Account Button (Desktop) */}
          <button
            onClick={() => setIsUserAccountOpen(true)}
            aria-label="User Account"
            className="desktop-nav-icon"
            style={{
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
          >
            <User size={22} />
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger-btn"
            aria-label="Toggle Mobile Navigation Menu"
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: isHeroOverlay ? 'rgba(0,0,0,0.3)' : 'var(--bg-warm-linen)',
              border: isHeroOverlay ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-subtle)',
              color: isHeroOverlay ? '#ffffff' : 'var(--primary-terracotta)',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '4px'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE HAMBURGER DROPDOWN DRAWER */}
      {mobileMenuOpen && (
        <div
          className="fade-in"
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bg-soft-ivory)',
            zIndex: 999,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div>
            {/* Quick Search input trigger inside mobile drawer */}
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                setIsSearchOpen(true);
              }}
              style={{
                backgroundColor: 'var(--bg-warm-linen)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                color: 'var(--text-warm-grey)',
                fontSize: '0.95rem',
                marginBottom: '1.8rem',
                cursor: 'pointer'
              }}
            >
              <Search size={18} color="var(--primary-terracotta)" />
              <span>Search Kantha sarees, Dokra art, dhotis...</span>
            </div>

            {/* Navigation Page Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                Main Navigation
              </span>
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      navigateTo(link.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      textAlign: 'left',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      color: isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                      fontWeight: isActive ? 700 : 500,
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isActive ? 'var(--bg-warm-linen)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{link.name}</span>
                    {isActive && <ArrowRight size={18} color="var(--primary-terracotta)" />}
                  </button>
                );
              })}
            </div>

            {/* Quick Category Shortcuts */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.8rem' }}>
                Popular Categories
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigateTo('collections', cat.name);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      backgroundColor: 'var(--bg-warm-linen)',
                      border: '1px solid var(--border-subtle)',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontFamily: 'var(--font-nav)',
                      color: 'var(--text-charcoal)'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions inside Mobile Drawer */}
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsUserAccountOpen(true);
                }}
                className="btn-secondary"
                style={{ padding: '0.7rem', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <User size={16} /> My Account
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="btn-secondary"
                style={{ padding: '0.7rem', fontSize: '0.85rem', justifyContent: 'center' }}
              >
                <Heart size={16} /> Wishlist ({wishlist.length})
              </button>
            </div>

            <a
              href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20am%20browsing%20from%20mobile%20and%20need%20assistance."
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
              style={{ padding: '0.8rem', fontSize: '0.9rem', textDecoration: 'none' }}
            >
              <MessageCircle size={18} /> Chat with Concierge
            </a>
          </div>

        </div>
      )}

      {/* RESPONSIVE MEDIA QUERIES FOR NAVBAR */}
      <style>{`
        @media (max-width: 960px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-nav-icon {
            display: none !important;
          }
          .mobile-hamburger-btn {
            display: flex !important;
          }
        }
        @media (max-width: 520px) {
          .brand-tagline {
            display: none !important;
          }
          .brand-logo-img {
            height: 38px !important;
          }
        }
      `}</style>
    </header>
  );
};
