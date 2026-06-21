import React, { useState, useEffect } from 'react';
import { INITIAL_SUPPLIERS, INITIAL_INVENTORY, INITIAL_SPECIMENS } from './data';
import { Supplier, InventoryItem, SpecimenTestTile } from './types';
import HomeDashboard from './components/HomeDashboard';
import SupplierCatalog from './components/SupplierCatalog';
import AIRecommender from './components/AIRecommender';
import InventoryManager from './components/InventoryManager';
import CommunityForum from './components/CommunityForum';
import { Compass, Layers, Coffee, Sparkles, Building } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ceramic_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [specimens, setSpecimens] = useState<SpecimenTestTile[]>(() => {
    const saved = localStorage.getItem('ceramic_specimens');
    return saved ? JSON.parse(saved) : INITIAL_SPECIMENS;
  });

  useEffect(() => {
    localStorage.removeItem('ceramic_suppliers');
  }, []);

  useEffect(() => {
    localStorage.setItem('ceramic_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ceramic_specimens', JSON.stringify(specimens));
  }, [specimens]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            suppliers={suppliers}
            inventory={inventory}
            setActiveTab={setActiveTab}
            setSelectedSupplierId={setSelectedSupplierId}
          />
        );
      case 'suppliers':
        return (
          <SupplierCatalog
            suppliers={suppliers}
            selectedSupplierId={selectedSupplierId}
            setSelectedSupplierId={setSelectedSupplierId}
          />
        );
      case 'recommender':
        return <AIRecommender />;
      case 'inventory':
        return (
          <InventoryManager
            inventory={inventory}
            setInventory={setInventory}
          />
        );
      case 'community':
        return (
          <CommunityForum
            specimens={specimens}
            setSpecimens={setSpecimens}
          />
        );
      default:
        return (
          <HomeDashboard
            suppliers={suppliers}
            inventory={inventory}
            setActiveTab={setActiveTab}
            setSelectedSupplierId={setSelectedSupplierId}
          />
        );
    }
  };

  const navItems = [
    { id: 'home',        label: '홈',      icon: Compass  },
    { id: 'suppliers',   label: '도재상',   icon: Building },
    { id: 'recommender', label: 'AI 진단',  icon: Sparkles },
    { id: 'inventory',   label: '재고',     icon: Layers   },
    { id: 'community',   label: '시편 커뮤니티', icon: Coffee   },
  ];

  return (
    <div className="min-h-screen text-stone-900 font-sans flex flex-col" style={{ background: 'linear-gradient(238deg, #e3a692 0%, #cff9fb 100%)' }}>

      {/* Header — logo only */}
      <header className="bg-white border-b border-[#b76e66]/20 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <div
              onClick={() => setActiveTab('home')}
              className="flex flex-col leading-none cursor-pointer"
              id="platform-logo-btn"
            >
              <img
                src="/logo.png"
                alt="CeramicOn"
                className="h-12 w-auto object-contain object-left"
              />
              <span className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-0.5">
                도재상 찾기 · AI 추천 · 재고관리 · 시편 공유
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content — pb-24 to clear bottom tab bar */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-28 min-w-0">
        {renderActiveTab()}
      </main>

      {/* Glitch Banner */}
      <div className="glitch-wrapper mb-20">
        <div className="glitch" data-glitch="ceramiconjelly">ceramiconjelly</div>
      </div>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-sm border-t border-[#b76e66]/20 py-8 pb-28 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <span className="font-serif font-bold text-stone-800 text-sm">CeramicOn</span>
            <p className="text-[11px] text-stone-400">
              © 2026 CeramicOn Co. All rights reserved. 중앙도재, 대원도재, 동영세라믹스 및 글로벌 재제조사와 직결된 통합 유통망 연구 프로젝트.
            </p>
          </div>
          <div className="flex gap-4 font-medium text-stone-400 text-[11px]">
            <span className="hover:text-[#b76e66] transition-colors cursor-pointer">공정 유통 강령</span>
            <span>•</span>
            <span className="hover:text-[#b76e66] transition-colors cursor-pointer">가마 안전 준칙</span>
            <span>•</span>
            <span className="hover:text-[#b76e66] transition-colors cursor-pointer">이용약관</span>
          </div>
        </div>
      </footer>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#b76e66]/20 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto flex justify-around items-stretch h-16">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-all ${
                  isActive ? 'text-[#b76e66]' : 'text-stone-400 hover:text-stone-600'
                }`}
                id={`nav-tab-btn-${item.id}`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-full bg-[#b76e66]" style={{ marginTop: '-1px' }} />
                )}
                <IconComp className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-[#b76e66]' : 'text-stone-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
