import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { Contact } from './pages/Contact';
import { ProductDetails } from './pages/ProductDetails';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { UserAccountModal } from './components/UserAccountModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';
import { FloatingSideTab } from './components/FloatingSideTab';

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              
              {/* Routed Full-Screen Pages */}
              <Route path="/cart" element={<CartDrawer />} />
              <Route path="/wishlist" element={<WishlistDrawer />} />
              
              {/* Catch-all fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          <Footer />

          {/* Global Floating Side Contact Panel */}
          <FloatingSideTab />

          {/* Global Modals & Notifications */}
          <CheckoutModal />
          <SearchModal />
          <UserAccountModal />
          <QuickViewModal />
          <Toast />
        </div>
      </ShopProvider>
    </BrowserRouter>
  );
}
