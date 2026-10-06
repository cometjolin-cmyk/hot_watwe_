import React, { useState } from 'react';
import { Hotel } from '../data/hotels';
import {
  X,
  Star,
  Heart,
  Check,
  ExternalLink,
  MapPin,
  Bath,
  Utensils,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Map as MapIcon,
} from 'lucide-react';
import { HotelVisual } from './HotelVisual';
import { GoogleMapsEmbed } from './GoogleMapsEmbed';

interface HotelDetailModalProps {
  hotel: Hotel | null;
  onClose: () => void;
  isCompared: boolean;
  isFavorite: boolean;
  onToggleCompare: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const HotelDetailModal: React.FC<HotelDetailModalProps> = ({
  hotel,
  onClose,
  isCompared,
  isFavorite,
  onToggleCompare,
  onToggleFavorite,
  onBookHotel,
}) => {
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'map'>('details');

  if (!hotel) return null;

  const currentPhoto = hotel.galleryUrls[selectedPhotoIdx] || hotel.imageUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#D2DED5] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Visual Cover Header with Real Photography */}
        <div className="relative aspect-16/10 bg-stone-900 group shrink-0">
          <HotelVisual
            hotel={hotel}
            activeImageUrl={currentPhoto}
            className="w-full h-full"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(hotel.id)}
            className="absolute top-4 right-14 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>

          {/* Photo navigation buttons */}
          {hotel.galleryUrls.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 pointer-events-none">
              <button
                onClick={() =>
                  setSelectedPhotoIdx(
                    (selectedPhotoIdx - 1 + hotel.galleryUrls.length) % hotel.galleryUrls.length
                  )
                }
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedPhotoIdx((selectedPhotoIdx + 1) % hotel.galleryUrls.length)
                }
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Floating Info Overlay on Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#1F4A38] text-xs font-semibold">
                {hotel.specBadge}
              </span>
              <span className="text-xs text-stone-200">{hotel.transitBadge}</span>
            </div>
            <h3 className="font-serif-tc font-bold text-2xl text-white drop-shadow-md">{hotel.name}</h3>
            <p className="text-xs text-stone-300 drop-shadow">{hotel.enName}</p>
          </div>
        </div>

        {/* View Switcher Tabs: 規格詳情 vs Google 嵌入地圖 */}
        <div className="px-6 py-2 bg-[#F5F8F6] border-b border-[#D2DED5] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-[#1F4A38] text-white shadow-xs'
                  : 'text-[#41574C] hover:text-[#112019]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>實景寫真與規格</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-[#1F4A38] text-white shadow-xs'
                  : 'text-[#41574C] hover:text-[#112019]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Google 嵌入地圖 (導航/街景)</span>
            </button>
          </div>

          {activeTab === 'details' && hotel.galleryUrls.length > 1 && (
            <span className="text-[11px] font-semibold text-[#41574C] hidden sm:inline">
              寫真 ({selectedPhotoIdx + 1}/{hotel.galleryUrls.length})
            </span>
          )}
        </div>

        {/* Modal Body */}
        {activeTab === 'map' ? (
          /* Google Maps Embed Tab */
          <div className="flex-1 h-[420px] min-h-[380px] overflow-hidden">
            <GoogleMapsEmbed hotel={hotel} />
          </div>
        ) : (
          /* Details Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Thumbnail micro-gallery strip */}
            {hotel.galleryUrls.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {hotel.galleryUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIdx(idx)}
                    className={`relative w-16 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedPhotoIdx === idx
                        ? 'border-[#1F4A38] scale-105 shadow-sm'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`實景縮圖 ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Rating & Pricing Quick Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F8F6] border border-[#D2DED5]">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#C59B3F] font-bold">
                  <Star className="w-4 h-4 fill-[#C59B3F] mr-1" />
                  <span className="font-num text-base text-[#112019]">{hotel.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[#41574C] font-num">({hotel.reviewCount} 則真實評價)</span>
              </div>
              <div>
                <span className="text-xs text-[#41574C] mr-1">住宿平日</span>
                <span className="font-num text-xl font-bold text-[#1F4A38]">
                  NT$ {hotel.priceNight.toLocaleString()}
                </span>
                <span className="text-xs text-[#41574C] ml-1">起 / 晚</span>
              </div>
            </div>

            {/* Editorial Summary */}
            <div>
              <h4 className="font-serif-tc font-bold text-sm text-[#112019] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#C59B3F]" />
                評鑑評語亮點
              </h4>
              <p className="text-xs sm:text-sm text-[#41574C] leading-relaxed">
                {hotel.summary}
              </p>
            </div>

            {/* Key Specs Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DED5]">
                <div className="font-semibold text-xs text-[#1F4A38] mb-1 flex items-center gap-1.5 font-serif-tc">
                  <Bath className="w-4 h-4 text-[#2D6A50]" />
                  客房私湯規格
                </div>
                <p className="text-xs text-[#112019] leading-relaxed">{hotel.specs.privateTub}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DED5]">
                <div className="font-semibold text-xs text-[#1F4A38] mb-1 flex items-center gap-1.5 font-serif-tc">
                  <MapPin className="w-4 h-4 text-[#2D6A50]" />
                  大眾湯泉與水療
                </div>
                <p className="text-xs text-[#112019] leading-relaxed">{hotel.specs.publicBath}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DED5]">
                <div className="font-semibold text-xs text-[#1F4A38] mb-1 flex items-center gap-1.5 font-serif-tc">
                  <Utensils className="w-4 h-4 text-[#2D6A50]" />
                  餐飲美饌
                </div>
                <p className="text-xs text-[#112019] leading-relaxed">{hotel.specs.diningHighlight}</p>
              </div>
            </div>

            {/* Amenities Badges */}
            <div>
              <div className="text-xs font-semibold text-[#41574C] mb-2 font-serif-tc">核心設施一覽</div>
              <div className="flex flex-wrap gap-1.5">
                {hotel.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#EAF1EC] text-[#112019] text-xs font-medium border border-[#D2DED5]"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Action Bar */}
        <div className="px-6 py-4 bg-[#F5F8F6] border-t border-[#D2DED5] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => onToggleCompare(hotel.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
              isCompared
                ? 'bg-[#112019] text-white border-[#112019]'
                : 'bg-white text-[#112019] hover:bg-[#EAF1EC] border-[#D2DED5]'
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

          <div className="flex items-center gap-2">
            <a
              href={hotel.specs.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-medium text-[#112019] hover:text-black bg-[#EAF1EC] hover:bg-[#DCE7DF] rounded-lg transition-colors border border-[#D2DED5]"
            >
              官方 FB
            </a>
            <button
              onClick={() => onBookHotel(hotel)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1F4A38] hover:bg-[#16382A] text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>前往 Klook 查即時房價</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
