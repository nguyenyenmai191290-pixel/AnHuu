import React from 'react';
import contentData from '../data/contentData.json';
import { Phone, Clock, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { brand, navigation } = contentData;

  return (
    <footer className="bg-[#00274D] text-slate-300 border-t-4 border-[#003B70] mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg w-fit">
              <img
                src={brand.logoUrl}
                alt="VietinBank"
                className="h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-[#003B70] font-extrabold text-base">VietinBank</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {brand.fullName} – Chi nhánh Tây Tiền Giang. Đồng hành mang đến dịch vụ tài chính hiện đại và trải nghiệm số vượt trội tại quầy.
            </p>
            <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>An toàn • Minh bạch • Chu đáo</span>
            </div>
          </div>

          {/* Col 2: Quick Features Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              7 Tiện Ích Tại Quầy
            </h4>
            <ul className="space-y-2 text-xs">
              {navigation.map((nav) => (
                <li key={nav.id}>
                  <button
                    onClick={() => setActiveTab(nav.id)}
                    className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{nav.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Counter Advisor Lê Hoàng Hiệp */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              Cán Bộ Hỗ Trợ Trực Tiếp
            </h4>
            <div className="bg-[#003666] p-4 rounded-2xl border border-sky-900/60 space-y-2 text-xs">
              <p className="text-white font-bold text-sm">{brand.advisor.name}</p>
              <p className="text-sky-200">{brand.advisor.title}</p>
              <a
                href={`tel:${brand.advisor.phone}`}
                className="inline-flex items-center gap-1.5 text-amber-300 font-extrabold hover:text-white transition-colors pt-1"
              >
                <Phone className="w-3.5 h-3.5 text-red-400" />
                <span>Hotline: {brand.advisor.phoneFormatted}</span>
              </a>
              <p className="text-[11px] text-slate-400 italic">
                * Quý khách có thể gọi trực tiếp hoặc gặp tại quầy số 01.
              </p>
            </div>
          </div>

          {/* Col 4: Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2">
              Giờ Phục Vụ
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold">Thứ 2 đến Thứ 6:</p>
                  <p className="text-slate-300">Sáng: 07:30 – 11:30</p>
                  <p className="text-slate-300">Chiều: 13:30 – 16:30</p>
                </div>
              </div>
              <div className="text-slate-400 pt-1">
                <p>• Thứ 7, Chủ nhật & Ngày lễ: Nghỉ giao dịch</p>
                <p>• Ngân hàng số VietinBank iPay hoạt động 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} VietinBank – CN Tây Tiền Giang. Bảo lưu mọi quyền.</span>
          <span className="flex items-center gap-1 text-[11px]">
            Phát triển phục vụ khách hàng giao dịch tại quầy VietinBank
          </span>
        </div>
      </div>
    </footer>
  );
};
