'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, RotateCcw } from 'lucide-react';
import ToduLogo from '../../components/ToduLogo';
import useRegistroPaso1 from '../../features/registro/hooks/useRegistroPaso1';
import TerminosModal from '../../features/registro/components/TerminosModal';
import PrivacidadModal from '../../features/registro/components/PrivacidadModal';

export default function RegistroPage() {
  const [mostrarTerminos, setMostrarTerminos] = useState(false);
  const [mostrarPrivacidad, setMostrarPrivacidad] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    formError,
    handleContinuar,
  } = useRegistroPaso1();

  return (
    <div className="min-h-screen bg-[#150f27] flex items-center justify-center font-sans p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Contenedor móvil principal */}
      <div className="relative w-full max-w-sm bg-[#1f1638] border border-white/5 rounded-[2.5rem] shadow-2xl p-8 flex flex-col h-[85vh] min-h-[600px] overflow-hidden">

        <div className="w-full flex flex-col items-center text-center mt-2">
          <ToduLogo size={72} withWordmark />
          <p className="text-slate-400 text-xs font-medium px-4 leading-relaxed mt-3">
            Únete a Todú para gestionar tus tareas con calma.
          </p>
        </div>

        <form className="w-full flex-1 flex flex-col justify-center mt-6 space-y-4" onSubmit={handleContinuar}>

          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center font-semibold">
              {formError}
            </div>
          )}

          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-slate-500 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
              className="w-full pl-12 pr-4 py-4 bg-black/30 text-slate-200 placeholder-slate-500 text-sm font-medium rounded-xl border border-white/10 focus:border-violet-500/50 outline-none transition-colors"
              required
            />
          </div>

          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-slate-500 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full pl-12 pr-4 py-4 bg-black/30 text-slate-200 placeholder-slate-500 text-sm font-medium rounded-xl border border-white/10 focus:border-violet-500/50 outline-none transition-colors"
              required
            />
          </div>

          <div className="relative flex items-center">
            <RotateCcw className="absolute left-4 text-slate-500 w-5 h-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full pl-12 pr-4 py-4 bg-black/30 text-slate-200 placeholder-slate-500 text-sm font-medium rounded-xl border border-white/10 focus:border-violet-500/50 outline-none transition-colors"
              required
            />
          </div>

          <div className="px-1">
            <p className="text-[10px] text-slate-500 text-center leading-relaxed">
              Al hacer clic en &quot;Crear mi cuenta&quot;, aceptas nuestros <br />
              <button type="button" onClick={() => setMostrarTerminos(true)} className="text-violet-400 font-bold hover:underline">Términos de Servicio</button> y <button type="button" onClick={() => setMostrarPrivacidad(true)} className="text-violet-400 font-bold hover:underline">Aviso de Privacidad</button>.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-sm uppercase tracking-wider py-4 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-[0.98]"
            >
              Crear mi cuenta
            </button>
          </div>

        </form>

        <div className="text-center pt-4 pb-2">
          <Link href="/login" className="text-violet-400 font-bold text-xs hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>

      {mostrarTerminos && (
        <TerminosModal
          onClose={() => setMostrarTerminos(false)}
          onAceptar={() => setMostrarTerminos(false)}
        />
      )}

      {mostrarPrivacidad && (
        <PrivacidadModal
          onClose={() => setMostrarPrivacidad(false)}
          onAceptar={() => setMostrarPrivacidad(false)}
        />
      )}

    </div>
  );
}