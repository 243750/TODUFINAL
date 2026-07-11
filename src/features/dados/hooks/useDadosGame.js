'use client';
import { useState, useEffect } from 'react';
import { calculatePoints, isBust, getScoringIndices, META_PUNTOS } from '../logic';

export default function useDadosGame() {
  // Estados del Juego
  const [dice, setDice] = useState(Array(6).fill({ value: null, locked: false, selected: false }));
  const [turnScore, setTurnScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [toduScore, setToduScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState('player');
  const [winner, setWinner] = useState(null);

  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState('');

  // Estado para controlar la emoción del avatar de Todú en tiempo real
  const [toduEmotion, setToduEmotion] = useState('idle');

  // --- Prototipo de barra de apuesta de XP (solo visual por ahora, NO está
  // conectada a /xp/atomic ni a ningún saldo real — es para ver cómo se
  // vería y se sentiría antes de tocar el motor de XP real). ---
  const APUESTA_MAX_DEMO = 100; // tope de ejemplo; en real sería el XP del usuario
  const [apuestaXP, setApuestaXP] = useState(20);
  const [apuestaConfirmada, setApuestaConfirmada] = useState(false);

  // Todú reacciona al tamaño de la apuesta mientras el jugador todavía
  // no confirma: se ríe si apuestas muy poco, se asombra si apuestas mucho.
  useEffect(() => {
    if (apuestaConfirmada) return;
    if (apuestaXP <= APUESTA_MAX_DEMO * 0.15) setToduEmotion('happy');
    else if (apuestaXP >= APUESTA_MAX_DEMO * 0.7) setToduEmotion('surprised');
    else setToduEmotion('idle');
  }, [apuestaXP, apuestaConfirmada]);

  // === TURNO DEL JUGADOR ===
  const rollDice = () => {
    setIsRolling(true);
    setMessage('');
    setToduEmotion('idle'); // Reseteamos emoción

    const currentSelectedValues = dice.filter((d) => d.selected && !d.locked).map((d) => d.value);
    const newPoints = calculatePoints(currentSelectedValues);
    setTurnScore((prev) => prev + newPoints);

    setTimeout(() => {
      let newDice = dice.map((d) => {
        if (d.locked || d.selected) return { ...d, locked: true, selected: false };
        return { value: Math.floor(Math.random() * 6) + 1, locked: false, selected: false };
      });

      if (newDice.every((d) => d.locked)) {
        newDice = Array.from({ length: 6 }, () => ({ value: Math.floor(Math.random() * 6) + 1, locked: false, selected: false }));
      }

      setDice(newDice);
      setIsRolling(false);

      if (isBust(newDice.filter((d) => !d.locked).map((d) => d.value))) {
        setMessage('¡ZOUNDS! Perdiste el turno.');
        setToduEmotion('happy'); // Todú se ríe de que perdiste
        setTimeout(() => { passTurn('todu'); }, 2000);
      }
    }, 500);
  };

  const toggleDieSelection = (index) => {
    if (activePlayer !== 'player' || dice[index].locked || isRolling || message || dice[index].value === null) return;
    const newDice = [...dice];
    newDice[index].selected = !newDice[index].selected;
    setDice(newDice);
  };

  const bankPoints = () => {
    const currentSelectedValues = dice.filter((d) => d.selected && !d.locked).map((d) => d.value);
    const newPoints = calculatePoints(currentSelectedValues);
    setPlayerScore((prev) => prev + turnScore + newPoints);
    setToduEmotion('idle');
    passTurn('todu');
  };

  const passTurn = (nextPlayer) => {
    setTurnScore(0);
    setDice(Array(6).fill({ value: null, locked: false, selected: false }));
    setMessage('');
    setActivePlayer(nextPlayer);
  };

  // === INTELIGENCIA ARTIFICIAL DE TODÚ ===
  useEffect(() => {
    let isMounted = true;
    if (activePlayer !== 'todu' || winner) return;

    const playToduTurn = async () => {
      let activeDice = Array(6).fill({ value: null, locked: false, selected: false });
      let currentTurnScore = 0;
      setToduEmotion('idle');

      const updateUI = async (d, s, delayMs = 1000) => {
        if (!isMounted) return;
        setDice([...d]);
        setTurnScore(s);
        await new Promise((r) => setTimeout(r, delayMs));
      };

      setMessage('Todú está pensando...');
      await new Promise((r) => setTimeout(r, 1200));

      while (isMounted && activePlayer === 'todu' && !winner) {
        setMessage('Todú tira los dados...');
        setIsRolling(true);
        activeDice = activeDice.map((d) =>
          (d.locked || d.selected) ? { ...d, locked: true, selected: false } : { value: Math.floor(Math.random() * 6) + 1, locked: false, selected: false }
        );
        if (activeDice.every((d) => d.locked)) activeDice = Array.from({ length: 6 }, () => ({ value: Math.floor(Math.random() * 6) + 1, locked: false, selected: false }));

        await updateUI(activeDice, currentTurnScore, 600);
        setIsRolling(false);

        const unlockedVals = activeDice.filter((d) => !d.locked).map((d) => d.value);
        if (isBust(unlockedVals)) {
          setMessage('¡Todú sacó ZOUNDS y pierde el turno!');
          setToduEmotion('sad'); // Todú se sorprende/entristece por perder turno
          await new Promise((r) => setTimeout(r, 2500));
          if (isMounted) {
            setToduEmotion('idle');
            passTurn('player');
          }
          return;
        }

        setMessage('Todú separa dados...');
        const scoringIndices = getScoringIndices(activeDice);
        scoringIndices.forEach((i) => activeDice[i].selected = true);
        await updateUI(activeDice, currentTurnScore, 1000);

        const selectedVals = activeDice.filter((d) => d.selected && !d.locked).map((d) => d.value);
        currentTurnScore += calculatePoints(selectedVals);
        setToduEmotion('happy'); // Se pone feliz porque sumó puntos
        await updateUI(activeDice, currentTurnScore, 1000);

        const unlockedCount = activeDice.filter((d) => !d.locked && !d.selected).length;
        if (toduScore + currentTurnScore >= META_PUNTOS || unlockedCount === 0 || currentTurnScore >= 400 || unlockedCount <= 2) {
          setMessage('Todú se planta y asegura.');
          await new Promise((r) => setTimeout(r, 1500));
          if (isMounted) {
            setToduScore((prev) => prev + currentTurnScore);
            setToduEmotion('idle');
            passTurn('player');
          }
          return;
        }
        setToduEmotion('idle');
      }
    };

    playToduTurn();
    return () => { isMounted = false; };
  }, [activePlayer, winner, toduScore]);

  // === COMPROBAR GANADOR ===
  useEffect(() => {
    if (playerScore >= META_PUNTOS) {
      setWinner('Jorge');
      setToduEmotion('sad');
    } else if (toduScore >= META_PUNTOS) {
      setWinner('Todú');
      setToduEmotion('surprised');
    }
  }, [playerScore, toduScore]);

  const jugarRevancha = () => {
    setPlayerScore(0);
    setToduScore(0);
    setWinner(null);
    setActivePlayer('player');
    setApuestaConfirmada(false);
    setApuestaXP(20);
  };

  const selectedValues = dice.filter((d) => d.selected && !d.locked).map((d) => d.value);
  const currentSelectionPoints = calculatePoints(selectedValues);
  const canRollOrBank = currentSelectionPoints > 0;
  const isFirstRoll = dice.every((d) => d.value === null);

  return {
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
  };
}
