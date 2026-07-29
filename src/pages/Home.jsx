import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/categories';
import { testimonials } from '../data/testimonials';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { InstagramIcon } from '../components/SocialIcons';

export const Home = () => {
  const { products, navigateTo, setQuickViewProduct } = useShop();

  const trendingProducts = products.filter((p) => p.trending).slice(0, 8);
  const featuredProduct = products.find((p) => p.featured) || products[0];

  const mobileHeroImages = [
    '/gandhorbi-mobile-hero-1.jpg',
    '/gandhorbi-mobile-hero-2.jpg',
    '/gandhorbi-mobile-hero-3.jpg'
  ];

  const [activeMobileSlide, setActiveMobileSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveMobileSlide((prev) => (prev + 1) % mobileHeroImages.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <div className="fade-in">
      
      {/* DESKTOP & TABLET HERO BANNER (UNTOUCHED FOR DESKTOP SCREEN SIZES >= 768px) */}
      <section
        className="desktop-hero-banner"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 'calc(100vh - 76px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          color: '#ffffff',
          backgroundImage: 'linear-gradient(to top, rgba(15, 12, 10, 0.88) 0%, rgba(15, 12, 10, 0.2) 32%, rgba(15, 12, 10, 0) 65%), url("/gandhorbi-hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '80px',
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
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
            >
              Explore Collections
            </button>
          </div>
        </div>
      </section>

      {/* MOBILE ONLY HERO BANNER (STRICT 1:1 SQUARE ASPECT RATIO, DISPLAYED ONLY ON MOBILE < 768px) */}
      <section
        className="mobile-hero-banner"
        style={{
          display: 'none',
          position: 'relative',
          width: '100vw',
          height: '100vw',
          maxHeight: '520px',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          backgroundColor: '#0F0C0A',
          boxSizing: 'border-box'
        }}
      >
        {/* Mobile Background Images with Smooth Carousel Fade */}
        {mobileHeroImages.map((imgSrc, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === activeMobileSlide ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              backgroundImage: `linear-gradient(to top, rgba(12, 10, 8, 0.88) 0%, rgba(12, 10, 8, 0.25) 35%, rgba(12, 10, 8, 0) 65%), url("${imgSrc}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}

        {/* Mobile Hero Content: ONLY TWO CTA BUTTONS in Lower-Center (No Text / Badges) */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.2rem',
            left: 0,
            right: 0,
            zIndex: 3,
            padding: '0 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem'
          }}
        >
          {/* 1. Shop Now Mobile Button */}
          <button
            onClick={() => navigateTo('collections')}
            className="mobile-cta-btn-primary"
            style={{
              width: '100%',
              maxWidth: '300px',
              background: 'linear-gradient(135deg, #E2B755 0%, #D4A44E 50%, #B85C38 100%)',
              color: '#12141D',
              padding: '0.78rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-btn)',
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 6px 20px rgba(212, 164, 78, 0.45)',
              border: '1px solid #F5D77F',
              transition: 'var(--transition-fast)'
            }}
          >
            Shop Now <ArrowRight size={16} />
          </button>

          {/* 2. Explore More Collections Mobile Button */}
          <button
            onClick={() => {
              const el = document.getElementById('shop-categories');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else navigateTo('collections');
            }}
            className="mobile-cta-btn-secondary"
            style={{
              width: '100%',
              maxWidth: '300px',
              backgroundColor: 'rgba(20, 16, 12, 0.72)',
              color: '#F7F4EE',
              border: '1.5px solid #D4A44E',
              padding: '0.75rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-btn)',
              fontWeight: 600,
              fontSize: '0.88rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
              transition: 'var(--transition-fast)'
            }}
          >
            Explore More Collections
          </button>
        </div>
      </section>

      {/* BRAND ETHOS TICKER SECTION (VISIBLE ON DESKTOP/TABLET, HIDDEN ON MOBILE) */}
      <section
        className="ethos-ticker-section"
        style={{
          backgroundColor: 'var(--text-charcoal)',
          color: '#F7F4EE',
          padding: '1.5rem 0',
          borderTop: '2px solid var(--highlight-mustard)'
        }}
      >
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <Award color="var(--highlight-mustard)" size={22} />
              <span style={{ fontSize: '0.88rem', textAlign: 'left', lineHeight: 1.3 }}>500+ Rural Master Craftswomen</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <ShieldCheck color="var(--highlight-mustard)" size={22} />
              <span style={{ fontSize: '0.88rem', textAlign: 'left', lineHeight: 1.3 }}>100% Authentic Handcrafted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <HeartHandshake color="var(--highlight-mustard)" size={22} />
              <span style={{ fontSize: '0.88rem', textAlign: 'left', lineHeight: 1.3 }}>Fair Trade & Ethical Living</span>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORIES SECTION */}
      <section id="shop-categories" className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Curated Heritage
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px' }}>
              Shop by Categories
            </h2>
            <p style={{ color: 'var(--text-warm-grey)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
              Discover our signature collections of hand-stitched textiles, lost-wax bronzes, and artisanal apparel.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.8rem'
          }}>
            {categories.map((cat) => (
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
                {/* Background Image */}
                <img
                  src={cat.image}
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

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(43,43,43,0.85) 0%, rgba(43,43,43,0.1) 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem'
                }}>
                  <span style={{
                    color: 'var(--highlight-mustard)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '4px'
                  }}>
                    {cat.count} Artifacts
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    color: '#FFFDF8',
                    marginBottom: '6px'
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{ color: '#D5D5D5', fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FEATURED COLLECTIONS EDITORIAL SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-sage)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            
            {/* Image Banner */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-hover)',
                border: '1px solid var(--border-subtle)'
              }}>
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />
              </div>

              {/* Floating Badge */}
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '20px',
                backgroundColor: 'var(--bg-soft-ivory)',
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-subtle)',
                maxWidth: '220px'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Atelier Highlight
                </span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginTop: '2px' }}>
                  Royal Nakshi Kantha
                </h4>
              </div>
            </div>

            {/* Content */}
            <div>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Editorial Collection
              </span>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.8rem',
                lineHeight: 1.2,
                marginTop: '0.5rem',
                marginBottom: '1.2rem'
              }}>
                The Soul of Murshidabad: Nakshi Kantha Heritage
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Each Nakshi Kantha saree is not merely woven; it is painted with thread by rural women of Bengal. Passing down stories of lotus ponds, palanquins, and peacocks, our artisans spend up to 4 months completing a single pure silk saree.
              </p>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--primary-terracotta)' }}>100%</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>Pure Silk & Organic Threads</span>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--primary-terracotta)' }}>120+</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>Hours of Hand Stitching</span>
                </div>
              </div>

              <button
                onClick={() => setQuickViewProduct(featuredProduct)}
                className="btn-primary"
              >
                Discover Heritage Piece <ArrowRight size={18} />
              </button>
            </div>

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

      {/* TESTIMONIALS SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-ivory)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Patron Voices
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px' }}>
              Words from Connoisseurs
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="heritage-card"
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <p style={{
                  fontFamily: 'var(--font-subheading)',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'var(--text-charcoal)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem'
                }}>
                  "{test.quote}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <img
                    src={test.photo}
                    alt={test.name}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: 'var(--text-charcoal)' }}>
                      {test.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-terracotta)' }}>
                      {test.role} • {test.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INSTAGRAM GALLERY SECTION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', fontStyle: 'normal', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-terracotta)', fontWeight: 600 }}>
              <InstagramIcon size={20} /> @GandhorbiFolkArts
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '4px' }}>
              Follow Our Atelier Journey
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem'
          }}>
            {[
              "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1597983073493-88cd35cfa3d0?auto=format&fit=crop&q=80&w=600",
              "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600"
            ].map((img, idx) => (
              <div
                key={idx}
                style={{
                  height: '220px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={img}
                  alt={`Instagram Post ${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEDIA QUERIES FOR MOBILE HERO REDESIGN (DESKTOP IS 100% UNTOUCHED) */}
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
