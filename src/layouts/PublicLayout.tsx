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
    // Record real-time website traffic in Firebase Firestore after route paint
    const timer = setTimeout(() => {
      firebaseTrafficService.recordPageView(pathname);
    }, 250);

    // Periodic heartbeat to keep presence indicator active while browsing
    const heartbeatInterval = setInterval(() => {
      firebaseTrafficService.recordHeartbeat();
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(heartbeatInterval);
    };
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
