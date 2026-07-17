'use client';
import { Menu } from 'lucide-react';
import ToduAvatar from '../../../components/ToduAvatar';
import { useSidebar } from '../../../context/SidebarContext';
import useGamificacion from '../../../features/gamificacion/hooks/useGamificacion';
import useRobotState from '../../../features/robot/hooks/useRobotState';
import MiniToduHelper from './components/MiniToduHelper';

export default function MiToduPage() {
  const { open: openSidebar } = useSidebar();
  const { progreso } = useGamificacion();
  const { emocionActual, mensaje } = useRobotState('mi-todu');

  const xpPct = progreso?.progresoPorcentaje ?? 0;
  const racha = progreso?.rachaActual ?? 0;

  // Lógica de colores según los días de racha
  let rachaColor = 'text-slate-500'; // 0 días (Gris)
  if (racha > 0 && racha <= 2) rachaColor = 'text-orange-400'; // 1-2 días (Naranja)
  if (racha >= 3 && racha <= 6) rachaColor = 'text-emerald-400'; // 3-6 días (Verde)
  if (racha >= 7) rachaColor = 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]'; // 7+ días (Morado brillante)

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 overflow-x-hidden relative">

      <header className="flex justify-between items-center p-6">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">Mi Todú</h1>
        <div className="w-8 h-8 lg:hidden" aria-hidden="true"></div>
      </header>

      <main className="max-w-md mx-auto px-6 flex flex-col gap-6">

        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#6d28d9]/30 to-transparent rounded-full blur-2xl"></div>
            <ToduAvatar emotion={emocionActual} mensaje={mensaje} size={260} />
          </div>
        </section>

        <div className="stat-card-outer">
          <div className="stat-card-dot"></div>
          <section className="stat-card p-5 shadow-lg">
            <div className="stat-card-ray"></div>
            <div className="stat-card-line topl"></div>
            <div className="stat-card-line leftl"></div>
            <div className="stat-card-line bottoml"></div>
            <div className="stat-card-line rightl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Nivel Actual</p>
                  <h2 className="text-3xl font-black text-white">Lvl. {progreso?.nivel ?? '–'}</h2>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Racha</p>
                  <h2 className={`text-xl font-bold transition-colors duration-500 ${rachaColor}`}>
                    🔥 {racha} Días
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-between bg-black/30 border border-amber-500/20 rounded-2xl px-4 py-3 mb-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Cartera</span>
                <span className="text-lg font-black text-amber-400">{progreso?.xpDisponible ?? 0} XP</span>
              </div>

              <div className="relative pt-2">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#a78bfa]">{progreso?.xpActual ?? 0} XP</span>
                  <span className="text-slate-500">Siguiente: {progreso?.xpSiguienteNivel ?? '–'} XP</span>
                </div>
                <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#a78bfa] via-[#6d28d9] to-[#cab3ff] rounded-full shadow-[0_0_10px_rgba(167,139,250,0.5)]"
                    style={{ width: `${xpPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <MiniToduHelper />

      </main>
    </div>
  );
}