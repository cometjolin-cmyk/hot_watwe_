import React from 'react';
import { Hotel } from '../data/hotels';
import { X, ExternalLink, Star } from 'lucide-react';
import { HotelVisual } from './HotelVisual';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotels: Hotel[];
  onRemoveHotel: (hotelId: string) => void;
  onBookHotel: (hotel: Hotel) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  hotels,
  onRemoveHotel,
  onBookHotel,
}) => {
  if (!isOpen || hotels.length === 0) return null;

  const dimensions = [
    {
      key: 'price',
      label: '① 參考均價',
      sub: '住宿起價 / 日歸湯券',
      render: (h: Hotel) => (
        <div>
          <div className="font-num text-lg font-bold text-[#1F4A38]">
            NT$ {h.priceNight.toLocaleString()}
            <span className="text-xs text-[#55685E] font-normal ml-1">起 / 晚</span>
          </div>
          <div className="text-xs text-[#55685E] mt-1">{h.specs.priceDesc}</div>
        </div>
      ),
    },
    {
      key: 'privateTub',
      label: '② 客房私湯材質與配置',
      sub: '岩板 / 檜木 / 雙池 / 景觀',
      render: (h: Hotel) => (
        <div className="text-xs text-[#14241C] leading-relaxed">
          <span className="inline-block px-2 py-0.5 rounded bg-[#EAF1EC] text-[#1F4A38] font-semibold text-[11px] mb-1.5 border border-[#D5E0D8]">
            {h.specBadge}
          </span>
          <p>{h.specs.privateTub}</p>
        </div>
      ),
    },
    {
      key: 'publicBath',
      label: '③ 大眾風呂形態',
      sub: '男女裸湯 / 露天水療 SPA',
      render: (h: Hotel) => (
        <p className="text-xs text-[#14241C] leading-relaxed">{h.specs.publicBath}</p>
      ),
    },
    {
      key: 'kidFacilities',
      label: '④ 兒童休閒與放電設施',
      sub: '滑水道 / 卡丁車 / 球池遊戲室',
      render: (h: Hotel) => (
        <p className="text-xs text-[#14241C] leading-relaxed">{h.specs.kidFacilities}</p>
      ),
    },
    {
      key: 'transitInfo',
      label: '⑤ 交通便利度',
      sub: '火車站步程 / 免費定點接駁',
      render: (h: Hotel) => (
        <div className="text-xs text-[#14241C] leading-relaxed">
          <span className="inline-block px-2 py-0.5 rounded bg-[#EAF1EC] text-[#14241C] font-semibold text-[11px] mb-1.5 border border-[#D5E0D8]">
            {h.transitBadge}
          </span>
          <p>{h.specs.transitInfo}</p>
        </div>
      ),
    },
    {
      key: 'diningHighlight',
      label: '⑥ 餐飲美饌特色',
      sub: '自助百匯 / 日式割烹 / 宵夜點心',
      render: (h: Hotel) => (
        <p className="text-xs text-[#14241C] leading-relaxed">{h.specs.diningHighlight}</p>
      ),
    },
    {
      key: 'reputation',
      label: '⑦ 評分與住客評價',
      sub: 'Google 評分 / 核心真實反饋',
      render: (h: Hotel) => (
        <div className="text-xs text-[#14241C] leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#C59B3F] font-bold text-sm mb-1">
            <Star className="w-3.5 h-3.5 fill-[#C59B3F]" />
            <span className="font-num text-[#14241C] font-bold">{h.rating.toFixed(1)}</span>
            <span className="text-xs text-[#55685E] font-normal">({h.reviewCount} 則評價)</span>
          </div>
          <p className="text-[#55685E] italic">{h.specs.reputation}</p>
        </div>
      ),
    },
    {
      key: 'booking',
      label: '⑧ 直連預訂與官方粉絲團',
      sub: 'Klook 優惠 ＆ 官方 FB',
      render: (h: Hotel) => (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onBookHotel(h)}
            className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#1F4A38] hover:bg-[#16382A] text-white transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
          >
            <span>查即時房價</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <a
            href={h.specs.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 px-3 text-xs font-medium text-center rounded-lg bg-[#EAF1EC] hover:bg-[#DCE7DF] text-[#14241C] transition-colors"
          >
            官方 Facebook 專頁
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#D5E0D8] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D5E0D8] flex items-center justify-between bg-[#F7FAF8]">
          <div>
            <h3 className="font-serif-tc font-bold text-lg text-[#14241C] flex items-center gap-2">
              <span>⚖️</span>
              <span>8 維度溫泉飯店橫向規格對比</span>
            </h3>
            <p className="text-xs text-[#55685E] mt-0.5">
              對比已選 {hotels.length} 間飯店，精準鎖定私湯材質、交通步程與最優房價
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Matrix Table with sticky left header */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[760px]">
            <thead>
              <tr className="bg-[#EBF1EC] border-b border-[#D5E0D8]">
                <th className="sticky left-0 z-20 bg-[#EBF1EC] p-4 font-serif-tc font-bold text-xs text-[#55685E] uppercase tracking-wider w-48 min-w-[190px] border-r border-[#D5E0D8]">
                  評鑑維度
                </th>
                {hotels.map((h) => (
                  <th key={h.id} className="p-4 align-top w-64 min-w-[240px] border-r border-[#D5E0D8] last:border-r-0">
                    <div className="relative">
                      <div className="aspect-16/10 rounded-xl overflow-hidden mb-2 bg-stone-900 shadow-xs group">
                        <HotelVisual hotel={h} className="w-full h-full" />
                      </div>
                      <button
                        onClick={() => onRemoveHotel(h.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="移除此項"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <h4 className="font-serif-tc font-bold text-[#14241C] text-base leading-snug">{h.name}</h4>
                      <div className="text-xs text-[#55685E]">{h.enName}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#D5E0D8]">
              {dimensions.map((dim) => (
                <tr key={dim.key} className="hover:bg-emerald-50/20 transition-colors">
                  {/* Sticky left dimension name */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-emerald-50/20 p-4 font-serif-tc font-bold text-xs text-[#1F4A38] border-r border-[#D5E0D8] align-top shadow-xs">
                    <div>{dim.label}</div>
                    <div className="text-[11px] text-[#55685E] font-normal font-sans-tc mt-0.5">{dim.sub}</div>
                  </td>

                  {/* Columns for each hotel */}
                  {hotels.map((h) => (
                    <td key={h.id} className="p-4 align-top border-r border-[#D5E0D8] last:border-r-0">
                      {dim.render(h)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#D5E0D8] bg-[#F7FAF8] flex items-center justify-between">
          <span className="text-xs text-[#55685E]">
            * 價格與專案以預訂平台即時顯示為準；日歸券建議提前確認預約。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#14241C] hover:bg-black text-white transition-colors cursor-pointer"
          >
            關閉對比表
          </button>
        </div>
      </div>
    </div>
  );
};
