/**
 * AddProduct.jsx
 * Admin form to add a new product.
 * Uploads images to Cloudinary, then saves {url, publicId} pairs in Firestore.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { addProduct } from '../../services/products';
import { categories } from '../../data/categories';

const INITIAL_FORM = {
  name: '', category: '', description: '',
  price: '', originalPrice: '', stock: '',
  featured: false, trending: false,
};

export const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState(INITIAL_FORM);
  const [imageFiles, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]       = useState(null); // { type: 'success'|'error', msg }

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

    // Basic validation
    if (!form.name.trim())     return showToast('error', 'Product name is required.');
    if (!form.category)        return showToast('error', 'Please select a category.');
    if (!form.price || isNaN(Number(form.price))) return showToast('error', 'Enter a valid price.');
    if (imageFiles.length === 0) return showToast('error', 'Please upload at least one product image.');

    setSubmitting(true);
    try {
      const productData = {
        name:          form.name.trim(),
        category:      form.category,
        description:   form.description.trim(),
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stock:         form.stock ? Number(form.stock) : 0,
        featured:      form.featured,
        trending:      form.trending,
        discount:      form.originalPrice
          ? Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)
          : null,
      };

      const result = await addProduct(productData, imageFiles);

      if (result.success) {
        showToast('success', `Product "${form.name}" added successfully!`);
        setForm(INITIAL_FORM);
        setImages([]);
        if (result.uploadErrors?.length > 0) {
          console.warn('Some images failed to upload:', result.uploadErrors);
        }
      } else {
        showToast('error', result.error || 'Failed to add product. Please try again.');
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
          <PackagePlus size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Add Product</h1>
            <p className="admin-page-subtitle">Upload to Cloudinary · Save to Firestore</p>
          </div>
        </div>
        <button className="admin-back-btn" onClick={() => navigate('/admin/dashboard')}>
          <ChevronLeft size={16} /> Dashboard
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="admin-form" noValidate>

        {/* ── Product Details ─────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Product Details</h3>

          <div className="admin-form-row">
            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-name">Product Name *</label>
              <input id="prod-name" name="name" type="text" className="admin-field-input"
                placeholder="e.g. Murshidabad Silk Kantha Saree"
                value={form.name} onChange={handleChange} required />
            </div>

            <div className="admin-field-group">
              <label className="admin-field-label" htmlFor="prod-category">Category *</label>
              <select id="prod-category" name="category" className="admin-field-input admin-field-select"
                value={form.category} onChange={handleChange} required>
                <option value="">— Select Category —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
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
          <h3 className="admin-form-section-title">Pricing & Stock</h3>

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
              <label className="admin-field-label" htmlFor="prod-stock">Stock (units)</label>
              <input id="prod-stock" name="stock" type="number" min="0" className="admin-field-input"
                placeholder="e.g. 5"
                value={form.stock} onChange={handleChange} />
            </div>
          </div>

          {/* Discount preview */}
          {form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price) && (
            <p className="admin-discount-preview">
              💰 Discount: <strong>{Math.round(((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100)}%</strong> off (save ₹{(Number(form.originalPrice) - Number(form.price)).toLocaleString('en-IN')})
            </p>
          )}
        </div>

        {/* ── Visibility ──────────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <h3 className="admin-form-section-title">Visibility Flags</h3>
          <div className="admin-checkbox-row">
            <label className="admin-checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="admin-checkbox" />
              <span>⭐ Featured Product</span>
              <span className="admin-checkbox-hint">Shown in the Featured section on Homepage</span>
            </label>
            <label className="admin-checkbox-label">
              <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="admin-checkbox" />
              <span>🔥 Trending Product</span>
              <span className="admin-checkbox-hint">Shown in the Trending section on Homepage</span>
            </label>
          </div>
        </div>

        {/* ── Images ──────────────────────────────────────────────────────── */}
        <div className="admin-form-card">
          <ImageUploader
            label="Product Images * (uploaded to Cloudinary)"
            files={imageFiles}
            onFilesChange={setImages}
            multiple={true}
            maxFiles={8}
          />
          {imageFiles.length > 0 && (
            <p className="admin-img-count">{imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected — both secure_url and public_id will be stored in Firestore.</p>
          )}
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="admin-form-actions">
          <button type="button" className="admin-btn-ghost" onClick={() => { setForm(INITIAL_FORM); setImages([]); }}>
            Reset Form
          </button>
          <button type="submit" className="admin-btn-primary" disabled={submitting}>
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="admin-btn-spinner" />
                Uploading &amp; Saving…
              </span>
            ) : '📦 Add Product'}
          </button>
        </div>

      </form>
    </div>
  );
};
