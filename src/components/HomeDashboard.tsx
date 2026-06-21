import React from 'react';
import { Supplier, InventoryItem } from '../types';
import { MapPin, ArrowRight, FileText, Sparkles, Instagram } from 'lucide-react';

interface HomeDashboardProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function HomeDashboard({ setActiveTab }: HomeDashboardProps) {
  return (
    <div className="space-y-8" id="home-dashboard">

      {/* Logo Hero */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-xs flex flex-col items-center justify-center py-12 md:py-16 px-8 text-center">
        <img
          src="/logo.png"
          alt="CeramicOn"
          className="h-24 md:h-36 w-auto object-contain mb-4"
        />
        <p className="text-stone-400 text-xs font-medium tracking-[0.2em] uppercase">
          도재상 찾기 · AI 추천 · 재고관리 · 시편 공유
        </p>
      </div>

      {/* 3-Column Service CTA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* AI 추천 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-7 flex flex-col shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-[#fdf0ed] flex items-center justify-center mb-5">
            <Sparkles className="w-5 h-5 text-[#b76e66]" />
          </div>
          <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">AI 맞춤 재료 추천</h3>
          <p className="text-stone-500 text-sm leading-relaxed flex-1">
            가마 조건, 성형 방식, 원하는 유약 느낌을 알려주세요. Cone 값과 환원·산화 소성 여부까지 세밀하게 반영해서 딱 맞는 흙과 유약 조합을 즉시 추천해드려요.
          </p>
          <button
            onClick={() => setActiveTab('recommender')}
            className="mt-6 w-full py-2.5 bg-[#b76e66] hover:bg-[#a05a53] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            추천 받기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 도재상 찾기 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-7 flex flex-col shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center mb-5">
            <MapPin className="w-5 h-5 text-stone-600" />
          </div>
          <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">도재상 통합 카탈로그</h3>
          <p className="text-stone-500 text-sm leading-relaxed flex-1">
            중앙도재·대원도재·동영세라믹스부터 Laguna·Amaco 같은 해외 브랜드까지 한 곳에서 비교해보세요. 취급 품목, 연락처, 추천 상품을 상세히 확인할 수 있어요.
          </p>
          <button
            onClick={() => setActiveTab('suppliers')}
            className="mt-6 w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            카탈로그 보기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 시편 커뮤니티 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-7 flex flex-col shadow-xs hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-[#e6faf8] flex items-center justify-center mb-5">
            <FileText className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">시편 공유 커뮤니티</h3>
          <p className="text-stone-500 text-sm leading-relaxed flex-1">
            소성에 성공한 흙·유약 조합을 사진과 함께 공유하고, 다른 도예가들의 실제 레시피를 참고해보세요. 소성 실패를 줄이는 가장 빠른 지름길이에요.
          </p>
          <button
            onClick={() => setActiveTab('community')}
            className="mt-6 w-full py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            커뮤니티 구경하기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Instagram Promo Banner */}
      <div
        className="rounded-2xl overflow-hidden shadow-md"
        style={{ background: 'linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #fcb045 100%)' }}
      >
        <div className="px-8 md:px-14 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Instagram className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1 text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60 block">팔로우 이벤트</span>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-snug">
                @jelly_in_ceramic 팔로우하고<br className="hidden md:block" /> 도예 재료를 받아가세요
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                팔로우 + 최근 게시글 좋아요로 응모. 추첨 10명에게 중앙도재 백자토 5kg 세트 증정!
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open('https://www.instagram.com/jelly_in_ceramic', '_blank', 'noopener,noreferrer')}
            className="shrink-0 px-6 py-3 rounded-xl bg-white/18 hover:bg-white/28 border border-white/30 text-white font-semibold text-sm transition-all backdrop-blur-sm flex items-center gap-2 whitespace-nowrap"
          >
            인스타그램 바로가기 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
