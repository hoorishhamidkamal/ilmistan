import { useEffect, useState } from 'react';
import { 
  BookOpen, Sparkles, Gamepad2, Palette, Shapes,
  UserPlus, PlayCircle, Trophy
} from 'lucide-react';
import Auth from './components/Auth';
import ChildDashboard from './components/ChildDashboard';
import HaroofLearning from './components/HaroofLearning';
import ShapesLearning from './components/ShapesLearning';
import DrawingBoard from './components/DrawingBoard';
import { getDashboard, logout, type DashboardData, type AuthUser } from './api';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'parent_dashboard' | 'child_dashboard' | 'haroof' | 'shapes' | 'drawing'>('home');
  const [parentDashboard, setParentDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (currentView === 'parent_dashboard') {
      void getDashboard().then(setParentDashboard).catch(() => setParentDashboard(null));
    }
  }, [currentView]);

  // AuthUser Object Accept Karne Ke Liye Correct Function
  const handleLoginSuccess = (user: AuthUser) => {
    if (user.role === 'parent') {
      setCurrentView('parent_dashboard');
    } else {
      setCurrentView('child_dashboard');
    }
  };

  const handleChildNavigation = (viewId: string) => {
    if (viewId === 'haroof') {
      setCurrentView('haroof');
    } else if (viewId === 'shapes') {
      setCurrentView('shapes');
    } else if (viewId === 'drawing') {
      setCurrentView('drawing');
    } else {
      alert('یہ زمرہ جلد ہی دستیاب ہوگا!');
    }
  };

  const features = [
    {
      title: 'اردو حروف سیکھیں',
      desc: 'حروفِ تہجی کو آوازوں اور تصویروں کے ساتھ سیکھیں۔',
      icon: BookOpen,
      color: 'bg-sky-100 text-sky-600 border-sky-200'
    },
    {
      title: 'رنگ اور اشکال',
      desc: 'مختلف رنگوں اور جیومیٹری کی اشکال کی پہچان کریں۔',
      icon: Shapes,
      color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
    },
    {
      title: 'دلچسپ کھیل',
      desc: 'سیکھنے کے لیے بنائے گئے سادہ اور پرسکون مائنڈ گیمز۔',
      icon: Gamepad2,
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    {
      title: 'ڈرائنگ بورڈ',
      desc: 'اپنی مرضی کی ڈرائنگ بنائیں اور رنگ بھریں۔',
      icon: Palette,
      color: 'bg-rose-100 text-rose-600 border-rose-200'
    },
  ];

  const steps = [
    { number: '1', title: 'سائن اپ کریں', desc: 'والدین اپنے بچے کے لیے پروفائل بنائیں', icon: UserPlus },
    { number: '2', title: 'سبق منتخب کریں', desc: 'حروف، رنگ یا ڈرائنگ میں سے انتخاب کریں', icon: PlayCircle },
    { number: '3', title: 'کھیل کے ذریعے سیکھیں', desc: 'پرامد اور آسان سرگرمیوں میں حصہ لیں', icon: Gamepad2 },
    { number: '4', title: 'اپنی ترقی دیکھیں', desc: 'والدین اپنے بچے کی بہتری پر نظر رکھیں', icon: Trophy },
  ];

  // Render Authentication View
  if (currentView === 'auth') {
    return (
      <Auth 
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setCurrentView('home')}
      />
    );
  }

  // Render Urdu Haroof Learning Module
  if (currentView === 'haroof') {
    return (
      <HaroofLearning 
        onBack={() => setCurrentView('child_dashboard')}
      />
    );
  }

  // Render Shapes and Colors Learning Module
  if (currentView === 'shapes') {
    return (
      <ShapesLearning 
        onBack={() => setCurrentView('child_dashboard')}
        onScoreSaved={() => setCurrentView('child_dashboard')}
      />
    );
  }

  // Render Drawing Board Module
  if (currentView === 'drawing') {
    return (
      <DrawingBoard 
        onBack={() => setCurrentView('child_dashboard')}
        onScoreSaved={() => setCurrentView('child_dashboard')}
      />
    );
  }

  // Parent Dashboard Placeholder View
  if (currentView === 'parent_dashboard') {
    return (
      <div className="min-h-screen bg-slate-100 p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold text-sky-600">والدین کا ڈیش بورڈ (Parent Dashboard)</h1>
        <p className="text-lg font-bold text-slate-800">خوش آمدید، {parentDashboard?.user.name ?? 'والدین'}</p>
        <p className="text-slate-600">کل پوائنٹس: {parentDashboard?.stats.totalPoints ?? 0} | مکمل کھیل: {parentDashboard?.stats.completedGames ?? 0} | مکمل اسباق: {parentDashboard?.stats.completedLessons ?? 0}</p>
        <p className="text-slate-600">یہاں والدین اپنے بچے کی رپورٹ اور پروگریس دیکھ سکتے ہیں۔</p>
        <button 
          onClick={() => { logout(); setCurrentView('home'); }}
          className="bg-slate-800 text-white px-6 py-2 rounded-xl font-semibold"
        >
          ہوم پیج پر واپس جائیں
        </button>
      </div>
    );
  }

  // Render Child Learning Dashboard
  if (currentView === 'child_dashboard') {
    return (
      <ChildDashboard 
        onNavigate={handleChildNavigation}
        onLogout={() => { logout(); setCurrentView('home'); }}
      />
    );
  }

  // Default Home / Landing Page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 border-slate-200 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-md shrink-0">
                <img src="/logo.jpg" alt="علمستان لوگو" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-sky-600">علمستان</h1>
                <p className="text-xs text-slate-500">Ilmistan - Urdu Learning</p>
              </div>
            </div>

            {/* Navigation Menu (Urdu) */}
            <nav className="hidden md:flex items-center gap-6 font-medium text-lg">
              <button onClick={() => setCurrentView('home')} className="text-sky-600 font-bold hover:text-sky-700">گھر</button>
              
              <a href="#learn" className="hover:text-sky-600 transition">سیکھیں</a>
              <a href="#games" className="hover:text-sky-600 transition">کھیلیں</a>
              <a href="#drawing" className="hover:text-sky-600 transition">ڈرائنگ</a>
              <button onClick={() => setCurrentView('auth')} className="hover:text-sky-600 transition">والدین کا ڈیش بورڈ</button>
            </nav>

            {/* Controls & Auth Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('auth')}
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm"
              >
                لاگ ان
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-right">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              خاص بچوں کے لیے آسان اور دلچسپ تعلیم
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              کھیل کھیل میں سیکھیں، <span className="text-sky-600">آگے بڑھیں</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              علمستان ایک محفوظ اور آسان پلیٹ فارم ہے جہاں بچے اردو حروف، رنگ، اشکال اور بہت کچھ باآسانی سیکھ سکتے ہیں۔
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setCurrentView('auth')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                سیکھنا شروع کریں
              </button>
              <button 
                onClick={() => setCurrentView('auth')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                کھیل کھیلیں
              </button>
            </div>
          </div>

          {/* Hero Card */}
          <div className="bg-gradient-to-br from-sky-100 via-teal-50 to-indigo-100 p-8 rounded-3xl border border-sky-200 shadow-md flex items-center justify-center min-h-[320px]">
            <div className="text-center space-y-4">
              <div className="inline-flex w-32 h-32 sm:w-36 sm:h-36 p-3 bg-white rounded-full shadow-md mb-2 items-center justify-center overflow-hidden">
                <img
                  src="/logo.jpg"
                  alt="علمستان لوگو"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">علمستان میں خوش آمدید</h3>
              <p className="text-slate-600 max-w-sm">
                آسان، پرسکون اور دوستانہ ماحول میں سیکھنے کا سفر!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-extrabold text-slate-900 mb-4">علمستان کی اہم خصوصیات</h3>
            <p className="text-slate-600">بچوں کی ذہنی صلاحیتوں کو مدنظر رکھتے ہوئے تیار کردہ سرگرمیاں</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-3xl border bg-slate-50 border-slate-100 hover:shadow-lg transition flex flex-col items-start text-right"
                >
                  <div className={`p-4 rounded-2xl border ${item.color} mb-4`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900">{item.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-3xl font-extrabold text-slate-900 mb-4">علمستان کا طریقہ کار</h3>
          <p className="text-slate-600">صرف 4 آسان مراحل میں سیکھنے کا سفر شروع کریں</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComp = step.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-3xl border bg-white border-slate-200 text-center shadow-sm relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <IconComp className="w-8 h-8 mx-auto text-sky-600 mb-2" />
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-sky-500 text-white p-2 rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white">علمستان</h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                خاص بچوں کے لیے ایک پرسکون، آسان اور تعلیمی ویب ایپلیکیشن۔
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">اہم روابط</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#guide" className="hover:text-sky-400 transition">والدین کے لیے رہنمائی</a></li>
                <li><a href="#help" className="hover:text-sky-400 transition">مدد</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">قوانین</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="hover:text-sky-400 transition">پرائیویسی پالیسی</a></li>
                <li><a href="#terms" className="hover:text-sky-400 transition">شرائط و ضوابط</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} علمستان (Ilmistan). جملہ حقوق محفوظ ہیں۔
          </div>
        </div>
      </footer>
    </div>
  );
}