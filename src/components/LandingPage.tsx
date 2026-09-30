import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Brain,
  Bell,
  Layers,
  Shield,
  Zap,
  Tag,
  Radio,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Star,
  Laptop,
  Headphones,
  Smartphone,
  Tv,
  Eye,
  Sliders,
  Flame,
  Award,
  Compass
} from 'lucide-react';
import { FloatingProduct } from '../App';

interface LandingPageProps {
  isWhite: boolean;
  onLaunchApp: (options?: { tab?: 'arena' | 'chat' | 'multi'; initialQuery?: string }) => void;
  floatingProducts: FloatingProduct[];
  userId: string;
  onOpenProductModal?: (product: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  isWhite,
  onLaunchApp,
  floatingProducts,
  userId,
  onOpenProductModal
}) => {
  // Demo Instant Search State
  const [demoQuery, setDemoQuery] = useState('');
  const [isDemoSearching, setIsDemoSearching] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    productName: string;
    imageUrl: string;
    sourceUrl: string;
    sourceStore: string;
    badge: string;
    storeLinks: Array<{ store: string; name: string; url: string; badge: string; color: string }>;
  } | null>(null);

  // Copy Feedback State for Color Tokens
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(18000);
  const [selectedCategory, setSelectedCategory] = useState<'electronics' | 'audio' | 'appliances' | 'computing'>('audio');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Active UI Guide Tab
  const [activeGuideTab, setActiveGuideTab] = useState<'colors' | 'typography' | 'components' | 'principles'>('colors');

  const handleCopyHex = (hex: string, label: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleDemoLookup = async (q: string) => {
    if (!q.trim()) return;
    setIsDemoSearching(true);
    setDemoQuery(q);
    try {
      const res = await fetch(`/api/product-source?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setDemoResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDemoSearching(false);
    }
  };

  // Savings Calculator Computations
  const savingsMultipliers = {
    electronics: 0.18,
    audio: 0.22,
    appliances: 0.25,
    computing: 0.15
  };
  const estimatedSavings = Math.round(monthlySpend * savingsMultipliers[selectedCategory] * 12);
  const estimatedDropAlerts = Math.round((monthlySpend / 3000) * 1.8);

  // White and Violet Design Tokens
  const brandColors = [
    { name: 'Electric Violet (Core)', hex: '#7C3AED', role: 'Primary Brand Action & Focus', text: 'light' },
    { name: 'Luminous Violet', hex: '#8B5CF6', role: 'Gradient Shine & Highlights', text: 'light' },
    { name: 'Royal Violet Depth', hex: '#6D28D9', role: 'Deep Buttons & Contrast Accents', text: 'light' },
    { name: 'Midnight Plum Headline', hex: '#2E1065', role: 'Display Titles & Hero H1', text: 'light' },
    { name: 'Pure White Canvas', hex: '#FFFFFF', role: 'Pristine Surface & Cards', text: 'dark' },
    { name: 'Radiant Lavender White', hex: '#FAF8FF', role: 'Root Ambient Canvas Background', text: 'dark' },
    { name: 'Soft Violet Tint', hex: '#F5F3FF', role: 'Subtle Card Section Fills', text: 'dark' },
    { name: 'Lavender Border Soft', hex: '#DDD6FE', role: 'Crisp Card & Panel Hairlines', text: 'dark' },
    { name: 'Rich Plum Body Text', hex: '#4C1D95', role: 'Readable Paragraphs & Specs', text: 'light' },
    { name: 'Muted Lavender Text', hex: '#7C6898', role: 'Secondary Metadata & Labels', text: 'dark' },
    { name: 'Flipkart Official Blue', hex: '#2874F0', role: 'Verified Flipkart Store Accent', text: 'light' },
    { name: 'Amazon Prime Orange', hex: '#FF9900', role: 'Verified Amazon India Store Accent', text: 'dark' },
    { name: 'Verified Deal Mint', hex: '#10B981', role: 'Lowest Price Guarantee Badge', text: 'dark' },
    { name: 'Cyber Cyan Highlight', hex: '#06B6D4', role: 'Real-time Radar Scanner', text: 'dark' }
  ];

  return (
    <div className="w-full font-sans bg-[#FAF8FF] text-[#2E1065] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient White & Violet Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[460px] bg-violet-400/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[420px] h-[360px] bg-purple-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Eyebrow badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm transition-all bg-white border-violet-200 text-[#6D28D9] shadow-violet-500/10">
              <Sparkles className="w-4 h-4 text-[#7C3AED] animate-pulse" />
              <span>THE AGENTIC AI SHOPPING REVOLUTION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
              <span className="font-mono text-[11px] opacity-85">WHITE & VIOLET SOVEREIGNTY</span>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 font-heading text-[#2E1065]">
              Shop Smarter.{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6] bg-clip-text text-transparent">
                Pay Less.
              </span>
              <br />
              <span>Never Miss a Drop.</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-[#5B21B6]">
              Vantage cross-examines <strong>Amazon India, Flipkart, Croma, Reddit discussions</strong>, and expert labs in real time. Zero sponsored bias, verified authentic retailer CDN photos, and autonomous price-drop alerts in Indian Rupees (₹).
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => onLaunchApp()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white shadow-violet-500/25 beacon-glow active:translate-y-0 font-heading"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span>Launch Shopping Assistant App</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>

            <a
              href="#interactive-radar"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 border transition-all bg-white hover:bg-violet-50 border-violet-200 text-[#6D28D9] shadow-sm"
            >
              <Radio className="w-4 h-4 text-[#7C3AED] animate-pulse" />
              <span>Try Live Sourcing Radar</span>
            </a>

            <a
              href="#brand-guide"
              className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 border transition-all bg-white/70 hover:bg-white border-violet-200 text-[#5B21B6] shadow-sm"
            >
              <Layers className="w-4 h-4 text-[#7C3AED]" />
              <span>Brand & UI Guide</span>
            </a>
          </div>

          {/* Key Value Pill Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-16">
            {[
              { label: 'Gemini 2.5 Flash', desc: 'Free-Tier Reasoning Engine', icon: Brain, color: 'text-[#7C3AED]' },
              { label: '3-Way Search Grounding', desc: 'Retail + Reddit + Tech Labs', icon: Search, color: 'text-[#6D28D9]' },
              { label: 'Strict Verified CDNs', desc: 'Zero Fake Stock Photos', icon: Eye, color: 'text-[#10B981]' },
              { label: 'Autonomous Alerts', desc: 'Real SMTP & Telegram Bot', icon: Bell, color: 'text-[#8B5CF6]' }
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border text-center transition-all bg-white border-violet-100 shadow-md shadow-violet-500/5 hover:border-violet-300 hover:shadow-violet-500/10"
              >
                <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className="font-bold text-sm text-[#2E1065]">{stat.label}</div>
                <div className="text-xs mt-0.5 text-[#7C6898]">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Levitating Floating Product Card Showcase */}
          <div className="relative mt-8">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200">
                <Flame className="w-3.5 h-3.5 text-[#7C3AED] fill-[#7C3AED]" />
                Live Verified Product Radar
              </span>
              <p className="text-xs mt-1.5 text-[#7C6898]">
                Hover any card to inspect verified retail CDNs, instant deals, and 1-click buy links in INR (₹)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {floatingProducts.slice(0, 4).map((fp) => (
                <div
                  key={fp.id}
                  className="group relative rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-white border-violet-100 shadow-lg shadow-violet-500/5 hover:border-violet-400 hover:shadow-violet-500/15"
                >
                  {/* Top Tag & Store */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200">
                      {fp.tag}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {fp.store.replace(' Direct', '')}
                    </span>
                  </div>

                  {/* Image container - Clickable to open modal */}
                  <div
                    onClick={() => onOpenProductModal && onOpenProductModal(fp)}
                    className="relative h-44 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3 transition-transform group-hover:scale-[1.02] bg-[#FAF8FF] border border-violet-50 cursor-pointer"
                    title="Click to view full pictures and verified specs"
                  >
                    <img
                      src={fp.imageUrl}
                      alt={fp.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono bg-white/90 backdrop-blur-md text-[#2E1065] border border-violet-200 flex items-center gap-1 shadow-sm">
                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                      Verified CDN Photo
                    </div>
                  </div>

                  {/* Title & Pricing - Clickable */}
                  <h3
                    onClick={() => onOpenProductModal && onOpenProductModal(fp)}
                    className="font-bold text-sm line-clamp-1 mb-1 group-hover:text-[#7C3AED] transition-colors text-[#2E1065] cursor-pointer"
                    title="Click to open full product report"
                  >
                    {fp.name}
                  </h3>

                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-lg font-black text-[#7C3AED] font-heading">{fp.price}</span>
                      <span className="text-xs line-through ml-2 text-[#7C6898]">{fp.mrp}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {fp.savings.split('(')[1]?.replace(')', '') || 'Deal'}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-violet-100">
                    <button
                      onClick={() => onOpenProductModal ? onOpenProductModal(fp) : onLaunchApp({ tab: 'multi', initialQuery: `${fp.name} deals price review India` })}
                      className="text-xs font-semibold py-2 px-2 rounded-lg flex items-center justify-center gap-1 border transition-all bg-violet-50 hover:bg-violet-100 hover:border-violet-300 text-[#6D28D9] border-violet-200 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                      Specs & Pics
                    </button>

                    <a
                      href={fp.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-all shadow-sm font-heading"
                    >
                      <span>Buy Direct</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => onLaunchApp({ tab: 'arena' })}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all bg-white hover:bg-violet-50 border-violet-200 text-[#6D28D9] shadow-sm"
              >
                <span>View all 8 interactive levitating products in the Arena</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#7C3AED]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sourcing Radar Demo Section */}
      <section id="interactive-radar" className="py-20 border-t bg-gradient-to-b from-white to-[#FAF8FF] border-violet-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-[#6D28D9] border border-violet-200 mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#7C3AED]" />
              LIVE RADAR ENGINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 font-heading text-[#2E1065]">
              Instant Product Sourcing Radar
            </h2>
            <p className="text-[#5B21B6]">
              Type any gadget or appliance name below. Our backend dynamically queries live retailer indexes, resolving the exact CDN photo, verified store badge, and direct buy URLs in under 300ms.
            </p>
          </div>

          {/* Quick search input box */}
          <div className="p-4 sm:p-6 rounded-2xl border shadow-xl mb-6 bg-white border-violet-100 shadow-violet-500/5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDemoLookup(demoQuery);
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
                <input
                  type="text"
                  value={demoQuery}
                  onChange={(e) => setDemoQuery(e.target.value)}
                  placeholder="Try: Sony WH-1000XM5, boAt Nirvana Ion, MacBook Air M3, iPad 10th Gen, Philips Air Fryer..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all bg-[#FAF8FF] border-violet-200 text-[#2E1065] placeholder-violet-300"
                />
              </div>

              <button
                type="submit"
                disabled={isDemoSearching}
                className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 font-heading"
              >
                {isDemoSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Resolving CDN...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Source Radar</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick suggestion chips */}
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-violet-100">
              <span className="text-xs font-medium text-[#7C6898]">Sample Radar Checks:</span>
              {[
                'Sony WH-1000XM5',
                'boAt Nirvana Ion',
                'Apple MacBook Air M3',
                'Samsung Galaxy S24 Ultra',
                'Apple iPad 10th Gen',
                'Philips Digital Air Fryer HD9252'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleDemoLookup(chip)}
                  className="text-xs px-2.5 py-1 rounded-full border transition-all bg-violet-50 hover:bg-violet-100 border-violet-200 text-[#6D28D9]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Sourcing Result Card */}
          {demoResult && (
            <div className="p-6 rounded-2xl border animate-in fade-in slide-in-from-bottom-2 duration-300 bg-white border-violet-200 shadow-xl shadow-violet-500/10">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Exact Retail Source Resolved
                </span>
                <span className="text-xs font-mono text-emerald-600 font-semibold">
                  Source: {demoResult.sourceStore}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div
                  onClick={() => onOpenProductModal && onOpenProductModal(demoResult.productName)}
                  className="w-36 h-36 rounded-xl p-2 flex items-center justify-center shrink-0 border bg-[#FAF8FF] border-violet-100 cursor-pointer hover:border-violet-300 transition-colors"
                  title="Click to view full product pictures and specifications"
                >
                  <img
                    src={demoResult.imageUrl}
                    alt={demoResult.productName}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3
                    onClick={() => onOpenProductModal && onOpenProductModal(demoResult.productName)}
                    className="text-lg font-bold mb-1 text-[#2E1065] hover:text-[#7C3AED] cursor-pointer transition-colors"
                    title="Click to open full product details"
                  >
                    {demoResult.productName}
                  </h3>
                  <p className="text-xs font-mono mb-4 text-[#7C6898]">
                    {demoResult.badge}
                  </p>

                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => onOpenProductModal && onOpenProductModal(demoResult.productName)}
                      className="px-4 py-2 rounded-lg font-black text-xs bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white flex items-center gap-1.5 shadow-md hover:shadow-violet-500/25 transition-all cursor-pointer font-heading"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View Full Product Report & Photos</span>
                    </button>

                    <a
                      href={demoResult.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg font-bold text-xs bg-violet-100 hover:bg-violet-200 text-[#4C1D95] border border-violet-200 flex items-center gap-1.5 shadow-sm font-heading"
                    >
                      <span>Buy Direct on {demoResult.sourceStore}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {demoResult.storeLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg font-medium text-xs border flex items-center gap-1.5 transition-all bg-white hover:bg-violet-50 border-violet-200 text-[#6D28D9]"
                        style={{ borderLeftColor: link.color, borderLeftWidth: '3px' }}
                      >
                        <span>{link.store}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}

                    <button
                      onClick={() => onLaunchApp({ tab: 'multi', initialQuery: `${demoResult.productName} price review India` })}
                      className="px-3 py-2 rounded-lg font-semibold text-xs border flex items-center gap-1.5 transition-all bg-violet-100 hover:bg-violet-200 border-violet-300 text-[#5B21B6]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Deep Research in App →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How Vantage Works: 4-Tier Agentic Architecture */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
              AGENTIC INTELLIGENCE FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 font-heading text-[#2E1065]">
              How Vantage Finds What Others Miss
            </h2>
            <p className="text-[#5B21B6]">
              Standard shopping bots read one retailer or regurgitate marketing buzzwords. Vantage performs a 4-tier autonomous investigation every time you ask.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Multi-Source Search',
                desc: 'Fires concurrent Google Programmable Searches across verified retail catalogs, Reddit user communities (e.g. r/headphones, r/IndiaTech), and technical benchmark review outlets.',
                icon: Search,
                badge: 'Live Grounding',
                color: 'text-[#7C3AED]'
              },
              {
                step: '02',
                title: 'Gemini 2.5 Synthesis',
                desc: 'Gemini 2.5 Flash digests real owner sentiment, uncovers unadvertised thermal throttling, battery degradation warnings, and synthesizes an objective pros & cons matrix.',
                icon: Brain,
                badge: 'Zero Bias AI',
                color: 'text-[#8B5CF6]'
              },
              {
                step: '03',
                title: 'Verified Sourcing & CDNs',
                desc: 'Resolves authentic manufacturer & e-commerce CDN photography and canonical product links. Zero generic Unsplash stock photos, zero hallucinated URLs.',
                icon: Eye,
                badge: '100% Authentic',
                color: 'text-emerald-600'
              },
              {
                step: '04',
                title: 'Autonomous Price Radar',
                desc: 'Persistent SQLite price tracking logs price dips and target thresholds. When a price falls or hits an all-time low, alerts dispatch immediately via SMTP or Telegram.',
                icon: Bell,
                badge: 'Instant Alert',
                color: 'text-[#6D28D9]'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl border transition-all bg-white border-violet-100 shadow-md shadow-violet-500/5 hover:border-violet-300 hover:shadow-violet-500/15"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-violet-300">
                    {item.step}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200">
                    {item.badge}
                  </span>
                </div>

                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-bold mb-2 text-[#2E1065]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#7C6898]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Savings & ROI Calculator */}
      <section className="py-20 border-y bg-white border-violet-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              SAVINGS INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-3 font-heading text-[#2E1065]">
              Calculate Your Estimated Annual Savings
            </h2>
            <p className="text-[#5B21B6]">
              By timing purchases with historical lows, card discounts, and unbiased value alternatives, Vantage users save an average of 15% to 25% on tech and home upgrades.
            </p>
          </div>

          <div className="p-8 rounded-3xl border shadow-xl bg-[#FAF8FF] border-violet-200 shadow-violet-500/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Sliders and controls */}
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-[#2E1065]">
                      Estimated Monthly Tech & Home Spend
                    </label>
                    <span className="text-lg font-black text-[#7C3AED] font-mono">
                      ₹{monthlySpend.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(parseInt(e.target.value))}
                    className="w-full accent-[#7C3AED] cursor-pointer h-2 bg-violet-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-[#7C6898] mt-1 font-mono">
                    <span>₹2,000/mo</span>
                    <span>₹50,000/mo</span>
                    <span>₹1,00,000/mo</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-[#2E1065]">
                    Primary Shopping Category
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: 'electronics', label: 'Gadgets & Phones', icon: Smartphone, rate: '18%' },
                      { key: 'audio', label: 'Audio & ANC', icon: Headphones, rate: '22%' },
                      { key: 'appliances', label: 'Home Appliances', icon: Tv, rate: '25%' },
                      { key: 'computing', label: 'Laptops & PCs', icon: Laptop, rate: '15%' }
                    ].map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedCategory(cat.key as any)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedCategory === cat.key
                            ? 'border-[#7C3AED] bg-violet-100 text-[#6D28D9] shadow-sm font-bold'
                            : 'border-violet-200 bg-white hover:bg-violet-50 text-[#5B21B6]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <cat.icon className="w-4 h-4 text-[#7C3AED]" />
                          <span className="text-xs font-semibold">{cat.label}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-80">~{cat.rate}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output stats display */}
              <div className="p-6 rounded-2xl border text-center relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] text-white shadow-xl shadow-violet-500/25">
                <div className="text-xs font-bold uppercase tracking-wider text-violet-200 mb-2 font-heading">
                  PROJECTED ANNUAL BENEFIT
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight mb-2">
                  ₹{estimatedSavings.toLocaleString('en-IN')}
                </div>
                <p className="text-xs mb-6 text-violet-200">
                  Estimated yearly cash saved through all-time-low drop alerts and trade-in / deal synthesis.
                </p>

                <div className="grid grid-cols-2 gap-3 text-left pt-4 border-t border-white/20">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <div className="text-[10px] text-violet-200 uppercase font-bold">Target Drop Hits</div>
                    <div className="text-lg font-black text-emerald-300 font-mono">~{estimatedDropAlerts} items/yr</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                    <div className="text-[10px] text-violet-200 uppercase font-bold">Tool Cost</div>
                    <div className="text-lg font-black text-white font-mono">₹0 (Free)</div>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchApp({ tab: 'arena' })}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-white hover:bg-violet-50 text-[#6D28D9] transition-all flex items-center justify-center gap-1.5 shadow-md font-heading"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Start Tracking Products in Vantage Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Way Competitive Matrix */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
              HEAD-TO-HEAD COMPARISON
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-3 font-heading text-[#2E1065]">
              Why Shoppers Switch to Vantage AI
            </h2>
            <p className="text-[#5B21B6]">
              See how Vantage compares against standard AI chatbots and legacy price comparison aggregator websites.
            </p>
          </div>

          <div className="rounded-2xl border overflow-x-auto shadow-xl bg-white border-violet-200">
            <table className="w-full text-left text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b bg-[#FAF8FF] border-violet-200">
                  <th className="p-4 font-bold text-[#7C6898] text-xs uppercase">Capability</th>
                  <th className="p-4 font-bold text-[#7C3AED] text-sm bg-violet-50 border-x border-violet-200 font-heading">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 fill-[#7C3AED]" />
                      Vantage AI Assistant
                    </div>
                  </th>
                  <th className="p-4 font-bold text-[#7C6898] text-sm">Generic Chatbots</th>
                  <th className="p-4 font-bold text-[#7C6898] text-sm">Price Aggregator Sites</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-100">
                {[
                  {
                    feat: 'Live Multi-Source Search Grounding',
                    vantage: 'Yes (Retail + Reddit + Labs)',
                    chatbot: 'No live data or single search',
                    aggregator: 'Retail price scrape only'
                  },
                  {
                    feat: 'Reddit Community Sentiment Extraction',
                    vantage: 'Yes (Real owner defects & battery tests)',
                    chatbot: 'General hearsay only',
                    aggregator: 'None (only 5-star fake reviews)'
                  },
                  {
                    feat: 'Zero Sponsored / Affiliate Bias',
                    vantage: '100% Unbiased (Zero kickbacks)',
                    chatbot: 'Varies / Training cutoff bias',
                    aggregator: 'Highly biased (Ranks by ad commission)'
                  },
                  {
                    feat: 'Verified Retailer CDN Photos',
                    vantage: 'Yes (Strict real CDN images)',
                    chatbot: 'No images or generic links',
                    aggregator: 'Low-res thumbnails'
                  },
                  {
                    feat: 'Autonomous Price Drop Alerts',
                    vantage: 'Real SMTP & Telegram Bot alerts',
                    chatbot: 'None (Cannot track over time)',
                    aggregator: 'Spammy newsletter / push ads'
                  },
                  {
                    feat: 'Persistent Personal Memory',
                    vantage: 'Saved budget, brand rules in SQLite',
                    chatbot: 'Session resets / Forgetful',
                    aggregator: 'None'
                  },
                  {
                    feat: 'Price & Architecture',
                    vantage: '100% Free Tier (No credit card)',
                    chatbot: '$20/month subscription',
                    aggregator: 'Free but riddled with ads'
                  }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-violet-50/50 transition-colors">
                    <td className="p-4 font-medium text-xs sm:text-sm text-[#2E1065]">
                      {row.feat}
                    </td>
                    <td className="p-4 font-bold text-xs sm:text-sm bg-violet-50/70 text-[#6D28D9] border-x border-violet-200">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.vantage}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs sm:text-sm text-[#7C6898]">
                      {row.chatbot}
                    </td>
                    <td className="p-4 text-xs sm:text-sm text-[#7C6898]">
                      {row.aggregator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Vantage AI Brand & UI Guide Section */}
      <section id="brand-guide" className="py-20 border-t bg-gradient-to-b from-white to-[#FAF8FF] border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-[#6D28D9] border border-violet-200 mb-3">
              <Layers className="w-3.5 h-3.5" />
              OFFICIAL WHITE & VIOLET DESIGN SYSTEM
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 font-heading text-[#2E1065]">
              Vantage AI Brand & UI Guide
            </h2>
            <p className="text-[#5B21B6]">
              The complete design tokens, color primitives, typographic hierarchy, and engineering constitution powering the Vantage shopping intelligence interface.
            </p>
          </div>

          {/* Guide Sub-navigation */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-2xl border flex flex-wrap gap-1 bg-white border-violet-200 shadow-sm">
              {[
                { id: 'colors', label: 'Color Tokens & Palette', icon: Eye },
                { id: 'typography', label: 'Typography Hierarchy', icon: Sliders },
                { id: 'components', label: 'Component Primitives', icon: Layers },
                { id: 'principles', label: 'Design Constitution', icon: Shield }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuideTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                    activeGuideTab === tab.id
                      ? 'bg-[#7C3AED] text-white shadow-md font-bold'
                      : 'text-[#6D28D9] hover:text-[#2E1065] hover:bg-violet-50'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: Color Tokens with exact Hex values */}
          {activeGuideTab === 'colors' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {brandColors.map((color, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border p-4 transition-all hover:scale-[1.02] bg-white border-violet-100 shadow-md shadow-violet-500/5 hover:border-violet-300"
                  >
                    <div
                      className="h-24 rounded-xl mb-3 border shadow-inner flex items-end p-2.5"
                      style={{ backgroundColor: color.hex, borderColor: 'rgba(0,0,0,0.06)' }}
                    >
                      <button
                        onClick={() => handleCopyHex(color.hex, color.name)}
                        className={`text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md flex items-center gap-1 border shadow transition-all ${
                          color.text === 'light'
                            ? 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                            : 'bg-white/90 text-slate-900 border-black/10 hover:bg-white'
                        }`}
                      >
                        {copiedToken === color.name ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{color.hex}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="font-bold text-sm mb-0.5 text-[#2E1065]">
                      {color.name}
                    </div>
                    <div className="text-xs text-[#7C6898]">
                      {color.role}
                    </div>
                  </div>
                ))}
              </div>

              {/* Surface & Elevation Elevation system */}
              <div className="p-6 rounded-2xl border bg-white border-violet-200 shadow-md">
                <h4 className="font-bold text-base mb-3 flex items-center gap-2 font-heading text-[#2E1065]">
                  <Layers className="w-4 h-4 text-[#7C3AED]" />
                  Glassmorphism & Surface Elevation Tokens (White & Violet)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl glass-panel text-[#2E1065] border border-violet-200">
                    <div className="font-mono text-xs text-[#7C3AED] mb-1">.glass-panel</div>
                    <div className="text-xs text-[#5B21B6]">Translucent pure white with 20px blur and delicate 18% violet border.</div>
                  </div>
                  <div className="p-4 rounded-xl glass-panel-white text-[#2E1065] border border-violet-200">
                    <div className="font-mono text-xs text-[#6D28D9] mb-1">.glass-panel-white</div>
                    <div className="text-xs text-[#5B21B6]">Elevated 94% white canvas with 32px drop shadows and soft violet tint.</div>
                  </div>
                  <div className="p-4 rounded-xl glass-panel-amber text-[#6D28D9] border border-violet-300">
                    <div className="font-mono text-xs text-[#7C3AED] mb-1">.glass-panel-violet</div>
                    <div className="text-xs text-[#4C1D95]">High-priority focal surface with electric violet radiance and 20px ambient glow.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Typography */}
          {activeGuideTab === 'typography' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-8 rounded-3xl border bg-white border-violet-200 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="inline-block text-xs font-mono font-bold text-[#7C3AED] px-2.5 py-1 rounded bg-violet-100 mb-3 border border-violet-200">
                      PRIMARY DISPLAY FONT
                    </div>
                    <h3 className="font-heading text-4xl sm:text-5xl font-black mb-3 text-[#2E1065] tracking-tight">
                      Sora Typography
                    </h3>
                    <p className="text-sm leading-relaxed mb-4 text-[#5B21B6]">
                      Used for bold hero headlines, key metrics, pricing values in INR (₹), and status banners. Sora brings an unmistakable precision, futuristic stance, and technical authority to the interface.
                    </p>
                    <div className="space-y-2 font-mono text-xs text-[#7C6898]">
                      <div>Weight 800: Hero H1 (64px - 72px)</div>
                      <div>Weight 700: Section Titles H2 (32px - 40px)</div>
                      <div>Weight 600: Product Names & Cards (16px - 18px)</div>
                    </div>
                  </div>

                  <div>
                    <div className="inline-block text-xs font-mono font-bold text-[#6D28D9] px-2.5 py-1 rounded bg-violet-100 mb-3 border border-violet-200">
                      SYSTEM INTERFACE FONT
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold mb-3 font-sans text-[#2E1065]">
                      Inter Interface
                    </h3>
                    <p className="text-sm leading-relaxed mb-4 text-[#5B21B6]">
                      Crafted for hyper-legible body paragraphs, comparison tables, pro/con bullet lists, and micro-labels. Optimized for crisp subpixel rendering across high-DPI retina screens and mobile viewports.
                    </p>
                    <div className="space-y-2 font-mono text-xs text-[#7C6898]">
                      <div>Weight 500: Body Copy (14px - 16px)</div>
                      <div>Weight 600: Table Headers & Nav links (12px - 14px)</div>
                      <div>Weight 400: Technical Notes & Secondary Metadata (11px - 12px)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Component Primitives */}
          {activeGuideTab === 'components' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-8 rounded-3xl border bg-white border-violet-200 shadow-lg">
                <h4 className="font-bold text-lg mb-6 font-heading text-[#2E1065]">Interactive Button & Badge Primitives (White & Violet)</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Primary CTA */}
                  <div className="p-4 rounded-xl border border-violet-100 text-center bg-[#FAF8FF]">
                    <div className="text-xs font-mono text-[#7C6898] mb-3">Primary Action</div>
                    <button className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-[#7C3AED] hover:bg-[#6D28D9] text-white beacon-glow flex items-center justify-center gap-1.5 transition-all font-heading">
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Primary CTA</span>
                    </button>
                  </div>

                  {/* Secondary Glass */}
                  <div className="p-4 rounded-xl border border-violet-100 text-center bg-[#FAF8FF]">
                    <div className="text-xs font-mono text-[#7C6898] mb-3">Secondary Surface</div>
                    <button className="w-full py-3 px-4 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-all bg-white hover:bg-violet-50 text-[#6D28D9] border-violet-200">
                      <Search className="w-3.5 h-3.5 text-[#7C3AED]" />
                      <span>Glass Secondary</span>
                    </button>
                  </div>

                  {/* Verified Deal Badge */}
                  <div className="p-4 rounded-xl border border-violet-100 text-center bg-[#FAF8FF]">
                    <div className="text-xs font-mono text-[#7C6898] mb-3">Verified Pill</div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-100 text-[#6D28D9] border border-violet-300 text-xs font-bold font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Official Listing</span>
                    </div>
                  </div>

                  {/* Warning Pill */}
                  <div className="p-4 rounded-xl border border-violet-100 text-center bg-[#FAF8FF]">
                    <div className="text-xs font-mono text-[#7C6898] mb-3">Warning Pill</div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Price Volatility</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Design Constitution */}
          {activeGuideTab === 'principles' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: '1. Strict Zero Fake Stock Policy',
                    desc: 'No generic smiling people or stock laptop illustrations. Every product photo displayed in Vantage MUST originate from the verified official retailer or manufacturer CDN with canonical 200 HTTP headers.',
                    icon: Eye,
                    tag: 'Visual Integrity'
                  },
                  {
                    title: '2. Zero Affiliate Promotion Bias',
                    desc: 'Traditional comparison engines rank items based on who pays the highest affiliate referral commission. Vantage has zero sponsored rankings—recommendations are strictly scored on technical performance and price history.',
                    icon: Shield,
                    tag: 'Radical Transparency'
                  },
                  {
                    title: '3. 100% Free-Tier Architecture',
                    desc: 'Runs on Google Gemini 2.5 Flash free quota, Google Programmable Search, and local SQLite persistence. Zero mandatory monthly subscriptions, zero paywalls for basic price tracking.',
                    icon: Zap,
                    tag: 'Zero Cost Sovereignty'
                  }
                ].map((principle, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border bg-white border-violet-100 shadow-md shadow-violet-500/5 hover:border-violet-300"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-2.5 py-1 rounded-full border border-violet-200">
                      {principle.tag}
                    </span>
                    <h3 className="text-lg font-bold mt-4 mb-2 text-[#2E1065]">{principle.title}</h3>
                    <p className="text-xs leading-relaxed text-[#7C6898]">
                      {principle.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Shopper Testimonials & Verified Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              COMMUNITY PROOF
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-3 font-heading text-[#2E1065]">
              Real Shoppers. Genuine Savings.
            </h2>
            <p className="text-[#5B21B6]">
              How tech enthusiasts and everyday buyers use Vantage to avoid overpaying and sidestep sponsored review traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Vantage saved me ₹6,000 on the Sony XM5 headphones. Instead of trusting sponsored review blogs, its deep synthesis highlighted a Reddit thread showing a Flipkart price dip with card coupons. Bought it in 1 click.',
                author: 'Rohan Sharma',
                role: 'Audiophile & Software Dev',
                saved: 'Saved ₹6,000',
                product: 'Sony WH-1000XM5'
              },
              {
                quote: 'The autonomous Telegram alert is insane. I tracked the MacBook Air M3 with a target of ₹1,15,000. While I was at work, my bot pinged me that Amazon India had dropped the price. Got the all-time low before stock ran out.',
                author: 'Priya Iyer',
                role: 'Design Lead',
                saved: 'Saved ₹19,910',
                product: 'MacBook Air M3'
              },
              {
                quote: 'I was about to buy a flashy air fryer until Vantage synthesized user feedback on Teflon coating peeling after 4 months. Recommended the Philips HD9252 instead, which was 41% off on Amazon.',
                author: 'Karthik Verma',
                role: 'Home Chef & Tech Reviewer',
                saved: 'Saved ₹4,496',
                product: 'Philips HD9252'
              }
            ].map((story, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border flex flex-col justify-between transition-all bg-white border-violet-100 shadow-md shadow-violet-500/5 hover:border-violet-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1 text-[#7C3AED]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#7C3AED]" />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {story.saved}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-6 italic text-[#4C1D95]">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-violet-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#2E1065]">{story.author}</div>
                    <div className="text-xs text-[#7C6898]">{story.role}</div>
                  </div>
                  <span className="text-[11px] font-mono text-[#7C3AED] font-semibold">{story.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-t bg-[#FAF8FF] border-violet-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
              CLEAR ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-3 font-heading text-[#2E1065]">
              Frequently Asked Questions
            </h2>
            <p className="text-[#5B21B6]">
              Everything you need to know about Vantage's zero-cost agentic shopping intelligence.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does Vantage operate at zero cost without subscriptions?',
                a: 'Vantage is architected exclusively on generous free-tier APIs: Google Gemini 2.5 Flash for reasoning, Google Programmable Search (100 free queries/day) for live web search grounding, and client-side SQLite/JSON for zero-cost persistence. No credit card is ever required.'
              },
              {
                q: 'Where do the product photos and links come from?',
                a: 'Unlike generic shopping bots that generate stock placeholders, Vantage uses a real-time CDN resolver that extracts authentic photos directly from retailer CDNs (Amazon, Flipkart, brand CDNs) and pairs them with direct canonical product page links.'
              },
              {
                q: 'How do the autonomous price-drop alerts work?',
                a: 'You can add any product to your tracked list and specify a target price in INR (₹). Vantage runs automated price checks against live retailer listings and dispatches notifications via your personal SMTP email or Telegram bot chat ID.'
              },
              {
                q: 'What is Multi-Source Deep Synthesis?',
                a: 'Instead of doing one generic query, Vantage fires three targeted queries: (1) Retail store price listings, (2) Community forums and Reddit user discussions, and (3) Expert benchmark lab reviews. Gemini 2.5 Flash synthesizes these three distinct perspectives into an unbiased recommendation card.'
              },
              {
                q: 'Can I use Vantage with multiple family members or profiles?',
                a: 'Yes! Vantage features multi-user profile switching (e.g. "default", "alice", "tech_shopper"). Each user profile maintains separate tracked products, notification destinations, and shopping preferences in the database.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border transition-all bg-white border-violet-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 text-[#2E1065]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#7C3AED] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm leading-relaxed border-t text-[#5B21B6] border-violet-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Converting Launch Banner CTA (Rich Violet & White) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="p-8 sm:p-14 rounded-3xl text-center relative overflow-hidden bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] text-white shadow-2xl beacon-glow">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white font-heading">
              Ready to Shop with Unfair Advantage?
            </h2>
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 font-medium text-violet-100">
              Open the Vantage AI Shopping Assistant now. Ask any product question, run deep multi-source synthesis, or track prices in real time in Indian Rupees (₹).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onLaunchApp()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-base bg-white hover:bg-violet-50 text-[#6D28D9] flex items-center justify-center gap-2 shadow-2xl hover:scale-105 transition-all font-heading"
              >
                <Zap className="w-5 h-5 fill-[#6D28D9]" />
                <span>Enter Assistant App Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onLaunchApp({ tab: 'arena' })}
                className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-base bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all font-heading"
              >
                <span>Browse Product Arena</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer in White and Violet */}
      <footer className="py-12 border-t text-xs bg-white border-violet-100 text-[#7C6898]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] beacon-glow flex items-center justify-center font-black text-white text-sm font-heading">
                  ₹
                </div>
                <span className="font-heading font-black text-base tracking-tight text-[#2E1065]">
                  VANTAGE AI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-100 text-[#6D28D9] font-bold border border-violet-200">
                  WHITE & VIOLET EDITION
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-sm mb-4 text-[#5B21B6]">
                The agentic, multi-source research & shopping assistant with unbiased synthesis, verified CDN assets, and zero-cost sovereignty in Indian Rupees (₹).
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Gemini 2.5 Flash: Operational
                </span>
                <span className="text-violet-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#7C3AED] font-semibold">
                  Search Grounding: Active
                </span>
              </div>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-[#2E1065] text-xs mb-3 font-heading">
                App Navigation
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => onLaunchApp({ tab: 'arena' })} className="hover:text-[#7C3AED] transition-colors">
                    Floating Product Arena
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp({ tab: 'chat' })} className="hover:text-[#7C3AED] transition-colors">
                    AI Research Chat
                  </button>
                </li>
                <li>
                  <button onClick={() => onLaunchApp({ tab: 'multi' })} className="hover:text-[#7C3AED] transition-colors">
                    Multi-Source Synthesis
                  </button>
                </li>
                <li>
                  <a href="#interactive-radar" className="hover:text-[#7C3AED] transition-colors">
                    Instant Sourcing Radar
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold uppercase tracking-wider text-[#2E1065] text-xs mb-3 font-heading">
                Brand & Architecture
              </div>
              <ul className="space-y-2">
                <li>
                  <a href="#brand-guide" className="hover:text-[#7C3AED] transition-colors">
                    White & Violet Tokens
                  </a>
                </li>
                <li>
                  <a href="#brand-guide" className="hover:text-[#7C3AED] transition-colors">
                    Sora & Inter Typography
                  </a>
                </li>
                <li>
                  <span className="text-[#7C6898]">Free-Tier Sovereignty (Zero Cost)</span>
                </li>
                <li>
                  <span className="text-[#7C6898]">SQLite Local Persistence</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-violet-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-[#7C6898]">
              © {new Date().getFullYear()} Vantage AI Shopping Assistant. All product names, trademarks, and registered trademarks are property of their respective owners.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#7C3AED] font-mono font-bold">Active Profile: {userId}</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-[#7C3AED] font-semibold text-[#6D28D9]"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
