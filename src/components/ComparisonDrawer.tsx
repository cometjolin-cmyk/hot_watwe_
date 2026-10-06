import React from 'react';
import { Hotel } from '../data/hotels';
import { X, Layers, ArrowUpRight } from 'lucide-react';

interface ComparisonDrawerProps {
  selectedHotels: Hotel[];
  onRemoveHotel: (hotelId: string) => void;
  onClearAll: () => void;
  onOpenModal: () => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  selectedHotels,
  onRemoveHotel,
  onClearAll,
  onOpenModal,
}) => {
  if (selectedHotels.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none transition-transform duration-300 ease-out">
      <div className="max-w-4xl mx-auto bg-[#14241C]/95 text-stone-100 rounded-2xl shadow-2xl border border-[#234235] p-3 sm:p-4 backdrop-blur-md pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Indicator & Hotel Pills */}
        <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto w-full sm:w-auto py-1">
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-300 text-xs font-bold font-serif-tc">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>水墨對比欄 ({selectedHotels.length}/4)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {selectedHotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex items-center gap-2 bg-[#1A3329] border border-[#2D6A50]/60 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 shrink-0"
              >
                <span className="font-medium text-stone-100 max-w-[120px] truncate">
                  {hotel.name}
                </span>
                <span className="text-[#D4AF37] font-num text-[11px] font-bold">
                  ${hotel.priceNight.toLocaleString()}
                </span>
                <button
                  onClick={() => onRemoveHotel(hotel.id)}
                  className="hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
                  title="移除此項"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={onClearAll}
            className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            清空
          </button>
          <button
            onClick={onOpenModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#1F4A38] hover:bg-[#16382A] text-white shadow-md shadow-[#1F4A38]/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-[#2D6A50]"
          >
            <span>展開 8 維度橫向對比</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
