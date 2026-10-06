import React, { useState, useMemo, useEffect } from 'react';
import { HOTELS, Hotel } from './data/hotels';
import { Navbar } from './components/Navbar';
import { HomeGuideHero } from './components/HomeGuideHero';
import { FeaturedHotels } from './components/FeaturedHotels';
import { NextStepArchitectureHub } from './components/NextStepArchitectureHub';
import { Footer } from './components/Footer';
import { AllHotelsSection } from './components/AllHotelsSection';
import { SplitViewWorkspace } from './components/SplitViewWorkspace';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { ComparisonModal } from './components/ComparisonModal';
import { HotelDetailModal } from './components/HotelDetailModal';
import { FavoritesModal } from './components/FavoritesModal';
import { EncyclopediaModal } from './components/EncyclopediaModal';
import { BookingModal } from './components/BookingModal';
import { PersonaFilter } from './components/HeroSection';

export default function App() {
  // Quota Exceeded state (Tier 1 & 2 Google Maps Quota Handling)
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Navigation State from URL parameters if available
  const [currentTab, setCurrentTab] = useState<'featured' | 'split' | 'all' | 'guide'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      if (view === 'split') return 'split';
      if (view === 'all') return 'all';
    } catch {}
    return 'featured';
  });

  const [activePersona, setActivePersona] = useState<PersonaFilter>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('persona') as PersonaFilter;
      if (['couple', 'family', 'transit'].includes(p)) return p;
    } catch {}
    return 'all';
  });

  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('favorites') === 'true';
    } catch {}
    return false;
  });

  const [currency, setCurrency] = useState<string>('TWD');

  // Interactive Comparison & Favorites State
  const [comparedHotelIds, setComparedHotelIds] = useState<string[]>([]);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jiaoxi_favorites');
      return saved ? JSON.parse(saved) : ['hotel-royal-chiaohsi'];
    } catch {
      return ['hotel-royal-chiaohsi'];
    }
  });

  // Modal Dialogs State
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedDetailHotel, setSelectedDetailHotel] = useState<Hotel | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jiaoxi_favorites', JSON.stringify(favoriteHotelIds));
    } catch {}
  }, [favoriteHotelIds]);

  // Sync currentTab & view to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (currentTab === 'split') params.set('view', 'split');
    else if (currentTab === 'all') params.set('view', 'all');
    else params.delete('view');

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [currentTab]);

  // Featured 3 Hotels strictly specified by user
  const featuredHotels = useMemo(() => {
    return [
      HOTELS.find((h) => h.id === 'mu-jiaoxi')!,
      HOTELS.find((h) => h.id === 'hotel-royal-chiaohsi')!,
      HOTELS.find((h) => h.id === 'wellspring-silks')!,
    ].filter(Boolean);
  }, []);

  // Compared hotels objects
  const comparedHotels = useMemo(() => {
    return HOTELS.filter((h) => comparedHotelIds.includes(h.id));
  }, [comparedHotelIds]);

  // Favorite hotels objects
  const favoriteHotels = useMemo(() => {
    return HOTELS.filter((h) => favoriteHotelIds.includes(h.id));
  }, [favoriteHotelIds]);

  // Compare Toggle Handler (max 4)
  const handleToggleCompare = (hotelId: string) => {
    setComparedHotelIds((prev) => {
      if (prev.includes(hotelId)) {
        return prev.filter((id) => id !== hotelId);
      }
      if (prev.length >= 4) {
        alert('最多可同時橫向對比 4 間溫泉飯店。');
        return prev;
      }
      return [...prev, hotelId];
    });
  };

  // Favorite Toggle Handler
  const handleToggleFavorite = (hotelId: string) => {
    setFavoriteHotelIds((prev) => {
      if (prev.includes(hotelId)) {
        return prev.filter((id) => id !== hotelId);
      }
      return [...prev, hotelId];
    });
  };

  // Tab Selection Handler
  const handleSelectTab = (tab: 'featured' | 'split' | 'all' | 'guide') => {
    if (tab === 'guide') {
      setIsEncyclopediaOpen(true);
      return;
    }
    setCurrentTab(tab);
    if (tab === 'featured') {
      setActivePersona('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToFeatured = () => {
    const el = document.getElementById('featured-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F5F2] text-[#112019] flex flex-col font-sans-tc selection:bg-[#1F4A38]/20 selection:text-[#1F4A38]">
      {/* Required Google Maps Platform Quota Exceeded Sticky Notice */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. 頂部全域導航列 (Navbar - 固定頂部 56px) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        favoritesCount={favoriteHotelIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        currency={currency}
        onChangeCurrency={setCurrency}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If in Split-View Map mode: show interactive 45/55 Split-View Workspace */}
        {currentTab === 'split' ? (
          <div>
            {/* Breadcrumb back to Home guide */}
            <div className="max-w-[1600px] mx-auto px-4 pt-3 flex items-center justify-between text-xs text-[#41574C]">
              <button
                onClick={() => handleSelectTab('featured')}
                className="hover:text-[#1F4A38] flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>← 返回首頁精簡導引</span>
              </button>
              <span className="text-[11px] bg-[#EAF1EC] px-2 py-0.5 rounded text-[#1F4A38] font-semibold">
                步驟 03 ｜ Google 分屏實景與導航
              </span>
            </div>

            <SplitViewWorkspace
              hotels={HOTELS}
              activePersona={activePersona}
              onSelectPersona={setActivePersona}
              comparedHotelIds={comparedHotelIds}
              favoriteHotelIds={favoriteHotelIds}
              onToggleCompare={handleToggleCompare}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetail={(hotel) => setSelectedDetailHotel(hotel)}
              onBookHotel={(hotel) => setBookingHotel(hotel)}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavoritesOnly={setShowFavoritesOnly}
            />
          </div>
        ) : currentTab === 'all' ? (
          /* All Hotels Directory View */
          <div>
            <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between text-xs text-[#41574C]">
              <button
                onClick={() => handleSelectTab('featured')}
                className="hover:text-[#1F4A38] flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>← 返回首頁精簡導引</span>
              </button>
              <span className="text-[11px] bg-[#EAF1EC] px-2 py-0.5 rounded text-[#1F4A38] font-semibold">
                步驟 02 ｜ 10 間完整評鑑目錄
              </span>
            </div>

            <AllHotelsSection
              hotels={HOTELS}
              activePersona={activePersona}
              onSelectPersona={setActivePersona}
              comparedHotelIds={comparedHotelIds}
              favoriteHotelIds={favoriteHotelIds}
              onToggleCompare={handleToggleCompare}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetail={(hotel) => setSelectedDetailHotel(hotel)}
              onBookHotel={(hotel) => setBookingHotel(hotel)}
            />
          </div>
        ) : (
          /* Serene, Uncluttered Homepage Journey */
          <>
            {/* 精簡美觀的指引和圖 (HomeGuideHero) */}
            <HomeGuideHero
              activePersona={activePersona}
              onSelectPersona={setActivePersona}
              onGoToMap={() => setCurrentTab('split')}
              onGoToAll={() => setCurrentTab('all')}
              onOpenCompare={() => setIsComparisonModalOpen(true)}
              onOpenGuide={() => setIsEncyclopediaOpen(true)}
              onScrollToFeatured={handleScrollToFeatured}
            />

            {/* 精選推薦飯店（步驟 02）：3 間指標性卡片 */}
            <FeaturedHotels
              hotels={featuredHotels}
              comparedHotelIds={comparedHotelIds}
              favoriteHotelIds={favoriteHotelIds}
              onToggleCompare={handleToggleCompare}
              onToggleFavorite={handleToggleFavorite}
              onOpenDetail={(hotel) => setSelectedDetailHotel(hotel)}
              onBookHotel={(hotel) => setBookingHotel(hotel)}
            />

            {/* 按照網站架構進行下一步 (NextStepArchitectureHub) */}
            <NextStepArchitectureHub
              onGoToMap={() => setCurrentTab('split')}
              onGoToAll={() => setCurrentTab('all')}
              onOpenCompare={() => setIsComparisonModalOpen(true)}
              onOpenGuide={() => setIsEncyclopediaOpen(true)}
            />
          </>
        )}
      </main>

      {/* 底部版權宣告 (Footer) */}
      <Footer />

      {/* ⚖️ Comparison Drawer (狀態觸發：有勾選才由底部平滑滑出) */}
      <ComparisonDrawer
        selectedHotels={comparedHotels}
        onRemoveHotel={(id) => handleToggleCompare(id)}
        onClearAll={() => setComparedHotelIds([])}
        onOpenModal={() => setIsComparisonModalOpen(true)}
      />

      {/* 8-Dimension Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        hotels={comparedHotels.length > 0 ? comparedHotels : featuredHotels}
        onRemoveHotel={(id) => handleToggleCompare(id)}
        onBookHotel={(hotel) => setBookingHotel(hotel)}
      />

      {/* Hotel Detail Quick-View Modal */}
      <HotelDetailModal
        hotel={selectedDetailHotel}
        onClose={() => setSelectedDetailHotel(null)}
        isCompared={selectedDetailHotel ? comparedHotelIds.includes(selectedDetailHotel.id) : false}
        isFavorite={selectedDetailHotel ? favoriteHotelIds.includes(selectedDetailHotel.id) : false}
        onToggleCompare={handleToggleCompare}
        onToggleFavorite={handleToggleFavorite}
        onBookHotel={(hotel) => setBookingHotel(hotel)}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteHotels}
        onRemoveFavorite={handleToggleFavorite}
        onClearFavorites={() => setFavoriteHotelIds([])}
        onOpenDetail={(hotel) => setSelectedDetailHotel(hotel)}
        onBookHotel={(hotel) => setBookingHotel(hotel)}
      />

      {/* Encyclopedia & Transit Modal */}
      <EncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />

      {/* Direct Booking Outbound Modal */}
      <BookingModal
        hotel={bookingHotel}
        onClose={() => setBookingHotel(null)}
      />
    </div>
  );
}
