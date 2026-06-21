import React, { useState, useEffect } from 'react';
import { INITIAL_SUPPLIERS, INITIAL_INVENTORY, INITIAL_SPECIMENS } from './data';
import { Supplier, InventoryItem, SpecimenTestTile } from './types';
import HomeDashboard from './components/HomeDashboard';
import SupplierCatalog from './components/SupplierCatalog';
import AIRecommender from './components/AIRecommender';
import InventoryManager from './components/InventoryManager';
import CommunityForum from './components/CommunityForum';
import { Flame, Compass, Layers, Coffee, Info, Sparkles, Building, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistence inside Local Storage for realistic platform workflows
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('ceramic_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('ceramic_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [specimens, setSpecimens] = useState<SpecimenTestTile[]>(() => {
    const saved = localStorage.getItem('ceramic_specimens');
    return saved ? JSON.parse(saved) : INITIAL_SPECIMENS;
  });

  useEffect(() => {
    localStorage.setItem('ceramic_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

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
    { id: 'home', label: '공방 대시보드', icon: Compass },
    { id: 'suppliers', label: '통합 도재상 리스트', icon: Building },
    { id: 'recommender', label: 'AI 맞춤 재료 진단', icon: Sparkles },
    { id: 'inventory', label: '공방 재고 실시간 관리', icon: Layers },
    { id: 'community', label: '시편 & 레시피 나눔방', icon: Coffee }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between">
      {/* Top Main Navigation Bar */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Ceramic Logo Branding */}
            <div 
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-2 cursor-pointer group"
              id="platform-logo-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-xs group-hover:rotate-6 transition-transform">
                <Flame className="w-5 h-5 fill-amber-200/30 text-white" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-stone-900 leading-none block">도예 온 (CeramicOn)</span>
                <span className="text-[10px] text-stone-500 font-medium block uppercase tracking-widest mt-0.5">도재 공급망 통합 플랫폼</span>
              </div>
            </div>

            {/* Desktop Navigation Link */}
            <nav className="hidden md:flex gap-1">
              {navItems.map(item => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-stone-100 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                    id={`nav-tab-btn-${item.id}`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Hamburger toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors"
                title="메뉴 열기"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Area */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 space-y-1">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Sticky Bottom Craft Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <span className="font-serif font-bold text-stone-800 text-sm">도예 온 (CeramicOn)</span>
            <p className="text-[11px] text-stone-400">
              © 2026 CeramicOn Co. All rights reserved. 중앙도재, 대원도재, 동영세라믹스 및 글로벌 재제조사와 직결된 통합 유통망 연구 프로젝트.
            </p>
          </div>

          <div className="flex gap-4 font-medium text-stone-400 text-[11px]">
            <span className="hover:text-amber-600 transition-colors cursor-pointer">공정 유통 강령</span>
            <span>•</span>
            <span className="hover:text-amber-600 transition-colors cursor-pointer">가마 안전 준칙</span>
            <span>•</span>
            <span className="hover:text-amber-600 transition-colors cursor-pointer">이용약관</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
