import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Radio,
  Star,
  ShoppingCart,
  Command,
  ArrowRight
} from 'lucide-react';
import { FloatingProduct } from '../App';
import { handleImageError } from '../utils/image-validator';

interface FloatingActionSearchBarProps {
  products: FloatingProduct[];
  onSelectProduct: (product: FloatingProduct) => void;
  onSearchQuerySubmit: (query: string) => void;
  isWhite: boolean;
}

export const FloatingActionSearchBar: React.FC<FloatingActionSearchBarProps> = ({
  products,
  onSelectProduct,
  onSearchQuerySubmit,
  isWhite
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matching products for real-time autocomplete
  const filteredProducts = query.trim()
    ? products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          (p.tag && p.tag.toLowerCase().includes(q)) ||
          (p.launchBadge && p.launchBadge.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut (⌘K or Ctrl+K) to focus floating search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
        handleProductSelect(filteredProducts[selectedIndex]);
      } else if (query.trim()) {
        onSearchQuerySubmit(query.trim());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleProductSelect = (product: FloatingProduct) => {
    onSelectProduct(product);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed top-[calc(0.75rem+2cm)] left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl pointer-events-auto transition-all duration-300"
    >
      {/* Floating Pill Search Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`glass-panel-white rounded-2xl border ${
          isOpen ? 'border-[#7C3AED] shadow-2xl ring-2 ring-violet-300/40' : 'border-violet-200/80 shadow-lg'
        } backdrop-blur-2xl transition-all duration-200 overflow-hidden`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              onSearchQuerySubmit(query.trim());
              setIsOpen(false);
            }
          }}
          className="flex items-center px-3.5 py-2 gap-2.5 relative"
        >
          {/* Cyber Cyan Radar Indicator */}
          <div className="flex items-center gap-1.5 pl-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <Search className="w-4 h-4 text-[#7C3AED]" />
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search verified products, deals & store links (e.g. iPhone 16 Pro, S24 Ultra, Sony XM5, MacBook)..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[#2E1065] placeholder:text-[#7C6898] outline-none border-none py-1"
          />

          {/* Right Action Icons & Shortcut Hint */}
          <div className="flex items-center gap-1.5 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-1 rounded-full text-[#7C6898] hover:text-[#2E1065] hover:bg-violet-100 transition-colors"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] disabled:opacity-40 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-sm cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-[#7C6898] bg-violet-100/70 border border-violet-200/80 px-1.5 py-0.5 rounded-md">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </div>
        </form>

        {/* Real-time Autocomplete Suggestions Dropdown */}
        <AnimatePresence>
          {isOpen && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-violet-100 bg-white/95 divide-y divide-violet-50 max-h-96 overflow-y-auto"
            >
              <div className="px-3.5 py-1.5 bg-violet-50/70 flex items-center justify-between text-[11px] font-semibold text-[#7C6898]">
                <span>Instant Suggestions ({filteredProducts.length})</span>
                <span className="text-[10px] text-[#7C3AED]">Use ↑ ↓ to navigate · Enter to select</span>
              </div>

              {filteredProducts.map((p, idx) => {
                const isSelected = selectedIndex === idx;
                const isAmazon = p.store.toLowerCase().includes('amazon');
                const isFlipkart = p.store.toLowerCase().includes('flipkart');

                return (
                  <div
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 sm:px-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-violet-100/70' : 'hover:bg-violet-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-violet-100 p-1 flex items-center justify-center shrink-0 shadow-xs">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => handleImageError(e, p.category)}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-heading font-bold text-xs sm:text-sm text-[#2E1065] truncate block">
                            {p.name}
                          </span>
                          {p.launchBadge && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-100 text-[#7C3AED] border border-violet-200 shrink-0">
                              {p.launchBadge}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#7C6898]">
                          <span className="font-bold text-[#7C3AED]">{p.price}</span>
                          <span className="line-through text-[10px] opacity-75">{p.mrp}</span>
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1 rounded text-[10px] border border-emerald-200">
                            {p.savings}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                              isFlipkart
                                ? 'bg-blue-50 text-[#2874F0] border-blue-200'
                                : isAmazon
                                ? 'bg-amber-50 text-[#FF9900] border-amber-200'
                                : 'bg-violet-50 text-[#6D28D9] border-violet-200'
                            }`}
                          >
                            {p.store}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Direct Buy Link to trusted platform */}
                      <a
                        href={p.sourceUrl || p.amazonUrl || p.flipkartUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs transition-transform hover:scale-105"
                        title={`Direct Buy on ${p.store}`}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>Direct Buy</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleProductSelect(p)}
                        className="p-1.5 rounded-lg text-[#7C3AED] hover:bg-violet-200/50 transition-colors"
                        title="View Specs & Photos"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
