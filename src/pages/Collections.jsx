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
  const [homeDecorSubcategory, setHomeDecorSubcategory] = useState('All');
  const searchInputRef = useRef(null);
  const location = useLocation();

  // Active upper price limit (defaults to max product price if priceRange is null or exceeds maxProductPrice)
  const activePriceLimit = priceRange !== null ? priceRange : maxProductPrice;

  // Reset Home Decor subcategory when top category changes
  useEffect(() => {
    setHomeDecorSubcategory('All');
  }, [selectedCategory]);

  // Handle URL category query parameter mapping
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');
    if (catParam) {
      if (catParam === 'Dokra Art' || catParam === 'Dokra') {
        setSelectedCategory('Home Decor');
        setHomeDecorSubcategory('Dokra');
      } else if (catParam === 'Wooden Crafts') {
        setSelectedCategory('Home Decor');
        setHomeDecorSubcategory('Wooden Crafts');
      }
    }
  }, [location.search]);

  // When navbar search icon is clicked, navigate here with ?focus=search
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('focus') === 'search') {
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

  // Helper to categorize Home Decor products into subcategories
  const isDokraProduct = (product) => {
    const pCat = (product.category || '').toLowerCase();
    const pName = (product.name || '').toLowerCase();
    const pDesc = (product.description || '').toLowerCase();
    return pCat === 'dokra art' || pName.includes('dokra') || pDesc.includes('dokra');
  };

  const isWoodenProduct = (product) => {
    const pCat = (product.category || '').toLowerCase();
    const pName = (product.name || '').toLowerCase();
    const pDesc = (product.description || '').toLowerCase();
    return (
      pCat === 'wooden crafts' ||
      pName.includes('wooden') ||
      pName.includes('wood ') ||
      pDesc.includes('wooden') ||
      pDesc.includes('wood ')
    );
  };

  // Filtering Logic
  const filteredProducts = products
    .filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Home Decor') {
          const isHomeDecorFamily =
            product.category === 'Home Decor' ||
            product.category === 'Dokra Art' ||
            product.category === 'Wooden Crafts';

          if (!isHomeDecorFamily) return false;

          // Subcategory filter under Home Decor
          const isDokra = isDokraProduct(product);
          const isWooden = isWoodenProduct(product);

          if (homeDecorSubcategory === 'Dokra') {
            if (!isDokra) return false;
          } else if (homeDecorSubcategory === 'Wooden Crafts') {
            if (!isWooden) return false;
          } else if (homeDecorSubcategory === 'Others') {
            if (isDokra || isWooden) return false;
          }
        } else if (product.category !== selectedCategory) {
          return false;
        }
      }

      // 2. Search Query Filter
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 3. Price Limit Filter
      if (product.price > activePriceLimit) {
        return false;
      }

      // 4. In-Stock Filter
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
    setHomeDecorSubcategory('All');
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

        {/* TOP SEARCH BAR */}
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
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease'
            }}
          />
        </div>

        {/* HORIZONTAL TOP-LEVEL CATEGORIES BAR */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            className="horizontal-category-scroll"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              All ({products.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const catCount = cat.name === 'Home Decor'
                ? products.filter((p) => p.category === 'Home Decor' || p.category === 'Dokra Art' || p.category === 'Wooden Crafts').length
                : products.filter((p) => p.category === cat.name).length;

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
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {cat.name} ({catCount})
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
              color: 'var(--text-charcoal)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={18} color="var(--primary-terracotta)" />
              <span>Filter &amp; Sort Options</span>
            </div>
            {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                style={{ fontSize: '0.8rem', color: 'var(--primary-terracotta)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
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
                style={{ width: '100%', accentColor: 'var(--primary-terracotta)', cursor: 'pointer' }}
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
                In Stock &amp; Ready to Ship
              </label>
            </div>
          </aside>

          {/* MAIN SECTION: RESPONSIVE PRODUCT GRID */}
          <main>
            
            {/* HORIZONTAL SUBCATEGORY SELECTOR (VISIBLE WHEN HOME DECOR IS SELECTED) */}
            {selectedCategory === 'Home Decor' && (
              <div style={{
                marginBottom: '1.2rem',
                backgroundColor: 'var(--bg-soft-ivory)',
                padding: '0.8rem 1.2rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--primary-terracotta)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '0.5rem'
                }}>
                  Home Decor Subcategories:
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '0.2rem',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none'
                }}>
                  {['All', 'Dokra', 'Wooden Crafts', 'Others'].map((sub) => {
                    const isSubSelected = homeDecorSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setHomeDecorSubcategory(sub)}
                        style={{
                          padding: '0.45rem 1.1rem',
                          borderRadius: 'var(--radius-full)',
                          fontFamily: 'var(--font-nav)',
                          fontSize: '0.85rem',
                          fontWeight: isSubSelected ? 700 : 500,
                          backgroundColor: isSubSelected ? 'var(--primary-terracotta)' : 'var(--bg-warm-linen)',
                          color: isSubSelected ? '#ffffff' : 'var(--text-charcoal)',
                          border: isSubSelected ? '1px solid var(--primary-terracotta)' : '1px solid var(--border-subtle)',
                          whiteSpace: 'nowrap',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)',
                          flexShrink: 0
                        }}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-warm-grey)', fontSize: '0.88rem' }}>
                Showing <strong>{filteredProducts.length}</strong> handcrafted items
                {selectedCategory !== 'All' && (
                  <span>
                    {' '}in <strong>{selectedCategory}</strong>
                    {selectedCategory === 'Home Decor' && homeDecorSubcategory !== 'All' && (
                      <span> &rarr; <strong>{homeDecorSubcategory}</strong></span>
                    )}
                  </span>
                )}
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
                  Try adjusting your price filter, subcategory selection, or search keywords.
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
        .horizontal-category-scroll::-webkit-scrollbar {
          display: none;
        }

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
