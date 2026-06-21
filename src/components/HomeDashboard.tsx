import React, { useState, useEffect } from 'react';
import { Supplier, InventoryItem } from '../types';
import { MapPin, ArrowRight, FileText, Sparkles, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeDashboardProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function HomeDashboard({ setActiveTab }: HomeDashboardProps) {
  const [isWobbling, setIsWobbling] = useState(false);
  const [isJelly, setIsJelly] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const banners = [
    {
      bg: 'linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #fcb045 100%)',
      tag: '팔로우 이벤트',
      title: '@jelly_in_ceramic 팔로우하고 도예 원데이클래스 90% 할인받아요',
      desc: '계정 팔로우 + 고정게시물 좋아요 + 댓글 작성으로 응모. 당첨자에게 도예 원데이클래스 90% 할인 링크 발송!',
      cta: '인스타그램 바로가기',
      onClick: () => window.open('https://www.instagram.com/jelly_in_ceramic', '_blank', 'noopener,noreferrer'),
    },
    {
      bg: 'linear-gradient(135deg, #b76e66 0%, #c97a6a 100%)',
      tag: 'AI 서비스',
      title: '흙과 유약, 조합이 고민이라면 AI에게 맡겨보세요',
      desc: 'Cone 값, 소성 방식, 원하는 질감까지 — 맞춤 재료 조합을 즉시 추천해드려요.',
      cta: 'AI 진단 받기',
      onClick: () => setActiveTab('recommender'),
    },
    {
      bg: 'linear-gradient(135deg, #7a5c58 0%, #b76e66 100%)',
      tag: '도재상 카탈로그',
      title: '중앙도재부터 Laguna까지, 한 곳에서 비교하세요',
      desc: '국내외 도재상 취급 품목·연락처·추천 상품을 통합 정리했어요.',
      cta: '카탈로그 보기',
      onClick: () => setActiveTab('suppliers'),
    },
    {
      bg: 'linear-gradient(135deg, #5a9e97 0%, #89ccc6 100%)',
      tag: '시편 커뮤니티',
      title: '성공한 소성 레시피를 나눠보세요',
      desc: '실제 도예가들의 흙·유약 조합과 소성 팁. 실패를 줄이는 가장 빠른 지름길이에요.',
      cta: '커뮤니티 구경하기',
      onClick: () => setActiveTab('community'),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx(i => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8" id="home-dashboard">

      {/* Pre-hero tagline */}
      <div className="text-center space-y-2 pt-2">
        <p className="font-serif text-stone-600 text-base md:text-lg tracking-widest font-semibold">
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
          src={isJelly ? '/logo-hero-jelly.png' : '/logo-hero.png'}
          alt="CeramicOn"
          className={`relative z-10 w-full max-w-2xl h-auto object-contain cursor-pointer ${isWobbling ? 'logo-hero-wobble' : ''}`}
          style={{ mixBlendMode: 'multiply' }}
          onMouseEnter={() => setIsWobbling(true)}
          onClick={() => { setIsJelly(j => !j); setIsWobbling(true); }}
          onAnimationEnd={() => setIsWobbling(false)}
        />
        <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] text-stone-500/80 tracking-wide whitespace-nowrap pointer-events-none">
          {isJelly ? '한 번 더 클릭하면 원래대로!' : '로고를 클릭해서 소성해보세요 🔥'}
        </p>
      </div>

      {/* Featured AI Card + 2-column secondary cards */}
      <div className="space-y-5">

        {/* AI 추천 — Featured 전면 카드 */}
        <div className="bg-white/55 backdrop-blur-md border border-[#b76e66]/30 rounded-2xl p-7 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-[0_4px_24px_rgba(183,110,102,0.25)] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(183,110,102,0.40)] transition-all duration-200">
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
              <h3 className="font-serif font-extrabold text-stone-800 text-xl mb-2">AI 맞춤 재료 추천</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                가마 조건, 성형 방식, 원하는 유약 느낌을 알려주세요. Cone 값과 환원·산화 소성 여부까지 세밀하게 반영해서 딱 맞는 흙과 유약 조합을 즉시 추천해드려요.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('recommender')}
              className="w-full md:w-auto px-8 py-3 bg-[#b76e66] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#7a3f39] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#7a3f39] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7a3f39]"
            >
              추천 받기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 하단 2-column 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* 도재상 찾기 */}
          <div className="bg-white/55 backdrop-blur-md border border-[#e3a692]/40 border-t-2 border-t-[#b76e66] rounded-2xl p-7 flex flex-col shadow-[0_4px_20px_rgba(183,110,102,0.20)] hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(183,110,102,0.38)] transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-stone-500/10 border border-stone-400/20 flex items-center justify-center mb-5">
              <MapPin className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-serif font-extrabold text-stone-800 text-lg mb-2">도재상 통합 카탈로그</h3>
            <p className="text-stone-500 text-sm leading-relaxed flex-1">
              내가 필요한 흙·유약·도구를 파는 도재상을 찾아보세요. 중앙도재·대원도재·동영세라믹스부터 Laguna·Amaco 해외 브랜드까지 취급 품목과 연락처를 한눈에 확인할 수 있어요.
            </p>
            <button
              onClick={() => setActiveTab('suppliers')}
              className="mt-6 w-full py-2.5 bg-[#cff9fb] text-stone-800 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#8ed8db] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#8ed8db] active:translate-y-[3px] active:shadow-[0_1px_0_0_#8ed8db]"
            >
              카탈로그 보기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 시편 커뮤니티 */}
          <div className="bg-white/55 backdrop-blur-md border border-[#cff9fb]/60 border-t-2 border-t-[#cff9fb] rounded-2xl p-7 flex flex-col shadow-[0_4px_20px_rgba(207,249,251,0.45)] hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(207,249,251,0.70)] transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-[#cff9fb]/40 border border-[#cff9fb]/60 flex items-center justify-center mb-5">
              <FileText className="w-5 h-5 text-stone-600" />
            </div>
            <h3 className="font-serif font-extrabold text-stone-800 text-lg mb-2">시편 공유 커뮤니티</h3>
            <p className="text-stone-500 text-sm leading-relaxed flex-1">
              소성에 성공한 흙·유약 조합을 사진과 함께 공유하고, 다른 도예가들의 실제 레시피를 참고해보세요. 소성 실패를 줄이는 가장 빠른 지름길이에요.
            </p>
            <button
              onClick={() => setActiveTab('community')}
              className="mt-6 w-full py-2.5 bg-[#b76e66] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all duration-75 shadow-[0_4px_0_0_#7a3f39] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_#7a3f39] active:translate-y-[3px] active:shadow-[0_1px_0_0_#7a3f39]"
            >
              커뮤니티 구경하기 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Promo Banner Carousel */}
      <div className="relative rounded-2xl overflow-hidden shadow-md">
        {/* 슬라이드 트랙 */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${bannerIdx * 100}%)` }}
        >
          {banners.map((banner, i) => (
            <div
              key={i}
              className="min-w-full px-6 md:px-10 py-5 flex items-center justify-between gap-4"
              style={{ background: banner.bg }}
            >
              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">{banner.tag}</span>
                <h3 className="text-sm md:text-base font-serif font-bold text-white leading-snug truncate">{banner.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed line-clamp-1">{banner.desc}</p>
              </div>
              <button
                onClick={banner.onClick}
                className="shrink-0 px-4 py-2 rounded-full bg-white/18 hover:bg-white/28 border border-white/30 text-white font-semibold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                {banner.cta} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* 좌우 화살표 */}
        <button
          onClick={() => setBannerIdx(i => (i - 1 + banners.length) % banners.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={() => setBannerIdx(i => (i + 1) % banners.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>

        {/* 도트 인디케이터 */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === bannerIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
