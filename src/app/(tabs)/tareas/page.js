'use client';
import { useEffect, useState } from 'react';
import { HelpCircle, Plus, Camera, X, CheckCircle2, Menu } from 'lucide-react';
import ToduAvatar from '../../../components/ToduAvatar';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import AnimatedButton from '../../../components/ui/animated-button';
import useTareas from '../../../features/tareas/hooks/useTareas';
import useRobotState from '../../../features/robot/hooks/useRobotState';
import TaskCard from '../../../features/tareas/components/TaskCard';
import TareaFormModal from '../../../features/tareas/components/TareaFormModal';
import EvidenciaModal from '../../../features/tareas/components/EvidenciaModal';
import useGamificacion from '../../../features/gamificacion/hooks/useGamificacion';

export default function TareasPage() {
  const [showHelp, setShowHelp] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [tareaEvidencia, setTareaEvidencia] = useState(null);
  const { open: openSidebar } = useSidebar();
  const { user } = useAuth();
  
  const {
    tareas,
    loading: loadingTareas,
    error: errorTareas,
    crearTarea,
    editarTarea,
    eliminarTarea,
    subirEvidencia,
  } = useTareas();

  const robotState = useRobotState('tareas', tareas); 
  const { emocionActual, mensaje, tareaCompletada, hacerCosquillas } = robotState;

  const { refrescar: refrescarGamificacion } = useGamificacion();
  const [avatarSize, setAvatarSize] = useState(170);

  useEffect(() => {
    const updateAvatarSize = () => {
      setAvatarSize(window.innerWidth >= 1024 ? 230 : 170);
    };
    updateAvatarSize();
    window.addEventListener('resize', updateAvatarSize);
    return () => window.removeEventListener('resize', updateAvatarSize);
  }, []);

  const handleDelete = async (tarea) => {
    const confirmado = window.confirm(`¿Eliminar "${tarea.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;
    try {
      await eliminarTarea(tarea);
    } catch {
      // eliminarTarea ya revierte el estado optimista y re-lanza el error
    }
  };

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 lg:pb-12 overflow-x-hidden relative">
      <header className="flex items-center justify-between p-6">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors lg:hidden">
          <Menu className="w-7 h-7" />
        </button>
        <div className="flex flex-col items-center flex-1 lg:items-start lg:flex-none">
          <h1 className="text-sm font-black text-white uppercase tracking-widest">Mis Tareas</h1>
          <span className="text-[10px] text-violet-400 font-bold tracking-wide">
            ¡Qué onda{user?.username ? `, ${user.username}` : ''}! A darle.
          </span>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 p-2 rounded-full border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-md mx-auto px-6 flex flex-col gap-4 lg:max-w-5xl lg:flex-row lg:items-start lg:gap-10 lg:px-10">
        
        <section className="flex flex-col items-center justify-center w-full pt-2 pb-8 lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-8 lg:pb-0 lg:-translate-x-6">
          <div className="relative mx-auto mb-6" style={{ width: avatarSize + 20, height: avatarSize + 20 }}>
            <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl animate-pulse pointer-events-none"></div>
            <div className="absolute -top-2 -left-4 w-3 h-3 bg-yellow-400 rounded-full blur-[2px] animate-bounce pointer-events-none" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 -right-6 w-2 h-2 bg-violet-300 rounded-full blur-[1px] animate-bounce pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-rose-400 rounded-full blur-[1px] animate-bounce pointer-events-none" style={{ animationDelay: '0.8s' }}></div>
            
            {/* ENVOLTORIO CLICKEABLE CON z-10 PARA RECIBIR EL CLICK */}
            <div 
              className="absolute inset-0 z-10 flex items-center justify-center overflow-visible cursor-pointer active:scale-95 transition-transform"
              onClick={hacerCosquillas}
            >
              <ToduAvatar emotion={emocionActual} mensaje={mensaje} size={avatarSize} />
            </div>
          </div>
          <AnimatedButton onClick={() => setShowCrear(true)} className="hidden lg:flex w-full">
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Nueva tarea
          </AnimatedButton>
        </section>

        <div className="flex-1 w-full flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tareas de Hoy</h2>
          {loadingTareas && <p className="text-sm text-slate-500 text-center py-8">Cargando tus tareas...</p>}
          {errorTareas && !loadingTareas && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">{errorTareas}</p>
          )}
          {!loadingTareas && !errorTareas && tareas.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">
              Aún no tienes tareas. Toca el botón <span className="text-violet-400 font-bold">(+)</span> para crear la primera.
            </p>
          )}
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
            {tareas.map((tarea) => (
              <TaskCard
                key={tarea.id}
                tarea={tarea}
                onEdit={(t) => setTareaEditando(t)}
                onDelete={handleDelete}
                onEvidencia={(t) => setTareaEvidencia(t)}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 w-full flex justify-center z-40 pointer-events-none lg:hidden">
        <button
          onClick={() => setShowCrear(true)}
          className="pointer-events-auto w-14 h-14 bg-gradient-to-tr from-[#6d28d9] to-[#a78bfa] rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_10px_30px_rgba(167,139,250,0.4)] hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>

      {showCrear && (
        <TareaFormModal
          onClose={() => setShowCrear(false)}
          onSave={() => {}}
          crearTarea={crearTarea}
          editarTarea={editarTarea}
        />
      )}

      {tareaEditando && (
        <TareaFormModal
          tareaInicial={tareaEditando}
          onClose={() => setTareaEditando(null)}
          onSave={() => {}}
          crearTarea={crearTarea}
          editarTarea={editarTarea}
        />
      )}

      {tareaEvidencia && (
        <EvidenciaModal
          tarea={tareaEvidencia}
          onClose={() => setTareaEvidencia(null)}
          onSuccess={() => {
            tareaCompletada();
            refrescarGamificacion();
            setTareaEvidencia(null);
          }}
          subirEvidencia={subirEvidencia}
        />
      )}

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <button onClick={() => setShowHelp(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6 border-b border-white/5 pb-6 pt-2">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">¿Cómo funciona?</h3>
              <p className="text-xs text-slate-400">Guía rápida de tus tareas y Todú</p>
            </div>
            <div className="space-y-5 text-sm">
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-blue-500/20 p-2 rounded-xl text-blue-400"><Plus className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Añadir tareas</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Toca el botón central <span className="text-violet-400 font-bold">(+)</span> para crear una tarea y elegir su dificultad (más difícil, más XP).</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-purple-500/20 p-2 rounded-xl text-purple-400"><Camera className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Verificación Fotográfica</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Toca el ícono de cámara en tus tareas. Toma una foto y <span className="text-white font-bold">la IA de Todú la analizará</span> para confirmar que la completaste.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="mt-1 bg-green-500/20 p-2 rounded-xl text-green-400"><CheckCircle2 className="w-4 h-4" /></div>
                <div>
                  <h4 className="text-white font-bold mb-0.5">Gana Experiencia</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Las tareas verificadas te otorgan XP. Úsala para evolucionar a Todú y desbloquear minijuegos.</p>
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