import React, { useState, useEffect } from 'react';
import { Supplier, InventoryItem } from '../types';
import { MapPin, ArrowRight, Layers, Flame, FileText, Globe, ChevronLeft, ChevronRight, Instagram, Tag, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeDashboardProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  setActiveTab: (tab: string) => void;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function HomeDashboard({ suppliers, inventory, setActiveTab, setSelectedSupplierId }: HomeDashboardProps) {
  // Compute some stats
  const domesticCount = suppliers.filter(s => !s.isInternational).length;
  const intlCount = suppliers.filter(s => s.isInternational).length;
  const criticalItems = inventory.filter(item => item.stockQuantity <= item.stockAlertThreshold);

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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-sm font-medium">연동 도재상</span>
            <Globe className="w-5 h-5 text-stone-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-stone-900">{suppliers.length}개</span>
            <span className="text-xs text-stone-500">(국내 {domesticCount} / 국외 {intlCount})</span>
          </div>
        </div>

        <div className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-sm font-medium">관리 중인 재료</span>
            <Layers className="w-5 h-5 text-stone-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-stone-900">{inventory.length}종</span>
            <span className="text-xs text-stone-500">(포함 카테고리 4개)</span>
          </div>
        </div>

        <div className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-sm font-medium">재고 보충 필요</span>
            <Flame className="w-5 h-5 text-[#b76e66]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${criticalItems.length > 0 ? 'text-[#b76e66]' : 'text-emerald-600'}`}>
              {criticalItems.length}건
            </span>
            <span className="text-xs text-stone-500">임계 값 미만 알람</span>
          </div>
        </div>

        <div className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-stone-400">
            <span className="text-sm font-medium">공유된 테스트 시편</span>
            <FileText className="w-5 h-5 text-stone-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-stone-900">3개</span>
            <span className="text-xs text-stone-500">도예가 레시피 활성</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Supplier Interactive Map & Info Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Interactive Map Locator */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-serif font-semibold text-stone-900">도자기 유통 허브 지리 정보 (Digital Map)</h2>
              <p className="text-stone-500 text-xs">주요 거점 도재상을 클릭하면 해당 상세 카탈로그 페이지로 즉시 연결됩니다.</p>
            </div>
            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-md text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#b76e66]" /> 수도권/이천/해외 거점
            </span>
          </div>

          {/* Map Graphic Container */}
          <div className="relative h-96 w-full bg-stone-50 border border-stone-200 rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch">
            {/* Minimal Clay-themed Styled Map Overlay */}
            <div className="relative flex-1 bg-stone-100 p-4 overflow-hidden flex items-center justify-center">
              {/* Abstract Map Background Lines */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#854d0e_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
              
              {/* Dynamic Korea Map Outline Blueprint */}
              <div className="relative w-72 h-80 border-2 border-dashed border-stone-300/60 rounded-full flex items-center justify-center">
                <div className="absolute w-44 h-56 bg-stone-200/80 rounded-2xl flex items-center justify-center shadow-inner">
                  <span className="font-serif italic text-stone-300 text-6xl tracking-widest font-bold">KOREA</span>
                </div>
                
                {/* Seoul Marker */}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { setSelectedSupplierId('s-jungang'); setActiveTab('suppliers'); }}
                  className="absolute top-20 left-24 group flex flex-col items-center"
                  title="서울 종로 중앙도재"
                >
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50">
                    중앙도재 (인사동)
                  </span>
                  <span className="h-3.5 w-3.5 rounded-full bg-amber-500 ring-4 ring-amber-500/20 animate-bounce"></span>
                  <span className="text-[10px] font-bold text-stone-700 bg-white/90 px-1 py-0.2 rounded mt-1 border border-stone-200">중앙</span>
                </motion.button>

                {/* Daewon Seoul marker */}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { setSelectedSupplierId('s-daewon'); setActiveTab('suppliers'); }}
                  className="absolute top-26 left-20 group flex flex-col items-center"
                  title="서울 종로 대원도재"
                >
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50">
                    대원도재 (종로3가)
                  </span>
                  <span className="h-3 w-3 rounded-full bg-amber-600 ring-4 ring-amber-600/20"></span>
                  <span className="text-[10px] font-bold text-stone-700 bg-white/90 px-1 py-0.2 rounded mt-1 border border-stone-200">대원</span>
                </motion.button>

                {/* Icheon Marker */}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => { setSelectedSupplierId('s-dongyeong'); setActiveTab('suppliers'); }}
                  className="absolute top-36 left-36 group flex flex-col items-center"
                  title="이천 동영세라믹스"
                >
                  <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-transform bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-50">
                    동영세라믹스 (이천 신둔)
                  </span>
                  <span className="h-3.5 w-3.5 rounded-full bg-stone-800 ring-4 ring-stone-900/10 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-stone-700 bg-white/90 px-1 py-0.2 rounded mt-1 border border-stone-200">동영 (이천)</span>
                </motion.button>
              </div>

              {/* International Globe Corner Decor */}
              <div className="absolute bottom-3 right-3 bg-white/75 p-2 rounded-lg border border-stone-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-500 animate-spin-slow" />
                <div className="text-[10px] text-stone-600 font-semibold">
                  해외 거점: 미국 CA / IN (라구나, 아마코 연계)
                </div>
              </div>
            </div>

            {/* Quick Directory list beside Map */}
            <div className="w-full md:w-56 bg-stone-50 border-t md:border-t-0 md:border-l border-stone-200 p-4 space-y-3 flex flex-col justify-between">
              <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider block">등재 도재상 단축링크</span>
              <div className="space-y-2 flex-grow overflow-y-auto">
                {suppliers.map(sup => (
                  <button
                    key={sup.id}
                    onClick={() => { setSelectedSupplierId(sup.id); setActiveTab('suppliers'); }}
                    className="w-full text-left p-2 rounded hover:bg-stone-200/50 transition-colors border border-stone-200/50 hover:border-amber-500/20 group flex items-start justify-between"
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold text-stone-900 truncate group-hover:text-amber-700">{sup.name.split(' (')[0]}</div>
                      <div className="text-[10px] text-stone-500 truncate">{sup.isInternational ? '해외 수입' : '국내 도재상'}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#b76e66] shrink-0 self-center" />
                  </button>
                ))}
              </div>
              <div className="pt-2 border-t border-stone-200/80">
                <p className="text-[9px] text-stone-400 leading-normal">
                  상단 맵의 마커 혹은 단축 버튼을 선택하면 대표 판매 품목 및 실제 운영 사이트 조회가 구체적으로 이루어집니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 col: Platform Guides / Quick Access */}
        <div className="space-y-6">
          <div className="bg-[#fdf0ed]/80 rounded-xl border border-[#e8b5ad]/60 p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#7a3f39]">도예 맞춤 제안 시스템</h3>
            <p className="text-stone-700 text-xs leading-relaxed">
              가마 번호(Cone 값), 환원/산화 분기점, 물레 여부와 같은 공방별 세부 기술 환경을 입력하여 맞춤 재료를 추천받으세요.
            </p>
            <div className="bg-white/80 p-3.5 rounded-lg border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase block tracking-wider">추천 범위</span>
              <ul className="text-stone-600 text-xs space-y-1.5 font-medium list-disc pl-4">
                <li>물레성형용 최적 백자/옹기/조형 소성토</li>
                <li>오버레이 기법용 액상 및 가루유약</li>
                <li>특정 가마 냉각용 금속 연질 안료</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('recommender')}
              className="w-full py-2 bg-[#b76e66] hover:bg-[#a05a53] text-white font-medium text-xs rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              사용자 환경 입력하기 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900">시편 공유 네트워크</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              소성 실패를 방지하는 최고의 지름길은 다른 제작자의 실제 성공 시편 데이터를 분석하는 것입니다.
            </p>
            <div className="border border-stone-200/80 rounded-lg bg-white p-3 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-stone-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-mono text-stone-600">t-1</span>
                </div>
                <div className="truncate">
                  <span className="font-bold text-xs text-stone-800 block truncate">Amaco Honey Flux 콤비네이션</span>
                  <span className="text-[10px] text-stone-400">조회 128회 • 소성 1220°C</span>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 line-clamp-2">
                "클레이 바디의 기벽 두께에 따라 하니플럭스와 매트의 상호 레이어 효과가..."
              </div>
            </div>
            <button
              onClick={() => setActiveTab('community')}
              className="w-full py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-md transition-colors"
            >
              커뮤니티 구경하기
            </button>
          </div>
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
