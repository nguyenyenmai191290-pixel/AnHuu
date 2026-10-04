import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import {
  Sparkles,
  Star,
  Gift,
  Phone,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  SlidersHorizontal,
  ZoomIn
} from 'lucide-react';

export const ProductsSection: React.FC = () => {
  const { products, brand } = contentData;
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [inquiryProduct, setInquiryProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredItems = selectedCategory === 'Tất cả'
    ? products.items
    : products.items.filter((item) => item.category === selectedCategory);

  const handleInterestClick = (productName: string) => {
    setInquiryProduct(productName);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Featured Header Card as defined in PDF */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-sky-50 to-red-50/40 p-6 sm:p-8 border-2 border-red-200 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-extrabold shadow-sm uppercase tracking-wider">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Nổi bật</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003B70] tracking-tight">
              {products.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
              {products.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow flex items-center justify-center text-[#ED1C24]">
              <Gift className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {products.categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCarouselIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#003B70] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-[#003B70] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dạng lưới"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Dạng lưới</span>
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'carousel' ? 'bg-white text-[#003B70] shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Dạng Carousel"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Dạng trượt</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-[#003B70] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Poster Image Container */}
              <div
                onClick={() => setPreviewImage(item.imageUrl)}
                className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://raw.githubusercontent.com/giadinhbanker/anh-super-app-bac-phu-tho/main/Logo%20VietinBank.png';
                  }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold">
                    {item.category}
                  </span>
                  {item.highlight && (
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      HOT
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-[1px]">
                  <ZoomIn className="w-4 h-4" />
                  <span>Bấm xem ảnh lớn</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#003B70] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Button "Tôi quan tâm" as specified in PDF */}
                <button
                  onClick={() => handleInterestClick(item.name)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#003B70] to-[#00549A] hover:from-[#00274D] hover:to-[#003B70] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Carousel View as specified in PDF ("Nên dùng chế độ hiển thị Poster dạng carousel để hấp dẫn hơn") */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative max-w-xl mx-auto bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#003B70] uppercase">
              {filteredItems[carouselIndex].category} ({carouselIndex + 1}/{filteredItems.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            onClick={() => setPreviewImage(filteredItems[carouselIndex].imageUrl)}
            className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 relative cursor-pointer group"
          >
            <img
              src={filteredItems[carouselIndex].imageUrl}
              alt={filteredItems[carouselIndex].name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
              <ZoomIn className="w-4 h-4" />
              <span>Xem phóng to</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#003B70]">
              {filteredItems[carouselIndex].name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {filteredItems[carouselIndex].description}
            </p>
          </div>

          <button
            onClick={() => handleInterestClick(filteredItems[carouselIndex].name)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Tôi quan tâm sản phẩm này</span>
          </button>
        </div>
      )}

      {/* Inquiry Dialog Modal as specified in PDF:
          "Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
          Hoặc liên hệ Chuyên viên tư vấn Lê Hoàng Hiệp - 0907800525." */}
      {inquiryProduct && (
        <div
          onClick={() => setInquiryProduct(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#003B70] space-y-5 text-center relative"
          >
            <button
              onClick={() => setInquiryProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {inquiryProduct}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-[#003B70]">
                Tiếp Nhận Nhu Cầu Thành Công
              </h4>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-800 text-sm leading-relaxed text-left space-y-2">
              <p>
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <p className="font-semibold text-[#003B70]">
                Hoặc liên hệ Chuyên viên tư vấn {brand.advisor.name} - {brand.advisor.phoneFormatted}.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`tel:${brand.advisor.phone}`}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi {brand.advisor.phoneFormatted}</span>
              </a>
              <button
                onClick={() => setInquiryProduct(null)}
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="Ảnh phóng to"
              className="max-h-[82vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
