import React from 'react';
import { RefreshCw, Home, AlertCircle, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';

interface FriendlyErrorScreenProps {
  errorType?: 'quota' | 'rate-limit' | 'general';
  customMessage?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const FriendlyErrorScreen: React.FC<FriendlyErrorScreenProps> = ({
  errorType = 'general',
  customMessage,
  onRetry = () => window.location.reload(),
  onGoHome = () => {
    window.location.href = '/';
  },
}) => {
  const isBusy = errorType === 'quota' || errorType === 'rate-limit';

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#2E1065] flex flex-col items-center justify-center p-4 sm:p-8 select-none">
      <div className="max-w-md w-full glass-panel-white border border-violet-200 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow indicator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-violet-400 via-[#7C3AED] to-purple-600 rounded-full blur-xs" />

        {/* Icon & Badge */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] text-white flex items-center justify-center font-heading font-black text-2xl shadow-xl shadow-violet-500/25">
            ₹
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-[#6D28D9] border border-violet-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vantage AI Assistance</span>
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="font-heading font-black text-xl sm:text-2xl text-[#2E1065] tracking-tight">
            {isBusy ? 'Quota Exceeded' : 'Something Went Wrong'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5B21B6] leading-relaxed">
            {customMessage ||
              (isBusy
                ? 'Quota exceeded, please try again in a moment. Live store research is temporarily receiving high traffic.'
                : 'An unexpected glitch occurred while loading shopping recommendations. Your saved preferences and wishlist remain safe.')}
          </p>
        </div>

        {/* Status Callout */}
        <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-200 text-xs text-left flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#2E1065]">Store Links & Direct Deals Active</div>
            <div className="text-[11px] text-[#7C6898]">
              Prices and availability may change. Check the store before buying. Vantage AI may earn a commission from some links.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold border border-violet-200 hover:bg-violet-50 text-[#6D28D9] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Vantage AI Error Boundary Caught]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || '';
      const isQuotaOrRateLimit = /429|quota|rate limit|busy|resource_exhausted/i.test(msg);

      return (
        <FriendlyErrorScreen
          errorType={isQuotaOrRateLimit ? 'quota' : 'general'}
          customMessage={
            isQuotaOrRateLimit
              ? 'Quota exceeded, please try again in a moment.'
              : undefined
          }
          onRetry={() => this.setState({ hasError: false })}
          onGoHome={() => {
            this.setState({ hasError: false });
            window.location.href = '/';
          }}
        />
      );
    }

    return this.props.children;
  }
}
