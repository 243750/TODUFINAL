'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ToduLogo from '../../../components/ToduLogo';
import { ROUTES } from '../../../lib/routes';
import useRegistroCompletar from '../../../features/registro/hooks/useRegistroCompletar';
import TerminosModal from '../../../features/registro/components/TerminosModal';
import PrivacidadModal from '../../../features/registro/components/PrivacidadModal';

export default function RegistroCompletarPage() {
  const router = useRouter();

  const [modalTerminos, setModalTerminos] = useState(false);
  const [modalPrivacidad, setModalPrivacidad] = useState(false);

  const {
    formData,
    loading,
    errorServer,
    success,
    handleChange,
    handleSubmit,
    aceptarTerminos,
  } = useRegistroCompletar();

  return (
    <div className="min-h-screen bg-[#150f27] flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Tarjeta de Interfaz Móvil */}
      <div className="w-full max-w-sm bg-[#1f1638] border border-white/5 rounded-[2.5rem] shadow-2xl p-8 flex flex-col min-h-[600px] relative">

        {/* Botón de regreso */}
        <button
          type="button"
          onClick={() => router.push(ROUTES.registro)}
          className="absolute top-8 left-8 text-slate-300 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Logo de Todú */}
        <div className="flex justify-center mt-12 mb-6">
          <ToduLogo size={64} />
        </div>

        {/* Cabecera de Textos */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-[26px] font-bold text-white leading-tight px-2">
            ¿Cómo deberíamos llamarte?
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
            Este es un nombre único que puedes cambiar más tarde en cualquier momento.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">

          <div className="space-y-5">
            {/* Input de Nombre de Usuario */}
            <div className="relative">
              <div className={`flex items-center bg-black/30 border border-white/10 rounded-2xl px-5 py-4 transition-all duration-200
                ${formData.username ? 'ring-2 ring-violet-500/50 bg-black/40 shadow-xs' : ''}`}>
                <span className="text-slate-500 mr-2 font-medium text-base">@</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="usuario"
                  disabled={loading || success}
                  className="w-full bg-transparent text-white placeholder-slate-500 text-base font-medium outline-none disabled:opacity-50"
                  required
                />
                {formData.username.trim().length >= 2 && !errorServer && (
                  <span className="text-emerald-500 flex items-center ml-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.7079.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Fecha de Nacimiento (el backend la exige para el filtro de mayoría de edad) */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 px-1">
                Fecha de nacimiento
              </label>
              <div className="flex items-center bg-black/30 border border-white/10 rounded-2xl px-5 py-4">
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  disabled={loading || success}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent text-white text-base font-medium outline-none disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Mensajes de feedback del backend */}
            {errorServer && (
              <p className="text-rose-400 text-xs font-semibold text-center bg-rose-500/10 py-2 px-3 rounded-xl border border-rose-500/20">
                {errorServer}
              </p>
            )}
            {success && (
              <p className="text-emerald-400 text-sm font-bold text-center bg-emerald-500/10 py-2 px-3 rounded-xl border border-emerald-500/20">
                ¡Perfil configurado con éxito!
              </p>
            )}

            {/* Casilla Única de Validación Legal */}
            <label className="flex items-start gap-3 text-[13px] text-slate-400 leading-snug font-medium cursor-pointer px-1 select-none">
              <input
                type="checkbox"
                name="aceptaTerminosYPrivacidad"
                checked={formData.aceptaTerminosYPrivacidad}
                onChange={handleChange}
                disabled={loading || success}
                className="w-5 h-5 rounded border-white/20 text-violet-500 focus:ring-violet-500 cursor-pointer shrink-0 mt-0.5 disabled:opacity-50"
              />
              <span>
                Confirmas que tienes al menos 18 años y que has leído y aceptas nuestros{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalTerminos(true);
                  }}
                  className="text-violet-400 font-bold hover:underline"
                >
                  Términos de Servicio
                </span>{' '}
                y{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModalPrivacidad(true);
                  }}
                  className="text-violet-400 font-bold hover:underline"
                >
                  Aviso de Privacidad
                </span>.
              </span>
            </label>
          </div>

          {/* Botón de Enviar Dinámico (Se activa al marcar el checkbox) */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!formData.aceptaTerminosYPrivacidad || loading || success}
              className={`w-full font-bold py-4 rounded-2xl shadow-xs transition-all duration-200 text-base
                ${formData.aceptaTerminosYPrivacidad && !loading && !success
                  ? 'bg-violet-600 hover:bg-violet-500 text-white cursor-pointer active:scale-[0.99] shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 text-slate-500 cursor-not-allowed shadow-none'
                }`}
            >
              {loading ? 'Procesando...' : 'Comenzar'}
            </button>
          </div>
        </form>
      </div>

      {modalTerminos && (
        <TerminosModal
          onClose={() => setModalTerminos(false)}
          onAceptar={() => {
            aceptarTerminos();
            setModalTerminos(false);
          }}
        />
      )}

      {modalPrivacidad && (
        <PrivacidadModal
          onClose={() => setModalPrivacidad(false)}
          onAceptar={() => {
            aceptarTerminos();
            setModalPrivacidad(false);
          }}
        />
      )}

    </div>
  );
}