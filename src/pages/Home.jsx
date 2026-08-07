import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Award, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { subscribeToCategoryCovers } from '../services/categoryCovers';

export const Home = () => {
  const { products, navigateTo } = useShop();

  const trendingProducts = products.filter((p) => p.trending).slice(0, 8);

  const mobileHeroImages = [
    '/gandhorbi-mobile-hero-1.jpg',
    '/gandhorbi-mobile-hero-2.jpg',
    '/gandhorbi-mobile-hero-3.jpg'
  ];

  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [coversMap, setCoversMap]                 = useState({});

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveMobileSlide((prev) => (prev + 1) % mobileHeroImages.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, []);

  // Real-time Firestore subscription to categoryCovers
  useEffect(() => {
    const unsub = subscribeToCategoryCovers((data) => {
      setCoversMap(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="fade-in">
      
      {/* DESKTOP & TABLET HERO BANNER */}
      <section
        className="desktop-hero-banner"
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxHeight: 'calc(100vh - 76px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          color: '#ffffff',
          backgroundImage: 'linear-gradient(to top, rgba(15, 12, 10, 0.88) 0%, rgba(15, 12, 10, 0.2) 32%, rgba(15, 12, 10, 0) 65%), url("/gandhorbi-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '60px',
          paddingBottom: '3.5rem',
          boxSizing: 'border-box'
        }}
      >
        <div className="container" style={{ textAlign: 'center', zIndex: 2, padding: '0 1rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.2rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => navigateTo('collections')}
              className="hero-btn-gold"
              style={{
                background: 'linear-gradient(135deg, #E2B755 0%, #D4A44E 50%, #B85C38 100%)',
                color: '#12141D',
                padding: '0.95rem 2.4rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-btn)',
                fontWeight: 700,
                fontSize: '0.98rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'var(--transition-smooth)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 30px rgba(212, 164, 78, 0.4)',
                border: '1px solid #F5D77F'
              }}
            >
              Shop Now <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('shop-categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigateTo('collections');
              }}
              className="hero-btn-outline"
              style={{
                backgroundColor: 'rgba(20, 16, 12, 0.68)',
                color: '#F7F4EE',
                border: '1.5px solid #D4A44E',
                padding: '0.95rem 2.3rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-btn)',
                fontWeight: 600,
                fontSize: '0.98rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'var(--transition-smooth)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                backdropFilter: 'blur(4px)'
              }}
            >
              Explore Categories
            </button>
          </div>
        </div>
      </section>

      {/* MOBILE HERO BANNER (APPLIES ONLY ON SCREEN SIZES < 769px) */}
      <section
        className="mobile-hero-banner"
        style={{
          position: 'relative',
          width: '100%',
          height: 'calc(100vw + 1cm)',
          maxHeight: 'calc(100vh - 20px)',
          overflow: 'hidden',
          backgroundColor: '#14100C'
        }}
      >
        {mobileHeroImages.map((imgUrl, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: activeMobileSlide === index ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              backgroundImage: `linear-gradient(to top, rgba(15, 12, 10, 0.92) 0%, rgba(15, 12, 10, 0.35) 45%, rgba(15, 12, 10, 0.15) 100%), url("${imgUrl}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}

        <div
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: 0,
            right: 0,
            zIndex: 3,
            padding: '0 1.25rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {mobileHeroImages.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: activeMobileSlide === idx ? '22px' : '7px',
                  height: '7px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: activeMobileSlide === idx ? '#D4A44E' : 'rgba(255, 255, 255, 0.45)',
                  transition: 'all 0.4s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '320px' }}>
            <button
              onClick={() => navigateTo('collections')}
              className="mobile-cta-btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #E2B755 0%, #D4A44E 50%, #B85C38 100%)',
                color: '#12141D',
                padding: '0.9rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-btn)',
                fontWeight: 700,
                fontSize: '0.92rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 6px 20px rgba(212, 164, 78, 0.4)',
                border: '1px solid #F5D77F'
              }}
            >
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* BRAND VALUES BANNER */}
      <section className="ethos-ticker-section" style={{ backgroundColor: 'var(--bg-soft-ivory)', borderBottom: '1px solid var(--border-subtle)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award size={36} color="var(--primary-terracotta)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '2px' }}>100% Authentic Handcrafts</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>Directly sourced from Bengali rural master artisans</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ShieldCheck size={36} color="var(--primary-terracotta)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '2px' }}>Insured Worldwide Shipping</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>Carefully packaged heritage heirlooms delivered safely</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <HeartHandshake size={36} color="var(--primary-terracotta)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '2px' }}>Artisan Welfare Support</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>Fair living wages & direct community empowerment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORIES SECTION */}
      <section id="shop-categories" style={{ paddingTop: '1.5rem', paddingBottom: '3.5rem', backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: 0 }}>
              Shop by Categories
            </h2>
            <p style={{ color: 'var(--text-warm-grey)', marginTop: '0.75rem', maxWidth: '700px', margin: '0.75rem auto 0 auto' }}>
              Discover our signature collections of Artisanal Home decor, kantha and other artisanal Handicrafts and Designer apparels for men and women
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.8rem'
          }}>
            {categories.map((cat) => {
              const coverUrl = coversMap[cat.id]?.image?.url || null;

              return (
                <div
                  key={cat.id}
                  onClick={() => navigateTo('collections', cat.name)}
                  className="heritage-card"
                  style={{
                    cursor: 'pointer',
                    height: '340px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background Image / Clean Placeholder */}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={cat.name}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, var(--bg-soft-ivory) 0%, var(--bg-warm-linen) 60%, #E2D7C3 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        textAlign: 'center'
                      }}
                    >
                      <Sparkles size={36} color="var(--primary-terracotta)" style={{ opacity: 0.6, marginBottom: '0.75rem' }} />
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--text-charcoal)', margin: 0 }}>
                        {cat.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-warm-grey)', marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Heritage Collection
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay & Details */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: coverUrl
                      ? 'linear-gradient(to top, rgba(43,43,43,0.88) 0%, rgba(43,43,43,0.1) 60%)'
                      : 'linear-gradient(to top, rgba(43,43,43,0.75) 0%, rgba(43,43,43,0) 60%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      color: '#ffffff',
                      lineHeight: 1.2
                    }}>
                      {cat.name}
                    </h3>
                    {cat.name === 'Traditional Kantha Creations' && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 253, 248, 0.85)',
                        marginTop: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        Kantha O Kahini
                      </p>
                    )}
                    {cat.name === 'Home Decor' && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255, 253, 248, 0.85)',
                        marginTop: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        Dokra • Wooden Crafts • Others
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* TRENDING PRODUCTS SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Curated Selection
              </span>
              <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '4px' }}>
                Trending Products
              </h2>
            </div>
            <button
              onClick={() => navigateTo('collections')}
              className="btn-secondary"
            >
              View All Products <ArrowRight size={16} />
            </button>
          </div>

          {/* Product Grid */}
          <div className="product-cards-grid">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* MEDIA QUERIES FOR MOBILE HERO REDESIGN */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-hero-banner {
            display: flex !important;
          }
          .mobile-hero-banner {
            display: none !important;
          }
          .ethos-ticker-section {
            display: block !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-hero-banner {
            display: none !important;
          }
          .mobile-hero-banner {
            display: block !important;
          }
          .ethos-ticker-section {
            display: none !important;
          }
          .mobile-cta-btn-primary:active {
            transform: scale(0.97);
          }
          .mobile-cta-btn-secondary:active {
            transform: scale(0.97);
          }
        }
      `}</style>

    </div>
  );
};
