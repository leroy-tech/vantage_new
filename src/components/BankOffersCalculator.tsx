import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Percent,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Tag,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';

export interface BankOffer {
  id: string;
  bankName: string;
  cardType: 'Credit Card' | 'Debit Card' | 'EMI' | 'UPI';
  tag: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  badge?: string;
  terms: string;
  code?: string;
}

export const POPULAR_INDIAN_BANK_OFFERS: BankOffer[] = [
  {
    id: 'hdfc-cc',
    bankName: 'HDFC Bank',
    cardType: 'Credit Card',
    tag: '10% Instant Discount',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 1500,
    minOrderValue: 5000,
    badge: 'Popular',
    terms: 'Valid on HDFC Bank Credit Card non-EMI and EMI transactions. Min purchase ₹5,000.',
  },
  {
    id: 'icici-amazon-pay',
    bankName: 'Amazon Pay ICICI / ICICI Bank',
    cardType: 'Credit Card',
    tag: '5% Unlimited Cashback',
    discountType: 'percentage',
    discountValue: 5,
    maxDiscount: 5000,
    minOrderValue: 1000,
    badge: 'No Upper Limit',
    terms: '5% unlimited cashback for Prime members, 3% for others. Credited directly as Amazon Pay balance.',
  },
  {
    id: 'axis-flipkart',
    bankName: 'Flipkart Axis Bank',
    cardType: 'Credit Card',
    tag: '5% Unlimited Cashback',
    discountType: 'percentage',
    discountValue: 5,
    maxDiscount: 5000,
    minOrderValue: 500,
    badge: 'Unlimited',
    terms: '5% cashback directly credited to monthly statement on all Flipkart & Cleartrip purchases.',
  },
  {
    id: 'sbi-card',
    bankName: 'SBI Card',
    cardType: 'Credit Card',
    tag: 'Flat ₹1,250 Off',
    discountType: 'flat',
    discountValue: 1250,
    maxDiscount: 1250,
    minOrderValue: 15000,
    badge: 'Instant Flat Off',
    terms: 'Flat ₹1,250 instant discount on SBI Credit Cards on orders above ₹15,000.',
  },
  {
    id: 'onecard',
    bankName: 'OneCard',
    cardType: 'Credit Card',
    tag: '10% Instant Discount',
    discountType: 'percentage',
    discountValue: 10,
    maxDiscount: 1000,
    minOrderValue: 3000,
    badge: 'Metal Card',
    terms: '10% instant discount on OneCard Credit Cards up to ₹1,000 on minimum transaction of ₹3,000.',
  },
  {
    id: 'hdfc-debit',
    bankName: 'HDFC Bank Debit Card',
    cardType: 'Debit Card',
    tag: 'Flat ₹750 Off',
    discountType: 'flat',
    discountValue: 750,
    maxDiscount: 750,
    minOrderValue: 7500,
    terms: 'Flat ₹750 instant discount on HDFC Bank Debit Card EMI and full-swipe orders.',
  },
  {
    id: 'rupay-upi',
    bankName: 'RuPay / UPI',
    cardType: 'UPI',
    tag: 'Flat ₹100 Cashback',
    discountType: 'flat',
    discountValue: 100,
    maxDiscount: 100,
    minOrderValue: 999,
    badge: 'UPI Instant',
    terms: 'Flat ₹100 instant cashback on payments using RuPay Credit Card on UPI apps.',
  },
];

interface BankOffersCalculatorProps {
  price: number;
  priceFormatted?: string;
  isWhite?: boolean;
  className?: string;
  onApplyDiscount?: (discountAmount: number, finalPrice: number, selectedOffer: BankOffer) => void;
}

export const BankOffersCalculator: React.FC<BankOffersCalculatorProps> = ({
  price,
  priceFormatted,
  isWhite = false,
  className = '',
  onApplyDiscount,
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>('hdfc-cc');
  const [showAllOffers, setShowAllOffers] = useState<boolean>(false);
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(6); // 3, 6, 9, 12 months

  // Format currency in Indian Rupees
  const formatINR = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  // Filter applicable offers based on min order value
  const applicableOffers = useMemo(() => {
    return POPULAR_INDIAN_BANK_OFFERS.map(offer => {
      const isEligible = price >= offer.minOrderValue;
      let calculatedSavings = 0;

      if (isEligible) {
        if (offer.discountType === 'percentage') {
          calculatedSavings = Math.min(Math.round((price * offer.discountValue) / 100), offer.maxDiscount);
        } else {
          calculatedSavings = Math.min(offer.discountValue, price);
        }
      }

      return {
        ...offer,
        isEligible,
        calculatedSavings,
        finalPrice: Math.max(price - calculatedSavings, 0),
      };
    });
  }, [price]);

  const activeOffer = applicableOffers.find(o => o.id === selectedOfferId) || applicableOffers[0];
  const maxSavingsOffer = [...applicableOffers]
    .filter(o => o.isEligible)
    .sort((a, b) => b.calculatedSavings - a.calculatedSavings)[0];

  // EMI Calculations
  const effectivePrice = activeOffer.isEligible ? activeOffer.finalPrice : price;
  const noCostEmiPerMonth = Math.round(effectivePrice / selectedEmiTenure);

  const displayedOffers = showAllOffers ? applicableOffers : applicableOffers.slice(0, 3);

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all select-none ${
        isWhite
          ? 'bg-gradient-to-br from-violet-50/80 via-white to-amber-50/30 border-violet-200/80 shadow-md'
          : 'bg-gradient-to-br from-[#1A1230]/90 via-[#130E24]/90 to-black/60 border-violet-500/30 shadow-xl'
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-violet-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-amber-500 text-white shadow-xs">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-black text-xs sm:text-sm text-[#2E1065] dark:text-white flex items-center gap-1.5">
              <span>Bank & Card Offer Calculator</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                Live Net Price
              </span>
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Calculate instant card discounts & No-Cost EMI across major Indian banks
            </p>
          </div>
        </div>

        {maxSavingsOffer && maxSavingsOffer.calculatedSavings > 0 && (
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase font-mono font-bold text-gray-400">Max Savings</span>
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              Save up to {formatINR(maxSavingsOffer.calculatedSavings)}
            </span>
          </div>
        )}
      </div>

      {/* Net Effective Price Spotlight Banner */}
      <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-600/10 via-emerald-500/5 to-transparent border border-emerald-300 dark:border-emerald-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Effective Net Checkout Price</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-xl sm:text-2xl text-emerald-700 dark:text-emerald-300">
              {formatINR(effectivePrice)}
            </span>
            {activeOffer.calculatedSavings > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {priceFormatted || formatINR(price)}
              </span>
            )}
            {activeOffer.calculatedSavings > 0 && (
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-200 px-2 py-0.5 rounded-md">
                Save {formatINR(activeOffer.calculatedSavings)} with {activeOffer.bankName}
              </span>
            )}
          </div>
        </div>

        {/* No-Cost EMI teaser */}
        <div className="sm:text-right shrink-0">
          <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
            Or No-Cost EMI from
          </div>
          <div className="font-heading font-black text-sm text-[#7C3AED] dark:text-violet-300">
            {formatINR(noCostEmiPerMonth)}
            <span className="text-[10px] font-normal text-gray-500">/mo ({selectedEmiTenure}m)</span>
          </div>
        </div>
      </div>

      {/* Bank Offer Selection Pills */}
      <div className="space-y-2 mb-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between">
          <span>Select Your Bank Card:</span>
          <span>{applicableOffers.filter(o => o.isEligible).length} Eligible Offers</span>
        </div>

        <div className="space-y-1.5">
          {displayedOffers.map((offer) => {
            const isSelected = selectedOfferId === offer.id;
            return (
              <div
                key={offer.id}
                onClick={() => {
                  if (offer.isEligible) {
                    setSelectedOfferId(offer.id);
                    if (onApplyDiscount) {
                      onApplyDiscount(offer.calculatedSavings, offer.finalPrice, offer);
                    }
                  }
                }}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                  !offer.isEligible
                    ? 'opacity-50 cursor-not-allowed bg-black/5 dark:bg-white/5 border-transparent'
                    : isSelected
                    ? 'bg-violet-100/90 dark:bg-[#7C3AED]/20 border-[#7C3AED] shadow-sm cursor-pointer'
                    : 'bg-white/70 dark:bg-white/5 hover:bg-violet-50/80 dark:hover:bg-white/10 border-violet-100 dark:border-white/10 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-black/40'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                        {offer.bankName}
                      </span>
                      {offer.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          {offer.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                      {offer.tag} · {offer.cardType}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {offer.isEligible ? (
                    <div>
                      <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">
                        -{formatINR(offer.calculatedSavings)}
                      </span>
                      <div className="text-[9px] font-mono text-gray-400">
                        Net: {formatINR(offer.finalPrice)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">
                      Min. {formatINR(offer.minOrderValue)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle Show All Offers */}
        <button
          onClick={() => setShowAllOffers(prev => !prev)}
          className="text-xs font-bold text-[#7C3AED] dark:text-violet-400 hover:underline inline-flex items-center gap-1 pt-1"
        >
          <span>{showAllOffers ? 'Show fewer offers' : `View all ${applicableOffers.length} bank & card offers`}</span>
          {showAllOffers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* No-Cost EMI Calculator Matrix */}
      <div className="pt-3 border-t border-violet-100 dark:border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            No-Cost EMI Tenure Plans:
          </span>
          <span className="text-[10px] text-gray-400 font-mono">0% Processing Fee</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[3, 6, 9, 12].map(months => {
            const isSelected = selectedEmiTenure === months;
            const perMonth = Math.round(effectivePrice / months);

            return (
              <button
                key={months}
                onClick={() => setSelectedEmiTenure(months)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#7C3AED] to-[#6D28D9] text-white border-[#7C3AED] shadow-sm'
                    : 'bg-white/70 dark:bg-white/5 border-violet-100 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-violet-300'
                }`}
              >
                <div className="text-[10px] font-bold opacity-80">{months} Months</div>
                <div className="text-xs font-mono font-black mt-0.5">
                  {formatINR(perMonth)}
                </div>
                <div className={`text-[8px] font-bold ${isSelected ? 'text-amber-300' : 'text-emerald-600'}`}>
                  No-Cost EMI
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
