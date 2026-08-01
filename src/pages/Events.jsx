import React, { useState, useEffect } from 'react';
import { events as initialEvents } from '../data/events';
import { Calendar, MapPin, Clock, MessageCircle } from 'lucide-react';
import { db } from '../services/firestore';
import { collection, onSnapshot } from 'firebase/firestore';

export const Events = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [liveEvents, setLiveEvents]         = useState(initialEvents);

  // Real-Time Events Sync from Firestore
  useEffect(() => {
    if (!db) return;
    let unsub = () => {};
    try {
      unsub = onSnapshot(collection(db, 'events'), (snap) => {
        if (snap.docs) {
          const firestoreEvents = snap.docs.map((docItem) => {
            const data = docItem.data();
            const dateStr = data.startDate && data.endDate && data.startDate !== data.endDate
              ? `${data.startDate} to ${data.endDate}`
              : data.startDate || 'Upcoming';

            const timingStr = data.startTime && data.endTime
              ? `${data.startTime} - ${data.endTime}`
              : data.startTime || 'Full Day';

            return {
              id: docItem.id,
              title: data.title,
              category: data.category || 'Cultural Events',
              date: dateStr,
              time: timingStr,
              venue: `${data.venue || ''}${data.city ? `, ${data.city}` : ''}`,
              description: data.description,
              banner: data.banner?.url || data.banner || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
              hidden: Boolean(data.hidden),
              featured: Boolean(data.featured),
              status: data.status || 'Upcoming',
            };
          });

          const firestoreIds = new Set(firestoreEvents.map((e) => e.id));
          const merged = [
            ...firestoreEvents,
            ...initialEvents.filter((e) => !firestoreIds.has(e.id)),
          ];
          setLiveEvents(merged);
        }
      });
    } catch (e) {
      console.warn('[Events] Firestore snapshot error:', e);
    }
    return () => unsub();
  }, []);

  // Filter out hidden events for the public website
  const publicEvents = liveEvents.filter((e) => !e.hidden);

  const filteredEvents = activeCategory === 'All'
    ? publicEvents
    : publicEvents.filter((e) => e.category === activeCategory);

  const handleRSVP = (eventItem) => {
    const message = `Hello Gandhorbi Folk Arts,\n\nI would like to RSVP / inquire about attending the following event:\n\n• Event: ${eventItem.title}\n• Date: ${eventItem.date}\n• Venue: ${eventItem.venue}\n\nPlease share registration details.`;
    window.open(`https://wa.me/916291261549?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '110px', paddingBottom: '5rem', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Atelier Calendar
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', marginTop: '4px' }}>
            Cultural Exhibitions &amp; Workshops
          </h1>
          <p style={{ color: 'var(--text-warm-grey)', marginTop: '0.8rem', maxWidth: '650px', margin: '0.8rem auto 0 auto' }}>
            Join Gandhorbi Folk Arts at major craft expos, hands-on Kantha masterclasses, and lost-wax metal casting live demonstrations.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {['All', 'Exhibitions', 'Workshops', 'Cultural Events'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-nav)',
                fontSize: '0.9rem',
                fontWeight: activeCategory === cat ? 700 : 500,
                backgroundColor: activeCategory === cat ? 'var(--primary-terracotta)' : 'var(--bg-soft-ivory)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-charcoal)',
                border: '1px solid var(--border-subtle)',
                transition: 'var(--transition-fast)',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(184, 92, 56, 0.25)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem'
        }}>
          {filteredEvents.map((evt) => (
            <div key={evt.id} className="heritage-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Banner Image */}
              <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                <img
                  src={evt.banner}
                  alt={evt.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--bg-soft-ivory)',
                  color: 'var(--primary-terracotta)',
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {evt.category}
                </span>
              </div>

              {/* Event Content */}
              <div style={{ padding: '1.8rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', lineHeight: 1.3, marginBottom: '1rem', color: 'var(--text-charcoal)' }}>
                    {evt.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-warm-grey)', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Calendar size={16} color="var(--primary-terracotta)" />
                      <span><strong>Date:</strong> {evt.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Clock size={16} color="var(--primary-terracotta)" />
                      <span><strong>Timing:</strong> {evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                      <MapPin size={16} color="var(--primary-terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Venue:</strong> {evt.venue}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-warm-grey)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {evt.description}
                  </p>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <button
                    onClick={() => handleRSVP(evt)}
                    className="btn-whatsapp"
                    style={{ padding: '0.75rem 1.2rem', fontSize: '0.9rem' }}
                  >
                    <MessageCircle size={18} /> Reserve Seat / RSVP (+91 6291261549)
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
