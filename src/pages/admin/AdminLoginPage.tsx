import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { loginSchema, LoginFormValues } from '../../schemas/loginSchema';
import { useAuth } from '../../hooks/useAuth';
import { MEDIA_ASSETS } from '../../config/assets';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setAuthError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-stone-950 text-white flex flex-col justify-center items-center p-3 sm:p-6 relative overflow-hidden select-none">
      {/* Background Ambience - Unified across mobile & desktop */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-maroon-900/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-turmeric-900/25 blur-3xl pointer-events-none" />

      {/* Main Login Window - Compact & Non-Scrolling */}
      <div className="w-full max-w-[380px] sm:max-w-[420px] relative z-10 my-auto flex flex-col">
        {/* Top Branding Header */}
        <div className="text-center space-y-1 mb-3 sm:mb-4">
          <Link to="/" className="inline-block group">
            <img
              src={MEDIA_ASSETS.logo}
              alt="Sri Caterers Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gold mx-auto object-contain bg-white p-0.5 shadow-md group-hover:scale-105 transition-transform"
            />
          </Link>
          <h1 className="font-serif text-lg sm:text-xl font-black text-white tracking-wide uppercase drop-shadow-xs">
            Sri Caterers
          </h1>
          <p className="text-[10px] sm:text-xs text-amber-400 font-medium tracking-wider uppercase">
            Administrative Console
          </p>
        </div>

        {/* Compact Form Card - Seamlessly blends with the page background on mobile */}
        <div className="bg-stone-900/90 sm:bg-stone-900/95 p-4 sm:p-6 rounded-2xl border border-amber-500/25 shadow-2xl backdrop-blur-md space-y-3.5 sm:space-y-4">
          {authError && (
            <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-wider mb-1">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  {...register('email')}
                  placeholder="admin@sricatering.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950/80 border text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all ${
                    errors.email ? 'border-red-500/80' : 'border-stone-700/80'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-red-400 mt-0.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-bold text-amber-200 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Enter password"
                  className={`w-full pl-9 pr-9 py-2 rounded-xl bg-stone-950/80 border text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold transition-all ${
                    errors.password ? 'border-red-500/80' : 'border-stone-700/80'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-300 p-1 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-400 mt-0.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-maroon-800 to-maroon-700 hover:from-maroon-700 hover:to-maroon-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center border border-amber-400/40 cursor-pointer disabled:opacity-70 mt-1"
            >
              <ShieldCheck className="w-4 h-4 mr-1.5 text-gold" />
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Console'}</span>
            </button>

            {/* Quick Demo Credentials Autofill */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@sricatering.com');
                  setValue('password', 'admin123');
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-[10px] sm:text-[11px] text-amber-300 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>⚡ Auto-fill Admin Login: admin@sricatering.com</span>
              </button>
            </div>
          </form>

          {/* Back Link */}
          <div className="pt-1 text-center">
            <Link
              to="/"
              className="text-[11px] text-stone-400 hover:text-amber-300 font-medium inline-flex items-center transition-colors"
            >
              <span>← Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
