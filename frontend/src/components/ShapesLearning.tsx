import { useRef, useState } from 'react';
import { ArrowRight, Palette, Shapes } from 'lucide-react';

interface ColorsShapesLearningProps {
  onBack: () => void;
  onScoreSaved?: () => void;
}

interface ShapeItem {
  id: string;
  urduName: string;
  englishName: string;
  type: 'shape';
  svg: 'triangle' | 'square' | 'circle' | 'heart' | 'rectangle' | 'star' | 'oval' | 'crescent' | 'diamond' | 'hexagon' | 'pentagon' | 'cube' | 'semicircle' | 'trapezoid';
  color: string;
  innerBg: string;
  border: string;
}

interface ColorItem {
  id: string;
  urduName: string;
  englishName: string;
  type: 'color';
  colorHex: string;
  border: string;
}

const shapesData: ShapeItem[] = [
  { id: 'shape-triangle', urduName: 'تکون', englishName: 'Triangle', type: 'shape', svg: 'triangle', color: '#10b981', innerBg: '#e6f4ea', border: '#a7f3d0' },
  { id: 'shape-square', urduName: 'مربع', englishName: 'Square', type: 'shape', svg: 'square', color: '#0ea5e9', innerBg: '#e0f2fe', border: '#bae6fd' },
  { id: 'shape-circle', urduName: 'دائرہ', englishName: 'Circle', type: 'shape', svg: 'circle', color: '#f43f5e', innerBg: '#ffe4e6', border: '#fecdd3' },
  { id: 'shape-heart', urduName: 'دل', englishName: 'Heart', type: 'shape', svg: 'heart', color: '#ec4899', innerBg: '#fce7f3', border: '#fbcfe8' },
  { id: 'shape-rectangle', urduName: 'مستطیل', englishName: 'Rectangle', type: 'shape', svg: 'rectangle', color: '#a855f7', innerBg: '#f3e8ff', border: '#e9d5ff' },
  { id: 'shape-star', urduName: 'ستارہ', englishName: 'Star', type: 'shape', svg: 'star', color: '#eab308', innerBg: '#fef9c3', border: '#fef08a' },
  { id: 'shape-oval', urduName: 'بیضوی', englishName: 'Oval', type: 'shape', svg: 'oval', color: '#f97316', innerBg: '#ffedd5', border: '#fed7aa' },
  { id: 'shape-crescent', urduName: 'ہلال', englishName: 'Crescent', type: 'shape', svg: 'crescent', color: '#06b6d4', innerBg: '#cffaff', border: '#a5f3fc' },
  { id: 'shape-diamond', urduName: 'ہیرا', englishName: 'Diamond', type: 'shape', svg: 'diamond', color: '#8b5cf6', innerBg: '#ede9fe', border: '#ddd6fe' },
  { id: 'shape-hexagon', urduName: 'شش ضلعی', englishName: 'Hexagon', type: 'shape', svg: 'hexagon', color: '#14b8a6', innerBg: '#ccfbf1', border: '#99f6e4' },
  { id: 'shape-pentagon', urduName: 'پنج ضلعی', englishName: 'Pentagon', type: 'shape', svg: 'pentagon', color: '#f59e0b', innerBg: '#fef3c7', border: '#fde68a' },
  { id: 'shape-cube', urduName: 'مکعب', englishName: 'Cube', type: 'shape', svg: 'cube', color: '#6366f1', innerBg: '#e0e7ff', border: '#c7d2fe' },
  { id: 'shape-semicircle', urduName: 'نصف دائرہ', englishName: 'Semicircle', type: 'shape', svg: 'semicircle', color: '#84cc16', innerBg: '#ecfccb', border: '#bef264' },
  { id: 'shape-trapezoid', urduName: 'ذوزنقہ', englishName: 'Trapezoid', type: 'shape', svg: 'trapezoid', color: '#e11d48', innerBg: '#ffe4e6', border: '#fda4af' }
];

const colorsData: ColorItem[] = [
  { id: 'color-red', urduName: 'سرخ', englishName: 'Red', type: 'color', colorHex: '#ef4444', border: '#fca5a5' },
  { id: 'color-blue', urduName: 'نیلا', englishName: 'Blue', type: 'color', colorHex: '#3b82f6', border: '#93c5fd' },
  { id: 'color-green', urduName: 'سبز', englishName: 'Green', type: 'color', colorHex: '#22c55e', border: '#86efac' },
  { id: 'color-yellow', urduName: 'پیلا', englishName: 'Yellow', type: 'color', colorHex: '#eab308', border: '#fef08a' },
  { id: 'color-pink', urduName: 'گلابی', englishName: 'Pink', type: 'color', colorHex: '#ec4899', border: '#fbcfe8' },
  { id: 'color-purple', urduName: 'جامنی', englishName: 'Purple', type: 'color', colorHex: '#a855f7', border: '#e9d5ff' },
  { id: 'color-orange', urduName: 'نارنجی', englishName: 'Orange', type: 'color', colorHex: '#f97316', border: '#fed7aa' },
  { id: 'color-black', urduName: 'سیاہ', englishName: 'Black', type: 'color', colorHex: '#18181b', border: '#d4d4d8' },
  { id: 'color-white', urduName: 'سفید', englishName: 'White', type: 'color', colorHex: '#ffffff', border: '#e5e7eb' },
  { id: 'color-brown', urduName: 'بھورا', englishName: 'Brown', type: 'color', colorHex: '#78350f', border: '#fde68a' },
  { id: 'color-grey', urduName: 'سرمئی', englishName: 'Grey', type: 'color', colorHex: '#6b7280', border: '#d1d5db' },
  { id: 'color-turquoise', urduName: 'فیروزی', englishName: 'Turquoise', type: 'color', colorHex: '#14b8a6', border: '#99f6e4' },
  { id: 'color-golden', urduName: 'سنہری', englishName: 'Golden', type: 'color', colorHex: '#d97706', border: '#fcd34d' },
  { id: 'color-sky-blue', urduName: 'آسمانی', englishName: 'Sky Blue', type: 'color', colorHex: '#38bdf8', border: '#bae6fd' },
  { id: 'color-navy-blue', urduName: 'گہرا نیلا', englishName: 'Navy Blue', type: 'color', colorHex: '#1e3a8a', border: '#93c5fd' },
  { id: 'color-olive', urduName: 'زیتونی', englishName: 'Olive', type: 'color', colorHex: '#65a30d', border: '#bef264' },
  { id: 'color-maroon', urduName: 'عنابی', englishName: 'Maroon', type: 'color', colorHex: '#991b1b', border: '#fca5a5' },
  { id: 'color-lavender', urduName: 'ہلکا جامنی', englishName: 'Lavender', type: 'color', colorHex: '#c4b5fd', border: '#ddd6fe' },
  { id: 'color-silver', urduName: 'چاندی', englishName: 'Silver', type: 'color', colorHex: '#a1a1aa', border: '#d4d4d8' },
  { id: 'color-coral', urduName: 'نارنجی سرخ', englishName: 'Coral', type: 'color', colorHex: '#fb7185', border: '#fecdd3' },
  { id: 'color-mint', urduName: 'ہلکا سبز', englishName: 'Mint', type: 'color', colorHex: '#6ee7b7', border: '#a7f3d0' },
  { id: 'color-lime', urduName: 'لیموں سبز', englishName: 'Lime', type: 'color', colorHex: '#a3e635', border: '#d9f99d' },
  { id: 'color-beige', urduName: 'بادامی', englishName: 'Beige', type: 'color', colorHex: '#d6b98c', border: '#f5deb3' },
  { id: 'color-magenta', urduName: 'گہرا گلابی', englishName: 'Magenta', type: 'color', colorHex: '#c026d3', border: '#f0abfc' }
];

// Files in public are served from the site root, so public/audio/file is /audio/file.
const recordedAudioPaths: Record<string, string> = {
  'shape-triangle': '/audio/tikon.mp3.ogg',
  'shape-square': '/audio/murabba.mp3.ogg',
  'shape-circle': '/audio/dairah.mp3.ogg',
  'shape-heart': '/audio/dil.mp3.ogg',
  'shape-rectangle': '/audio/mustatel.mp3.ogg',
  'shape-star': '/audio/sitara.mp3.ogg',
  'shape-oval': '/audio/baizavai.mp3.ogg',
  'shape-diamond': '/audio/heera.mp3.ogg',
  'shape-hexagon': '/audio/shash%20zalai.mp3.ogg',
  'shape-pentagon': '/audio/panj%20zalai.mp3.ogg',
  'shape-cube': '/audio/mukab.mp3.ogg',
  'shape-semicircle': '/audio/nifs%20dairah.mp3.ogg',
  'shape-trapezoid': '/audio/zauzanqa.mp3.ogg',
  'color-red': '/audio/surkh.mp3',
  'color-blue': '/audio/neela.mp3.ogg',
  'color-green': '/audio/subz.mp3.ogg',
  'color-yellow': '/audio/peela.mp3.ogg',
  'color-pink': '/audio/gulab.mp3.ogg',
  'color-purple': '/audio/jamni.mp3.ogg',
  'color-orange': '/audio/naranje.mp3.ogg',
  'color-white': '/audio/sefaid.mp3.ogg',
  'color-brown': '/audio/bhura.mp3.ogg',
  'color-grey': '/audio/surmai.mp3.ogg',
  'color-turquoise': '/audio/feroze.mp3.ogg',
  'color-golden': '/audio/sunehri.mp3.ogg',
  'color-sky-blue': '/audio/asmane.mp3.ogg',
  'color-navy-blue': '/audio/gehra%20neela.mp3.ogg',
  'color-olive': '/audio/zaitoni.mp3.ogg',
  'color-maroon': '/audio/unabi.mp3.ogg',
  'color-lavender': '/audio/halka%20jamni.mp3.ogg',
  'color-silver': '/audio/chandni.mp3.ogg',
  'color-coral': '/audio/naranje%20surkh.mp3.ogg',
  'color-mint': '/audio/halka%20subz.mp3.ogg',
  'color-lime': '/audio/lemo%20subz.mp3.ogg',
  'color-beige': '/audio/badami.mp3.ogg',
  'color-magenta': '/audio/gehra%20gulabi.mp3.ogg'
};

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
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const playbackIdRef = useRef(0);

  const playItemAudio = (item: ShapeItem | ColorItem) => {
    const playbackId = ++playbackIdRef.current;
    const audioUrl = recordedAudioPaths[item.id];
    setPlayingItemId(item.id);
    if (activeAudioRef.current) {
      activeAudioRef.current.onended = null;
      activeAudioRef.current.onerror = null;
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
    }
    activeAudioRef.current = null;
    if (!audioUrl) {
      setPlayingItemId(null);
      return;
    }

    const audio = new Audio(audioUrl);
    activeAudioRef.current = audio;

    const handleAudioError = () => {
      if (playbackId !== playbackIdRef.current) return;
      console.error(`Could not load Urdu audio for ${item.englishName}: ${audioUrl}`);
      if (activeAudioRef.current === audio) activeAudioRef.current = null;
      setPlayingItemId(null);
    };

    audio.onended = () => {
      if (activeAudioRef.current === audio) {
        activeAudioRef.current = null;
        setPlayingItemId(null);
      }
    };
    audio.onerror = handleAudioError;
    void audio.play().catch(handleAudioError);
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
              onClick={() => { setActiveTab('shapes'); setPlayingItemId(null); }}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 font-bold transition ${activeTab === 'shapes' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-300'}`}
            >
              <Shapes className="w-5 h-5" />
              اشکال (Shapes)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('colors'); setPlayingItemId(null); }}
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
                key={shape.id}
                onClick={() => playItemAudio(shape)}
                className={`card-frame${playingItemId === shape.id ? ' is-playing' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${shape.englishName}, ${shape.urduName}`}
                aria-pressed={playingItemId === shape.id}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); playItemAudio(shape); } }}
                style={{ backgroundColor: playingItemId === shape.id ? '#f0fdf4' : '#ffffff', borderRadius: '20px', border: `2px solid ${shape.border}`, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: playingItemId === shape.id ? `0 8px 20px ${shape.border}` : '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
              >
                <div style={{ backgroundColor: shape.innerBg, borderRadius: '16px', width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg viewBox="0 0 100 100" aria-hidden="true" style={{ width: '110px', height: '110px' }}>{ShapeVisual({ shape })}</svg>
                </div>
                <h3 lang="ur" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', Tahoma, Arial, sans-serif", fontSize: '22px', fontWeight: 'bold', lineHeight: 1.7, margin: '4px 0', color: '#1f2937' }}>{shape.urduName}</h3>
                <span lang="en" dir="ltr" style={{ fontSize: '14px', color: '#6b7280' }}>🔊 {shape.englishName}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cards-container">
            {colorsData.map((color) => (
              <div
                key={color.id}
                onClick={() => playItemAudio(color)}
                className={`card-frame color-card${playingItemId === color.id ? ' is-playing' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${color.englishName}, ${color.urduName}`}
                aria-pressed={playingItemId === color.id}
                onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); playItemAudio(color); } }}
                style={{ backgroundColor: playingItemId === color.id ? '#f0fdf4' : '#ffffff', borderRadius: '20px', border: `2px solid ${color.border}`, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: playingItemId === color.id ? `0 8px 20px ${color.border}` : '0 4px 6px -1px rgba(51,65,85,0.05)' }}
              >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: color.colorHex, border: color.colorHex === '#ffffff' ? '2px solid #e5e7eb' : 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '16px' }} />
                <h3 lang="ur" dir="rtl" style={{ fontFamily: "'Noto Nastaliq Urdu', Tahoma, Arial, sans-serif", fontSize: '22px', fontWeight: 'bold', lineHeight: 1.7, margin: '4px 0', color: '#1f2937' }}>{color.urduName}</h3>
                <span lang="en" dir="ltr" style={{ fontSize: '14px', color: '#6b7280' }}>🔊 {color.englishName}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
