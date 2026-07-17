'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DIFICULTADES } from '../constants';

export default function TareaFormModal({ onClose, onSave, tareaInicial, crearTarea, editarTarea }) {
  const esEdicion = !!tareaInicial;

  // Lógica para extraer la hora si estamos editando (Ej: "09:30 AM")
  const parsearHoraInicial = () => {
    if (!tareaInicial?.descripcion) return { h: '09', m: '00', a: 'AM' };
    const match = tareaInicial.descripcion.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let h = match[1];
      if (h.length === 1) h = '0' + h; // Asegurar 2 dígitos
      return { h, m: match[2], a: match[3]?.toUpperCase() || 'AM' };
    }
    return { h: '09', m: '00', a: 'AM' };
  };

  const tiempoInicial = parsearHoraInicial();
  
  const [titulo, setTitulo] = useState(tareaInicial?.titulo || '');
  const [hora, setHora] = useState(tiempoInicial.h);
  const [minuto, setMinuto] = useState(tiempoInicial.m);
  const [ampm, setAmpm] = useState(tiempoInicial.a);
  
  const dificultadInicial = tareaInicial
    ? DIFICULTADES.find((d) => d.xpValor === tareaInicial.xpValor)?.key || 'facil'
    : 'facil';
  const [dificultad, setDificultad] = useState(dificultadInicial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const xpValor = DIFICULTADES.find((d) => d.key === dificultad).xpValor;
      
      // Guardamos la hora exacta como un string limpio de 12 hrs
      const horarioFinal = `${hora}:${minuto} ${ampm}`;

      const payload = {
        titulo: titulo.trim(),
        descripcion: horarioFinal, // El backend guardará "09:30 AM"
        xpValor,
      };

      if (esEdicion) {
        const tarea = await editarTarea(tareaInicial.id, payload);
        onSave(tarea);
      } else {
        const tarea = await crearTarea(payload);
        onSave(tarea);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const horas = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutos = ['00', '15', '30', '45'];

  return (
    <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)] animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-black text-white mb-6">{esEdicion ? 'Editar tarea' : 'Nueva tarea'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">{error}</p>
          )}
          
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la tarea"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors"
            required
            autoFocus
          />

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Horario</p>
            <div className="flex gap-2">
              <select 
                value={hora} 
                onChange={(e) => setHora(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-violet-500/50 appearance-none text-center"
              >
                {horas.map(h => <option key={h} value={h} className="bg-[#1f1638]">{h}</option>)}
              </select>
              <span className="flex items-center text-slate-500 font-bold">:</span>
              <select 
                value={minuto} 
                onChange={(e) => setMinuto(e.target.value)}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-violet-500/50 appearance-none text-center"
              >
                {minutos.map(m => <option key={m} value={m} className="bg-[#1f1638]">{m}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setAmpm(ampm === 'AM' ? 'PM' : 'AM')}
                className="flex-1 bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/40 rounded-xl px-3 py-3 text-sm font-black transition-colors"
              >
                {ampm}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Dificultad</p>
            <div className="grid grid-cols-4 gap-2">
              {DIFICULTADES.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDificultad(d.key)}
                  className={`py-3 rounded-xl text-[11px] font-bold border transition-colors ${
                    dificultad === d.key
                      ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                      : 'bg-black/20 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {d.label}<br />
                  <span className="opacity-70">{d.xpValor} XP</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black rounded-2xl transition-all text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(139,92,246,0.3)] active:scale-95"
          >
            {loading ? (esEdicion ? 'Guardando...' : 'Creando...') : (esEdicion ? 'Guardar cambios' : 'Crear tarea')}
          </button>
        </form>
      </div>
    </div>
  );
}