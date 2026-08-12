import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PackagePlus, CheckCircle, AlertCircle, ChevronLeft, Edit3, Tag, RotateCcw } from 'lucide-react';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { addProduct, getProductById, updateProduct } from '../../services/products';
import { categories, adminCategoryOptions } from '../../data/categories';
import { subscribeToCoupons } from '../../services/coupons';

const INITIAL_FORM = {
  name: '',
  category: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '5',
  inStock: true,
  trending: false,
  applicableCoupon: '',
  isReturnable: true,
  returnDays: '7',
};

export const AddProduct = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm]         = useState(INITIAL_FORM);
  const [coupons, setCoupons]   = useState([]);
  const [imageFiles, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);
  const [toast, setToast]       = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const unsub = subscribeToCoupons((list) => {
      setCoupons(list || []);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoadingProduct(true);
    getProductById(id).then((res) => {
      if (res.success && res.data) {
        const p = res.data;
        const isInStock = p.inStock !== false && (p.stock === undefined || Number(p.stock) > 0);
        
        // Compute returnable status from existing product data
        const isProductReturnable = p.isReturnable !== undefined
          ? Boolean(p.isReturnable)
          : !(p.returnDays === 0 || p.returnDays === '0' || (typeof p.returnPolicy === 'string' && p.returnPolicy.toLowerCase().includes('non')));
        
        const daysVal = p.returnDays !== undefined && Number(p.returnDays) > 0
          ? String(p.returnDays)
          : (isProductReturnable ? '7' : '0');

        setForm({
          name:             p.name             || '',
          category:         p.category         || '',
          description:      p.description      || '',
          price:            p.price            !== undefined ? String(p.price) : '',
          originalPrice:    p.originalPrice    ? String(p.originalPrice) : '',
          stock:            p.stock            !== undefined ? String(p.stock) : '5',
          inStock:          isInStock,
          trending:         Boolean(p.trending),
          applicableCoupon: p.applicableCoupon || '',
          isReturnable:     isProductReturnable,
          returnDays:       daysVal,
        });
        setExistingImages(p.images || []);
      } else {
        showToast('error', 'Product not found.');
      }
      setLoadingProduct(false);
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return showToast('error', 'Product name is required.');
    if (!form.category)    return showToast('error', 'Please select a category.');
    if (!form.price || isNaN(Number(form.price))) return showToast('error', 'Enter a valid price.');
    if (!isEditMode && imageFiles.length === 0) return showToast('error', 'Please upload at least one product image.');

    if (form.isReturnable) {
      const days = Number(form.returnDays);
      if (!form.returnDays || isNaN(days) || days < 1) {
        return showToast('error', 'Please specify a valid return period in days (e.g. 7, 15, 30 days).');
      }
    }

    setSubmitting(true);
    try {
      const stockNum = form.inStock ? (form.stock ? Number(form.stock) : 5) : 0;
      const returnDaysNum = form.isReturnable ? Math.max(1, Math.round(Number(form.returnDays))) : 0;
      const returnPolicyStr = form.isReturnable ? `${returnDaysNum}-day return` : 'Non-returnable';

      const productData = {
        name:             form.name.trim(),
        category:         form.category,
        description:      form.description.trim(),
        price:            Number(form.price),
        originalPrice:    form.originalPrice ? Number(form.originalPrice) : null,
        stock:            stockNum,
        inStock:          form.inStock,
        trending:         form.trending,
        applicableCoupon: form.applicableCoupon || '',
        isReturnable:     form.isReturnable,
        returnDays:       returnDaysNum,
        returnPolicy:     returnPolicyStr,
        discount:         form.originalPrice
          ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
          : null,
      };

      if (isEditMode) {
        const result = await updateProduct(id, productData, imageFiles);
        if (result.success) {
          showToast('success', `Product "${form.name}" updated successfully!`);
          setTimeout(() => navigate('/admin/products'), 1200);
        } else {
          showToast('error', result.error || 'Failed to update product.');
        }
      } else {
        const result = await addProduct(productData, imageFiles);
        if (result.success) {
          showToast('success', `Product "${form.name}" added successfully!`);
          setForm(INITIAL_FORM);
          setImages([]);
          setTimeout(() => navigate('/admin/products'), 1200);
        } else {
          showToast('error', result.error || 'Failed to add product.');
        }
      }
    } catch (err) {
      showToast('error', 'Unexpected error. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="admin-page fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--text-warm-grey)' }}>Loading product details…</p>
      </div>
    );
  }

  return (
    <div className="admin-page fade-in">

      {/* Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="admin-btn-back"
            onClick={() => navigate('/admin/products')}
            title="Back to Products"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="admin-page-title">
              {isEditMode ? 'Edit Heritage Product' : 'Add New Heritage Product'}
            </h1>
            <p className="admin-page-subtitle">
              {isEditMode
                ? `Updating: ${form.name || 'Product details'}`
                : 'Publish authentic handcrafted items with Cloudinary images & live Firestore sync'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn-ghost"
          onClick={() => navigate('/admin/products')}
        >
          View All Products
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type} fade-in`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="admin-form">

        {/* ── Basic Details ───────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Basic Information</h3>

          <div className="admin-form-row admin-form-row-2">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-name">Product Name *</label>
              <input id="prod-name" name="name" type="text" className="admin-field-input"
                placeholder="e.g. Royal Kantha Embroidered Saree"
                value={form.name} onChange={handleChange} required />
            </div>

            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-category">Category *</label>
              <select id="prod-category" name="category" className="admin-field-input admin-field-select"
                value={form.category} onChange={handleChange} required>
                <option value="">— Select Category —</option>
                {adminCategoryOptions.map(catName => (
                  <option key={catName} value={catName}>{catName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="prod-desc">Description</label>
            <textarea id="prod-desc" name="description" className="admin-field-input admin-field-textarea"
              rows={4} placeholder="Describe the craft, origin, materials and artisan story…"
              value={form.description} onChange={handleChange} />
          </div>
        </div>

        {/* ── Pricing & Stock ─────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Pricing &amp; Stock</h3>

          <div className="admin-form-row admin-form-row-3">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-price">Sale Price (₹) *</label>
              <input id="prod-price" name="price" type="number" min="0" className="admin-field-input"
                placeholder="e.g. 18500"
                value={form.price} onChange={handleChange} required />
            </div>

            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-original">Original Price (₹)</label>
              <input id="prod-original" name="originalPrice" type="number" min="0" className="admin-field-input"
                placeholder="e.g. 22000 (optional)"
                value={form.originalPrice} onChange={handleChange} />
            </div>

            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-stock">Stock Units</label>
              <input id="prod-stock" name="stock" type="number" min="0" className="admin-field-input"
                placeholder="e.g. 5"
                value={form.stock} onChange={handleChange} disabled={!form.inStock} />
            </div>
          </div>

          {/* Applicable Coupon Dropdown */}
          <div className="admin-field-group" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-subtle)' }}>
            <label className="admin-field-label" htmlFor="prod-coupon" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={16} color="var(--primary-terracotta)" />
              <span>Applicable Coupon (Optional)</span>
            </label>
            <select
              id="prod-coupon"
              name="applicableCoupon"
              className="admin-field-input admin-field-select"
              value={form.applicableCoupon}
              onChange={handleChange}
            >
              <option value="">— Select Coupon (Optional) —</option>
              {coupons.map((c) => (
                <option key={c.id} value={c.code}>
                  🎟️ {c.code} ({c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`})
                </option>
              ))}
            </select>
          </div>

          {/* Discount preview */}
          {form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price) && (
            <p className="admin-discount-preview">
              💰 Discount: <strong>{Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)}%</strong> off (save ₹{(Number(form.originalPrice) - Number(form.price)).toLocaleString('en-IN')})
            </p>
          )}
        </div>

        {/* ── Return Policy Section ────────────────────────────────────────── */}
        <div className="admin-form-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={18} color="var(--primary-terracotta)" />
              <h3 className="admin-form-section-title" style={{ margin: 0 }}>Return Policy</h3>
            </div>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: form.isReturnable ? 'rgba(74, 124, 89, 0.12)' : 'rgba(184, 92, 56, 0.12)',
              color: form.isReturnable ? 'var(--secondary-olive)' : 'var(--primary-terracotta)',
              border: form.isReturnable ? '1px solid rgba(74, 124, 89, 0.25)' : '1px solid rgba(184, 92, 56, 0.25)'
            }}>
              {form.isReturnable ? `✓ ${form.returnDays || 7}-Day Return` : '✕ Non-returnable'}
            </span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-warm-grey)', marginBottom: '1.2rem' }}>
            Configure whether this individual product can be returned by customers and the applicable return window in days. This information is dynamically shown on product cards across the website.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Option 1: Returnable Product */}
            <div
              onClick={() => setForm(prev => ({ ...prev, isReturnable: true, returnDays: prev.returnDays && Number(prev.returnDays) > 0 ? prev.returnDays : '7' }))}
              style={{
                border: form.isReturnable ? '2px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                backgroundColor: form.isReturnable ? 'rgba(184, 92, 56, 0.05)' : '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-charcoal)', fontSize: '0.92rem' }}>
                <input
                  type="radio"
                  name="returnableRadio"
                  checked={form.isReturnable === true}
                  onChange={() => setForm(prev => ({ ...prev, isReturnable: true, returnDays: prev.returnDays && Number(prev.returnDays) > 0 ? prev.returnDays : '7' }))}
                  style={{ accentColor: 'var(--primary-terracotta)', width: '16px', height: '16px' }}
                />
                <span>Returnable Product</span>
              </label>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-warm-grey)', marginTop: '0.35rem', marginLeft: '1.6rem' }}>
                Product can be returned within the specified number of days.
              </span>
            </div>

            {/* Option 2: Non-returnable Product */}
            <div
              onClick={() => setForm(prev => ({ ...prev, isReturnable: false, returnDays: '0' }))}
              style={{
                border: !form.isReturnable ? '2px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                backgroundColor: !form.isReturnable ? 'rgba(184, 92, 56, 0.05)' : '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: 600, color: 'var(--text-charcoal)', fontSize: '0.92rem' }}>
                <input
                  type="radio"
                  name="returnableRadio"
                  checked={form.isReturnable === false}
                  onChange={() => setForm(prev => ({ ...prev, isReturnable: false, returnDays: '0' }))}
                  style={{ accentColor: 'var(--primary-terracotta)', width: '16px', height: '16px' }}
                />
                <span>Non-returnable Product</span>
              </label>
              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-warm-grey)', marginTop: '0.35rem', marginLeft: '1.6rem' }}>
                Final sale item. Product card will display "Non-returnable".
              </span>
            </div>
          </div>

          {/* Return Window in Days (Active when Returnable) */}
          {form.isReturnable && (
            <div className="admin-field-group" style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-subtle)' }}>
              <label className="admin-field-label" htmlFor="prod-return-days" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Return Period (in Days) *</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-warm-grey)', fontWeight: 400 }}>e.g. 7, 10, 15, 30 days</span>
              </label>
              
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  id="prod-return-days"
                  name="returnDays"
                  type="number"
                  min="1"
                  max="180"
                  className="admin-field-input"
                  style={{ maxWidth: '140px' }}
                  placeholder="7"
                  value={form.returnDays}
                  onChange={(e) => setForm(prev => ({ ...prev, returnDays: e.target.value }))}
                  required={form.isReturnable}
                />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-charcoal)', fontWeight: 500 }}>
                  days from delivery date
                </span>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
                  {['7', '10', '15', '30'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, returnDays: preset }))}
                      style={{
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.78rem',
                        border: form.returnDays === preset ? '1.5px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                        backgroundColor: form.returnDays === preset ? 'var(--primary-terracotta)' : '#ffffff',
                        color: form.returnDays === preset ? '#ffffff' : 'var(--text-charcoal)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {preset} Days
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Availability & Badges ───────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Availability &amp; Badges</h3>
          <div className="admin-checkbox-row">
            <label className="admin-checkbox-label">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange} className="admin-checkbox" />
              <span>📦 In Stock / Available</span>
              <span className="admin-checkbox-hint">Uncheck to mark Out of Stock (product stays in Collections, image appears hazy)</span>
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="admin-checkbox" />
              <span>🔥 Trending Product</span>
              <span className="admin-checkbox-hint">Shown in Trending section</span>
            </label>
          </div>
        </div>

        {/* ── Images ──────────────────────────────────────────────────────── */}
        <div className="admin-form-card">
          {isEditMode && existingImages.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-field-label">Current Product Images</label>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {existingImages.map((img, idx) => (
                  <div key={idx} className="img-uploader-thumb">
                    <img src={img.url} alt={`existing-${idx}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <ImageUploader
            label={isEditMode ? 'Add New Images (optional)' : 'Product Images * (uploaded to Cloudinary)'}
            files={imageFiles}
            onFilesChange={setImages}
            multiple={true}
            maxFiles={8}
          />
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => navigate('/admin/products')}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="admin-btn-spinner" />
                {isEditMode ? 'Updating Product…' : 'Uploading & Saving…'}
              </span>
            ) : isEditMode ? 'Save Changes' : '📦 Add Product'}
          </button>
        </div>

      </form>
    </div>
  );
};
