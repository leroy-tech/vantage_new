import React, { useState } from 'react';
import {
  ShieldCheck,
  ShoppingCart,
  ExternalLink,
  Flag,
  Check,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export interface ReportItem {
  id: string;
  productName: string;
  buyUrl?: string;
  imageSourceUrl?: string;
  reason: string;
  timestamp: string;
}

interface VerifiedBuyCardActionsProps {
  productName: string;
  buyUrl?: string | null;
  sourceDomain?: string;
  platform?: string;
  verified?: boolean;
  imageSourceUrl?: string;
  priceInr?: string;
  isCompact?: boolean;
  className?: string;
}

export const VerifiedBuyCardActions: React.FC<VerifiedBuyCardActionsProps> = ({
  productName,
  buyUrl,
  sourceDomain = '',
  platform = 'Store',
  verified = false,
  imageSourceUrl,
  priceInr,
  isCompact = false,
  className = '',
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Wrong product link');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Derive canonical domain if missing
  const cleanDomain = sourceDomain || (buyUrl ? new URL(buyUrl).hostname.replace(/^www\./, '') : '');
  const hasValidBuyUrl = Boolean(buyUrl && buyUrl.startsWith('http') && !buyUrl.includes('search') && !buyUrl.includes('example.com'));

  const handleOpenReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReportOpen(true);
    setIsSubmitted(false);
  };

  const handleCloseReport = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsReportOpen(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const report: ReportItem = {
      id: `rep_${Date.now()}`,
      productName,
      buyUrl: buyUrl || undefined,
      imageSourceUrl: imageSourceUrl || undefined,
      reason: reportReason,
      timestamp: new Date().toISOString(),
    };

    try {
      const existing: ReportItem[] = JSON.parse(localStorage.getItem('vantage_user_reports') || '[]');
      existing.unshift(report);
      localStorage.setItem('vantage_user_reports', JSON.stringify(existing.slice(0, 50)));
    } catch {
      // Local storage fallback
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className={`space-y-2 select-none ${className}`}>
      {/* 1. Verified Link Badge & Disclaimer */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        {verified ? (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md"
            title={`Verified exact product detail page (PDP) on ${cleanDomain}`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>Verified link</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
            <span>Checking PDP</span>
          </span>
        )}

        {/* Report Wrong Link or Image Trigger */}
        <button
          type="button"
          onClick={handleOpenReport}
          className="text-[10px] text-slate-400 hover:text-rose-600 transition-colors inline-flex items-center gap-1 cursor-pointer"
          title="Report inaccurate link or image for this product"
        >
          <Flag className="w-2.5 h-2.5" />
          <span>Report issue</span>
        </button>
      </div>

      {/* 2. Direct Buy Action Button */}
      {hasValidBuyUrl ? (
        <a
          href={buyUrl!}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`w-full font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-between gap-1.5 transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
            cleanDomain.includes('flipkart')
              ? 'bg-[#2874F0] hover:bg-[#1E60D0] text-white shadow-blue-500/20'
              : cleanDomain.includes('amazon')
              ? 'bg-[#FF9900] hover:bg-[#E68A00] text-slate-950 shadow-amber-500/20'
              : cleanDomain.includes('croma')
              ? 'bg-[#00BFA5] hover:bg-[#009688] text-white'
              : cleanDomain.includes('tatacliq')
              ? 'bg-[#D5265B] hover:bg-[#B01E49] text-white'
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
          }`}
          title={`Buy directly on ${platform} — opens ${buyUrl}`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Buy on {platform}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-[10px] opacity-90 font-mono">
            <span>{cleanDomain}</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </div>
        </a>
      ) : (
        /* Explicit Rule 5: If no verified link exists for a platform, show "Not found on <platform>" instead of a guessed link */
        <div
          className="w-full bg-slate-100/90 border border-slate-200 text-slate-500 text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
          title={`No authentic direct product detail page verified on ${platform}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-[11px]">Not found on {platform}</span>
        </div>
      )}

      {/* 3. Mandatory Price Disclaimer */}
      {!isCompact && (
        <p className="text-[10px] text-slate-400 leading-tight">
          Price and availability may change, check the store before buying.
        </p>
      )}

      {/* 4. Report Modal / Dialog */}
      {isReportOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseReport}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full border border-violet-100 shadow-2xl relative text-[#2E1065]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseReport}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 text-[#7C3AED]">
              <Flag className="w-4 h-4" />
              <h4 className="font-heading font-bold text-sm">Report Link or Image</h4>
            </div>

            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Help us maintain 100% accuracy. We strictly discard unverifiable links and broken photos.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-semibold text-slate-700 mb-3 truncate">
              {productName}
            </div>

            {isSubmitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Thank you! Report saved to local state.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    What is the issue?
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-violet-200 bg-white focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Wrong product link (does not match product)">Wrong product link (doesn't match item)</option>
                    <option value="Link is a search page, not a direct PDP">Link is a search page, not a direct PDP</option>
                    <option value="Broken image or wrong photo">Broken image or wrong photo</option>
                    <option value="Out of stock or expired price">Out of stock or expired price</option>
                    <option value="Link is from outside trusted stores">Link is from outside trusted stores</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCloseReport}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm transition-all"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
