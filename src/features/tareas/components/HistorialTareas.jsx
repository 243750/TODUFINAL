'use client';
import { CheckCircle2, XCircle, Repeat } from 'lucide-react';

// Recibe un objeto ya agrupado por fecha "YYYY-MM-DD":
// { "2026-07-20": { completadas: [...], noCompletadas: [...] }, ... }
// Cada item puede ser una tarea normal ({ id, titulo, xpValor }) o una
// entrada de historial de fija ({ id, titulo, esFija: true } — sin
// xpValor, porque GET /tareas/historial-fijas no lo manda).
// (ver el agrupado en tareas/page.js — ahí vive la lógica de qué
// cuenta como "hoy" vs "historial", y de mezclar ambas fuentes).
const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const texto = fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

export default function HistorialTareas({ historial }) {
  const fechas = Object.keys(historial).sort((a, b) => (a < b ? 1 : -1));

  if (fechas.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-8">
        Todavía no hay historial — aquí van apareciendo tus tareas de días anteriores.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {fechas.map((fechaISO) => {
        const { completadas, noCompletadas } = historial[fechaISO];
        return (
          <div key={fechaISO}>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {formatearFecha(fechaISO)}
            </h3>
            <div className="flex flex-col gap-2">
              {completadas.map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-[#1f1638] border border-white/5 rounded-2xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-300 truncate">{t.titulo}</span>
                  {t.esFija && (
                    <span className="flex-shrink-0 flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      <Repeat className="w-2.5 h-2.5" />
                      Diaria
                    </span>
                  )}
                  {t.xpValor != null && (
                    <span className="text-[10px] text-slate-500 ml-auto flex-shrink-0">{t.xpValor} XP</span>
                  )}
                </div>
              ))}
              {noCompletadas.map((t) => (
                <div key={t.id} className="flex items-center gap-2 bg-[#1f1638] border border-white/5 rounded-2xl px-4 py-3 opacity-70">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="text-sm font-bold text-slate-400 truncate line-through">{t.titulo}</span>
                  {t.esFija && (
                    <span className="flex-shrink-0 flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                      <Repeat className="w-2.5 h-2.5" />
                      Diaria
                    </span>
                  )}
                  {t.xpValor != null && (
                    <span className="text-[10px] text-slate-500 ml-auto flex-shrink-0">{t.xpValor} XP</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}