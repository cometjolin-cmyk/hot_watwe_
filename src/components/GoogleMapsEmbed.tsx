import React, { useState } from 'react';
import { Hotel } from '../data/hotels';
import { MapPin, Navigation, Compass, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface GoogleMapsEmbedProps {
  hotel: Hotel;
  className?: string;
}

export const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({ hotel, className = '' }) => {
  const [embedMode, setEmbedMode] = useState<'place' | 'directions' | 'streetview'>('place');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // API Key from Vite env or provisioned key
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyD5hsEXV0H-N3rCn5xNmSXLN1bBFcVbyCY';

  // Construct official Google Maps Embed URL without unsupported query parameters
  const getEmbedUrl = () => {
    const encodedName = encodeURIComponent(`${hotel.name} 礁溪`);
    const encodedStation = encodeURIComponent('礁溪火車站');

    switch (embedMode) {
      case 'directions':
        return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodedStation}&destination=${hotel.lat},${hotel.lng}&mode=walking`;
      case 'streetview':
        return `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${hotel.lat},${hotel.lng}&heading=110&pitch=0&fov=80`;
      case 'place':
      default:
        return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedName}&center=${hotel.lat},${hotel.lng}&zoom=16`;
    }
  };

  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} 礁溪`)}`;

  return (
    <div className={`relative w-full h-full flex flex-col bg-[#112019] overflow-hidden ${className}`}>
      {/* Top Ink-Wash Bar with Controls & Hotel Name */}
      <div className="z-10 bg-[#112019]/95 text-stone-200 border-b border-[#1F4A38] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 backdrop-blur-md">
        {/* Left: Active Hotel Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#2D6A50] text-emerald-200 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
            ♨
          </div>
          <div className="min-w-0">
            <h4 className="font-serif-tc font-bold text-xs sm:text-sm text-stone-100 truncate flex items-center gap-1.5">
              <span>{hotel.name}</span>
              <span className="text-[11px] font-normal text-emerald-300 bg-[#19382B] px-2 py-0.5 rounded border border-[#2D6A50]/60 hidden sm:inline">
                {hotel.transitBadge}
              </span>
            </h4>
          </div>
        </div>

        {/* Right: Embedded Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#0A1610] p-1 rounded-xl border border-[#1F4A38]">
          <button
            onClick={() => {
              setEmbedMode('place');
              setIsLoading(true);
              setHasError(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              embedMode === 'place'
                ? 'bg-[#2D6A50] text-white shadow-xs font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>地點定位</span>
          </button>

          <button
            onClick={() => {
              setEmbedMode('directions');
              setIsLoading(true);
              setHasError(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              embedMode === 'directions'
                ? 'bg-[#2D6A50] text-white shadow-xs font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>步行路線</span>
          </button>

          <button
            onClick={() => {
              setEmbedMode('streetview');
              setIsLoading(true);
              setHasError(false);
            }}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              embedMode === 'streetview'
                ? 'bg-[#2D6A50] text-white shadow-xs font-semibold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>360° 街景</span>
          </button>

          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-lg text-stone-400 hover:text-emerald-300 transition-colors ml-1"
            title="在 Google 地圖中開啟"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Google Map iframe Container */}
      <div className="relative flex-1 w-full h-full min-h-[420px] bg-[#0A1610]">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#112019]/90 text-stone-300 gap-2">
            <RefreshCw className="w-6 h-6 text-[#2D6A50] animate-spin" />
            <span className="text-xs font-serif-tc text-emerald-200">正在加載 Google 嵌入地圖...</span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-[#112019] text-stone-300">
            <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
            <h4 className="font-serif-tc font-bold text-sm text-stone-100 mb-1">
              地圖載入受限
            </h4>
            <p className="text-xs text-stone-400 mb-4 max-w-sm">
              瀏覽器環境可能阻擋外部 iframe。您可以點擊下方按鈕直接在 Google 地圖中查看此飯店。
            </p>
            <a
              href={externalMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#2D6A50] text-white text-xs font-semibold hover:bg-[#1B4332] transition-colors flex items-center gap-1.5"
            >
              <span>在 Google 地圖開啟 {hotel.name}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <iframe
            key={`${hotel.id}-${embedMode}`}
            title={`Google Map - ${hotel.name}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={getEmbedUrl()}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="w-full h-full"
          />
        )}

        {/* Ink Wash Vignette Overlay Frame */}
        <div className="absolute inset-0 pointer-events-none border-2 border-[#1A3329]/60 shadow-inner" />
      </div>

      {/* Bottom Status & Transit Info */}
      <div className="bg-[#112019] border-t border-[#1F4A38] px-4 py-2 flex items-center justify-between text-xs text-stone-400">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#C59B3F] font-bold">● Google 地圖官方嵌入</span>
          <span className="text-stone-600">|</span>
          <span className="truncate">
            {embedMode === 'directions'
              ? `起點：礁溪火車站 ➔ 終點：${hotel.name}（${hotel.transitBadge}）`
              : embedMode === 'streetview'
              ? `360° 環景實景街景（座標：${hotel.lat}, ${hotel.lng}）`
              : `地標定位：${hotel.name} ‧ ${hotel.specBadge}`}
          </span>
        </div>

        <span className="text-[11px] text-emerald-400/80 hidden md:inline shrink-0">
          Powered by Google Maps Platform
        </span>
      </div>
    </div>
  );
};
