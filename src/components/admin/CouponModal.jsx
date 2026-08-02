/**
 * CouponModal.jsx
 * Admin modal dialog for creating, editing, and duplicating Offers & Coupons.
 */

import React, { useState, useEffect } from 'react';
import { X, Tag, CheckCircle, AlertCircle, Calendar, Percent, DollarSign, Layers, Package, Save } from 'lucide-react';
import { categories } from '../../data/categories';
import { saveCoupon } from '../../services/coupons';

const INITIAL_FORM = {
  code: '',
  name: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  maxUses: '',
  maxUsesPerCustomer: '1',
  validFrom: new Date().toISOString().slice(0, 16),
  expiryDate: '',
  applicability: 'all',
  applicableCategories: [],
  applicableProducts: [],
  active: true,
};

export const CouponModal = ({ isOpen, onClose, editingCoupon = null, isDuplicate = false, products = [] }) => {
  const [form, setForm]         = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]       = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (editingCoupon) {
      setForm({
        code: isDuplicate ? `${editingCoupon.code}_COPY` : (editingCoupon.code || ''),
        name: editingCoupon.name || '',
        description: editingCoupon.description || '',
        discountType: editingCoupon.discountType || 'percentage',
        discountValue: editingCoupon.discountValue !== undefined ? String(editingCoupon.discountValue) : '',
        minOrderAmount: editingCoupon.minOrderAmount !== undefined ? String(editingCoupon.minOrderAmount) : '',
        maxDiscountAmount: editingCoupon.maxDiscountAmount ? String(editingCoupon.maxDiscountAmount) : '',
        maxUses: editingCoupon.maxUses ? String(editingCoupon.maxUses) : '',
        maxUsesPerCustomer: editingCoupon.maxUsesPerCustomer ? String(editingCoupon.maxUsesPerCustomer) : '1',
        validFrom: editingCoupon.validFrom ? editingCoupon.validFrom.slice(0, 16) : new Date().toISOString().slice(0, 16),
        expiryDate: editingCoupon.expiryDate ? editingCoupon.expiryDate.slice(0, 16) : '',
        applicability: editingCoupon.applicability || 'all',
        applicableCategories: editingCoupon.applicableCategories || [],
        applicableProducts: editingCoupon.applicableProducts || [],
        active: editingCoupon.active !== false,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [isOpen, editingCoupon, isDuplicate]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    if (name === 'code') {
      val = val.toUpperCase();
    }
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleCategoryToggle = (catName) => {
    setForm((prev) => {
      const exists = prev.applicableCategories.includes(catName);
      const updated = exists
        ? prev.applicableCategories.filter((c) => c !== catName)
        : [...prev.applicableCategories, catName];
      return { ...prev, applicableCategories: updated };
    });
  };

  const handleProductToggle = (prodId) => {
    setForm((prev) => {
      const exists = prev.applicableProducts.includes(prodId);
      const updated = exists
        ? prev.applicableProducts.filter((p) => p !== prodId)
        : [...prev.applicableProducts, prodId];
      return { ...prev, applicableProducts: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) return showToast('error', 'Coupon Code is required.');
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0) {
      return showToast('error', 'Please enter a valid positive discount value.');
    }

    if (form.discountType === 'percentage') {
      if (Number(form.discountValue) > 100) {
        return showToast('error', 'Percentage discount cannot exceed 100%.');
      }
      if (!form.maxDiscountAmount || isNaN(Number(form.maxDiscountAmount))) {
        return showToast('error', 'Maximum Discount Amount is required for percentage coupons.');
      }
    }

    if (form.applicability === 'categories' && form.applicableCategories.length === 0) {
      return showToast('error', 'Please select at least one applicable category.');
    }

    if (form.applicability === 'products' && form.applicableProducts.length === 0) {
      return showToast('error', 'Please select at least one applicable product.');
    }

    setSubmitting(true);
    try {
      const targetId = isDuplicate ? null : (editingCoupon ? editingCoupon.id : null);
      const res = await saveCoupon(form, targetId);

      if (res.success) {
        showToast('success', isDuplicate ? 'Coupon duplicated successfully!' : (editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!'));
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        showToast('error', res.error || 'Failed to save coupon.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Unexpected error saving coupon.');
    } finally {
      setSubmitting(false);
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
          maxWidth: '820px',
          width: '94%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
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
            <Tag size={22} color="var(--primary-terracotta)" />
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', color: 'var(--text-charcoal)', margin: 0 }}>
                {isDuplicate ? 'Duplicate Coupon' : (editingCoupon ? 'Edit Coupon' : 'Create New Coupon')}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-warm-grey)', margin: '2px 0 0 0' }}>
                Set up promotional discounts, usage limits, and applicability rules
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
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`admin-toast admin-toast-${toast.type}`} style={{ margin: '0.75rem 1.5rem 0 1.5rem' }}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.msg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Basic Information */}
          <div className="admin-form-card" style={{ padding: '1.25rem' }}>
            <h3 className="admin-form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} /> Basic Information
            </h3>

            <div className="admin-form-row admin-form-row-2">
              <div className="admin-field-group">
                <label className="admin-field-label">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g. GANDHORBI15"
                  value={form.code}
                  onChange={handleChange}
                  required
                  className="admin-field-input"
                  style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Coupon Name (Optional)</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Festive Special Offer"
                  value={form.name}
                  onChange={handleChange}
                  className="admin-field-input"
                />
              </div>
            </div>

            <div className="admin-field-group" style={{ marginTop: '1rem' }}>
              <label className="admin-field-label">Description (Optional)</label>
              <textarea
                name="description"
                rows={2}
                placeholder="Short terms or description for customers..."
                value={form.description}
                onChange={handleChange}
                className="admin-field-input"
              />
            </div>
          </div>

          {/* Section 2: Discount & Rules */}
          <div className="admin-form-card" style={{ padding: '1.25rem' }}>
            <h3 className="admin-form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Percent size={16} /> Discount &amp; Usage Rules
            </h3>

            <div className="admin-form-row admin-form-row-3">
              <div className="admin-field-group">
                <label className="admin-field-label">Discount Type *</label>
                <select
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="admin-field-input"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">
                  {form.discountType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                </label>
                <input
                  type="number"
                  name="discountValue"
                  min="1"
                  max={form.discountType === 'percentage' ? '100' : undefined}
                  placeholder={form.discountType === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                  value={form.discountValue}
                  onChange={handleChange}
                  required
                  className="admin-field-input"
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">
                  Max Discount Amount (₹) {form.discountType === 'percentage' ? '*' : '(Optional)'}
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  min="0"
                  placeholder="e.g. 1500"
                  value={form.maxDiscountAmount}
                  onChange={handleChange}
                  required={form.discountType === 'percentage'}
                  className="admin-field-input"
                />
              </div>
            </div>

            <div className="admin-form-row admin-form-row-3" style={{ marginTop: '1rem' }}>
              <div className="admin-field-group">
                <label className="admin-field-label">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  name="minOrderAmount"
                  min="0"
                  placeholder="e.g. 2000 (0 for no min)"
                  value={form.minOrderAmount}
                  onChange={handleChange}
                  className="admin-field-input"
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Maximum Total Uses</label>
                <input
                  type="number"
                  name="maxUses"
                  min="1"
                  placeholder="e.g. 100 (blank for unlimited)"
                  value={form.maxUses}
                  onChange={handleChange}
                  className="admin-field-input"
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Max Uses Per Customer</label>
                <input
                  type="number"
                  name="maxUsesPerCustomer"
                  min="1"
                  placeholder="e.g. 1"
                  value={form.maxUsesPerCustomer}
                  onChange={handleChange}
                  className="admin-field-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <label className="admin-checkbox-label" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="admin-checkbox"
                />
                <span>Active Coupon Status</span>
              </label>
            </div>
          </div>

          {/* Section 3: Validity */}
          <div className="admin-form-card" style={{ padding: '1.25rem' }}>
            <h3 className="admin-form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} /> Validity Dates
            </h3>

            <div className="admin-form-row admin-form-row-2">
              <div className="admin-field-group">
                <label className="admin-field-label">Valid From *</label>
                <input
                  type="datetime-local"
                  name="validFrom"
                  value={form.validFrom}
                  onChange={handleChange}
                  required
                  className="admin-field-input"
                />
              </div>

              <div className="admin-field-group">
                <label className="admin-field-label">Expiry Date &amp; Time (Optional)</label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  className="admin-field-input"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Applicability */}
          <div className="admin-form-card" style={{ padding: '1.25rem' }}>
            <h3 className="admin-form-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} /> Applicability Scope
            </h3>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <label className="admin-checkbox-label">
                <input
                  type="radio"
                  name="applicability"
                  value="all"
                  checked={form.applicability === 'all'}
                  onChange={handleChange}
                />
                <span>Entire Website</span>
              </label>

              <label className="admin-checkbox-label">
                <input
                  type="radio"
                  name="applicability"
                  value="categories"
                  checked={form.applicability === 'categories'}
                  onChange={handleChange}
                />
                <span>Specific Categories</span>
              </label>

              <label className="admin-checkbox-label">
                <input
                  type="radio"
                  name="applicability"
                  value="products"
                  checked={form.applicability === 'products'}
                  onChange={handleChange}
                />
                <span>Specific Products</span>
              </label>
            </div>

            {/* If Specific Categories */}
            {form.applicability === 'categories' && (
              <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-charcoal)', display: 'block', marginBottom: '0.75rem' }}>
                  Select Applicable Categories:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                  {categories.map((cat) => (
                    <label key={cat.id} className="admin-checkbox-label" style={{ fontSize: '0.85rem' }}>
                      <input
                        type="checkbox"
                        checked={form.applicableCategories.includes(cat.name)}
                        onChange={() => handleCategoryToggle(cat.name)}
                        className="admin-checkbox"
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* If Specific Products */}
            {form.applicability === 'products' && (
              <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-charcoal)', display: 'block', marginBottom: '0.75rem' }}>
                  Select Applicable Products ({form.applicableProducts.length} selected):
                </span>
                <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '4px' }}>
                  {products.map((p) => (
                    <label key={p.id} className="admin-checkbox-label" style={{ fontSize: '0.85rem', padding: '4px 0' }}>
                      <input
                        type="checkbox"
                        checked={form.applicableProducts.includes(p.id)}
                        onChange={() => handleProductToggle(p.id)}
                        className="admin-checkbox"
                      />
                      <span>{p.name} (₹{p.price.toLocaleString('en-IN')}) • <em style={{ color: 'var(--text-warm-grey)' }}>{p.category}</em></span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="admin-btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : <><Save size={16} /> Save Coupon</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
