import React from 'react';
import { ShieldCheck, AlertCircle, Mail, Phone } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { KolamDivider } from '../../components/common/KolamDivider';
import { Badge } from '../../components/common/Badge';
import { SEO } from '../../components/common/SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <SEO
        title="Privacy Policy & Data Security"
        description="Privacy policy and customer data handling standards for Sri Caterers Chennai."
        canonicalPath="/privacy-policy"
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="maroon" size="md">
          Legal &amp; Data Transparency
        </Badge>
        <h1 className="font-serif text-3xl sm:text-4xl font-black text-maroon-950">
          Privacy Policy &amp; Customer Information Notice
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Last updated: October 2026 • Sri Caterers Chennai
        </p>
        <KolamDivider theme="gold" />
      </div>

      {/* Review Notice Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs sm:text-sm flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Business &amp; Legal Review Advisory:</strong> This document serves as the preliminary data handling and privacy notice for Sri Caterers. Prior to commercial publishing, it should be formally ratified by legal counsel.
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 text-stone-700 text-sm sm:text-base leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            1. Information We Collect from Customers
          </h2>
          <p>
            When you interact with our website or submit an event inquiry form, we collect only the necessary information required to prepare and coordinate your catering service:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600 text-xs sm:text-sm">
            <li><strong>Contact Details:</strong> Your full name, Indian mobile telephone number, and optional email address.</li>
            <li><strong>Event Details:</strong> Event classification (e.g. Wedding, Reception, Seemantham), planned date, estimated guest count, and event venue or municipality.</li>
            <li><strong>Catering Specifications:</strong> Selected meal preferences (Vegetarian, Non-Vegetarian, or Both), menu packages, and special dietary requests.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            2. Purpose of Information Collection
          </h2>
          <p>We process your enquiry data exclusively to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-stone-600 text-xs sm:text-sm">
            <li>Calculate customized per-leaf or complete package price quotations.</li>
            <li>Verify date availability with our central kitchen in Villivakkam &amp; Perambur.</li>
            <li>Contact you via your chosen communication method (Phone Call, WhatsApp, or Email) to confirm logistics.</li>
            <li>Coordinate delivery timings, service staff allocation, and menu tastings.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            3. Strict Prohibition on Third-Party Sharing
          </h2>
          <p>
            Sri Caterers maintains a strict zero-spam, zero-monetization policy with respect to customer personal data. We do not sell, rent, trade, or disclose your contact information to external advertisers, financial brokers, or third-party marketers under any circumstances.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            4. Access Control &amp; Administrator Security
          </h2>
          <p>
            Access to submitted customer inquiries is restricted exclusively to authorized management personnel (the five verified administrative identities responsible for operations, head chef logistics, and customer relations). Customer data is isolated within our secured administrative portal and protected with session validation.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            5. Retention Period
          </h2>
          <p>
            Enquiry records are retained for a period necessary to conclude your event and support post-event customer service (typically up to 12 months after the event date), after which they may be archived or permanently expunged.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-serif font-bold text-lg sm:text-xl text-maroon-950">
            6. Customer Rights: Rectification &amp; Deletion
          </h2>
          <p>
            You have the right to request access to the information we hold about you, request corrections if your contact number or event details change, or request complete removal of your enquiry from our database.
          </p>
          <p>
            To exercise these rights, please contact our privacy desk directly:
          </p>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-maroon-800" />
              <span>Email: <strong>{siteConfig.email}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-maroon-800" />
              <span>Direct Phone: <strong>{siteConfig.displayPhone}</strong></span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
