import React from 'react';
import { Share2, MessageCircle, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '♨️ 礁溪 10 大溫泉評鑑',
        text: '尋訪美人湯的極致溫度：礁溪 10 大頂級溫泉飯店嚴選評鑑',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('已複製網址到剪貼簿！');
    }
  };

  return (
    <footer className="mt-16 py-8 border-t border-[#D2DED5] bg-[#F2F5F2] text-center text-xs text-[#41574C]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <span className="font-serif-tc font-bold text-[#112019]">© 礁溪 10 大溫泉評鑑 ‧ 墨綠水墨禪風</span>
        <span className="hidden sm:inline text-stone-300">｜</span>

        {/* Social Link Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white hover:bg-[#1F4A38] hover:text-white border border-[#D2DED5] flex items-center justify-center transition-colors text-stone-600 shadow-xs"
            title="Facebook 粉絲專頁"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white hover:bg-[#1F4A38] hover:text-white border border-[#D2DED5] flex items-center justify-center transition-colors text-stone-600 shadow-xs"
            title="Instagram 官方帳號"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-full bg-white hover:bg-[#1F4A38] hover:text-white border border-[#D2DED5] flex items-center justify-center transition-colors text-stone-600 shadow-xs"
            title="LINE 官方分享"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={handleShare}
            className="w-7 h-7 rounded-full bg-white hover:bg-[#1F4A38] hover:text-white border border-[#D2DED5] flex items-center justify-center transition-colors text-stone-600 cursor-pointer shadow-xs"
            title="分享本站"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
