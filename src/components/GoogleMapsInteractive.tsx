import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Hotel } from '../data/hotels';
import { ExternalLink, Star, MapPin, Navigation, Compass, Layers, RotateCcw } from 'lucide-react';

interface GoogleMapsInteractiveProps {
  hotels: Hotel[];
  activeHotelId: string | null;
  hoveredHotelId: string | null;
  onSelectHotel: (hotelId: string) => void;
  onHoverHotel: (hotelId: string | null) => void;
  onBookHotel: (hotel: Hotel) => void;
  onOpenDetail: (hotel: Hotel) => void;
}

// Jiaoxi landmarks coordinates
export const JIAOXI_STATION_COORD = { lat: 24.8285, lng: 121.7719 };
export const JIAOXI_BUS_STATION_COORD = { lat: 24.8315, lng: 121.7745 };
export const TANGWEIGOU_PARK_COORD = { lat: 24.8277, lng: 121.7686 };

// Camera pan controller hook component
const MapCameraHandler: React.FC<{
  targetCoord: { lat: number; lng: number } | null;
}> = ({ targetCoord }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoord) {
      map.panTo(targetCoord);
    }
  }, [map, targetCoord]);

  return null;
};

export const GoogleMapsInteractive: React.FC<GoogleMapsInteractiveProps> = ({
  hotels,
  activeHotelId,
  hoveredHotelId,
  onSelectHotel,
  onHoverHotel,
  onBookHotel,
  onOpenDetail,
}) => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyD5hsEXV0H-N3rCn5xNmSXLN1bBFcVbyCY';

  const [selectedHotelForInfo, setSelectedHotelForInfo] = useState<Hotel | null>(null);

  // Active target coordinates for smooth camera panning
  const targetHotel = hotels.find((h) => h.id === (hoveredHotelId || activeHotelId));
  const targetCoord = targetHotel ? { lat: targetHotel.lat, lng: targetHotel.lng } : null;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#112019] overflow-hidden">
      {/* Top Ink Wash Control Bar */}
      <div className="z-10 bg-[#112019]/95 text-stone-200 border-b border-[#1F4A38] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#24503E] text-emerald-200 flex items-center justify-center text-xs font-bold shadow-xs">
            ♨
          </div>
          <span className="font-serif-tc font-bold text-xs sm:text-sm text-stone-100">
            Google Maps 原生互動圖層
          </span>
          <span className="text-[11px] text-emerald-300 bg-[#19382B] px-2 py-0.5 rounded-full border border-[#2D6A50]">
            Airbnb 價格藥丸 ‧ 點擊展開
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setSelectedHotelForInfo(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#19382B] hover:bg-[#24503E] text-stone-200 transition-colors cursor-pointer border border-[#1F4A38] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>關閉彈窗</span>
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 w-full h-full min-h-[420px] bg-[#0A1610]">
        <APIProvider apiKey={apiKey}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: 24.8300, lng: 121.7700 }}
            defaultZoom={15}
            style={{ width: '100%', height: '100%' }}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            {/* Smooth camera pan handler */}
            <MapCameraHandler targetCoord={targetCoord} />

            {/* Fixed Landmark: 礁溪火車站 */}
            <AdvancedMarker position={JIAOXI_STATION_COORD} title="礁溪火車站">
              <div className="flex items-center gap-1.5 bg-[#0F1D16] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border border-white/60">
                <span>🚆</span>
                <span>礁溪火車站</span>
              </div>
            </AdvancedMarker>

            {/* Fixed Landmark: 礁溪轉運站 */}
            <AdvancedMarker position={JIAOXI_BUS_STATION_COORD} title="礁溪轉運站">
              <div className="flex items-center gap-1.5 bg-[#1B4332] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border border-white/60">
                <span>🚌</span>
                <span>礁溪轉運站</span>
              </div>
            </AdvancedMarker>

            {/* Fixed Landmark: 湯圍溝溫泉公園 */}
            <AdvancedMarker position={TANGWEIGOU_PARK_COORD} title="湯圍溝溫泉公園">
              <div className="flex items-center gap-1.5 bg-[#8C3A27] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md border border-white/60">
                <span>♨️</span>
                <span>湯圍溝公園</span>
              </div>
            </AdvancedMarker>

            {/* Hotel Price Pill Markers */}
            {hotels.map((hotel) => {
              const isHovered = hoveredHotelId === hotel.id;
              const isActive = activeHotelId === hotel.id;

              return (
                <AdvancedMarker
                  key={hotel.id}
                  position={{ lat: hotel.lat, lng: hotel.lng }}
                  title={hotel.name}
                  onClick={() => {
                    onSelectHotel(hotel.id);
                    setSelectedHotelForInfo(hotel);
                  }}
                >
                  <div
                    onMouseEnter={() => onHoverHotel(hotel.id)}
                    onMouseLeave={() => onHoverHotel(null)}
                    className={`cursor-pointer transition-all duration-200 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md select-none ${
                      isActive || isHovered
                        ? 'bg-[#0F1D16] text-emerald-300 ring-2 ring-[#52B788] scale-110 z-50 shadow-xl'
                        : 'bg-white text-[#112019] hover:bg-[#F2F5F2] hover:scale-105 border border-[#D2DED5]'
                    }`}
                  >
                    <span className="text-[#2D6A50] text-[11px]">♨</span>
                    <span className="font-num">NT$ {hotel.priceNight.toLocaleString()}</span>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Clicked Hotel */}
            {selectedHotelForInfo && (
              <InfoWindow
                position={{ lat: selectedHotelForInfo.lat, lng: selectedHotelForInfo.lng }}
                onCloseClick={() => setSelectedHotelForInfo(null)}
              >
                <div className="p-1 max-w-[240px] text-[#112019]">
                  <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
                    <img
                      src={selectedHotelForInfo.imageUrl}
                      alt={selectedHotelForInfo.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-black/70 text-amber-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                      <span>{selectedHotelForInfo.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-serif-tc font-bold text-sm text-[#112019] mb-0.5">
                    {selectedHotelForInfo.name}
                  </h4>
                  <p className="text-[11px] text-[#41574C] mb-2">
                    {selectedHotelForInfo.transitBadge} ‧ {selectedHotelForInfo.specBadge}
                  </p>

                  <div className="flex items-center justify-between border-t border-stone-200 pt-2 mt-1">
                    <div>
                      <span className="text-[10px] text-stone-500 block">每晚起</span>
                      <span className="font-bold text-sm text-[#1B4332] font-num">
                        NT$ {selectedHotelForInfo.priceNight.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenDetail(selectedHotelForInfo)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-[#EAF1EC] text-[#1B4332] hover:bg-[#D5E2D8] cursor-pointer"
                      >
                        詳情
                      </button>
                      <button
                        onClick={() => onBookHotel(selectedHotelForInfo)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-[#1B4332] text-white hover:bg-[#112019] cursor-pointer"
                      >
                        預訂 ➜
                      </button>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Bottom Status bar */}
      <div className="bg-[#112019] border-t border-[#1F4A38] px-4 py-1.5 flex items-center justify-between text-xs text-stone-400">
        <span className="truncate">
          點擊地圖圖釘可檢視房型與價格，並自動與左側列表連動
        </span>
        <span className="text-[11px] text-emerald-400/80 shrink-0 hidden sm:inline">
          Powered by Google Maps Platform
        </span>
      </div>
    </div>
  );
};
