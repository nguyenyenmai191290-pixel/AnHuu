import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { FaqSection } from './components/FaqSection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { GamesSection } from './components/GamesSection';
import { SavingsCalculator } from './components/SavingsCalculator';
import { LoanScheduleCalculator } from './components/LoanScheduleCalculator';
import { ProductsSection } from './components/ProductsSection';
import { BranchesSection } from './components/BranchesSection';
import { Footer } from './components/Footer';
import contentData from './data/contentData.json';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldAlert,
  PhoneCall
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('faq');
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const { navigation, brand } = contentData;

  // GSAP transition when changing tabs
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    // Scroll to top of content on tab switch
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'faq':
        return <FaqSection onBackToMenu={() => setActiveTab('faq')} />;
      case 'download-app':
        return <AppDownloadSection />;
      case 'games':
        return <GamesSection />;
      case 'savings':
        return <SavingsCalculator />;
      case 'loan':
        return <LoanScheduleCalculator />;
      case 'products':
        return <ProductsSection />;
      case 'branches':
        return <BranchesSection />;
      default:
        return <FaqSection />;
    }
  };

  const getNavIcon = (icon: string) => {
    switch (icon) {
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-amber-500" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-blue-500" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-red-500" />;
      case 'PiggyBank':
        return <PiggyBank className="w-5 h-5 text-emerald-500" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-purple-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-rose-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Quick Navigation Strip for Counter Tablet / Kiosk */}
      <section className="bg-gradient-to-b from-[#003B70] via-[#004887] to-slate-100 pt-6 pb-10 px-4 text-white">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-sm">
                <span>Trợ lý số tại quầy giao dịch</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">CN Tây Tiền Giang</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mt-2 text-white">
                Chào mừng Quý khách đến với VietinBank
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-2xl">
                Khám phá 7 tiện ích tương tác nhanh chóng: Giải đáp thắc mắc, Game giải trí săn voucher xăng, công cụ tính tiền gửi & khoản vay, cùng thông tin chi nhánh.
              </p>
            </div>

            {/* Quick Emergency / Hotline Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="text-left text-xs">
                <span className="text-sky-200 block">Cán bộ hỗ trợ quầy:</span>
                <a
                  href={`tel:${brand.advisor.phone}`}
                  className="font-extrabold text-white hover:text-amber-300 transition-colors text-sm"
                >
                  {brand.advisor.name} ({brand.advisor.phoneFormatted})
                </a>
              </div>
            </div>
          </div>

          {/* Quick 7 Tiles Navigator Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#003B70] shadow-xl border-amber-400 scale-102 ring-2 ring-amber-400'
                      : 'bg-white/15 hover:bg-white/25 text-white border-white/15 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-50' : 'bg-black/20'}`}>
                      {getNavIcon(item.icon)}
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-400/90 text-slate-900'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold leading-tight ${isActive ? 'text-[#003B70]' : 'text-white'}`}>
                      {item.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Dynamic Workspace Section */}
      <main ref={mainContentRef} className="flex-1 -mt-4">
        {renderActiveSection()}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
