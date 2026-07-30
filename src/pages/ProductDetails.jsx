import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  Heart,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Star,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setIsCheckoutOpen,
    setIsCartOpen
  } = useShop();

  const product = products.find((p) => p.id === id);

  const [selectedImage, setSelectedImage] = useState(
    product ? product.image : ''
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div
        className="fade-in"
        style={{
          paddingTop: '140px',
          paddingBottom: '5rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-warm-linen)',
          minHeight: '80vh'
        }}
      >
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>
            Product Not Found
          </h2>
          <p style={{ color: 'var(--text-warm-grey)', marginBottom: '2rem' }}>
            The artifact you are looking for may have been archived or moved to another collection.
          </p>
          <Link to="/collections" className="btn-primary">
            <ArrowLeft size={16} /> Return to Collections
          </Link>
        </div>
      </div>
    );
  }

  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const inWishlist = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleWhatsAppOrder = () => {
    const formattedMessage = `Hello Gandhorbi Folk Arts,\n\nI am interested in ordering this product directly:\n\nProduct: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price.toLocaleString('en-IN')}\nQuantity: ${quantity}\nLink: ${window.location.href}\n\nPlease assist me with placing this order.`;
    const whatsappUrl = `https://wa.me/916291261549?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fade-in"
      style={{
        paddingTop: '130px',
        paddingBottom: '5rem',
        backgroundColor: 'var(--bg-warm-linen)',
        minHeight: '100vh'
      }}
    >
      <div className="container">
        
        {/* BREADCRUMB NAVIGATION */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-warm-grey)',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/" style={{ color: 'var(--text-warm-grey)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/collections" style={{ color: 'var(--text-warm-grey)' }}>Collections</Link>
          <ChevronRight size={14} />
          <Link
            to={`/collections?category=${encodeURIComponent(product.category)}`}
            style={{ color: 'var(--text-warm-grey)' }}
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary-terracotta)', fontWeight: 600 }}>
            {product.name}
          </span>
        </nav>

        {/* MAIN PRODUCT LAYOUT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          {/* LEFT: GALLERY & IMAGES */}
          <div>
            {/* Main Featured Image */}
            <div
              style={{
                width: '100%',
                height: '460px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '1.2rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}
            >
              <img
                src={selectedImage || product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'var(--transition-smooth)'
                }}
              />
            </div>

            {/* Thumbnail Carousel Selector */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImage === imgUrl ? '2px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                      opacity: selectedImage === imgUrl ? 1 : 0.7,
                      transition: 'var(--transition-fast)',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} preview ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS, SPECS & BUYING ACTIONS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Category Tag & Ratings */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--primary-terracotta)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  backgroundColor: 'var(--bg-warm-linen)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}
              >
                {product.category}
              </span>

              {/* Star Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ display: 'flex', color: '#D4A44E' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4A44E" />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-charcoal)' }}>
                  {product.rating} ({product.reviewsCount} Patron Reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                color: 'var(--text-charcoal)',
                lineHeight: 1.2,
                marginTop: '0.2rem'
              }}
            >
              {product.name}
            </h1>

            {/* Price & Savings */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.4rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: 'var(--primary-terracotta)'
                }}
              >
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontSize: '1.2rem',
                    textDecoration: 'line-through',
                    color: 'var(--text-warm-grey)'
                  }}
                >
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice && (
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#25D366', backgroundColor: 'rgba(37, 211, 102, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: product.inStock ? '#25D366' : '#E63946' }}>
              <ShieldCheck size={18} />
              <span style={{ fontWeight: 600 }}>
                {product.inStock ? '100% Authentic Handcrafted Artifact in Stock' : 'Out of Stock - Contact Concierge for Custom Stitching'}
              </span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-charcoal)', lineHeight: 1.7, fontSize: '0.98rem' }}>
              {product.description}
            </p>

            {/* Specifications Table */}
            {product.specifications && (
              <div
                style={{
                  backgroundColor: 'var(--bg-warm-linen)',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  margin: '0.5rem 0'
                }}
              >
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
                  Artisan Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-warm-grey)', display: 'block' }}>Material:</span>
                    <strong style={{ color: 'var(--text-charcoal)' }}>{product.specifications.material}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-warm-grey)', display: 'block' }}>Craft Technique:</span>
                    <strong style={{ color: 'var(--text-charcoal)' }}>{product.specifications.craftType}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-warm-grey)', display: 'block' }}>Origin:</span>
                    <strong style={{ color: 'var(--text-charcoal)' }}>{product.specifications.origin}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-warm-grey)', display: 'block' }}>Care Instructions:</span>
                    <strong style={{ color: 'var(--text-charcoal)' }}>{product.specifications.care}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* QUANTITY & PRIMARY ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-warm-linen)' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '8px 14px', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '8px 14px', fontSize: '0.98rem', fontWeight: 700 }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ padding: '8px 14px', fontSize: '1.1rem', fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1.5px solid var(--border-subtle)',
                    backgroundColor: inWishlist ? 'rgba(230, 57, 70, 0.1)' : 'var(--bg-warm-linen)',
                    color: inWishlist ? '#E63946' : 'var(--text-charcoal)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Heart size={20} fill={inWishlist ? '#E63946' : 'none'} color={inWishlist ? '#E63946' : 'currentColor'} />
                  <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

              {/* Add to Cart & Instant WhatsApp Order */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => {
                    addToCart(product, quantity);
                    setIsCartOpen(true);
                  }}
                  className="btn-primary"
                  style={{ padding: '0.9rem', justifyContent: 'center' }}
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="btn-whatsapp"
                  style={{ padding: '0.9rem', justifyContent: 'center' }}
                >
                  <MessageCircle size={18} /> Instant Order
                </button>
              </div>

            </div>

            {/* Trust Assurances */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-warm-grey)' }}>
              <div>
                <Truck size={20} color="var(--primary-terracotta)" style={{ margin: '0 auto 4px auto' }} />
                <span>Complimentary Shipping</span>
              </div>
              <div>
                <Award size={20} color="var(--primary-terracotta)" style={{ margin: '0 auto 4px auto' }} />
                <span>100% Authentic Handcraft</span>
              </div>
              <div>
                <RotateCcw size={20} color="var(--primary-terracotta)" style={{ margin: '0 auto 4px auto' }} />
                <span>Fair Trade Artisans</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED HERITAGE PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                You May Also Admire
              </span>
              <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginTop: '6px' }}>
                Related Heritage Creations
              </h2>
            </div>

            <div className="product-cards-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
