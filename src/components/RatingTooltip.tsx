import React, { useState } from 'react';
import { Star, Sparkles, ThumbsUp } from 'lucide-react';
import { Hotel } from '../data/hotels';

interface RatingTooltipProps {
  hotel: Hotel;
}

export const RatingTooltip: React.FC<RatingTooltipProps> = ({ hotel }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-flex items-center cursor-help py-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="tooltip"
    >
      {/* Trigger: Rating Star & Score */}
      <div className="flex items-center gap-1.5 transition-colors group-hover:text-[#1F4A38]">
        <div className="flex items-center text-[#C59B3F] font-bold">
          <Star className="w-3.5 h-3.5 fill-[#C59B3F] mr-0.5 transition-transform duration-200 group-hover:scale-110" />
          <span className="font-num text-sm text-[#14241C] font-bold">{hotel.rating.toFixed(1)}</span>
        </div>
        <span className="text-[#55685E] font-num text-xs">({hotel.reviewCount})</span>
      </div>

      {/* Floating Micro-interaction Tooltip in Ink-Green aesthetic */}
      {isHovered && (
        <div className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="w-64 bg-[#14241C] text-white rounded-xl p-3 shadow-2xl border border-[#234235] backdrop-blur-md">
            {/* Header: 熱門好評 */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1F4A38] text-emerald-200 text-[10px] font-bold tracking-wide border border-[#2D6A50]/50">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                {hotel.reviewPraise?.badge || '熱門好評'}
              </span>
              <span className="text-[#D4AF37] font-num text-xs font-bold flex items-center gap-0.5">
                <ThumbsUp className="w-3 h-3 text-[#D4AF37]" />
                {hotel.reviewPraise?.scoreText || '98% 住客極致推薦'}
              </span>
            </div>

            {/* Praise Highlight Tag */}
            <p className="text-[11px] text-stone-300 leading-snug">
              {hotel.reviewPraise?.tag || hotel.specs.reputation}
            </p>

            {/* Downward Pointer Arrow */}
            <div className="absolute top-full left-5 -mt-1 w-2.5 h-2.5 bg-[#14241C] rotate-45 border-r border-b border-[#234235]" />
          </div>
        </div>
      )}
    </div>
  );
};
