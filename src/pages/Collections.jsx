import React, { useState } from 'react';
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
    inStockOnly,
    setInStockOnly,
    sortBy,
    setSortBy
  } = useShop();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
      if (product.price > priceRange) {
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
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(25000);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="fade-in" style={{ paddingTop: '100px', paddingBottom: '5rem', backgroundColor: 'var(--bg-warm-linen)', minHeight: '100vh' }}>
      <div className="container" style={{ padding: '0 1rem' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <span style={{ color: 'var(--primary-terracotta)', fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            Gandhorbi Heritage Collection
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginTop: '4px' }}>
            Explore Handcrafted Artistry
          </h1>
        </div>

        {/* TOP SEARCH BAR */}
        <div style={{ maxWidth: '650px', margin: '0 auto 1.5rem auto', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-terracotta)' }} />
          <input
            type="text"
            placeholder="Search by craft name, saree silk, Dokra statue, dhoti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.9rem 1rem 0.9rem 3rem',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-subtle)',
              fontSize: '0.95rem',
              outline: 'none',
              backgroundColor: 'var(--bg-soft-ivory)',
              boxShadow: 'var(--shadow-card)',
              fontFamily: 'var(--font-body)'
            }}
          />
        </div>

        {/* HORIZONTAL CATEGORIES BAR (SWIPEABLE TOUCH SCROLL ON MOBILE) */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            className="horizontal-category-scroll"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '0.6rem',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}
          >
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-nav)',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === 'All' ? 700 : 500,
                backgroundColor: selectedCategory === 'All' ? 'var(--primary-terracotta)' : 'var(--bg-soft-ivory)',
                color: selectedCategory === 'All' ? '#ffffff' : 'var(--text-charcoal)',
                border: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap',
                transition: 'var(--transition-fast)',
                flexShrink: 0
              }}
            >
              All ({products.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  style={{
                    padding: '0.55rem 1.2rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-nav)',
                    fontSize: '0.85rem',
                    fontWeight: isSelected ? 700 : 500,
                    backgroundColor: isSelected ? 'var(--primary-terracotta)' : 'var(--bg-soft-ivory)',
                    color: isSelected ? '#ffffff' : 'var(--text-charcoal)',
                    border: '1px solid var(--border-subtle)',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition-fast)',
                    flexShrink: 0
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE FILTER TOGGLE BUTTON */}
        <div className="mobile-filter-bar" style={{ display: 'none', marginBottom: '1.2rem' }}>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            style={{
              width: '100%',
              padding: '0.8rem 1.2rem',
              backgroundColor: 'var(--bg-soft-ivory)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-nav)',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: 'var(--text-charcoal)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="var(--primary-terracotta)" />
              <span>Filter & Sort Options</span>
            </div>
            {mobileFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* MAIN LAYOUT: LEFT SIDEBAR (FILTERS ONLY) + MAIN PRODUCT GRID */}
        <div className="collections-grid-layout">
          
          {/* LEFT SIDEBAR (FILTERS ONLY) */}
          <aside
            className={`collections-sidebar ${mobileFiltersOpen ? 'mobile-show' : ''}`}
            style={{
              backgroundColor: 'var(--bg-soft-ivory)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              position: 'sticky',
              top: '100px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} color="var(--primary-terracotta)" />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-charcoal)' }}>
                  Filters
                </h3>
              </div>
              
              <button
                onClick={resetFilters}
                style={{ fontSize: '0.8rem', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>

            {/* Filter 1: Sort By */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-charcoal)' }}>
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
                <option value="rating">Customer Rating</option>
              </select>
            </div>

            {/* Filter 2: Price Range */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontFamily: 'var(--font-nav)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-charcoal)' }}>
                  Price Range
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-terracotta)' }}>
                  Up to ₹{priceRange.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={25000}
                step={500}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-terracotta)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-warm-grey)', marginTop: '2px' }}>
                <span>₹3,000</span>
                <span>₹25,000</span>
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

          {/* MAIN SECTION: RESPONSIVE PRODUCT GRID */}
          <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.9rem' }}>
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
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 580px) {
          .product-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
