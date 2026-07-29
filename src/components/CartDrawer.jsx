import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

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

  if (!isCartOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(43, 43, 43, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.3s ease'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: 'var(--bg-soft-ivory)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-warm-linen)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={22} color="var(--primary-terracotta)" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)' }}>
              Your Heritage Bag ({totalCartCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-soft-ivory)',
              color: 'var(--text-charcoal)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-soft-sage)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: 'var(--secondary-olive)'
              }}>
                <ShoppingBag size={32} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Your Cart is Empty
              </h4>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Explore Bengal's finest Kantha sarees, Dokra bronzes, and handcrafted treasures.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('collections');
                }}
                className="btn-primary"
              >
                Explore Collections <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', lineHeight: 1.2, color: 'var(--text-charcoal)' }}>
                        {product.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 600 }}>
                        {product.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          style={{ padding: '2px 8px', fontSize: '0.9rem', fontWeight: 600 }}
                        >
                          -
                        </button>
                        <span style={{ padding: '2px 10px', fontSize: '0.85rem', fontWeight: 600 }}>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          style={{ padding: '2px 8px', fontSize: '0.9rem', fontWeight: 600 }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-terracotta)' }}>
                        ₹{(product.price * quantity).toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                        style={{ color: 'var(--text-warm-grey)', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-warm-linen)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-warm-grey)' }}>Subtotal:</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-charcoal)' }}>
                ₹{cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-olive)', marginBottom: '1.2rem' }}>
              <ShieldCheck size={16} />
              <span>Complimentary insured shipping across India</span>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Proceed to WhatsApp Order <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
