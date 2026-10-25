import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guard (kept static for instant outer frame rendering)
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages (Code-split with dynamic import)
const HomePage = lazy(() => import('../pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('../pages/public/AboutPage').then((m) => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('../pages/public/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const ServiceDetailPage = lazy(() => import('../pages/public/ServiceDetailPage').then((m) => ({ default: m.ServiceDetailPage })));
const MenuPage = lazy(() => import('../pages/public/MenuPage').then((m) => ({ default: m.MenuPage })));
const GalleryPage = lazy(() => import('../pages/public/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const EnquiryPage = lazy(() => import('../pages/public/EnquiryPage').then((m) => ({ default: m.EnquiryPage })));
const ContactPage = lazy(() => import('../pages/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('../pages/public/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// Admin Pages (Deferred to separate bundle to keep public bundle light & fast)
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminEnquiriesPage = lazy(() => import('../pages/admin/AdminEnquiriesPage').then((m) => ({ default: m.AdminEnquiriesPage })));
const AdminEnquiryDetailPage = lazy(() => import('../pages/admin/AdminEnquiryDetailPage').then((m) => ({ default: m.AdminEnquiryDetailPage })));
const AdminSettingsPage = lazy(() => import('../pages/admin/AdminSettingsPage').then((m) => ({ default: m.AdminSettingsPage })));

// Smooth, non-jarring loading fallback indicator
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[45vh] flex flex-col items-center justify-center py-16 px-4 animate-fadeIn">
    <div className="w-9 h-9 border-2 border-stone-200 border-t-maroon-800 rounded-full animate-spin" />
    <span className="mt-3 text-[11px] font-semibold text-stone-500 tracking-wider uppercase">
      Loading...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* 1. Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 2. Admin Authentication Route */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 3. Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="enquiries" element={<AdminEnquiriesPage />} />
          <Route path="enquiries/:id" element={<AdminEnquiryDetailPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
