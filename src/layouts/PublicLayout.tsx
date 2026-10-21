import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FloatingWhatsApp } from '../components/common/FloatingWhatsApp';

import { firebaseTrafficService } from '../services/analytics/FirebaseTrafficService';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Record real-time website traffic in Firebase Firestore
    firebaseTrafficService.recordPageView(pathname);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Floating Bottom WhatsApp Overlay for Mobile & Desktop */}
      <FloatingWhatsApp />
    </div>
  );
};
