import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, ShoppingBag, MessageCircle, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isInWishlist, products } = useShop();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const galleryImages = product.gallery || [product.image];
  const activeImage = galleryImages[selectedImageIndex] || product.image;
  const isWishlisted = isInWishlist(product.id);

  // Filter related products in same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleWhatsAppDirectBuy = () => {
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = `Hello!\n\nI would like to order the following product:\n\n• Product Name: ${product.name}\n• Category: ${product.category}\n• Price: ₹${(product.price * quantity).toLocaleString('en-IN')}\n\nProduct Link:\n${productUrl}\n\nThank you.`;
    
    const whatsappUrl = `https://wa.me/916291261549?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-soft-ivory)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-warm-linen)',
            color: 'var(--text-charcoal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <X size={22} />
        </button>

        {/* Product Details Main Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Left Column: Image Gallery & Zoom */}
          <div>
            <div
              style={{
                position: 'relative',
                height: '420px',
                backgroundColor: '#F0ECE1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '1rem',
                cursor: 'zoom-in'
              }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isZoomed ? 'scale(1.4)' : 'scale(1)',
                  transition: 'transform 0.4s ease'
                }}
              />
              {isZoomed && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  Zooming Craft Details
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                      opacity: selectedImageIndex === idx ? 1 : 0.7,
                      padding: 0
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Category & Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                <span style={{
                  color: 'var(--primary-terracotta)',
                  fontFamily: 'var(--font-nav)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  {product.category}
                </span>
                {product.inStock && (
                  <span style={{
                    backgroundColor: 'var(--bg-soft-sage)',
                    color: 'var(--secondary-olive)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    In Stock & Ready to Ship
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                lineHeight: 1.2,
                marginBottom: '0.8rem',
                color: 'var(--text-charcoal)'
              }}>
                {product.name}
              </h2>

              {/* Price & Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'var(--primary-terracotta)'
                  }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span style={{
                      fontSize: '1rem',
                      color: 'var(--text-warm-grey)',
                      textDecoration: 'line-through'
                    }}>
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={16} fill="var(--highlight-mustard)" color="var(--highlight-mustard)" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.85rem' }}>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p style={{
                color: 'var(--text-warm-grey)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                marginBottom: '1.5rem'
              }}>
                {product.description}
              </p>

              {/* Craft Specifications List */}
              <div style={{
                backgroundColor: 'var(--bg-warm-linen)',
                padding: '1.2rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  color: 'var(--text-charcoal)',
                  marginBottom: '0.8rem',
                  letterSpacing: '0.04em'
                }}>
                  Heritage Craft Specifications
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div><strong>Material:</strong> {product.specifications?.material}</div>
                  <div><strong>Craft Type:</strong> {product.specifications?.craftType}</div>
                  <div><strong>Origin:</strong> {product.specifications?.origin}</div>
                  <div><strong>Dimensions:</strong> {product.specifications?.dimensions}</div>
                </div>
                <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-warm-grey)' }}>
                  <strong>Care Instructions:</strong> {product.specifications?.care}
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#ffffff'
                }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ padding: '6px 14px', fontSize: '1.2rem', fontWeight: 600 }}
                  >
                    -
                  </button>
                  <span style={{ padding: '6px 16px', fontWeight: 600, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ padding: '6px 14px', fontSize: '1.2rem', fontWeight: 600 }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {(() => {
                    const isOutOfStock = !product.inStock || (product.stock !== undefined && Number(product.stock) <= 0);
                    return (
                      <button
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product, quantity)}
                        className="btn-primary"
                        style={
                          isOutOfStock
                            ? { flex: 1, justifyContent: 'center', opacity: 0.6, cursor: 'not-allowed', backgroundColor: 'var(--text-warm-grey)' }
                            : { flex: 1, justifyContent: 'center' }
                        }
                      >
                        <ShoppingBag size={18} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    );
                  })()}
                  
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="btn-secondary"
                    style={{ padding: '0.8rem', borderColor: isWishlisted ? '#E63946' : 'var(--text-charcoal)' }}
                  >
                    <Heart size={20} fill={isWishlisted ? '#E63946' : 'none'} color={isWishlisted ? '#E63946' : 'currentColor'} />
                  </button>
                </div>

                {/* Direct Buy via WhatsApp */}
                {(() => {
                  const isOutOfStock = !product.inStock || (product.stock !== undefined && Number(product.stock) <= 0);
                  return (
                    <button
                      disabled={isOutOfStock}
                      onClick={isOutOfStock ? undefined : handleWhatsAppDirectBuy}
                      className="btn-whatsapp"
                      style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(100%)' } : {}}
                    >
                      <MessageCircle size={20} /> Buy via WhatsApp (+91 6291261549)
                    </button>
                  );
                })()}
              </div>

              {/* Guarantees */}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-warm-grey)', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--primary-terracotta)" /> 100% Authentic Handcrafted
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={16} color="var(--primary-terracotta)" /> Worldwide Insured Express Delivery
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              marginBottom: '1.2rem',
              color: 'var(--text-charcoal)'
            }}>
              Related Heritage Crafts
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}>
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
