import React from 'react';

export type PersonaFilter = 'all' | 'couple' | 'family' | 'transit';

interface HeroSectionProps {
  activePersona: PersonaFilter;
  onSelectPersona: (persona: PersonaFilter) => void;
  hotelCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activePersona,
  onSelectPersona,
  hotelCount,
}) => {
  const pills: { key: PersonaFilter; label: string }[] = [
    { key: 'all', label: `✨ 全部 ${hotelCount}` },
    { key: 'couple', label: '👩‍❤️‍👨 情侶輕奢 (私湯/裸湯)' },
    { key: 'family', label: '👨‍👩‍👧‍👦 親子歡樂 (水療/滑梯)' },
    { key: 'transit', label: '🎒 無車漫遊 (≤5分)' },
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-14 sm:pb-10 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Subtle decorative Ink Wash calligraphy badge */}
        <div className="inline-flex items-center gap-2 mb-3.5 px-3.5 py-1 rounded-full bg-[#1F4A38]/10 border border-[#1F4A38]/20 text-[#1F4A38] text-xs font-semibold tracking-wider">
          <span>松風竹影 ‧ 翠嵐湯煙</span>
          <span className="text-[#1F4A38]/40">•</span>
          <span>礁溪美人湯水墨評鑑</span>
        </div>

        {/* Main Title - Classical Chinese calligraphy feel */}
        <h1
          className="font-serif-tc text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#14241C] mb-3 leading-tight drop-shadow-xs"
          style={{ textWrap: 'balance' }}
        >
          尋訪美人湯的極致溫度
        </h1>

        {/* Subtitle */}
        <h2 className="font-serif-tc text-lg sm:text-xl md:text-2xl font-semibold text-[#2D6A50] mb-4 tracking-normal">
          礁溪 10 大頂級溫泉飯店嚴選評鑑
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#55685E] max-w-2xl mx-auto leading-relaxed mb-8">
          從高空無邊際溫泉池到純日式檜木裸湯，一鍵比價、篩選與直達預訂，為你客製最完美的宜蘭療癒假期。
        </p>

        {/* Persona Pills - Horizontal centered */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {pills.map((pill) => {
            const isSelected = activePersona === pill.key;
            return (
              <button
                key={pill.key}
                onClick={() => onSelectPersona(pill.key)}
                className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shadow-xs ${
                  isSelected
                    ? 'bg-[#1F4A38] text-white shadow-md shadow-[#1F4A38]/25 scale-[1.02] border border-[#1F4A38]'
                    : 'bg-white text-[#14241C] hover:text-[#1F4A38] hover:bg-[#E8EFEA] border border-[#D5E0D8]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
