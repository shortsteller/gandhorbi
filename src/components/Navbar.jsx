import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { categories } from '../data/categories';

const marqueeCategories = [
  'Kantha Sarees',
  'Kantha Dupattas',
  'Kantha Creations',
  'Dokra Art',
  'Wooden Crafts',
  'Designer Dhotis',
  'Punjabi Wear',
  'Exclusive Apparel'
];

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

  const handleSearchClick = () => {
    // Navigate to Collections page and focus the existing search bar
    navigateTo('/collections?focus=search');
    setMobileMenuOpen(false);
  };

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

  // Lock background scrolling when mobile menu drawer is open
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
    { name: 'Contact Us', id: 'contact' },
    { name: 'Admin', id: 'admin' }
  ];

  const isHeroOverlay = currentPage === 'home' && !isScrolled;

  // Tripled array for seamless infinite marquee scrolling
  const marqueeItems = [...marqueeCategories, ...marqueeCategories, ...marqueeCategories];

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
        {/* PREMIUM STICKY CATEGORY MARQUEE BAR ABOVE NAVIGATION */}
        <div className="category-marquee-wrapper">
          <div className="category-marquee-track">
            {marqueeItems.map((cat, idx) => (
              <span
                key={idx}
                className="marquee-item"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('collections', cat);
                }}
                title={`Explore ${cat} Collection`}
              >
                <span className="marquee-cat-name">{cat}</span>
                <span className="marquee-dot-separator">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* MAIN NAVIGATION BAR */}
        <div className="container navbar-container" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem' }}>
          
          {/* Brand Logo & Name */}
          <div
            onClick={() => {
              navigateTo('home');
              setMobileMenuOpen(false);
              setDesktopDropdownOpen(false);
            }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
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
              <span className="brand-title-text" style={{
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

          {/* Navigation Links with Desktop Dropdown */}
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
          <div className="navbar-actions-group" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
            
            {/* Search Button — navigates to Collections page and focuses the existing search bar */}
            <button
              onClick={handleSearchClick}
              aria-label="Search Products"
              className="nav-action-icon-btn"
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
              className="nav-action-icon-btn"
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
              className="nav-action-icon-btn"
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
              className="desktop-nav-icon nav-action-icon-btn"
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
                marginLeft: '4px',
                flexShrink: 0
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* OFF-CANVAS SLIDE-IN MOBILE NAVIGATION DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <>
          {/* Semi-transparent dark backdrop */}
          <div
            className="mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Off-Canvas Drawer (75-85% width, max-width ~360px) */}
          <div className="mobile-drawer-content">
            
            {/* Drawer Fixed Header */}
            <div
              style={{
                height: '76px',
                padding: '0 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-warm-linen)',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
                width: '100%',
                boxSizing: 'border-box'
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
                  style={{ height: '38px', width: 'auto', borderRadius: 'var(--radius-sm)' }}
                />
                <div>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: 'var(--text-charcoal)',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    whiteSpace: 'nowrap'
                  }}>
                    Gandhorbi
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-nav)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    color: 'var(--primary-terracotta)',
                    textTransform: 'uppercase',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    display: 'block'
                  }}>
                    Folk Arts • Bengal
                  </span>
                </div>
              </div>

              {/* Close (X) Button Fixed at Top-Right Inside Drawer */}
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Mobile Navigation Drawer"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-soft-ivory)',
                  color: 'var(--primary-terracotta)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  flexShrink: 0
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Scrollable Body Container */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '1.4rem 1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
              <div>
                
                {/* 1. Main Navigation Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.8rem', width: '100%' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem', display: 'block' }}>
                    Navigation
                  </span>

                  {navLinks.map((link) => {
                    const isActive = currentPage === link.id;

                    if (link.id === 'collections') {
                      return (
                        <div key={link.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.7rem 0.8rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: isActive ? 'var(--bg-warm-linen)' : 'transparent',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                          >
                            <button
                              onClick={() => {
                                navigateTo('collections');
                                setMobileMenuOpen(false);
                              }}
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.35rem',
                                color: isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                                fontWeight: isActive ? 700 : 600,
                                textAlign: 'left',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Collections
                            </button>
                            
                            <button
                              onClick={() => setMobileCollectionsExpanded(!mobileCollectionsExpanded)}
                              aria-label="Toggle Categories Dropdown"
                              style={{
                                padding: '4px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--bg-warm-linen)',
                                color: 'var(--primary-terracotta)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                flexShrink: 0
                              }}
                            >
                              <span>Items</span>
                              <ChevronDown
                                size={14}
                                style={{
                                  transform: mobileCollectionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.3s ease'
                                }}
                              />
                            </button>
                          </div>

                          {/* Accordion Categories List */}
                          {mobileCollectionsExpanded && (
                            <div
                              className="fade-in"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.3rem',
                                paddingLeft: '1rem',
                                paddingTop: '0.4rem',
                                paddingBottom: '0.4rem',
                                borderLeft: '2px solid var(--primary-terracotta)',
                                marginTop: '0.3rem',
                                marginBottom: '0.3rem'
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
                                    padding: '0.45rem 0.6rem',
                                    fontSize: '0.92rem',
                                    color: 'var(--text-charcoal)',
                                    fontFamily: 'var(--font-nav)',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  <span>• {cat.name}</span>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--primary-terracotta)', fontWeight: 600 }}>
                                    {cat.count}
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
                          fontSize: '1.35rem',
                          color: isActive ? 'var(--primary-terracotta)' : 'var(--text-charcoal)',
                          fontWeight: isActive ? 700 : 600,
                          padding: '0.7rem 0.8rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isActive ? 'var(--bg-warm-linen)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          whiteSpace: 'nowrap',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <span>{link.name}</span>
                        {isActive && <ArrowRight size={18} color="var(--primary-terracotta)" />}
                      </button>
                    );
                  })}
                </div>

                {/* Divider Line */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '1.2rem 0' }} />

                {/* 2. Utility Actions Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.3rem', display: 'block' }}>
                    Quick Actions
                  </span>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.7rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-warm-linen)',
                      color: 'var(--text-charcoal)',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 500,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <Search size={18} color="var(--primary-terracotta)" />
                    <span>Search Products</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-warm-linen)',
                      color: 'var(--text-charcoal)',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 500,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <Heart size={18} color="#E63946" />
                      <span>Wishlist</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span style={{ backgroundColor: 'var(--primary-terracotta)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                        {wishlist.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.7rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-warm-linen)',
                      color: 'var(--text-charcoal)',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 500,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <ShoppingBag size={18} color="var(--primary-terracotta)" />
                      <span>Shopping Cart</span>
                    </div>
                    {totalCartCount > 0 && (
                      <span style={{ backgroundColor: 'var(--primary-terracotta)', color: '#fff', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                        {totalCartCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsUserAccountOpen(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      padding: '0.7rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-warm-linen)',
                      color: 'var(--text-charcoal)',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-nav)',
                      fontWeight: 500,
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  >
                    <User size={18} color="var(--primary-terracotta)" />
                    <span>Login / Account</span>
                  </button>
                </div>

              </div>

              {/* Bottom Direct WhatsApp Concierge CTA */}
              <div style={{ paddingTop: '1.2rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <a
                  href="https://wa.me/916291261549?text=Hello%20Gandhorbi%20Folk%20Arts%2C%20I%20am%20browsing%20from%20mobile%20and%20need%20assistance."
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                  style={{ padding: '0.75rem', fontSize: '0.88rem', textDecoration: 'none' }}
                >
                  <MessageCircle size={18} /> Chat with Concierge
                </a>
              </div>

            </div>

          </div>
        </>
      )}

      {/* RESPONSIVE CSS MEDIA QUERIES FOR NAVBAR */}
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
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 0.6rem !important;
          }
          .navbar-actions-group {
            gap: 0.15rem !important;
            flex-shrink: 0 !important;
          }
          .nav-action-icon-btn {
            padding: 5px !important;
          }
          .brand-logo-img {
            height: 34px !important;
          }
          .brand-title-text {
            font-size: 1.2rem !important;
          }
          .mobile-hamburger-btn {
            padding: 6px 8px !important;
            margin-left: 2px !important;
            flex-shrink: 0 !important;
            min-width: 36px !important;
            height: 36px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
        @media (max-width: 380px) {
          .navbar-container {
            padding: 0 0.4rem !important;
          }
          .navbar-actions-group {
            gap: 0.1rem !important;
          }
          .nav-action-icon-btn {
            padding: 4px !important;
          }
          .brand-title-text {
            font-size: 1.08rem !important;
          }
          .brand-logo-img {
            height: 32px !important;
          }
          .brand-tagline {
            display: none !important;
          }
        }
        @media (max-width: 520px) {
          .brand-tagline {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
