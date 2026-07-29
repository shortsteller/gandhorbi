import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight, MessageCircle, ChevronDown, Sparkles } from 'lucide-react';
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
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileCollectionsExpanded, setMobileCollectionsExpanded] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDesktopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Collections', id: 'collections', hasDropdown: true },
    { name: 'About', id: 'about' },
    { name: 'Events', id: 'events' },
    { name: 'Contact Us', id: 'contact' }
  ];

  const isHeroOverlay = currentPage === 'home' && !isScrolled;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9000,
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled
            ? 'rgba(255, 253, 248, 0.97)'
            : isHeroOverlay
            ? 'transparent'
            : 'var(--bg-soft-ivory)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(184, 92, 56, 0.15)'
            : isHeroOverlay
            ? '1px solid rgba(255,255,255,0.18)'
            : '1px solid var(--border-subtle)',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <div className="container" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
          
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
              setDesktopDropdownOpen(false);
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}
          >
            <img
              src="/gandhorbi-logo.png"
              alt="Gandhorbi Official Logo"
              className="brand-logo-img"
              style={{
                height: '42px',
                width: 'auto',
                maxHeight: '46px',
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
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: isHeroOverlay ? '#E5DFC9' : 'var(--primary-terracotta)',
                textTransform: 'uppercase',
                marginTop: '2px',
                display: 'block'
              }}>
                Folk Arts • Bengal Heritage
              </span>
            </div>
          </div>

          {/* Navigation Links with Collections Dropdown (Desktop Only) */}
          <nav className="desktop-nav" ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '2.2rem', position: 'relative' }}>
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.id}
                    onMouseEnter={() => setDesktopDropdownOpen(true)}
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={() => {
                        navigateTo('collections');
                        setDesktopDropdownOpen(!desktopDropdownOpen);
                      }}
                      style={{
                        fontFamily: 'var(--font-nav)',
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isHeroOverlay
                          ? isActive ? '#D4A44E' : 'rgba(255,255,255,0.9)'
                          : isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                        position: 'relative',
                        padding: '0.5rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transform: desktopDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s ease'
                        }}
                      />
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

                    {/* DESKTOP MEGA DROPDOWN MENU */}
                    {desktopDropdownOpen && (
                      <div
                        className="fade-in"
                        onMouseLeave={() => setDesktopDropdownOpen(false)}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: '-120px',
                          width: '680px',
                          backgroundColor: 'var(--bg-soft-ivory)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                          padding: '1.8rem',
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr',
                          gap: '1.8rem',
                          zIndex: 9999,
                          marginTop: '8px'
                        }}
                      >
                        {/* Left: Category List Grid */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                              Heritage Categories
                            </span>
                            <button
                              onClick={() => {
                                navigateTo('collections');
                                setDesktopDropdownOpen(false);
                              }}
                              style={{ fontSize: '0.8rem', color: 'var(--primary-terracotta)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              View All ({categories.length}) <ArrowRight size={12} />
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                            {categories.map((cat) => (
                              <div
                                key={cat.id}
                                onClick={() => {
                                  navigateTo('collections', cat.name);
                                  setDesktopDropdownOpen(false);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.7rem',
                                  padding: '0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  cursor: 'pointer',
                                  transition: 'var(--transition-fast)',
                                  backgroundColor: 'var(--bg-warm-linen)'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-soft-sage)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-warm-linen)')}
                              >
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  style={{ width: '38px', height: '38px', borderRadius: '4px', objectFit: 'cover' }}
                                />
                                <div>
                                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-charcoal)', display: 'block', lineHeight: 1.2 }}>
                                    {cat.name}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-warm-grey)' }}>
                                    {cat.count} Items
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right: Featured Craft Highlight Card */}
                        <div style={{
                          backgroundColor: 'var(--bg-warm-linen)',
                          borderRadius: 'var(--radius-md)',
                          padding: '1.2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-subtle)'
                        }}>
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                              Atelier Spotlight
                            </span>
                            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginTop: '4px', color: 'var(--text-charcoal)' }}>
                              Nakshi Kantha Sarees
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-warm-grey)', marginTop: '6px', lineHeight: 1.5 }}>
                              Hand-stitched over 4 months by master rural craftswomen of Bengal.
                            </p>
                          </div>
                          
                          <button
                            onClick={() => {
                              navigateTo('collections', 'Kantha Sarees');
                              setDesktopDropdownOpen(false);
                            }}
                            className="btn-primary"
                            style={{ padding: '0.55rem 1rem', fontSize: '0.78rem', marginTop: '1rem', justifyContent: 'center' }}
                          >
                            Explore Sarees <ArrowRight size={14} />
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              }

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            
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
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-hamburger-btn"
              aria-label="Toggle Mobile Navigation Menu"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isHeroOverlay ? 'rgba(0,0,0,0.35)' : 'var(--bg-warm-linen)',
                border: isHeroOverlay ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--border-subtle)',
                color: isHeroOverlay ? '#ffffff' : 'var(--primary-terracotta)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MOBILE HAMBURGER MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-fullscreen-drawer">
          
          {/* Mobile Drawer Top Header Bar */}
          <div
            style={{
              height: '76px',
              padding: '0 1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-warm-linen)',
              borderBottom: '1px solid var(--border-subtle)',
              flexShrink: 0
            }}
          >
            <div
              onClick={() => {
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <img
                src="/gandhorbi-logo.png"
                alt="Gandhorbi Official Logo"
                style={{ height: '40px', width: 'auto', borderRadius: 'var(--radius-sm)' }}
              />
              <div>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--text-charcoal)',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  display: 'block'
                }}>
                  Gandhorbi
                </span>
                <span style={{
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: 'var(--primary-terracotta)',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                  display: 'block'
                }}>
                  Folk Arts • Bengal
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Mobile Menu"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-soft-ivory)',
                color: 'var(--primary-terracotta)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Drawer Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              
              {/* Search Trigger Bar */}
              <div
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                style={{
                  backgroundColor: 'var(--bg-warm-linen)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
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

              {/* Main Navigation Pages with Mobile Accordion Dropdown for Collections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                  Explore Pages
                </span>
                
                {navLinks.map((link) => {
                  const isActive = currentPage === link.id;

                  if (link.id === 'collections') {
                    return (
                      <div key={link.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.7rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isActive ? 'var(--bg-warm-linen)' : 'transparent'
                          }}
                        >
                          <button
                            onClick={() => {
                              navigateTo('collections');
                              setMobileMenuOpen(false);
                            }}
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '1.55rem',
                              color: isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                              fontWeight: isActive ? 700 : 500,
                              textAlign: 'left'
                            }}
                          >
                            Collections
                          </button>
                          
                          <button
                            onClick={() => setMobileCollectionsExpanded(!mobileCollectionsExpanded)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-warm-linen)',
                              color: 'var(--primary-terracotta)',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <span>Categories</span>
                            <ChevronDown
                              size={16}
                              style={{
                                transform: mobileCollectionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                              }}
                            />
                          </button>
                        </div>

                        {/* ACCORDION DROPDOWN CATEGORIES LIST */}
                        {mobileCollectionsExpanded && (
                          <div
                            className="fade-in"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.4rem',
                              paddingLeft: '1.2rem',
                              paddingTop: '0.5rem',
                              paddingBottom: '0.5rem',
                              borderLeft: '2px solid var(--primary-terracotta)',
                              marginTop: '0.4rem',
                              marginBottom: '0.4rem'
                            }}
                          >
                            {categories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  navigateTo('collections', cat.name);
                                  setMobileMenuOpen(false);
                                }}
                                style={{
                                  textAlign: 'left',
                                  padding: '0.5rem 0.8rem',
                                  fontSize: '0.98rem',
                                  color: 'var(--text-charcoal)',
                                  fontFamily: 'var(--font-nav)',
                                  fontWeight: 500,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <span>• {cat.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600 }}>
                                  {cat.count} items
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

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
                        fontSize: '1.55rem',
                        color: isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                        fontWeight: isActive ? 700 : 500,
                        padding: '0.7rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isActive ? 'var(--bg-warm-linen)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <span>{link.name}</span>
                      {isActive && <ArrowRight size={20} color="var(--primary-terracotta)" />}
                    </button>
                  );
                })}
              </div>

              {/* Quick Category Shortcuts */}
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '0.8rem' }}>
                  Popular Heritage Categories
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateTo('collections', cat.name);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        backgroundColor: 'var(--bg-warm-linen)',
                        border: '1px solid var(--border-subtle)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
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

            {/* Bottom Actions inside Mobile Drawer */}
            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsUserAccountOpen(true);
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.75rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <User size={16} /> My Account
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.75rem', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <Heart size={16} /> Wishlist ({wishlist.length})
                </button>
              </div>

              <a
                href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20am%20browsing%20from%20mobile%20and%20need%20assistance."
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
                style={{ padding: '0.85rem', fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <MessageCircle size={18} /> Chat with Concierge
              </a>
            </div>

          </div>

        </div>
      )}

      {/* RESPONSIVE CSS MEDIA QUERIES */}
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
            height: 36px !important;
          }
        }
      `}</style>
    </>
  );
};
