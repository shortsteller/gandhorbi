/**
 * AdminLayout.jsx
 * Shared layout for all protected admin pages.
 * Renders the public Navbar + AdminSidebar + <Outlet /> content.
 * Does NOT render Footer or FloatingSideTab (customer-facing only).
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar + hamburger (rendered below the fixed Navbar) */}
      <AdminSidebar open={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main content area */}
      <main className={`admin-main${sidebarOpen ? ' admin-main-shifted' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};
