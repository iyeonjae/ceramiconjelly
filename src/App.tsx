import React, { useState, useEffect } from 'react';
import { INITIAL_SUPPLIERS, INITIAL_INVENTORY, INITIAL_SPECIMENS } from './data';
import { Supplier, InventoryItem, SpecimenTestTile } from './types';
import HomeDashboard from './components/HomeDashboard';
import SupplierCatalog from './components/SupplierCatalog';
import AIRecommender from './components/AIRecommender';
import InventoryManager from './components/InventoryManager';
import CommunityForum from './components/CommunityForum';
import { loadGA, trackPageView } from './lib/gtag';

const JellyBear = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="8" cy="8" r="3.5"/>
    <circle cx="16" cy="8" r="3.5"/>
    <ellipse cx="12" cy="14.5" rx="7" ry="6.5"/>
    <ellipse cx="9.5" cy="11.5" rx="1.8" ry="1.1" fill="white" opacity="0.35"/>
  </svg>
);

const JellyRing = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="currentColor" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4a6 6 0 110 12A6 6 0 0112 6z"/>
    <ellipse cx="9" cy="8" rx="1.5" ry="1" fill="white" opacity="0.35"/>
  </svg>
);

const JellyStar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l2.9 8.9H23l-7.4 5.3 2.8 8.8L12 19.5l-6.4 5.5 2.8-8.8L2 10.9h8.1z"/>
    <ellipse cx="9.5" cy="9.5" rx="1.5" ry="1" fill="white" opacity="0.35"/>
  </svg>
);

const JellyDrop = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C9 7 4 11.5 4 15.5a8 8 0 0016 0C20 11.5 15 7 12 3z"/>
    <ellipse cx="9.5" cy="12" rx="1.4" ry="2.4" fill="white" opacity="0.35"/>
  </svg>
);

const JellyHeart = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18z"/>
    <ellipse cx="8.5" cy="8" rx="1.5" ry="1" fill="white" opacity="0.35"/>
  </svg>
);

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

  const TAB_TITLES: Record<string, string> = {
    home: '홈',
    suppliers: '도재상 카탈로그',
    recommender: 'AI 재료 추천',
    inventory: '재고 관리',
    community: '시편 커뮤니티',
  };

  // GA 초기화 (프로덕션 전용)
  useEffect(() => { loadGA(); }, []);

  // 탭 변경마다 page_view 발생
  useEffect(() => {
    trackPageView(activeTab, TAB_TITLES[activeTab] ?? activeTab);
  }, [activeTab]);

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
    { id: 'home',        label: '홈',          icon: JellyBear  },
    { id: 'suppliers',   label: '도재상',       icon: JellyRing  },
    { id: 'recommender', label: 'AI 진단',      icon: JellyStar  },
    { id: 'inventory',   label: '재고',         icon: JellyDrop  },
    { id: 'community',   label: '시편 커뮤니티', icon: JellyHeart },
  ];

  return (
    <div className="min-h-screen text-stone-900 font-sans flex flex-col" style={{ background: '#e3a692', backgroundImage: 'linear-gradient(238deg, #e3a692 0%, #cff9fb 100%)' }}>


      {/* Slim Header */}
      <header className="sticky top-0 z-40 bg-[#b76e66]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          <span
            onClick={() => setActiveTab('home')}
            className="font-serif font-bold text-white text-sm tracking-widest cursor-pointer drop-shadow-sm"
          >
            CeramicOn
          </span>
          <span className="text-white/60 text-[10px] font-medium tracking-widest hidden sm:block">
            ceramiconjelly
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28 min-w-0">
        {renderActiveTab()}
      </main>

      {/* Glitch Banner */}
      <div
        className="glitch-wrapper mb-20 cursor-pointer"
        onClick={() => window.open('https://www.instagram.com/jelly_in_ceramic', '_blank', 'noopener,noreferrer')}
      >
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-md border-t border-[#e3a692]/30 shadow-[0_-2px_16px_rgba(183,110,102,0.10)]">
        <div className="max-w-7xl mx-auto flex justify-around items-stretch h-16 px-2">
          {navItems.map(item => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 mx-0.5 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-[0_2px_12px_rgba(183,110,102,0.30)]'
                    : 'text-stone-400 hover:text-[#b76e66]'
                }`}
                style={isActive ? { background: '#b76e66' } : {}}
                id={`nav-tab-btn-${item.id}`}
              >
                <IconComp className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold tracking-wide">
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
