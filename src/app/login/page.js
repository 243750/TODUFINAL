'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLogin } from '../../features/auth/hooks/useLogin';
import ToduLogo from '../../components/ToduLogo';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    email, setEmail,
    password, setPassword,
    loading, error, handleLogin
  } = useLogin();

  return (
    <div className="min-h-screen bg-[#150f27] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#1f1638] border border-white/5 rounded-[2rem] shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <ToduLogo size={88} withWordmark />
          <p className="text-slate-400 text-sm mt-2">Ingresa a tu cuenta para continuar</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm text-center font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Correo electrónico
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-11 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-black py-3.5 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all uppercase tracking-wider text-sm mt-2 ${
              loading ? 'bg-slate-600 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-500 active:scale-[0.98]'
            }`}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link href="/registro" className="text-violet-400 font-semibold hover:underline text-sm">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
