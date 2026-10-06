import React, { useState } from 'react';
import { Hotel } from '../data/hotels';

interface HotelVisualProps {
  hotel: Hotel;
  activeImageUrl?: string;
  className?: string;
  altText?: string;
}

export const HotelVisual: React.FC<HotelVisualProps> = ({
  hotel,
  activeImageUrl,
  className = '',
  altText,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const displayUrl = activeImageUrl || hotel.imageUrl;

  return (
    <div className={`relative w-full h-full overflow-hidden bg-stone-900 select-none ${className}`}>
      {/* 1. Real High-Definition Photograph */}
      {!imageError && (
        <img
          src={displayUrl}
          alt={altText || `${hotel.name} - ${hotel.specBadge}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out saturate-90 group-hover:saturate-110 group-hover:scale-[1.04] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* 2. Loading Placeholder / Fallback Artistic Visual if network blocks */}
      {(!imageLoaded || imageError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2D2623] via-[#1E1A18] to-[#12100E]">
          <div className="text-center p-4">
            <span className="text-3xl inline-block mb-1 animate-pulse">♨️</span>
            <div className="text-stone-300 font-bold text-xs tracking-wider">{hotel.name}</div>
            <div className="text-stone-500 text-[10px] mt-0.5">{hotel.specBadge}</div>
          </div>
        </div>
      )}

      {/* Atmospheric Contrast Scrim (ensures badges and text are 100% readable) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

      {/* Hotel Spec Tag Overlay on Photo */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#292524]/85 backdrop-blur-md text-amber-200 text-xs font-medium border border-white/10 shadow-sm pointer-events-none">
        <span className="truncate max-w-[190px]">{hotel.specBadge}</span>
      </div>

      {/* Transit Tag on Bottom Right */}
      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/65 backdrop-blur-md text-stone-200 text-xs font-medium border border-white/10 pointer-events-none">
        {hotel.transitBadge}
      </div>
    </div>
  );
};
