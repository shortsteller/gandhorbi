/**
 * About.jsx
 * Comprehensive About Us page for Gandhorbi Folk Arts.
 * Designed with luxury heritage aesthetics matching the platform design system.
 * Based on official brand documentation & presentation archive.
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles, Heart, Compass, ShieldCheck, ArrowRight, Award,
  UserCheck, BookOpen, Layers, Leaf, Palette, HeartHandshake,
  Globe, Sun, CheckCircle2, Star
} from 'lucide-react';

export const About = () => {
  const { navigateTo } = useShop();

  return (
    <div className="fade-in" style={{ paddingTop: '100px', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      
      {/* ── EDITORIAL HERO SECTION ─────────────────────────────────────────── */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', position: 'relative', zIndex: 2 }}>
          <span style={{
            color: 'var(--primary-terracotta)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            display: 'inline-block',
            marginBottom: '0.75rem'
          }}>
            Celestial Artistry · Living Heritage Chronicle
          </span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)',
            lineHeight: 1.15,
            marginTop: '0.2rem',
            marginBottom: '1.5rem',
            color: 'var(--text-charcoal)',
            fontWeight: 700
          }}>
            Gandhorbi Folk Arts
          </h1>
          <p style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: 'clamp(1.15rem, 2.2vw, 1.4rem)',
            fontStyle: 'italic',
            color: 'var(--text-warm-grey)',
            lineHeight: 1.7,
            maxWidth: '800px',
            margin: '0 auto 1.5rem auto'
          }}>
            "Named after the mythological <strong style={{ color: 'var(--primary-terracotta)', fontStyle: 'normal' }}>Gandharvas</strong>—celestial musicians celebrated for their divine artistry—Gandhorbi symbolizes a harmonious blend of creativity, heritage, and community empowerment."
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <Sparkles size={16} color="var(--primary-terracotta)" /> Indigenous Crafts
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <Heart size={16} color="var(--primary-terracotta)" /> Women Artisan Collective
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <ShieldCheck size={16} color="var(--secondary-olive)" /> Fair Trade Certified
            </span>
          </div>
        </div>
      </section>

      {/* ── BRAND ESSENCE & CONCEPT ─────────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-sage)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Brand Essence &amp; Mission
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', marginTop: '6px', marginBottom: '1.2rem', color: 'var(--text-charcoal)' }}>
                Revitalizing Traditional Indian Folk Art
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                Gandhorbi Folk Arts is a cultural movement rooted in preserving and revitalizing traditional Indian folk art forms, with a particular focus on empowering rural and tribal women artisans across Bengal.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                By reviving endangered practices such as handloom weaving, Nakshi Kantha embroidery, Pattachitra scroll painting, terracotta sculpture, and upcycled design, Gandhorbi transforms indigenous techniques into functional, wearable, and meaningful lifestyle heirlooms without compromising cultural authenticity.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                More than a brand, Gandhorbi represents a living archive of India's folk legacy—reimagined through the hands and voices of its original custodians.
              </p>
            </div>

            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-hover)',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#fff'
            }}>
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1000"
                alt="Bengali Heritage Handloom Crafting"
                style={{ width: '100%', height: '440px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '1.5rem',
                background: 'linear-gradient(to top, rgba(20,16,12,0.92) 0%, rgba(20,16,12,0) 100%)',
                color: '#fff'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--highlight-mustard)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Authentic Heritage
                </span>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', margin: '2px 0 0 0' }}>
                  Hand-stitched Textiles &amp; Folk Imagery
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEET THE FOUNDER & LEADERSHIP ──────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Leadership &amp; Visionary
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              Meet the Founder
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}>
            
            {/* Left: Info details */}
            <div>
              <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(184, 92, 56, 0.1)', color: 'var(--primary-terracotta)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                Founder &amp; Mentor
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', color: 'var(--text-charcoal)', margin: 0 }}>
                Debjani Chatterjee
              </h3>
              <p style={{ color: 'var(--primary-terracotta)', fontSize: '1.05rem', fontWeight: 600, marginTop: '4px', marginBottom: '1.5rem' }}>
                Educationist · Corporate Trainer · Entrepreneur · Artist
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.96rem', color: 'var(--text-warm-grey)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <BookOpen size={18} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Educational Qualifications:</strong> M.A. in English, B.Ed.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Award size={18} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Professional Experience:</strong> 28+ years of experience in teaching, 15 years as a corporate trainer.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <UserCheck size={18} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Areas of Expertise:</strong> Academic mentoring, corporate training &amp; communication skills, arts and handicrafts entrepreneurship.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Palette size={18} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-charcoal)' }}>Artistic Practice:</strong> Kantha embroidery, pre-stitched Bengali traditional dhotis, fashion wares, wooden crafts, and Dokra handicrafts.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Founder Quote Card */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary-terracotta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Star size={30} />
              </div>
              <p style={{ fontFamily: 'var(--font-subheading)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--text-charcoal)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                "Our mission is to empower rural women artisans by teaching them not just craft techniques, but also branding, pricing, and business skills to build sustainable independence."
              </p>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-terracotta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                — Debjani Chatterjee
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── BRAND JOURNEY & EVOLUTION ───────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-ivory)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Heritage Evolution
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              The Brand Journey
            </h2>
            <p style={{ color: 'var(--text-warm-grey)', marginTop: '0.8rem', maxWidth: '700px', margin: '0.8rem auto 0 auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
              Gandhorbi Folk Arts began as a folk art documentation initiative focused on preserving Bengal’s traditional crafts and supporting rural women artisans. Over time, it evolved into a craft-based cultural brand that revived practices such as Kantha embroidery, Pattachitra painting, and terracotta work by adapting them into contemporary products. Through exhibitions, workshops, and digital platforms, the brand expanded its reach while staying rooted in authenticity, sustainability, and artisan empowerment.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.8rem'
          }}>
            <div className="heritage-card" style={{ padding: '1.8rem', backgroundColor: 'var(--bg-warm-linen)' }}>
              <div style={{ color: 'var(--primary-terracotta)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>01</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Folk Documentation
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Recording oral histories, ancestral stitching motifs, lost-wax bronze techniques, and regional variations of Bengali folk art.
              </p>
            </div>

            <div className="heritage-card" style={{ padding: '1.8rem', backgroundColor: 'var(--bg-warm-linen)' }}>
              <div style={{ color: 'var(--primary-terracotta)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>02</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Skill Workshops
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Conducting training programs in design innovation, quality control, motif placement, and garment finishing for women self-help groups.
              </p>
            </div>

            <div className="heritage-card" style={{ padding: '1.8rem', backgroundColor: 'var(--bg-warm-linen)' }}>
              <div style={{ color: 'var(--primary-terracotta)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>03</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Cultural Showcases
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Participating in cultural fairs, exhibitions, and monsoon melas in Kolkata and major cities to connect artisans directly with patrons.
              </p>
            </div>

            <div className="heritage-card" style={{ padding: '1.8rem', backgroundColor: 'var(--bg-warm-linen)' }}>
              <div style={{ color: 'var(--primary-terracotta)', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>04</div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Modern Craft Brand
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Launching high-fashion ethnic wear, pre-stitched dhotis, luxury dupattas, and handcrafted home decor for global art connoisseurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNATURE FOLK ART FORMS ───────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Ancestral Techniques
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              Folk Art Forms We Champion
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Kantha */}
            <div className="heritage-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-soft-ivory)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(184,92,56,0.12)', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Palette size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Kantha Embroidery
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Traditional hand embroidery using fine running stitches, featuring motifs inspired by nature, village life, folklore, and sacred mythology.
              </p>
            </div>

            {/* Pattachitra */}
            <div className="heritage-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-soft-ivory)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(184,92,56,0.12)', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Pattachitra Scroll Painting
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Narrative scroll painting tradition created with natural stone colors, depicting religious stories, epic folklore, and vibrant social themes.
              </p>
            </div>

            {/* Terracotta */}
            <div className="heritage-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-soft-ivory)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(184,92,56,0.12)', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Sun size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Terracotta Craft
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Hand-molded clay figures and decorative panels from Bankura and Bishnupur, renowned for earthy natural textures and mythological motifs.
              </p>
            </div>

            {/* Modern Adaptations */}
            <div className="heritage-card" style={{ padding: '2rem', backgroundColor: 'var(--bg-soft-ivory)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(184,92,56,0.12)', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '0.6rem' }}>
                Contemporary Fashion &amp; Decor
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                Traditional techniques adapted onto modern sarees, dupattas, stoles, pre-stitched Bengali dhotis, kaftans, and lifestyle accessories for global markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOALS & CORE PILLARS ───────────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-sage)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Strategic Vision
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              Our 4 Pillars &amp; Goals
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2.5rem'
          }}>
            {/* Pillar 1 */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-terracotta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Preservation of Folk Heritage
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Safeguarding endangered traditional art forms like Kantha embroidery, handloom weaving, terracotta, and storytelling that are at risk of fading into obscurity.
              </p>
            </div>

            {/* Pillar 2 */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--secondary-olive)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <HeartHandshake size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Artisan Empowerment
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Providing training, fair wages, healthcare support, and direct market access to rural women artisans, fostering long-term economic independence.
              </p>
            </div>

            {/* Pillar 3 */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--highlight-mustard)', color: '#12141D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Globe size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Cultural Promotion
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Celebrating Bengal's rich folk identity through curated exhibitions, artisan melas, digital storytelling, and educational outreach in colleges and institutes.
              </p>
            </div>

            {/* Pillar 4 */}
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--primary-terracotta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <Leaf size={26} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Sustainable Craft Practices
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Encouraging eco-conscious production methods, organic cotton &amp; Tussar silk fabrics, upcycled textile designs, and zero-waste ethical sourcing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── CULTURAL COLLABORATION WITH MRITTIKA ─────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center'
          }}>
            
            {/* Info Card */}
            <div>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                Cultural Alliance &amp; Community Outreach
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', marginTop: '6px', marginBottom: '1.2rem', color: 'var(--text-charcoal)' }}>
                Collaboration with Mrittika (Est. 1989)
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                Mrittika—originally established in 1989 as a Bengali Language and Heritage Center—has grown into a dynamic South Asian cultural organization dedicated to preserving language, heritage, and traditional arts.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.2rem' }}>
                Within this broader mission, Gandhorbi Folk Arts plays a vital role, often featured under Mrittika's umbrella in exhibitions, joint ceramic &amp; folk textile showcases, and community welfare programs including food and blanket distribution drives for needy families.
              </p>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Together, Mrittika's educational outreach frequently incorporates Gandhorbi's folk art modules, fostering intergenerational learning and ensuring the continuity of Bengali cultural knowledge.
              </p>
            </div>

            {/* Stats / Highlight Box */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--text-charcoal)', marginBottom: '1.5rem' }}>
                Artisan Network &amp; Community Impact
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.98rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <CheckCircle2 size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Rural Women Collectives:</strong> Partnering directly with master craftswomen across Murshidabad, Santiniketan, Bikna, and Natungram.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <CheckCircle2 size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Fair-Trade Self-Help Groups:</strong> Ensuring fair compensation, healthcare grants, and dignified livelihoods.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <CheckCircle2 size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Intergenerational Knowledge Transfer:</strong> Passing down sacred stitching and casting techniques to younger generations.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <CheckCircle2 size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Academic &amp; Design Internships:</strong> Collaboration with design institutes and colleges to foster appreciation for local craft.</span>
                </div>
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <button
                  onClick={() => navigateTo('collections')}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Explore Heritage Collections <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
