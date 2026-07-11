'use client';
import { Check, Lock } from 'lucide-react';

export default function AccessoryCard({ item, owned, equipped, busy, nivelUsuario, onAction }) {
  const alcanzaNivel = (nivelUsuario ?? 0) >= item.nivelRequerido;
  const puedeDesbloquear = !owned && alcanzaNivel;

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors ${
        equipped
          ? 'bg-violet-500/10 border-violet-400/40'
          : 'bg-[#1f1638] border-white/5'
      }`}
    >
      {equipped && (
        <span className="absolute top-2 right-2 bg-violet-500 text-white rounded-full p-1">
          <Check className="w-3 h-3" />
        </span>
      )}
      <div className="w-14 h-14 rounded-xl bg-black/30 flex items-center justify-center text-3xl">
        {owned ? item.emoji : <Lock className="w-5 h-5 text-slate-600" />}
      </div>
      <p className="text-xs font-bold text-slate-200">{item.label}</p>

      {!owned && !alcanzaNivel ? (
        <span className="w-full text-[10px] font-black uppercase tracking-widest py-2 rounded-full text-center bg-black/30 text-slate-500 border border-white/5">
          Nivel {item.nivelRequerido}
        </span>
      ) : (
        <button
          disabled={busy || (!owned && !puedeDesbloquear)}
          onClick={() => onAction(item)}
          className={`w-full text-[10px] font-black uppercase tracking-widest py-2 rounded-full transition-colors disabled:opacity-50 ${
            equipped
              ? 'bg-white/10 text-slate-300 hover:bg-white/20'
              : owned
              ? 'bg-violet-600 text-white hover:bg-violet-500'
              : 'bg-todu-gold/90 text-black hover:bg-todu-gold'
          }`}
        >
          {busy ? '...' : equipped ? 'Desequipar' : owned ? 'Equipar' : 'Desbloquear'}
        </button>
      )}
    </div>
  );
}