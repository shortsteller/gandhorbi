/**
 * AddEvent.jsx
 * Admin form to add a new event or edit an existing event.
 * Uploads banner to Cloudinary, then saves/updates in Firestore.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarPlus, CheckCircle, AlertCircle, ChevronLeft, Edit3 } from 'lucide-react';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { addEvent, getEventById, updateEvent, EVENT_STATUS } from '../../services/events';

const INITIAL_FORM = {
  title: '', description: '', venue: '',
  address: '', city: '', state: '',
  startDate: '', endDate: '', startTime: '', endTime: '',
  status: EVENT_STATUS.UPCOMING,
  featured: false, hidden: false,
  organizer: '', contactNumber: '', registrationLink: '',
};

export const AddEvent = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm]           = useState(INITIAL_FORM);
  const [bannerFiles, setBanner]  = useState([]);
  const [existingBanner, setExistingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(isEditMode);
  const [toast, setToast]         = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!id) return;
    setLoadingEvent(true);
    getEventById(id).then((res) => {
      if (res.success && res.data) {
        const ev = res.data;
        setForm({
          title:            ev.title            || '',
          description:      ev.description      || '',
          venue:            ev.venue            || '',
          address:          ev.address          || '',
          city:             ev.city             || '',
          state:            ev.state            || '',
          startDate:        ev.startDate        || '',
          endDate:          ev.endDate          || '',
          startTime:        ev.startTime        || '',
          endTime:          ev.endTime          || '',
          status:           ev.status           || EVENT_STATUS.UPCOMING,
          featured:         Boolean(ev.featured),
          hidden:           Boolean(ev.hidden),
          organizer:        ev.organizer        || '',
          contactNumber:    ev.contactNumber    || '',
          registrationLink: ev.registrationLink || '',
        });
        setExistingBanner(ev.banner || null);
      } else {
        showToast('error', 'Event not found.');
      }
      setLoadingEvent(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return showToast('error', 'Event title is required.');
    if (!form.venue.trim()) return showToast('error', 'Venue is required.');
    if (!form.startDate)    return showToast('error', 'Start date is required.');
    if (!form.endDate)      return showToast('error', 'End date is required.');

    setSubmitting(true);
    try {
      const eventData = {
        title:            form.title.trim(),
        description:      form.description.trim(),
        venue:            form.venue.trim(),
        address:          form.address.trim() || null,
        city:             form.city.trim() || null,
        state:            form.state.trim() || null,
        startDate:        form.startDate,
        endDate:          form.endDate,
        startTime:        form.startTime || null,
        endTime:          form.endTime || null,
        status:           form.status,
        featured:         form.featured,
        hidden:           form.hidden,
        organizer:        form.organizer.trim() || null,
        contactNumber:    form.contactNumber.trim() || null,
        registrationLink: form.registrationLink.trim() || null,
      };

      const bannerFile = bannerFiles[0] ?? null;

      if (isEditMode) {
        const result = await updateEvent(id, eventData, bannerFile);
        if (result.success) {
          showToast('success', `Event "${form.title}" updated successfully!`);
          setTimeout(() => navigate('/admin/events'), 1200);
        } else {
          showToast('error', result.error || 'Failed to update event.');
        }
      } else {
        const result = await addEvent(eventData, bannerFile);
        if (result.success) {
          showToast('success', `Event "${form.title}" added successfully!`);
          setForm(INITIAL_FORM);
          setBanner([]);
          setTimeout(() => navigate('/admin/events'), 1200);
        } else {
          showToast('error', result.error || 'Failed to add event.');
        }
      }
    } catch (err) {
      showToast('error', 'Unexpected error. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent) {
    return (
      <div className="admin-page fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-warm-grey)' }}>Loading event details…</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">

      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isEditMode ? <Edit3 size={22} color="var(--primary-terracotta)" /> : <CalendarPlus size={22} color="var(--primary-terracotta)" />}
          <div>
            <h1 className="admin-page-title">{isEditMode ? 'Edit Event' : 'Add Event'}</h1>
            <p className="admin-page-subtitle">
              {isEditMode ? `Updating ${form.title || 'event'}` : 'Banner uploaded to Cloudinary · Event saved to Firestore'}
            </p>
          </div>
        </div>
        <button className="admin-back-btn" onClick={() => navigate('/admin/events')}>
          <ChevronLeft size={16} /> Back to Events
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form" noValidate>

        {/* ── Event Details ───────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Event Details</h3>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="ev-title">Event Title *</label>
            <input id="ev-title" name="title" type="text" className="admin-field-input"
              placeholder="e.g. Surajkund Crafts Mela 2027"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="ev-desc">Description</label>
            <textarea id="ev-desc" name="description" className="admin-field-input admin-field-textarea"
              rows={4} placeholder="Describe the event, its cultural significance, what visitors can expect…"
              value={form.description} onChange={handleChange} />
          </div>

          <div className="admin-form-row">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-organizer">Organizer</label>
              <input id="ev-organizer" name="organizer" type="text" className="admin-field-input"
                placeholder="e.g. Gandhorbi Folk Arts"
                value={form.organizer} onChange={handleChange} />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-contact">Contact Number</label>
              <input id="ev-contact" name="contactNumber" type="tel" className="admin-field-input"
                placeholder="+91 XXXXXXXXXX"
                value={form.contactNumber} onChange={handleChange} />
            </div>
          </div>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="ev-reg">Registration Link</label>
            <input id="ev-reg" name="registrationLink" type="url" className="admin-field-input"
              placeholder="https://… (optional)"
              value={form.registrationLink} onChange={handleChange} />
          </div>
        </div>

        {/* ── Venue & Location ────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Venue & Location</h3>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="ev-venue">Venue Name *</label>
            <input id="ev-venue" name="venue" type="text" className="admin-field-input"
              placeholder="e.g. Surajkund Mela Ground"
              value={form.venue} onChange={handleChange} required />
          </div>

          <div className="admin-form-row admin-form-row-3">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-address">Address</label>
              <input id="ev-address" name="address" type="text" className="admin-field-input"
                placeholder="Street address (optional)"
                value={form.address} onChange={handleChange} />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-city">City</label>
              <input id="ev-city" name="city" type="text" className="admin-field-input"
                placeholder="e.g. Faridabad"
                value={form.city} onChange={handleChange} />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-state">State</label>
              <input id="ev-state" name="state" type="text" className="admin-field-input"
                placeholder="e.g. Haryana"
                value={form.state} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ── Dates & Times ───────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Dates & Times</h3>

          <div className="admin-form-row">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-start-date">Start Date *</label>
              <input id="ev-start-date" name="startDate" type="date" className="admin-field-input"
                value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-end-date">End Date *</label>
              <input id="ev-end-date" name="endDate" type="date" className="admin-field-input"
                value={form.endDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-start-time">Start Time</label>
              <input id="ev-start-time" name="startTime" type="time" className="admin-field-input"
                value={form.startTime} onChange={handleChange} />
            </div>
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-end-time">End Time</label>
              <input id="ev-end-time" name="endTime" type="time" className="admin-field-input"
                value={form.endTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* ── Status & Visibility ─────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Status & Visibility</h3>

          <div className="admin-form-row">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="ev-status">Event Status</label>
              <select id="ev-status" name="status" className="admin-field-input admin-field-select"
                value={form.status} onChange={handleChange}>
                <option value={EVENT_STATUS.UPCOMING}>Upcoming</option>
                <option value={EVENT_STATUS.ONGOING}>Ongoing</option>
                <option value={EVENT_STATUS.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>

          <div className="admin-checkbox-row">
            <label className="admin-checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="admin-checkbox" />
              <span>⭐ Featured Event</span>
              <span className="admin-checkbox-hint">Highlighted on the Events page</span>
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" name="hidden" checked={form.hidden} onChange={handleChange} className="admin-checkbox" />
              <span>👁 Hide Event from Website</span>
              <span className="admin-checkbox-hint">Hidden from public Events calendar</span>
            </label>
          </div>
        </div>

        {/* ── Banner Image ─────────────────────────────────────────────────── */}
        <div className="admin-form-card">
          {isEditMode && existingBanner?.url && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-field-label">Current Event Banner</label>
              <div className="img-uploader-thumb" style={{ width: '180px', height: '100px', marginTop: '0.5rem' }}>
                <img src={existingBanner.url} alt="Current banner" style={{ objectFit: 'cover' }} />
              </div>
            </div>
          )}

          <ImageUploader
            label={isEditMode ? 'Replace Banner Image (optional)' : 'Event Banner (uploaded to Cloudinary)'}
            files={bannerFiles}
            onFilesChange={setBanner}
            multiple={false}
          />
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => navigate('/admin/events')}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="admin-btn-spinner" />
                {isEditMode ? 'Updating Event…' : 'Uploading & Saving…'}
              </span>
            ) : isEditMode ? 'Save Changes' : '📅 Add Event'}
          </button>
        </div>

      </form>
    </div>
  );
};
