import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { InfoPageType } from './InfoPages';

interface FooterProps {
  onOpenInfoPage: (page: InfoPageType) => void;
  className?: string;
  userId?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenInfoPage,
  className = '',
  userId = 'default',
}) => {
  return (
    <footer className={`py-10 border-t text-xs bg-white/90 border-violet-100 text-[#7C6898] backdrop-blur-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] flex items-center justify-center font-black text-white text-xs font-heading">
                ₹
              </div>
              <span className="font-heading font-black text-sm tracking-tight text-[#2E1065]">
                VANTAGE AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-100 text-[#6D28D9] font-bold border border-violet-200">
                INDIA EDITION
              </span>
            </div>
            <p className="text-xs text-[#5B21B6] max-w-lg">
              Autonomous multi-store product comparison, live deal verification, and price drop monitoring across Amazon India, Flipkart, and Croma in Indian Rupees (₹).
            </p>
          </div>

          {/* Quick Legal & Info Links */}
          <div className="flex items-center gap-4 text-xs font-semibold flex-wrap">
            <button
              onClick={() => onOpenInfoPage('about')}
              className="text-[#6D28D9] hover:text-[#4C1D95] hover:underline cursor-pointer"
            >
              About
            </button>
            <span className="text-violet-200">·</span>
            <button
              onClick={() => onOpenInfoPage('privacy')}
              className="text-[#6D28D9] hover:text-[#4C1D95] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-violet-200">·</span>
            <button
              onClick={() => onOpenInfoPage('terms')}
              className="text-[#6D28D9] hover:text-[#4C1D95] hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-violet-200">·</span>
            <button
              onClick={() => onOpenInfoPage('contact')}
              className="text-[#6D28D9] hover:text-[#4C1D95] hover:underline cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Required Mandatory Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-violet-50/80 border border-violet-100 text-[11px] sm:text-xs text-[#5B21B6] leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
          <div>
            <strong>Disclaimer:</strong> Prices and availability may change. Check the store before buying. Vantage AI may earn a commission from some links.
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-violet-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7C6898]">
          <p>
            © {new Date().getFullYear()} Vantage AI. All brand names, logos, and trademarks belong to their respective owners.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[#7C3AED]">Session: {userId}</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-[#7C3AED] font-bold text-[#6D28D9] cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
