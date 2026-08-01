import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Public pages
import { Home }           from './pages/Home';
import { Collections }    from './pages/Collections';
import { About }          from './pages/About';
import { Events }         from './pages/Events';
import { Contact }        from './pages/Contact';
import { ProductDetails } from './pages/ProductDetails';

// Global UI components
import { CartDrawer }       from './components/CartDrawer';
import { CheckoutModal }    from './components/CheckoutModal';
import { WishlistDrawer }   from './components/WishlistDrawer';
import { SearchModal }      from './components/SearchModal';
import { UserAccountModal } from './components/UserAccountModal';
import { QuickViewModal }   from './components/QuickViewModal';
import { Toast }            from './components/Toast';
import { FloatingSideTab }  from './components/FloatingSideTab';

// Admin pages
import { AdminLogin }     from './pages/admin/AdminLogin';
import { AdminLayout }    from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AddProduct }     from './pages/admin/AddProduct';
import { AddEvent }       from './pages/admin/AddEvent';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />

        <Routes>

          {/* ── Admin routes (no Footer, no FloatingSideTab) ─────────────── */}
          <Route path="/admin/login" element={
            <>
              <Navbar />
              <AdminLogin />
            </>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AdminLayout />
              </>
            </ProtectedRoute>
          }>
            {/* /admin → redirect to dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="events/add"   element={<AddEvent />} />
          </Route>

          {/* ── Public routes (with Footer + FloatingSideTab) ─────────────── */}
          <Route path="/*" element={
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/"            element={<Home />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/about"       element={<About />} />
                  <Route path="/events"      element={<Events />} />
                  <Route path="/contact"     element={<Contact />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart"        element={<CartDrawer />} />
                  <Route path="/wishlist"    element={<WishlistDrawer />} />
                  <Route path="*"            element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <FloatingSideTab />
              <CheckoutModal />
              <SearchModal />
              <UserAccountModal />
              <QuickViewModal />
              <Toast />
            </div>
          } />

        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
