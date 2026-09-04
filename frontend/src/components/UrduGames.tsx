import { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, Trophy, Star, Check, X } from 'lucide-react';
import { saveGameScore, type UserStats } from '../api';
import { playLetterAudio, playSpokenText, urduAlphabet, type UrduLetter } from '../data/urduAlphabet';

interface UrduGamesProps {
  onBack: () => void;
  onScoreSaved?: (stats: UserStats | null) => void;
  initialGame?: 'match' | 'color';
}

type HarfItem = UrduLetter;

interface ColorItem {
  colorName: string;
  colorHex: string;
}

const huroofData = urduAlphabet;

const explicitColors: ColorItem[] = [
  { colorName: 'نیلا', colorHex: '#3B82F6' },
  { colorName: 'سرخ', colorHex: '#EF4444' },
  { colorName: 'ہرا', colorHex: '#10B981' },
  { colorName: 'پیلا', colorHex: '#FBBF24' },
  { colorName: 'جامنی', colorHex: '#8B5CF6' },
  { colorName: 'بھورا', colorHex: '#78350F' }
];

const STARS_PER_CORRECT = 20;
const TARGET_STARS = 100;
const QUESTIONS_TO_WIN = TARGET_STARS / STARS_PER_CORRECT;
const FEEDBACK_DELAY_MS = 1400;

function LetterPicture({ item }: { item: HarfItem }) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    setShowFallback(false);
  }, [item.harf]);

  if (showFallback) {
    return <span className="text-7xl leading-none">{item.icon}</span>;
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      className="w-24 h-24 object-contain"
      onError={() => setShowFallback(true)}
    />
  );
}

export default function UrduGames({ onBack, onScoreSaved, initialGame = 'match' }: UrduGamesProps) {
  const [activeGame, setActiveGame] = useState<'match' | 'color'>(initialGame);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Game States
  const [targetMatchItem, setTargetMatchItem] = useState<HarfItem | null>(null);
  const [matchOptions, setMatchOptions] = useState<HarfItem[]>([]);
  
  const [targetColorItem, setTargetColorItem] = useState<ColorItem | null>(null);
  const [colorOptions, setColorOptions] = useState<ColorItem[]>([]);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Setup Match Game
  const setupMatchGame = () => {
    setSelectedAnswer(null);
    setFeedback('تصویر دیکھ کر اس کا پہلا حرف تلاش کریں! 🧩');
    const correct = huroofData[Math.floor(Math.random() * huroofData.length)];
    const wrongs = huroofData.filter(i => i.harf !== correct.harf).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTargetMatchItem(correct);
    setMatchOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    playLetterAudio(correct.harf, `یہ ہے ${correct.name}۔ اس کا پہلا حرف تلاش کریں`);
  };

  // Setup Color Game
  const setupColorGame = () => {
    setSelectedAnswer(null);
    setFeedback('پوچھے گئے رنگ پر کلک کریں! 🔴');
    const correct = explicitColors[Math.floor(Math.random() * explicitColors.length)];
    const wrongs = explicitColors.filter(c => c.colorName !== correct.colorName).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTargetColorItem(correct);
    setColorOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    playSpokenText(`رنگ ${correct.colorName} پر کلک کریں`);
  };

  useEffect(() => {
    setIsGameOver(false);
    setStars(0);
    if (activeGame === 'match') setupMatchGame();
    if (activeGame === 'color') setupColorGame();
  }, [activeGame]);

  const currentGameName = () => (activeGame === 'match' ? 'حروف اور تصویر' : 'رنگوں کی پہچان');

  const syncStarsWithBackend = (newStars: number, didWin: boolean) => {
    void saveGameScore({
      gameName: currentGameName(),
      score: newStars,
      pointsEarned: STARS_PER_CORRECT,
      correctAnswers: 1,
      totalQuestions: QUESTIONS_TO_WIN,
      completionId: crypto.randomUUID(),
      completed: didWin
    })
      .then((result) => onScoreSaved?.(result.stats))
      .catch(() => {
        if (didWin) setFeedback('اسکور محفوظ نہیں ہو سکا، براہ کرم دوبارہ کوشش کریں۔');
      })
      .finally(() => {
        if (didWin) setIsSaving(false);
      });
  };

  const awardCorrectAnswer = (setupNext: () => void) => {
    const newStars = stars + STARS_PER_CORRECT;
    setStars(newStars);
    setFeedback('بہت اعلیٰ! بالکل صحیح جواب ہے 🎉 ⭐');
    playSpokenText('بہت اعلیٰ! بالکل صحیح جواب ہے');

    const didWin = newStars >= TARGET_STARS;
    if (didWin) setIsSaving(true);
    syncStarsWithBackend(newStars, didWin);

    if (didWin) {
      setTimeout(() => {
        setIsGameOver(true);
        setFeedback('🏆 کمال کر دیا! آپ جیت گئے!');
      }, FEEDBACK_DELAY_MS);
    } else {
      setTimeout(setupNext, FEEDBACK_DELAY_MS);
    }
  };

  const handleMatchAnswer = (chosen: HarfItem) => {
    if (selectedAnswer || isGameOver || !targetMatchItem) return;
    setSelectedAnswer(chosen.harf);

    if (chosen.harf === targetMatchItem.harf) {
      awardCorrectAnswer(setupMatchGame);
    } else {
      setFeedback('اوہو! یہ غلط جواب ہے۔ دوبارہ کوشش کریں 💪');
      playSpokenText('اوہو! یہ غلط جواب ہے۔ دوبارہ کوشش کریں');
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback('صحیح حرف چنیں 👇');
      }, FEEDBACK_DELAY_MS);
    }
  };

  const handleColorAnswer = (chosen: ColorItem) => {
    if (selectedAnswer || isGameOver || !targetColorItem) return;
    setSelectedAnswer(chosen.colorName);

    if (chosen.colorName === targetColorItem.colorName) {
      awardCorrectAnswer(setupColorGame);
    } else {
      setFeedback('اوہو! یہ غلط جواب ہے۔ دوبارہ کوشش کریں 💪');
      playSpokenText('اوہو! یہ غلط جواب ہے۔ دوبارہ کوشش کریں');
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback('صحیح رنگ چنیں 👇');
      }, FEEDBACK_DELAY_MS);
    }
  };

  const resetCurrentGame = () => {
    setStars(0);
    setIsGameOver(false);
    setIsSaving(false);
    if (activeGame === 'match') setupMatchGame();
    if (activeGame === 'color') setupColorGame();
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 dir-rtl font-sans flex flex-col p-4 md:p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between mb-6 bg-white p-4 rounded-3xl shadow-sm border border-sky-100">
        <button
          onClick={onBack}
          className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition text-slate-700 flex items-center gap-2 font-bold"
        >
          <ArrowRight className="w-5 h-5" />
          <span>واپس</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 px-4 py-2 rounded-2xl text-amber-800 font-black">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          <span>ستارے: {stars}</span>
        </div>
      </header>

      {/* Tabs Switcher */}
      <div className="max-w-md mx-auto w-full flex gap-3 mb-6">
        <button
          onClick={() => setActiveGame('match')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm transition shadow-sm ${
            activeGame === 'match'
              ? 'bg-blue-600 text-white shadow-blue-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          🧩 حروف اور تصویر
        </button>
        <button
          onClick={() => setActiveGame('color')}
          className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm transition shadow-sm ${
            activeGame === 'color'
              ? 'bg-rose-500 text-white shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          🔴 رنگوں کی پہچان
        </button>
      </div>

      {/* Game Card */}
      <main className="max-w-md mx-auto w-full bg-white p-6 rounded-3xl border-2 border-sky-200 shadow-lg text-center">
        {/* Feedback Message */}
        <div className="min-h-[48px] flex items-center justify-center mb-4">
          <p className="text-lg font-black text-slate-700 leading-snug">{feedback}</p>
        </div>

        {/* Game Over Screen */}
        {isGameOver ? (
          <div className="py-8 space-y-4">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-emerald-600">مبارک ہو! 🎉</h3>
            <p className="text-sm font-bold text-slate-500">آپ نے {TARGET_STARS} ستارے مکمل کر لیے ہیں!</p>
            {isSaving && <p className="text-sm font-bold text-sky-600">اسکور محفوظ کیا جا رہا ہے...</p>}
            <button
              onClick={resetCurrentGame}
              className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-md transition flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              <span>دوبارہ کھیلیں</span>
            </button>
          </div>
        ) : (
          <>
            {/* Match Game */}
            {activeGame === 'match' && targetMatchItem && (
              <div className="space-y-6">
                <div className="w-36 h-36 bg-sky-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-sky-100">
                  <LetterPicture item={targetMatchItem} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {matchOptions.map((opt) => {
                    const isSelected = selectedAnswer === opt.harf;
                    const isCorrect = isSelected && opt.harf === targetMatchItem.harf;
                    return (
                      <div key={opt.harf} className="relative">
                        <button
                          onClick={() => handleMatchAnswer(opt)}
                          className={`w-full py-4 text-3xl font-black rounded-2xl border-2 transition transform active:scale-95 ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : 'bg-rose-500 border-rose-600 text-white'
                              : 'bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-800'
                          }`}
                        >
                          {opt.harf}
                        </button>
                        {isSelected && (
                          <div className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
                            isCorrect ? 'bg-emerald-500/70' : 'bg-rose-500/70'
                          }`}>
                            {isCorrect ? (
                              <Check className="w-10 h-10 text-white font-black" strokeWidth={4} />
                            ) : (
                              <X className="w-10 h-10 text-white font-black" strokeWidth={4} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Game */}
            {activeGame === 'color' && targetColorItem && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-500 block mb-1">رنگ تلاش کریں:</span>
                  <span className="text-2xl font-black text-indigo-600 underline">
                    {targetColorItem.colorName}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 py-2 justify-items-center">
                  {colorOptions.map((opt, idx) => {
                    const isSelected = selectedAnswer === opt.colorName;
                    const isCorrect = isSelected && opt.colorName === targetColorItem.colorName;
                    return (
                      <div key={idx} className="relative">
                        <button
                          onClick={() => handleColorAnswer(opt)}
                          style={{ backgroundColor: opt.colorHex }}
                          className={`w-20 h-20 rounded-full border-4 border-white shadow-md transition transform hover:scale-105 active:scale-95 ${
                            isSelected ? 'ring-4 ring-indigo-500 scale-105' : ''
                          }`}
                        />
                        {isSelected && (
                          <div className={`absolute inset-0 flex items-center justify-center rounded-full ${
                            isCorrect ? 'bg-emerald-500/70' : 'bg-rose-500/70'
                          }`}>
                            {isCorrect ? (
                              <Check className="w-10 h-10 text-white font-black" strokeWidth={4} />
                            ) : (
                              <X className="w-10 h-10 text-white font-black" strokeWidth={4} />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}