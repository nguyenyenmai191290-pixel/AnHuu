import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Copy,
  CheckCircle,
  Play,
  Fuel,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Clock,
  Gift
} from 'lucide-react';
import contentData from '../../data/contentData.json';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 18; // 18x18 tiles
const SPEED_MS = 140; // Friendly, moderate speed for counter customers of all ages

export const SnakeChallengeGame: React.FC = () => {
  const { games, brand } = contentData;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'running' | 'over'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_snake_high_score') || '0', 10);
  });
  const [highestTierReached, setHighestTierReached] = useState<0 | 1 | 2>(0);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [finishedTime, setFinishedTime] = useState<string>('');
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Snake mutable state
  const snakeRef = useRef<Point[]>([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 }
  ]);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<Point>({ x: 13, y: 9 });
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateVoucherCode = (tier: number): string => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `VB-SNAKE${tier === 2 ? '40' : '20'}-${randomNum}`;
  };

  const spawnFood = (snake: Point[]): Point => {
    let newFood: Point;
    let collisionWithSnake = true;
    while (collisionWithSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      collisionWithSnake = snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    }
    return newFood!;
  };

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  const handleGameOver = useCallback((finalScore: number, tier: 0 | 1 | 2) => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = null;
    }
    setGameState('over');
    setFinishedTime(new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'));

    if (tier > 0) {
      const code = generateVoucherCode(tier);
      setVoucherCode(code);
      confetti({
        particleCount: 100,
        spread: 60,
        colors: ['#003B70', '#ED1C24', '#F59E0B']
      });
    }

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_snake_high_score', finalScore.toString());
    }
  }, [highScore]);

  const changeDirection = (newDir: Direction) => {
    const current = directionRef.current;
    if (newDir === 'UP' && current !== 'DOWN') nextDirectionRef.current = 'UP';
    if (newDir === 'DOWN' && current !== 'UP') nextDirectionRef.current = 'DOWN';
    if (newDir === 'LEFT' && current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
  };

  const resetGame = () => {
    snakeRef.current = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 }
    ];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    foodRef.current = { x: 13, y: 9 };
    setScore(0);
    setHighestTierReached(0);
    setToastNotification(null);
    setVoucherCode('');
  };

  const startGame = () => {
    resetGame();
    setGameState('running');
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        changeDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        changeDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        changeDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        changeDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main game tick
  useEffect(() => {
    if (gameState !== 'running') return;

    let localTier: 0 | 1 | 2 = 0;
    let localScore = 0;

    gameIntervalRef.current = setInterval(() => {
      directionRef.current = nextDirectionRef.current;
      const head = { ...snakeRef.current[0] };

      switch (directionRef.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver(localScore, localTier);
        return;
      }

      // Check self bite collision
      const selfBite = snakeRef.current.some((seg) => seg.x === head.x && seg.y === head.y);
      if (selfBite) {
        handleGameOver(localScore, localTier);
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      // Check if food eaten
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        localScore += 1;
        setScore(localScore);
        foodRef.current = spawnFood(newSnake);

        // Milestone 20 check (avoid duplicate notifications)
        if (localScore >= 20 && localTier === 0) {
          localTier = 1;
          setHighestTierReached(1);
          triggerToast(games.snake.milestone20.announcement);
        }

        // Milestone 40 check
        if (localScore >= 40 && localTier < 2) {
          localTier = 2;
          setHighestTierReached(2);
          triggerToast(games.snake.milestone40.announcement);
        }
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;

      // Render onto canvas
      renderCanvas();
    }, SPEED_MS);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [gameState, handleGameOver, games.snake]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cellWidth = width / GRID_SIZE;
    const cellHeight = height / GRID_SIZE;

    // Background checkered banking tiles
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#F0F9FF' : '#E0F2FE';
        ctx.fillRect(c * cellWidth, r * cellHeight, cellWidth, cellHeight);
      }
    }

    // Border line
    ctx.strokeStyle = '#003B70';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, width, height);

    // Draw Food (Gold coin / fuel drop)
    const food = foodRef.current;
    ctx.save();
    ctx.fillStyle = '#ED1C24';
    ctx.beginPath();
    ctx.arc(
      food.x * cellWidth + cellWidth / 2,
      food.y * cellHeight + cellHeight / 2,
      cellWidth * 0.42,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Food inner golden shine
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(
      food.x * cellWidth + cellWidth / 2,
      food.y * cellHeight + cellHeight / 2,
      cellWidth * 0.24,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // Draw Snake
    snakeRef.current.forEach((seg, index) => {
      ctx.save();
      if (index === 0) {
        // Head: VietinBank Deep Blue
        ctx.fillStyle = '#003B70';
        ctx.beginPath();
        ctx.roundRect(
          seg.x * cellWidth + 1,
          seg.y * cellHeight + 1,
          cellWidth - 2,
          cellHeight - 2,
          6
        );
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(
          seg.x * cellWidth + cellWidth * 0.35,
          seg.y * cellHeight + cellHeight * 0.35,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.arc(
          seg.x * cellWidth + cellWidth * 0.65,
          seg.y * cellHeight + cellHeight * 0.35,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        // Body: Gradient VietinBank blue and soft cyan
        ctx.fillStyle = index % 2 === 0 ? '#00549A' : '#0284C7';
        ctx.beginPath();
        ctx.roundRect(
          seg.x * cellWidth + 2,
          seg.y * cellHeight + 2,
          cellWidth - 4,
          cellHeight - 4,
          4
        );
        ctx.fill();
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    renderCanvas();
  }, []);

  const copyVoucher = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-slate-200 max-w-xl mx-auto flex flex-col items-center select-none">
      {/* Game Title */}
      <div className="w-full text-center space-y-1 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#003B70] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            VietinBank Arcade
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Kỷ lục: <strong className="text-[#003B70]">{highScore}</strong></span>
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#003B70] tracking-tight">
          {games.snake.name}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {games.snake.subtitle}
        </p>
      </div>

      {/* Rules & Milestones quick strip */}
      <div className="w-full grid grid-cols-2 gap-2 text-center text-xs mb-3">
        <div className={`p-2 rounded-xl border ${score >= 20 ? 'bg-amber-100 border-amber-400 font-bold text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          🎯 Mốc 20 Điểm: <strong>01 Voucher 2L xăng</strong>
        </div>
        <div className={`p-2 rounded-xl border ${score >= 40 ? 'bg-red-100 border-red-400 font-bold text-red-900' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          🏆 Mốc 40 Điểm: <strong>02 Voucher (4L xăng)</strong>
        </div>
      </div>

      {/* Live In-Game Floating Notification Toast without interrupting gameplay */}
      {toastNotification && (
        <div className="w-full mb-3 p-3 bg-gradient-to-r from-red-600 to-amber-500 text-white rounded-2xl shadow-lg flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-bounce">
          <Sparkles className="w-5 h-5 shrink-0 text-amber-200" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* Canvas Screen */}
      <div className="relative w-full aspect-square max-w-[380px] rounded-2xl overflow-hidden shadow-md border-2 border-[#003B70] bg-[#F0F9FF]">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="w-full h-full block"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-[#003B70]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg">
              <Gift className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Săn Voucher Xăng Tại Quầy</h3>
              <p className="text-xs text-sky-100 mt-1 max-w-xs">
                Ăn điểm thưởng để dài ra và tích điểm. Vượt mốc 20 & 40 điểm để nhận voucher 2L xăng!
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Bắt đầu chơi
            </button>
          </div>
        )}

        {/* Game Over Screen with Official Gift Receipt Card as specified in PDF */}
        {gameState === 'over' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white text-center overflow-y-auto animate-fadeIn">
            {/* Receipt Modal Card */}
            <div className="w-full max-w-xs bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border-2 border-amber-400 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[11px] font-bold text-[#003B70] uppercase">
                  {brand.name} Ticket
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {finishedTime}
                </span>
              </div>

              <h4 className="text-base font-extrabold text-[#003B70]">
                PHIẾU XÁC NHẬN QUÀ TẶNG
              </h4>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Điểm cuối cùng:</span>
                  <span className="font-extrabold text-[#003B70] text-sm">{score} Điểm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mức quà đạt được:</span>
                  <span className="font-bold text-red-600 text-right">
                    {score >= 40
                      ? '02 Voucher (4L xăng)'
                      : score >= 20
                      ? '01 Voucher (2L xăng)'
                      : 'Chưa đạt mốc quà'}
                  </span>
                </div>

                {voucherCode && (
                  <div className="pt-2 border-t border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block">
                      MÃ NHẬN THƯỞNG:
                    </span>
                    <span className="text-lg font-black text-[#003B70] tracking-wider font-mono">
                      {voucherCode}
                    </span>
                  </div>
                )}
              </div>

              {voucherCode ? (
                <button
                  onClick={copyVoucher}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép mã voucher</span>
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-amber-700 italic">
                  {games.snake.loseMessageUnder20}
                </p>
              )}

              <p className="text-[10px] text-slate-600 italic bg-amber-50 p-2 rounded-lg border border-amber-200">
                {games.snake.confirmationNote}
              </p>

              <button
                onClick={startGame}
                className="w-full py-2.5 rounded-xl bg-[#003B70] hover:bg-[#002B52] text-white font-extrabold text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live In-Game Status Bar */}
      <div className="w-full mt-3 flex items-center justify-between text-xs font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <span className="text-[#003B70] flex items-center gap-1">
          <Fuel className="w-4 h-4 text-red-500" />
          Điểm hiện tại: {score}
        </span>
        <span className="text-emerald-700">
          Mức thưởng: {highestTierReached === 2 ? '02 Voucher' : highestTierReached === 1 ? '01 Voucher' : 'Chưa có'}
        </span>
      </div>

      {/* On-Screen Touch Controls (Virtual D-Pad) for Kiosk Screen & Mobile */}
      <div className="mt-4 flex flex-col items-center space-y-2">
        <button
          onClick={() => changeDirection('UP')}
          disabled={gameState !== 'running'}
          className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white border border-slate-300 shadow flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
          aria-label="Lên"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirection('LEFT')}
            disabled={gameState !== 'running'}
            className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white border border-slate-300 shadow flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
            aria-label="Trái"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[10px] font-bold text-[#003B70]">
            D-PAD
          </div>
          <button
            onClick={() => changeDirection('RIGHT')}
            disabled={gameState !== 'running'}
            className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white border border-slate-300 shadow flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
            aria-label="Phải"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => changeDirection('DOWN')}
          disabled={gameState !== 'running'}
          className="w-12 h-12 rounded-xl bg-slate-100 active:bg-blue-600 active:text-white border border-slate-300 shadow flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
          aria-label="Xuống"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
