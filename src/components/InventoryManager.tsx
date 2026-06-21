import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Plus, Minus, AlertTriangle, Layers, Filter, Search, RotateCcw, PlusCircle, Check, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

export default function InventoryManager({ inventory, setInventory }: InventoryManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  // New Item Input State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Clay' as any,
    supplier: '',
    firingTemp: '1240°C - 1260°C (Cone 5-6)',
    stockQuantity: 20,
    unit: 'kg' as any,
    stockAlertThreshold: 10,
    notes: ''
  });

  const handleUpdateStock = (id: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.stockQuantity + amount);
        return {
          ...item,
          stockQuantity: parseFloat(newQty.toFixed(2)),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    const added: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newItem.name,
      category: newItem.category,
      supplier: newItem.supplier || '자체 보관',
      firingTemp: newItem.firingTemp,
      stockQuantity: Number(newItem.stockQuantity),
      unit: newItem.unit,
      stockAlertThreshold: Number(newItem.stockAlertThreshold),
      notes: newItem.notes,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setInventory(prev => [added, ...prev]);
    // Reset
    setNewItem({
      name: '',
      category: 'Clay',
      supplier: '',
      firingTemp: '1240°C - 1260°C (Cone 5-6)',
      stockQuantity: 20,
      unit: 'kg',
      stockAlertThreshold: 10,
      notes: ''
    });
    setShowAddForm(false);
  };

  const criticalItems = inventory.filter(item => item.stockQuantity <= item.stockAlertThreshold);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="inventory-manager">
      {/* Overview stats & Critical Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-6 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">공방 원자재 현황판</h2>
              <p className="text-stone-500 text-xs mt-0.5">보유 중인 백토, 청화 안료, 유약 원료를 입출고하고 소모 현황을 간편하게 트래킹합니다.</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              id="toggle-add-material-btn"
            >
              {showAddForm ? '재고 목록 보기' : '+ 새 원자재 등록'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-700">성분 분석:</span>
            <span>흙/태토 (Clay): {inventory.filter(i => i.category === 'Clay').length}종</span> •
            <span>유약 완제품 (Glaze): {inventory.filter(i => i.category === 'Glaze').length}종</span> •
            <span>천연 무기가루 (Raw): {inventory.filter(i => i.category === 'Raw Material').length}종</span>
          </div>
        </div>

        {/* Alerts Corner */}
        <div className="bg-[#fdf0ed] rounded-xl border border-[#e8b5ad] p-6 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 text-[#7a3f39]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-semibold text-xs uppercase tracking-wider">주요 품절 주의 알람</span>
          </div>

          <div className="flex-grow">
            {criticalItems.length === 0 ? (
              <p className="text-stone-700 text-xs">보유 원부자재가 모두 안전 임계값 이상을 유지 중입니다.</p>
            ) : (
              <div className="space-y-1 bg-white/70 p-2 rounded border border-amber-300 max-h-24 overflow-y-auto">
                {criticalItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-[10px] text-amber-900">
                    <span className="font-bold truncate max-w-[120px]">{item.name}</span>
                    <span>남음: {item.stockQuantity}{item.unit} (임계: {item.stockAlertThreshold})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-[#7a3f39]/80 leading-snug">
            *흙이 품절되기 약 3박스 전 미리 인근 중앙도재 혹은 대원도재 견적 공동구매 요청을 진행하십시오.
          </p>
        </div>
      </div>

      {showAddForm ? (
        /* ADD NEW MATERIAL FORM */
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs" id="add-material-form-panel">
          <div className="border-b border-stone-100 pb-3 mb-5">
            <h3 className="font-serif text-lg font-bold text-stone-900">새로운 공방 자재 등록</h3>
            <p className="text-stone-500 text-xs">수치나 가마 대응 온도를 정의하여 소유 자재를 안전하게 원장 정보에 편입시킵니다.</p>
          </div>

          <form onSubmit={handleAddNewItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">원자재 명칭</label>
                <input
                  type="text"
                  required
                  placeholder="예: 분청토 고운입자, 비믹스 5 소량"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">원부자재 카테고리</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                >
                  <option value="Clay">점토 / 수화 태토 (Clay)</option>
                  <option value="Glaze">유약 완제품 / 안료액 (Glaze)</option>
                  <option value="Raw Material">자체배합용 산화 금속가루 (Raw Material)</option>
                  <option value="Tool">도예 전용 소모 도구 (Tool)</option>
                  <option value="Other">기타 부자재 (Other)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">제조사 / 출처 도재상</label>
                <input
                  type="text"
                  placeholder="예: 중앙도재, Laguna, 직접 양생 등"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">소성 한계 온도 (Cone 값 등)</label>
                <input
                  type="text"
                  placeholder="예: 1240°C (Cone 6)"
                  value={newItem.firingTemp}
                  onChange={(e) => setNewItem({ ...newItem, firingTemp: e.target.value })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">초기 수량 및 기본 단위</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={newItem.stockQuantity}
                    onChange={(e) => setNewItem({ ...newItem, stockQuantity: Number(e.target.value) })}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as any })}
                    className="p-2.5 bg-stone-50 border border-stone-250 rounded-lg text-xs"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="piece">개</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 block">품절 경보 알람 기준 이하값</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.stockAlertThreshold}
                  onChange={(e) => setNewItem({ ...newItem, stockAlertThreshold: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-600 block">비고 및 소재 설명</label>
              <textarea
                placeholder="유약 조합비율, 물레 시 성형감 느낌 등을 자유롭게 사서로 기록해 두세요."
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                rows={2}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-250 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#b76e66] bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#b76e66] hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                id="submit-add-material-btn"
              >
                <Check className="w-3.5 h-3.5" /> 자재 목록에 추가
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* INVENTORY LIST DIRECTORY VIEW */
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-4 h-4 text-stone-400" />
              </span>
              <input
                type="text"
                placeholder="보유 자재 자산명 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
              <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {['All', 'Clay', 'Glaze', 'Raw Material', 'Tool'].map(f => (
                <button
                  key={f}
                  onClick={() => setCategoryFilter(f)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === f
                      ? 'bg-[#b76e66] text-white shadow-xs'
                      : 'bg-stone-50 border border-stone-200/65 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {f === 'All' ? '전체 자산' : f === 'Clay' ? '흙/태토' : f === 'Glaze' ? '유약/액상' : f === 'Raw Material' ? '천연 원료가루' : '특화도구'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
            {filteredInventory.length === 0 ? (
              <div className="p-12 text-center text-stone-400 space-y-2">
                <Layers className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs">보유 기록된 자재 자산이 아직 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                      <th className="p-4">원자재 수식명 / 분류</th>
                      <th className="p-4">출처 도재상</th>
                      <th className="p-4">가마 대응 사양</th>
                      <th className="p-4 text-center">잔량 게이지</th>
                      <th className="p-4 text-right">경보선</th>
                      <th className="p-4 text-center">재고 수치 입출고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {filteredInventory.map(item => {
                      const isLow = item.stockQuantity <= item.stockAlertThreshold;
                      
                      // Calculate mock fill percentage for progress bar
                      const maxCapacityMock = item.stockAlertThreshold * 4;
                      const percentage = Math.min(100, Math.round((item.stockQuantity / maxCapacityMock) * 100));

                      return (
                        <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-4 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-stone-900">{item.name}</span>
                              {isLow && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#f5ddd8] text-[#7a3f39] border border-[#e8b5ad] flex items-center gap-0.5 animate-pulse">
                                  재고 부족
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400 block font-medium">
                              {item.category === 'Clay' ? '흙/태토' : item.category === 'Glaze' ? '액상 유약' : item.category === 'Raw Material' ? '원소 가공가루' : '소성 수공 칼'} • 최종수정: {item.lastUpdated}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-stone-650 font-medium">{item.supplier}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-[11px] font-mono bg-stone-100/60 p-1 rounded border border-stone-200">
                              {item.firingTemp}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1 flex flex-col justify-center max-w-[150px] mx-auto">
                              <div className="flex justify-between items-center text-[10px] font-bold">
                                <span className={isLow ? 'text-[#b76e66]' : 'text-stone-700'}>
                                  {item.stockQuantity} {item.unit}
                                </span>
                                <span className="text-stone-400">{percentage}%</span>
                              </div>
                              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200/50">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isLow ? 'bg-[#b76e66]' : 'bg-stone-800'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono text-xs text-stone-600">
                            {item.stockAlertThreshold} {item.unit} 이하
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleUpdateStock(item.id, -10)}
                                className="w-7 h-7 bg-white hover:bg-stone-100 text-stone-700 border border-stone-250 rounded-sm flex items-center justify-center transition-colors shadow-xs hover:border-stone-300"
                                title="10 단위 소모"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleUpdateStock(item.id, -1)}
                                className="w-7 h-7 bg-white hover:bg-stone-100 text-stone-700 border border-stone-250 rounded-sm flex items-center justify-center transition-colors shadow-xs hover:border-stone-300"
                                title="1 단위 소모"
                                id={`inv-minus-btn-${item.id}`}
                              >
                                <span className="text-[10px] font-bold">-1</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStock(item.id, 1)}
                                className="w-7 h-7 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-sm flex items-center justify-center transition-colors shadow-xs"
                                title="1 단위 보충"
                                id={`inv-plus-btn-${item.id}`}
                              >
                                <span className="text-[10px] font-bold">+1</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStock(item.id, 10)}
                                className="w-7 h-7 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-sm flex items-center justify-center transition-colors shadow-xs"
                                title="10 단위 벌크 입고"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
