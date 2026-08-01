/**
 * ProtectedRoute.jsx
 * Guards all /admin/* routes. Unauthenticated users are redirected to /admin/login.
 * Shows a minimal loading screen while Firebase resolves the auth state.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-warm-linen)',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="admin-spinner" />
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-warm-grey)', fontSize: '0.9rem' }}>
          Verifying credentials…
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
