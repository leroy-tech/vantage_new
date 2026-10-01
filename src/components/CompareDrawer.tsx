import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  X,
  Sparkles,
  ExternalLink,
  ShoppingCart,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { FloatingProduct } from '../App';
import { handleImageError } from '../utils/image-validator';

interface CompareDrawerProps {
  comparedProducts: FloatingProduct[];
  onRemoveFromCompare: (productId: string) => void;
  onClearCompare: () => void;
  isWhite: boolean;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  comparedProducts,
  onRemoveFromCompare,
  onClearCompare,
  isWhite
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (comparedProducts.length === 0) return null;

  // Collect all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap(p => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <>
      {/* Persistent Bottom Floating Drawer Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl pointer-events-auto"
        >
          <div className="glass-panel-white rounded-2xl border border-violet-200/90 shadow-2xl p-3 sm:px-4 flex items-center justify-between gap-3 backdrop-blur-2xl ring-2 ring-violet-300/40">
            {/* Left: Indicator & Thumbnails */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 bg-violet-100 text-[#6D28D9] px-2.5 py-1 rounded-xl text-xs font-bold border border-violet-200">
                <Scale className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Compare ({comparedProducts.length})</span>
              </div>

              {/* Thumbnails of checked items */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-[280px] sm:max-w-md">
                {comparedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="relative group shrink-0 w-9 h-9 rounded-xl bg-white border border-violet-200 p-0.5 shadow-xs flex items-center justify-center"
                    title={prod.name}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => handleImageError(e, prod.category)}
                    />
                    <button
                      onClick={() => onRemoveFromCompare(prod.id)}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-xs"
                      title="Remove"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Compare Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClearCompare}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#7C6898] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Clear all selected"
              >
                Clear
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Compare Selected ({comparedProducts.length})</span>
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Side-by-Side Full Spec Comparison Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="glass-panel-white rounded-3xl border border-violet-200/90 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-violet-100 flex items-center justify-between bg-violet-50/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-sm">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#2E1065] tracking-tight">
                      Side-by-Side Product Comparison
                    </h3>
                    <p className="text-xs text-[#7C6898]">
                      Comparing {comparedProducts.length} verified products with direct retail store links
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-[#7C6898] hover:text-[#2E1065] hover:bg-violet-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Side-by-Side Comparison Content */}
              <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Product Summary Header Row */}
                <div
                  className="grid gap-4 pb-6 border-b border-violet-100 min-w-[600px]"
                  style={{
                    gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(220px, 1fr))`
                  }}
                >
                  {comparedProducts.map((p) => {
                    const isAmazon = p.store.toLowerCase().includes('amazon');
                    const isFlipkart = p.store.toLowerCase().includes('flipkart');

                    return (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl p-4 border border-violet-100 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          {/* Image */}
                          <div className="h-40 rounded-xl bg-violet-50/50 p-2 flex items-center justify-center mb-3 border border-violet-50">
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => handleImageError(e, p.category)}
                            />
                          </div>

                          {/* Tag & Store */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200">
                              {p.tag}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
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

                          {/* Name */}
                          <h4 className="font-heading font-bold text-sm text-[#2E1065] line-clamp-2 leading-snug mb-2">
                            {p.name}
                          </h4>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-xl font-heading font-black text-[#7C3AED]">
                              {p.price}
                            </span>
                            <span className="text-xs line-through text-[#7C6898]">{p.mrp}</span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {p.savings}
                            </span>
                          </div>
                        </div>

                        {/* Direct Buy Buttons */}
                        <div className="space-y-1.5 pt-3 border-t border-violet-100">
                          <a
                            href={p.sourceUrl || p.amazonUrl || p.flipkartUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-extrabold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-[1.02]"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Direct Buy ({p.store})</span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </a>

                          <div className="grid grid-cols-2 gap-1.5">
                            {p.amazonUrl && (
                              <a
                                href={p.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[#B45309] text-[10px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                              >
                                <span>Amazon</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                              </a>
                            )}
                            {p.flipkartUrl && (
                              <a
                                href={p.flipkartUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-50 hover:bg-blue-100 border border-blue-300 text-[#1D4ED8] text-[10px] font-bold py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors"
                              >
                                <span>Flipkart</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Technical Specifications Comparison Table */}
                <div className="min-w-[600px]">
                  <h5 className="font-heading font-extrabold text-sm text-[#2E1065] mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                    <span>Technical Specifications Matrix</span>
                  </h5>

                  <div className="rounded-2xl border border-violet-100 overflow-hidden divide-y divide-violet-100 bg-white shadow-xs">
                    {allSpecKeys.map((key, i) => (
                      <div
                        key={key}
                        className={`grid items-center ${i % 2 === 0 ? 'bg-[#FAF8FF]' : 'bg-white'}`}
                        style={{
                          gridTemplateColumns: `180px repeat(${comparedProducts.length}, minmax(180px, 1fr))`
                        }}
                      >
                        <div className="p-3 text-xs font-bold text-[#4C1D95] border-r border-violet-100">
                          {key}
                        </div>
                        {comparedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 text-xs text-[#2E1065] font-medium border-r border-violet-100 last:border-r-0"
                          >
                            {prod.specs?.[key] || '—'}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons Comparison */}
                <div className="min-w-[600px]">
                  <h5 className="font-heading font-extrabold text-sm text-[#2E1065] mb-3">
                    Key Strengths & Trade-offs
                  </h5>
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns: `repeat(${comparedProducts.length}, minmax(220px, 1fr))`
                    }}
                  >
                    {comparedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-white rounded-2xl p-4 border border-violet-100 space-y-3"
                      >
                        <span className="font-bold text-xs text-[#2E1065] block">{prod.name}</span>

                        {prod.pros && prod.pros.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">
                              Pros:
                            </span>
                            <ul className="text-xs text-[#2E1065] space-y-1 list-disc pl-3">
                              {prod.pros.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {prod.cons && prod.cons.length > 0 && (
                          <div className="space-y-1 pt-2 border-t border-violet-50">
                            <span className="text-[10px] font-extrabold uppercase text-rose-700 block">
                              Cons:
                            </span>
                            <ul className="text-xs text-[#7C6898] space-y-1 list-disc pl-3">
                              {prod.cons.map((c, idx) => (
                                <li key={idx}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-violet-100 flex items-center justify-between bg-violet-50/50">
                <span className="text-xs text-[#7C6898]">
                  Prices and availability verified from official Indian retailer CDNs.
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-violet-100 hover:bg-violet-200 text-[#4C1D95] font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
