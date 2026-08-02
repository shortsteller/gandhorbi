/**
 * AdminOverflowMenu.jsx
 * Viewport-aware, Portal-rendered overflow (three-dot) dropdown menu component.
 * Attaches directly to document.body via createPortal to prevent card clipping.
 * Automatically flips vertically/horizontally to stay within viewport bounds with margin.
 */

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export const AdminOverflowMenu = ({ trigger, children, isOpen, onToggle, ariaLabel = "Options" }) => {
  const triggerRef = useRef(null);
  const menuRef    = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, maxHeight: '300px' });

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
      const margin = 14; // Margin from viewport edges

      // Default estimated menu dimensions if not yet rendered
      const menuWidth  = menuRef.current ? menuRef.current.offsetWidth : 210;
      const menuHeight = menuRef.current ? menuRef.current.offsetHeight : 240;

      // 1. Calculate Vertical placement (Top vs Bottom)
      let top;
      const spaceBelow = vh - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow >= menuHeight + margin || spaceBelow >= spaceAbove) {
        // Open downwards
        top = rect.bottom + 6;
      } else {
        // Open upwards
        top = rect.top - menuHeight - 6;
      }

      // Max available height within viewport
      const maxAvailableHeight = Math.max(120, vh - margin * 2);
      const actualMaxHeight    = Math.min(menuHeight, maxAvailableHeight);

      // Clamp vertical position
      if (top < margin) {
        top = margin;
      } else if (top + actualMaxHeight > vh - margin) {
        top = vh - actualMaxHeight - margin;
      }

      // 2. Calculate Horizontal placement (Left vs Right)
      let left = rect.right - menuWidth; // Right aligned to button by default

      // Clamp horizontal position
      if (left < margin) {
        left = margin;
      } else if (left + menuWidth > vw - margin) {
        left = vw - menuWidth - margin;
      }

      setCoords({
        top: Math.round(top),
        left: Math.round(left),
        maxHeight: `${Math.round(actualMaxHeight)}px`,
      });
    };

    // Calculate immediately and on frame
    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onToggle(false);
      }
    };

    const handleOutsideClick = (e) => {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      onToggle(false);
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen, onToggle]);

  return (
    <>
      <button
        ref={triggerRef}
        className="admin-card-menu-trigger"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(!isOpen);
        }}
        aria-label={ariaLabel}
        title={ariaLabel}
      >
        {trigger || <MoreVertical size={18} />}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="admin-card-dropdown fade-in"
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              maxHeight: coords.maxHeight,
              overflowY: 'auto',
              zIndex: 99999,
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.28), 0 4px 12px rgba(0, 0, 0, 0.15)',
              margin: 0,
              minWidth: '190px',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '6px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};
