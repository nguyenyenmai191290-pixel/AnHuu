import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, Clock, ShieldCheck, ChevronRight, Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { brand, navigation } = contentData;

  return (
    <header className="sticky top-0 z-50 bg-[#003B70] text-white shadow-md border-b-2 border-[#ED1C24]">
      {/* Top micro-bar */}
      <div className="bg-[#00274D] px-4 py-1.5 text-xs text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Kiosk Giao Dịch Khách Hàng VietinBank
            </span>
            <span className="hidden sm:inline-block text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              Giờ GD: 07:30 - 11:30 | 13:30 - 16:30 (T2 - T6)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 hidden sm:inline">Hỗ trợ tại quầy:</span>
            <a
              href={`tel:${brand.advisor.phone}`}
              className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-red-400" />
              {brand.advisor.name} ({brand.advisor.phoneFormatted})
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src={brand.logoUrl}
                alt="VietinBank Logo"
                className="h-8 md:h-10 object-contain"
                onError={(e) => {
                  // Fallback logo if github image has network issue
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[#003B70] font-extrabold text-lg md:text-xl tracking-tight ml-1">
                VietinBank
              </span>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                CN Tây Tiền Giang
              </p>
              <p className="text-[11px] text-sky-200">{brand.slogan}</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#003B70] shadow-md font-bold'
                      : 'text-slate-100 hover:bg-[#00549A] hover:text-white'
                  }`}
                >
                  {item.id === 'games' && (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  )}
                  <span>{item.title}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#ED1C24] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Action / Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('games')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Săn Voucher 2L Xăng
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-[#00549A] hover:bg-[#0066bd] text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Horizontal Secondary Bar for Tablet/Medium */}
      <div className="bg-[#002F59] border-t border-[#004887] px-3 py-2 overflow-x-auto xl:hidden flex items-center gap-2 scrollbar-none">
        {navigation.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-amber-400 text-slate-900 font-bold shadow'
                  : 'bg-[#004380] text-slate-200 hover:bg-[#00529C]'
              }`}
            >
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#00274D] border-t border-[#004887] px-4 py-4 space-y-2 animate-fadeIn">
          {navigation.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#00549A] text-white font-bold border-l-4 border-[#ED1C24]'
                    : 'text-slate-200 hover:bg-[#003B70]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span className="text-[10px] bg-red-600/80 text-white px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.description}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
