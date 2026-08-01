/**
 * StatCard.jsx
 * Reusable admin dashboard statistic card.
 */
import React from 'react';

export const StatCard = ({ icon, label, value, color = 'var(--primary-terracotta)', loading = false }) => {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ color }}>
        {icon}
      </div>
      <div className="admin-stat-body">
        <span className="admin-stat-label">{label}</span>
        {loading ? (
          <span className="admin-stat-value admin-stat-loading">—</span>
        ) : (
          <span className="admin-stat-value" style={{ color }}>{value ?? 0}</span>
        )}
      </div>
    </div>
  );
};
