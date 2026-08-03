/**
 * AdminLogin.jsx
 * Username/Password login page for the Admin Portal.
 * Auto-redirects to /admin/dashboard if already authenticated.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signIn } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setSubmitting(true);
    setError('');

    // If entered username doesn't contain '@', append domain for Firebase Auth compatibility
    const authEmail = username.includes('@') ? username.trim() : `${username.trim()}@gandhorbi.com`;

    const result = await signIn(authEmail, password);
    if (result.success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  if (loading) return null; // wait for auth check

  return (
    <div className="admin-login-page">
      {/* Decorative background */}
      <div className="admin-login-bg" />

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-shield">
            <ShieldCheck size={32} color="var(--highlight-mustard)" />
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Gandhorbi Folk Arts — Secure Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>

          {/* Username */}
          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="admin-username">
              Username
            </label>
            <div className="admin-field-icon-wrap">
              <User size={17} className="admin-field-icon" />
              <input
                id="admin-username"
                type="text"
                className="admin-field-input"
                placeholder=""
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-field-icon-wrap">
              <Lock size={17} className="admin-field-icon" />
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                className="admin-field-input"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-field-eye"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="admin-btn-spinner" />
                Signing in…
              </span>
            ) : 'Sign In to Admin Portal'}
          </button>
        </form>

        <p className="admin-login-note">
          Restricted access — authorised personnel only.
        </p>
      </div>
    </div>
  );
};
