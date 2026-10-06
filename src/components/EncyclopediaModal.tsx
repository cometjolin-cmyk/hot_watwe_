import React from 'react';
import { X, Droplets, Bus, Car, Train, Sparkles, Navigation } from 'lucide-react';

interface EncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E7E5E4] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#E7E5E4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">♨️</span>
            <div>
              <h3 className="font-bold text-lg text-[#292524]">礁溪美人湯百科 ＆ 交通指南</h3>
              <p className="text-xs text-[#78716C]">碳酸氫鈉泉水質特性與無車/自駕全攻略</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section 1: Onsen Encyclopedia */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-[#C05621]" />
              <h4 className="font-bold text-base text-[#292524]">
                礁溪碳酸氫鈉泉小百科（天然美人湯）
              </h4>
            </div>

            <div className="bg-[#FAF7F2] rounded-xl p-4 border border-[#F6D8A8] text-xs text-[#292524] leading-relaxed mb-4">
              <p className="mb-2">
                <strong>水質源頭特徵：</strong>
                礁溪溫泉源自中央山脈地熱雨水滲透，經深層循環受地熱加溫後湧出，出水水溫約在{' '}
                <span className="text-[#C05621] font-semibold">58°C ~ 62°C</span>，pH 值約{' '}
                <span className="text-[#C05621] font-semibold">7.2 ~ 7.9</span>
                ，屬於中性微鹼性碳酸氫鈉泉（Sodium Bicarbonate Spring）。
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E7E5E4]">
                <div className="text-sm font-bold text-[#78350F] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>清澈無硫磺味</span>
                </div>
                <p className="text-xs text-[#78716C] leading-normal">
                  透明無色無臭，泡完肌膚柔滑清爽無負擔，無一般硫磺泉的刺鼻氣味。
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E7E5E4]">
                <div className="text-sm font-bold text-[#78350F] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>天然水力美肌</span>
                </div>
                <p className="text-xs text-[#78716C] leading-normal">
                  富含鈉、鎂、鈣、鉀及碳酸氫根離子，溫和軟化角質，促進代謝保濕。
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E7E5E4]">
                <div className="text-sm font-bold text-[#78350F] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>催生溫泉蔬果</span>
                </div>
                <p className="text-xs text-[#78716C] leading-normal">
                  純淨豐富的礦物質泉水同時灌溉了著名的「礁溪溫泉空心菜」與「溫泉番茄」。
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Transit Guide */}
          <section className="pt-4 border-t border-[#E7E5E4]">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-5 h-5 text-[#C05621]" />
              <h4 className="font-bold text-base text-[#292524]">
                礁溪交通全攻略懶人包
              </h4>
            </div>

            <div className="space-y-3">
              {/* Public transit */}
              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E7E5E4]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#292524] mb-2">
                  <Bus className="w-4 h-4 text-[#C05621]" />
                  <span>台北出發大眾運輸（無車族首選）</span>
                </div>
                <ul className="text-xs text-[#78716C] space-y-1.5 pl-5 list-disc leading-relaxed">
                  <li>
                    <strong className="text-[#292524]">葛瑪蘭客運</strong>：台北轉運站 / 板橋直達礁溪轉運站（車程約 50-60 分鐘）。
                  </li>
                  <li>
                    <strong className="text-[#292524]">首都客運</strong>：台北市府轉運站直達礁溪轉運站（車程約 45-55 分鐘，班次極密集）。
                  </li>
                  <li>
                    <strong className="text-[#292524]">國光客運</strong>：圓山轉運站 / 南港展覽館直達礁溪轉運站。
                  </li>
                  <li>
                    <strong className="text-[#292524]">台鐵火車</strong>：搭乘自強號或區間快車抵達<strong>礁溪火車站</strong>，捷絲旅、晶泉、寒沐步行 5 分鐘內即可抵達。
                  </li>
                </ul>
              </div>

              {/* Driving guide */}
              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E7E5E4]">
                <div className="flex items-center gap-2 font-bold text-sm text-[#292524] mb-2">
                  <Car className="w-4 h-4 text-[#C05621]" />
                  <span>自駕開車族（路線與避開塞車指南）</span>
                </div>
                <div className="text-xs text-[#78716C] space-y-1.5 leading-relaxed">
                  <p>
                    • 走國道 5 號（蔣渭水高）穿過雪山隧道，下<strong>頭城/礁溪交流道</strong>，接台 9 線 5 分鐘抵達市區。
                  </p>
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                    💡 <strong>避塞車秘訣：</strong>
                    週五晚間或週六上午 07:00 前出發避開雪隧車潮；週日北返建議於 14:00 前或 20:00 後上國道。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FDFBF7] border-t border-[#E7E5E4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#C05621] text-white hover:bg-[#A8481B] transition-colors cursor-pointer"
          >
            我瞭解了，開始選飯店
          </button>
        </div>
      </div>
    </div>
  );
};
