/**
 * AdminSidebar.jsx
 * Hamburger-triggered slide-in sidebar for the Admin Portal.
 * Trigger button uses a glassmorphism circular vertical three-dots (⋮) button on mobile.
 */
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, Tag, LogOut, MoreVertical, X } from 'lucide-react';
import { signOut } from '../../services/auth';

const MENU_ITEMS = [
  { label: 'Dashboard',        icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Products',         icon: Package,         path: '/admin/products' },
  { label: 'Events',           icon: Calendar,        path: '/admin/events' },
  { label: 'Offers & Coupons', icon: Tag,             path: '/admin/coupons' },
];

export const AdminSidebar = ({ open, onToggle }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const sidebarRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onToggle(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onToggle]);

  const handleNav = (path) => {
    navigate(path);
    onToggle(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      {/* Floating vertical three-dots (⋮) trigger button */}
      <button
        className="admin-hamburger"
        onClick={() => onToggle(!open)}
        aria-label={open ? 'Close menu' : 'Open admin navigation'}
        title={open ? 'Close menu' : 'Open admin navigation'}
      >
        {open ? <X size={22} /> : <MoreVertical size={22} />}
      </button>

      {/* Overlay backdrop */}
      {open && <div className="admin-sidebar-overlay" onClick={() => onToggle(false)} />}

      {/* Side panel */}
      <aside ref={sidebarRef} className={`admin-sidebar${open ? ' admin-sidebar-open' : ''}`}>

        {/* Sidebar header */}
        <div className="admin-sidebar-header">
          <span className="admin-sidebar-brand">Admin Portal</span>
        </div>

        {/* Navigation items */}
        <nav className="admin-sidebar-nav">
          {MENU_ITEMS.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <button
                key={path}
                className={`admin-sidebar-item${isActive ? ' admin-sidebar-active' : ''}`}
                onClick={() => handleNav(path)}
              >
                <Icon size={19} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="admin-sidebar-footer">
          <button className="admin-sidebar-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
