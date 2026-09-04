import { useState } from 'react';
import { ArrowRight, RotateCcw, Palette, Brush, Pencil, Eraser, Smile, HelpCircle } from 'lucide-react';
import DrawingCanvas from './DrawingCanvas';
import { saveGameScore } from '../api';

interface DrawingBoardProps {
  onBack: () => void;
  onScoreSaved?: () => void;
}

export default function DrawingBoard({ onBack, onScoreSaved }: DrawingBoardProps) {
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const [brushSize, setBrushSize] = useState(18);
  const [tool, setTool] = useState<'brush' | 'pencil' | 'eraser' | 'sticker'>('brush');
  const [selectedPreset, setSelectedPreset] = useState('free');
  const [selectedSticker, setSelectedSticker] = useState('⭐');
  const [clearTrigger, setClearTrigger] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');

  const colors = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#374151', '#06b6d4'];
  const stickersList = ['⭐', '🎈', '🌸', '🚗', '🍎', '🌳', '☀️', '🦋', '👑', '🌈'];

  const presets = [
    { id: 'free', name: 'آزاد نقاشی', icon: '🎨' },
    { id: 'apple', name: 'سیب', icon: '🍎' },
    { id: 'tree', name: 'درخت', icon: '🌳' },
    { id: 'sun', name: 'سورج', icon: '☀️' },
    { id: 'flower', name: 'پھول', icon: '🌸' },
    { id: 'star', name: 'ستارہ', icon: '⭐' },
    { id: 'house', name: 'گھر', icon: '🏠' },
  ];

  const saveDrawing = () => {
    setSaveMessage('محفوظ کیا جا رہا ہے...');
    void saveGameScore({ gameName: 'ڈرائنگ بورڈ', score: 0, pointsEarned: 0, correctAnswers: 0, totalQuestions: 1 })
      .then(() => {
        setSaveMessage('ڈرائنگ مکمل محفوظ ہو گئی۔');
        onScoreSaved?.();
      })
      .catch(() => setSaveMessage('ڈرائنگ محفوظ نہیں ہو سکی۔'));
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 dir-rtl font-sans flex flex-col p-4 md:p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between mb-6 bg-white p-4 rounded-3xl shadow-sm border border-sky-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition text-slate-700 flex items-center gap-2 font-bold"
          >
            <ArrowRight className="w-5 h-5" />
            <span>واپس</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 text-white p-3 rounded-2xl shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-sky-600">🎨 رنگ اور نقاشی کی تختیاں</h1>
          </div>
        </div>

        <button
          onClick={() => setClearTrigger(prev => prev + 1)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-3 rounded-2xl font-bold transition shadow-md"
        >
          <RotateCcw className="w-5 h-5" />
          <span>تختہ صاف کریں</span>
        </button>
        <button
          onClick={saveDrawing}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-2xl font-bold transition shadow-md"
        >
          محفوظ کریں
        </button>
      </header>

      {saveMessage && <p className="max-w-7xl mx-auto w-full mb-4 text-center text-sm font-bold text-emerald-700">{saveMessage}</p>}

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar Controls */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-5 lg:col-span-1">
          <h3 className="text-base font-extrabold text-slate-700 text-center border-b pb-2">لکھائی اور رنگ کے اوزار</h3>

          {/* Tools */}
          <div className="space-y-2">
            <button
              onClick={() => setTool('brush')}
              className={`w-full p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
                tool === 'brush' ? 'bg-sky-600 text-white shadow-md' : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
              }`}
            >
              <Brush className="w-5 h-5" />
              <span>🖌️ رنگ بھرنے والا برش</span>
            </button>

            <button
              onClick={() => setTool('pencil')}
              className={`w-full p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
                tool === 'pencil' ? 'bg-sky-600 text-white shadow-md' : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
              }`}
            >
              <Pencil className="w-5 h-5" />
              <span>✏️ قلم / باریک پنسل</span>
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`w-full p-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
                tool === 'eraser' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              <Eraser className="w-5 h-5" />
              <span>🧽 مٹائیں</span>
            </button>
          </div>

          {/* Size Slider */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="text-xs font-bold text-slate-600 block mb-1">
              موٹائی / سائز: {brushSize}px
            </label>
            <input
              type="range"
              min="8"
              max="45"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-2">رنگ منتخب کریں</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {colors.map((c) => (
                <button
                  key={c}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    setSelectedColor(c);
                    if (tool !== 'pencil') setTool('brush');
                  }}
                  className={`w-9 h-9 rounded-full transition transform ${
                    selectedColor === c && (tool === 'brush' || tool === 'pencil')
                      ? 'ring-4 ring-slate-800 scale-110 shadow-md'
                      : 'hover:scale-105 opacity-90'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stickers */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>ٹھپے (اسٹیکرز)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {stickersList.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedSticker(st);
                    setTool('sticker');
                  }}
                  className={`w-10 h-10 text-xl rounded-xl transition flex items-center justify-center ${
                    selectedSticker === st && tool === 'sticker'
                      ? 'bg-sky-200 border-2 border-sky-600 scale-110 shadow-sm'
                      : 'bg-amber-100 hover:bg-amber-200 border border-amber-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 mb-2">خاکے (تصویریں) 🖼️</h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id)}
                  className={`p-2 rounded-xl text-xs font-bold border transition text-right ${
                    selectedPreset === p.id
                      ? 'bg-sky-100 border-sky-500 text-sky-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm lg:col-span-2 flex flex-col items-center">
          <DrawingCanvas
            selectedColor={selectedColor}
            brushSize={brushSize}
            tool={tool}
            selectedPreset={selectedPreset}
            selectedSticker={selectedSticker}
            clearTrigger={clearTrigger}
          />
        </div>

        {/* Guidance Panel */}
        <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-center gap-2 mb-4 text-sky-600">
            <HelpCircle className="w-6 h-6" />
            <h3 className="text-lg font-extrabold">رہنمائی 💡</h3>
          </div>
          <ul className="space-y-3 text-sm text-slate-600 leading-relaxed font-medium">
            <li className="bg-sky-50 p-3 rounded-2xl border border-sky-100">
              رنگ بھرنے کے لیے <strong>🖌️ برش</strong> اور لکیریں کھینچنے کے لیے <strong>✏️ پنسل</strong> چنائیں۔
            </li>
            <li className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
              <strong>ٹھپے (اسٹیکرز)</strong> پر کلک کریں اور بورڈ پر کہیں بھی چپکائیں۔
            </li>
            <li className="bg-rose-50 p-3 rounded-2xl border border-rose-100">
              اگر غلطی ہو جائے تو <strong>🧽 مٹائیں</strong> کا بٹن استعمال کریں۔
            </li>
            <li className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
              مختلف <strong>خاکے</strong> (سیب، سورج، درخت) چن کر ان میں رنگ بھریں۔
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}