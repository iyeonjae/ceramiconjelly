import React, { useState, useEffect } from 'react';
import { Supplier, InventoryItem } from '../types';
import { MapPin, ArrowRight, FileText, ChevronLeft, ChevronRight, Instagram, Tag, Sparkles, Zap } from 'lucide-react';

interface HomeDashboardProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function HomeDashboard({ setActiveTab, setSelectedSupplierId }: HomeDashboardProps) {
  const promoSlides = [
    {
      id: 'instagram',
      badgeLabel: '팔로우 이벤트',
      badgeIcon: <Instagram className="w-3 h-3" />,
      titleMain: '@jelly_in_ceramic 팔로우하고',
      titleAccent: '도예 재료를 받아가세요',
      desc: '팔로우 + 최근 게시글 좋아요로 응모. 추첨 10명에게 중앙도재 백자토 5kg 세트 증정!',
      ctaLabel: '인스타그램 바로가기',
      onCta: () => window.open('https://www.instagram.com/jelly_in_ceramic', '_blank', 'noopener,noreferrer'),
      bgGradient: 'linear-gradient(135deg, #833ab4 0%, #c13584 40%, #e1306c 70%, #fcb045 100%)',
      accentColor: '#fcb045',
      ctaBg: 'rgba(255,255,255,0.18)',
      ctaColor: 'white' as const,
      ctaBorder: '1px solid rgba(255,255,255,0.3)',
      textWhite: true,
    },
    {
      id: 'jungang-sale',
      badgeLabel: '이달의 특가',
      badgeIcon: <Tag className="w-3 h-3" />,
      titleMain: '중앙도재 여름 특가 세일',
      titleAccent: '점토 & 유약 최대 20% 할인',
      desc: '백자토 · 청자토 · 옹기토 전 품목 할인. 5kg 이상 구매 시 전국 배송비 무료.',
      ctaLabel: '중앙도재 카탈로그 보기',
      onCta: () => { setSelectedSupplierId('s-jungang'); setActiveTab('suppliers'); },
      bgGradient: 'linear-gradient(135deg, #2d0d0a 0%, #7a3f39 60%, #b76e66 100%)',
      accentColor: '#cbf7ee',
      ctaBg: 'rgba(203,247,238,0.12)',
      ctaColor: '#cbf7ee' as const,
      ctaBorder: '1px solid rgba(203,247,238,0.3)',
      textWhite: true,
    },
    {
      id: 'ai-recommend',
      badgeLabel: 'AI 추천 엔진',
      badgeIcon: <Sparkles className="w-3 h-3" />,
      titleMain: 'Cone부터 유약 느낌까지',
      titleAccent: 'AI가 딱 맞는 조합을 찾아드려요',
      desc: '가마 조건, 성형 방식, 원하는 유약 느낌을 입력하면 최적의 점토와 유약 조합을 즉시 추천.',
      ctaLabel: 'AI 추천 바로 받기',
      onCta: () => setActiveTab('recommender'),
      bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      accentColor: '#cbf7ee',
      ctaBg: 'rgba(203,247,238,0.12)',
      ctaColor: '#cbf7ee' as const,
      ctaBorder: '1px solid rgba(203,247,238,0.3)',
      textWhite: true,
    },
    {
      id: 'shimpo',
      badgeLabel: '신제품 입고',
      badgeIcon: <Zap className="w-3 h-3" />,
      titleMain: 'Shimpo RK-Whisper',
      titleAccent: '국내 정식 입고 완료',
      desc: '저소음 · 고토크 설계, 디지털 RPM 탑재. 일본 Shimpo 최신 전동 물레 국내 공식 수입.',
      ctaLabel: '해외 브랜드 카탈로그 보기',
      onCta: () => setActiveTab('suppliers'),
      bgGradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 60%, #bae6fd 100%)',
      accentColor: '#0369a1',
      ctaBg: '#0369a1',
      ctaColor: 'white' as const,
      ctaBorder: 'none',
      textWhite: false,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + promoSlides.length) % promoSlides.length);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % promoSlides.length);

  return (
    <div className="space-y-8" id="home-dashboard">
      {/* Promo Carousel */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide Track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)`, willChange: 'transform' }}
        >
          {promoSlides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-full h-[280px] md:h-[320px] flex items-center"
              style={{ background: slide.bgGradient }}
            >
              {/* Per-slide background decoration */}
              {slide.id === 'instagram' && (
                <div className="absolute right-0 inset-y-0 flex items-center pr-10 pointer-events-none select-none">
                  <Instagram className="w-52 h-52 text-white opacity-[0.06]" />
                </div>
              )}
              {slide.id === 'jungang-sale' && (
                <div className="absolute right-10 md:right-16 top-1/2 -translate-y-1/2 font-serif font-black text-[#cbf7ee] opacity-[0.08] pointer-events-none select-none hidden md:block" style={{ fontSize: '7.5rem', lineHeight: 1 }}>
                  20%
                </div>
              )}
              {slide.id === 'ai-recommend' && (
                <div className="absolute right-8 inset-y-0 flex items-center pointer-events-none select-none opacity-[0.08]">
                  <div className="relative w-40 h-40">
                    <Sparkles className="absolute top-0 right-0 w-12 h-12 text-[#cbf7ee]" />
                    <Sparkles className="absolute bottom-2 left-0 w-16 h-16 text-[#cbf7ee]" />
                    <Sparkles className="absolute top-12 left-10 w-8 h-8 text-[#cbf7ee]" />
                  </div>
                </div>
              )}
              {slide.id === 'shimpo' && (
                <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 font-mono font-black text-[#0c4a6e] opacity-[0.07] pointer-events-none select-none hidden md:block leading-none text-right" style={{ fontSize: '5rem' }}>
                  NEW<br />IN
                </div>
              )}

              {/* Main Content */}
              <div className="relative z-10 px-8 md:px-12 py-8 space-y-3 max-w-[70%] md:max-w-xl">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
                  style={{
                    background: slide.textWhite ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)',
                    color: slide.accentColor,
                    border: `1px solid ${slide.textWhite ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {slide.badgeIcon}
                  {slide.badgeLabel}
                </span>

                <h2
                  className="text-2xl md:text-[1.75rem] font-serif font-bold leading-snug"
                  style={{ color: slide.textWhite ? 'rgba(255,255,255,0.95)' : '#0c4a6e' }}
                >
                  {slide.titleMain}<br />
                  <span style={{ color: slide.accentColor }}>{slide.titleAccent}</span>
                </h2>

                <p
                  className="text-xs md:text-sm leading-relaxed"
                  style={{ color: slide.textWhite ? 'rgba(255,255,255,0.72)' : 'rgba(12,74,110,0.72)' }}
                >
                  {slide.desc}
                </p>

                <div className="pt-1">
                  <button
                    onClick={slide.onCta}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
                    style={{ background: slide.ctaBg, color: slide.ctaColor, border: slide.ctaBorder, backdropFilter: 'blur(4px)' }}
                  >
                    {slide.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all z-20 ${promoSlides[currentSlide].textWhite ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'bg-black/10 border-black/10 text-slate-600 hover:bg-black/15'}`}
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all z-20 ${promoSlides[currentSlide].textWhite ? 'bg-white/15 border-white/20 text-white hover:bg-white/25' : 'bg-black/10 border-black/10 text-slate-600 hover:bg-black/15'}`}
          aria-label="다음 슬라이드"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {promoSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`슬라이드 ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? `w-6 ${promoSlides[currentSlide].textWhite ? 'bg-white' : 'bg-slate-600'}`
                  : `w-1.5 ${promoSlides[currentSlide].textWhite ? 'bg-white/35' : 'bg-slate-400/40'}`
              }`}
            />
          ))}
        </div>
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

      {/* Ceramic Distribution flow notice card */}
      <div className="bg-stone-100/60 border border-stone-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="font-serif text-base font-semibold text-stone-900">도자기 원부자재 유통 흐름의 간소화</h3>
          <p className="text-stone-500 text-xs max-w-2xl">
            해외 브랜드의 번잡한 직접 구매 및 국내 중앙/대원/동영 도재상의 각각 흩어져 있는 단가를 한데 엮어 공급망 가시성을 높이고 고품질 태토 수급의 불확실성을 낮춥니다.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white border border-stone-300 rounded text-[11px] font-semibold text-stone-600 text-center">
            전가마 최적성 테스트
          </span>
          <span className="px-3 py-1 bg-white border border-stone-300 rounded text-[11px] font-semibold text-stone-600 text-center">
            실시간 재고관리
          </span>
        </div>
      </div>
    </div>
  );
}
