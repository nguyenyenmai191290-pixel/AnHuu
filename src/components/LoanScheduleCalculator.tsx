import React, { useState, useMemo, useId } from 'react';
import contentData from '../data/contentData.json';
import {
  Calculator,
  Calendar,
  Percent,
  DollarSign,
  Clock,
  ChevronRight,
  Printer,
  Download,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface ScheduleRow {
  period: number;
  paymentDateStr: string;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export const LoanScheduleCalculator: React.FC = () => {
  const { loan } = contentData;
  const propertyValueId = useId();
  const loanAmountId = useId();
  const loanMonthsId = useId();
  const annualRateId = useId();
  const disbursementDateId = useId();
  const cycleSelectId = useId();
  const dueDaySelectId = useId();
  const roundingSelectId = useId();

  // Inputs
  const [propertyValue, setPropertyValue] = useState<string>('2000000000'); // 2 Tỷ VND
  const [loanAmount, setLoanAmount] = useState<string>('1000000000'); // 1 Tỷ VND (NO slider, text input only as requested)
  const [loanMonths, setLoanMonths] = useState<string>('120'); // 120 months (10 years)
  const [annualRate, setAnnualRate] = useState<string>('8.5'); // 8.5% / year
  const [disbursementDate, setDisbursementDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [cycleId, setCycleId] = useState<string>('monthly'); // monthly, quarterly, biannual, annual
  const [dueDay, setDueDay] = useState<number>(25); // Day 25th of month as specified in PDF example
  const [roundingRule, setRoundingRule] = useState<'1' | '1000'>('1'); // '1' or '1000'

  // Modal detail schedule state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Formatting helpers
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      maximumFractionDigits: 0
    }).format(val) + ' VND';
  };

  // Parsing values
  const numLoanAmount = parseFloat(loanAmount.replace(/[^0-9]/g, '')) || 0;
  const numMonths = parseInt(loanMonths, 10) || 12;
  const numRate = parseFloat(annualRate) || 0;

  // Selected cycle parameters
  const currentCycle = loan.cycles.find((c) => c.id === cycleId) || loan.cycles[0];
  const stepMonths = currentCycle.stepMonths;
  const totalPeriods = Math.max(1, Math.ceil(numMonths / stepMonths));
  const periodicRate = (numRate / 100) / currentCycle.divisor;

  // Rounding function
  const roundMoney = (num: number, rule: '1' | '1000') => {
    if (rule === '1000') {
      return Math.round(num / 1000) * 1000;
    }
    return Math.round(num);
  };

  // Generate date based on disbursement date, step months, and chosen due day
  // Example from PDF: Ngày giải ngân: 10/01/2026, Chu kỳ: hàng tháng, Ngày trả: 25 -> 25/02/2026, 25/03/2026...
  const calculatePaymentDate = (disbDateStr: string, periodIndex: number, step: number, targetDueDay: number) => {
    const base = new Date(disbDateStr);
    const targetMonth = base.getMonth() + periodIndex * step;
    const year = base.getFullYear() + Math.floor(targetMonth / 12);
    const month = targetMonth % 12;

    // Check last day of month to prevent overflow
    const maxDays = new Date(year, month + 1, 0).getDate();
    const actualDay = Math.min(targetDueDay, maxDays);
    const dateObj = new Date(year, month, actualDay);

    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
  };

  // Compute full amortized schedule
  const scheduleData = useMemo<ScheduleRow[]>(() => {
    if (numLoanAmount <= 0 || totalPeriods <= 0) return [];

    const basePrincipalPerPeriod = roundMoney(numLoanAmount / totalPeriods, roundingRule);
    let remainingPrincipal = numLoanAmount;
    const rows: ScheduleRow[] = [];

    for (let i = 1; i <= totalPeriods; i++) {
      const openingBalance = remainingPrincipal;
      let principalThisPeriod = basePrincipalPerPeriod;
      let interestThisPeriod = roundMoney(openingBalance * periodicRate, roundingRule);

      // Final period: adjust rounding discrepancies so remaining principal is exactly 0
      if (i === totalPeriods) {
        principalThisPeriod = openingBalance;
      }

      const totalPayment = principalThisPeriod + interestThisPeriod;
      const closingBalance = Math.max(0, openingBalance - principalThisPeriod);

      const paymentDateStr = calculatePaymentDate(disbursementDate, i, stepMonths, dueDay);

      rows.push({
        period: i,
        paymentDateStr,
        openingBalance,
        principal: principalThisPeriod,
        interest: interestThisPeriod,
        totalPayment,
        closingBalance
      });

      remainingPrincipal = closingBalance;
    }

    return rows;
  }, [numLoanAmount, totalPeriods, periodicRate, disbursementDate, stepMonths, dueDay, roundingRule]);

  // Totals
  const totalPrincipalPaid = scheduleData.reduce((acc, row) => acc + row.principal, 0);
  const totalInterestPaid = scheduleData.reduce((acc, row) => acc + row.interest, 0);
  const totalPaid = totalPrincipalPaid + totalInterestPaid;

  const firstPeriodPayment = scheduleData.length > 0 ? scheduleData[0].totalPayment : 0;
  const lastPeriodPayment = scheduleData.length > 0 ? scheduleData[scheduleData.length - 1].totalPayment : 0;

  // Export CSV
  const exportCSV = () => {
    const headers = ['STT', 'Kỳ trả nợ', 'Số gốc còn lại (VND)', 'Gốc (VND)', 'Lãi (VND)', 'Tổng gốc + Lãi (VND)'];
    const rows = scheduleData.map((r) => [
      r.period,
      r.paymentDateStr,
      r.openingBalance,
      r.principal,
      r.interest,
      r.totalPayment
    ]);
    rows.push(['TỔNG', '', totalPrincipalPaid, totalInterestPaid, totalPaid, '']);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lich_tra_no_VietinBank_${disbursementDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#003B70] text-xs font-bold uppercase tracking-wider mb-3">
          <Calculator className="w-4 h-4 text-[#ED1C24]" />
          Lập Kế Hoạch Tài Chính Khoản Vay
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
          {loan.title}
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          {loan.subtitle} (Phương thức chuẩn phổ biến trong hệ thống ngân hàng)
        </p>
      </div>

      {/* Grid: Inputs Form & Summary Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step 1: Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                Bước 1
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Nhập thông tin khoản vay
              </h2>
            </div>
            <span className="text-xs text-slate-500 italic">
              * Dạng nhập số trực tiếp (không kéo thả)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Property / Collateral Value */}
            <div className="space-y-1.5">
              <label htmlFor={propertyValueId} className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Giá trị tài sản bảo đảm</span>
                <span className="text-slate-400 font-normal">Tùy chọn</span>
              </label>
              <div className="relative">
                <input
                  id={propertyValueId}
                  type="text"
                  value={propertyValue ? Number(propertyValue.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                  onChange={(e) => setPropertyValue(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Ví dụ: 2,000,000,000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">VND</span>
              </div>
            </div>

            {/* Loan Amount (Text Input Only, strictly no slider as requested in Step 1) */}
            <div className="space-y-1.5">
              <label htmlFor={loanAmountId} className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="text-[#003B70] font-extrabold">Số tiền vay (VND) *</span>
                <span className="text-[11px] text-red-500 font-bold">Bắt buộc</span>
              </label>
              <div className="relative">
                <input
                  id={loanAmountId}
                  type="text"
                  value={loanAmount ? Number(loanAmount.replace(/[^0-9]/g, '')).toLocaleString('vi-VN') : ''}
                  onChange={(e) => setLoanAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Ví dụ: 1,000,000,000"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-300 focus:border-[#003B70] font-bold text-sm outline-none pr-12 text-[#003B70] bg-blue-50/20"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">VND</span>
              </div>
            </div>

            {/* Duration (Months) */}
            <div className="space-y-1.5">
              <label htmlFor={loanMonthsId} className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Thời gian vay (Tháng) *</span>
                <span className="text-slate-500 text-[11px]">({Math.round(numMonths / 12 * 10) / 10} năm)</span>
              </label>
              <input
                id={loanMonthsId}
                type="number"
                min="1"
                max="360"
                value={loanMonths}
                onChange={(e) => setLoanMonths(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none"
              />
            </div>

            {/* Annual Rate (%) */}
            <div className="space-y-1.5">
              <label htmlFor={annualRateId} className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Lãi suất năm (%/năm) *</span>
                <span className="text-slate-500 text-[11px]">Kỳ: {(numRate / currentCycle.divisor).toFixed(2)}%</span>
              </label>
              <div className="relative">
                <input
                  id={annualRateId}
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%/năm</span>
              </div>
            </div>

            {/* Disbursement Date */}
            <div className="space-y-1.5">
              <label htmlFor={disbursementDateId} className="text-xs font-bold text-slate-700">
                Ngày giải ngân *
              </label>
              <input
                id={disbursementDateId}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none"
              />
            </div>

            {/* Repayment Cycle */}
            <div className="space-y-1.5">
              <label htmlFor={cycleSelectId} className="text-xs font-bold text-slate-700">
                Chu kỳ trả nợ *
              </label>
              <select
                id={cycleSelectId}
                value={cycleId}
                onChange={(e) => setCycleId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none cursor-pointer"
              >
                {loan.cycles.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Periodic Due Day in Month (e.g. Day 25) */}
            <div className="space-y-1.5">
              <label htmlFor={dueDaySelectId} className="text-xs font-bold text-slate-700">
                Ngày trả nợ định kỳ hằng tháng *
              </label>
              <select
                id={dueDaySelectId}
                value={dueDay}
                onChange={(e) => setDueDay(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none cursor-pointer"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Ngày {d} hằng tháng
                  </option>
                ))}
              </select>
            </div>

            {/* Rounding Rule as specified in PDF 2.3 */}
            <div className="space-y-1.5">
              <label htmlFor={roundingSelectId} className="text-xs font-bold text-slate-700">
                Quy tắc làm tròn *
              </label>
              <select
                id={roundingSelectId}
                value={roundingRule}
                onChange={(e) => setRoundingRule(e.target.value as '1' | '1000')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#003B70] font-semibold text-sm outline-none cursor-pointer"
              >
                <option value="1">Làm tròn đến đơn vị đồng</option>
                <option value="1000">Làm tròn đến 1.000 đồng</option>
              </select>
            </div>
          </div>

          {/* Business rules badge note */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-[#003B70] block">Quy tắc nghiệp vụ ngân hàng:</span>
            <p>• Dư nợ cuối kỳ = Dư nợ đầu kỳ - Gốc đã trả trong kỳ.</p>
            <p>• Sai lệch do làm tròn được tự động điều chỉnh vào kỳ trả nợ cuối cùng.</p>
          </div>
        </div>

        {/* Summary Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#003B70] via-[#004887] to-[#002B52] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-900 space-y-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Tóm Tắt Khoản Vay
              </span>
              <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-sky-200">
                {totalPeriods} kỳ trả nợ
              </span>
            </div>

            {/* Payment range: first period down to last period */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-sky-200">
                <TrendingDown className="w-4 h-4 text-amber-400" />
                <span>Số tiền trả hằng tháng (Giảm dần):</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-amber-300">
                  {formatMoney(firstPeriodPayment)}
                </span>
                <span className="text-xs text-sky-200">đến</span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {formatMoney(lastPeriodPayment)}
                </span>
              </div>
              <p className="text-[11px] text-sky-200">
                * Kỳ 1 trả cao nhất, sau đó số tiền giảm dần theo từng kỳ.
              </p>
            </div>

            {/* Total Interest & Total Repayment */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-2.5 text-xs">
              <div className="flex justify-between text-sky-100">
                <span>Số tiền gốc vay:</span>
                <span className="font-bold text-white">{formatMoney(numLoanAmount)}</span>
              </div>
              <div className="flex justify-between text-sky-100">
                <span>Tổng lãi phải trả:</span>
                <span className="font-extrabold text-amber-300">{formatMoney(totalInterestPaid)}</span>
              </div>
              <div className="pt-2 border-t border-white/20 flex justify-between items-center text-sm font-extrabold text-white">
                <span>Tổng tiền gốc + lãi:</span>
                <span className="text-base text-emerald-300 font-black">{formatMoney(totalPaid)}</span>
              </div>
            </div>

            {/* STEP 2: Button "Xem chi tiết" as specified in PDF */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Xem Chi Tiết Lịch Trả Nợ</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* STEP 2: MODAL BẢNG TÍNH LỊCH TRẢ NỢ VỚI DƯ NỢ GIẢM DẦN */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-[#003B70] text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Bảng Tính Lịch Trả Nợ Với Dư Nợ Giảm Dần
                </h3>
                <p className="text-xs text-sky-200 mt-0.5">
                  Số tiền vay: {formatMoney(numLoanAmount)} | Thời gian: {numMonths} tháng | Lãi suất: {numRate}%/năm
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Xuất file CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xuất CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="In bảng tính"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">In phiếu</span>
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="flex-1 overflow-auto p-4 sm:p-6">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-[#003B70] font-bold border-b border-slate-300 sticky top-0">
                    <th className="p-3 text-center w-12">STT</th>
                    <th className="p-3">KỲ TRẢ NỢ</th>
                    <th className="p-3 text-right">SỐ GỐC CÒN LẠI</th>
                    <th className="p-3 text-right">GỐC</th>
                    <th className="p-3 text-right">LÃI</th>
                    <th className="p-3 text-right">TỔNG GỐC + LÃI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {/* Row 0: Disbursement Date & Starting balance as shown in OCR page 1 */}
                  <tr className="bg-blue-50/50 text-slate-700">
                    <td className="p-3 text-center font-bold">0</td>
                    <td className="p-3 font-semibold">
                      {calculatePaymentDate(disbursementDate, 0, 0, new Date(disbursementDate).getDate())} (Giải ngân)
                    </td>
                    <td className="p-3 text-right font-bold text-[#003B70]">
                      {new Intl.NumberFormat('vi-VN').format(numLoanAmount)}
                    </td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right">-</td>
                  </tr>

                  {/* Periodic Rows */}
                  {scheduleData.map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center font-semibold text-slate-500">{row.period}</td>
                      <td className="p-3 text-slate-800">{row.paymentDateStr}</td>
                      <td className="p-3 text-right text-slate-700">
                        {new Intl.NumberFormat('vi-VN').format(row.openingBalance)}
                      </td>
                      <td className="p-3 text-right text-slate-900 font-medium">
                        {new Intl.NumberFormat('vi-VN').format(row.principal)}
                      </td>
                      <td className="p-3 text-right text-amber-700 font-medium">
                        {new Intl.NumberFormat('vi-VN').format(row.interest)}
                      </td>
                      <td className="p-3 text-right text-[#003B70] font-bold">
                        {new Intl.NumberFormat('vi-VN').format(row.totalPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer Total Row */}
                <tfoot>
                  <tr className="bg-[#003B70] text-white font-extrabold sticky bottom-0 text-xs sm:text-sm">
                    <td colSpan={2} className="p-3 text-center uppercase tracking-wider">
                      TỔNG CỘNG
                    </td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right text-sky-200">
                      {new Intl.NumberFormat('vi-VN').format(totalPrincipalPaid)}
                    </td>
                    <td className="p-3 text-right text-amber-300">
                      {new Intl.NumberFormat('vi-VN').format(totalInterestPaid)}
                    </td>
                    <td className="p-3 text-right text-emerald-300 text-sm sm:text-base">
                      {new Intl.NumberFormat('vi-VN').format(totalPaid)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
              <span>* Bảng tính mang tính tham khảo theo đúng biểu mẫu VietinBank</span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#003B70] text-white font-bold hover:bg-[#00274D] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
