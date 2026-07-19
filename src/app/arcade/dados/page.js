'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ToduAvatar from '../../../components/ToduAvatar';
import useDadosGame from '../../../features/dados/hooks/useDadosGame';
import DieFace from '../../../features/dados/components/DieFace';
import { useAuth } from '../../../context/AuthContext';

export default function DadosPage() {
  const [showHelp, setShowHelp] = useState(false);
  const { user } = useAuth(); 

  const {
    META_PUNTOS, dice, turnScore, playerScore, toduScore, activePlayer, winner, isRolling, message,
    toduEmotion, rollDice, toggleDieSelection, bankPoints, jugarRevancha, currentSelectionPoints,
    canRollOrBank, isFirstRoll, xpDisponible, apuestaMinima, apuestaMaxima, apuestaXP, setApuestaXP,
    apuestaConfirmada, confirmarApuesta, cargandoApuesta, errorApuesta, premioSiGanas,
    resolviendoApuesta, resultadoApuesta, verificandoPartida, resolverApuesta
  } = useDadosGame();

  // Evita que React (en desarrollo, con doble-montaje de efectos) mande
  // la petición de resolver dos veces — la segunda le llegaba al backend
  // con la partida ya cerrada, fallaba, y esa era la razón de que a veces
  // se viera "Tus Nuevos Coins: 0" con un premio inventado en el cliente.
  const resueltaRef = useRef(false);

  useEffect(() => {
    if (winner && !resueltaRef.current) {
      resueltaRef.current = true;
      resolverApuesta(winner === 'Jugador', user?.id);
    }
  }, [winner, resolverApuesta, user]);

  useEffect(() => {
    if (!winner) resueltaRef.current = false;
  }, [winner]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans pb-10 overflow-x-hidden relative selection:bg-cyan-500 selection:text-white">
      {/* Fondo Matrix */}
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
        
        {/* Marcador */}
        <div className="flex justify-between items-center mb-6 gap-3">
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

        {/* TODÚ GIGANTE PASANDO LA EMOCIÓN */}
        <div className="flex justify-center -mb-8 z-20 relative">
          <div className="w-48 h-48 drop-shadow-2xl">
            <ToduAvatar emotion={toduEmotion} size={192} zoom={1.4} />
          </div>
        </div>

        <div className="text-center mb-4 relative z-30">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-[#050505] inline-block px-4 py-1 rounded-full border border-slate-800">Meta: {META_PUNTOS} PTS</p>
        </div>

        {/* Slider de Apuesta */}
        {verificandoPartida ? (
          <div className="text-center text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">
            Revisando si tienes una partida en curso...
          </div>
        ) : isFirstRoll && !apuestaConfirmada ? (
          <div className="bg-black/60 border-2 border-amber-500/30 rounded-3xl p-5 mb-6 relative z-30">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Apuesta tus Coins</p>
              <p className="text-xl font-black text-amber-400">{apuestaXP} Coins</p>
            </div>
            <p className="text-[10px] text-slate-500 font-bold mb-3">Coins disponibles: {xpDisponible || 0}</p>

            {xpDisponible < apuestaMinima ? (
              <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center">
                No tienes Coins suficientes para apostar (mínimo {apuestaMinima}). Completa tareas para ganar más.
              </p>
            ) : (
              <>
                <input
                  type="range"
                  min={apuestaMinima}
                  max={apuestaMaxima}
                  step={5}
                  value={apuestaXP}
                  onChange={(e) => setApuestaXP(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1 mb-4">
                  <span>{apuestaMinima}</span>
                  <span>{apuestaMaxima} (todo)</span>
                </div>
                {errorApuesta && (
                  <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-center mb-3">
                    {errorApuesta}
                  </p>
                )}
                <button
                  onClick={() => confirmarApuesta(user?.id)}
                  disabled={cargandoApuesta}
                  className="w-full py-3 rounded-full font-black uppercase tracking-widest text-sm bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black transition-all active:scale-95"
                >
                  {cargandoApuesta ? 'Apostando...' : `Apostar y jugar (premio: ${apuestaXP * 2} Coins)`}
                </button>
              </>
            )}
          </div>
        ) : apuestaConfirmada ? (
          <div className="flex justify-center mb-6 relative z-30">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
              Apuesta activa: {apuestaXP} Coins · Premio si ganas: {premioSiGanas} Coins
            </span>
          </div>
        ) : null}

        {/* Tablero de Dados */}
        <div className={`bg-black/60 border-2 rounded-3xl p-6 min-h-[280px] flex flex-col justify-center items-center relative transition-colors z-10 ${activePlayer === 'player' ? 'border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.05)]' : 'border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]'}`}>
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

        {/* Botones de Acción */}
        <div className={`mt-8 flex flex-col gap-4 transition-opacity duration-500 relative z-20 ${activePlayer === 'player' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <button
            onClick={rollDice}
            disabled={verificandoPartida || (!isFirstRoll && !canRollOrBank && !message) || (isFirstRoll && !apuestaConfirmada)}
            className={`w-full py-4 rounded-full font-black uppercase tracking-widest transition-all ${
              verificandoPartida || (!isFirstRoll && !canRollOrBank && !message) || (isFirstRoll && !apuestaConfirmada)
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

        {/* Modal de Victoria */}
        {winner && (
          <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center border-t-4 border-cyan-500">
             <div className="mb-6 bg-[#0b1120] rounded-full p-4 border border-white/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
               <ToduAvatar emotion={winner === 'Jugador' ? 'surprised' : 'happy'} size={180} zoom={1.5} />
             </div>
             <h2 className={`text-4xl font-black tracking-widest mb-4 drop-shadow-[0_0_15px_currentColor] ${winner === 'Jugador' ? 'text-cyan-400' : 'text-purple-400'}`}>
                {winner === 'Jugador' ? '¡GANASTE!' : 'TODÚ GANA'}
             </h2>
             <p className="text-slate-300 font-medium mb-2">Marcador Final</p>
             <p className="text-white text-2xl font-black mb-6 bg-white/10 px-6 py-2 rounded-2xl border border-white/20">
               Tú: {playerScore} <span className="text-slate-500 mx-2">|</span> Todú: {toduScore}
             </p>

             {resolviendoApuesta ? (
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6 animate-pulse">
                 Sincronizando tu cartera...
               </p>
             ) : resultadoApuesta ? (
               <div className={`mb-6 p-4 rounded-2xl border w-full max-w-xs mx-auto ${
                 resultadoApuesta.gano ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
               }`}>
                 <p className={`text-sm font-black uppercase tracking-widest mb-2 ${resultadoApuesta.gano ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {resultadoApuesta.gano ? `+ ${resultadoApuesta.premio} COINS GANADOS` : 'APUESTA PERDIDA'}
                 </p>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                   Tus Nuevos Coins: <span className="text-white">{resultadoApuesta.xpDisponible ?? 0}</span>
                 </p>
               </div>
             ) : null}

             <button onClick={jugarRevancha} className="bg-cyan-600 text-white font-black uppercase tracking-widest px-10 py-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] mb-6 border border-cyan-400 active:scale-95 transition-transform">
               Jugar Revancha
             </button>
             <Link href="/arcade" className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Volver al Lobby</Link>
          </div>
        )}
      </main>
      
      {/* Ayuda Modal Ampliada */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#111827] border border-cyan-500/30 rounded-3xl p-6 w-full max-w-sm relative shadow-[0_0_30px_rgba(6,182,212,0.2)] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowHelp(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex flex-col items-center text-center mb-5 border-b border-white/5 pb-5">
              <div className="w-14 h-14 bg-cyan-900 border border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <span className="font-black text-2xl">?</span>
              </div>
              <h3 className="text-cyan-400 font-black tracking-widest uppercase text-lg">Reglas de Farkle</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">El primero en {META_PUNTOS} PTS gana la apuesta.</p>
            </div>
            
            <div className="space-y-5 text-sm text-slate-300 font-medium">
              <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-500/20">
                <h4 className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-2">¿Qué son los Coins?</h4>
                <p className="text-xs leading-relaxed text-amber-100/80">
                  Son tu cartera gastable — distinta de tu XP Total (el que nunca baja y define tu Nivel). Ganas Coins al completar tareas, y aquí los apuestas: si ganas, se duplican (tu apuesta de vuelta + lo ganado); si pierdes, se van. Tu Nivel nunca se ve afectado por Farkle.
                </p>
              </div>

              <p>Tira los 6 dados. Para sumar puntos y seguir tirando, <span className="text-white font-bold">debes seleccionar dados válidos</span>.</p>
              
              <div className="bg-black/50 rounded-xl p-4 border border-white/10 space-y-3">
                <h4 className="text-[10px] text-cyan-500 font-black uppercase tracking-widest border-b border-cyan-500/20 pb-2">Tabla de Puntuación</h4>
                <li className="flex justify-between items-center text-xs">
                  <span>Cada (1) individual</span> <span className="font-bold text-white">100 pts</span>
                </li>
                <li className="flex justify-between items-center text-xs">
                  <span>Cada (5) individual</span> <span className="font-bold text-white">50 pts</span>
                </li>
                <li className="flex justify-between text-xs pt-2 border-t border-white/5">
                  <span>Trío de (1)</span> <span className="font-bold text-yellow-400">1000 pts</span>
                </li>
                <li className="flex justify-between text-xs">
                  <span>Otros Tríos (ej. tres 4)</span> <span className="font-bold text-white">Cara x 100</span>
                </li>
                <li className="flex justify-between text-xs text-slate-400 italic">
                  <span>(ej. Trío de 4 = 400 pts)</span>
                </li>
                <li className="flex justify-between text-xs pt-2 border-t border-white/5">
                  <span>Cada dado extra tras el trío</span> <span className="font-bold text-emerald-400">+1/10 del trío</span>
                </li>
                <li className="flex justify-between text-xs text-slate-400 italic">
                  <span>(ej. cuatro 2 = 200 + 20 = 220)</span>
                </li>
                <li className="flex justify-between text-xs pt-2 border-t border-white/5">
                  <span>Escalera completa (1-2-3-4-5 o 2-3-4-5-6)</span> <span className="font-bold text-yellow-400">1500 pts</span>
                </li>
              </div>

              <div className="bg-rose-950/30 rounded-xl p-4 border border-rose-500/20">
                <h4 className="text-[10px] text-rose-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span>⚠️</span> La Regla ZOUNDS (Farkle)
                </h4>
                <p className="text-xs leading-relaxed text-rose-200/80">
                  Si tiras los dados y <span className="text-white font-bold">ninguno suma puntos</span>, has sacado ZOUNDS. 
                  Pierdes tu turno inmediatamente y todos los puntos que habías acumulado en esa ronda se esfuman.
                </p>
              </div>

              <button onClick={() => setShowHelp(false)} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-colors text-xs tracking-wider uppercase mt-2">
                ¡A Jugar!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}