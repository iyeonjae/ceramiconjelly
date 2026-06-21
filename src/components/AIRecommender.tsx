import React, { useState } from 'react';
import { AIRecommendationInput, AIRecommendationResult } from '../types';
import { Flame, Sparkles, AlertCircle, ShoppingCart, HelpCircle, FileText, ChevronRight, RefreshCw, Copy, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function AIRecommender() {
  const [formData, setFormData] = useState<AIRecommendationInput>({
    firingTempRange: 'mid',
    technique: 'wheel',
    clayColorPref: 'white',
    glazeFinishPref: 'glossy',
    specialRequirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AIRecommendationResult | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Set up loading step intervals to keep the user engaged
  const loadingMessages = [
    '도예 요구 조건을 검토하며 흙의 특성을 대입하는 중...',
    '중앙도재, 대원도재, 동영세라믹스 및 글로벌 유역 재고 카탈로그를 조회 중...',
    '소성 온도별 팽창 계수를 측정하여 상호 균열 여부를 계산 중...',
    '가마 소성 곡선 및 기벽 제어용 공학 수치를 처방하는 중...'
  ];

  const handleRecommend = async () => {
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    // Increment loader steps
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const resData = await response.json();
      
      if (resData.success) {
        setResult(resData.data);
      } else {
        throw new Error(resData.errorMsg || '추천 생성 실패');
      }
    } catch (e) {
      console.error(e);
      // Let fallback logic execute or show alert
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `[도예 맞춤 재료 AI 진단서]\n\nOVERALL ADVICE:\n${result.overallAdvice}\n\n추천 재료 목록:\n${result.materials.map(m => `- ${m.name} (${m.category}) / 제조처: ${m.brandOrOrigin} / 소성온도: ${m.firingRange} / 추천공급처: ${m.suggestedSuppliers.join(', ')}\n  *설명: ${m.explanation}\n  *팁: ${m.usageTips}`).join('\n\n')}\n\n가마 소성 가이드라인:\n${result.firingGuidelines}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6" id="ai-recommender-section">
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-[0_4px_20px_rgba(183,110,102,0.15)] space-y-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#b76e66] fill-[#e3a692]/30" /> 
            AI 기반 도예 재료 맞춤 설계 및 추천
          </h2>
          <p className="text-stone-500 text-xs">
            가마 조건, 성형 방식, 원하는 유약 느낌을 입력하면 딱 맞는 흙과 유약을 추천해드립니다.
          </p>
        </div>
      </div>

      {!result && !loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 space-y-6">
            <h3 className="text-sm font-semibold text-stone-900 border-b border-stone-100 pb-2">도예 기법 및 선호 분석 설문</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Firing Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">소성 가마 온도대 (Firing Range)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'low', label: '저화도', desc: '~1100°C' },
                    { value: 'mid', label: '중화도', desc: '~1240°C' },
                    { value: 'high', label: '고화도', desc: '1260°C~' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, firingTempRange: opt.value as any })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        formData.firingTempRange === opt.value
                          ? 'border-[#b76e66] bg-[#b76e66]/5 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-stone-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Technique */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">선호 성형 기법 (Forming Technique)</label>
                <select
                  value={formData.technique}
                  onChange={(e) => setFormData({ ...formData, technique: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-[#b76e66]"
                >
                  <option value="wheel">물레 성형 (Wheel Throwing)</option>
                  <option value="handbuilding">핀칭 / 코일링 (Handbuilding)</option>
                  <option value="sculpture">틀 성형 / 큰 조형 (Sculpting)</option>
                  <option value="casting">슬립 캐스팅 (Slip Casting)</option>
                </select>
              </div>

              {/* 3. Clay Color */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">선호 점토 바디 색상 (Clay Body Color)</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { value: 'white', label: '백자색 (White)' },
                    { value: 'dark', label: '흑색/조화반점 (Dark)' },
                    { value: 'buff', label: '아이보리/버프 (Buff)' },
                    { value: 'red', label: '붉은 테라코타 (Red)' }
                  ].map(cOpt => (
                    <button
                      key={cOpt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, clayColorPref: cOpt.value as any })}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                        formData.clayColorPref === cOpt.value
                          ? 'border-[#b76e66] bg-[#b76e66]/10 text-[#7a3f39] font-semibold'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      {cOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Glaze Finish */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600 block">희망 유약 마감 질감 (Glaze Finish)</label>
                <select
                  value={formData.glazeFinishPref}
                  onChange={(e) => setFormData({ ...formData, glazeFinishPref: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-[#b76e66]"
                >
                  <option value="glossy">찰랑이는 유광 (Glossy Transparent)</option>
                  <option value="matte">보송한 매트 (Eggshell Matte)</option>
                  <option value="crystalline">오묘한 결정유 (Crystalline)</option>
                  <option value="crackle">전통 빙렬 균열유 (Crackle)</option>
                </select>
              </div>
            </div>

            {/* Special Request */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-stone-600 block">
                특수 소성 요건 및 아이디어 기서 (선택 사항)
              </label>
              <textarea
                placeholder="예: 전기가마 소성만 가능합니다 / 생활식기로 직접 쓸 예정이라 무연유약이어야 합니다 / 거친 질감을 겉면에 과감하게 부각시키고 싶어요."
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                rows={3}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                id="special-requirements-textarea"
              />
            </div>

            <button
              onClick={handleRecommend}
              className="w-full py-3 bg-[#b76e66] hover:bg-[#a05a53] text-white font-bold text-sm rounded-full shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="submit-recommendation-btn"
            >
              <Sparkles className="w-4 h-4 fill-stone-950 text-stone-950" /> 맞춤 재료 및 소성 배합 산출하기
            </button>
          </div>

          {/* Right Column Help Tips */}
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4">
              <h4 className="font-serif text-sm font-bold text-stone-800 flex items-center gap-1">
                <Info className="w-4 h-4 text-[#b76e66]" /> 공학 매칭 시스템 안내
              </h4>
              <p className="text-stone-600 text-xs leading-normal">
                점토의 태토 성분 수축율과 유약의 열팽창 곡선이 일치하지 않을 경우, 가마에서 나올 때 기물이 깨지는 유열(Cracking)이나 실금이 마구잡이로 생길 수 있습니다.
              </p>
              <div className="border-l-2 border-stone-300 pl-3.5 space-y-2 text-[11px] text-stone-500">
                <p><strong>점토 색조:</strong> 철분이 많은 다크 바디는 환원 소성에 오묘한 구리 색감을 자아내나 가스 배출이 많아 소성 시간이 깁니다.</p>
                <p><strong>유막 팁:</strong> 빙렬(크랙)은 인위적으로 완성하는 장식 요소로 청자 기물을 시각화할 때 가치가 늘어납니다.</p>
              </div>
            </div>

            <div className="bg-[#e6faf8]/60 rounded-xl border border-[#cbf7ee]/50 p-5 space-y-3">
              <span className="text-[10px] font-bold text-[#7a3f39] block uppercase tracking-wider">주요 연동 제조사 데이터</span>
              <p className="text-[11px] text-stone-600 leading-normal">
                미국 아마코(Amaco), 라구나(Laguna) 대용량 점토 및 국내 중앙도재 기성의 최신 수축율 데이터베이스가 실시간 매핑 규칙에 연계됩니다.
              </p>
            </div>
          </div>
        </div>
      ) : loading ? (
        /* LOADING STATE */
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center flex flex-col items-center justify-center space-y-6 shadow-[0_4px_20px_rgba(183,110,102,0.15)]">
          <div className="relative">
            <Flame className="w-12 h-12 text-[#b76e66] animate-bounce" />
            <span className="absolute inset-0 rounded-full border-4 border-[#e3a692]/20 border-t-[#b76e66] animate-spin"></span>
          </div>
          
          <div className="space-y-1.5">
            <h4 className="font-serif text-base font-bold text-stone-900">제조사 원자재 밸런싱 분석 중</h4>
            <p className="text-stone-500 text-xs max-w-sm font-medium animate-pulse" id="loading-step-message">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        </div>
      ) : (
        /* RESULT VIEW STATE */
        <div className="space-y-6" id="recommendation-result-panel">
          <div className="bg-stone-900 text-stone-100 rounded-xl p-6 md:p-8 space-y-4 shadow-md">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-[#e3a692] font-bold uppercase tracking-widest block">AI Ceramics Diagnosis</span>
                <h3 className="font-serif text-2xl font-bold">도예 장인 AI 맞춤 처방 결과서</h3>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 text-xs"
                  title="결과 클립보드에 복사"
                  id="copy-recommendation-btn"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#cff9fb]" /> : <Copy className="w-4 h-4" />}
                  {isCopied ? '복사 완료' : '결과 복사'}
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors flex items-center gap-1 text-xs"
                  id="reset-recommendation-btn"
                >
                  <RefreshCw className="w-4 h-4" /> 다시 진단하기
                </button>
              </div>
            </div>
            
            <p className="text-xs text-stone-300 leading-relaxed border-t border-stone-800 pt-4 font-normal">
              {result.overallAdvice}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recommended Materials Column (Left 2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 px-1">
                <ShoppingCart className="w-4 h-4 text-stone-500" /> 맞춤 추천 상용 원자재 스펙 ({result.materials.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.materials.map((m, idx) => (
                  <div key={idx} className="bg-white border border-stone-200 rounded-xl p-5 shadow-[0_4px_20px_rgba(183,110,102,0.12)] hover:-translate-y-2 hover:shadow-[0_12px_28px_rgba(183,110,102,0.32)] hover:border-[#b76e66]/30 transition-all duration-200 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded uppercase font-semibold">
                          {m.category}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {m.firingRange}
                        </span>
                      </div>
                      
                      <h4 className="font-serif font-bold text-stone-900 text-base">{m.name}</h4>
                      <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                        {m.explanation}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 space-y-2.5">
                      <div className="text-[11px] text-stone-600 bg-[#b76e66]/5 p-2 rounded border border-[#b76e66]/10 space-y-0.5">
                        <strong className="text-[#7a3f39] font-bold block text-[10px]">💡 소성 활용 노하우</strong>
                        <p>{m.usageTips}</p>
                      </div>

                      <div className="text-[10px] text-stone-400 flex flex-wrap gap-1 items-center">
                        <span className="font-semibold text-stone-500">배치 구입처:</span>
                        {m.suggestedSuppliers.map((s, sIdx) => (
                          <span key={sIdx} className="bg-stone-50 border border-stone-250 text-stone-600 px-1.5 py-0.2 rounded font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Firing Curve Rules (Right 1 col) */}
            <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4">
              <h3 className="font-serif text-sm font-bold text-stone-800 flex items-center gap-1">
                <Flame className="w-4 h-4 text-[#b76e66]" /> 공학 가마 열선 곡선 진단 (Firing Guidelines)
              </h3>
              
              <div className="text-xs text-stone-700 whitespace-pre-line leading-relaxed space-y-2 bg-white p-4 rounded-lg border border-stone-200">
                {result.firingGuidelines}
              </div>

              <div className="bg-[#f5ddd8]/40 p-3.5 rounded-lg border border-[#e8b5ad]/50 text-[10px] text-stone-500 space-y-1">
                <strong className="text-[#7a3f39]">⚠️ 공방 가마 유의사항</strong>
                <p className="leading-snug">
                  제시된 소성 가이드는 전력 용량 및 대기 장치의 성능에 따라 오차가 발생할 수 있습니다. 
                  대량 가마 인장 작업 전 반드시 한 단 깊이 시편 소성 테스트를 선행하시기를 권해드립니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
