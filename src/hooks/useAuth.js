/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * React hook — subscribes to Firebase auth state and exposes the current user.
 *
 * Usage:
 *   const { user, loading, isAuthenticated } = useAuth();
 *
 * Designed for use in the future Admin Portal route guard:
 *   if (loading) return <Spinner />;
 *   if (!isAuthenticated) return <Navigate to="/admin/login" />;
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { onAuthChanged } from '../services/auth';

/**
 * @returns {{
 *   user:            import('firebase/auth').User | null,
 *   loading:         boolean,
 *   isAuthenticated: boolean
 * }}
 */
export const useAuth = () => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state; Firebase calls back immediately with the
    // current state, then on every change thereafter.
    const unsubscribe = onAuthChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup: unsubscribe when the component using this hook unmounts.
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};
