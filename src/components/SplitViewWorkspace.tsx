import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Hotel } from '../data/hotels';
import { HotelVisual } from './HotelVisual';
import { RatingTooltip } from './RatingTooltip';
import { InteractiveMap } from './InteractiveMap';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';
import { GoogleMapsInteractive } from './GoogleMapsInteractive';
import {
  Heart,
  Check,
  Search,
  ArrowUpDown,
  X,
  ExternalLink,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Map,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import { PersonaFilter } from './HeroSection';

interface SplitViewWorkspaceProps {
  hotels: Hotel[];
  activePersona: PersonaFilter;
  onSelectPersona: (p: PersonaFilter) => void;
  comparedHotelIds: string[];
  favoriteHotelIds: string[];
  onToggleCompare: (hotelId: string) => void;
  onToggleFavorite: (hotelId: string) => void;
  onOpenDetail: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: (enabled: boolean) => void;
}

export const SplitViewWorkspace: React.FC<SplitViewWorkspaceProps> = ({
  hotels,
  activePersona,
  onSelectPersona,
  comparedHotelIds,
  favoriteHotelIds,
  onToggleCompare,
  onToggleFavorite,
  onOpenDetail,
  onBookHotel,
  showFavoritesOnly,
  onToggleFavoritesOnly,
}) => {
  // State for search, price range, facilities, sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(14000);
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'ratingDesc'>('featured');

  // Map view type toggle: 'google-embed' | 'google-interactive' | 'pins'
  const [mapEngine, setMapEngine] = useState<'google-embed' | 'google-interactive' | 'pins'>('google-embed');

  // Interactive bidirectional linkage states
  const [activeHotelId, setActiveHotelId] = useState<string | null>(hotels[0]?.id || null);
  const [hoveredHotelId, setHoveredHotelId] = useState<string | null>(null);

  // Card element refs for auto scrolling into view
  const cardRefs = useRef<{ [id: string]: HTMLElement | null }>({});

  // Active photo gallery slide index per card
  const [activePhotoIdx, setActivePhotoIdx] = useState<{ [hotelId: string]: number }>({});

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

  // Facility filter options
  const facilityOptions = [
    { key: 'all', label: '全部' },
    { key: '裸湯', label: '男女裸湯' },
    { key: '私湯', label: '房內私湯' },
    { key: '泳池', label: '露天泳池' },
    { key: '滑梯', label: '兒童滑梯' },
    { key: '接駁', label: '免費接駁' },
  ];

  // Sync state to URL Query Parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('view', 'split');
    if (activePersona !== 'all') params.set('persona', activePersona);
    else params.delete('persona');

    if (showFavoritesOnly) params.set('favorites', 'true');
    else params.delete('favorites');

    if (selectedFacility !== 'all') params.set('facility', selectedFacility);
    else params.delete('facility');

    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    else params.delete('q');

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [activePersona, showFavoritesOnly, selectedFacility, searchQuery]);

  // Filtered dataset
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        if (showFavoritesOnly && !favoriteHotelIds.includes(hotel.id)) {
          return false;
        }
        if (activePersona !== 'all' && !hotel.personas.includes(activePersona)) {
          return false;
        }
        if (hotel.priceNight > maxPrice) {
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
  }, [hotels, showFavoritesOnly, favoriteHotelIds, activePersona, maxPrice, searchQuery, selectedFacility, sortBy]);

  // Selected hotel for Google Maps Embed
  const focusedHotel = useMemo(() => {
    return (
      hotels.find((h) => h.id === hoveredHotelId) ||
      hotels.find((h) => h.id === activeHotelId) ||
      filteredHotels[0] ||
      hotels[0]
    );
  }, [hoveredHotelId, activeHotelId, filteredHotels, hotels]);

  // When map pin is clicked: set active hotel and scroll left card into view
  const handleSelectHotelFromMap = (hotelId: string) => {
    setActiveHotelId(hotelId);
    const cardEl = cardRefs.current[hotelId];
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-4">
      {/* Top Filter and Control Bar (Dark Green Ink-Wash Styling) */}
      <div className="bg-white rounded-2xl border border-[#D2DED5] p-3.5 sm:p-4 mb-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick search input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-[#41574C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋飯店、溫泉私湯、步程..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl bg-[#F5F8F6] border border-[#D2DED5] focus:outline-none focus:border-[#1F4A38] text-[#112019]"
            />
          </div>

          {/* Persona Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {[
              { key: 'all', label: `全部 (${hotels.length})` },
              { key: 'couple', label: '👩‍❤️‍👨 情侶輕奢' },
              { key: 'family', label: '👨‍👩‍👧‍👦 親子歡樂' },
              { key: 'transit', label: '🎒 無車漫遊' },
            ].map((pill) => (
              <button
                key={pill.key}
                onClick={() => onSelectPersona(pill.key as PersonaFilter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activePersona === pill.key
                    ? 'bg-[#1F4A38] text-white shadow-xs'
                    : 'bg-[#EAF1EC] hover:bg-[#DCE7DF] text-[#112019]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Facilities pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {facilityOptions.map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFacility(f.key)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFacility === f.key
                    ? 'bg-[#112019] text-white'
                    : 'bg-[#EAF1EC] text-[#41574C] hover:text-[#112019]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Favorites Switcher & Sort */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-[#EAF1EC] text-[#41574C] hover:text-rose-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white' : ''}`} />
              <span>僅看收藏 ({favoriteHotelIds.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium py-1.5 px-2.5 rounded-lg bg-[#F5F8F6] border border-[#D2DED5] focus:outline-none focus:border-[#1F4A38] text-[#112019] cursor-pointer"
            >
              <option value="featured">推薦排序</option>
              <option value="priceAsc">價格：低到高</option>
              <option value="ratingDesc">評分：高到低</option>
            </select>
          </div>
        </div>

        {/* Counter and Engine Switch Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-[#D2DED5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#41574C]">
          <div className="flex items-center gap-2">
            <span>
              分屏地圖模式：共 <strong className="text-[#1F4A38] font-bold">{filteredHotels.length}</strong> 間溫泉旅宿
            </span>
            <span className="text-stone-300">|</span>
            <span className="text-emerald-800 font-medium">
              當前地圖聚焦：<strong>{focusedHotel.name}</strong>
            </span>
          </div>

          {/* Engine Switcher: Google Map Embed vs Google Native Interactive vs Sumi-e Pin Map */}
          <div className="flex items-center gap-1.5 bg-[#EAF1EC] p-1 rounded-xl border border-[#D2DED5]">
            <button
              onClick={() => setMapEngine('google-embed')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                mapEngine === 'google-embed'
                  ? 'bg-[#1F4A38] text-white shadow-xs'
                  : 'text-[#41574C] hover:text-[#112019]'
              }`}
              title="官方 Google 地圖嵌入（地點定位、步行路線、360°實景街景）"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Google 實景/導航</span>
            </button>

            <button
              onClick={() => setMapEngine('google-interactive')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                mapEngine === 'google-interactive'
                  ? 'bg-[#1F4A38] text-white shadow-xs'
                  : 'text-[#41574C] hover:text-[#112019]'
              }`}
              title="Google Maps 原生互動圖層（價格藥丸與地標標記）"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Google 原生互動</span>
            </button>

            <button
              onClick={() => setMapEngine('pins')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                mapEngine === 'pins'
                  ? 'bg-[#1F4A38] text-white shadow-xs'
                  : 'text-[#41574C] hover:text-[#112019]'
              }`}
              title="水墨步程虛線圖層"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>水墨圖釘連動</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-View Workspace: Left 45% Card Feed, Right 55% Fixed Height Map Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: 45% on Desktop (lg:col-span-5) */}
        <div className="lg:col-span-5 h-[calc(100vh-190px)] overflow-y-auto pr-1 space-y-4 scroll-smooth">
          {filteredHotels.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#D2DED5]">
              <span className="text-3xl mb-2 block">♨️</span>
              <h4 className="font-serif-tc font-bold text-[#112019] text-base mb-1">無符合條件的飯店</h4>
              <p className="text-xs text-[#41574C] mb-4">請嘗試放寬價格或更換受眾標籤</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFacility('all');
                  onSelectPersona('all');
                  onToggleFavoritesOnly(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1F4A38] text-white"
              >
                重設篩選
              </button>
            </div>
          ) : (
            filteredHotels.map((hotel) => {
              const isCompared = comparedHotelIds.includes(hotel.id);
              const isFavorite = favoriteHotelIds.includes(hotel.id);
              const isSelected = activeHotelId === hotel.id;
              const isHovered = hoveredHotelId === hotel.id;
              const currentPhotoIdx = activePhotoIdx[hotel.id] || 0;
              const currentImg = hotel.galleryUrls[currentPhotoIdx] || hotel.imageUrl;

              return (
                <article
                  key={hotel.id}
                  ref={(el) => {
                    cardRefs.current[hotel.id] = el;
                  }}
                  onMouseEnter={() => {
                    setHoveredHotelId(hotel.id);
                    setActiveHotelId(hotel.id);
                  }}
                  onMouseLeave={() => setHoveredHotelId(null)}
                  onClick={() => setActiveHotelId(hotel.id)}
                  className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs cursor-pointer ${
                    isSelected
                      ? 'border-[#1F4A38] ring-2 ring-[#1F4A38]/30 shadow-md bg-emerald-50/15'
                      : isHovered
                      ? 'border-[#2D6A50] shadow-md scale-[1.005]'
                      : 'border-[#D2DED5] hover:border-[#1F4A38]/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail Image Area with micro-gallery */}
                    <div className="relative sm:w-48 aspect-16/10 sm:aspect-auto overflow-hidden bg-stone-900 shrink-0">
                      <HotelVisual
                        hotel={hotel}
                        activeImageUrl={currentImg}
                        className="w-full h-full"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(hotel.id);
                        }}
                        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/45 hover:bg-black/70 flex items-center justify-center text-white transition-colors cursor-pointer"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>

                      {/* Photo Navigation */}
                      {hotel.galleryUrls.length > 1 && (
                        <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                          <button
                            onClick={(e) => handlePrevPhoto(e, hotel)}
                            className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black/80"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleNextPhoto(e, hotel)}
                            className="w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black/80"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating Row with interactive RatingTooltip */}
                        <div className="flex items-center justify-between text-xs mb-1">
                          <RatingTooltip hotel={hotel} />
                          <span className="text-[11px] text-[#41574C] font-medium bg-[#EAF1EC] px-2 py-0.5 rounded-md border border-[#D2DED5]">
                            {hotel.starLevel}星級溫泉
                          </span>
                        </div>

                        {/* Hotel Title */}
                        <h4
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetail(hotel);
                          }}
                          className="font-serif-tc font-bold text-base text-[#112019] hover:text-[#1F4A38] transition-colors leading-snug truncate"
                        >
                          {hotel.name}
                        </h4>
                        <p className="text-[11px] text-[#41574C] mb-2 truncate">{hotel.enName}</p>

                        {/* Badges */}
                        <div className="text-[11px] text-[#1F4A38] py-1.5 px-2 rounded-lg bg-[#F5F8F6] border border-[#D2DED5] mb-3 leading-tight flex items-center gap-1 truncate">
                          <span>{hotel.specBadge}</span>
                          <span className="text-stone-300">‧</span>
                          <span className="text-[#112019] font-medium">{hotel.transitBadge}</span>
                        </div>
                      </div>

                      {/* Pricing and Action row */}
                      <div className="pt-2.5 border-t border-[#D2DED5] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[11px] text-[#41574C] mr-1">平日起價</span>
                          <span className="font-num text-base font-bold text-[#1F4A38]">
                            NT$ {hotel.priceNight.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(hotel.id);
                            }}
                            className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                              isCompared
                                ? 'bg-[#112019] text-white border-[#112019]'
                                : 'bg-white text-[#112019] hover:bg-[#EAF1EC] border-[#D2DED5]'
                            }`}
                          >
                            {isCompared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : '＋ 對比'}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookHotel(hotel);
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1F4A38] hover:bg-[#16382A] text-white transition-colors cursor-pointer"
                          >
                            查房價 ➜
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Right Side: 55% on Desktop (lg:col-span-7) Fixed Sticky Full-Height Map Window */}
        <div className="lg:col-span-7 h-[520px] lg:h-[calc(100vh-190px)] rounded-2xl overflow-hidden border border-[#D2DED5] shadow-lg sticky top-20 bg-[#112019]">
          {mapEngine === 'google-embed' ? (
            /* Official Embedded Google Maps */
            <GoogleMapsEmbed hotel={focusedHotel} />
          ) : mapEngine === 'google-interactive' ? (
            /* Native Google Maps Interactive with @vis.gl/react-google-maps */
            <GoogleMapsInteractive
              hotels={filteredHotels}
              activeHotelId={activeHotelId}
              hoveredHotelId={hoveredHotelId}
              onSelectHotel={handleSelectHotelFromMap}
              onHoverHotel={setHoveredHotelId}
              onBookHotel={onBookHotel}
              onOpenDetail={onOpenDetail}
            />
          ) : (
            /* Interactive Sumi-e Pin Map with Price Pills & Polyline */
            <InteractiveMap
              hotels={filteredHotels}
              activeHotelId={activeHotelId}
              hoveredHotelId={hoveredHotelId}
              onSelectHotel={handleSelectHotelFromMap}
              onHoverHotel={setHoveredHotelId}
              onBookHotel={onBookHotel}
              onOpenDetail={onOpenDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
};
