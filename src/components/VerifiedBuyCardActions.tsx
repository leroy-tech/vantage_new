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
import { ReportIssueModal } from './ReportIssueModal';

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

  // Derive canonical domain if missing
  const cleanDomain = sourceDomain || (buyUrl ? new URL(buyUrl).hostname.replace(/^www\./, '') : '');
  const hasValidBuyUrl = Boolean(buyUrl && buyUrl.startsWith('http') && !buyUrl.includes('search') && !buyUrl.includes('example.com'));

  const handleOpenReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReportOpen(true);
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
      <ReportIssueModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        productName={productName}
        sourceUrl={buyUrl || ''}
      />
    </div>
  );
};
