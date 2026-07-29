import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, addToCart } = useShop();

  if (!isWishlistOpen) return null;

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
      onClick={() => setIsWishlistOpen(false)}
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
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)'
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
            <Heart size={22} color="#E63946" fill="#E63946" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)' }}>
              Saved Heritage Pieces ({wishlist.length})
            </h3>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
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

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'rgba(230, 57, 70, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                color: '#E63946'
              }}>
                <Heart size={32} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Your Wishlist is Empty
              </h4>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.9rem' }}>
                Click the heart icon on any Kantha saree, Dokra statue, or wooden craft to save it here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
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
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary-terracotta)' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            addToCart(product);
                            toggleWishlist(product);
                          }}
                          className="btn-primary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                        >
                          <ShoppingBag size={14} /> Move to Cart
                        </button>

                        <button
                          onClick={() => toggleWishlist(product)}
                          style={{ color: 'var(--text-warm-grey)', padding: '4px' }}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
