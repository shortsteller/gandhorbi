/**
 * AdminDashboard.jsx
 * Default landing page after admin login.
 * Shows live Firestore statistics, recent products/events, and quick actions.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Tag, Star, TrendingUp, Calendar, Clock, CheckCircle, Activity,
  PlusCircle, CalendarPlus, LayoutDashboard, RefreshCw
} from 'lucide-react';
import { db } from '../../services/firestore';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { StatCard } from '../../components/admin/StatCard';
import { categories } from '../../data/categories';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);

  // ── Live Firestore listeners ────────────────────────────────────────────────
  useEffect(() => {
    // Products listener
    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), orderBy('createdAt', 'desc')),
      (snap) => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { console.error('Products listener error:', err); setLoading(false); }
    );

    // Events listener
    const unsubEvents = onSnapshot(
      query(collection(db, 'events'), orderBy('createdAt', 'desc')),
      (snap) => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      (err) => console.error('Events listener error:', err)
    );

    return () => { unsubProducts(); unsubEvents(); };
  }, []);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const totalProducts  = products.length;
  const totalCategories = [...new Set(products.map(p => p.category))].length;
  const featured       = products.filter(p => p.featured).length;
  const trending       = products.filter(p => p.trending).length;

  const totalEvents    = events.length;
  const upcoming       = events.filter(e => e.status === 'Upcoming').length;
  const ongoing        = events.filter(e => e.status === 'Ongoing').length;
  const completed      = events.filter(e => e.status === 'Completed').length;

  const recentProducts = products.slice(0, 5);
  const recentEvents   = events.slice(0, 5);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const formatDate = (ts) => {
    if (!ts) return '—';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="admin-page fade-in">

      {/* Page header */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard size={22} color="var(--primary-terracotta)" />
          <div>
            <h1 className="admin-page-title">Dashboard</h1>
            <p className="admin-page-subtitle">Live overview of your store and events</p>
          </div>
        </div>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-warm-grey)', fontSize: '0.82rem' }}>
            <RefreshCw size={14} className="admin-spin" />
            Loading…
          </div>
        )}
      </div>

      {/* ── Products Stats ─────────────────────────────────────────────────── */}
      <section className="admin-section">
        <h2 className="admin-section-heading">📦 Products Overview</h2>
        <div className="admin-stats-grid">
          <StatCard icon={<Package size={24} />}  label="Total Products"    value={totalProducts}  loading={loading} />
          <StatCard icon={<Tag size={24} />}       label="Categories Used"   value={totalCategories} loading={loading} color="var(--secondary-olive)" />
          <StatCard icon={<Star size={24} />}      label="Featured Products" value={featured}       loading={loading} color="var(--highlight-mustard)" />
          <StatCard icon={<TrendingUp size={24} />} label="Trending Products" value={trending}      loading={loading} color="#25D366" />
        </div>
      </section>

      {/* ── Events Stats ──────────────────────────────────────────────────── */}
      <section className="admin-section">
        <h2 className="admin-section-heading">📅 Events Overview</h2>
        <div className="admin-stats-grid">
          <StatCard icon={<Calendar size={24} />}     label="Total Events"    value={totalEvents} loading={loading} />
          <StatCard icon={<Clock size={24} />}         label="Upcoming Events" value={upcoming}    loading={loading} color="var(--highlight-mustard)" />
          <StatCard icon={<Activity size={24} />}      label="Ongoing Events"  value={ongoing}     loading={loading} color="#25D366" />
          <StatCard icon={<CheckCircle size={24} />}   label="Completed Events" value={completed}  loading={loading} color="var(--text-warm-grey)" />
        </div>
      </section>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <section className="admin-section">
        <h2 className="admin-section-heading">⚡ Quick Actions</h2>
        <div className="admin-quick-actions">
          <button
            className="admin-quick-btn admin-quick-btn-primary"
            onClick={() => navigate('/admin/products/add')}
          >
            <PlusCircle size={20} />
            Add New Product
          </button>
          <button
            className="admin-quick-btn admin-quick-btn-secondary"
            onClick={() => navigate('/admin/events/add')}
          >
            <CalendarPlus size={20} />
            Add New Event
          </button>
        </div>
      </section>

      {/* ── Recent Products ───────────────────────────────────────────────── */}
      <section className="admin-section">
        <h2 className="admin-section-heading">🕐 Recent Products</h2>
        {recentProducts.length === 0 && !loading ? (
          <p className="admin-empty-msg">No products added yet. <button className="admin-link" onClick={() => navigate('/admin/products/add')}>Add your first product →</button></p>
        ) : (
          <div className="admin-recent-table-wrap">
            <table className="admin-recent-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.images?.[0]?.url ? (
                        <img src={p.images[0].url} alt={p.name} className="admin-table-thumb" />
                      ) : (
                        <div className="admin-table-no-img">No img</div>
                      )}
                    </td>
                    <td className="admin-table-name">{p.name || '—'}</td>
                    <td><span className="admin-table-badge">{p.category || '—'}</span></td>
                    <td>₹{(p.price || 0).toLocaleString('en-IN')}</td>
                    <td>{p.stock ?? '—'}</td>
                    <td className="admin-table-date">{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Recent Events ─────────────────────────────────────────────────── */}
      <section className="admin-section">
        <h2 className="admin-section-heading">🗓 Recent Events</h2>
        {recentEvents.length === 0 && !loading ? (
          <p className="admin-empty-msg">No events added yet. <button className="admin-link" onClick={() => navigate('/admin/events/add')}>Add your first event →</button></p>
        ) : (
          <div className="admin-recent-table-wrap">
            <table className="admin-recent-table">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Title</th>
                  <th>Venue</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(ev => (
                  <tr key={ev.id}>
                    <td>
                      {ev.banner?.url ? (
                        <img src={ev.banner.url} alt={ev.title} className="admin-table-thumb" />
                      ) : (
                        <div className="admin-table-no-img">No banner</div>
                      )}
                    </td>
                    <td className="admin-table-name">{ev.title || '—'}</td>
                    <td>{ev.venue || '—'}</td>
                    <td className="admin-table-date">{ev.startDate} → {ev.endDate}</td>
                    <td>
                      <span className={`admin-status-badge admin-status-${(ev.status || 'upcoming').toLowerCase()}`}>
                        {ev.status || '—'}
                      </span>
                    </td>
                    <td className="admin-table-date">{formatDate(ev.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
};
