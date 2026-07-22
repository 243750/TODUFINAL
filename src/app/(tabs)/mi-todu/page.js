'use client';
import { useState } from 'react';
import { Menu, HelpCircle, X, Coins, TrendingUp, Flame, ShoppingBag } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import useGamificacion from '../../../features/gamificacion/hooks/useGamificacion';
import useRobotState from '../../../features/robot/hooks/useRobotState';
import useDecoraciones from '../../../features/decoraciones/hooks/useDecoraciones';
import TiendaModal from '../../../components/decoraciones/TiendaModal';
import EscenaCuartoTodu from '../../../components/decoraciones/EscenaCuartoTodu';
import MiniToduHelper from './components/MiniToduHelper';

export default function MiToduPage() {
  const { open: openSidebar } = useSidebar();
const { progreso, refrescar: refrescarGamificacion } = useGamificacion();
  const [showHelp, setShowHelp] = useState(false);
  const [showTienda, setShowTienda] = useState(false);

  const { emocionActual, mensaje, hacerCosquillas } = useRobotState('mi-todu');
  const { compradas, comprando, error, yaComprado, comprar } = useDecoraciones();

  const xpPct = progreso?.progresoPorcentaje ?? 0;
  const racha = progreso?.rachaActual ?? 0;
  const xpDisponible = progreso?.xpDisponible ?? 0;

  let rachaColor = 'text-slate-500';
  if (racha > 0 && racha <= 2) rachaColor = 'text-orange-400';
  if (racha >= 3 && racha <= 6) rachaColor = 'text-emerald-400';
  if (racha >= 7) rachaColor = 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]';

  // Llama al backend real (POST /tienda/comprar dentro de useDecoraciones)
  // y refresca useGamificacion() con el saldo real que regresa el
  // servidor — mismo patrón que ya usa useDadosGame.js con Farkle.
  const handleComprar = async (itemId, precio) => {
    const data = await comprar(itemId, precio);
    if (data) refrescarGamificacion();
  };

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 overflow-x-hidden relative">

      <header className="flex justify-between items-center p-6">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu className="w-8 h-8" />
        </button>
        <h1 className="text-xl font-bold text-white tracking-wide">Mi Todú</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 p-2 rounded-full border border-violet-500/20"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto px-6 flex flex-col gap-6">

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cuarto de Todú</h3>
            <button
              onClick={() => setShowTienda(true)}
              className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Tienda
            </button>
          </div>
          <EscenaCuartoTodu
            compradas={compradas}
            emocionActual={emocionActual}
            mensaje={mensaje}
            onCosquillas={hacerCosquillas}
          />
        </div>

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
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                  <Coins className="w-3.5 h-3.5" /> Coins
                </span>
                <span className="text-lg font-black text-amber-400">{xpDisponible}</span>
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

      {showTienda && (
        <TiendaModal
          onClose={() => setShowTienda(false)}
          xpDisponible={xpDisponible}
          yaComprado={yaComprado}
          comprando={comprando}
          error={error}
          onComprar={handleComprar}
        />
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)] max-h-[85vh] overflow-y-auto">
            <button onClick={() => setShowHelp(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6 border-b border-white/5 pb-6 pt-2">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Tu Todú, explicado</h3>
              <p className="text-xs text-slate-400">Qué significa cada número aquí</p>
            </div>

            <div className="space-y-5 text-sm">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-violet-500/20 p-2 rounded-xl text-violet-400"><TrendingUp className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Nivel y XP Total</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Tu progreso permanente. <span className="text-white font-bold">Nunca baja</span>, sin importar qué hagas en el Arcade — solo sube al completar tareas reales. De aquí sale tu Nivel.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-amber-500/20 p-2 rounded-xl text-amber-400"><Coins className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Coins</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Tu cartera gastable. Sube junto con el XP al completar tareas, pero a diferencia del XP Total, <span className="text-white font-bold">sí puede bajar</span> — se usa para apostar en el Arcade y para comprar accesorios y decoraciones.
                  </p>
                </div>
              </div>

<div className="flex gap-4 items-start">
                <div className="mt-1 bg-orange-500/20 p-2 rounded-xl text-orange-400"><Flame className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Racha</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Días seguidos completando al menos una tarea. Se pone naranja (1-2 días), verde (3-6 días), o morada brillante (7+ días) — entre más larga, más bono de XP recibes por cada tarea.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-fuchsia-500/20 p-2 rounded-xl text-fuchsia-400"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Cuarto de Todú y Tienda</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Usa tus Coins en la <span className="text-white font-bold">Tienda</span> para comprar trofeos, mascotas, cuadros y más — cada cosa que compras aparece sola en el cuarto, sin que tengas que acomodarla.
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