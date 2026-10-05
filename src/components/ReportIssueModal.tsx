import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export interface ProductReportData {
  id?: string;
  productName: string;
  issueType: string;
  note?: string;
  sourceUrl?: string;
  timestamp: string;
}

/**
 * Placeholder function for sending reports.
 * Connect this function to your email dispatch service (e.g. Resend, SendGrid, Nodemailer)
 * or write directly to your database (PostgreSQL / SQLite).
 */
export async function sendReportPlaceholder(report: ProductReportData): Promise<{ success: boolean; message: string }> {
  console.log('[Vantage AI - Report Submitted]', report);

  // 1. Cache locally for instant review
  try {
    const existing = JSON.parse(localStorage.getItem('vantage_user_reports') || '[]');
    existing.unshift(report);
    localStorage.setItem('vantage_user_reports', JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Could not write report to localStorage:', err);
  }

  // 2. Dispatch to backend API route placeholder
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (res.ok) {
      return { success: true, message: 'Report submitted successfully. Thank you for your feedback!' };
    }
  } catch (err) {
    // Graceful offline fallback
    console.warn('Backend report endpoint unreachable, cached in browser:', err);
  }

  return { success: true, message: 'Report logged locally. We will inspect this link promptly.' };
}

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  sourceUrl?: string;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  productName = '',
  sourceUrl = '',
}) => {
  const [prodName, setProdName] = useState(productName);
  const [issueType, setIssueType] = useState('Wrong product link');
  const [optionalNote, setOptionalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (productName) setProdName(productName);
  }, [productName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    setIsSubmitting(true);
    const reportData: ProductReportData = {
      id: `rep_${Date.now()}`,
      productName: prodName.trim(),
      issueType,
      note: optionalNote.trim() || undefined,
      sourceUrl: sourceUrl || undefined,
      timestamp: new Date().toISOString(),
    };

    await sendReportPlaceholder(reportData);
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setOptionalNote('');
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 border border-violet-100 shadow-2xl relative text-[#2E1065] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2 text-[#7C3AED]">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-[#7C3AED]">
            <Flag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base text-[#2E1065]">
              Report Wrong Link or Image
            </h3>
            <p className="text-[11px] text-[#7C6898]">Help us maintain 100% verified shopping links</p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-base text-emerald-800">
              Report Received
            </h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Thank you for helping keep Vantage AI links reliable. Our verification engine will re-audit this product.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
            {/* 1. Product Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Sony WH-1000XM5 or MacBook M3"
                className="w-full p-2.5 rounded-xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800 font-medium"
              />
            </div>

            {/* 2. Issue Type */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Issue Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800 font-medium"
              >
                <option value="Wrong product link">Wrong product link (points to wrong item)</option>
                <option value="Broken or dead URL (404)">Broken or dead URL (404 or store error)</option>
                <option value="Search page instead of direct product">Link leads to search results, not product page</option>
                <option value="Image does not match product">Image does not match product</option>
                <option value="Price mismatch / expired deal">Price mismatch / expired deal</option>
                <option value="Out of stock">Product is permanently out of stock</option>
                <option value="Other issue">Other inaccurate information</option>
              </select>
            </div>

            {/* 3. Optional Note */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Optional Note / Correct Link
              </label>
              <textarea
                rows={3}
                value={optionalNote}
                onChange={(e) => setOptionalNote(e.target.value)}
                placeholder="Paste the correct store link or add details (optional)..."
                className="w-full p-2.5 rounded-xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 text-slate-800 resize-none"
              />
            </div>

            {/* Disclaimer & Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-violet-100">
              <span className="text-[10px] text-slate-400">
                Logged to placeholder service
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !prodName.trim()}
                  className="px-4 py-2 rounded-xl font-bold bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Submit Report'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
