import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    navigateTo
  } = useShop();

  // Browser Back Button & Lock Scroll Integration
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Push history state so browser back button closes wishlist
      window.history.pushState({ wishlistOpen: true }, '');

      const handlePopState = () => {
        setIsWishlistOpen(false);
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isWishlistOpen, setIsWishlistOpen]);

  const handleClose = () => {
    setIsWishlistOpen(false);
    if (window.history.state && window.history.state.wishlistOpen) {
      window.history.back();
    }
  };

  if (!isWishlistOpen) return null;

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
            <Heart size={22} color="#E63946" fill="#E63946" />
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
              My Wishlist
            </h1>
          </div>

          {/* Right Counter Badge */}
          <div style={{ width: '80px', textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)', fontWeight: 600 }}>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN PAGE CONTENT */}
      <main style={{ flex: 1, padding: '2.5rem 1rem' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {wishlist.length === 0 ? (
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
                  backgroundColor: 'rgba(230, 57, 70, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  color: '#E63946'
                }}
              >
                <Heart size={38} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '0.6rem' }}>
                Your Wishlist is Empty
              </h2>
              <p style={{ color: 'var(--text-warm-grey)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                Click the heart icon on any Kantha saree, Dokra bronze sculpture, or handcrafted treasure to save it here.
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
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--text-charcoal)', marginBottom: '1.5rem' }}>
                Saved Heritage Treasures ({wishlist.length})
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="heritage-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      backgroundColor: 'var(--bg-soft-ivory)',
                      position: 'relative'
                    }}
                  >
                    {/* Item Image */}
                    <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      
                      <button
                        onClick={() => toggleWishlist(product)}
                        aria-label="Remove from wishlist"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,253,248,0.9)',
                          color: '#E63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-terracotta)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {product.category}
                        </span>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text-charcoal)', marginTop: '2px', lineHeight: 1.3 }}>
                          {product.name}
                        </h3>
                      </div>

                      <div style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary-terracotta)' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        {(() => {
                          const isOutOfStock = !product.inStock || (product.stock !== undefined && Number(product.stock) <= 0);
                          return (
                            <button
                              disabled={isOutOfStock}
                              onClick={() => {
                                if (isOutOfStock) return;
                                addToCart(product);
                                toggleWishlist(product);
                              }}
                              className="btn-primary"
                              style={
                                isOutOfStock
                                  ? { padding: '0.55rem 1rem', fontSize: '0.82rem', opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'var(--text-warm-grey)' }
                                  : { padding: '0.55rem 1rem', fontSize: '0.82rem' }
                              }
                            >
                              <ShoppingBag size={15} /> {isOutOfStock ? 'Out of Stock' : 'Move to Cart'}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
