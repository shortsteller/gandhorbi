import React from 'react';
import { useShop } from '../context/ShopContext';
import { artisans } from '../data/artisans';
import { Sparkles, Heart, Compass, ShieldCheck, ArrowRight, Award, HeartHandshake } from 'lucide-react';

export const About = () => {
  const { navigateTo } = useShop();

  return (
    <div className="fade-in" style={{ paddingTop: '100px', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      
      {/* EDITORIAL HERO */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Atelier &amp; Heritage Chronicle
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15, marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-charcoal)' }}>
            Preserving Bengal's Ancestral Artistry for the Modern World
          </h1>
          <p style={{ fontFamily: 'var(--font-subheading)', fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-warm-grey)', lineHeight: 1.7 }}>
            "Gandhorbi Folk Arts was founded with a singular sacred purpose: to elevate Bengal’s rich folk traditions into timeless luxury lifestyle heirlooms while honoring the hands that create them."
          </p>
        </div>
      </section>

      {/* SECTION 1: BENGAL'S HERITAGE (ALTERNATING IMAGE / TEXT) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-sage)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Cultural Legacy
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '4px', marginBottom: '1.2rem', color: 'var(--text-charcoal)' }}>
                Bengal’s Rich Tapestry of Folk Arts
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                Bengal’s artistic legacy is deeply rooted in soil, sacred rivers, and village folklore. For centuries, Nakshi Kantha running-stitch quilts were crafted by women as poetic gifts for loved ones, capturing dreams, mythology, and everyday village scenes.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Simultaneously, in the red soil villages of Bankura and Purba Bardhaman, metal smiths practiced Dokra—an ancient lost-wax brass, bell metal, and bronze casting technique unchanged since the Indus Valley Civilization.
              </p>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)' }}>
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000"
                alt="Bengal Heritage Craft"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CRAFTSMANSHIP & ETHICS (REVERSE ALTERNATING) */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)' }}>
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000"
                alt="Master Artisan Crafting"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>

            <div>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Mastery &amp; Ethics
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '4px', marginBottom: '1.2rem', color: 'var(--text-charcoal)' }}>
                Honoring the Master Craftsperson
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                At Gandhorbi Folk Arts, every piece is authentic and unhurried. We work directly with over 500 rural master artisans across Murshidabad, Santiniketan, Bikna, and Natungram without intermediaries.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                By guaranteeing fair living wages, healthcare access, and revival grants, we ensure that younger generations take pride in carrying forward these sacred ancestral crafts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-ivory)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            
            {/* Mission */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-terracotta)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
                Our Mission
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                To preserve, document, and champion Bengal's indigenous handicraft traditions by designing luxury ethnic wear, textiles, and home artifacts that speak to global connoisseurs of fine art.
              </p>
            </div>

            {/* Vision */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--secondary-olive)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.2rem'
              }}>
                <Heart size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
                Our Vision
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.98rem' }}>
                To establish Gandhorbi Folk Arts as a globally recognized symbol of Bengali craft excellence, creating sustainable economic independence for rural artisan communities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ARTISAN SHOWCASE */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Master Craftsmen
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px' }}>
              The Hands Behind the Art
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            {artisans.map((art) => (
              <div key={art.id} className="heritage-card">
                <img
                  src={art.photo}
                  alt={art.name}
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {art.craft} • {art.experience} Exp
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginTop: '2px', color: 'var(--text-charcoal)' }}>
                    {art.name}
                  </h3>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-warm-grey)', marginBottom: '0.8rem' }}>
                    Region: {art.region}
                  </span>
                  <p style={{ fontFamily: 'var(--font-subheading)', fontStyle: 'italic', fontSize: '0.92rem', color: 'var(--text-charcoal)', lineHeight: 1.6 }}>
                    "{art.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              onClick={() => navigateTo('collections')}
              className="btn-primary"
              style={{ padding: '1rem 2.5rem' }}
            >
              Explore Artisan Collections <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
