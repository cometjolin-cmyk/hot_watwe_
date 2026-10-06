import React from 'react';
import { ArrowRight, Users, Bath, Scale } from 'lucide-react';

interface StepWalkthroughProps {
  onStepClick?: (stepIndex: number) => void;
}

export const StepWalkthrough: React.FC<StepWalkthroughProps> = ({ onStepClick }) => {
  const steps = [
    {
      num: '①',
      title: '選旅伴情境',
      desc: '點選上方情境標籤，一鍵過濾專屬名單。',
      icon: Users,
    },
    {
      num: '②',
      title: '看私湯與步程',
      desc: '多圖切換看私湯規格，精準掌握車站距離。',
      icon: Bath,
    },
    {
      num: '③',
      title: '勾選比較預訂',
      desc: '勾選多間加入 8 維度橫向對比，直達 OTA 完成預訂。',
      icon: Scale,
    },
  ];

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="mb-5">
        <h3 className="font-serif-tc text-[20px] font-bold text-[#14241C] tracking-tight flex items-center gap-2">
          <span>🧭</span>
          <span>快速找湯 3 步驟</span>
        </h3>
      </div>

      {/* 3-Step Walkthrough Banner (Celadon rice-paper background, ink-pine border) */}
      <div className="bg-[#EBF1EC] border border-[#BFD3C5] rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div
                key={idx}
                onClick={() => onStepClick?.(idx + 1)}
                className={`relative flex items-start gap-3.5 p-3 sm:p-4 rounded-xl hover:bg-white/80 transition-all cursor-pointer group ${
                  !isLast ? 'md:pr-8' : ''
                }`}
              >
                {/* Step badge icon */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1F4A38]/15 text-[#1F4A38] border border-[#1F4A38]/25 flex items-center justify-center group-hover:bg-[#1F4A38] group-hover:text-white transition-colors duration-200 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-bold text-[#1F4A38] text-sm">步驟 {step.num}</span>
                    <h4 className="font-serif-tc font-bold text-[#14241C] text-sm sm:text-base tracking-tight">
                      【{step.title}】
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#55685E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Connecting arrow for desktop between steps */}
                {!isLast && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border border-[#BFD3C5] text-[#1F4A38] items-center justify-center shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
