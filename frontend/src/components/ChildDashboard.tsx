import { useEffect, useState } from 'react';
import { BookOpen, Shapes, Palette, LogOut, Star, Trophy, Sparkles, Award } from 'lucide-react';
import UrduGames from './UrduGames';
import HaroofLearning from './HaroofLearning';
import { getDashboard, type DashboardData, type UserStats } from '../api';

interface ChildDashboardProps {
  onNavigate: (viewId: string) => void;
  onLogout: () => void;
}

export default function ChildDashboard({ onNavigate, onLogout }: ChildDashboardProps) {
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'urdu-games' | 'haroof-learning'>('dashboard');
  const [selectedGameType, setSelectedGameType] = useState<'match' | 'color'>('match');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const refreshDashboard = (updatedStats?: UserStats | null) => {
    if (updatedStats) {
      setDashboard((current) => current ? {
        ...current,
        stats: updatedStats,
        totalPoints: updatedStats.totalPoints,
        totalStars: updatedStats.totalStars,
        completedGames: updatedStats.completedGames,
        completedLessons: updatedStats.completedLessons
      } : current);
      void getDashboard().then(setDashboard).catch(() => {});
      return;
    }
    setIsLoading(true);
    setLoadError('');
    void getDashboard()
      .then(setDashboard)
      .catch(() => setLoadError('ڈیش بورڈ کا ڈیٹا لوڈ نہیں ہو سکا۔'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  if (isLoading && !dashboard) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-lg font-bold text-slate-600">ڈیش بورڈ لوڈ ہو رہا ہے...</div>;
  }

  if (loadError && !dashboard) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-bold text-rose-600">{loadError}</p>
        <button onClick={() => refreshDashboard()} className="bg-sky-500 text-white px-5 py-3 rounded-xl font-bold">دوبارہ کوشش کریں</button>
      </div>
    );
  }

  const categories = [
    {
      id: 'haroof',
      title: 'اردو حروف',
      desc: '39 اردو حروف اور ان کی تصویریں',
      icon: BookOpen,
      color: 'bg-sky-500 text-white',
      badge: 'سب سے اہم',
      badgeColor: 'bg-sky-100 text-sky-700',
      action: () => {
        setActiveScreen('haroof-learning');
      }
    },
    {
      id: 'color-game',
      title: 'رنگوں کی پہچان',
      desc: 'پوچھے گئے صحیح رنگ پر کلک کریں',
      icon: Shapes,
      color: 'bg-rose-500 text-white',
      badge: 'دلچسپ',
      badgeColor: 'bg-rose-100 text-rose-700',
      action: () => {
        setSelectedGameType('color');
        setActiveScreen('urdu-games');
      }
    },
    {
      id: 'shapes',
      title: 'رنگ اور اشکال',
      desc: 'رنگوں اور اشکال کی پہچان',
      icon: Shapes,
      color: 'bg-emerald-500 text-white',
      badge: 'آسان',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      action: () => onNavigate('shapes')
    },
    {
      id: 'drawing',
      title: 'ڈرائنگ بورڈ',
      desc: 'تصویریں بنائیں، رنگ بھریں',
      icon: Palette,
      color: 'bg-amber-500 text-white',
      badge: 'کریٹیوٹی',
      badgeColor: 'bg-amber-100 text-amber-700',
      action: () => onNavigate('drawing')
    }
  ];

  if (activeScreen === 'urdu-games') {
    return (
      <UrduGames 
        onBack={() => setActiveScreen('dashboard')} 
        onScoreSaved={refreshDashboard}
        initialGame={selectedGameType} 
      />
    );
  }

  if (activeScreen === 'haroof-learning') {
    return (
      <HaroofLearning 
        onBack={() => setActiveScreen('dashboard')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dir-rtl font-sans pb-12">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Header Logo */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <img 
                src="/logo.jpg" 
                alt="علمستان لوگو" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-sky-600 leading-tight">علمستان</h1>
              <p className="text-xs text-slate-500 font-bold">پڑھیں، سمجھیں، آگے بڑھیں</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Gamification Badges */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-700 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>ستارے: {dashboard?.stats.totalStars ?? dashboard?.totalStars ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl text-purple-700 font-bold text-sm">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>کھیل: {dashboard?.stats.completedGames ?? 0} | اسباق: {dashboard?.stats.completedLessons ?? 0}</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              لاگ آؤٹ
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-4 h-4" />
              پرسکون ماحول
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mb-2">خوش آمدید، {dashboard?.user.name ?? 'سیکھنے والے'}! ✨</h2>
            <p className="text-white/90 text-base font-medium">
              آج آپ کیا سیکھنا چاہتے ہیں؟ نیچے دیے گئے کسی بھی زمرے پر کلک کریں۔
            </p>
          </div>

          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full p-1 shadow-xl flex items-center justify-center border-4 border-white/30 shrink-0 overflow-hidden">
            <img 
              src="/logo.jpg" 
              alt="علمستان لوگو" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="absolute top-1/2 -left-10 -translate-y-1/2 opacity-20 pointer-events-none">
            <Award className="w-64 h-64" />
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="کارکردگی کا خلاصہ">
          {[
            { label: 'کل ستارے', value: dashboard?.totalStars ?? dashboard?.stats.totalStars ?? 0, icon: Star, color: 'text-amber-600 bg-amber-50 border-amber-200' },
            { label: 'مکمل سرگرمیاں', value: dashboard?.completedGames ?? dashboard?.stats.completedGames ?? 0, icon: Trophy, color: 'text-sky-600 bg-sky-50 border-sky-200' },
            { label: 'اوسط فیصد', value: `${dashboard?.averagePercentage ?? 0}%`, icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
            { label: 'حالیہ کامیابیاں', value: dashboard?.recentActivities.length ?? 0, icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' }
          ].map((summary) => (
            <div key={summary.label} className={`rounded-2xl border p-5 shadow-sm ${summary.color}`}>
              <div className="flex items-center justify-between gap-3">
                <summary.icon className="w-8 h-8" />
                <div className="text-right">
                  <p className="text-sm font-bold opacity-80">{summary.label}</p>
                  <p className="text-3xl font-black mt-1">{summary.value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Categories Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
            تعلیمی زمرے
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={cat.action}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl ${cat.color} shadow-sm group-hover:scale-110 transition`}>
                      <IconComp className="w-8 h-8" />
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-sky-600 transition">
                      {cat.title}
                    </h4>
                    <p className="text-slate-500 text-sm font-medium">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-800 mb-4">حالیہ تاریخچہ</h3>
          {dashboard?.recentScores.length ? (
            <div className="space-y-3">
              {dashboard.recentScores.map((game) => (
                <div key={game._id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-right">
                  <div>
                    <p className="font-bold text-slate-700">{game.gameName}</p>
                    <p className="text-sm text-slate-500">{game.score}/{game.totalQuestions} ({game.percentage}%)</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className="font-bold text-sky-600">{game.pointsEarned} پوائنٹس</span>
                    <span className="mx-2">|</span>
                    {new Date(game.playedAt).toLocaleDateString('ur-PK')}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-slate-500">ابھی کوئی اسکور موجود نہیں۔</p>}
        </div>
      </main>
    </div>
  );
}