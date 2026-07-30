import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { About } from './pages/About';
import { Events } from './pages/Events';
import { Contact } from './pages/Contact';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { UserAccountModal } from './components/UserAccountModal';
import { QuickViewModal } from './components/QuickViewModal';
import { Toast } from './components/Toast';
import { FloatingSideTab } from './components/FloatingSideTab';

const PageRenderer = () => {
  const { currentPage } = useShop();

  switch (currentPage) {
    case 'collections':
      return <Collections />;
    case 'about':
      return <About />;
    case 'events':
      return <Events />;
    case 'contact':
      return <Contact />;
    case 'home':
    default:
      return <Home />;
  }
};

export default function App() {
  return (
    <ShopProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <PageRenderer />
        </main>
        <Footer />

        {/* Global Floating Side Contact Panel */}
        <FloatingSideTab />

        {/* Global Drawers & Modals */}
        <CartDrawer />
        <CheckoutModal />
        <WishlistDrawer />
        <SearchModal />
        <UserAccountModal />
        <QuickViewModal />
        <Toast />
      </div>
    </ShopProvider>
  );
}
