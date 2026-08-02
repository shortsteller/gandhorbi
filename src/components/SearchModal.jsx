import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Search, X, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const SearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div
        className="fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-soft-ivory)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '900px',
          width: '95%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-charcoal)' }}>
            Search Gandhorbi Collection
          </h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
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

        {/* Input Bar */}
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-terracotta)' }} />
          <input
            type="text"
            autoFocus
            placeholder="Search for Kantha dupattas, Dokra statues, wooden crafts, dhotis, Punjabis..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.2rem',
              fontSize: '1.1rem',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--primary-terracotta)',
              outline: 'none',
              backgroundColor: '#ffffff',
              fontFamily: 'var(--font-body)'
            }}
          />
        </div>

        {/* Popular Search Suggestions */}
        {!query && (
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-warm-grey)', display: 'block', marginBottom: '0.8rem', fontWeight: 600 }}>
              Popular Heritage Searches:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
              {['Kantha Dupattas', 'Traditional Kantha Creations', 'Dokra Art', 'Wooden Crafts', 'Designer Dhotis', 'Exclusive Designer Punjabis', 'Home Decor'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  style={{
                    backgroundColor: 'var(--bg-warm-linen)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    color: 'var(--text-charcoal)',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary-terracotta)'}
                  onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {query && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.9rem' }}>
                Found {filteredProducts.length} result(s) for "{query}"
              </span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  navigateTo('collections');
                }}
                style={{ color: 'var(--primary-terracotta)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                View Full Catalog <ArrowRight size={14} />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
