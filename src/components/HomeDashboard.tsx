import React, { useState } from 'react';
import { Supplier, InventoryItem } from '../types';
import { MapPin, ArrowRight, FileText, Sparkles, Instagram } from 'lucide-react';

interface HomeDashboardProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function HomeDashboard({ setActiveTab }: HomeDashboardProps) {
  const [isWobbling, setIsWobbling] = useState(false);

  return (
    <div className="space-y-8" id="home-dashboard">

      {/* Pre-hero tagline */}
      <div className="text-center space-y-2 pt-2">
        <p className="font-serif text-stone-400 text-sm tracking-wide">
          도예의 변수를 줄이는 가장 쉬운 방법
        </p>
        <h2 className="font-serif font-bold text-stone-800 text-xl md:text-2xl">
          도예가를 위한 올인원 재료 플랫폼
        </h2>
        <p className="font-serif text-stone-500 text-sm md:text-base">
          가마 앞 불안감, 조금은 줄여드릴게요
        </p>
      </div>

      {/* Logo Hero */}
      <div className="relative flex items-center justify-center py-4 md:py-6 overflow-hidden">
        {[
          { top: '78%', left: '6%',  s: 10, c: '#d4907c', a: 'particle-a', d: '3.4s', dl: '0.0s' },
          { top: '82%', left: '22%', s: 7,  c: '#cbf7ee', a: 'particle-b', d: '4.2s', dl: '0.7s' },
          { top: '70%', left: '36%', s: 9,  c: '#b76e66', a: 'particle-c', d: '3.8s', dl: '1.3s' },
          { top: '85%', left: '50%', s: 6,  c: '#b8e8e0', a: 'particle-a', d: '4.6s', dl: '0.4s' },
          { top: '72%', left: '65%', s: 12, c: '#cbf7ee', a: 'particle-b', d: '3.1s', dl: '1.6s' },
          { top: '80%', left: '78%', s: 8,  c: '#e3a692', a: 'particle-c', d: '4.9s', dl: '0.9s' },
          { top: '65%', left: '91%', s: 7,  c: '#d4907c', a: 'particle-a', d: '3.6s', dl: '0.5s' },
          { top: '28%', left: '4%',  s: 8,  c: '#cbf7ee', a: 'particle-b', d: '4.0s', dl: '1.9s' },
          { top: '18%', left: '16%', s: 6,  c: '#e3a692', a: 'particle-c', d: '3.3s', dl: '2.2s' },
          { top: '32%', left: '85%', s: 10, c: '#b8e8e0', a: 'particle-a', d: '4.7s', dl: '0.8s' },
          { top: '14%', left: '72%', s: 7,  c: '#b76e66', a: 'particle-b', d: '3.9s', dl: '1.5s' },
          { top: '52%', left: '2%',  s: 9,  c: '#e3a692', a: 'particle-c', d: '4.4s', dl: '2.5s' },
          { top: '58%', left: '95%', s: 6,  c: '#cbf7ee', a: 'particle-a', d: '3.7s', dl: '1.2s' },
          { top: '88%', left: '43%', s: 11, c: '#d4907c', a: 'particle-b', d: '4.1s', dl: '0.6s' },
        ].map((p, i) => (
          <span
            key={i}
            className="logo-particle absolute rounded-full pointer-events-none"
            style={{
              top: p.top, left: p.left,
              width: p.s, height: p.s,
              background: p.c,
              animation: `${p.a} ${p.d} ${p.dl} ease-in-out infinite`,
              opacity: 0,
            }}
          />
        ))}
        <img
          src="/logo-hero.png"
          alt="CeramicOn"
          className={`relative z-10 w-full max-w-2xl h-auto object-contain cursor-pointer ${isWobbling ? 'logo-hero-wobble' : ''}`}
          style={{ mixBlendMode: 'multiply' }}
          onMouseEnter={() => setIsWobbling(true)}
          onClick={() => setIsWobbling(true)}
          onAnimationEnd={() => setIsWobbling(false)}
        />
      </div>


      {/* Featured AI Card + 2-column secondary cards */}
      <div className="space-y-5">

        {/* AI 추천 — Featured 전면 카드 */}
        <div className="bg-gradient-to-r from-[#b76e66]/18 to-[#f0c8bc]/25 backdrop-blur-md border border-[#b76e66]/40 rounded-2xl p-7 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-md">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#b76e66]/15 border border-[#b76e66]/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#b76e66]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b76e66] bg-[#b76e66]/12 px-2.5 py-1 rounded-full border border-[#b76e66]/25">
                ✦ AI 대표 서비스
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-stone-800 text-xl mb-2">AI 맞춤 재료 추천</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                가마 조건, 성형 방식, 원하는 유약 느낌을 알려주세요. Cone 값과 환원·산화 소성 여부까지 세밀하게 반영해서 딱 맞는 흙과 유약 조합을 즉시 추천해드려요.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('recommender')}
              className="w-full md:w-auto px-8 py-3 bg-[#b76e66] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#7a3f39] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#7a3f39] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7a3f39]"
            >
              추천 받기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 하단 2-column 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* 도재상 찾기 */}
          <div className="bg-white/75 backdrop-blur-md border border-white/70 border-t-2 border-t-stone-400 rounded-2xl p-7 flex flex-col shadow-md hover:bg-white/85 hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-stone-500/10 border border-stone-400/20 flex items-center justify-center mb-5">
              <MapPin className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-2">도재상 통합 카탈로그</h3>
            <p className="text-stone-500 text-sm leading-relaxed flex-1">
              중앙도재·대원도재·동영세라믹스부터 Laguna·Amaco 같은 해외 브랜드까지 한 곳에서 비교해보세요. 취급 품목, 연락처, 추천 상품을 상세히 확인할 수 있어요.
            </p>
            <button
              onClick={() => setActiveTab('suppliers')}
              className="mt-6 w-full py-2.5 bg-stone-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#1c1917] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#1c1917] active:translate-y-[3px] active:shadow-[0_1px_0_0_#1c1917]"
            >
              카탈로그 보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 시편 커뮤니티 */}
          <div className="bg-white/75 backdrop-blur-md border border-white/70 border-t-2 border-t-teal-500 rounded-2xl p-7 flex flex-col shadow-md hover:bg-white/85 hover:shadow-lg transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#cbf7ee]/40 border border-[#cbf7ee]/60 flex items-center justify-center mb-5">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="font-serif font-bold text-stone-800 text-lg mb-2">시편 공유 커뮤니티</h3>
            <p className="text-stone-500 text-sm leading-relaxed flex-1">
              소성에 성공한 흙·유약 조합을 사진과 함께 공유하고, 다른 도예가들의 실제 레시피를 참고해보세요. 소성 실패를 줄이는 가장 빠른 지름길이에요.
            </p>
            <button
              onClick={() => setActiveTab('community')}
              className="mt-6 w-full py-2.5 bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#134e4a] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#134e4a] active:translate-y-[3px] active:shadow-[0_1px_0_0_#134e4a]"
            >
              커뮤니티 구경하기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

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
