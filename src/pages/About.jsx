/**
 * About.jsx
 * About Us page for Gandhorbi Folk Arts.
 * Clean, text-focused layout.
 * Folk Arts Forms removed per user directive.
 * Owner Profile is the final section before the Footer.
 */

import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Sparkles, Heart, Compass, ShieldCheck, Award,
  UserCheck, Leaf, Globe, Briefcase, GraduationCap, Brush
} from 'lucide-react';

export const About = () => {
  return (
    <div className="fade-in" style={{ paddingTop: '100px', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── EDITORIAL HERO SECTION ─────────────────────────────────────────── */}
      <section className="section-padding" style={{ borderBottom: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden', padding: '3.5rem 1rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
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
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            lineHeight: 1.15,
            marginTop: '0.2rem',
            marginBottom: '1.2rem',
            color: 'var(--text-charcoal)',
            fontWeight: 700
          }}>
            Gandhorbi Folk Arts
          </h1>
          <p style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
            fontStyle: 'italic',
            color: 'var(--text-warm-grey)',
            lineHeight: 1.7,
            maxWidth: '800px',
            margin: '0 auto 1.5rem auto'
          }}>
            "Drawing inspiration from the mythological <strong style={{ color: 'var(--primary-terracotta)', fontStyle: 'normal' }}>Gandharvas</strong>—celestial musicians known for their divine artistry—the name 'Gandhorbi' symbolizes a harmonious blend of creativity, heritage, and community."
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginTop: '1.8rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <Sparkles size={16} color="var(--primary-terracotta)" /> Sustainable Crafts
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <Heart size={16} color="var(--primary-terracotta)" /> Women Artisan Empowerment
            </span>
            <span style={{ color: 'var(--border-subtle)' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-charcoal)', fontWeight: 600 }}>
              <ShieldCheck size={16} color="var(--secondary-olive)" /> Fair Trade Practice
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 1: BRAND JOURNEY ───────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-ivory)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Heritage Evolution
          </span>
          <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginTop: '6px', marginBottom: '1.5rem', color: 'var(--text-charcoal)' }}>
            Brand Journey
          </h2>
          <div style={{
            backgroundColor: 'var(--bg-warm-linen)',
            padding: 'clamp(1.5rem, 4vw, 2.8rem)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'left'
          }}>
            <p style={{
              color: 'var(--text-warm-grey)',
              fontSize: 'clamp(1rem, 1.8vw, 1.12rem)',
              lineHeight: 1.85,
              margin: 0
            }}>
              Gandhorbi Folk Arts began as a folk art documentation initiative focused on preserving Bengal’s traditional crafts and supporting rural women artisans. Over time, it evolved into a craft-based cultural brand that revived practices such as Kantha embroidery, Pattachitra painting, and terracotta work by adapting them into contemporary products. Through exhibitions, workshops, and digital platforms, the brand expanded its reach while staying rooted in authenticity, sustainability, and artisan empowerment.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: BRAND MISSION ────────────────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-sage)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: 'var(--secondary-olive)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Cultural Initiative
          </span>
          <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', marginTop: '6px', marginBottom: '1.5rem', color: 'var(--text-charcoal)' }}>
            Brand Mission
          </h2>
          <div style={{
            backgroundColor: 'var(--bg-warm-linen)',
            padding: 'clamp(1.5rem, 4vw, 2.8rem)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'left'
          }}>
            <p style={{ color: 'var(--text-warm-grey)', fontSize: 'clamp(1rem, 1.8vw, 1.05rem)', lineHeight: 1.85, marginBottom: '1.2rem' }}>
              Gandhorbi Folk Arts is a cultural initiative rooted in the preservation and revitalization of traditional Indian folk art forms, with a particular focus on empowering rural and tribal women artisans.
            </p>
            <p style={{ color: 'var(--text-warm-grey)', fontSize: 'clamp(1rem, 1.8vw, 1.05rem)', lineHeight: 1.85, marginBottom: '1.2rem' }}>
              This movement champions sustainable craftsmanship by reviving endangered practices such as handloom weaving, terracotta work, folk painting, and upcycled design. Through fair trade models and skill development programs, Gandhorbi fosters economic independence for artisans while ensuring that their cultural knowledge is passed down and adapted for contemporary relevance.
            </p>
            <p style={{ color: 'var(--text-warm-grey)', fontSize: 'clamp(1rem, 1.8vw, 1.05rem)', lineHeight: 1.85, margin: 0 }}>
              Their products—ranging from home décor and textiles to lifestyle accessories—reflect a deep respect for indigenous aesthetics, ecological consciousness, and storytelling traditions.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: OUR 4 PILLARS & GOALS ───────────────────────────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-warm-linen)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Strategic Vision
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              Our 4 Pillars &amp; Goals
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {/* Goal 1 */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-terracotta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', flexShrink: 0 }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Preservation of Folk Heritage
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.94rem', margin: 0 }}>
                Safeguard traditional art forms like embroidery, weaving, terracotta, and storytelling that are at risk of fading.
              </p>
            </div>

            {/* Goal 2 */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--secondary-olive)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', flexShrink: 0 }}>
                <Heart size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Artisan Empowerment
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.94rem', margin: 0 }}>
                Provide training, fair wages, and market access to artisans, helping them become self-reliant.
              </p>
            </div>

            {/* Goal 3 */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--highlight-mustard)', color: '#12141D', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', flexShrink: 0 }}>
                <Globe size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Cultural Promotion
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.94rem', margin: 0 }}>
                Celebrate Bengal's folk identity through exhibitions, workshops, and educational outreach.
              </p>
            </div>

            {/* Goal 4 */}
            <div style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '2rem 1.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-terracotta)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', flexShrink: 0 }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text-charcoal)' }}>
                Sustainable Craft Practices
              </h3>
              <p style={{ color: 'var(--text-warm-grey)', lineHeight: 1.7, fontSize: '0.94rem', margin: 0 }}>
                Encourage eco-conscious production methods and ethical sourcing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 4: OWNER SECTION (LAST SECTION BEFORE FOOTER) ──────────── */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-soft-ivory)', padding: '4rem 1rem 5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Leadership &amp; Visionary
            </span>
            <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.6rem)', marginTop: '6px', color: 'var(--text-charcoal)' }}>
              Owner Profile
            </h2>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-warm-linen)',
            padding: 'clamp(1.5rem, 4vw, 2.8rem)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div style={{ display: 'inline-block', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(184, 92, 56, 0.12)', color: 'var(--primary-terracotta)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Owner
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', color: 'var(--text-charcoal)', margin: '0 0 1.5rem 0', wordBreak: 'break-word' }}>
              Debjani Chatterjee
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%', boxSizing: 'border-box' }}>
              
              {/* Profession */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                <Briefcase size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>
                  <strong style={{ color: 'var(--text-charcoal)', display: 'block', fontSize: '0.92rem' }}>Profession:</strong>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.94rem', lineHeight: 1.5, display: 'block' }}>
                    Educationist, Corporate Trainer, Entrepreneur, Artist
                  </span>
                </div>
              </div>

              {/* Educational Qualifications */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                <GraduationCap size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>
                  <strong style={{ color: 'var(--text-charcoal)', display: 'block', fontSize: '0.92rem' }}>Educational Qualifications:</strong>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.94rem', lineHeight: 1.5, display: 'block' }}>
                    M.A. in English, B.Ed.
                  </span>
                </div>
              </div>

              {/* Professional Experience */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                <Award size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>
                  <strong style={{ color: 'var(--text-charcoal)', display: 'block', fontSize: '0.92rem' }}>Professional Experience:</strong>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.94rem', lineHeight: 1.5, display: 'block' }}>
                    28+ years of experience in teaching, 15 years of experience as a corporate trainer
                  </span>
                </div>
              </div>

              {/* Areas of Expertise */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                <UserCheck size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>
                  <strong style={{ color: 'var(--text-charcoal)', display: 'block', fontSize: '0.92rem' }}>Areas of Expertise:</strong>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.94rem', lineHeight: 1.5, display: 'block' }}>
                    Teaching and academic mentoring, Corporate training and communication skills, Arts and handicrafts entrepreneurship
                  </span>
                </div>
              </div>

              {/* Artistic Practice */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%' }}>
                <Brush size={20} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word', flex: 1 }}>
                  <strong style={{ color: 'var(--text-charcoal)', display: 'block', fontSize: '0.92rem' }}>Artistic Practice:</strong>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.94rem', lineHeight: 1.5, display: 'block' }}>
                    Kantha embroidery, Pre-stitched Bengali traditional dhotis, Fashion wares, Wooden crafts, Dokra handicrafts
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
