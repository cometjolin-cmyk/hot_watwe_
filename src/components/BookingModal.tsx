import React from 'react';
import { Hotel } from '../data/hotels';
import { X, ExternalLink, ShieldCheck, Ticket } from 'lucide-react';
import { HotelVisual } from './HotelVisual';

interface BookingModalProps {
  hotel: Hotel | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ hotel, onClose }) => {
  if (!hotel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#D5E0D8] overflow-hidden my-auto flex flex-col">
        {/* Real photo header */}
        <div className="relative aspect-16/9 bg-stone-900">
          <HotelVisual hotel={hotel} className="w-full h-full" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4 right-4 text-white z-10">
            <span className="px-2 py-0.5 rounded bg-[#1F4A38] text-xs font-semibold">
              {hotel.specBadge}
            </span>
            <h3 className="font-serif-tc font-bold text-xl text-white drop-shadow-md mt-1">{hotel.name}</h3>
            <p className="text-xs text-stone-300 drop-shadow">{hotel.enName}</p>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-[#F7FAF8] border border-[#D5E0D8] mb-5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#55685E]">雙人一泊一食平日起價</span>
              <span className="font-num text-lg font-bold text-[#1F4A38]">
                NT$ {hotel.priceNight.toLocaleString()}
              </span>
            </div>
            {hotel.dayUsePrice && (
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#D5E0D8]">
                <span className="text-[#55685E]">日歸純泡湯 / 雙人湯屋券起價</span>
                <span className="font-num font-semibold text-[#2D6A50]">
                  NT$ {hotel.dayUsePrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Trust Badges */}
          <div className="space-y-2.5 mb-6 text-xs text-[#55685E]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>直連 Klook 官方認證合作頁面，享受即時房價與免費取消條款</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#1F4A38] shrink-0" />
              <span>支援雙人湯屋電子票券即買即用，出示 QR Code 即可入場</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2.5">
            <a
              href={hotel.specs.klookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-[#1F4A38] hover:bg-[#16382A] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#1F4A38]/20 transition-all text-center"
            >
              <span>前往 Klook 查看最新空房與優惠</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={hotel.specs.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#EAF1EC] hover:bg-[#DCE7DF] text-[#14241C] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors text-center border border-[#D5E0D8]"
            >
              <span>聯繫飯店官方 Facebook 粉絲團</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
