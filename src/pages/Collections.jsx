import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { categories } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

export const Collections = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    maxProductPrice,
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy
  } = useShop();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchHighlighted, setSearchHighlighted] = useState(false);
  const searchInputRef = useRef(null);
  const location = useLocation();

  // Active upper price limit (defaults to max product price if priceRange is null or exceeds maxProductPrice)
  const activePriceLimit = priceRange !== null ? priceRange : maxProductPrice;

  // When navbar search icon is clicked, navigate here with ?focus=search
  // Auto-focus the input and briefly highlight it
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('focus') === 'search') {
      // Small delay to allow page render
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setSearchHighlighted(true);
        setTimeout(() => setSearchHighlighted(false), 2000);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // Filtering Logic
  const filteredProducts = products
    .filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (product.price > activePriceLimit) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(maxProductPrice);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '130px', paddingBottom: '5rem', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '0 0.8rem' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Gandhorbi Heritage Collection
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginTop: '4px' }}>
            Explore Handcrafted Artistry
          </h1>
        </div>

        {/* TOP SEARCH BAR — auto-focused when navigated from navbar search icon */}
        <div style={{ maxWidth: '650px', margin: '0 auto 1.5rem auto', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-terracotta)', pointerEvents: 'none', zIndex: 1 }} />
          <input
            ref={searchInputRef}
            id="collections-search-input"
            type="text"
            placeholder="Search by craft name, saree silk, Dokra statue, dhoti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.9rem 1rem 0.9rem 3rem',
              borderRadius: 'var(--radius-md)',
              border: searchHighlighted
                ? '2px solid var(--accent-gold)'
                : '1.5px solid var(--border-subtle)',
              fontSize: '0.95rem',
              outline: 'none',
              backgroundColor: searchHighlighted ? 'rgba(212, 164, 78, 0.07)' : 'var(--bg-soft-ivory)',
              boxShadow: searchHighlighted
                ? '0 0 0 4px rgba(212, 164, 78, 0.18), var(--shadow-card)'
                : 'var(--shadow-card)',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* MOBILE FILTER TOGGLE BAR */}
        <div className="mobile-filter-bar">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="mobile-filter-toggle-btn"
            style={{
              width: '100%',
              padding: '0.75rem 1.2rem',
              backgroundColor: 'var(--bg-soft-ivory)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-nav)',
              fontWeight: 600,
              fontSize: '0.92rem',
              color: 'var(--text-charcoal)',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="var(--primary-terracotta)" />
              <span>Filters & Sort</span>
            </div>
            {mobileFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {(selectedCategory !== 'All' || searchQuery || activePriceLimit < maxProductPrice || inStockOnly || sortBy !== 'featured') && (
            <button
              onClick={resetFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.8rem',
                color: 'var(--primary-terracotta)',
                background: 'none',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* MAIN LAYOUT: SIDEBAR + PRODUCT GRID */}
        <div className="collections-layout">
          
          {/* SIDEBAR FILTERS */}
          <aside className={`collections-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`} style={{
            backgroundColor: 'var(--bg-soft-ivory)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            position: 'sticky',
            top: '100px',
            height: 'fit-content'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} color="var(--primary-terracotta)" /> Filters
              </h3>
              {(selectedCategory !== 'All' || searchQuery || activePriceLimit < maxProductPrice || inStockOnly || sortBy !== 'featured') && (
                <button
                  onClick={resetFilters}
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--primary-terracotta)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontWeight: 600
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              )}
            </div>

            {/* Filter 1: Categories */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.6rem', color: 'var(--text-charcoal)' }}>
                Categories
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <button
                  onClick={() => setSelectedCategory('All')}
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem 0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedCategory === 'All' ? 'var(--primary-terracotta)' : 'transparent',
                    color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-warm-grey)',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: selectedCategory === 'All' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  All Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      textAlign: 'left',
                      padding: '0.5rem 0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedCategory === cat.name ? 'var(--primary-terracotta)' : 'transparent',
                      color: selectedCategory === cat.name ? '#ffffff' : 'var(--text-warm-grey)',
                      border: 'none',
                      fontSize: '0.88rem',
                      fontWeight: selectedCategory === cat.name ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-charcoal)' }}>
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  color: 'var(--text-charcoal)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Filter 2: Dynamic Price Range Slider */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
                  Price Range
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-terracotta)' }}>
                  Up to ₹{activePriceLimit.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={maxProductPrice}
                step={maxProductPrice > 5000 ? 100 : 10}
                value={activePriceLimit}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-terracotta)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                <span>₹0</span>
                <span>₹{maxProductPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Filter 3: Availability */}
            <div>
              <label style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-charcoal)' }}>
                Availability
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-terracotta)' }}
                />
                In Stock & Ready to Ship
              </label>
            </div>
          </aside>

          {/* MAIN SECTION: RESPONSIVE PRODUCT GRID (2 PRODUCTS PER ROW ON MOBILE VIEW) */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.88rem' }}>
                Showing <strong>{filteredProducts.length}</strong> handcrafted items
                {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: 'var(--bg-soft-ivory)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)'
              }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '0.6rem' }}>
                  No Heritage Products Found
                </h3>
                <p style={{ color: 'var(--text-warm-grey)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  Try adjusting your price filter or search keywords.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-cards-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* RESPONSIVE CSS STYLES FOR COLLECTIONS PAGE */}
      <style>{`
        .collections-grid-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2.2rem;
          align-items: start;
        }

        .product-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .collections-grid-layout {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .mobile-filter-bar {
            display: block !important;
          }
          .collections-sidebar {
            display: none;
            position: static !important;
            margin-bottom: 1.5rem;
          }
          .collections-sidebar.mobile-show {
            display: block !important;
          }
          .product-cards-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.8rem !important;
          }
        }

        @media (max-width: 580px) {
          .product-cards-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.65rem !important;
          }
        }
      `}</style>
    </div>
  );
};
