import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { Search, MapPin, Globe, Phone, ExternalLink, HelpCircle, Star, Sparkles } from 'lucide-react';

interface SupplierCatalogProps {
  suppliers: Supplier[];
  selectedSupplierId: string | null;
  setSelectedSupplierId: (id: string | null) => void;
}

export default function SupplierCatalog({ suppliers, selectedSupplierId, setSelectedSupplierId }: SupplierCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'domestic' | 'international'>('all');
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(null);

  // Sync activeSupplier when selectedSupplierId changes from other parent components e.g. Map Clicking
  useEffect(() => {
    if (selectedSupplierId) {
      const found = suppliers.find(s => s.id === selectedSupplierId);
      if (found) {
        setActiveSupplier(found);
      }
    } else if (suppliers.length > 0 && !activeSupplier) {
      setActiveSupplier(suppliers[0]);
    }
  }, [selectedSupplierId, suppliers]);

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sup.specialty.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          sup.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'domestic') return matchesSearch && !sup.isInternational;
    if (filterType === 'international') return matchesSearch && sup.isInternational;
    return matchesSearch;
  });

  const selectSupplier = (sup: Supplier) => {
    setActiveSupplier(sup);
    setSelectedSupplierId(sup.id);
  };

  return (
    <div className="space-y-6" id="supplier-catalog">
      {/* Search and Filter Panel */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-stone-400" />
            </span>
            <input
              type="text"
              placeholder="도재상 이름, 주력 흙(예: 백자토), 유약명 등으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-white"
              id="supplier-search-input"
            />
          </div>
          
          <div className="flex gap-1 bg-stone-100 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterType === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              전체 보기
            </button>
            <button
              onClick={() => setFilterType('domestic')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterType === 'domestic' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              국내 도재상
            </button>
            <button
              onClick={() => setFilterType('international')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterType === 'international' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              해외 브랜드
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Supplier List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-1">
          <span className="text-stone-500 font-bold text-[11px] uppercase tracking-wider block px-1">도재상 검색 결과 ({filteredSuppliers.length})</span>
          {filteredSuppliers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-stone-200">
              <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-500 text-xs">일치하는 국내외 도재상이 없습니다.</p>
            </div>
          ) : (
            filteredSuppliers.map(sup => {
              const isSelected = activeSupplier?.id === sup.id;
              return (
                <button
                  key={sup.id}
                  onClick={() => selectSupplier(sup)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-xs ring-1 ring-amber-500/30'
                      : 'bg-white border-stone-200/80 hover:border-stone-300'
                  }`}
                  id={`supplier-btn-${sup.id}`}
                >
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-sm shrink-0 uppercase tracking-wide ${
                        sup.isInternational ? 'bg-indigo-50 text-indigo-700' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {sup.isInternational ? '해외 수입' : '국내 공방'}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono flex items-center gap-0.5">
                        <Phone className="w-3 h-3" /> {sup.contact.split('-')[0]}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-stone-900 text-base">{sup.name}</h4>
                    <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{sup.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {sup.specialty.slice(0, 3).map((spec, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-600 font-medium px-2 py-0.5 rounded-full">
                        #{spec}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-2">
          {activeSupplier ? (
            <div className="bg-white border border-stone-200 rounded-xl p-6 lg:p-8 space-y-6 shadow-xs" id="supplier-detail-panel">
              {/* Header Header */}
              <div className="border-b border-stone-100 pb-5 space-y-3">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                    activeSupplier.isInternational ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeSupplier.isInternational ? 'Global Ceramic Supplier' : '한국 통합 도재상 공식 파트너'}
                  </span>
                  
                  <a
                    href={activeSupplier.website}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                  >
                    공식 몰 홈피 가기 <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h3 className="text-2xl font-serif font-bold text-stone-900">{activeSupplier.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="truncate">{activeSupplier.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>대표 번호: {activeSupplier.contact}</span>
                  </div>
                </div>
              </div>

              {/* Description body */}
              <div className="space-y-2">
                <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">도재상 종합 소개</span>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-200/50">
                  {activeSupplier.description}
                </p>
              </div>

              {/* Specialties Hashtags */}
              <div className="space-y-2">
                <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">강점 및 취급 품목 분야</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeSupplier.specialty.map((spec, i) => (
                    <span key={i} className="text-xs bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1 rounded-md font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Best Featured Products list */}
              <div className="space-y-3 pt-2">
                <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider block">추천 베스트 등재 상품</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeSupplier.featuredProducts.map((prod, i) => (
                    <div key={i} className="bg-white border border-stone-200 rounded-lg p-3.5 flex flex-col justify-between space-y-2 hover:border-amber-500/30 hover:shadow-xs transition-shadow">
                      <div className="space-y-1">
                        <span className="text-[9px] text-amber-700 uppercase font-bold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> BEST 0{i + 1}
                        </span>
                        <h5 className="font-bold text-xs text-stone-800 line-clamp-2">{prod}</h5>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-stone-500">
                        <span>공급 단가 문의</span>
                        <span className="px-1.5 py-0.5 bg-stone-100 font-mono text-[9px] rounded font-semibold text-stone-600">실시간 연동</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Order Guide block */}
              <div className="bg-amber-50 rounded-xl border border-amber-200/50 p-4 flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-amber-200 text-amber-600 shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-900">통합 견적 및 직공급 수령 서비스</h4>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    본 플랫폼에서는 {activeSupplier.name.split(' (')[0].trim()}의 시그니처 점토와 가마 재료들을 위탁 없이 
                    직접 담아 주문서를 산출할 수 있습니다. 각 대리점에 매번 전화를 걸 필요 없이, 공방 수령 톤 단위 공동구매를 통해 
                    최대 15%의 물류 이동 단가를 단순화할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12 bg-white rounded-xl border border-dashed border-stone-250 text-stone-400">
              <span className="text-xs">상세히 열람할 도재상을 목록에서 클릭해 선택해주세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
