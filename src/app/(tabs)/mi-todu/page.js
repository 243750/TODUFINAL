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
  const { emocionActual } = useRobotState();

  const xpPct = progreso?.progresoPorcentaje ?? 0;

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 overflow-x-hidden relative">

      {/* Header Consistente */}
      <header className="flex justify-between items-center p-6">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">Mi Todú</h1>
        <div className="w-8 h-8 lg:hidden" aria-hidden="true"></div>
      </header>

      <main className="max-w-md mx-auto px-6 flex flex-col gap-6">

        {/* Sección del Avatar Principal en Grande */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#6d28d9]/30 to-transparent rounded-full blur-2xl"></div>
            <ToduAvatar emotion={emocionActual} size={260} />
          </div>
        </section>

        {/* Tarjeta de Estadísticas (Nivel y Racha) */}
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
                  <h2 className="text-xl font-bold text-orange-400">🔥 {progreso?.rachaActual ?? 0} Días</h2>
                </div>
              </div>

              {/* Barra de XP estilo TikTok (Gradiente intenso) */}
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

        {/* Aquí entra el Todúcito a dar instrucciones */}
        <MiniToduHelper />

      </main>
    </div>
  );
}