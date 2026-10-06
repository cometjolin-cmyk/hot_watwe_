import React from 'react';
import { Hotel } from '../data/hotels';
import { X, Heart, Trash2 } from 'lucide-react';
import { HotelVisual } from './HotelVisual';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Hotel[];
  onRemoveFavorite: (hotelId: string) => void;
  onClearFavorites: () => void;
  onOpenDetail: (hotel: Hotel) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const FavoritesModal: React.FC<FavoritesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onClearFavorites,
  onOpenDetail,
  onBookHotel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#D5E0D8] overflow-hidden my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F7FAF8] border-b border-[#D5E0D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-600 text-rose-600" />
            <h3 className="font-serif-tc font-bold text-lg text-[#14241C]">我的收藏溫泉清單</h3>
            <span className="text-xs text-[#55685E]">({favorites.length})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-[#D5E0D8]">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-[#55685E]">
              <Heart className="w-8 h-8 mx-auto mb-2 text-stone-300" />
              <p className="font-serif-tc text-sm font-medium text-[#14241C]">目前尚無收藏的溫泉飯店</p>
              <p className="text-xs text-[#55685E] mt-1">
                在心儀飯店卡片上點擊愛心圖示，即可在此隨時查看。
              </p>
            </div>
          ) : (
            favorites.map((hotel) => (
              <div key={hotel.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                <div
                  className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-900 cursor-pointer shadow-xs"
                  onClick={() => {
                    onOpenDetail(hotel);
                    onClose();
                  }}
                >
                  <HotelVisual hotel={hotel} className="w-full h-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      onOpenDetail(hotel);
                      onClose();
                    }}
                    className="font-serif-tc font-bold text-sm text-[#14241C] hover:text-[#1F4A38] truncate cursor-pointer"
                  >
                    {hotel.name}
                  </h4>
                  <div className="text-xs text-[#55685E] flex items-center gap-1.5 mt-0.5">
                    <span>★ {hotel.rating.toFixed(1)}</span>
                    <span>‧</span>
                    <span className="text-[#1F4A38] font-semibold">
                      NT$ {hotel.priceNight.toLocaleString()} 起
                    </span>
                  </div>
                  <div className="text-[11px] text-[#2D6A50] truncate mt-0.5">
                    {hotel.specBadge}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onBookHotel(hotel)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#1F4A38] hover:bg-[#16382A] text-white transition-colors cursor-pointer"
                  >
                    預訂
                  </button>
                  <button
                    onClick={() => onRemoveFavorite(hotel.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="移除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="px-6 py-3 bg-[#F7FAF8] border-t border-[#D5E0D8] flex items-center justify-between">
            <button
              onClick={onClearFavorites}
              className="text-xs text-[#55685E] hover:text-rose-600 transition-colors cursor-pointer"
            >
              清空收藏清單
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#14241C] text-white"
            >
              關閉
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
