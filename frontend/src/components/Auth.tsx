import React, { useState } from 'react';
import { Shield, Heart, Eye, EyeOff, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { ApiError, login, register, type AuthUser } from '../api';

interface AuthProps {
  onLoginSuccess: (user: AuthUser) => void;
  onBackToHome: () => void;
}

export default function Auth({ onLoginSuccess, onBackToHome }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childName, setChildName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Message State
  const [errorMessage, setErrorMessage] = useState('');

  // Email Validation Helper
  const isValidEmail = (emailStr: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Form Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    // ==========================================
    // 1. SIGN UP VALIDATION LOGIC
    // ==========================================
    if (!isLogin) {
      if (!name.trim()) {
        setErrorMessage('براہ کرم اپنا پورا نام درج کریں۔');
        return;
      }
      if (!cleanEmail) {
        setErrorMessage('براہ کرم ای میل ایڈریس درج کریں۔');
        return;
      }
      if (!isValidEmail(cleanEmail)) {
        setErrorMessage('براہ کرم درست ای میل ایڈریس درج کریں (مثلاً: example@mail.com)۔');
        return;
      }
      if (!password) {
        setErrorMessage('براہ کرم پاس ورڈ درج کریں۔');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('پاس ورڈ کم از کم 6 ہندسوں یا حروف پر مشتمل ہونا چاہیے۔');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('پاس ورڈ اور Confirm Password یکساں (Same) ہونے چاہئیں۔');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('سائن اپ کرنے کے لیے قوانین اور پرائیویسی پالیسی کو تسلیم کرنا ضروری ہے۔');
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await register({ name: role === 'child' && childName.trim() ? childName.trim() : name.trim(), email: cleanEmail, password, role });
        onLoginSuccess(result.user);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'اکاؤنٹ بنانے میں مسئلہ پیش آیا۔');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // ==========================================
    // 2. LOGIN VALIDATION LOGIC
    // ==========================================
    if (isLogin) {
      if (!cleanEmail) {
        setErrorMessage('براہ کرم ای میل ایڈریس درج کریں۔');
        return;
      }
      if (!password) {
        setErrorMessage('براہ کرم پاس ورڈ درج کریں۔');
        return;
      }

      setIsSubmitting(true);
      try {
        const result = await login({ email: cleanEmail, password });
        onLoginSuccess(result.user);
      } catch (error) {
        setErrorMessage(error instanceof ApiError && error.status === 429
          ? 'Too many failed attempts. Account temporarily locked for 15 minutes.'
          : error instanceof Error ? error.message : 'لاگ ان میں مسئلہ پیش آیا۔');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-md w-full text-right relative z-50">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            علمستان میں {isLogin ? 'لاگ ان کریں' : 'اکاؤنٹ بنائیں'}
          </h2>
          <p className="text-slate-500 text-sm">
            {isLogin ? 'اپنے اکاؤنٹ میں داخل ہوں' : 'بچوں کے سیکھنے کے سفر کا آغاز کریں'}
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('child')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold border transition cursor-pointer ${
              role === 'child'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            بچہ (Child)
          </button>

          <button
            type="button"
            onClick={() => setRole('parent')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold border transition cursor-pointer ${
              role === 'parent'
                ? 'bg-sky-50 border-sky-500 text-sky-600'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-5 h-5" />
            والدین (Parent)
          </button>
        </div>

        {/* Urdu Error Notification Alert Box */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-semibold text-right">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Full Name Input (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">پورا نام</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="مثلاً: ملیکہ"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-right font-sans"
              />
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">ای میل ایڈریس</label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-left font-sans text-slate-800"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">پاس ورڈ</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                dir="ltr"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-left font-sans text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">پاس ورڈ کی تصدیق کریں</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-left font-sans text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 text-slate-400 hover:text-slate-600 transition p-1 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Optional Child Info (Sign Up Only) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">بچے کا نام (اختیاری)</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="بچے کا نام لکھیں"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none text-right font-sans text-slate-800"
              />
            </div>
          )}

          {/* Forgot Password Link (Login Only) */}
          {isLogin && (
            <div className="text-left pt-1">
              <button
                type="button"
                onClick={() => alert('پاس ورڈ کی بحالی کا لنک آپ کی ای میل پر بھیج دیا جائے گا۔')}
                className="text-xs font-semibold text-sky-600 hover:underline cursor-pointer"
              >
                پاس ورڈ بھول گئے؟
              </button>
            </div>
          )}

          {/* Terms & Privacy Checkbox (Sign Up Only) */}
          {!isLogin && (
            <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
              {agreeTerms ? (
                <CheckSquare className="w-5 h-5 text-sky-600 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-400 shrink-0" />
              )}
              <span className="text-xs text-slate-600">
                میں علمستان کی <span className="text-sky-600 underline">شرائط و ضوابط</span> اور <span className="text-sky-600 underline">پرائیویسی پالیسی</span> سے متفق ہوں۔
              </span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl transition shadow-md mt-3 cursor-pointer"
          >
            {isSubmitting ? 'براہ کرم انتظار کریں...' : isLogin ? 'لاگ ان کریں' : 'اکاؤنٹ بنائیں'}
          </button>
        </form>

        {/* Navigation Link between Login & Sign Up */}
        <div className="mt-6 text-center text-sm text-slate-600 border-t pt-4">
          {isLogin ? (
            <p>
              کیا آپ کا اکاؤنٹ نہیں ہے؟{' '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sky-600 font-bold hover:underline cursor-pointer"
              >
                نیا اکاؤنٹ بنائیں
              </button>
            </p>
          ) : (
            <p>
              پہلے سے اکاؤنٹ موجود ہے؟{' '}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sky-600 font-bold hover:underline cursor-pointer"
              >
                لاگ ان کریں
              </button>
            </p>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full text-sm font-bold text-slate-700 hover:text-sky-600 transition cursor-pointer py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            ← واپس ہوم پیج پر جائیں
          </button>
        </div>

      </div>
    </div>
  );
}