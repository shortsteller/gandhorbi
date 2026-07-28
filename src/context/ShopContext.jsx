import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState('home');
  
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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

  // Persist Cart & Wishlist
  useEffect(() => {
    localStorage.setItem('gandhorbi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gandhorbi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
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

  // Totals calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // WhatsApp Order Submission
  const processWhatsAppCheckout = (customerDetails) => {
    const { name, phone, address, pincode, notes } = customerDetails;
    
    let productLines = cart
      .map(
        (item) =>
          `• ${item.product.name} (x${item.quantity}) - ₹${(
            item.product.price * item.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n');

    const formattedMessage = `Hello Gandhorbi Folk Arts,\n\nI would like to place the following order.\n\nCustomer Name: ${name}\n\nPhone Number: ${phone}\n\nDelivery Address: ${address}, PIN: ${pincode}\n\nProducts:\n${productLines}\n\nTotal Amount: ₹${cartSubtotal.toLocaleString(
      'en-IN'
    )}\n\nAdditional Notes: ${notes || 'None'}`;

    const whatsappUrl = `https://wa.me/916291261549?text=${encodeURIComponent(
      formattedMessage
    )}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    setIsCheckoutOpen(false);
    showToast("Redirecting to WhatsApp to complete your order...");
  };

  const navigateTo = (page, categoryFilter = null) => {
    setCurrentPage(page);
    if (categoryFilter) {
      setSelectedCategory(categoryFilter);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        products: initialProducts,
        currentPage,
        setCurrentPage,
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
        processWhatsAppCheckout
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
