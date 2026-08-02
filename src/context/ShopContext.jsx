import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { products as initialProducts } from '../data/products';
import { db } from '../services/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import { validateCoupon, recordCouponUsage } from '../services/coupons';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current page ID based on location.pathname
  const getPageFromPath = (path) => {
    if (path === '/') return 'home';
    if (path.startsWith('/collections')) return 'collections';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/events')) return 'events';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/cart')) return 'cart';
    if (path.startsWith('/wishlist')) return 'wishlist';
    if (path.startsWith('/product')) return 'product';
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  };

  const currentPage = getPageFromPath(location.pathname);
  
  // Real-Time Products Sync from Firestore
  const [liveProducts, setLiveProducts] = useState(initialProducts);

  useEffect(() => {
    if (!db) return;
    let unsub = () => {};
    try {
      unsub = onSnapshot(collection(db, 'products'), (snap) => {
        if (snap.docs) {
          const firestoreProducts = snap.docs.map((docItem) => {
            const data = docItem.data();
            const mainImg = data.images?.[0]?.url || data.image || '';
            const gallery = data.images?.map((i) => i.url) || [mainImg];

            return {
              id: docItem.id,
              name: data.name,
              category: data.category,
              price: data.price,
              originalPrice: data.originalPrice,
              description: data.description,
              inStock: (data.stock ?? 0) > 0,
              stock: data.stock ?? 0,
              featured: Boolean(data.featured),
              trending: Boolean(data.trending),
              hidden: Boolean(data.hidden),
              image: mainImg,
              gallery,
              rating: data.rating || 4.9,
              reviewsCount: data.reviewsCount || 12,
            };
          });

          setLiveProducts(firestoreProducts);
        }
      });
    } catch (e) {
      console.warn('[ShopContext] Firestore snapshot error:', e);
    }
    return () => unsub();
  }, []);

  // Filter out hidden products for the public website
  const publicProducts = liveProducts.filter((p) => !p.hidden);

  // Cart & Wishlist State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gandhorbi_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('gandhorbi_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Modals & Drawers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(25000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Automatically sync category filter from URL query string (/collections?category=Kantha%20Dupattas)
  useEffect(() => {
    if (location.pathname.startsWith('/collections')) {
      const searchParams = new URLSearchParams(location.search);
      const catParam = searchParams.get('category');
      if (catParam) {
        setSelectedCategory(catParam);
      }
    }
  }, [location]);

  // Persist Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('gandhorbi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gandhorbi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Automatically clean up deleted & out-of-stock products from Cart, Wishlist, QuickView, and storage
  useEffect(() => {
    if (!liveProducts || liveProducts.length === 0) return;

    const productMap = new Map(liveProducts.map((p) => [p.id, p]));

    setCart((prevCart) => {
      const removedNames = [];
      const cleaned = prevCart.filter((item) => {
        const liveP = productMap.get(item.product?.id);
        if (!liveP) return false; // Deleted product
        const isOutOfStock = !liveP.inStock || (liveP.stock !== undefined && Number(liveP.stock) <= 0);
        if (isOutOfStock) {
          removedNames.push(liveP.name);
          return false; // Out-of-stock product
        }
        return true;
      });

      if (cleaned.length !== prevCart.length) {
        localStorage.setItem('gandhorbi_cart', JSON.stringify(cleaned));
      }

      if (removedNames.length > 0) {
        removedNames.forEach((name) => {
          showToast(`"${name}" has been removed from your cart because it is now out of stock.`);
        });
      }

      return cleaned;
    });

    // Wishlist: remove deleted products, but KEEP out-of-stock products in wishlist!
    setWishlist((prevWishlist) => {
      const cleaned = prevWishlist.filter((item) => item && productMap.has(item.id));
      if (cleaned.length !== prevWishlist.length) {
        localStorage.setItem('gandhorbi_wishlist', JSON.stringify(cleaned));
      }
      return cleaned;
    });

    setQuickViewProduct((prev) => (prev && !productMap.has(prev.id) ? null : prev));

    ['gandhorbi_recently_viewed', 'gandhorbi_recent'].forEach((key) => {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter((item) => {
              const itemId = typeof item === 'string' ? item : item?.id;
              return itemId && productMap.has(itemId);
            });
            localStorage.setItem(key, JSON.stringify(cleaned));
            sessionStorage.setItem(key, JSON.stringify(cleaned));
          }
        } catch (e) {}
      }
    });
  }, [liveProducts]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const isOutOfStock = !product.inStock || (product.stock !== undefined && Number(product.stock) <= 0);
    if (isOutOfStock) {
      showToast(`"${product.name}" is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your cart`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart");
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist`);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Totals calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartDiscountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const cartFinalTotal = Math.max(0, cartSubtotal - cartDiscountAmount);

  // Apply Coupon method
  const applyCoupon = async (rawCode) => {
    const res = await validateCoupon(rawCode, cart, cartSubtotal);

    if (res.valid) {
      setAppliedCoupon({
        code: res.code,
        coupon: res.coupon,
        discountAmount: res.discountAmount,
      });
      showToast(`Coupon "${res.code}" applied! You save ₹${res.discountAmount.toLocaleString('en-IN')}.`);
      return { success: true, discountAmount: res.discountAmount };
    } else {
      showToast(res.error || 'Invalid coupon.');
      return { success: false, error: res.error };
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.");
  };

  // WhatsApp Order Submission
  const processWhatsAppCheckout = async (customerDetails) => {
    const origin = window.location.origin;

    const itemsText = cart
      .map((item, index) => {
        const productUrl = `${origin}/product/${item.product.id}`;
        const itemPrice = (item.product.price * item.quantity).toLocaleString('en-IN');
        return `${index + 1}.\nProduct Name: ${item.product.name}${item.quantity > 1 ? ` (x${item.quantity})` : ''}\nCategory: ${item.product.category}\nPrice: ₹${itemPrice}\nProduct Link:\n${productUrl}`;
      })
      .join('\n\n--------------------------------\n\n');

    const couponCodeText = appliedCoupon ? appliedCoupon.code : 'None';
    const discountText = cartDiscountAmount > 0 ? cartDiscountAmount.toLocaleString('en-IN') : '0';

    if (appliedCoupon && cartDiscountAmount > 0) {
      recordCouponUsage(appliedCoupon.coupon.id, cartDiscountAmount);
    }

    const formattedMessage = `Hello!\n\nI would like to order the following products:\n\n${itemsText}\n\n================================\n\nCoupon Applied:\n${couponCodeText}\n\nDiscount:\n₹${discountText}\n\nSubtotal:\n₹${cartSubtotal.toLocaleString('en-IN')}\n\nFinal Total:\n₹${cartFinalTotal.toLocaleString('en-IN')}\n\nTotal Products:\n${totalCartCount}\n\nPlease let me know the next steps for placing this order.\n\nThank you.`;

    const whatsappUrl = `https://wa.me/916291261549?text=${encodeURIComponent(
      formattedMessage
    )}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    showToast("Redirecting to WhatsApp to complete your order...");
  };

  // Universal Navigation Helper with URL Support
  const navigateTo = (page, categoryFilter = null) => {
    if (page === 'home' || page === '/') {
      navigate('/');
    } else if (page === 'collections' || page === '/collections') {
      if (categoryFilter) {
        setSelectedCategory(categoryFilter);
        navigate(`/collections?category=${encodeURIComponent(categoryFilter)}`);
      } else {
        navigate('/collections');
      }
    } else if (page === 'about' || page === '/about') {
      navigate('/about');
    } else if (page === 'events' || page === '/events') {
      navigate('/events');
    } else if (page === 'contact' || page === '/contact') {
      navigate('/contact');
    } else if (page === 'cart' || page === '/cart') {
      navigate('/cart');
    } else if (page === 'wishlist' || page === '/wishlist') {
      navigate('/wishlist');
    } else if (page.startsWith('/product/') || page.startsWith('product/')) {
      const path = page.startsWith('/') ? page : `/${page}`;
      navigate(path);
    } else {
      navigate(page.startsWith('/') ? page : `/${page}`);
    }
  };

  // Is Cart/Wishlist open helpers for URL routes /cart and /wishlist
  const isCartOpen = location.pathname === '/cart';
  const setIsCartOpen = (open) => {
    if (open) {
      navigate('/cart');
    } else if (location.pathname === '/cart') {
      navigate(-1);
    }
  };

  const isWishlistOpen = location.pathname === '/wishlist';
  const setIsWishlistOpen = (open) => {
    if (open) {
      navigate('/wishlist');
    } else if (location.pathname === '/wishlist') {
      navigate(-1);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products: publicProducts,
        currentPage,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        totalCartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSearchOpen,
        setIsSearchOpen,
        isUserAccountOpen,
        setIsUserAccountOpen,
        quickViewProduct,
        setQuickViewProduct,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        appliedCoupon,
        applyCoupon,
        removeAppliedCoupon,
        cartDiscountAmount,
        cartFinalTotal,
        processWhatsAppCheckout
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
