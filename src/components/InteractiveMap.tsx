import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Hotel } from '../data/hotels';
import { LocateFixed, ZoomIn, ZoomOut } from 'lucide-react';

interface InteractiveMapProps {
  hotels: Hotel[];
  activeHotelId: string | null;
  hoveredHotelId: string | null;
  onSelectHotel: (hotelId: string) => void;
  onHoverHotel: (hotelId: string | null) => void;
  onBookHotel: (hotel: Hotel) => void;
  onOpenDetail: (hotel: Hotel) => void;
}

// Jiaoxi Station coordinate (Hub for walking dashed polyline)
export const JIAOXI_STATION_COORD: [number, number] = [24.8285, 121.7719];
export const JIAOXI_BUS_STATION_COORD: [number, number] = [24.8315, 121.7745];
export const TANGWEIGOU_PARK_COORD: [number, number] = [24.8277, 121.7686];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  hotels,
  activeHotelId,
  hoveredHotelId,
  onSelectHotel,
  onHoverHotel,
  onBookHotel,
  onOpenDetail,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const polylineDecorRef = useRef<L.Marker | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Jiaoxi town center
    const map = L.map(mapContainerRef.current, {
      center: [24.8300, 121.7700],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Warm, elegant CartoDB Voyager tiles (fits Japanese onsen aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // 1. Fixed Landmark Markers: 礁溪火車站, 礁溪轉運站, 湯圍溝溫泉公園
    const trainIcon = L.divIcon({
      className: 'custom-transit-marker',
      html: `
        <div style="display:flex;align-items:center;gap:4px;background:#1E293B;color:#fff;padding:4px 8px;border-radius:9999px;font-size:11px;font-weight:700;box-shadow:0 4px 6px -1px rgba(0,0,0,0.25);border:1.5px solid #fff;white-space:nowrap;">
          <span>🚆</span>
          <span>礁溪火車站</span>
        </div>
      `,
      iconSize: [100, 26],
      iconAnchor: [50, 13],
    });
    L.marker(JIAOXI_STATION_COORD, { icon: trainIcon, zIndexOffset: 200 }).addTo(map);

    const busIcon = L.divIcon({
      className: 'custom-transit-marker',
      html: `
        <div style="display:flex;align-items:center;gap:4px;background:#0F766E;color:#fff;padding:4px 8px;border-radius:9999px;font-size:11px;font-weight:700;box-shadow:0 4px 6px -1px rgba(0,0,0,0.25);border:1.5px solid #fff;white-space:nowrap;">
          <span>🚌</span>
          <span>礁溪轉運站</span>
        </div>
      `,
      iconSize: [100, 26],
      iconAnchor: [50, 13],
    });
    L.marker(JIAOXI_BUS_STATION_COORD, { icon: busIcon, zIndexOffset: 200 }).addTo(map);

    const parkIcon = L.divIcon({
      className: 'custom-transit-marker',
      html: `
        <div style="display:flex;align-items:center;gap:4px;background:#92400E;color:#fff;padding:4px 8px;border-radius:9999px;font-size:11px;font-weight:700;box-shadow:0 4px 6px -1px rgba(0,0,0,0.25);border:1.5px solid #fff;white-space:nowrap;">
          <span>♨️</span>
          <span>湯圍溝公園</span>
        </div>
      `,
      iconSize: [100, 26],
      iconAnchor: [50, 13],
    });
    L.marker(TANGWEIGOU_PARK_COORD, { icon: parkIcon, zIndexOffset: 150 }).addTo(map);

    mapInstanceRef.current = map;

    // Trigger invalidateSize after initial layout render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Hotel Price Pill Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    hotels.forEach((hotel) => {
      const isHovered = hoveredHotelId === hotel.id;
      const isActive = activeHotelId === hotel.id;

      // Airbnb Style Price Pill
      const pillBg = isActive || isHovered ? '#292524' : '#FFFFFF';
      const textColor = isActive || isHovered ? '#FFFFFF' : '#292524';
      const borderColor = isActive || isHovered ? '#C05621' : '#E7E5E4';
      const scale = isActive || isHovered ? 'scale(1.15)' : 'scale(1)';
      const zIndex = isActive || isHovered ? 999 : 50;
      const boxShadow = isActive || isHovered
        ? '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.2)'
        : '0 2px 4px rgba(0,0,0,0.1)';

      const pillHtml = `
        <div style="
          transform:${scale};
          transition:all 0.2s cubic-bezier(0.16,1,0.3,1);
          background:${pillBg};
          color:${textColor};
          border:1.5px solid ${borderColor};
          box-shadow:${boxShadow};
          padding:4px 9px;
          border-radius:9999px;
          font-family:'Plus Jakarta Sans',system-ui,sans-serif;
          font-weight:700;
          font-size:12px;
          display:flex;
          align-items:center;
          gap:4px;
          white-space:nowrap;
          cursor:pointer;
        ">
          <span style="color:#C05621;font-size:11px;">♨</span>
          <span>NT$ ${hotel.priceNight.toLocaleString()}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'airbnb-price-pill-wrapper',
        html: pillHtml,
        iconSize: [95, 30],
        iconAnchor: [47, 15],
      });

      const marker = L.marker([hotel.lat, hotel.lng], {
        icon: customIcon,
        zIndexOffset: zIndex,
      }).addTo(map);

      // Event listeners
      marker.on('click', () => {
        onSelectHotel(hotel.id);
        map.panTo([hotel.lat, hotel.lng], { animate: true, duration: 0.5 });
      });

      marker.on('mouseover', () => {
        onHoverHotel(hotel.id);
      });

      marker.on('mouseout', () => {
        onHoverHotel(null);
      });

      markersRef.current[hotel.id] = marker;
    });
  }, [hotels, activeHotelId, hoveredHotelId, onSelectHotel, onHoverHotel]);

  // Handle Pan-to and Dynamic Polyline (walking route from hotel to Jiaoxi station)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const targetHotelId = hoveredHotelId || activeHotelId;
    const targetHotel = hotels.find((h) => h.id === targetHotelId);

    // Remove existing polyline and decor
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }
    if (polylineDecorRef.current) {
      polylineDecorRef.current.remove();
      polylineDecorRef.current = null;
    }

    if (targetHotel) {
      // 1. Pan map to target coordinate smoothly
      map.panTo([targetHotel.lat, targetHotel.lng], { animate: true, duration: 0.4 });

      // 2. Draw dashed line from hotel to Jiaoxi station
      const startCoord: [number, number] = [targetHotel.lat, targetHotel.lng];
      const endCoord = JIAOXI_STATION_COORD;

      const polyline = L.polyline([startCoord, endCoord], {
        color: '#C05621',
        weight: 3,
        opacity: 0.9,
        dashArray: '6, 8',
      }).addTo(map);
      polylineRef.current = polyline;

      // 3. Midpoint Badge showing transit duration
      const midLat = (startCoord[0] + endCoord[0]) / 2;
      const midLng = (startCoord[1] + endCoord[1]) / 2;

      const badgeHtml = `
        <div style="
          background:#292524;
          color:#FFF;
          font-size:11px;
          font-weight:600;
          padding:3px 7px;
          border-radius:6px;
          border:1px solid #E7E5E4;
          box-shadow:0 4px 6px rgba(0,0,0,0.2);
          white-space:nowrap;
        ">
          ${targetHotel.transitBadge} 至礁溪火車站
        </div>
      `;

      const decorIcon = L.divIcon({
        className: 'transit-badge-decor',
        html: badgeHtml,
        iconSize: [130, 22],
        iconAnchor: [65, 11],
      });

      const decorMarker = L.marker([midLat, midLng], {
        icon: decorIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      polylineDecorRef.current = decorMarker;
    }
  }, [hoveredHotelId, activeHotelId, hotels]);

  // Map Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetCenter = () => {
    mapInstanceRef.current?.setView([24.8300, 121.7700], 15, { animate: true });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-stone-100 overflow-hidden">
      {/* Map DOM container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-white rounded-xl shadow-md border border-[#E7E5E4] overflow-hidden flex flex-col">
          <button
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-stone-50 text-[#292524] transition-colors border-b border-[#E7E5E4] cursor-pointer"
            title="放大地圖"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-stone-50 text-[#292524] transition-colors cursor-pointer"
            title="縮小地圖"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleResetCenter}
          className="p-2.5 bg-white hover:bg-stone-50 rounded-xl shadow-md border border-[#E7E5E4] text-[#292524] transition-colors cursor-pointer flex items-center justify-center"
          title="回中心點 (礁溪市區)"
        >
          <LocateFixed className="w-4 h-4 text-[#C05621]" />
        </button>
      </div>

      {/* Map Bottom Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-[#E7E5E4] text-[11px] text-[#78716C] flex items-center gap-3">
        <span className="flex items-center gap-1 font-medium text-[#292524]">
          <span className="w-2 h-2 rounded-full bg-[#C05621]" />
          Airbnb 價格藥丸
        </span>
        <span className="hidden sm:inline text-stone-300">|</span>
        <span className="hidden sm:flex items-center gap-1">
          <span className="w-4 border-b-2 border-dashed border-[#C05621]" />
          步程連動虛線
        </span>
      </div>
    </div>
  );
};
