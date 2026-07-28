import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const UserAccountModal = () => {
  const { isUserAccountOpen, setIsUserAccountOpen, showToast } = useShop();
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  if (!isUserAccountOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setUserProfile({
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      tier: 'Heritage Connoisseur VIP'
    });
    showToast(`Welcome back, ${formData.name || 'valued patron'}!`);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsUserAccountOpen(false)}>
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-soft-ivory)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '480px',
          width: '95%',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <button
          onClick={() => setIsUserAccountOpen(false)}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-warm-linen)',
            color: 'var(--text-charcoal)'
          }}
        >
          <X size={20} />
        </button>

        {isLoggedIn ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-soft-sage)',
              color: 'var(--secondary-olive)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.2rem auto'
            }}>
              <Sparkles size={36} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-charcoal)', marginBottom: '0.4rem' }}>
              Namaskar, {userProfile?.name}!
            </h3>
            <p style={{ color: 'var(--primary-terracotta)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {userProfile?.tier}
            </p>
            <div style={{
              backgroundColor: 'var(--bg-warm-linen)',
              padding: '1.2rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div><strong>Email:</strong> {userProfile?.email}</div>
              <div><strong>Registered Phone:</strong> +91 6291261549</div>
              <div><strong>Reward Points:</strong> 1,250 Handcraft Credits</div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Atelier Access
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text-charcoal)', marginTop: '4px' }}>
                {activeTab === 'login' ? 'Welcome Back' : 'Join Our Patronage'}
              </h2>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  fontWeight: activeTab === 'login' ? 700 : 500,
                  color: activeTab === 'login' ? 'var(--primary-terracotta)' : 'var(--text-warm-grey)',
                  borderBottom: activeTab === 'login' ? '2px solid var(--primary-terracotta)' : 'none',
                  fontFamily: 'var(--font-nav)'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  fontWeight: activeTab === 'register' ? 700 : 500,
                  color: activeTab === 'register' ? 'var(--primary-terracotta)' : 'var(--text-warm-grey)',
                  borderBottom: activeTab === 'register' ? '2px solid var(--primary-terracotta)' : 'none',
                  fontFamily: 'var(--font-nav)'
                }}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {activeTab === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-warm-grey)' }} />
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-warm-grey)' }} />
                  <input
                    type="email"
                    required
                    placeholder="patron@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-warm-grey)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                {activeTab === 'login' ? 'Sign In to Account' : 'Register Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
