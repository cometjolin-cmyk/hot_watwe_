import React, { useState } from 'react';
import { Hotel } from '../data/hotels';
import { HotelVisual } from './HotelVisual';
import { Heart, Check, Info, Sparkles, ChevronLeft, ChevronRight, Star, ThumbsUp } from 'lucide-react';

interface FeaturedHotelsProps {
  hotels: Hotel[];
  comparedHotelIds: string[];
  favoriteHotelIds: string[];
  onToggleCompare: (hotelId: string) => void;
  onToggleFavorite: (hotelId: string) => void;
  onOpenDetail: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({
  hotels,
  comparedHotelIds,
  favoriteHotelIds,
  onToggleCompare,
  onToggleFavorite,
  onOpenDetail,
  onBookHotel,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [hotelId: string]: number }>({});
  const [hoveredRatingHotelId, setHoveredRatingHotelId] = useState<string | null>(null);

  const handleNextPhoto = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const current = activePhotoIdx[hotel.id] || 0;
    const next = (current + 1) % hotel.galleryUrls.length;
    setActivePhotoIdx((prev) => ({ ...prev, [hotel.id]: next }));
  };

  const handlePrevPhoto = (e: React.MouseEvent, hotel: Hotel) => {
    e.stopPropagation();
    const current = activePhotoIdx[hotel.id] || 0;
    const prev = (current - 1 + hotel.galleryUrls.length) % hotel.galleryUrls.length;
    setActivePhotoIdx((p) => ({ ...p, [hotel.id]: prev }));
  };

  return (
    <section id="featured-section" className="py-8 px-4 max-w-7xl mx-auto scroll-mt-20">
      {/* Section Title with Ink Green Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 mb-6">
        <div>
          <div className="text-[11px] font-semibold text-[#1F4A38] tracking-widest uppercase mb-0.5">
            STEP 02 ｜ CURATED COLLECTION
          </div>
          <h3 className="font-serif-tc text-[20px] sm:text-[22px] font-bold text-[#112019] tracking-tight flex items-center gap-2">
            <span>♨️</span>
            <span>精選推薦飯店（步驟 02）</span>
          </h3>
        </div>
        <span className="text-xs text-[#41574C] flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
          實地水質、私湯池與隱私規格深度評鑑
        </span>
      </div>

      {/* 3-Column Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hotels.map((hotel) => {
          const isCompared = comparedHotelIds.includes(hotel.id);
          const isFavorite = favoriteHotelIds.includes(hotel.id);
          const currentPhotoIdx = activePhotoIdx[hotel.id] || 0;
          const currentImg = hotel.galleryUrls[currentPhotoIdx] || hotel.imageUrl;

          return (
            <article
              key={hotel.id}
              className="group bg-white rounded-2xl border border-[#D5E0D8] hover:border-[#1F4A38]/60 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image Area with Micro-interaction and Photo Navigation */}
              <div
                className="relative aspect-4/3 overflow-hidden cursor-pointer bg-stone-900"
                onClick={() => onOpenDetail(hotel)}
              >
                <HotelVisual
                  hotel={hotel}
                  activeImageUrl={currentImg}
                  className="w-full h-full"
                />

                {/* Favorite Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(hotel.id);
                  }}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  title={isFavorite ? '從收藏移除' : '加入收藏'}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>

                {/* Photo Micro-Pagination Arrows */}
                {hotel.galleryUrls.length > 1 && (
                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={(e) => handlePrevPhoto(e, hotel)}
                      className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
                      title="上一張照片"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleNextPhoto(e, hotel)}
                      className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
                      title="下一張照片"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Photo Dots indicator */}
                {hotel.galleryUrls.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none">
                    {hotel.galleryUrls.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentPhotoIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Quick info trigger on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[#14241C] text-xs font-semibold shadow-md flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#1F4A38]" />
                    點擊查看私湯規格
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating & Review Count with interactive Rating block */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div
                      className="relative inline-flex items-center cursor-pointer select-none py-0.5"
                      onMouseEnter={() => setHoveredRatingHotelId(hotel.id)}
                      onMouseLeave={() => setHoveredRatingHotelId(null)}
                      tabIndex={0}
                      role="tooltip"
                    >
                      <div className="flex items-center gap-1.5 transition-all hover:opacity-90">
                        <div className="flex items-center text-[#C59B3F] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#C59B3F] mr-0.5 transition-transform duration-200 hover:scale-125" />
                          <span className="font-num text-sm text-[#112019] font-bold">
                            {hotel.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[#41574C] font-num text-xs">
                          ({hotel.reviewCount} 則評價)
                        </span>
                      </div>

                      {/* Floating Micro-interaction Tooltip: 『熱門好評』 */}
                      {hoveredRatingHotelId === hotel.id && (
                        <div className="absolute bottom-full left-0 mb-2.5 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                          <div className="w-64 bg-[#112019]/95 text-stone-100 rounded-xl p-3 shadow-2xl border border-[#2D6A50] backdrop-blur-md">
                            {/* Header with 『熱門好評』 badge */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1F4A38] text-emerald-200 text-[10px] font-bold tracking-wide border border-[#2D6A50]">
                                <Sparkles className="w-3 h-3 text-[#C59B3F]" />
                                <span>『熱門好評』</span>
                              </span>
                              <span className="text-[#C59B3F] font-num text-xs font-bold flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3 text-[#C59B3F]" />
                                <span>{hotel.reviewPraise?.scoreText || '98% 極致推薦'}</span>
                              </span>
                            </div>

                            {/* Praise Highlight */}
                            <p className="text-[11px] text-stone-300 leading-snug">
                              {hotel.reviewPraise?.tag || hotel.specs.reputation}
                            </p>

                            {/* Downward Pointer Arrow */}
                            <div className="absolute top-full left-5 -mt-1 w-2.5 h-2.5 bg-[#112019] rotate-45 border-r border-b border-[#2D6A50]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-[#41574C] bg-[#EAF1EC] px-2 py-0.5 rounded-md border border-[#D2DED5]">
                      {'★'.repeat(hotel.starLevel)} 星級指標
                    </span>
                  </div>

                  {/* Hotel Name */}
                  <h4
                    onClick={() => onOpenDetail(hotel)}
                    className="font-serif-tc font-bold text-lg text-[#14241C] hover:text-[#1F4A38] transition-colors cursor-pointer leading-snug mb-1"
                  >
                    {hotel.name}
                  </h4>
                  <p className="text-xs text-[#55685E] mb-3 line-clamp-1">{hotel.enName}</p>

                  {/* Spec & Transit Badges */}
                  <div className="py-2.5 px-3 rounded-xl bg-[#F7FAF8] border border-[#D5E0D8] text-xs text-[#1F4A38] mb-4">
                    <div className="font-medium flex items-center gap-1.5 leading-relaxed">
                      <span>{hotel.specBadge}</span>
                      <span className="text-stone-300">‧</span>
                      <span className="text-[#14241C] font-medium">{hotel.transitBadge}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action Buttons */}
                <div className="pt-3 border-t border-[#D5E0D8]">
                  {/* Price Row */}
                  <div className="flex items-baseline justify-between mb-3.5">
                    <div>
                      <span className="text-xs text-[#55685E] mr-1">住宿</span>
                      <span className="font-num text-xl font-bold text-[#1F4A38]">
                        NT$ {hotel.priceNight.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#55685E] ml-1">起 / 晚</span>
                    </div>
                    {hotel.dayUsePrice && (
                      <span className="text-[11px] text-[#55685E]">
                        日歸 NT$ {hotel.dayUsePrice.toLocaleString()} 起
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Add to Compare Button */}
                    <button
                      onClick={() => onToggleCompare(hotel.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isCompared
                          ? 'bg-[#14241C] text-white border-[#14241C]'
                          : 'bg-white text-[#14241C] hover:bg-[#EAF1EC] border-[#D5E0D8]'
                      }`}
                    >
                      {isCompared ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>已加入比較</span>
                        </>
                      ) : (
                        <span>＋ 加入比較</span>
                      )}
                    </button>

                    {/* Book / Check Rate Button */}
                    <button
                      onClick={() => onBookHotel(hotel)}
                      className="px-3 py-2 text-xs font-semibold rounded-lg bg-[#1F4A38] hover:bg-[#16382A] text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-[0.98]"
                    >
                      <span>查即時房價</span>
                      <span className="text-emerald-200">➜</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
