import React, { useState, useId } from 'react';
import contentData from '../data/contentData.json';
import {
  PiggyBank,
  TrendingUp,
  DollarSign,
  Calendar,
  Percent,
  Play,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const SavingsCalculator: React.FC = () => {
  const { savings } = contentData;
  const amountInputId = useId();
  const termSelectId = useId();
  const rateInputId = useId();

  // Inputs
  const [depositAmount, setDepositAmount] = useState<string>('100000000'); // 100,000,000 VND default
  const [selectedTermMonths, setSelectedTermMonths] = useState<number>(12);
  const [interestRate, setInterestRate] = useState<string>('4.8'); // 4.8% default for 12 months

  // Validation errors
  const [amountError, setAmountError] = useState<string | null>(null);
  const [termError, setTermError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  // Formatting helpers
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric digits
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmount(rawVal);

    const num = Number(rawVal);
    if (!rawVal || isNaN(num) || num <= 0) {
      setAmountError(savings.validationErrors.amount);
    } else {
      setAmountError(null);
    }
  };

  const handleTermChange = (months: number, rate: number) => {
    setSelectedTermMonths(months);
    setInterestRate(rate.toString());
    setTermError(null);
    setRateError(null);
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInterestRate(val);
    const num = parseFloat(val);
    if (val === '' || isNaN(num) || num < 0 || num > 25) {
      setRateError(savings.validationErrors.rate);
    } else {
      setRateError(null);
    }
  };

  // Calculations
  const numericAmount = parseFloat(depositAmount) || 0;
  const numericRate = parseFloat(interestRate) || 0;
  const isInputValid =
    numericAmount > 0 && selectedTermMonths > 0 && numericRate >= 0 && !amountError && !rateError;

  // Formula: Lãi = Số tiền gửi * (Lãi suất / 100) * (Số tháng gửi / 12)
  const estimatedInterest = isInputValid
    ? Math.round(numericAmount * (numericRate / 100) * (selectedTermMonths / 12))
    : 0;

  const totalMaturity = numericAmount + estimatedInterest;

  // Preset amounts
  const presetAmounts = [
    { label: '20 Triệu', value: '20000000' },
    { label: '50 Triệu', value: '50000000' },
    { label: '100 Triệu', value: '100000000' },
    { label: '500 Triệu', value: '500000000' },
    { label: '1 Tỷ', value: '1000000000' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
          <PiggyBank className="w-4 h-4 text-emerald-600" />
          Tiết Kiệm Sinh Lời An Toàn
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
          Tính Lãi Tiền Gửi Tiết Kiệm
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {savings.title}
        </p>
      </div>

      {/* Main Grid: Form Inputs vs Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
            <span>Thông Tin Khoản Tiền Gửi</span>
            <span className="text-xs font-normal text-slate-500">Trả lãi cuối kỳ</span>
          </h2>

          {/* 1. Deposit Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={amountInputId} className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Tiền gửi dự tính (VNĐ) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-[#003B70] font-semibold">
                {numericAmount > 0 ? formatVND(numericAmount) : '0 VNĐ'}
              </span>
            </div>

            <div className="relative">
              <input
                id={amountInputId}
                type="text"
                value={depositAmount ? Number(depositAmount).toLocaleString('vi-VN') : ''}
                onChange={handleAmountChange}
                placeholder="Ví dụ: 100,000,000"
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-base font-bold text-slate-900 outline-none transition-all pr-14 ${
                  amountError
                    ? 'border-red-500 bg-red-50 focus:border-red-600'
                    : 'border-slate-200 focus:border-[#003B70] bg-white'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">
                VNĐ
              </span>
            </div>

            {amountError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {amountError}
              </p>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-500 font-medium">Chọn nhanh:</span>
              {presetAmounts.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setDepositAmount(p.value);
                    setAmountError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Term Selection */}
          <div className="space-y-2">
            <label htmlFor={termSelectId} className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span>
            </label>

            <select
              id={termSelectId}
              value={selectedTermMonths}
              onChange={(e) => {
                const months = parseInt(e.target.value, 10);
                const matched = savings.rateOptions.find((o) => o.months === months);
                handleTermChange(months, matched ? matched.rate : 4.5);
              }}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-[#003B70] bg-white text-base font-semibold text-slate-900 outline-none cursor-pointer"
            >
              {savings.rateOptions.map((opt) => (
                <option key={opt.months} value={opt.months}>
                  {opt.label}
                </option>
              ))}
            </select>

            {termError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {termError}
              </p>
            )}
          </div>

          {/* 3. Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={rateInputId} className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-500" />
                Lãi suất (% / năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                (Được tự động áp theo biểu phí hiện hành)
              </span>
            </div>

            <div className="relative">
              <input
                id={rateInputId}
                type="number"
                step="0.05"
                min="0"
                max="25"
                value={interestRate}
                onChange={handleRateChange}
                placeholder="Ví dụ: 4.8"
                className={`w-full px-4 py-3.5 rounded-xl border-2 text-base font-bold text-slate-900 outline-none transition-all pr-14 ${
                  rateError
                    ? 'border-red-500 bg-red-50 focus:border-red-600'
                    : 'border-slate-200 focus:border-[#003B70] bg-white'
                }`}
              />
              <span className="absolute right-4 top-3.5 text-sm font-bold text-slate-400">
                %/năm
              </span>
            </div>

            {rateError && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {rateError}
              </p>
            )}
          </div>
        </div>

        {/* Right Dashboard: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Results */}
          <div className="bg-gradient-to-br from-[#003B70] via-[#004887] to-[#00274D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-900 space-y-6">
            <div className="flex items-center justify-between border-b border-blue-500/40 pb-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Kết Quả Ước Tính Lãi Suất
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-sky-200 font-semibold">
                Kỳ hạn: {selectedTermMonths} tháng
              </span>
            </div>

            {/* Interest Result Highlight */}
            <div className="space-y-1">
              <span className="text-xs text-sky-200 font-medium">Tiền lãi dự tính nhận được:</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                {formatVND(estimatedInterest)}
              </div>
            </div>

            {/* Total Balance at Maturity */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-2">
              <div className="flex justify-between text-xs text-sky-100">
                <span>Tiền gửi gốc:</span>
                <span className="font-bold">{formatVND(numericAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-sky-100">
                <span>Lãi suất áp dụng:</span>
                <span className="font-bold text-amber-300">{numericRate}% / năm</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex justify-between items-center text-sm font-bold text-white">
                <span>Tổng tiền khi đáo hạn:</span>
                <span className="text-base text-emerald-300 font-extrabold">
                  {formatVND(totalMaturity)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-sky-200 italic space-y-1 leading-relaxed">
              <p>* Công thức tính: Lãi = Số tiền × Lãi suất (%/năm) × Số tháng / 12.</p>
              <p>* Bảng tính mang tính tham khảo. Tiền lãi thực tế căn cứ vào ngày gửi thực tế.</p>
            </div>
          </div>

          {/* TikTok Video Tutorial Card as specified in PDF */}
          {savings.videoUrl && (
            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 shadow">
                  <Play className="w-6 h-6 fill-current text-white ml-0.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Video Hướng Dẫn Gửi Tiết Kiệm
                  </h4>
                  <p className="text-xs text-slate-500">
                    Xem clip hướng dẫn chi tiết trên TikTok
                  </p>
                </div>
              </div>

              <a
                href={savings.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Xem ngay</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
