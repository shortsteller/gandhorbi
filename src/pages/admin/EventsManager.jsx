/**
 * EventsManager.jsx
 * Dedicated Events Management page for the Admin Portal.
 * Displays all events from Firestore as responsive cards with interactive toggles and actions.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, CalendarPlus, Edit3, Trash2, Eye, EyeOff, MapPin, Clock,
  CheckCircle, AlertCircle, Search, Star
} from 'lucide-react';
import { db, updateDocument, deleteDocument } from '../../services/firestore';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const EventsManager = () => {
  const navigate = useNavigate();

  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [toast, setToast]     = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

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

            return (
              <div key={ev.id} className={`admin-ev-card${ev.hidden ? ' admin-card-hidden' : ''}`}>

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
                </div>

                {/* Event Details */}
                <div className="admin-ev-body">
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

                  {ev.description && (
                    <p className="admin-ev-desc">
                      {ev.description.length > 120 ? `${ev.description.substring(0, 120)}…` : ev.description}
                    </p>
                  )}
                </div>

                {/* Card Controls */}
                <div className="admin-ev-controls">
                  <button
                    className={`admin-ctrl-btn${ev.hidden ? ' admin-ctrl-active' : ''}`}
                    onClick={() => handleToggleField(ev.id, 'hidden', ev.hidden)}
                    title={ev.hidden ? 'Show Event on Website' : 'Hide Event from Website'}
                  >
                    {ev.hidden ? <EyeOff size={15} color="#e63946" /> : <Eye size={15} color="#25D366" />}
                    <span>{ev.hidden ? 'Hidden' : 'Visible'}</span>
                  </button>

                  <button
                    className={`admin-ctrl-btn${ev.featured ? ' admin-ctrl-gold' : ''}`}
                    onClick={() => handleToggleField(ev.id, 'featured', ev.featured)}
                    title="Toggle Featured Status"
                  >
                    <Star size={15} color={ev.featured ? 'var(--highlight-mustard)' : 'var(--text-warm-grey)'} />
                    <span>Featured</span>
                  </button>
                </div>

                {/* Action Buttons: Edit & Delete */}
                <div className="admin-prod-actions">
                  <button
                    className="admin-action-btn admin-edit-btn"
                    onClick={() => navigate(`/admin/events/edit/${ev.id}`)}
                  >
                    <Edit3 size={15} /> Edit
                  </button>
                  <button
                    className="admin-action-btn admin-delete-btn"
                    onClick={() => handleDelete(ev)}
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
