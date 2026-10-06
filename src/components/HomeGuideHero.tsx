import React from 'react';
import { PersonaFilter } from './HeroSection';
import { ArrowRight, Map, Grid, Layers, BookOpen, Compass, Sparkles, Check } from 'lucide-react';

interface HomeGuideHeroProps {
  activePersona: PersonaFilter;
  onSelectPersona: (persona: PersonaFilter) => void;
  onGoToMap: () => void;
  onGoToAll: () => void;
  onOpenCompare: () => void;
  onOpenGuide: () => void;
  onScrollToFeatured: () => void;
}

export const HomeGuideHero: React.FC<HomeGuideHeroProps> = ({
  activePersona,
  onSelectPersona,
  onGoToMap,
  onGoToAll,
  onOpenCompare,
  onOpenGuide,
  onScrollToFeatured,
}) => {
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
      {/* 1. Main Hero: Clean Split Layout with Serene Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
        {/* Left Column: Minimal Typography & Intentional Whitespace */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {/* Subtle Calligraphic Kicker */}
          <div className="inline-flex items-center gap-2 text-xs text-[#2D6A50] font-medium tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2D6A50]" />
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

        {/* Right Column: Serene Atmospheric Hot Spring Visual */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-5/4 shadow-xl border border-[#D2DED5] bg-stone-900 group">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
              alt="礁溪頂級溫泉私湯實景"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#112019]/90 via-[#112019]/30 to-transparent" />

            {/* In-Photo Badge Overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
                <span>♨ 天然碳酸氫鈉泉</span>
                <span>·</span>
                <span>水溫 58°C 美人湯</span>
              </div>
              <h3 className="font-serif-tc font-bold text-lg sm:text-xl text-stone-100">
                靜謐石池 ‧ 山嵐竹影
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                全館客房獨立私湯、男女裸湯與無邊際景觀水療
              </p>
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
          {steps.map((st, i) => (
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
