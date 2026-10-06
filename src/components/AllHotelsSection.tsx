import React, { useState, useMemo } from 'react';
import { Hotel } from '../data/hotels';
import { HotelVisual } from './HotelVisual';
import { RatingTooltip } from './RatingTooltip';
import { Heart, Check, Search, ArrowUpDown, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { PersonaFilter } from './HeroSection';

interface AllHotelsSectionProps {
  hotels: Hotel[];
  activePersona: PersonaFilter;
  onSelectPersona: (p: PersonaFilter) => void;
  comparedHotelIds: string[];
  favoriteHotelIds: string[];
  onToggleCompare: (hotelId: string) => void;
  onToggleFavorite: (hotelId: string) => void;
  onOpenDetail: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const AllHotelsSection: React.FC<AllHotelsSectionProps> = ({
  hotels,
  activePersona,
  onSelectPersona,
  comparedHotelIds,
  favoriteHotelIds,
  onToggleCompare,
  onToggleFavorite,
  onOpenDetail,
  onBookHotel,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'ratingDesc'>('featured');
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [hotelId: string]: number }>({});

  const facilityOptions = [
    { key: 'all', label: '全部設施' },
    { key: '裸湯', label: '男女裸湯' },
    { key: '私湯', label: '房內私湯' },
    { key: '泳池', label: '溫泉泳池' },
    { key: '滑梯', label: '兒童滑梯/水療' },
    { key: '接駁', label: '免費接駁' },
  ];

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

  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        if (activePersona !== 'all' && !hotel.personas.includes(activePersona)) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = hotel.name.toLowerCase().includes(q);
          const matchEn = hotel.enName.toLowerCase().includes(q);
          const matchSpec = hotel.specBadge.toLowerCase().includes(q);
          const matchAmenity = hotel.amenities.some((a) => a.toLowerCase().includes(q));
          if (!matchName && !matchEn && !matchSpec && !matchAmenity) return false;
        }
        if (selectedFacility !== 'all') {
          const matchAmenity = hotel.amenities.some((a) => a.includes(selectedFacility));
          const matchSpec = hotel.specBadge.includes(selectedFacility);
          const matchPublic = hotel.specs.publicBath.includes(selectedFacility);
          if (!matchAmenity && !matchSpec && !matchPublic) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') return a.priceNight - b.priceNight;
        if (sortBy === 'ratingDesc') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating;
      });
  }, [hotels, activePersona, searchQuery, selectedFacility, sortBy]);

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      {/* Search and Filter Control Bar with Ink Green Styling */}
      <div className="bg-white rounded-2xl border border-[#D5E0D8] p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#55685E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋飯店名稱、裸湯、滑梯、近車站、私湯..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#F7FAF8] border border-[#D5E0D8] focus:outline-none focus:border-[#1F4A38] focus:ring-1 focus:ring-[#1F4A38] transition-colors text-[#14241C]"
            />
          </div>

          {/* Facility filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {facilityOptions.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFacility(f.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFacility === f.key
                    ? 'bg-[#1F4A38] text-white shadow-xs'
                    : 'bg-[#EBF1EC] text-[#55685E] hover:text-[#14241C] hover:bg-[#DCE7DF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#55685E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium py-2 px-3 rounded-xl bg-[#F7FAF8] border border-[#D5E0D8] focus:outline-none focus:border-[#1F4A38] text-[#14241C] cursor-pointer"
            >
              <option value="featured">推薦排序</option>
              <option value="priceAsc">價格：低到高</option>
              <option value="ratingDesc">評分：高到低</option>
            </select>
          </div>
        </div>

        {/* Results Counter and Active tags */}
        <div className="mt-3 pt-3 border-t border-[#D5E0D8] flex items-center justify-between text-xs text-[#55685E]">
          <span>
            共找到 <strong className="text-[#1F4A38] font-bold">{filteredHotels.length}</strong> 間精選溫泉飯店
          </span>
          {(searchQuery || selectedFacility !== 'all' || activePersona !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFacility('all');
                onSelectPersona('all');
              }}
              className="text-[#1F4A38] hover:underline cursor-pointer font-medium"
            >
              重設所有篩選
            </button>
          )}
        </div>
      </div>

      {/* Grid of Hotels with ink green aesthetic */}
      {filteredHotels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D5E0D8]">
          <span className="text-3xl mb-2 block">♨️</span>
          <h4 className="font-serif-tc font-bold text-[#14241C] text-base mb-1">找不到符合條件的飯店</h4>
          <p className="text-xs text-[#55685E] mb-4">試著縮小搜尋字詞或切換情境膠囊標籤</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFacility('all');
              onSelectPersona('all');
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1F4A38] text-white"
          >
            清除篩選
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => {
            const isCompared = comparedHotelIds.includes(hotel.id);
            const isFavorite = favoriteHotelIds.includes(hotel.id);
            const currentPhotoIdx = activePhotoIdx[hotel.id] || 0;
            const currentImg = hotel.galleryUrls[currentPhotoIdx] || hotel.imageUrl;

            return (
              <article
                key={hotel.id}
                className="group bg-white rounded-2xl border border-[#D5E0D8] hover:border-[#1F4A38]/50 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Area with hover saturation & scale */}
                <div
                  className="relative aspect-4/3 overflow-hidden cursor-pointer bg-stone-900"
                  onClick={() => onOpenDetail(hotel)}
                >
                  <HotelVisual
                    hotel={hotel}
                    activeImageUrl={currentImg}
                    className="w-full h-full"
                  />

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(hotel.id);
                    }}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>

                  {/* Photo Navigation Arrows */}
                  {hotel.galleryUrls.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button
                        onClick={(e) => handlePrevPhoto(e, hotel)}
                        className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextPhoto(e, hotel)}
                        className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Dots indicator */}
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
                      點擊查看詳情
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating row with interactive RatingTooltip */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <RatingTooltip hotel={hotel} />
                      <span className="text-[11px] text-[#55685E] bg-[#EAF1EC] px-2 py-0.5 rounded-md border border-[#D5E0D8]">
                        {'★'.repeat(hotel.starLevel)} 星級
                      </span>
                    </div>

                    {/* Name */}
                    <h4
                      onClick={() => onOpenDetail(hotel)}
                      className="font-serif-tc font-bold text-lg text-[#14241C] hover:text-[#1F4A38] transition-colors cursor-pointer leading-snug mb-1"
                    >
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-[#55685E] mb-3 line-clamp-1">{hotel.enName}</p>

                    {/* Spec badge */}
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

                    <div className="grid grid-cols-2 gap-2">
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
      )}
    </section>
  );
};
