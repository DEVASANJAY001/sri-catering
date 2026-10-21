import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guard
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ServiceDetailPage } from '../pages/public/ServiceDetailPage';
import { MenuPage } from '../pages/public/MenuPage';
import { GalleryPage } from '../pages/public/GalleryPage';
import { EnquiryPage } from '../pages/public/EnquiryPage';
import { ContactPage } from '../pages/public/ContactPage';
import { PrivacyPolicyPage } from '../pages/public/PrivacyPolicyPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from '../pages/admin/AdminEnquiriesPage';
import { AdminEnquiryDetailPage } from '../pages/admin/AdminEnquiryDetailPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';

export const AppRoutes: React.FC = () => {
  return (
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
  );
};
