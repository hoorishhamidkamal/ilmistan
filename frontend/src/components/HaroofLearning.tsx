import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, RotateCcw, ChevronRight, ChevronLeft, X, BookOpen, Pencil, Paintbrush, CheckCircle2, XCircle } from 'lucide-react';

interface HaroofLearningProps {
  onBack: () => void;
}

const BG_COLORS = [
  'bg-purple-100 border-purple-200 text-purple-900 hover:bg-purple-200',
  'bg-amber-100 border-amber-200 text-amber-900 hover:bg-amber-200',
  'bg-sky-100 border-sky-200 text-sky-900 hover:bg-sky-200',
  'bg-pink-100 border-pink-200 text-pink-900 hover:bg-pink-200',
  'bg-emerald-100 border-emerald-200 text-emerald-900 hover:bg-emerald-200',
  'bg-rose-100 border-rose-200 text-rose-900 hover:bg-rose-200'
];

const URDU_HAROOF = [
  { id: 1, letter: 'ا', name: 'الف', example: 'انگور', image: '🍇' },
  { id: 2, letter: 'آ', name: 'الف مد آ', example: 'آم', image: '🥭' },
  { id: 3, letter: 'ب', name: 'بے', example: 'بندر', image: '🐒' },
  { id: 4, letter: 'پ', name: 'پے', example: 'پتنگ', image: '🪁' },
  { id: 5, letter: 'ت', name: 'تے', example: 'تتلی', image: '🦋' },
  { id: 6, letter: 'ٹ', name: 'ٹے', example: 'ٹماٹر', image: '🍅' },
  { id: 7, letter: 'ث', name: 'ثے', example: 'ثاقب', image: '⭐' },
  { id: 8, letter: 'ج', name: 'جیم', example: 'جہاز', image: '✈️' },
  { id: 9, letter: 'چ', name: 'چے', example: 'چڑیا', image: '🐦' },
  { id: 10, letter: 'ح', name: 'حے', example: 'حلوہ', image: '🍲' },
  { id: 11, letter: 'خ', name: 'خے', example: 'خرگوش', image: '🐇' },
  { id: 12, letter: 'د', name: 'دال', example: 'درخت', image: '🌲' },
  { id: 13, letter: 'ڈ', name: 'ڈال', example: 'ڈولفن', image: '🐬' },
  { id: 14, letter: 'ذ', name: 'ذال', example: 'ذخیرہ', image: '📦' },
  { id: 15, letter: 'ر', name: 'رے', example: 'رکشہ', image: '🛺' },
  { id: 16, letter: 'ڑ', name: 'ڑے', example: 'پہاڑ', image: '🏔️' },
  { id: 17, letter: 'ز', name: 'زے', example: 'زرافہ', image: '🦒' },
  { id: 18, letter: 'ژ', name: 'ژے', example: 'ژالہ', image: '🌧️' },
  { id: 19, letter: 'س', name: 'سین', example: 'سیب', image: '🍎' },
  { id: 20, letter: 'ش', name: 'شین', example: 'شیر', image: '🦁' },
  { id: 21, letter: 'ص', name: 'صاد', example: 'صراچی', image: '🏺' },
  { id: 22, letter: 'ض', name: 'ضاد', example: 'ضعیف', image: '👴' },
  { id: 23, letter: 'ط', name: 'طوئے', example: 'طوطا', image: '🦜' },
  { id: 24, letter: 'ظ', name: 'ظوئے', example: 'ظروف', image: '🍽️' },
  { id: 25, letter: 'ع', name: 'عین', example: 'عینک', image: '👓' },
  { id: 26, letter: 'غ', name: 'غین', example: 'غبارہ', image: '🎈' },
  { id: 27, letter: 'ف', name: 'فے۔', example: 'فوارہ', image: '⛲' },
  { id: 28, letter: 'ق', name: 'قاف', example: 'قلم', image: '🖊️' },
  { id: 29, letter: 'ک', name: 'کاف', example: 'کتاب', image: '📚' },
  { id: 30, letter: 'گ', name: 'گاف', example: 'گائے', image: '🐄' },
  { id: 31, letter: 'ل', name: 'لام', example: 'لومڑی', image: '🦊' },
  { id: 32, letter: 'م', name: 'میم', example: 'مچھلی', image: '🐟' },
  { id: 33, letter: 'ن', name: 'نون', example: 'نل', image: '🚰' },
  { id: 34, letter: 'و', name: 'واؤ', example: 'ورق', image: '📄' },
  { id: 35, letter: 'ہ', name: 'ہے', example: 'ہاتھی', image: '🐘' },
  { id: 36, letter: 'ء', name: 'ہمزہ', example: 'چائے', image: '☕' },
  { id: 37, letter: 'ی', name: 'چھوٹی یے', example: 'یکہ', image: '🛺' },
  { id: 38, letter: 'ے', name: 'بڑی یے', example: 'کپڑے', image: '👔' },
  { id: 39, letter: 'ں', name: 'نون غنہ', example: 'ماں', image: '👵' }
];

const COLORS = [
  { name: 'Blue', value: '#0284c7', bg: 'bg-sky-500' },
  { name: 'Red', value: '#e11d48', bg: 'bg-rose-500' },
  { name: 'Green', value: '#16a34a', bg: 'bg-green-600' },
  { name: 'Yellow', value: '#eab308', bg: 'bg-yellow-500' },
  { name: 'Purple', value: '#9333ea', bg: 'bg-purple-600' }
];

export default function HaroofLearning({ onBack }: HaroofLearningProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('#0284c7');
  const [tool, setTool] = useState<'pencil' | 'marker'>('marker');
  const [tracingResult, setTracingResult] = useState<'correct' | 'incorrect' | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const currentHarf = selectedIndex !== null ? URDU_HAROOF[selectedIndex] : null;

  const speakHarf = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ur-PK';
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTracingResult(null);
  };

  // Pre-render letter on hidden background canvas for accurate overlap checking
  useEffect(() => {
    if (selectedIndex !== null && currentHarf) {
      clearCanvas();
      const bgCanvas = bgCanvasRef.current;
      if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
          ctx.font = 'bold 130px sans-serif';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(currentHarf.letter, bgCanvas.width / 2, bgCanvas.height / 2);
        }
      }
    }
  }, [selectedIndex]);

  // Strict Accuracy Check Logic
  const checkTracingAccuracy = () => {
    const canvas = canvasRef.current;
    const bgCanvas = bgCanvasRef.current;
    if (!canvas || !bgCanvas) return;

    const ctx = canvas.getContext('2d');
    const bgCtx = bgCanvas.getContext('2d');
    if (!ctx || !bgCtx) return;

    const userImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bgImg = bgCtx.getImageData(0, 0, bgCanvas.width, bgCanvas.height);

    let totalLetterPixels = 0;
    let correctlyCoveredPixels = 0;
    let wrongOutsidePixels = 0;

    for (let i = 0; i < bgImg.data.length; i += 4) {
      const isLetterPixel = bgImg.data[i + 3] > 50; // Text pixel in BG
      const isUserPixel = userImg.data[i + 3] > 50; // User drawn pixel

      if (isLetterPixel) {
        totalLetterPixels++;
        if (isUserPixel) {
          correctlyCoveredPixels++;
        }
      } else if (isUserPixel) {
        wrongOutsidePixels++;
      }
    }

    if (totalLetterPixels === 0) return;

    const coveragePercentage = (correctlyCoveredPixels / totalLetterPixels) * 100;
    const offTargetRatio = wrongOutsidePixels / (correctlyCoveredPixels + 1);

    // If child covers at least 35% of letter and didn't scribble randomly outside
    if (coveragePercentage >= 35 && offTargetRatio < 2.5) {
      setTracingResult('correct');
      speakHarf('شاباش! بالکل درست');
    } else if (correctlyCoveredPixels > 100 || wrongOutsidePixels > 200) {
      setTracingResult('incorrect');
      speakHarf('دوبارہ کوشش کریں');
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setTracingResult(null);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.beginPath();
      }
      checkTracingAccuracy();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = tool === 'pencil' ? 8 : 18;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="min-h-screen bg-slate-50 dir-rtl p-4 sm:p-6 font-sans">
      <style>{`
        .cursor-pencil { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%230284c7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'/></svg>") 0 24, pointer; }
        .cursor-marker { cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23e11d48' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><path d='m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2a2 2 0 0 0 2.8 0L19 11Z'/></svg>") 0 24, pointer; }
      `}</style>

      {/* Hidden canvas for pixel analysis */}
      <canvas ref={bgCanvasRef} width={288} height={256} className="hidden" />

      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-600" />
          <h1 className="text-2xl font-black text-slate-800">اردو حروف</h1>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition text-base"
        >
          ڈیش بورڈ پر واپس جائیں
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Grid of 39 Haroof */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {URDU_HAROOF.map((item, index) => {
            const colorClass = BG_COLORS[index % BG_COLORS.length];
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(index);
                  speakHarf(`${item.name} سے ${item.example}`);
                }}
                className={`h-36 rounded-3xl border-2 p-3 flex flex-col items-center justify-between transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-1 ${colorClass}`}
              >
                <span className="text-5xl font-black mt-1">{item.letter}</span>
                <div className="flex items-center gap-1.5 text-sm font-extrabold mb-1">
                  <span>{item.example}</span>
                  <span className="text-xl">{item.image}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pop-up Modal */}
      {selectedIndex !== null && currentHarf && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 bg-white border px-3 py-1 rounded-full shadow-sm">
                حرف {selectedIndex + 1} / 39
              </span>
              <h3 className="text-xl font-black text-slate-800">{currentHarf.name}</h3>
              <button
                onClick={() => setSelectedIndex(null)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              {/* Heading */}
              <h4 className="text-lg font-black text-slate-700 mb-3 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-sky-600" />
                لکھائی سیکھیے
              </h4>

              {/* Tracing Canvas Box with Result Badge */}
              <div className="relative w-72 h-64 bg-slate-50 border-2 border-dashed border-sky-300 rounded-3xl flex items-center justify-center select-none shadow-inner overflow-hidden">
                <span className="text-[130px] font-black text-slate-200 pointer-events-none absolute">
                  {currentHarf.letter}
                </span>

                <canvas
                  ref={canvasRef}
                  width={288}
                  height={256}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className={`absolute inset-0 touch-none ${
                    tool === 'pencil' ? 'cursor-pencil' : 'cursor-marker'
                  }`}
                />

                {/* Tick Overlay (Sahi Likhne Par) */}
                {tracingResult === 'correct' && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-xs font-black">شاباش! درست</span>
                  </div>
                )}

                {/* Cross Overlay (Galat Likhne Par) */}
                {tracingResult === 'incorrect' && (
                  <div className="absolute top-3 right-3 bg-rose-500 text-white px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                    <XCircle className="w-5 h-5 text-white" />
                    <span className="text-xs font-black">دوبارہ کوشش کریں</span>
                  </div>
                )}
              </div>

              {/* Tool Selection (Pencil / Marker) & Colors */}
              <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-4 px-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setTool('pencil')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      tool === 'pencil' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    پنسل
                  </button>
                  <button
                    onClick={() => setTool('marker')}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      tool === 'marker' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    مارکر
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.value)}
                      className={`w-6 h-6 rounded-full ${c.bg} transition ${
                        selectedColor === c.value ? 'ring-4 ring-slate-300 scale-110' : 'opacity-80'
                      }`}
                    />
                  ))}
                  <button
                    onClick={clearCanvas}
                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1 text-xs font-bold mr-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    مٹائیں
                  </button>
                </div>
              </div>

              {/* Word Example Box */}
              <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-5 flex items-center justify-between px-8">
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-700">مثال:</span>
                  <h4 className="text-3xl font-black text-amber-900 mt-1">
                    {currentHarf.letter} سے {currentHarf.example}
                  </h4>
                </div>
                <div className="text-6xl">{currentHarf.image}</div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between w-full mt-6 gap-3">
                <button
                  disabled={selectedIndex === 0}
                  onClick={() => {
                    const prev = Math.max(0, selectedIndex - 1);
                    setSelectedIndex(prev);
                    speakHarf(`${URDU_HAROOF[prev].name} سے ${URDU_HAROOF[prev].example}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 py-2.5 rounded-xl font-bold transition text-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                  پیچھے چلیے
                </button>

                <button
                  onClick={() => speakHarf(`${currentHarf.name} سے ${currentHarf.example}`)}
                  className="flex items-center gap-2 bg-sky-50 text-sky-600 border border-sky-200 px-4 py-2.5 rounded-xl font-bold hover:bg-sky-100 transition text-sm"
                >
                  <Volume2 className="w-5 h-5" />
                  آواز
                </button>

                <button
                  disabled={selectedIndex === URDU_HAROOF.length - 1}
                  onClick={() => {
                    const next = Math.min(URDU_HAROOF.length - 1, selectedIndex + 1);
                    setSelectedIndex(next);
                    speakHarf(`${URDU_HAROOF[next].name} سے ${URDU_HAROOF[next].example}`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl font-bold transition disabled:opacity-40 text-sm"
                >
                  آگے بڑھیے
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}