'use client';
import { useState } from 'react';
import Link from 'next/link';
import ToduAvatar from '../../../components/ToduAvatar';
import useDadosGame from '../../../features/dados/hooks/useDadosGame';
import DieFace from '../../../features/dados/components/DieFace';

export default function DadosPage() {
  const [showHelp, setShowHelp] = useState(false);

  const {
    META_PUNTOS,
    APUESTA_MAX_DEMO,
    dice,
    turnScore,
    playerScore,
    toduScore,
    activePlayer,
    winner,
    isRolling,
    message,
    toduEmotion,
    apuestaXP,
    setApuestaXP,
    apuestaConfirmada,
    setApuestaConfirmada,
    rollDice,
    toggleDieSelection,
    bankPoints,
    jugarRevancha,
    currentSelectionPoints,
    canRollOrBank,
    isFirstRoll,
  } = useDadosGame();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-10 overflow-x-hidden relative selection:bg-cyan-500 selection:text-white">

      {/* Fondo Neón */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{ backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)`, backgroundSize: '40px 40px', backgroundPosition: 'center center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/80"></div>
      </div>

      <header className="relative z-10 sticky top-0 bg-[#050505]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-cyan-500/30">
        <div className="flex items-center gap-4">
          <Link href="/arcade" className="w-10 h-10 rounded-full bg-black border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-black text-cyan-400 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">Dados vs Todú</h1>
        </div>
        <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 hover:bg-cyan-900 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          <span className="font-black text-lg">?</span>
        </button>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-6 flex flex-col mt-6">

        {/* Marcadores Principales (Versus) — simétricos, sin avatar adentro */}
        <div className="flex justify-between items-center mb-6 gap-3">
          {/* Jugador */}
          <div className={`flex-1 rounded-2xl p-3 text-center border transition-all ${activePlayer === 'player' ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-black/40 border-cyan-500/20'}`}>
            <p className="text-[10px] text-cyan-300/70 uppercase tracking-widest font-bold mb-1">Tú</p>
            <p className="text-2xl font-black text-white">{playerScore}</p>
          </div>

          <div className="text-cyan-600 font-black text-xl italic opacity-50 px-2">VS</div>

          <div className={`flex-1 rounded-2xl p-3 text-center border transition-all ${activePlayer === 'todu' ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-black/40 border-purple-500/20'}`}>
            <p className="text-[10px] text-purple-300/70 uppercase tracking-widest font-bold mb-1">Todú</p>
            <p className="text-2xl font-black text-white">{toduScore}</p>
          </div>
        </div>

        {/* Todú, solo y sin marco, reaccionando arriba de la meta */}
        <div className="flex justify-center -mb-2">
          <div className="w-32 h-32">
            <ToduAvatar emotion={toduEmotion} size={132} />
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Meta: {META_PUNTOS} PTS</p>
        </div>

        {/* Barra de apuesta de XP — PROTOTIPO VISUAL, sin conexión real a XP todavía */}
        {isFirstRoll && !apuestaConfirmada ? (
          <div className="bg-black/60 border-2 border-amber-500/30 rounded-3xl p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Apuesta tu XP</p>
              <p className="text-xl font-black text-amber-400">{apuestaXP} XP</p>
            </div>
            <input
              type="range"
              min={0}
              max={APUESTA_MAX_DEMO}
              step={5}
              value={apuestaXP}
              onChange={(e) => setApuestaXP(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 mb-4">
              <span>0</span>
              <span>{APUESTA_MAX_DEMO} (todo)</span>
            </div>
            <button
              onClick={() => setApuestaConfirmada(true)}
              className="w-full py-3 rounded-full font-black uppercase tracking-widest text-sm bg-amber-500 hover:bg-amber-400 text-black transition-all active:scale-95"
            >
              Confirmar apuesta
            </button>
          </div>
        ) : apuestaConfirmada ? (
          <div className="flex justify-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
              Apuesta activa: {apuestaXP} XP
            </span>
          </div>
        ) : null}

        {/* Zona de Dados */}
        <div className={`bg-black/60 border-2 rounded-3xl p-6 min-h-[280px] flex flex-col justify-center items-center relative transition-colors ${activePlayer === 'player' ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.05)]' : 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]'}`}>

          <div className="absolute top-4 left-0 w-full text-center">
            {message ? (
              <span className="text-xs font-black uppercase tracking-widest text-white animate-pulse bg-black/80 px-4 py-1 rounded-full border border-white/10">{message}</span>
            ) : (
              <span className={`text-xs font-black uppercase tracking-widest ${activePlayer === 'player' ? 'text-cyan-400' : 'text-purple-400'}`}>
                {activePlayer === 'player' ? 'Tu Turno' : 'Turno de Todú'}
              </span>
            )}
          </div>

          <div className="mt-8 mb-6 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Acumulado del Turno</p>
            <p className={`text-4xl font-black drop-shadow-[0_0_10px_currentColor] ${activePlayer === 'player' ? 'text-cyan-400' : 'text-purple-400'}`}>
              {turnScore + (activePlayer === 'player' ? currentSelectionPoints : 0)}
            </p>
          </div>

          {isFirstRoll && !message ? (
            <div className="text-center opacity-50 my-6">
              <span className="text-5xl mb-4 block">🎲</span>
              <p className="text-sm font-bold tracking-widest uppercase">Tira para empezar</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-5 w-full place-items-center">
              {dice.map((d, index) => (
                <button
                  key={index}
                  onClick={() => toggleDieSelection(index)}
                  disabled={d.locked || d.value === null || activePlayer !== 'player'}
                  className={`w-16 h-16 rounded-xl transition-all duration-300 transform ${
                    isRolling ? 'animate-spin opacity-50 scale-75' : 'scale-100'
                  } ${
                    d.value === null ? 'bg-transparent border-2 border-slate-800' :
                    d.locked ? 'bg-slate-900 border-2 border-slate-700 text-slate-600 cursor-not-allowed opacity-40' :
                    d.selected ? (activePlayer === 'player' ? 'bg-cyan-600 border-2 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.8)] -translate-y-2' : 'bg-purple-600 border-2 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] -translate-y-2') :
                    'bg-slate-800 border-2 border-slate-500 text-white hover:border-white shadow-lg'
                  }`}
                >
                  <DieFace value={d.value} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Controles de Acción */}
        <div className={`mt-8 flex flex-col gap-4 transition-opacity duration-500 ${activePlayer === 'player' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <button
            onClick={rollDice}
            disabled={(!isFirstRoll && !canRollOrBank && !message) || (isFirstRoll && !apuestaConfirmada)}
            className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all ${
              (!isFirstRoll && !canRollOrBank && !message) || (isFirstRoll && !apuestaConfirmada)
                ? 'bg-slate-800 text-slate-500'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95'
            }`}
          >
            {isFirstRoll ? 'Tirar Dados' : 'Separar y Volver a Tirar'}
          </button>

          <button
            onClick={bankPoints}
            disabled={isFirstRoll || turnScore + currentSelectionPoints === 0 || message !== ''}
            className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all border-2 ${
              (isFirstRoll || turnScore + currentSelectionPoints === 0 || message !== '')
                ? 'border-slate-800 text-slate-700'
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-950 active:scale-95'
            }`}
          >
            Plantarse y Asegurar Puntos
          </button>
        </div>

        {/* Modal de Victoria/Derrota con Reacciones de Todú */}
        {winner && (
          <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-t-4 border-cyan-500">

             {/* Rive Avatar en lugar de emojis */}
             <div className="mb-6 bg-[#0b1120] rounded-full p-4 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
               <ToduAvatar
                 emotion={winner === 'Jorge' ? 'surprised' : 'happy'}
                 size={100}
               />
             </div>

             <h2 className={`text-4xl font-black tracking-widest mb-4 drop-shadow-[0_0_15px_currentColor] ${winner === 'Jorge' ? 'text-cyan-400' : 'text-purple-400'}`}>
                {winner === 'Jorge' ? '¡GANASTE!' : 'TODÚ GANA'}
             </h2>

             <p className="text-slate-300 font-medium mb-2">
               Marcador Final
             </p>
             <p className="text-white text-2xl font-black mb-10 bg-white/10 px-6 py-2 rounded-2xl border border-white/20">
               Tú: {playerScore} <span className="text-slate-500 mx-2">|</span> Todú: {toduScore}
             </p>

             <button onClick={jugarRevancha} className="bg-cyan-600 text-white font-black uppercase tracking-widest px-10 py-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] mb-6 border border-cyan-400 active:scale-95 transition-transform">
               Jugar Revancha
             </button>

             <Link href="/arcade" className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Volver al Lobby</Link>
          </div>
        )}
      </main>

      {/* Modal de Ayuda */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#111827] border border-cyan-500/30 rounded-3xl p-6 w-full max-w-sm relative shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
              <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" viewBox="0 0 100 100" fill="none">
                  <path d="M75 45 C85 40, 90 60, 80 65" stroke="white" strokeWidth="6" strokeLinecap="round"/>
                  <ellipse cx="50" cy="60" rx="30" ry="28" fill="white" />
                  <line x1="50" y1="32" x2="50" y2="15" stroke="white" strokeWidth="5" strokeLinecap="round" />
                  <circle cx="50" cy="12" r="4" fill="#06B6D4" />
                  <path d="M35 55 Q40 48 45 55" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
                  <path d="M55 55 Q60 48 65 55" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-cyan-400 font-black tracking-widest uppercase text-sm">Todú te explica</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">El primero en {META_PUNTOS} gana</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300 font-medium">
              <p>Tira los 6 dados. Para seguir tirando, <span className="text-white font-bold">selecciona dados que sumen puntos</span>.</p>

              <ul className="bg-black/50 rounded-xl p-4 border border-white/5 space-y-3">
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    Dado con
                    <div className="w-4 h-4 rounded-md border border-cyan-500/50 flex items-center justify-center bg-slate-900">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_3px_currentColor]"></div>
                    </div>
                    (1)
                  </span>
                  <span className="font-bold text-white">100 pts</span>
                </li>

                {/* Corrección del Dado 5 */}
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    Dado con
                    <div className="w-4 h-4 rounded-md border border-cyan-500/50 bg-slate-900 p-0.5 grid grid-cols-3 grid-rows-3 place-items-center">
                      <div className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></div><div></div><div className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></div>
                      <div></div><div className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></div><div></div>
                      <div className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></div><div></div><div className="w-0.5 h-0.5 bg-cyan-400 rounded-full"></div>
                    </div>
                    (5)
                  </span>
                  <span className="font-bold text-white">50 pts</span>
                </li>

                <li className="flex justify-between pt-1 border-t border-white/10"><span>Trío de 1s</span> <span className="font-bold text-yellow-400">1000 pts</span></li>
                <li className="flex justify-between"><span>Otros Tríos (ej. 4-4-4)</span> <span className="font-bold text-white">Valor x 100</span></li>
              </ul>

              <p className="text-rose-400 font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-xs">
                ⚠️ Si tiras y no sale ningún 1, 5 o trío, pierdes los puntos del turno (ZOUNDS) y le toca a Todú.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}