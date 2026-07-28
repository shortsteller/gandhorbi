import React from 'react';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 2000,
        backgroundColor: 'var(--text-charcoal)',
        color: '#FFFDF8',
        padding: '0.9rem 1.4rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        borderLeft: '4px solid var(--highlight-mustard)',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: '380px',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-body)'
      }}
    >
      <Sparkles size={20} style={{ color: 'var(--highlight-mustard)', flexShrink: 0 }} />
      <span>{toastMessage}</span>
    </div>
  );
};
