'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import ToduLogo from '../components/ToduLogo';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../lib/routes';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleCredentialResponse = { credential: string };

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
};

// Evitamos declarar tipos globales para Window (puede chocar con otras
// declaraciones del proyecto de forma dificil de rastrear); en vez de eso
// hacemos un cast puntual, aislado, solo donde lo necesitamos.
function getGoogleAccountsId(): GoogleAccountsId | null {
  const w = window as unknown as { google?: { accounts?: { id?: GoogleAccountsId } } };
  return w.google?.accounts?.id ?? null;
}

export default function WelcomePage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const googleButtonContainerRef = useRef<HTMLDivElement>(null);  
  const [googleError, setGoogleError] = useState('');
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady || !GOOGLE_CLIENT_ID) return;

    const googleId = getGoogleAccountsId();
    if (!googleId) return;

    googleId.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: GoogleCredentialResponse) => {
        setGoogleError('');
        try {
          await loginWithGoogle(response.credential);
          router.push(ROUTES.tareas);
        } catch (err: unknown) {
          const mensaje = err instanceof Error ? err.message : 'No se pudo iniciar sesion con Google.';
          setGoogleError(mensaje);
        }
      },
    });

    if (googleButtonContainerRef.current) {
      googleId.renderButton(googleButtonContainerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: 320,
      });
    }
  }, [scriptReady, loginWithGoogle, router]);

  return (
    <div className="min-h-screen bg-[#150f27] flex items-center justify-center font-sans p-4 relative overflow-hidden">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
      {/* Contenedor con aspecto de dispositivo móvil */}
      <div className="relative w-full max-w-sm bg-[#1f1638] border border-white/5 rounded-[2.5rem] shadow-2xl p-8 flex flex-col justify-between items-center h-[85vh] min-h-[580px]">
        {/* Sección Superior: Logo e Isotipo */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <ToduLogo size={96} />
          <h1 className="text-4xl font-black text-white tracking-tight">
            Tod<span className="text-violet-400">ú</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Dale vida a tu productividad
          </p>
        </div>
        {/* Sección Central: Botones de Acción */}
        <div className="w-full space-y-3.5 mb-8">
          {googleError && (
            <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
              {googleError}
            </p>
          )}

          {/* Botón visual con nuestro diseño */}
          <div className="relative w-full">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-sm py-3.5 px-4 rounded-xl border border-white/10 shadow-sm transition duration-200"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3A11.95 11.95 0 00 12 .09c-4.427 0-8.29 2.382-10.427 5.927l3.693 3.748z" />
                <path fill="#4285F4" d="M23.755 12.23c0-.836-.073-1.64-.209-2.414H12v4.57h6.6c-.287 1.505-1.137 2.782-2.41 3.636v3.023h3.89c2.277-2.095 3.596-5.186 3.596-8.814z" />
                <path fill="#FBBC05" d="M5.266 14.235A7.014 7.014 0 0 1 4.909 12c0-.79.132-1.55.357-2.265L1.573 5.986A11.957 11.957 0 0 0 0 12c0 2.155.573 4.177 1.573 5.936l3.693-3.701z" />
                <path fill="#34A853" d="M12 23.91c3.24 0 5.955-1.073 7.94-2.914l-3.89-3.023a7.09 7.09 0 0 1-4.05 1.136c-3.646 0-6.732-2.463-7.832-5.777L1.573 17.936A11.955 11.955 0 0 0 12 23.91z" />
              </svg>
              Continuar con Google
            </button>

            {/* Botón real de Google, invisible, superpuesto exactamente encima.
                El clic del usuario cae aqui, no en el boton bonito de arriba. */}
            <div
              ref={googleButtonContainerRef}
              className="absolute inset-0 opacity-0 overflow-hidden [&>div]:w-full [&_iframe]:w-full"
              aria-hidden="true"
            />
          </div>

          <Link href="/login" className="block w-full">
            <button className="w-full flex items-center justify-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition duration-200">
              <Mail size={18} />
              Continuar con correo
            </button>
          </Link>
        </div>
        <div className="text-xs font-medium text-slate-400 tracking-wide pb-2">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-violet-400 font-bold hover:underline transition">
            Únete
          </Link>
        </div>
      </div>
    </div>
  );
}