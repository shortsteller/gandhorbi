/**
 * AddEvent.jsx
 * Admin form to add a new event.
 * Uploads the banner to Cloudinary, then saves {url, publicId} in Firestore.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { addEvent, EVENT_STATUS } from '../../services/events';

const INITIAL_FORM = {
  title: '', description: '', venue: '',
  address: '', city: '', state: '',
  startDate: '', endDate: '', startTime: '', endTime: '',
  status: EVENT_STATUS.UPCOMING,
  featured: false,
  organizer: '', contactNumber: '', registrationLink: '',
};

export const AddEvent = () => {
  const navigate = useNavigate();
  const [form, setForm]           = useState(INITIAL_FORM);
  const [bannerFiles, setBanner]  = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]         = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim())     return showToast('error', 'Event title is required.');
    if (!form.venue.trim())     return showToast('error', 'Venue is required.');
    if (!form.startDate)        return showToast('error', 'Start date is required.');
    if (!form.endDate)          return showToast('error', 'End date is required.');

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
        organizer:        form.organizer.trim() || null,
        contactNumber:    form.contactNumber.trim() || null,
        registrationLink: form.registrationLink.trim() || null,
      };

      const bannerFile = bannerFiles[0] ?? null;
      const result = await addEvent(eventData, bannerFile);

      if (result.success) {
        showToast('success', `Event "${form.title}" added successfully!`);
        setForm(INITIAL_FORM);
        setBanner([]);
      } else {
        showToast('error', result.error || 'Failed to add event. Please try again.');
      }
    } catch (err) {
      showToast('error', 'Unexpected error. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-page fade-in">

      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarPlus size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Add Event</h1>
            <p className="admin-page-subtitle">Banner uploaded to Cloudinary · Event saved to Firestore</p>
          </div>
        </div>
        <button className="admin-back-btn" onClick={() => navigate('/admin/dashboard')}>
          <ChevronLeft size={16} /> Dashboard
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
          </div>
        </div>

        {/* ── Banner Image ─────────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <ImageUploader
            label="Event Banner (uploaded to Cloudinary)"
            files={bannerFiles}
            onFilesChange={setBanner}
            multiple={false}
          />
          {bannerFiles.length > 0 && (
            <p className="admin-img-count">Banner selected — both secure_url and public_id will be stored in Firestore.</p>
          )}
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => { setForm(INITIAL_FORM); setBanner([]); }}>
            Reset Form
          </button>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="admin-btn-spinner" />
                Uploading &amp; Saving…
              </span>
            ) : '📅 Add Event'}
          </button>
        </div>

      </form>
    </div>
  );
};
