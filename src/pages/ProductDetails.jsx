import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [countdown, setCountdown] = useState(4);

  // Automatic redirect if product is deleted while user is on the page
  useEffect(() => {
    if (!product) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/collections', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div
        className="fade-in"
        style={{
          paddingTop: '140px',
          paddingBottom: '5rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-warm-linen)',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '580px', backgroundColor: 'var(--bg-soft-ivory)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <AlertTriangle size={48} color="var(--primary-terracotta)" style={{ marginBottom: '1rem', display: 'inline-block' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
            This product is no longer available.
          </h2>
          <p style={{ color: 'var(--text-warm-grey)', marginBottom: '1.8rem', lineHeight: 1.6 }}>
            This artifact has been removed from our collection. You will be automatically redirected to the Collections page in <strong>{countdown}</strong> seconds…
          </p>
          <Link to="/collections" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
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
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const formattedMessage = `Hello!\n\nI would like to order the following product:\n\n• Product Name: ${product.name}\n• Category: ${product.category}\n• Price: ₹${(product.price * quantity).toLocaleString('en-IN')}\n\nProduct Link:\n${productUrl}\n\nThank you.`;
    const whatsappUrl = `https://wa.me/916291261549?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fade-in product-details-page"
      style={{
        paddingTop: '130px',
        paddingBottom: '5rem',
        backgroundColor: 'var(--bg-warm-linen)',
        minHeight: '100vh'
      }}
    >
      {/* Full-width wrapper — on mobile this is the full viewport width */}
      <div className="pd-outer-wrapper">

        {/* BREADCRUMB NAVIGATION */}
        <nav
          aria-label="Breadcrumb"
          className="pd-breadcrumb"
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

        {/* MAIN PRODUCT LAYOUT — two-col on desktop, single-col on mobile */}
        <div className="pd-main-grid">

          {/* ── LEFT / TOP: IMAGE GALLERY ── */}
          <div className="pd-gallery-col">

            {/* Main Featured Image */}
            <div className="pd-main-img-wrap">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="pd-main-img"
              />
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="pd-thumbs-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`pd-thumb-btn${selectedImage === imgUrl ? ' pd-thumb-active' : ''}`}
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

          {/* ── RIGHT / BOTTOM: PRODUCT INFO ── */}
          <div className="pd-info-col">

            {/* Category Badge + Rating row */}
            <div className="pd-badge-rating-row">
              <span className="pd-category-badge">
                {product.category}
              </span>
              <div className="pd-rating-block">
                <div style={{ display: 'flex', color: '#D4A44E' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#D4A44E" />
                  ))}
                </div>
                <span className="pd-rating-text">
                  {product.rating} ({product.reviewsCount} Reviews)
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="pd-title">{product.name}</h1>

            {/* Price & Savings */}
            <div className="pd-price-row">
              <span className="pd-price">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="pd-original-price">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice && (
                <span className="pd-save-badge">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Stock Badge */}
            <div className={`pd-stock-badge${!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0) ? ' pd-out-stock' : ' pd-in-stock'}`}>
              <ShieldCheck size={17} />
              <span>
                {!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)
                  ? 'OUT OF STOCK'
                  : '100% Authentic Handcrafted Artifact in Stock'}
              </span>
            </div>

            {/* Description */}
            <p className="pd-description">{product.description}</p>

            {/* Artisan Specifications */}
            {product.specifications && (
              <div className="pd-specs-box">
                <h4 className="pd-specs-title">Artisan Specifications</h4>
                <div className="pd-specs-grid">
                  <div>
                    <span className="pd-spec-label">Material:</span>
                    <strong className="pd-spec-value">{product.specifications.material}</strong>
                  </div>
                  <div>
                    <span className="pd-spec-label">Craft Technique:</span>
                    <strong className="pd-spec-value">{product.specifications.craftType}</strong>
                  </div>
                  <div>
                    <span className="pd-spec-label">Origin:</span>
                    <strong className="pd-spec-value">{product.specifications.origin}</strong>
                  </div>
                  <div>
                    <span className="pd-spec-label">Care Instructions:</span>
                    <strong className="pd-spec-value">{product.specifications.care}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* QUANTITY + WISHLIST */}
            <div className="pd-qty-wish-row">
              {/* Quantity Controls */}
              <div className="pd-qty-ctrl">
                <button
                  disabled={!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="pd-qty-btn"
                >−</button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  disabled={!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="pd-qty-btn"
                >+</button>
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`pd-wish-btn${inWishlist ? ' pd-wish-active' : ''}`}
              >
                <Heart
                  size={19}
                  fill={inWishlist ? '#E63946' : 'none'}
                  color={inWishlist ? '#E63946' : 'currentColor'}
                />
                <span>{inWishlist ? 'Saved' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* ADD TO CART + INSTANT ORDER */}
            <div className="pd-cta-row">
              <button
                disabled={!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)}
                onClick={() => {
                  addToCart(product, quantity);
                  setIsCartOpen(true);
                }}
                className="btn-primary pd-cta-btn"
                style={(!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)) ? { opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'var(--text-warm-grey)' } : {}}
              >
                <ShoppingBag size={18} />
                <span>{(!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)) ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
              </button>

              <button
                disabled={!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)}
                onClick={(!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)) ? undefined : handleWhatsAppOrder}
                className="btn-whatsapp pd-cta-btn"
                style={(!product.inStock || (product.stock !== undefined && Number(product.stock) <= 0)) ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(100%)' } : {}}
              >
                <MessageCircle size={18} />
                <span>Instant Order</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pd-trust-row">
              <div className="pd-trust-item">
                <Truck size={20} color="var(--primary-terracotta)" />
                <span>Free Shipping</span>
              </div>
              <div className="pd-trust-item">
                <Award size={20} color="var(--primary-terracotta)" />
                <span>100% Authentic</span>
              </div>
              <div className="pd-trust-item">
                <RotateCcw size={20} color="var(--primary-terracotta)" />
                <span>Fair Trade</span>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED HERITAGE PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="pd-related-section">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                You May Also Admire
              </span>
              <h2 className="heading-accent" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginTop: '6px' }}>
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
