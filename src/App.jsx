import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import { QuickViewModal }   from './components/QuickViewModal';
import { Toast }            from './components/Toast';
import { FloatingSideTab }  from './components/FloatingSideTab';

// Admin pages
import { AdminLogin }      from './pages/admin/AdminLogin';
import { AdminLayout }     from './pages/admin/AdminLayout';
import { AdminDashboard }  from './pages/admin/AdminDashboard';
import { ProductsManager } from './pages/admin/ProductsManager';
import { EventsManager }   from './pages/admin/EventsManager';
import { AddProduct }      from './pages/admin/AddProduct';
import { AddEvent }        from './pages/admin/AddEvent';
import { ProtectedRoute }  from './components/admin/ProtectedRoute';

// Public layout wrapper — renders Navbar, Outlet (page content), Footer & floating tools
const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <FloatingSideTab />
      <CheckoutModal />
      <SearchModal />
      <QuickViewModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <ScrollToTop />
        <Routes>

          {/* ── Public routes layout ────────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/"            element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/about"       element={<About />} />
            <Route path="/events"      element={<Events />} />
            <Route path="/contact"     element={<Contact />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart"        element={<CartDrawer />} />
            <Route path="/wishlist"    element={<WishlistDrawer />} />
          </Route>

          {/* ── Admin Login (with Navbar, no Footer/SideTab) ────────────────── */}
          <Route path="/admin/login" element={
            <>
              <Navbar />
              <AdminLogin />
            </>
          } />

          {/* ── Protected Admin Portal ────────────────────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <AdminLayout />
              </>
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"        element={<AdminDashboard />} />

            {/* Products Management */}
            <Route path="products"         element={<ProductsManager />} />
            <Route path="products/add"     element={<AddProduct />} />
            <Route path="products/edit/:id" element={<AddProduct />} />

            {/* Events Management */}
            <Route path="events"           element={<EventsManager />} />
            <Route path="events/add"       element={<AddEvent />} />
            <Route path="events/edit/:id"   element={<AddEvent />} />
          </Route>

          {/* ── Catch-all fallback ────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}
