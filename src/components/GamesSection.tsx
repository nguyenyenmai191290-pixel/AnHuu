import React, { useState } from 'react';
import { FlappyVoucherGame } from './games/FlappyVoucherGame';
import { SnakeChallengeGame } from './games/SnakeChallengeGame';
import { Sparkles, Gamepad2, Gift, Fuel, Trophy, Info } from 'lucide-react';
import contentData from '../data/contentData.json';

export const GamesSection: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');
  const { games, brand } = contentData;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#ED1C24] text-xs font-bold uppercase tracking-wider mb-3">
          <Gift className="w-4 h-4 text-red-600 animate-pulse" />
          Khu Vực Giải Trí Khách Chờ Giao Dịch
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#003B70] tracking-tight">
          Chơi Vui Tại Quầy – Nhận Quà Liền Tay
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Trong lúc chờ nhân viên phục vụ, Quý khách hãy tham gia 2 mini game hấp dẫn để săn{' '}
          <strong className="text-red-600 font-bold">Voucher xăng 2 lít</strong> hoàn toàn miễn phí!
        </p>
      </div>

      {/* Game Mode Selector Tabs */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveGame('flappy')}
          className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
            activeGame === 'flappy'
              ? 'bg-[#003B70] text-white shadow-lg scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Fuel className="w-4 h-4 text-amber-400" />
          <span>Game 1: Flappy Bird</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500 text-white font-semibold">
            20 điểm
          </span>
        </button>

        <button
          onClick={() => setActiveGame('snake')}
          className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
            activeGame === 'snake'
              ? 'bg-[#003B70] text-white shadow-lg scale-105'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Game 2: Rắn Săn Mồi</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 font-bold">
            20 - 40 điểm
          </span>
        </button>
      </div>

      {/* Render Active Game */}
      <div className="py-2">
        {activeGame === 'flappy' ? <FlappyVoucherGame /> : <SnakeChallengeGame />}
      </div>

      {/* Terms & Counter Instructions */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 max-w-xl mx-auto space-y-3">
        <h4 className="text-xs font-bold text-[#003B70] uppercase tracking-wider flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          Quy định nhận thưởng tại quầy giao dịch
        </h4>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>Trò chơi chỉ mang tính chất tri ân, giải trí lành mạnh cho khách hàng VietinBank.</li>
          <li>Không thu bất kỳ khoản phí nào và không yêu cầu nhập thông tin cá nhân.</li>
          <li>
            Sau khi chiến thắng, Quý khách vui lòng chụp lại màn hình mã voucher hoặc đưa cho Giao dịch viên tại quầy để nhận quà tương ứng.
          </li>
          <li>
            Mọi thắc mắc vui lòng liên hệ Chuyên viên tư vấn{' '}
            <strong className="text-slate-800">{brand.advisor.name}</strong> ({brand.advisor.phoneFormatted}).
          </li>
        </ul>
      </div>
    </div>
  );
};
