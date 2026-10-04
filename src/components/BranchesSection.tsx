import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import {
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
  Building2,
  Calendar,
  CheckCircle2,
  ZoomIn,
  X,
  Search
} from 'lucide-react';

export const BranchesSection: React.FC = () => {
  const { branches, brand } = contentData;
  const [selectedBranchStt, setSelectedBranchStt] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const filteredBranches = branches.list.filter(
    (b) =>
      b.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBranch =
    branches.list.find((b) => b.stt === selectedBranchStt) || branches.list[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#003B70] text-xs font-bold uppercase tracking-wider mb-3">
          <MapPin className="w-4 h-4 text-[#ED1C24]" />
          Mạng Lưới Chi Nhánh & Phòng Giao Dịch
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
          {branches.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {branches.subtitle}
        </p>
      </div>

      {/* Operating Hours Notice Banner */}
      <div className="bg-gradient-to-r from-[#003B70] to-[#00549A] text-white p-5 sm:p-6 rounded-3xl shadow-md border-b-4 border-[#ED1C24] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-300 uppercase tracking-wide">
              Thời Gian Giao Dịch Toàn Hệ Thống
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 font-medium mt-0.5">
              {branches.operatingHours.weekdays}
            </p>
            <p className="text-xs text-sky-200 italic mt-0.5">
              • {branches.operatingHours.weekend}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <a
            href={`tel:${brand.hotline}`}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Hotline: {brand.hotline}</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Branch List Selector (5 cols) & Detail Card (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Branch List Selector */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#003B70] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Danh Sách Điểm Giao Dịch</span>
            </h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              {branches.list.length} điểm
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên PGD hoặc địa chỉ..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:border-[#003B70] outline-none"
            />
          </div>

          {/* List */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredBranches.map((item) => {
              const isSelected = selectedBranchStt === item.stt;
              return (
                <div
                  key={item.stt}
                  onClick={() => setSelectedBranchStt(item.stt)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-[#003B70] bg-blue-50/70 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#003B70] text-white shadow'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    0{item.stt}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-bold ${
                          isSelected ? 'text-[#003B70]' : 'text-slate-800'
                        }`}
                      >
                        {item.room}
                      </h4>
                      {item.stt === 1 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          Hội sở
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {item.address}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Branch Detail Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          {/* Branch Photo */}
          <div
            onClick={() => setZoomedImage(selectedBranch.imageUrl)}
            className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 group cursor-pointer shadow-inner"
          >
            <img
              src={selectedBranch.imageUrl}
              alt={selectedBranch.room}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png';
              }}
            />
            <div className="absolute top-3 left-3 bg-[#003B70]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
              {selectedBranch.room}
            </div>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-[1px]">
              <ZoomIn className="w-5 h-5" />
              <span>Xem phóng to ảnh phòng giao dịch</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                ĐIỂM GIAO DỊCH 0{selectedBranch.stt}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#003B70] mt-1">
                {selectedBranch.room}
              </h2>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm">
              {/* Address with Google Maps link beside */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold text-slate-800">Địa chỉ:</span>
                  <p className="text-slate-700 mt-0.5">{selectedBranch.address}</p>
                </div>
              </div>

              {/* Hotline directly clickable as requested in PDF */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Hotline hỗ trợ:</span>
                  <a
                    href={`tel:${selectedBranch.phone}`}
                    className="font-extrabold text-red-600 hover:underline flex items-center gap-1 text-sm cursor-pointer"
                  >
                    <span>{selectedBranch.phone}</span>
                    <span className="text-[11px] font-normal text-slate-500">(Bấm để gọi luôn)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Actions: Google Maps Button & Direct Call Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href={selectedBranch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-[#003B70] hover:from-blue-700 hover:to-[#00274D] text-white font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-sky-300" />
                <span>Mở Google Maps Chỉ Đường</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${selectedBranch.phone}`}
                className="py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Cán Bộ Quầy ({selectedBranch.phone})</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={zoomedImage}
              alt="Ảnh phóng to chi nhánh"
              className="max-h-[82vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
