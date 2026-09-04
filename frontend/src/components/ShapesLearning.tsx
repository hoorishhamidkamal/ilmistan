import { useState } from 'react';
import { ArrowRight, Palette, Shapes } from 'lucide-react';

interface ColorsShapesLearningProps {
  onBack: () => void;
  onScoreSaved?: () => void;
}

interface ShapeItem {
  urdu: string;
  english: string;
  svg: 'triangle' | 'square' | 'circle' | 'heart' | 'rectangle' | 'star' | 'oval' | 'crescent' | 'diamond' | 'hexagon' | 'pentagon' | 'cube' | 'semicircle' | 'trapezoid';
  color: string;
  innerBg: string;
  border: string;
}

interface ColorItem {
  urdu: string;
  english: string;
  colorHex: string;
  border: string;
}

const shapesData: ShapeItem[] = [
  { urdu: 'تکون', english: 'Triangle', svg: 'triangle', color: '#10b981', innerBg: '#e6f4ea', border: '#a7f3d0' },
  { urdu: 'مربع', english: 'Square', svg: 'square', color: '#0ea5e9', innerBg: '#e0f2fe', border: '#bae6fd' },
  { urdu: 'دائرہ', english: 'Circle', svg: 'circle', color: '#f43f5e', innerBg: '#ffe4e6', border: '#fecdd3' },
  { urdu: 'دل', english: 'Heart', svg: 'heart', color: '#ec4899', innerBg: '#fce7f3', border: '#fbcfe8' },
  { urdu: 'مستطیل', english: 'Rectangle', svg: 'rectangle', color: '#a855f7', innerBg: '#f3e8ff', border: '#e9d5ff' },
  { urdu: 'ستارہ', english: 'Star', svg: 'star', color: '#eab308', innerBg: '#fef9c3', border: '#fef08a' },
  { urdu: 'بیضوی', english: 'Oval', svg: 'oval', color: '#f97316', innerBg: '#ffedd5', border: '#fed7aa' },
  { urdu: 'ہلال', english: 'Crescent', svg: 'crescent', color: '#06b6d4', innerBg: '#cffaff', border: '#a5f3fc' },
  { urdu: 'ہیرا', english: 'Diamond', svg: 'diamond', color: '#8b5cf6', innerBg: '#ede9fe', border: '#ddd6fe' },
  { urdu: 'شش ضلعی', english: 'Hexagon', svg: 'hexagon', color: '#14b8a6', innerBg: '#ccfbf1', border: '#99f6e4' },
  { urdu: 'پنج ضلعی', english: 'Pentagon', svg: 'pentagon', color: '#f59e0b', innerBg: '#fef3c7', border: '#fde68a' },
  { urdu: 'مکعب', english: 'Cube', svg: 'cube', color: '#6366f1', innerBg: '#e0e7ff', border: '#c7d2fe' },
  { urdu: 'نصف دائرہ', english: 'Semicircle', svg: 'semicircle', color: '#84cc16', innerBg: '#ecfccb', border: '#bef264' },
  { urdu: 'ذوزنقہ', english: 'Trapezoid', svg: 'trapezoid', color: '#e11d48', innerBg: '#ffe4e6', border: '#fda4af' }
];

const colorsData: ColorItem[] = [
  { urdu: 'سرخ', english: 'Red', colorHex: '#ef4444', border: '#fca5a5' },
  { urdu: 'نیلا', english: 'Blue', colorHex: '#3b82f6', border: '#93c5fd' },
  { urdu: 'سبز', english: 'Green', colorHex: '#22c55e', border: '#86efac' },
  { urdu: 'پیلا', english: 'Yellow', colorHex: '#eab308', border: '#fef08a' },
  { urdu: 'گلابی', english: 'Pink', colorHex: '#ec4899', border: '#fbcfe8' },
  { urdu: 'جامنی', english: 'Purple', colorHex: '#a855f7', border: '#e9d5ff' },
  { urdu: 'نارنجی', english: 'Orange', colorHex: '#f97316', border: '#fed7aa' },
  { urdu: 'سیاہ', english: 'Black', colorHex: '#18181b', border: '#d4d4d8' },
  { urdu: 'سفید', english: 'White', colorHex: '#ffffff', border: '#e5e7eb' },
  { urdu: 'بھورا', english: 'Brown', colorHex: '#78350f', border: '#fde68a' },
  { urdu: 'سرمئی', english: 'Grey', colorHex: '#6b7280', border: '#d1d5db' },
  { urdu: 'فیروزی', english: 'Turquoise', colorHex: '#14b8a6', border: '#99f6e4' },
  { urdu: 'سنہری', english: 'Golden', colorHex: '#d97706', border: '#fcd34d' },
  { urdu: 'آسمانی', english: 'Sky Blue', colorHex: '#38bdf8', border: '#bae6fd' },
  { urdu: 'گہرا نیلا', english: 'Navy Blue', colorHex: '#1e3a8a', border: '#93c5fd' },
  { urdu: 'زیتونی', english: 'Olive', colorHex: '#65a30d', border: '#bef264' },
  { urdu: 'عنابی', english: 'Maroon', colorHex: '#991b1b', border: '#fca5a5' },
  { urdu: 'ہلکا جامنی', english: 'Lavender', colorHex: '#c4b5fd', border: '#ddd6fe' },
  { urdu: 'چاندی', english: 'Silver', colorHex: '#a1a1aa', border: '#d4d4d8' },
  { urdu: 'نارنجی سرخ', english: 'Coral', colorHex: '#fb7185', border: '#fecdd3' },
  { urdu: 'ہلکا سبز', english: 'Mint', colorHex: '#6ee7b7', border: '#a7f3d0' },
  { urdu: 'لیموں سبز', english: 'Lime', colorHex: '#a3e635', border: '#d9f99d' },
  { urdu: 'بادامی', english: 'Beige', colorHex: '#d6b98c', border: '#f5deb3' },
  { urdu: 'گہرا گلابی', english: 'Magenta', colorHex: '#c026d3', border: '#f0abfc' }
];

type Tab = 'shapes' | 'colors';

function ShapeVisual({ shape }: { shape: ShapeItem }) {
  const common = { fill: shape.color, stroke: shape.color, strokeWidth: 2 };

  switch (shape.svg) {
    case 'triangle': return <polygon points="50,8 91,88 9,88" {...common} />;
    case 'square': return <rect x="15" y="15" width="70" height="70" rx="5" {...common} />;
    case 'circle': return <circle cx="50" cy="50" r="37" {...common} />;
    case 'heart': return <path d="M50 86 C43 78 16 62 16 38 C16 18 40 13 50 31 C60 13 84 18 84 38 C84 62 57 78 50 86Z" {...common} />;
    case 'rectangle': return <rect x="9" y="27" width="82" height="46" rx="5" {...common} />;
    case 'star': return <polygon points="50,8 61,38 93,39 67,57 76,88 50,70 24,88 33,57 7,39 39,38" {...common} />;
    case 'oval': return <ellipse cx="50" cy="50" rx="41" ry="28" {...common} />;
    case 'crescent': return <path d="M68 12 A38 38 0 1 0 68 88 A29 29 0 1 1 68 12Z" {...common} />;
    case 'diamond': return <polygon points="50,8 89,50 50,92 11,50" {...common} />;
    case 'hexagon': return <polygon points="25,10 75,10 94,50 75,90 25,90 6,50" {...common} />;
    case 'pentagon': return <polygon points="50,8 92,40 76,90 24,90 8,40" {...common} />;
    case 'cube': return <path d="M50 8 L88 29 L88 71 L50 92 L12 71 L12 29 Z M50 8 V50 M12 29 L50 50 L88 29 M50 50 V92" fill="none" stroke={shape.color} strokeWidth="5" strokeLinejoin="round" />;
    case 'semicircle': return <path d="M10 55 A40 40 0 0 1 90 55 Z" {...common} />;
    case 'trapezoid': return <polygon points="27,15 73,15 92,85 8,85" {...common} />;
  }
}

export default function ShapesLearning({ onBack }: ColorsShapesLearningProps) {
  const [activeTab, setActiveTab] = useState<Tab>('shapes');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const playBothLanguages = (urduText: string, englishText: string) => {
    setSelectedItem(urduText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const urduUtterance = new SpeechSynthesisUtterance(urduText);
      urduUtterance.lang = 'ur-PK';
      urduUtterance.rate = 0.8;
      urduUtterance.pitch = 1;
      const urduVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('ur'));
      if (urduVoice) urduUtterance.voice = urduVoice;
      urduUtterance.onend = () => {
        const englishUtterance = new SpeechSynthesisUtterance(englishText);
        englishUtterance.lang = 'en-US';
        englishUtterance.rate = 0.9;
        const englishVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('en'));
        if (englishVoice) englishUtterance.voice = englishVoice;
        window.speechSynthesis.speak(englishUtterance);
      };
      window.speechSynthesis.speak(urduUtterance);
    }
  };

  return (
    <div dir="rtl" className="shapes-page min-h-screen text-slate-800 pb-12">
      <header className="shapes-header bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16">
          <button onClick={onBack} className="shapes-back flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold transition">
            <ArrowRight className="w-5 h-5" />
            واپس جائیں
          </button>
          <div className="shapes-title flex items-center gap-2">
            <Shapes className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-extrabold text-slate-800">رنگ اور اشکال</h1>
          </div>
          <div />
        </div>
      </header>

      <main className="shapes-content mx-auto pt-8">
        <p className="shapes-kicker">سیکھیں اور پہچانیں</p>
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-200 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('shapes'); setSelectedItem(null); }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition ${activeTab === 'shapes' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-300'}`}
            >
              <Shapes className="w-5 h-5" />
              اشکال (Shapes)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('colors'); setSelectedItem(null); }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition ${activeTab === 'colors' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-300'}`}
            >
              <Palette className="w-5 h-5" />
              رنگ (Colors)
            </button>
          </div>
        </div>

        {activeTab === 'shapes' ? (
          <div className="cards-container">
            {shapesData.map((shape) => (
              <div
                key={shape.english}
                onClick={() => playBothLanguages(shape.urdu, shape.english)}
                className="card-frame"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') playBothLanguages(shape.urdu, shape.english); }}
                style={{ backgroundColor: selectedItem === shape.urdu ? '#f0fdf4' : '#ffffff', borderRadius: '20px', border: `2px solid ${shape.border}`, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: selectedItem === shape.urdu ? `0 8px 20px ${shape.border}` : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              >
                <div style={{ backgroundColor: shape.innerBg, borderRadius: '16px', width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg viewBox="0 0 100 100" aria-label={shape.english} role="img" style={{ width: '110px', height: '110px' }}>{ShapeVisual({ shape })}</svg>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#1f2937' }}>{shape.urdu}</h3>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>🔊 {shape.english}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cards-container">
            {colorsData.map((color) => (
              <div
                key={color.english}
                onClick={() => playBothLanguages(color.urdu, color.english)}
                className="card-frame color-card"
                role="button"
                tabIndex={0}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') playBothLanguages(color.urdu, color.english); }}
                style={{ backgroundColor: selectedItem === color.urdu ? '#f0fdf4' : '#ffffff', borderRadius: '20px', border: `2px solid ${color.border}`, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: selectedItem === color.urdu ? `0 8px 20px ${color.border}` : '0 4px 6px -1px rgba(51,65,85,0.05)' }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: color.colorHex, border: color.colorHex === '#ffffff' ? '2px solid #e5e7eb' : 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '16px' }} />
                <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#1f2937' }}>{color.urdu}</h3>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>🔊 {color.english}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
