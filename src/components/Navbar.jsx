import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Heart, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';

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
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          ? 'rgba(255, 253, 248, 0.95)'
          : isHeroOverlay
          ? 'transparent'
          : 'var(--bg-soft-ivory)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        borderBottom: isScrolled
          ? '1px solid rgba(184, 92, 56, 0.12)'
          : isHeroOverlay
          ? '1px solid rgba(255,255,255,0.15)'
          : '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ height: '85px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo & Name */}
        <div
          onClick={() => navigateTo('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
        >
          <img
            src="/gandhorbi-logo.png"
            alt="Gandhorbi Official Logo"
            style={{
              height: '46px',
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
              fontSize: '1.6rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              textTransform: 'uppercase',
              lineHeight: 1
            }}>
              Gandhorbi
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'var(--font-nav)',
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              color: isHeroOverlay ? '#E5DFC9' : 'var(--primary-terracotta)',
              textTransform: 'uppercase',
              marginTop: '2px'
            }}>
              Folk Arts • Bengal Heritage
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
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

        {/* Right Icon Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          
          {/* Search */}
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

          {/* Wishlist */}
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

          {/* Shopping Cart */}
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

          {/* User Account / Login */}
          <button
            onClick={() => setIsUserAccountOpen(true)}
            aria-label="User Account"
            style={{
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
          >
            <User size={22} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle Navigation Menu"
            style={{
              padding: '8px',
              color: isHeroOverlay ? '#ffffff' : 'var(--text-charcoal)',
              display: 'none'
            }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-soft-ivory)',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  navigateTo(link.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  color: currentPage === link.id ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                  fontWeight: currentPage === link.id ? 700 : 500
                }}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
