'use client';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import useGamificacion from '../../../features/gamificacion/hooks/useGamificacion';
import useInventario from '../../../features/inventario/hooks/useInventario';
import AccessoryCard from '../../../features/inventario/components/AccessoryCard';
import { CATALOGO_ACCESORIOS } from '../../../features/inventario/constants';

export default function DescubrirPage() {
  const { open: openSidebar } = useSidebar();
  const { user } = useAuth();

  const { progreso } = useGamificacion();
  const { inventario, busyItem, error, toggleItem } = useInventario();

  const xpPct = progreso
    ? Math.max(0, Math.min(100, 100 - (progreso.progresoPorcentaje ?? 0)))
    : 50;

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 overflow-x-hidden relative">

      {/* 1. Header Híbrido (Menú + Stats RPG + Avatar Animado) */}
      <header className="flex items-center p-6 gap-4">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors flex-shrink-0 lg:hidden">
          <Menu className="w-7 h-7" />
        </button>

        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h1 className="text-sm font-bold text-white leading-tight truncate">
            {user?.username || 'Todú'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest">
              Lvl. {progreso?.nivel ?? '–'}
            </span>
            <div className="flex-1 h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#a78bfa] to-[#6d28d9] rounded-full"
                style={{ width: `${xpPct}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              {progreso ? `${progreso.xpActual}/${progreso.xpSiguienteNivel}` : '–'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Contenido Principal */}
      <main className="max-w-3xl mx-auto px-6 flex flex-col gap-8 mt-2">

        <div className="mb-2">
          <h2 className="text-lg font-bold text-white tracking-tight">Descubrir nuevas funciones</h2>
          <p className="text-sm text-slate-400 mt-1">Sube de nivel para desbloquear herramientas y minijuegos exclusivos.</p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* Tarjeta 1: Todú Places */}
          <div className="relative w-full h-56 lg:flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer hover:border-blue-500/50 transition-colors">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-[#150f27]/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center transition-all">
              <div className="mb-3">
                <svg className="w-9 h-9 text-white/90 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Todú Places</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4 px-4">
                Encuentra lugares ideales para enfocarte o relajarte con recomendaciones inteligentes.
              </p>
              <div className="bg-[#6d28d9] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_0_10px_rgba(109,40,217,0.6)]">
                Desbloquea a Nivel 2
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Todú Arcade */}
          <div className="relative w-full h-56 lg:flex-1 rounded-3xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer hover:border-purple-500/50 transition-colors">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-[#150f27]/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-6 text-center transition-all">
              <div className="mb-3">
                <svg className="w-9 h-9 text-white/90 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Todú Arcade</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-4 px-2">
                Juega Memorama o reta a Todú a los dados para multiplicar tu experiencia diaria.
              </p>
              <div className="bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.6)]">
                Desbloquea a Nivel 15
              </div>
            </div>
          </div>

        </div>

        {/* 3. Accesorios de Todú (estilo tienda de Habitica, conectado a /inventario) */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white tracking-tight">Accesorios de Todú</h2>
            <p className="text-sm text-slate-400 mt-1">Desbloquea y equipa skins para tu compañero.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATALOGO_ACCESORIOS.map((item) => {
              const enInventario = inventario.find((i) => i.itemId === item.itemId);
              return (
                <AccessoryCard
                  key={item.itemId}
                  item={item}
                  owned={!!enInventario}
                  equipped={!!enInventario?.isEquipped}
                  busy={busyItem === item.itemId}
                  nivelUsuario={progreso?.nivel}
                  onAction={(it) => toggleItem(it, progreso?.nivel)}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}