import React from 'react';
import { Map, Grid, Layers, BookOpen, ArrowRight } from 'lucide-react';

interface NextStepArchitectureHubProps {
  onGoToMap: () => void;
  onGoToAll: () => void;
  onOpenCompare: () => void;
  onOpenGuide: () => void;
}

export const NextStepArchitectureHub: React.FC<NextStepArchitectureHubProps> = ({
  onGoToMap,
  onGoToAll,
  onOpenCompare,
  onOpenGuide,
}) => {
  const nextSteps = [
    {
      title: 'Google 分屏互動地圖',
      tag: '步驟 03 ｜ 地理空間導引',
      desc: '45% 飯店列表搭配 55% 固定視窗，支援官方嵌入地點定位、火車站步行導航與 360° 街景。',
      ctaText: '開啟分屏地圖',
      icon: Map,
      onClick: onGoToMap,
      accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: '10 間溫泉飯店全覽清單',
      tag: '步驟 02 ｜ 完整評鑑名單',
      desc: '完整查看礁溪 10 間嚴選旅宿（寒沐、老爺、晶泉、山形閣等），支援價格滑桿與設施過濾。',
      ctaText: '查看完整名單',
      icon: Grid,
      onClick: onGoToAll,
      accent: 'text-stone-800 bg-stone-50 border-stone-200',
    },
    {
      title: '8 維度橫向對比矩陣',
      tag: '步驟 04 ｜ 深度規格決策',
      desc: '橫向對比表頭固定，一目瞭然房內私湯材質、大眾男女裸湯、兒童滑梯、餐飲與即時預訂。',
      ctaText: '展開對比矩陣',
      icon: Layers,
      onClick: onOpenCompare,
      accent: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      title: '美人湯百科與交通指引',
      tag: '知識庫 ｜ 交通指南',
      desc: '碳酸氫鈉泉 58°C 水質解析、泡湯注意事項，以及台北客運與台鐵無車漫遊乘車指南。',
      ctaText: '查閱交通百科',
      icon: BookOpen,
      onClick: onOpenGuide,
      accent: 'text-teal-800 bg-teal-50 border-teal-200',
    },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[#D2DED5]/80 my-4">
      {/* Section Header */}
      <div className="mb-6 text-left">
        <span className="text-xs font-semibold text-[#2D6A50] tracking-wider uppercase">
          NEXT STEPS IN ARCHITECTURE
        </span>
        <h3 className="font-serif-tc text-xl sm:text-2xl font-bold text-[#112019] mt-0.5">
          依照網站架構進行下一步探索
        </h3>
        <p className="text-xs sm:text-sm text-[#41574C] mt-1">
          點選以下架構模組，深入地圖實景、全評鑑目錄或展開多維度對照
        </p>
      </div>

      {/* Grid of Next Step Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {nextSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              onClick={step.onClick}
              className="bg-white rounded-2xl border border-[#D2DED5] p-5 shadow-xs hover:shadow-md hover:border-[#1F4A38] transition-all cursor-pointer flex flex-col justify-between group text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF1EC] text-[#1F4A38] flex items-center justify-center group-hover:bg-[#1F4A38] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-[#41574C] bg-[#F5F8F6] px-2 py-0.5 rounded-md border border-[#D2DED5]">
                    {step.tag}
                  </span>
                </div>

                <h4 className="font-serif-tc font-bold text-base text-[#112019] mb-1.5 group-hover:text-[#1F4A38] transition-colors">
                  {step.title}
                </h4>
                <p className="text-xs text-[#41574C] leading-relaxed mb-4">
                  {step.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EAF1EC] flex items-center justify-between text-xs font-semibold text-[#1F4A38]">
                <span>{step.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
