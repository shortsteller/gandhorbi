import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, MessageCircle, ShieldCheck, MapPin, User, Phone, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartSubtotal, processWhatsAppCheckout } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    notes: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert("Please fill in all required customer details.");
      return;
    }

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    processWhatsAppCheckout(formData);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-soft-ivory)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '650px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-terracotta)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Direct Artisan Order
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-charcoal)' }}>
              Complete Order via WhatsApp
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout"
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-warm-linen)',
              color: 'var(--text-charcoal)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Notice Info Box */}
        <div style={{
          backgroundColor: 'var(--bg-soft-sage)',
          border: '1px solid var(--secondary-olive)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.8rem',
          fontSize: '0.88rem',
          color: 'var(--text-charcoal)'
        }}>
          <MessageCircle size={20} style={{ color: '#25D366', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Authentic Direct Order:</strong> No advance online payment is required here. Clicking "Place Order via WhatsApp" generates an official order transcript sent directly to our master atelier concierge on WhatsApp at <strong>+91 6291261549</strong>.
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-warm-grey)' }} />
              <input
                type="text"
                required
                placeholder="e.g. Ananya Roy Chowdhury"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Phone & PIN Code Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
                Phone Number *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-warm-grey)' }} />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
                PIN Code *
              </label>
              <input
                type="text"
                required
                placeholder="700019"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
              Complete Delivery Address *
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-warm-grey)' }} />
              <textarea
                required
                rows={3}
                placeholder="Flat / House No., Apartment Name, Street, Landmark, City, State"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-charcoal)' }}>
              Additional Notes / Customization Requests (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-warm-grey)' }} />
              <textarea
                rows={2}
                placeholder="Specific gift wrap requests, custom sizing details, or delivery time preferences."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
          </div>

          {/* Order Brief Summary */}
          <div style={{
            backgroundColor: 'var(--bg-warm-linen)',
            padding: '1.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text-charcoal)' }}>
              Order Items Summary ({cart.length} items)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', maxHeight: '120px', overflowY: 'auto' }}>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>• {product.name} (x{quantity})</span>
                  <span style={{ fontWeight: 600 }}>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.8rem', marginTop: '0.8rem', fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-terracotta)' }}>
              <span>Total Payable Amount:</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-whatsapp"
            style={{ padding: '1rem', fontSize: '1.05rem' }}
          >
            <MessageCircle size={22} /> Place Order via WhatsApp
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-warm-grey)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={14} color="var(--primary-terracotta)" />
            Your contact details are used strictly for order fulfillment and courier delivery.
          </div>

        </form>
      </div>
    </div>
  );
};
