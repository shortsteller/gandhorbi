/**
 * AdminLogin.jsx
 * Firebase Email/Password login page for the Admin Portal.
 * Auto-redirects to /admin/dashboard if already authenticated.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signIn } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail]       = useState('');
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
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setSubmitting(true);
    setError('');
    const result = await signIn(email, password);
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

          {/* Email */}
          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="admin-email">
              Email Address
            </label>
            <div className="admin-field-icon-wrap">
              <Mail size={17} className="admin-field-icon" />
              <input
                id="admin-email"
                type="email"
                className="admin-field-input"
                placeholder="admin@gandhorbi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                placeholder="••••••••"
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
