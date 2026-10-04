import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Copy,
  CheckCircle,
  Volume2,
  VolumeX,
  Play,
  Fuel
} from 'lucide-react';
import contentData from '../../data/contentData.json';

// Global window callback type definitions
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Configurable constants
const WIN_SCORE = 20;
const GRAVITY = 0.38;
const JUMP_FORCE = -6.8;
const PIPE_SPEED = 2.4;
const PIPE_SPAWN_INTERVAL = 110; // frames
const PIPE_GAP = 160; // generous gap for bank kiosk users
const PIPE_WIDTH = 58;
const VOUCHER_TEXT = "Voucher 2 lít xăng";
const BRAND_NAME = "VietinBank";
const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

export const FlappyVoucherGame: React.FC = () => {
  const { games } = contentData;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('vb_flappy_high_score') || '0', 10);
  });
  const [voucherCode, setVoucherCode] = useState<string>(() => {
    return localStorage.getItem('vb_flappy_last_voucher') || '';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Game internal state held in refs for 60fps canvas loop
  const birdRef = useRef({
    x: 65,
    y: 180,
    velocity: 0,
    radius: 17,
  });
  const pipesRef = useRef<Array<{ x: number; topHeight: number; bottomY: number; passed: boolean }>>([]);
  const frameCountRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);

  // Play simple synth sound if enabled
  const playBeep = useCallback((freq = 520, type: OscillatorType = 'sine', duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context might be restricted
    }
  }, [soundEnabled]);

  const generateVoucherCode = (): string => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomNum}`;
  };

  const copyVoucherCode = () => {
    if (!voucherCode) return;
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const winGame = useCallback(() => {
    isPlayingRef.current = false;
    setGameState('won');
    const code = generateVoucherCode();
    setVoucherCode(code);
    localStorage.setItem('vb_flappy_last_voucher', code);

    // Confetti celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#003B70', '#ED1C24', '#F59E0B', '#10B981']
    });

    playBeep(880, 'triangle', 0.3);

    // Call external integration callback if present
    if (window.onFlappyVoucherWin) {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: code,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [playBeep]);

  const endGame = useCallback((finalScore: number) => {
    isPlayingRef.current = false;
    setGameState('gameover');
    playBeep(220, 'sawtooth', 0.2);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('vb_flappy_high_score', finalScore.toString());
    }

    if (window.onFlappyVoucherLose) {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [highScore, playBeep]);

  const resetGame = () => {
    birdRef.current = {
      x: 65,
      y: 180,
      velocity: 0,
      radius: 17,
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    setCurrentScore(0);
  };

  const startGame = () => {
    resetGame();
    isPlayingRef.current = true;
    setGameState('playing');
  };

  const jump = useCallback(() => {
    if (!isPlayingRef.current) return;
    birdRef.current.velocity = JUMP_FORCE;
    playBeep(650, 'sine', 0.05);
  }, [playBeep]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scoreAccumulator = 0;

    const gameLoop = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Clear background - Vietnamese banking daylight sky
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
      skyGradient.addColorStop(0, '#E0F2FE'); // light sky blue
      skyGradient.addColorStop(0.75, '#BAE6FD');
      skyGradient.addColorStop(1, '#0284C7');
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Clouds / Bank skyline motif in background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.beginPath();
      ctx.arc(80, 70, 24, 0, Math.PI * 2);
      ctx.arc(110, 65, 32, 0, Math.PI * 2);
      ctx.arc(140, 70, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(310, 90, 26, 0, Math.PI * 2);
      ctx.arc(340, 85, 34, 0, Math.PI * 2);
      ctx.arc(370, 90, 24, 0, Math.PI * 2);
      ctx.fill();

      // Ground strip
      const groundHeight = 44;
      ctx.fillStyle = '#003B70';
      ctx.fillRect(0, height - groundHeight, width, groundHeight);
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(0, height - groundHeight, width, 5); // Accent red bank line

      if (isPlayingRef.current) {
        frameCountRef.current += 1;

        // 2. Bird Physics
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;

        // Ground / Ceiling collision
        if (birdRef.current.y + birdRef.current.radius >= height - groundHeight) {
          endGame(scoreAccumulator);
          return;
        }
        if (birdRef.current.y - birdRef.current.radius <= 0) {
          birdRef.current.y = birdRef.current.radius;
          birdRef.current.velocity = 0;
        }

        // 3. Pipe Generation
        if (frameCountRef.current % PIPE_SPAWN_INTERVAL === 0) {
          const minHeight = 45;
          const maxAvailable = height - groundHeight - PIPE_GAP - minHeight;
          const topHeight = Math.floor(minHeight + Math.random() * (maxAvailable - minHeight));
          pipesRef.current.push({
            x: width,
            topHeight,
            bottomY: topHeight + PIPE_GAP,
            passed: false,
          });
        }

        // 4. Update Pipes & Collision Checking
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check if bird passed pipe
          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdRef.current.x) {
            pipe.passed = true;
            scoreAccumulator += 1;
            setCurrentScore(scoreAccumulator);
            playBeep(780, 'triangle', 0.08);

            // Win condition reached
            if (scoreAccumulator >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Collision detection circle vs rect
          const bird = birdRef.current;
          // Top pipe rect: (pipe.x, 0, PIPE_WIDTH, pipe.topHeight)
          const birdLeft = bird.x - bird.radius;
          const birdRight = bird.x + bird.radius;
          const birdTop = bird.y - bird.radius;
          const birdBottom = bird.y + bird.radius;

          const collidesWithTop =
            birdRight > pipe.x + 4 &&
            birdLeft < pipe.x + PIPE_WIDTH - 4 &&
            birdTop < pipe.topHeight;

          // Bottom pipe rect: (pipe.x, pipe.bottomY, PIPE_WIDTH, height - groundHeight - pipe.bottomY)
          const collidesWithBottom =
            birdRight > pipe.x + 4 &&
            birdLeft < pipe.x + PIPE_WIDTH - 4 &&
            birdBottom > pipe.bottomY;

          if (collidesWithTop || collidesWithBottom) {
            endGame(scoreAccumulator);
            return;
          }

          // Remove offscreen pipes
          if (pipe.x + PIPE_WIDTH < -10) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // 5. Draw Pipes (Modern VietinBank Architectural Pillars)
      pipesRef.current.forEach((pipe) => {
        // Top Pipe
        const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        pipeGrad.addColorStop(0, '#004B8D');
        pipeGrad.addColorStop(0.5, '#0072CE');
        pipeGrad.addColorStop(1, '#003366');

        ctx.fillStyle = pipeGrad;
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

        // Pipe rim top
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 12, PIPE_WIDTH + 6, 12);

        // Bottom Pipe
        const bottomHeight = height - groundHeight - pipe.bottomY;
        ctx.fillStyle = pipeGrad;
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, bottomHeight);

        // Pipe rim bottom
        ctx.fillStyle = '#ED1C24';
        ctx.fillRect(pipe.x - 3, pipe.bottomY, PIPE_WIDTH + 6, 12);
      });

      // 6. Draw Bird (VietinBank Flying Card Mascot)
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);

      // Angle tilt based on velocity
      const angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 4) * (Math.PI / 180)));
      ctx.rotate(angle);

      // Cute VietinBank card mascot
      ctx.fillStyle = '#003B70';
      ctx.beginPath();
      ctx.roundRect(-20, -14, 40, 28, 6);
      ctx.fill();

      // Gold Chip
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(-14, -6, 9, 8);

      // Red stripe
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(-20, 7, 40, 4);

      // Wing
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(-6, 0, 8, 5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(10, -5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(11, -5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Little beak
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(18, -4);
      ctx.lineTo(26, -1);
      ctx.lineTo(18, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [endGame, winGame, playBeep]);

  // Spacebar and touch handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'start' || gameState === 'gameover') {
          startGame();
        } else if (gameState === 'playing') {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump]);

  // Motivational message
  const getMotivationalMessage = (score: number) => {
    const { cheerMessages } = games.flappy;
    if (score < 5) return cheerMessages.under5;
    if (score < 10) return cheerMessages.under10;
    if (score < 15) return cheerMessages.under15;
    if (score < 20) return cheerMessages.under20;
    return cheerMessages.win;
  };

  return (
    <div
      id="flappy-voucher-game"
      className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-2 border-slate-200 max-w-xl mx-auto flex flex-col items-center select-none"
    >
      {/* Title & Brand */}
      <div className="w-full text-center space-y-1 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#003B70] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {BRAND_NAME} Mini Game
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Bật/Tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Bật âm' : 'Tắt âm'}</span>
          </button>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#003B70] tracking-tight">
          {GAME_TITLE}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {games.flappy.shortDesc}
        </p>
      </div>

      {/* Progress & Live Cheer Banner */}
      <div className="w-full mb-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#003B70] flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5 text-red-500" />
            Điểm: {currentScore} / {WIN_SCORE}
          </span>
          <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
            {getMotivationalMessage(currentScore)}
          </span>
          <span className="text-slate-500">Kỷ lục: {highScore}</span>
        </div>

        {/* 0 to 20 Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-red-500 transition-all duration-200"
            style={{ width: `${Math.min(100, (currentScore / WIN_SCORE) * 100)}%` }}
          />
        </div>
      </div>

      {/* Canvas Area Container */}
      <div
        className="relative w-full aspect-[4/3] max-w-[480px] rounded-2xl overflow-hidden shadow-inner border-2 border-slate-300 bg-sky-100 cursor-pointer touch-none"
        onClick={() => {
          if (gameState === 'playing') jump();
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="w-full h-full block"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-[#003B70]/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-lg animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">
                Săn Voucher 2 Lít Xăng
              </h3>
              <p className="text-xs text-sky-200 mt-1 max-w-xs">
                Vượt qua 20 chướng ngại vật ống trụ để nhận ngay mã voucher xăng miễn phí tại quầy!
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              Bắt đầu chơi ngay
            </button>

            <p className="text-[11px] text-sky-200">
              Chạm màn hình hoặc nhấn phím <strong>Space</strong> để bay
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-fadeIn">
            <div className="text-red-400 font-extrabold text-xl">
              Rất tiếc, bạn đã vượt qua {currentScore}/{WIN_SCORE} thử thách!
            </div>
            <p className="text-xs text-slate-300 max-w-xs">
              {games.flappy.loseMessage}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Chơi lại
              </button>
              <button
                onClick={() => setGameState('start')}
                className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Screen (20 Points Reached) */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-[#003B70]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-slate-900 flex items-center justify-center shadow-xl animate-pulse">
              <Sparkles className="w-9 h-9 text-amber-900" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-amber-300">
                Chúc mừng Quý khách!
              </h3>
              <p className="text-xs text-sky-100 max-w-xs">
                Quý khách đã xuất sắc vượt qua 20 thử thách và đủ điều kiện nhận{' '}
                <strong className="text-white underline">{VOUCHER_TEXT}</strong>.
              </p>
            </div>

            {/* Voucher Code Box */}
            <div className="w-full max-w-xs bg-white text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-amber-400 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                MÃ VOUCHER NHẬN QUÀ TẠI QUẦY
              </div>
              <div className="text-2xl font-black text-[#003B70] tracking-wider font-mono">
                {voucherCode}
              </div>
              <button
                onClick={copyVoucherCode}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Đã sao chép mã!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-amber-200 italic max-w-xs">
              * {games.flappy.guideNotice}
            </p>

            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs uppercase shadow transition-all hover:scale-105 cursor-pointer"
            >
              Chơi lại lượt mới
            </button>
          </div>
        )}
      </div>

      {/* Tap prompt for mobile & recent voucher banner */}
      <div className="w-full mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>* Chạm màn hình để bay (Đã tối ưu không bị cuộn trang)</span>
        {voucherCode && gameState !== 'won' && (
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-200 text-[11px] font-medium">
            <span>Mã quà gần nhất:</span>
            <strong className="font-mono text-[#003B70]">{voucherCode}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
