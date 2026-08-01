/**
 * ProductsManager.jsx
 * Dedicated Products Management page for the Admin Portal.
 * Compact cards with a clean Material/Drive 3-dots overflow action menu.
 */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, PlusCircle, Edit3, Trash2, Star, TrendingUp,
  PackageCheck, PackageX, Search, CheckCircle, AlertCircle,
  MoreVertical, Eye, EyeOff
} from 'lucide-react';
import { db, updateDocument, deleteDocument } from '../../services/firestore';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const ProductsManager = () => {
  const navigate = useNavigate();

  const [products, setProducts]       = useState([]);
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
        query(collection(db, 'products'), orderBy('createdAt', 'desc')),
        (snap) => {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
        },
        (err) => {
          console.warn('[ProductsManager] Listener error:', err);
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn('[ProductsManager] Subscription error:', e);
      setLoading(false);
    }
    return () => unsub();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleField = async (id, fieldName, currentValue) => {
    const newValue = !currentValue;
    const res = await updateDocument('products', id, { [fieldName]: newValue });
    if (res.success) {
      showToast('success', `Updated ${fieldName}!`);
    } else {
      showToast('error', 'Failed to update setting.');
    }
  };

  const handleToggleStock = async (id, isCurrentlyOutOfStock) => {
    const newInStock = isCurrentlyOutOfStock;
    const newStock   = newInStock ? 5 : 0;
    const res = await updateDocument('products', id, { inStock: newInStock, stock: newStock });
    if (res.success) {
      showToast('success', newInStock ? 'Marked as In Stock (5 units).' : 'Marked as Out of Stock.');
    } else {
      showToast('error', 'Failed to update stock status.');
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(img => img.publicId).filter(Boolean);
      console.log('[Cloudinary Delete Reference] Public IDs to destroy:', publicIds);
    }

    const res = await deleteDocument('products', product.id);
    if (res.success) {
      showToast('success', `Deleted "${product.name}".`);
    } else {
      showToast('error', res.error || 'Failed to delete product.');
    }
  };

  // Filtered products for admin search
  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-page fade-in">

      {/* Page Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Package size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Products Management</h1>
            <p className="admin-page-subtitle">
              Manage inventory stock status, feature flags, pricing, and details
            </p>
          </div>
        </div>

        <button
          className="admin-btn-primary"
          onClick={() => navigate('/admin/products/add')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <PlusCircle size={18} /> Add Product
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
            placeholder="Search products by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-warm-grey)' }}>Loading products from Firestore…</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-msg" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Package size={40} color="var(--text-warm-grey)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
            {search ? 'No products match your search.' : 'No products found in database.'}
          </p>
          <button
            className="admin-quick-btn admin-quick-btn-primary"
            onClick={() => navigate('/admin/products/add')}
            style={{ margin: '1rem auto 0 auto' }}
          >
            <PlusCircle size={18} /> Add Your First Product
          </button>
        </div>
      ) : (
        /* Products Grid: Desktop 4, Tablet 3, Mobile 2 */
        <div className="admin-products-grid">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.inStock === false || (p.stock !== undefined && Number(p.stock) <= 0);
            const mainImg = p.images?.[0]?.url || p.image || '';
            const isMenuOpen = activeMenuId === p.id;

            return (
              <div key={p.id} className={`admin-prod-card${isOutOfStock ? ' admin-card-out-of-stock' : ''}`}>

                {/* Card Top Image & Badges */}
                <div className="admin-prod-img-wrap">
                  {mainImg ? (
                    <img
                      src={mainImg}
                      alt={p.name}
                      className="admin-prod-img"
                      style={{
                        filter: isOutOfStock ? 'blur(2px) grayscale(30%) opacity(0.75)' : 'none'
                      }}
                    />
                  ) : (
                    <div className="admin-prod-no-img">No Image</div>
                  )}

                  {/* Status overlay badges */}
                  <div className="admin-card-badges">
                    {p.hidden && <span className="admin-badge admin-badge-hidden">Hidden</span>}
                    {p.featured && <span className="admin-badge admin-badge-featured">⭐ Featured</span>}
                    {p.trending && <span className="admin-badge admin-badge-trending">🔥 Trending</span>}
                  </div>

                  <span className={`admin-stock-badge ${isOutOfStock ? 'admin-stock-out' : 'admin-stock-in'}`}>
                    {isOutOfStock ? 'Out of Stock' : `In Stock (${p.stock ?? 1})`}
                  </span>

                  {/* Top-Right Three-Dots Action Menu Trigger */}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 20 }} ref={isMenuOpen ? menuRef : null}>
                    <button
                      className="admin-card-menu-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : p.id);
                      }}
                      aria-label="Product options"
                      title="Product options"
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
                            navigate(`/admin/products/edit/${p.id}`);
                          }}
                          className="admin-dropdown-item"
                        >
                          <Edit3 size={15} color="var(--primary-terracotta)" />
                          <span>✏️ Edit Product</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleStock(p.id, isOutOfStock);
                          }}
                          className="admin-dropdown-item"
                        >
                          {isOutOfStock ? <PackageCheck size={15} color="#25D366" /> : <PackageX size={15} color="#e63946" />}
                          <span>📦 {isOutOfStock ? 'Mark In Stock' : 'Mark Out of Stock'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleField(p.id, 'featured', p.featured);
                          }}
                          className="admin-dropdown-item"
                        >
                          <Star size={15} color={p.featured ? 'var(--highlight-mustard)' : 'var(--text-warm-grey)'} />
                          <span>⭐ {p.featured ? 'Unfeature Product' : 'Feature Product'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleField(p.id, 'trending', p.trending);
                          }}
                          className="admin-dropdown-item"
                        >
                          <TrendingUp size={15} color={p.trending ? '#25D366' : 'var(--text-warm-grey)'} />
                          <span>🔥 {p.trending ? 'Untrend Product' : 'Trend Product'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleToggleField(p.id, 'hidden', p.hidden);
                          }}
                          className="admin-dropdown-item"
                        >
                          {p.hidden ? <Eye size={15} color="#25D366" /> : <EyeOff size={15} color="#e63946" />}
                          <span>👁 {p.hidden ? 'Show on Website' : 'Hide from Website'}</span>
                        </button>

                        <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '4px 0' }} />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                            handleDelete(p);
                          }}
                          className="admin-dropdown-item admin-dropdown-danger"
                        >
                          <Trash2 size={15} color="#e63946" />
                          <span style={{ color: '#e63946' }}>🗑 Delete Product</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Compact Card Body */}
                <div className="admin-prod-body" style={{ padding: '0.75rem 0.85rem' }}>
                  <span className="admin-prod-cat">{p.category || 'General'}</span>
                  <h3 className="admin-prod-title">{p.name}</h3>
                  <div className="admin-prod-price-row">
                    <span className="admin-prod-price">₹{(p.price || 0).toLocaleString('en-IN')}</span>
                    {p.originalPrice && (
                      <span className="admin-prod-orig-price">₹{Number(p.originalPrice).toLocaleString('en-IN')}</span>
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
