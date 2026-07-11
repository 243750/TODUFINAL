'use client';
import Link from 'next/link';
import ToduAvatar from '../../components/ToduAvatar';
import { useAuth } from '../../context/AuthContext';
import useRobotState from '../../features/robot/hooks/useRobotState';

export default function ArcadeLobbyPage() {
  const { user } = useAuth();
  const { emocionActual } = useRobotState();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-10 overflow-x-hidden relative selection:bg-fuchsia-500 selection:text-white">
      
      {/* 1. Fondo de Cuadrícula Láser (Estilo Retro-Synthwave) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          backgroundPosition: 'center center'
        }}
      >
        {/* Difuminado inferior para que la cuadrícula se desvanezca en la oscuridad */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80"></div>
      </div>

      {/* 2. Header de Navegación Neón */}
      <header className="relative z-10 sticky top-0 bg-[#050505]/80 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-fuchsia-500/30 shadow-[0_4px_20px_rgba(236,72,153,0.15)]">
        <Link href="/descubrir" className="w-10 h-10 rounded-full bg-black border border-fuchsia-500/50 flex items-center justify-center text-fuchsia-400 hover:bg-fuchsia-500 hover:text-white hover:shadow-[0_0_15px_rgba(236,72,153,0.8)] transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 tracking-wider drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
            TODÚ ARCADE
          </h1>
          <p className="text-[9px] text-cyan-400 font-black uppercase tracking-[0.3em] mt-0.5">
            Insert Coin to Play
          </p>
        </div>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-6 flex flex-col mt-6 gap-8">
        
        {/* 3. Panel "Player 1" */}
        <div className="bg-black/60 border-2 border-cyan-500 rounded-xl p-4 flex items-center gap-4 relative shadow-[0_0_20px_rgba(6,182,212,0.3)] overflow-hidden">
          {/* Scanline effect (animación sutil de pantalla CRT) */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-50"></div>
          
          <div className="w-20 h-20 flex-shrink-0 relative z-10">
            <ToduAvatar emotion={emocionActual} size={80} />
          </div>
          
          <div className="flex-1 relative z-10">
            <span className="inline-block bg-cyan-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 mb-1 rounded-sm animate-pulse">
              Player 1 Ready
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">{user?.username?.toUpperCase() || 'JUGADOR'}</h2>
            <p className="text-[10px] text-cyan-200/70 uppercase tracking-wider mt-1 font-medium">
              Multiplicador XP Activo
            </p>
          </div>
        </div>

        {/* 4. Rejilla de Máquinas Arcade */}
        <div className="flex flex-col gap-6">
          
          {/* MÁQUINA 1: Memorama (Temática Fucsia) */}
          <Link href="/arcade/memorama" className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-fuchsia-500 bg-black group block hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5 flex flex-col justify-end">
              
              <div className="absolute top-4 right-4 bg-fuchsia-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                1 Minuto
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-6 h-6 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="12" height="16" rx="2" strokeWidth="2" />
                    <path d="M8 4v16M20 8v12a2 2 0 01-2 2H8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <h3 className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                    MEMORAMA
                  </h3>
                </div>
                <p className="text-xs text-fuchsia-100/70 font-medium leading-relaxed max-w-[85%]">
                  Entrena tu memoria visual. Encuentra los pares antes de que el tiempo se agote.
                </p>
                <div className="mt-3 flex items-center text-[10px] font-black text-fuchsia-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Insertar Ficha <span className="ml-2 animate-bounce">▶</span>
                </div>
              </div>
            </div>
          </Link>

          {/* MÁQUINA 2: Dados (Temática Cian) */}
          <Link href="/arcade/dados" className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-cyan-500 bg-black group block hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5 flex flex-col justify-end">
              
              <div className="absolute top-4 right-4 bg-cyan-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                Estrategia
              </div>

              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <svg className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2.5" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
                    <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  </svg>
                  <h3 className="text-xl font-black text-white italic tracking-wider drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                    DADOS DE TABERNA
                  </h3>
                </div>
                <p className="text-xs text-cyan-100/70 font-medium leading-relaxed max-w-[85%]">
                  Riesgo y recompensa. Tira los dados, asegura tus puntos o piérdelo todo.
                </p>
                <div className="mt-3 flex items-center text-[10px] font-black text-cyan-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Insertar Ficha <span className="ml-2 animate-bounce">▶</span>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </main>

    </div>
  );
}