import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    totalCartCount,
    setIsCheckoutOpen,
    navigateTo
  } = useShop();

  // Browser Back Button & Lock Scroll Integration
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Push history state so browser back button closes cart
      window.history.pushState({ cartOpen: true }, '');

      const handlePopState = () => {
        setIsCartOpen(false);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isCartOpen, setIsCartOpen]);

  const handleClose = () => {
    setIsCartOpen(false);
    if (window.history.state && window.history.state.cartOpen) {
      window.history.back();
    }
  };

  if (!isCartOpen) return null;

  return (
    <div
      className="fullscreen-page-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        backgroundColor: 'var(--bg-warm-linen)',
        zIndex: 25000,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* FULL-SCREEN STICKY HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 26000,
          backgroundColor: 'var(--bg-soft-ivory)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1.5rem'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1100px',
            width: '100%',
            padding: 0
          }}
        >
          {/* Top-Left Back Arrow Button */}
          <button
            onClick={handleClose}
            aria-label="Back to Previous Page"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-warm-linen)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--primary-terracotta)',
              transition: 'var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-terracotta)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-warm-linen)';
              e.currentTarget.style.color = 'var(--primary-terracotta)';
            }}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Centered Page Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--primary-terracotta)" />
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 700,
                color: 'var(--text-charcoal)',
                letterSpacing: '0.02em',
                margin: 0
              }}
            >
              Shopping Cart
            </h1>
          </div>

          {/* Right Counter Badge */}
          <div style={{ width: '80px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)', fontWeight: 600 }}>
              {totalCartCount} {totalCartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN PAGE CONTENT */}
      <main style={{ flex: 1, padding: '2.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {cart.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: 'var(--bg-soft-ivory)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                maxWidth: '600px',
                margin: '2rem auto'
              }}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-soft-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: 'var(--secondary-olive)'
                }}
              >
                <ShoppingBag size={38} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.6rem' }}>
                Your Shopping Cart is Empty
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Explore Bengal’s finest handcrafted Nakshi Kantha sarees, Dokra brass sculptures, and heritage attire.
              </p>
              <button
                onClick={() => {
                  handleClose();
                  navigateTo('collections');
                }}
                className="btn-primary"
                style={{ padding: '0.9rem 2.2rem' }}
              >
                Explore Collections <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
                alignItems: 'start'
              }}
            >
              {/* Left Column: Cart Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '0.2rem' }}>
                  Items in Your Cart ({totalCartCount})
                </h2>

                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="heritage-card"
                    style={{
                      display: 'flex',
                      gap: '1.2rem',
                      padding: '1.2rem',
                      backgroundColor: 'var(--bg-soft-ivory)',
                      alignItems: 'center'
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        flexShrink: 0
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {product.category}
                          </span>
                          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text-charcoal)', marginTop: '2px' }}>
                            {product.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          aria-label="Remove item"
                          style={{ color: 'var(--text-warm-grey)', padding: '4px' }}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                        {/* Quantity controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1.5px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--bg-warm-linen)'
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            style={{ padding: '4px 12px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-charcoal)' }}
                          >
                            -
                          </button>
                          <span style={{ padding: '4px 12px', fontSize: '0.9rem', fontWeight: 700 }}>{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            style={{ padding: '4px 12px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-charcoal)' }}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-terracotta)' }}>
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Order Summary Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-soft-ivory)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.8rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-card)',
                  position: 'sticky',
                  top: '100px'
                }}
              >
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem', marginBottom: '1.2rem' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-warm-grey)' }}>Items Total:</span>
                  <span style={{ fontWeight: 600 }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-warm-grey)' }}>Insured Express Shipping:</span>
                  <span style={{ color: '#25D366', fontWeight: 700 }}>FREE</span>
                </div>

                <div style={{ borderTop: '1.5px dashed var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Amount:</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.6rem', color: 'var(--primary-terracotta)' }}>
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--secondary-olive)', marginBottom: '1.5rem', backgroundColor: 'var(--bg-soft-sage)', padding: '0.7rem 0.9rem', borderRadius: 'var(--radius-sm)' }}>
                  <ShieldCheck size={18} />
                  <span>100% Insured Delivery & Direct Artisan Support</span>
                </div>

                <button
                  onClick={() => {
                    handleClose();
                    setIsCheckoutOpen(true);
                  }}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', justifyContent: 'center' }}
                >
                  Proceed to WhatsApp Order <ArrowRight size={18} />
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
};
