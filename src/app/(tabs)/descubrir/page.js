'use client';
import { useState } from 'react';
import { Menu, Lock, Gamepad2, MapPin, ChevronRight, HelpCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSidebar } from '../../../context/SidebarContext';
import useGamificacion from '../../../features/gamificacion/hooks/useGamificacion';

export default function DescubrirPage() {
  const { open: openSidebar } = useSidebar();
  const router = useRouter();
  const { progreso } = useGamificacion();
  const [showHelp, setShowHelp] = useState(false);

  const nivelActual = progreso?.nivel ?? 0;

  const modulos = [
    {
      id: 'places',
      title: 'Places',
      description: 'Descubre lugares clave y conquista territorios en el campus.',
      icon: MapPin,
      color: 'from-emerald-500 to-teal-400',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop',
      nivelRequerido: 2,
      route: '/places'
    },
    {
      id: 'arcade',
      title: 'Arcade',
      description: 'Apuesta tus Coins contra Todú en los clásicos juegos de casino.',
      icon: Gamepad2,
      color: 'from-cyan-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop',
      nivelRequerido: 3,
      route: '/arcade'
    }
  ];

  const handleNavigation = (modulo) => {
    if (nivelActual >= modulo.nivelRequerido) {
      router.push(modulo.route);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans pb-28 lg:pb-12 overflow-x-hidden relative">
      <header className="flex items-center justify-between p-6">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu className="w-7 h-7" />
        </button>
        <div className="flex flex-col items-center flex-1 lg:items-start lg:flex-none">
          <h1 className="text-sm font-black text-white uppercase tracking-widest">Descubrir</h1>
          <span className="text-[10px] text-violet-400 font-bold tracking-wide">
            Expande tu universo
          </span>
        </div>

        <button
          onClick={() => setShowHelp(true)}
          className="text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 p-2 rounded-full border border-violet-500/20"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto px-6 flex flex-col gap-6 mt-4">

        <div className="text-center mb-2">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Tu Nivel Real</p>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <span className="text-2xl font-black text-white">{nivelActual}</span>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {modulos.map((modulo) => {
            const isLocked = nivelActual < modulo.nivelRequerido;

            return (
              <button
                key={modulo.id}
                onClick={() => handleNavigation(modulo)}
                disabled={isLocked}
                className="relative w-full text-left rounded-3xl h-44 border-2 border-white/10 overflow-hidden group shadow-xl transition-transform active:scale-[0.98]"
              >
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
                    isLocked ? 'grayscale opacity-20' : 'opacity-40 group-hover:scale-110 group-hover:opacity-60'
                  }`}
                  style={{ backgroundImage: `url(${modulo.image})` }}
                ></div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

                <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                        isLocked ? 'bg-slate-800 text-slate-500' : `bg-gradient-to-br ${modulo.color} text-white`
                      }`}>
                        {isLocked ? <Lock className="w-4 h-4" /> : <modulo.icon className="w-4 h-4" />}
                      </div>
                      <h3 className={`font-black tracking-wide text-2xl ${isLocked ? 'text-slate-400' : 'text-white drop-shadow-md'}`}>
                        {modulo.title}
                      </h3>
                    </div>
                    {!isLocked && <ChevronRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />}
                  </div>
                  
                  <p className={`text-xs mt-2 w-5/6 ${isLocked ? 'text-slate-500' : 'text-slate-200 drop-shadow-md'}`}>
                    {modulo.description}
                  </p>

                  {isLocked && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-black/80 border border-rose-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">
                      <Lock className="w-3 h-3 text-rose-400" />
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest">
                        Nivel {modulo.nivelRequerido}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#0b1120]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#151b2e] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <button onClick={() => setShowHelp(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6 border-b border-white/5 pb-6 pt-2">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Descubrir, explicado</h3>
              <p className="text-xs text-slate-400">Cómo se desbloquea cada módulo</p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl text-emerald-400"><MapPin className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Places (Nivel 2)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Lugares reales cerca de ti, con recomendaciones y la opción de agregarlos directo a tus Tareas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-cyan-500/20 p-2 rounded-xl text-cyan-400"><Gamepad2 className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Arcade (Nivel 3)</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Juegos donde apuestas tus Coins (tu cartera gastable) contra Todú — ganar la duplica, perder la vacía, pero tu Nivel nunca se ve afectado.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-rose-500/20 p-2 rounded-xl text-rose-400"><Lock className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">¿Por qué está bloqueado?</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Cada módulo pide un Nivel mínimo. ¡Completa tareas para ganar XP real y subir de Nivel!
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => setShowHelp(false)} className="w-full mt-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl transition-colors text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}