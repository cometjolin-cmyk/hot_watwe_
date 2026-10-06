import React, { useState } from 'react';
import { PersonaFilter } from './HeroSection';
import { ArrowRight, Map, Compass, Sparkles, Droplets, Waves, Eye } from 'lucide-react';

interface HomeGuideHeroProps {
  activePersona: PersonaFilter;
  onSelectPersona: (persona: PersonaFilter) => void;
  onGoToMap: () => void;
  onGoToAll: () => void;
  onOpenCompare: () => void;
  onOpenGuide: () => void;
  onScrollToFeatured: () => void;
}

// 3 Curated onsen photography views for seamless exploration
const HERO_SCENES = [
  {
    id: 'stone-tub',
    title: '靜謐石池 ‧ 山嵐竹影',
    sub: '天然碳酸氫鈉泉 ‧ 水溫 58°C 美人湯',
    tag: '露天自然石池',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'sky-pool',
    title: '高空無邊際 ‧ 溫泉景觀泳池',
    sub: '俯瞰蘭陽平原與龜山島曙光',
    tag: '無邊際景觀水療',
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'granite-bath',
    title: '客房獨立私湯 ‧ 極致隱私',
    sub: '深黑花崗岩溫泉池 ‧ 原木暖色微光',
    tag: '客房私湯規格',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  },
];

export const HomeGuideHero: React.FC<HomeGuideHeroProps> = ({
  activePersona,
  onSelectPersona,
  onGoToMap,
  onGoToAll,
  onOpenCompare,
  onOpenGuide,
  onScrollToFeatured,
}) => {
  // Active photo scene
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  // Mouse tilt & interactive spotlight states
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });

    // Smooth subtle 3D tilt (range: -8deg to +8deg)
    setTilt({
      rotateX: (0.5 - y) * 12,
      rotateY: (x - 0.5) * 12,
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const currentScene = HERO_SCENES[activeSceneIdx];

  const steps = [
    {
      num: '01',
      title: '選擇度假情境',
      subtitle: '情侶 ‧ 親子 ‧ 無車漫遊',
      action: '選情境',
      onClick: () => {
        onSelectPersona('couple');
        onScrollToFeatured();
      },
    },
    {
      num: '02',
      title: '精選飯店評鑑',
      subtitle: '嚴選 3 大代表飯店規格',
      action: '看推薦',
      onClick: onScrollToFeatured,
    },
    {
      num: '03',
      title: 'Google 分屏地圖',
      subtitle: '實景定位 ‧ 步程導航',
      action: '開啟地圖',
      onClick: onGoToMap,
    },
    {
      num: '04',
      title: '8 維度橫向對比',
      subtitle: '私湯材質 ‧ 價格直達預訂',
      action: '展開對比',
      onClick: onOpenCompare,
    },
  ];

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* 1. Main Hero: Clean Split Layout with Seamless Interactive Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
        {/* Left Column: Minimal Typography & Intentional Whitespace */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Subtle Calligraphic Kicker */}
          <div className="inline-flex items-center gap-2 text-xs text-[#2D6A50] font-medium tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2D6A50] animate-pulse" />
            <span>JIAOXI ONSEN CURATION ‧ 礁溪水墨溫泉評鑑</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif-tc text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#112019] leading-[1.15]">
            尋訪美人湯的
            <span className="text-[#1F4A38] block mt-1">極致溫度與私湯哲學</span>
          </h1>

          {/* Subtitle / Intro */}
          <p className="text-sm sm:text-base text-[#41574C] leading-relaxed max-w-xl">
            實地評鑑礁溪 10 大頂級溫泉旅宿：客房岩板私湯、露天檜木裸湯、車站步程與即時房價。精簡指引，依序展開專屬您的宜蘭療癒假期。
          </p>

          {/* Persona Style Selector (Buttons with clear states) */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-[#41574C] mb-2.5 flex items-center gap-1.5 font-serif-tc">
              <span>步驟 01 ｜ 依旅伴情境快速篩選：</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'all', label: '全部評鑑 (10間)' },
                { key: 'couple', label: '👩‍❤️‍👨 情侶輕奢 (私湯/裸湯)' },
                { key: 'family', label: '👨‍👩‍👧‍👦 親子歡樂 (水療/滑梯)' },
                { key: 'transit', label: '🎒 無車漫遊 (≤5分步程)' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onSelectPersona(item.key as PersonaFilter);
                    onScrollToFeatured();
                  }}
                  className={`px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                    activePersona === item.key
                      ? 'bg-[#1F4A38] text-white shadow-xs font-semibold scale-[1.02]'
                      : 'bg-white text-[#112019] hover:bg-[#EAF1EC] border border-[#D2DED5]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToFeatured}
              className="px-5 py-3 rounded-xl bg-[#1F4A38] hover:bg-[#16382A] text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>瀏覽精選飯店 (步驟 02)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToMap}
              className="px-5 py-3 rounded-xl bg-white hover:bg-[#F2F5F2] text-[#112019] border border-[#D2DED5] text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Map className="w-4 h-4 text-[#2D6A50]" />
              <span>進入 Google 分屏地圖 (步驟 03)</span>
            </button>
          </div>
        </div>

        {/* Right Column: Seamless Cover Photo with 3D Mouse Parallax & Soft Ink-Wash Blending */}
        <div className="lg:col-span-5 relative select-none">
          {/* Subtle Ambient Background Glow behind the card */}
          <div
            className="absolute -inset-4 rounded-3xl bg-radial from-[#2D6A50]/20 via-[#1F4A38]/5 to-transparent blur-xl pointer-events-none transition-opacity duration-500"
            style={{ opacity: isHovered ? 1 : 0.6 }}
          />

          {/* 3D Tilt Interactive Image Card */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
                isHovered ? 1.02 : 1
              }, ${isHovered ? 1.02 : 1}, 1)`,
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-5/4 shadow-2xl border border-[#D2DED5]/90 bg-[#0E1A14] group cursor-crosshair"
          >
            {/* Real High-Resolution Photograph */}
            <img
              src={currentScene.url}
              alt={currentScene.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Seamless Aesthetic Edge Vignette & Rice-Paper Blend */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#112019]/95 via-[#112019]/30 to-transparent" />
            <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-3xl shadow-inner" />

            {/* Interactive Mouse-following Specular Water-light Sheen */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                opacity: isHovered ? 0.35 : 0,
                background: `radial-gradient(500px circle at ${mousePos.x * 100}% ${
                  mousePos.y * 100
                }%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 75%)`,
              }}
            />

            {/* Top Interactive Indicator Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/20 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
                <span>{currentScene.tag}</span>
              </span>
              {isHovered && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1F4A38]/80 backdrop-blur-md text-white text-[10px] animate-in fade-in">
                  <span>♨ 3D 光影連動中</span>
                </span>
              )}
            </div>

            {/* Bottom In-Photo Content with Parallax Depth */}
            <div
              className="absolute bottom-4 left-4 right-4 text-white z-20 transition-transform duration-200"
              style={{
                transform: `translate(${(mousePos.x - 0.5) * 10}px, ${(mousePos.y - 0.5) * 8}px)`,
              }}
            >
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
                <span>♨ 天然碳酸氫鈉泉</span>
                <span>·</span>
                <span>水溫 58°C 美人湯</span>
              </div>
              <h3 className="font-serif-tc font-bold text-lg sm:text-xl text-stone-100 drop-shadow-md">
                {currentScene.title}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5 drop-shadow-sm">
                {currentScene.sub}
              </p>
            </div>
          </div>

          {/* Micro Scene Switcher Tabs (3 Authentic Onsen Perspectives) */}
          <div className="mt-3.5 flex items-center justify-between gap-1.5 bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-[#D2DED5] shadow-xs">
            <span className="text-[11px] font-semibold text-[#41574C] pl-2 flex items-center gap-1 font-serif-tc shrink-0">
              <Eye className="w-3.5 h-3.5 text-[#2D6A50]" />
              <span>實景視角：</span>
            </span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {HERO_SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveSceneIdx(idx)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeSceneIdx === idx
                      ? 'bg-[#1F4A38] text-white shadow-xs font-semibold'
                      : 'text-[#41574C] hover:text-[#112019] hover:bg-[#EAF1EC]'
                  }`}
                >
                  {sc.tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Architecture Guided Steps (清晰好懂的架構步驟卡片) */}
      <div className="bg-white rounded-2xl border border-[#D2DED5] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EAF1EC]">
          <div>
            <h3 className="font-serif-tc font-bold text-base text-[#112019] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#2D6A50]" />
              <span>網站架構導引：4 步快速完成最佳預訂</span>
            </h3>
            <p className="text-xs text-[#41574C] mt-0.5">
              依照以下指引，從風格篩選、實景評鑑、地圖步行導航至橫向比較，流暢進行下一步
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={st.onClick}
              className="group p-4 rounded-xl bg-[#F5F8F6] hover:bg-[#EAF1EC] border border-[#D2DED5] hover:border-[#2D6A50] transition-all cursor-pointer flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#2D6A50]">
                    STEP {st.num}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1F4A38] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    {st.action} ➜
                  </span>
                </div>
                <h4 className="font-serif-tc font-bold text-sm text-[#112019] mb-1">
                  {st.title}
                </h4>
                <p className="text-xs text-[#41574C]">
                  {st.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
