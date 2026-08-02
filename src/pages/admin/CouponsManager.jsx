/**
 * CouponsManager.jsx
 * Dedicated Offers & Coupons Management page for the Admin Portal.
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  Tag, PlusCircle, Edit3, Trash2, Copy, Search, CheckCircle, AlertCircle,
  Percent, DollarSign, Calendar, Activity, Check, X, MoreVertical, RefreshCw
} from 'lucide-react';
import { db } from '../../services/firestore';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { subscribeToCoupons, deleteCoupon, toggleCouponActive } from '../../services/coupons';
import { StatCard } from '../../components/admin/StatCard';
import { CouponModal } from '../../components/admin/CouponModal';
import { AdminOverflowMenu } from '../../components/admin/AdminOverflowMenu';

export const CouponsManager = () => {
  const [coupons, setCoupons]       = useState([]);
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [toast, setToast]           = useState(null);

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isDuplicate, setIsDuplicate]   = useState(false);

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef                       = useRef(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Subscribe to Coupons & Products
  useEffect(() => {
    const unsubCoupons = subscribeToCoupons((list) => {
      setCoupons(list);
      setLoading(false);
    });

    let unsubProducts = () => {};
    if (db) {
      try {
        unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
          setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
      } catch (e) {}
    }

    return () => {
      unsubCoupons();
      unsubProducts();
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!activeMenuId) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenuId]);

  // Derived Statistics
  const now = new Date();
  const activeCoupons = coupons.filter((c) => {
    if (!c.active) return false;
    if (c.expiryDate && new Date(c.expiryDate) < now) return false;
    if (c.maxUses && c.usageCount >= c.maxUses) return false;
    return true;
  }).length;

  const expiredCoupons = coupons.filter((c) => {
    if (!c.active) return false;
    if (c.expiryDate && new Date(c.expiryDate) < now) return true;
    if (c.maxUses && c.usageCount >= c.maxUses) return true;
    return false;
  }).length;

  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0);
  const totalDiscountGiven = coupons.reduce((sum, c) => sum + (c.totalDiscountGiven || 0), 0);

  // Handlers
  const handleToggleActive = async (coupon) => {
    const res = await toggleCouponActive(coupon.id, coupon.active);
    if (res.success) {
      showToast('success', `Coupon "${coupon.code}" ${coupon.active ? 'disabled' : 'enabled'}.`);
    } else {
      showToast('error', 'Failed to toggle coupon status.');
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to permanently delete coupon "${coupon.code}"?`)) return;

    const res = await deleteCoupon(coupon.id);
    if (res.success) {
      showToast('success', `Coupon "${coupon.code}" deleted successfully.`);
    } else {
      showToast('error', res.error || 'Failed to delete coupon.');
    }
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setIsDuplicate(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsDuplicate(false);
    setModalOpen(true);
  };

  const handleOpenDuplicate = (coupon) => {
    setEditingCoupon(coupon);
    setIsDuplicate(true);
    setModalOpen(true);
  };

  const filteredCoupons = coupons.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.code?.toLowerCase().includes(term) ||
      c.name?.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (c) => {
    if (!c.active) return <span className="admin-status-badge admin-status-cancelled">Disabled</span>;
    if (c.expiryDate && new Date(c.expiryDate) < now) {
      return <span className="admin-status-badge admin-status-cancelled">Expired</span>;
    }
    if (c.maxUses && c.usageCount >= c.maxUses) {
      return <span className="admin-status-badge admin-status-upcoming">Used Up</span>;
    }
    return <span className="admin-status-badge admin-status-ongoing">Active</span>;
  };

  return (
    <div className="admin-page fade-in">
      
      {/* Page Header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Tag size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Offers &amp; Coupons</h1>
            <p className="admin-page-subtitle">Manage promotional coupon codes, discounts, and usage limits</p>
          </div>
        </div>

        <button className="admin-btn-primary" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> + Add Coupon
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Top Stat Cards */}
      <section className="admin-section">
        <div className="admin-stats-grid">
          <StatCard icon={<Tag size={24} />}          label="Total Active Coupons"    value={activeCoupons}    loading={loading} color="#25D366" />
          <StatCard icon={<Calendar size={24} />}     label="Total Expired Coupons"   value={expiredCoupons}   loading={loading} color="var(--text-warm-grey)" />
          <StatCard icon={<Activity size={24} />}     label="Total Redemptions"       value={totalRedemptions} loading={loading} color="var(--highlight-mustard)" />
          <StatCard icon={<Percent size={24} />}      label="Total Discount Given"    value={`₹${totalDiscountGiven.toLocaleString('en-IN')}`} loading={loading} color="var(--primary-terracotta)" />
        </div>
      </section>

      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="admin-field-icon-wrap" style={{ maxWidth: '340px', flex: 1 }}>
          <Search size={16} className="admin-field-icon" />
          <input
            type="text"
            className="admin-field-input"
            placeholder="Search coupons by code or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>
          Showing {filteredCoupons.length} of {coupons.length} coupons
        </span>
      </div>

      {/* Coupons Table / Cards */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 1rem auto' }} />
          <p style={{ color: 'var(--text-warm-grey)' }}>Loading coupons from Firestore…</p>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="admin-empty-msg" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
          <Tag size={42} color="var(--text-warm-grey)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
            {search ? 'No coupons match your search.' : 'No coupons added yet.'}
          </p>
          <button className="admin-quick-btn admin-quick-btn-primary" onClick={handleOpenAdd} style={{ marginTop: '1rem' }}>
            + Create First Coupon
          </button>
        </div>
      ) : (
        <div className="admin-recent-table-wrap" style={{ boxShadow: 'var(--shadow-card)', borderRadius: 'var(--radius-md)' }}>
          <table className="admin-recent-table">
            <thead>
              <tr>
                <th>Code / Name</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Usage</th>
                <th>Validity</th>
                <th>Scope</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((c) => {
                const isMenuOpen = activeMenuId === c.id;

                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: 'var(--font-nav)', fontWeight: 700, fontSize: '0.98rem', color: 'var(--primary-terracotta)', letterSpacing: '0.05em' }}>
                          {c.code}
                        </span>
                        {c.name && c.name !== c.code && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                            {c.name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-charcoal)' }}>
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `₹${c.discountValue} OFF`}
                      </span>
                      {c.minOrderAmount > 0 && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-warm-grey)' }}>
                          Min Order: ₹{c.minOrderAmount.toLocaleString('en-IN')}
                        </div>
                      )}
                    </td>

                    <td>{getStatusBadge(c)}</td>

                    <td>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {c.usageCount || 0} / {c.maxUses ? c.maxUses : '∞'}
                      </span>
                    </td>

                    <td className="admin-table-date">
                      {c.expiryDate ? (
                        <span>
                          Expires: {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      ) : (
                        <span style={{ color: '#25D366', fontWeight: 600 }}>No Expiry</span>
                      )}
                    </td>

                    <td>
                      <span className="admin-table-badge" style={{ textTransform: 'capitalize' }}>
                        {c.applicability === 'all'
                          ? 'Entire Website'
                          : c.applicability === 'categories'
                          ? `Categories (${c.applicableCategories?.length || 0})`
                          : `Products (${c.applicableProducts?.length || 0})`}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right', position: 'relative' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {/* Active toggle button */}
                        <button
                          onClick={() => handleToggleActive(c)}
                          className="admin-action-btn"
                          title={c.active ? 'Disable Coupon' : 'Enable Coupon'}
                          style={{
                            backgroundColor: c.active ? 'rgba(37, 211, 102, 0.15)' : 'rgba(230, 57, 70, 0.15)',
                            color: c.active ? '#25D366' : '#e63946',
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          {c.active ? 'Active' : 'Disabled'}
                        </button>

                        {/* Three-dots menu */}
                        <div style={{ position: 'relative' }}>
                          <AdminOverflowMenu
                            isOpen={isMenuOpen}
                            onToggle={(open) => setActiveMenuId(open ? c.id : null)}
                            ariaLabel={`Options for ${c.code}`}
                          >
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleOpenEdit(c);
                              }}
                              className="admin-dropdown-item"
                            >
                              <Edit3 size={15} color="var(--primary-terracotta)" />
                              <span>✏️ Edit Coupon</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleOpenDuplicate(c);
                              }}
                              className="admin-dropdown-item"
                            >
                              <Copy size={15} color="var(--highlight-mustard)" />
                              <span>📋 Duplicate</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                handleDelete(c);
                              }}
                              className="admin-dropdown-item admin-dropdown-delete"
                            >
                              <Trash2 size={15} color="#e63946" />
                              <span>🗑️ Delete</span>
                            </button>
                          </AdminOverflowMenu>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupon Modal */}
      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCoupon={editingCoupon}
        isDuplicate={isDuplicate}
        products={products}
      />

    </div>
  );
};
