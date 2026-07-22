'use client';
import { CheckCircle2, Clock, Pencil, Trash2, Camera, Repeat, Bell } from 'lucide-react';
import { DIAS_SEMANA } from '../constants';

export default function TaskCard({ tarea, onEdit, onDelete, onEvidencia }) {
  const isVencida = tarea.estado === 'vencida' || tarea.estado === 'expired';
  const isCompletada = tarea.estado === 'completed';
  const esFija = tarea.tipo === 'fija';

  const textoDias = (diasSemana) => {
    if (!diasSemana || diasSemana.length === 0 || diasSemana.length === 7) return 'Se repite cada día';
    const letras = diasSemana
      .map((num) => DIAS_SEMANA.find((d) => d.numero === num)?.letra)
      .filter(Boolean);
    return `Se repite: ${letras.join(', ')}`;
  };

  const formato12Horas = (timeStr) => {
    if (!timeStr) return '--:--';
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
    const [h, m] = timeStr.split(':');
    let hora = parseInt(h, 10);
    const ampm = hora >= 12 ? 'PM' : 'AM';
    hora = hora % 12 || 12;
    return `${hora.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  return (
    <div className={`bg-[#1f1638] border border-white/5 rounded-3xl p-4 flex items-center justify-between gap-3 shadow-lg ${isVencida ? 'border-l-4 border-l-rose-500' : ''}`}>
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className={`text-base font-bold truncate ${isCompletada ? 'text-slate-500 line-through' : 'text-white'}`}>
          {tarea.titulo}
        </h3>
        {esFija && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
              <Repeat className="w-2.5 h-2.5" />
              Diaria
            </span>
            {tarea.horaRecordatorio && (
              <span className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                <Bell className="w-2.5 h-2.5" />
                {formato12Horas(tarea.horaRecordatorio)}
              </span>
            )}
          </div>
        )}
        <div className={`flex items-center gap-1.5 ${isVencida ? 'text-rose-400' : 'text-slate-400'}`}>
          {isCompletada ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {esFija
              ? `${textoDias(tarea.diasSemana)} · ${tarea.xpValor} XP ${isCompletada ? '• Completada hoy' : ''}`
              : `${tarea.descripcion ? `${formato12Horas(tarea.descripcion)} · ` : ''}${tarea.xpValor} XP ${isVencida ? '• Atrasada' : isCompletada ? '• Completada' : ''}`
            }
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onEdit(tarea)} className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(tarea)} className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 border border-white/10 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
        {!isCompletada && (
          <button onClick={() => onEvidencia(tarea)} className="w-12 h-12 rounded-[1.2rem] bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center hover:bg-violet-500 hover:text-white transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}