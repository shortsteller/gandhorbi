import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useShop();

  const isWishlisted = isInWishlist(product.id);
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && Number(product.stock) <= 0);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="heritage-card product-card-responsive" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Image Container with Actions */}
      <div className="product-card-img-wrap" style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#F0ECE1' }}>
        
        {/* Category Tag */}
        <span
          className="product-card-category-badge"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 2,
            backgroundColor: 'var(--bg-soft-ivory)',
            color: 'var(--primary-terracotta)',
            fontFamily: 'var(--font-nav)',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          {product.category}
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Toggle Wishlist"
          className="product-card-wishlist-btn"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 2,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-soft-ivory)',
            color: isWishlisted ? '#E63946' : 'var(--text-charcoal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <Heart size={16} fill={isWishlisted ? '#E63946' : 'none'} />
        </button>

        {/* Out of Stock Overlay Badge */}
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 3,
              backgroundColor: 'rgba(28, 24, 21, 0.88)',
              color: '#ffffff',
              fontFamily: 'var(--font-nav)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'none',
              backdropFilter: 'blur(4px)',
              whiteSpace: 'nowrap'
            }}
          >
            Out of Stock
          </div>
        )}

        {/* Product Image (Hazy if Out of Stock) */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            filter: isOutOfStock ? 'blur(2.5px) grayscale(35%) opacity(0.75)' : 'none'
          }}
          onClick={handleProductClick}
          onMouseEnter={(e) => {
            if (!isOutOfStock) e.target.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            if (!isOutOfStock) e.target.style.transform = 'scale(1)';
          }}
        />

        {/* Hover / Touch Quick View Trigger */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="product-card-quickview-badge"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            backgroundColor: 'rgba(255, 253, 248, 0.95)',
            color: 'var(--text-charcoal)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-btn)',
            fontSize: '0.78rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            whiteSpace: 'nowrap'
          }}
        >
          <Eye size={14} /> Quick View
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Product Name */}
          <h3
            onClick={handleProductClick}
            className="product-card-title"
            style={{
              fontFamily: 'var(--font-heading)',
              lineHeight: 1.25,
              marginBottom: '0.4rem',
              cursor: 'pointer',
              color: 'var(--text-charcoal)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--primary-terracotta)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-charcoal)'}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Add to Cart */}
        <div className="product-card-footer" style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="product-card-price" style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--primary-terracotta)'
            }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="product-card-original-price" style={{
                color: 'var(--text-warm-grey)',
                textDecoration: 'line-through',
                marginLeft: '0.4rem'
              }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={() => !isOutOfStock && addToCart(product)}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            className="btn-icon product-card-cart-btn"
            title={isOutOfStock ? 'Currently Out of Stock' : 'Add to Shopping Cart'}
            style={{
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            <ShoppingBag size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};
