'use client';
import { useEffect, useState } from 'react';
import { HelpCircle, Plus, Camera, X, CheckCircle2, Clock, Menu, Pencil, Trash2 } from 'lucide-react';
import ToduAvatar from '../../../components/ToduAvatar';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../lib/api';
import AnimatedButton from '../../../components/ui/animated-button';

// Dificultad al estilo Habitica: cada nivel mapea a un valor de XP real
// que ya entiende el backend (POST /tareas espera "xpValor").
const DIFICULTADES = [
  { key: 'trivial', label: 'Trivial', xpValor: 10 },
  { key: 'facil', label: 'Fácil', xpValor: 25 },
  { key: 'intermedia', label: 'Intermedia', xpValor: 50 },
  { key: 'dificil', label: 'Difícil', xpValor: 100 },
];

// ─────────────────────────────────────────────────────────────────
// MODO PREVIEW: mientras esto sea `true`, la pantalla NO llama al
// backend real (así que no hace falta JWT ni Authorization header)
// y en su lugar usa estos datos falsos, solo para ver cómo se ve.
// Cuando quieras conectar el backend de verdad, pon esto en `false`
// y borra MOCK_TAREAS (o déjalo, no se usa si USE_MOCK_DATA es false).
// ─────────────────────────────────────────────────────────────────
const USE_MOCK_DATA = true;

const MOCK_TAREAS = [
  {
    id: 'mock-1',
    titulo: 'Lavar los trastes',
    descripcion: '08:00 hrs',
    xpValor: 10,
    estado: 'pendiente',
  },
  {
    id: 'mock-2',
    titulo: 'Terminar tarea de matemáticas',
    descripcion: '17:30 hrs',
    xpValor: 50,
    estado: 'pendiente',
  },
  {
    id: 'mock-3',
    titulo: 'Ir al gimnasio',
    descripcion: '19:00 hrs',
    xpValor: 100,
    estado: 'vencida',
  },
  {
    id: 'mock-4',
    titulo: 'Leer 20 páginas',
    descripcion: '21:00 hrs',
    xpValor: 25,
    estado: 'completed',
  },
  {
    id: 'mock-5',
    titulo: 'Ordenar el cuarto',
    descripcion: '12:00 hrs',
    xpValor: 25,
    estado: 'pendiente',
  },
  {
    id: 'mock-6',
    titulo: 'Sacar a pasear al perro',
    descripcion: '07:30 hrs',
    xpValor: 10,
    estado: 'completed',
  },
];

function TareaFormModal({ onClose, onSave, tareaInicial }) {
  const esEdicion = !!tareaInicial;

  // Si estamos editando, tratamos de recuperar el horario que se guardó
  // dentro de "descripcion" (formato "HH:MM hrs"); si no calza, usamos 09:00.
  const horarioInicial = (() => {
    const match = tareaInicial?.descripcion?.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : '09:00';
  })();
  const dificultadInicial = tareaInicial
    ? DIFICULTADES.find((d) => d.xpValor === tareaInicial.xpValor)?.key || 'facil'
    : 'facil';

  const [titulo, setTitulo] = useState(tareaInicial?.titulo || '');
  const [horario, setHorario] = useState(horarioInicial);
  const [dificultad, setDificultad] = useState(dificultadInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !horario) return;
    setLoading(true);
    setError(null);
    try {
      const xpValor = DIFICULTADES.find((d) => d.key === dificultad).xpValor;
      // El backend no tiene un campo de horario propio (solo titulo/descripcion/
      // xpValor), así que lo guardamos en descripcion con un prefijo fácil de
      // parsear ("HH:MM · ...") para poder mostrarlo de vuelta en la tarjeta.
      if (USE_MOCK_DATA) {
        // Modo preview: no llamamos al backend (no hay JWT), solo simulamos
        // que la tarea se creó/editó y actualizamos el estado local.
        await new Promise((resolve) => setTimeout(resolve, 400));
        onSave({
          id: tareaInicial?.id ?? `mock-${Date.now()}`,
          titulo: titulo.trim(),
          descripcion: `${horario} hrs`,
          xpValor,
          estado: tareaInicial?.estado ?? 'pendiente',
        });
        onClose();
        return;
      }

      if (esEdicion) {
        const data = await api.put(`/tareas/${tareaInicial.id}`, {
          titulo: titulo.trim(),
          descripcion: `${horario} hrs`,
          xpValor,
        });
        onSave(data.tarea);
      } else {
        const data = await api.post('/tareas', {
          titulo: titulo.trim(),
          descripcion: `${horario} hrs`,
          xpValor,
        });
        onSave(data.tarea);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-white mb-6">{esEdicion ? 'Editar tarea' : 'Nueva tarea'}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
              {error}
            </p>
          )}

          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la tarea"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50"
            required
            autoFocus
          />

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Horario
            </p>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500/50"
              required
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Dificultad
            </p>
            <div className="grid grid-cols-4 gap-2">
              {DIFICULTADES.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDificultad(d.key)}
                  className={`py-3 rounded-xl text-[11px] font-bold border transition-colors ${
                    dificultad === d.key
                      ? 'bg-violet-600 border-violet-400 text-white'
                      : 'bg-black/20 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {d.label}
                  <br />
                  <span className="opacity-70">{d.xpValor} XP</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black rounded-2xl transition-colors text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            {loading ? (esEdicion ? 'Guardando...' : 'Creando...') : (esEdicion ? 'Guardar cambios' : 'Crear tarea')}
          </button>
        </form>
      </div>
    </div>
  );
}

function TaskCard({ tarea, onEdit, onDelete }) {
  const isVencida = tarea.estado === 'vencida' || tarea.estado === 'expired';
  const isCompletada = tarea.estado === 'completed';

  return (
    <div
      className={`bg-[#1f1638] border border-white/5 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-lg ${
        isVencida ? 'border-l-4 border-l-rose-500' : ''
      }`}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className={`text-base font-bold truncate ${isCompletada ? 'text-slate-500 line-through' : 'text-white'}`}>
          {tarea.titulo}
        </h3>
        <div className={`flex items-center gap-1.5 ${isVencida ? 'text-rose-400' : 'text-slate-400'}`}>
          {isCompletada ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {tarea.descripcion ? `${tarea.descripcion} · ` : ''}{tarea.xpValor} XP {isVencida ? '• Atrasada' : isCompletada ? '• Completada' : ''}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Editar */}
        <button
          onClick={() => onEdit(tarea)}
          aria-label="Editar tarea"
          className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>

        {/* Eliminar */}
        <button
          onClick={() => onDelete(tarea)}
          aria-label="Eliminar tarea"
          className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Verificar con foto (solo si no está completada) */}
        {!isCompletada && (
          <button className="w-12 h-12 rounded-[1.2rem] bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TareasPage() {
  const [showHelp, setShowHelp] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null); // tarea seleccionada para editar, o null
  const { open: openSidebar } = useSidebar();
  const { user } = useAuth();

  const [tareas, setTareas] = useState([]);
  const [loadingTareas, setLoadingTareas] = useState(true);
  const [errorTareas, setErrorTareas] = useState(null);

  // Tamaño del robot: más grande en escritorio (lg) que en móvil.
  // ToduAvatar recibe el tamaño en píxeles vía JS (no es una clase CSS),
  // así que detectamos el ancho de pantalla para decidir cuál usar.
  const [avatarSize, setAvatarSize] = useState(170);

  useEffect(() => {
    const updateAvatarSize = () => {
      setAvatarSize(window.innerWidth >= 1024 ? 230 : 170);
    };
    updateAvatarSize();
    window.addEventListener('resize', updateAvatarSize);
    return () => window.removeEventListener('resize', updateAvatarSize);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (USE_MOCK_DATA) {
      // Modo preview: no pega al backend (no requiere JWT), solo carga
      // los datos falsos de arriba, con un pequeño delay para simular red.
      const timer = setTimeout(() => {
        if (!cancelled) {
          setTareas(MOCK_TAREAS);
          setLoadingTareas(false);
        }
      }, 300);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    api
      .get('/tareas/mis-tareas')
      .then((data) => {
        if (!cancelled) setTareas(data.tareas || []);
      })
      .catch((err) => {
        if (!cancelled) setErrorTareas(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingTareas(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (tarea) => {
    const confirmado = window.confirm(`¿Eliminar "${tarea.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmado) return;

    // Optimista: la quitamos de la lista de inmediato.
    setTareas((prev) => prev.filter((t) => t.id !== tarea.id));

    if (USE_MOCK_DATA) return; // modo preview: no hay backend que avisar

    try {
      await api.delete(`/tareas/${tarea.id}`);
    } catch (err) {
      // Si falla el borrado en el backend, la regresamos a la lista.
      setTareas((prev) => [tarea, ...prev]);
      setErrorTareas(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28 lg:pb-12 overflow-x-hidden relative">
      {/* 1. Header Minimalista con Saludo */}
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

      {/* 2. Contenido: en móvil es una sola columna (Todú arriba, tareas abajo);
             en escritorio (lg) se convierte en 2 columnas lado a lado. */}
      <main className="max-w-md mx-auto px-6 flex flex-col gap-4 lg:max-w-5xl lg:flex-row lg:items-start lg:gap-10 lg:px-10">

        {/* 2a. Hero Section: Todú Protagonista con FX */}
        <section className="flex flex-col items-center justify-center w-full pt-2 pb-8 lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-8 lg:pb-0 lg:-translate-x-6">
          <div
            className="relative mx-auto mb-6"
            style={{ width: avatarSize + 20, height: avatarSize + 20 }}
          >
            <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -top-2 -left-4 w-3 h-3 bg-yellow-400 rounded-full blur-[2px] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute top-1/2 -right-6 w-2 h-2 bg-violet-300 rounded-full blur-[1px] animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-rose-400 rounded-full blur-[1px] animate-bounce" style={{ animationDelay: '0.8s' }}></div>

            <div className="absolute inset-0 flex items-center justify-center overflow-visible">
              <ToduAvatar emotion="idle" size={avatarSize} />
            </div>
          </div>

          {/* En escritorio el botón de crear tarea vive junto a Todú en vez de flotar */}
          <AnimatedButton
            onClick={() => setShowCrear(true)}
            className="hidden lg:flex w-full"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            Nueva tarea
          </AnimatedButton>
        </section>

        {/* 2b. Lista de Tareas (datos reales) */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tareas de Hoy</h2>

          {loadingTareas && (
            <p className="text-sm text-slate-500 text-center py-8">Cargando tus tareas...</p>
          )}

          {errorTareas && !loadingTareas && (
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center">
              {errorTareas}
            </p>
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
              />
            ))}
          </div>
        </div>
      </main>

      {/* 4. Botón Flotante para Agregar Tareas (solo móvil; en escritorio está junto a Todú) */}
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
          onSave={(nueva) => setTareas((prev) => [nueva, ...prev])}
        />
      )}

      {tareaEditando && (
        <TareaFormModal
          tareaInicial={tareaEditando}
          onClose={() => setTareaEditando(null)}
          onSave={(actualizada) =>
            setTareas((prev) => prev.map((t) => (t.id === actualizada.id ? actualizada : t)))
          }
        />
      )}

      {/* 5. Modal de Ayuda */}
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