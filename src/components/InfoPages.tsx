import React from 'react';
import { X, Shield, FileText, Info, Mail, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export type InfoPageType = 'privacy' | 'terms' | 'about' | 'contact';

interface InfoPagesModalProps {
  page: InfoPageType | null;
  onClose: () => void;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ page, onClose }) => {
  if (!page) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white text-[#2E1065] rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-violet-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-violet-100 flex items-center justify-between bg-violet-50/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold shadow-sm">
              {page === 'privacy' && <Shield className="w-4 h-4" />}
              {page === 'terms' && <FileText className="w-4 h-4" />}
              {page === 'about' && <Info className="w-4 h-4" />}
              {page === 'contact' && <Mail className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-[#2E1065]">
                {page === 'privacy' && 'Privacy Policy'}
                {page === 'terms' && 'Terms of Use'}
                {page === 'about' && 'About Vantage AI'}
                {page === 'contact' && 'Contact Support'}
              </h2>
              <p className="text-[11px] text-[#7C6898]">
                Vantage AI Shopping Assistant · Updated October 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-violet-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-[#4C1D95] leading-relaxed">
          {page === 'privacy' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">1. Overview & Data Sovereignty</h3>
                <p>
                  Vantage AI ("we", "our", or "us") respects your privacy. We are built on client-first principles where your search history, preferences, and tracked products are stored locally in your browser and on your private session instance.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">2. Information We Collect</h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>Search Queries:</strong> Products you search for to deliver real-time Indian retailer pricing (Amazon India, Flipkart, Croma).</li>
                  <li><strong>Alert Destinations:</strong> Email address or Telegram Chat ID if you opt into automated price drop alerts.</li>
                  <li><strong>Technical Usage:</strong> Anonymous session telemetry, browser headers, and rate-limit token counters to prevent abuse.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">3. Third-Party Integrations</h3>
                <p>
                  Search results may link to external e-commerce platforms including Amazon.in, Flipkart.com, and Croma.com. Clicking these links directs you to third-party domains governed by their own privacy terms.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">4. Contact & Inquiries</h3>
                <p>
                  For privacy queries or data removal requests, contact us at: <span className="font-mono font-bold text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded">[YOUR EMAIL]</span>.
                </p>
              </section>
            </div>
          )}

          {page === 'terms' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">1. Acceptance of Terms</h3>
                <p>
                  By accessing or using Vantage AI, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, please refrain from using the platform.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">2. Price & Availability Disclaimer</h3>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <strong>Important Notice:</strong> Prices and availability may change without notice. Always check the retailer's store page before completing a purchase. Vantage AI may earn an affiliate commission from some qualifying retailer links.
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">3. Prohibited Usage</h3>
                <p>
                  You agree not to disrupt service operations, bypass rate limits, perform automated scraping, or execute abusive denial-of-service queries against the API.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">4. Limitation of Liability</h3>
                <p>
                  Vantage AI aggregates publicly accessible catalog information and live search data. We are not an e-commerce seller and do not handle payments, order fulfillment, shipping, or warranty claims.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">5. Legal Contact</h3>
                <p>
                  Legal notices may be submitted to: <span className="font-mono font-bold text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded">[YOUR EMAIL]</span>.
                </p>
              </section>
            </div>
          )}

          {page === 'about' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-heading font-black text-sm text-[#2E1065]">Our Mission</h3>
                <p>
                  Vantage AI is an agentic shopping research assistant designed specifically for the Indian consumer market. We help shoppers cut through marketing noise to find authentic prices, verify deals across top Indian stores, and monitor MRPs in Indian Rupees (₹).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">Core Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100">
                    <div className="font-bold text-[#7C3AED] mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Multi-Store Comparison</span>
                    </div>
                    <p className="text-xs text-slate-600">Simultaneous pricing checks across Amazon.in, Flipkart, Croma, and official brand stores.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-violet-50 border border-violet-100">
                    <div className="font-bold text-[#7C3AED] mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified PDP Links</span>
                    </div>
                    <p className="text-xs text-slate-600">Strict grounding against verified Indian e-commerce domains to eliminate fake links.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">Founding Team & Feedback</h3>
                <p>
                  Built by [YOUR COMPANY NAME / FOUNDER NAME]. Feedback and partnership inquiries are warmly welcomed at <span className="font-mono font-bold text-[#7C3AED] bg-violet-50 px-2 py-0.5 rounded">[YOUR EMAIL]</span>.
                </p>
              </section>
            </div>
          )}

          {page === 'contact' && (
            <div className="space-y-4">
              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">Get in Touch</h3>
                <p>
                  Have questions, feature requests, or partnership inquiries? Reach our team directly:
                </p>
              </section>

              <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#7C3AED]" />
                  <span className="font-semibold text-slate-700">General Support & Partnerships:</span>
                </div>
                <div className="font-mono font-bold text-[#6D28D9] text-sm pl-6">
                  [YOUR EMAIL]
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  Typical response time: Within 24-48 business hours.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="font-heading font-bold text-sm text-[#2E1065]">Report Inaccurate Data</h3>
                <p className="text-slate-600">
                  If you found an inaccurate price or wrong product image, you can also use the "Report issue" button on any product card for immediate review.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-violet-100 flex items-center justify-between bg-violet-50/40 shrink-0">
          <p className="text-[11px] text-[#7C6898]">
            Prices and availability may change. Check the store before buying.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
