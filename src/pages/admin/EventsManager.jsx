/**
 * EventsManager.jsx
 * Dedicated Events Management page for the Admin Portal.
 * Compact cards with a clean Material/Drive 3-dots overflow action menu.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CalendarPlus, Edit3, Trash2, Eye, EyeOff, MapPin, Clock,
  CheckCircle, AlertCircle, Search, Star, MoreVertical
} from 'lucide-react';
import { db, updateDocument, deleteDocument } from '../../services/firestore';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const EventsManager = () => {
  const navigate = useNavigate();

  const [events, setEvents]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [toast, setToast]             = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef                       = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!activeMenuId) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [activeMenuId]);

  // Real-time Firestore listener
  useEffect(() => {
    if (!db) { setLoading(false); return; }
    let unsub = () => {};
    try {
      unsub = onSnapshot(
        query(collection(db, 'events'), orderBy('startDate', 'asc')),
        (snap) => {
          setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          console.warn('[EventsManager] Listener error:', err);
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn('[EventsManager] Subscription error:', e);
      setLoading(false);
    }
    return () => unsub();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleField = async (id, fieldName, currentValue) => {
    const newValue = !currentValue;
    const res = await updateDocument('events', id, { [fieldName]: newValue });
    if (res.success) {
      showToast('success', `Updated ${fieldName}!`);
    } else {
      showToast('error', 'Failed to update setting.');
    }
  };

  const handleDelete = async (eventItem) => {
    if (!window.confirm(`Are you sure you want to delete "${eventItem.title}"?`)) return;

    if (eventItem.banner?.publicId) {
      console.log('[Cloudinary Delete Reference] Banner Public ID to destroy:', eventItem.banner.publicId);
    }

    const res = await deleteDocument('events', eventItem.id);
    if (res.success) {
      showToast('success', `Deleted "${eventItem.title}".`);
    } else {
      showToast('error', res.error || 'Failed to delete event.');
    }
  };

  // Filtered events
  const filteredEvents = events.filter(ev => {
    const term = search.toLowerCase();
    return (
      ev.title?.toLowerCase().includes(term) ||
      ev.venue?.toLowerCase().includes(term) ||
      ev.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-page fade-in">

      {/* Page Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Events Management</h1>
            <p className="admin-page-subtitle">
              Manage atelier calendar, exhibitions, workshops, and status
            </p>
          </div>
        </div>

        <button
          className="admin-btn-primary"
          onClick={() => navigate('/admin/events/add')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <CalendarPlus size={18} /> Add Event
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Admin Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="admin-field-icon-wrap" style={{ maxWidth: '320px', flex: 1 }}>
          <Search size={16} className="admin-field-icon" />
          <input
            type="text"
            className="admin-field-input"
            placeholder="Search events by title or venue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>
          Showing {filteredEvents.length} of {events.length} events
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-warm-grey)' }}>Loading events from Firestore…</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="admin-empty-msg" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Calendar size={40} color="var(--text-warm-grey)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
            {search ? 'No events match your search.' : 'No events found in database.'}
          </p>
          <button
            className="admin-quick-btn admin-quick-btn-primary"
            onClick={() => navigate('/admin/events/add')}
            style={{ margin: '1rem auto 0 auto' }}
          >
            <CalendarPlus size={18} /> Add Your First Event
          </button>
        </div>
      ) : (
        /* Events Grid: Desktop 3, Tablet 2, Mobile 1 */
        <div className="admin-events-grid">
          {filteredEvents.map((ev) => {
            const bannerUrl = ev.banner?.url || ev.image || '';
            const isMenuOpen = activeMenuId === ev.id;

            return (
              <div
                key={ev.id}
                className={`admin-ev-card${ev.hidden ? ' admin-card-hidden' : ''}`}
                style={{ position: 'relative', zIndex: isMenuOpen ? 100 : 1 }}
              >

                {/* Event Banner */}
                <div className="admin-ev-img-wrap">
                  {bannerUrl ? (
                    <img src={bannerUrl} alt={ev.title} className="admin-ev-img" />
                  ) : (
                    <div className="admin-ev-no-img">No Banner</div>
                  )}

                  {/* Status Overlay Badge */}
                  <div className="admin-card-badges">
                    {ev.hidden && <span className="admin-badge admin-badge-hidden">Hidden</span>}
                    {ev.featured && <span className="admin-badge admin-badge-featured">⭐ Featured</span>}
                  </div>

                  <span className={`admin-status-badge admin-status-${(ev.status || 'upcoming').toLowerCase()}`} style={{ position: 'absolute', bottom: '8px', left: '8px' }}>
                    {ev.status || 'Upcoming'}
                  </span>

                  {/* Three-dots menu trigger */}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 20 }} ref={isMenuOpen ? menuRef : null}>
                    <button
                      className="admin-card-menu-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : ev.id);
                      }}
                      aria-label="Event options"
                      title="Event options"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {/* Material Dropdown Menu */}
                    {isMenuOpen && (
                      <div className="admin-card-dropdown fade-in">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            navigate(`/admin/events/edit/${ev.id}`);
                          }}
                          className="admin-dropdown-item"
                        >
                          <Edit3 size={15} color="var(--primary-terracotta)" />
                          <span>✏️ Edit Event</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleField(ev.id, 'featured', ev.featured);
                          }}
                          className="admin-dropdown-item"
                        >
                          <Star size={15} color={ev.featured ? 'var(--highlight-mustard)' : 'var(--text-warm-grey)'} />
                          <span>⭐ {ev.featured ? 'Unfeature Event' : 'Feature Event'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleField(ev.id, 'hidden', ev.hidden);
                          }}
                          className="admin-dropdown-item"
                        >
                          {ev.hidden ? <Eye size={15} color="#25D366" /> : <EyeOff size={15} color="#e63946" />}
                          <span>👁 {ev.hidden ? 'Show on Website' : 'Hide from Website'}</span>
                        </button>

                        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleDelete(ev);
                          }}
                          className="admin-dropdown-item admin-dropdown-danger"
                        >
                          <Trash2 size={15} color="#e63946" />
                          <span style={{ color: '#e63946' }}>🗑 Delete Event</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="admin-ev-body" style={{ padding: '0.85rem 1rem' }}>
                  <h3 className="admin-ev-title">{ev.title}</h3>

                  <div className="admin-ev-meta">
                    <span className="admin-ev-meta-item">
                      <Clock size={14} color="var(--primary-terracotta)" />
                      {ev.startDate} {ev.endDate && ev.endDate !== ev.startDate ? `→ ${ev.endDate}` : ''}
                    </span>
                    {ev.venue && (
                      <span className="admin-ev-meta-item">
                        <MapPin size={14} color="var(--primary-terracotta)" />
                        {ev.venue}{ev.city ? `, ${ev.city}` : ''}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
