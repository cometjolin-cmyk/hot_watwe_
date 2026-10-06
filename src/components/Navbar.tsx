import React, { useState } from 'react';
import { Heart, Globe, ChevronDown, Check, Map } from 'lucide-react';

interface NavbarProps {
  currentTab: 'featured' | 'split' | 'all' | 'guide';
  onSelectTab: (tab: 'featured' | 'split' | 'all' | 'guide') => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  onOpenFavorites,
  currency,
  onChangeCurrency,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const currencies = [
    { code: 'TWD', label: '繁中 ‧ TWD (新台幣)', symbol: 'NT$' },
    { code: 'HKD', label: '繁中 ‧ HKD (港幣)', symbol: 'HK$' },
    { code: 'JPY', label: '日本語 ‧ JPY (日圓)', symbol: '¥' },
    { code: 'USD', label: 'English ‧ USD (美元)', symbol: '$' },
  ];

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#F2F6F3]/95 backdrop-blur-md border-b border-[#D5E0D8] px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: Logo & Title (Ink calligraphy style) */}
        <button
          onClick={() => onSelectTab('featured')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4A38] rounded-lg py-1"
        >
          <span className="w-8 h-8 rounded-lg bg-[#1F4A38] text-emerald-100 flex items-center justify-center text-sm font-bold shadow-xs transition-transform group-hover:scale-105 duration-200">
            ♨
          </span>
          <div className="flex flex-col">
            <span className="font-serif-tc font-bold text-base sm:text-lg tracking-tight text-[#14241C] group-hover:text-[#1F4A38] transition-colors whitespace-nowrap">
              礁溪 10 大溫泉評鑑
            </span>
          </div>
        </button>

        {/* Center: Navigation Menu */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('featured')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              currentTab === 'featured'
                ? 'bg-[#1F4A38]/12 text-[#1F4A38] font-bold'
                : 'text-[#55685E] hover:text-[#14241C] hover:bg-black/5'
            }`}
          >
            精選推薦
          </button>
          <span className="text-[#D5E0D8] text-xs">|</span>
          <button
            onClick={() => onSelectTab('split')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'split'
                ? 'bg-[#1F4A38] text-white font-bold shadow-xs'
                : 'text-[#55685E] hover:text-[#14241C] hover:bg-black/5'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Google 嵌入地圖</span>
          </button>
          <span className="text-[#D5E0D8] text-xs">|</span>
          <button
            onClick={() => onSelectTab('all')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              currentTab === 'all'
                ? 'bg-[#1F4A38]/12 text-[#1F4A38] font-bold'
                : 'text-[#55685E] hover:text-[#14241C] hover:bg-black/5'
            }`}
          >
            全評鑑名單
          </button>
          <span className="text-[#D5E0D8] text-xs">|</span>
          <button
            onClick={() => onSelectTab('guide')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-[#1F4A38]/12 text-[#1F4A38] font-bold'
                : 'text-[#55685E] hover:text-[#14241C] hover:bg-black/5'
            }`}
          >
            美人湯百科 & 交通
          </button>
        </nav>

        {/* Right: Favorites & Currency */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#55685E] hover:text-[#1F4A38] hover:bg-[#E8EFEA] border border-transparent hover:border-[#D5E0D8] transition-all cursor-pointer"
            title="查看我的收藏清單"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favoritesCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-[#55685E]'
              }`}
            />
            <span className="hidden sm:inline text-xs font-medium">收藏清單</span>
            {favoritesCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 text-[11px] font-bold text-white bg-[#1F4A38] rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Currency / Language Selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#55685E] hover:text-[#14241C] bg-white hover:bg-stone-50 border border-[#D5E0D8] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#55685E]" />
              <span className="whitespace-nowrap font-medium">繁中 ‧ {currency}</span>
              <ChevronDown className="w-3 h-3 text-[#55685E]" />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-[#D5E0D8] py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-[#55685E] tracking-wide border-b border-[#D5E0D8] mb-1">
                    切換幣別與語系
                  </div>
                  {currencies.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        onChangeCurrency(item.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-[#E8EFEA] transition-colors cursor-pointer"
                    >
                      <span className={currency === item.code ? 'font-bold text-[#1F4A38]' : 'text-[#14241C]'}>
                        {item.label}
                      </span>
                      {currency === item.code && <Check className="w-3.5 h-3.5 text-[#1F4A38]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
