import React, { useState } from 'react';
import contentData from '../data/contentData.json';
import {
  Smartphone,
  Apple,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  CreditCard,
  QrCode,
  CheckCircle,
  Copy
} from 'lucide-react';

export const AppDownloadSection: React.FC = () => {
  const { appDownload } = contentData;
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (url: string, type: string) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-emerald-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-blue-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-purple-600" />;
    }
  };

  // High quality QR code generators via QR API with fallback SVG patterns
  const iosQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    appDownload.iosUrl
  )}&margin=10`;
  const androidQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    appDownload.androidUrl
  )}&margin=10`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#003B70] text-xs font-bold uppercase tracking-wider mb-3">
          <Smartphone className="w-4 h-4 text-[#ED1C24]" />
          Ngân Hàng Số VietinBank iPay Mobile
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
          {appDownload.title}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          {appDownload.subtitle}
        </p>
      </div>

      {/* 2 Download Options: iPhone and Android */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* iOS Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#003B70] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow">
                  <Apple className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Apple App Store</h3>
                  <p className="text-xs text-slate-500 font-medium">Dành cho iPhone & iPad</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                iOS 13.0+
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200">
                <img
                  src={iosQrUrl}
                  alt="QR Code Tải VietinBank iPay iOS"
                  className="w-44 h-44 object-contain"
                  onError={(e) => {
                    // Fallback to QR placeholder
                    (e.target as HTMLImageElement).src =
                      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://apps.apple.com/vn/app/vietinbank-ipay/id689963454';
                  }}
                />
              </div>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-blue-600" />
                Mở camera điện thoại quét để tải ngay
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={appDownload.iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Apple className="w-4 h-4" />
              <span>Mở Trên App Store</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              onClick={() => handleCopy(appDownload.iosUrl, 'ios')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedType === 'ios' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Đã sao chép link App Store!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép liên kết tải iPhone</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Android Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 hover:border-[#003B70] shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00875A] text-white flex items-center justify-center shadow">
                  <Download className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Google Play Store</h3>
                  <p className="text-xs text-slate-500 font-medium">Dành cho điện thoại Android</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                Android 7.0+
              </span>
            </div>

            {/* QR Code */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-inner border border-slate-200">
                <img
                  src={androidQrUrl}
                  alt="QR Code Tải VietinBank iPay Android"
                  className="w-44 h-44 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://play.google.com/store/apps/details?id=com.vietinbank.ipay';
                  }}
                />
              </div>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                Mở camera hoặc Zalo quét để tải ngay
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={appDownload.androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#00875A] hover:bg-[#00704a] text-white font-bold text-sm shadow flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Mở Trên Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <button
              onClick={() => handleCopy(appDownload.androidUrl, 'android')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedType === 'android' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Đã sao chép link Google Play!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép liên kết tải Android</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature highlights grid */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-[#003B70] text-center">
          Đặc Quyền Tiện Ích Trên Ứng Dụng VietinBank iPay
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {appDownload.features.map((feat, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 w-fit">
                {getFeatureIcon(feat.icon)}
              </div>
              <h4 className="font-bold text-sm text-slate-900">{feat.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
