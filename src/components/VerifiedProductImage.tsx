import React, { useState, useEffect } from 'react';
import { ImageOff, Sparkles, ExternalLink } from 'lucide-react';

interface VerifiedProductImageProps {
  src?: string;
  alt: string;
  productName: string;
  imageSourceUrl?: string;
  fallbackUrls?: string[];
  className?: string;
  containerClassName?: string;
  aspectRatioClass?: string; // e.g. 'aspect-square' or 'aspect-[4/3]'
  showSourceBadge?: boolean;
}

export const VerifiedProductImage: React.FC<VerifiedProductImageProps> = ({
  src,
  alt,
  productName,
  imageSourceUrl,
  fallbackUrls = [],
  className = '',
  containerClassName = '',
  aspectRatioClass = 'aspect-square',
  showSourceBadge = false,
}) => {
  // Candidate images list to try sequentially if one fails
  const candidateImages = React.useMemo(() => {
    const list: string[] = [];
    if (src && src.trim()) list.push(src.trim());
    for (const f of fallbackUrls) {
      if (f && f.trim() && !list.includes(f.trim())) {
        list.push(f.trim());
      }
    }
    return list;
  }, [src, fallbackUrls]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(candidateImages.length === 0);

  // Reset when primary src changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsLoading(true);
    setHasError(candidateImages.length === 0);
  }, [src, candidateImages.length]);

  const handleImageError = () => {
    if (currentIndex + 1 < candidateImages.length) {
      // Try next image candidate from the verified page
      setCurrentIndex(prev => prev + 1);
      setIsLoading(true);
    } else {
      // All candidates failed — show neutral placeholder with product name & "Image unavailable"
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const activeSrc = candidateImages[currentIndex] || '';

  return (
    <div
      className={`relative ${aspectRatioClass} w-full bg-white flex items-center justify-center overflow-hidden rounded-2xl border border-violet-100/80 group ${containerClassName}`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Loading Skeleton to prevent layout shift */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-slate-100/90 animate-pulse flex flex-col items-center justify-center p-3 z-10">
          <div className="w-10 h-10 rounded-xl bg-slate-200/80 mb-2 flex items-center justify-center text-slate-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="h-2.5 w-24 bg-slate-200/80 rounded-full mb-1" />
          <div className="h-2 w-16 bg-slate-200/60 rounded-full" />
        </div>
      )}

      {/* Verified Product Image */}
      {!hasError && activeSrc ? (
        <img
          src={activeSrc}
          alt={alt || productName}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
        />
      ) : (
        /* Neutral Placeholder with Product Name and "Image unavailable" Label */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-50 border border-slate-100 select-none">
          <div className="w-10 h-10 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-400 mb-2">
            <ImageOff className="w-5 h-5" />
          </div>
          <p className="font-heading font-bold text-xs text-slate-700 line-clamp-2 px-1 mb-1 leading-snug">
            {productName}
          </p>
          <span className="inline-block text-[10px] font-semibold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-md tracking-wide">
            Image unavailable
          </span>
        </div>
      )}

      {/* Traced Source URL Badge (if provided) */}
      {showSourceBadge && imageSourceUrl && !hasError && (
        <a
          href={imageSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 hover:bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs shadow-xs z-20"
          title={`Verified image sourced from: ${imageSourceUrl}`}
        >
          <span>Source PDP</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
};
