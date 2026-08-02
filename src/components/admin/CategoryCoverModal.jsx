/**
 * CategoryCoverModal.jsx
 * Admin modal dialog centered on the Dashboard page for uploading,
 * updating, and removing Homepage Category Cover images.
 */

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Upload, Trash2, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { categories } from '../../data/categories';
import { saveCategoryCover, removeCategoryCover, subscribeToCategoryCovers } from '../../services/categoryCovers';

export const CategoryCoverModal = ({ isOpen, onClose }) => {
  const [coversMap, setCoversMap] = useState({});
  const [uploadingId, setUploadingId] = useState(null);
  const [removingId, setRemovingId]   = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time listener to Firestore categoryCovers collection
  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToCategoryCovers((data) => {
      setCoversMap(data);
    });
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = async (category, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return showToast('error', 'Please select a valid image file (JPG, PNG, WebP).');
    }

    setUploadingId(category.id);
    try {
      const res = await saveCategoryCover(category.id, category.name, file);
      if (res.success) {
        showToast('success', `Cover image for "${category.name}" updated!`);
      } else {
        showToast('error', res.error || 'Failed to save cover image.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unexpected error uploading cover image.');
    } finally {
      setUploadingId(null);
      e.target.value = ''; // reset file input
    }
  };

  const handleRemove = async (category) => {
    if (!window.confirm(`Are you sure you want to remove the cover image for "${category.name}"?`)) return;

    setRemovingId(category.id);
    try {
      const res = await removeCategoryCover(category.id);
      if (res.success) {
        showToast('success', `Removed cover image for "${category.name}".`);
      } else {
        showToast('error', res.error || 'Failed to remove cover image.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unexpected error removing cover image.');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9990 }}>
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-soft-ivory)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '780px',
          width: '92%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-warm-linen)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ImageIcon size={22} color="var(--primary-terracotta)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--text-charcoal)', margin: 0 }}>
                Homepage Category Covers
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-warm-grey)', margin: '2px 0 0 0' }}>
                Upload or update cover images displayed on the homepage category cards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-soft-ivory)',
              color: 'var(--text-charcoal)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast Notification inside Modal */}
        {toast && (
          <div className={`admin-toast admin-toast-${toast.type}`} style={{ margin: '0.75rem 1.5rem 0 1.5rem' }}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* Category Items List Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categories.map((cat) => {
              const coverRecord = coversMap[cat.id];
              const coverUrl    = coverRecord?.image?.url || null;
              const isUploading = uploadingId === cat.id;
              const isRemoving  = removingId === cat.id;
              const fileInputId = `cover-input-${cat.id}`;

              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1rem 1.2rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Left: Preview & Category Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 240px' }}>
                    {/* Cover Preview Thumbnail */}
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-warm-linen)',
                        overflow: 'hidden',
                        position: 'relative',
                        flexShrink: 0,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={cat.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-warm-grey)', fontSize: '0.65rem', padding: '4px' }}>
                          <ImageIcon size={18} color="var(--primary-terracotta)" style={{ opacity: 0.6, marginBottom: '2px' }} />
                          <div>No Cover</div>
                        </div>
                      )}

                      {/* Loading overlay spinner */}
                      {(isUploading || isRemoving) && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.85)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <div className="admin-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: 'var(--text-charcoal)', margin: 0 }}>
                        {cat.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: coverUrl ? '#25D366' : 'var(--text-warm-grey)', fontWeight: 600 }}>
                        {coverUrl ? '✓ Custom Cover Active' : 'Placeholder Gradient'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions (Hidden File Input + Action Buttons) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileSelect(cat, e)}
                    />

                    {coverUrl ? (
                      <>
                        {/* Change Image button */}
                        <label
                          htmlFor={fileInputId}
                          className="admin-action-btn admin-edit-btn"
                          style={{ margin: 0, cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                        >
                          <RefreshCw size={14} /> Change Image
                        </label>

                        {/* Remove Image button */}
                        <button
                          onClick={() => handleRemove(cat)}
                          disabled={isRemoving}
                          className="admin-action-btn admin-delete-btn"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                        >
                          <Trash2 size={14} /> Remove Image
                        </button>
                      </>
                    ) : (
                      /* + Add Image button */
                      <label
                        htmlFor={fileInputId}
                        className="admin-btn-primary"
                        style={{ margin: 0, cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '0.8rem', padding: '0.45rem 0.95rem' }}
                      >
                        <Upload size={14} /> + Add Image
                      </label>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-warm-linen)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <button className="admin-btn-ghost" onClick={onClose} style={{ fontSize: '0.85rem', padding: '0.45rem 1.2rem' }}>
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
