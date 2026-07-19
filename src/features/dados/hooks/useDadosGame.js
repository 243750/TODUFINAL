'use client';
import { useState, useEffect, useCallback } from 'react';
import { calculatePoints, isBust, getScoringIndices, META_PUNTOS } from '../logic';
import { api, ApiError } from '../../../lib/api';
import useGamificacion from '../../gamificacion/hooks/useGamificacion';
import useRobotState from '../../robot/hooks/useRobotState';

const APUESTA_MINIMA = 10;
const APUESTA_MAXIMA_ABSOLUTA = 5000;

export default function useDadosGame() {
  const [dice, setDice] = useState(Array(6).fill({ value: null, locked: false, selected: false }));
  const [turnScore, setTurnScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [toduScore, setToduScore] = useState(0);
  const [activePlayer, setActivePlayer] = useState('player');
  const [winner, setWinner] = useState(null);

  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState('');
  const [toduEmotion, setToduEmotion] = useState('idle');

  const { progreso, refrescar: refrescarGamificacion } = useGamificacion();
  const { refrescar: refrescarRobot } = useRobotState(); 

  const xpDisponible = progreso?.xpDisponible ?? 0;
  const apuestaMaxima = Math.max(APUESTA_MINIMA, Math.min(APUESTA_MAXIMA_ABSOLUTA, xpDisponible));

  const [apuestaXP, setApuestaXP] = useState(APUESTA_MINIMA);
  const [partidaId, setPartidaId] = useState(null);
  const [apuestaConfirmada, setApuestaConfirmada] = useState(false);
  const [premioSiGanas, setPremioSiGanas] = useState(0);
  const [cargandoApuesta, setCargandoApuesta] = useState(false);
  const [errorApuesta, setErrorApuesta] = useState(null);
  const [resolviendoApuesta, setResolviendoApuesta] = useState(false);
  const [resultadoApuesta, setResultadoApuesta] = useState(null);
  const [verificandoPartida, setVerificandoPartida] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/juegos/farkle/activa')
      .then((data) => {
        if (cancelled) return;
        if (data.activa && data.partida) {
          setPartidaId(data.partida.partidaId);
          setApuestaXP(data.partida.apuesta);
          setPremioSiGanas(data.partida.apuesta * 2);
          setApuestaConfirmada(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setVerificandoPartida(false); });
    return () => { cancelled = true; };
  }, []);

  // REACCIONES DE APUESTA (Nuevos Rangos)
  useEffect(() => {
    if (apuestaConfirmada || isRolling || winner) return;
    
    const porcentajeApuesta = apuestaMaxima > 0 ? apuestaXP / apuestaMaxima : 0;
    
    // Si apuesta 10 (mínima), 15, o menos del 20% de su dinero -> Feliz/Se burla
    if (apuestaXP <= 15 || porcentajeApuesta <= 0.20) {
      setToduEmotion('happy'); 
    } 
    // Si apuesta la mitad o más de su dinero -> Se asusta
    else if (apuestaXP >= 100 || porcentajeApuesta >= 0.50) {
     setToduEmotion('surprised');
    } 
    // Término medio
    else {
      setToduEmotion('idle');
    }
  }, [apuestaXP, apuestaConfirmada, apuestaMaxima, isRolling, winner]);

  const confirmarApuesta = useCallback(async (userId) => {
    setErrorApuesta(null);
    setCargandoApuesta(true);
    try {
      const data = await api.post('/juegos/farkle/apostar', { apuesta: apuestaXP });
      setPartidaId(data.partidaId);
      setPremioSiGanas(data.premioSiGanas);
      setApuestaConfirmada(true);
      if (userId) await refrescarGamificacion(userId);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorApuesta(err.message || 'Error del servidor.');
      } else {
        setErrorApuesta('Error de conexión.');
      }
    } finally {
      setCargandoApuesta(false);
    }
  }, [apuestaXP, refrescarGamificacion]);

  const resolverApuesta = useCallback(async (gano, userId) => {
    if (!partidaId) return;
    setResolviendoApuesta(true);
    try {
      const data = await api.post('/juegos/farkle/resolver', {
        partidaId,
        resultado: gano ? 'ganada' : 'perdida',
      });
      setResultadoApuesta({ gano, premio: data.premio ?? 0, xpDisponible: data.xpDisponible });
      if (userId) await refrescarGamificacion(userId);
      refrescarRobot();
    } catch (err) {
      setResultadoApuesta({ gano, premio: gano ? apuestaXP * 2 : 0, xpDisponible: null });
    } finally {
      setResolviendoApuesta(false);
      setPartidaId(null);
    }
  }, [partidaId, apuestaXP, refrescarGamificacion, refrescarRobot]);

  const rollDice = () => {
    setIsRolling(true);
    setMessage('');
    setToduEmotion('surprised'); 

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
        setToduEmotion('happy'); // Se ríe de que sacaste Zounds
        setTimeout(() => { passTurn('todu'); }, 2000);
      } else {
        setToduEmotion('idle');
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
          setMessage('¡Todú sacó ZOUNDS!');
          setToduEmotion('sad'); // Todú se pone triste si ÉL saca Zounds
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
      }
    };

    playToduTurn();
    return () => { isMounted = false; };
  }, [activePlayer, winner, toduScore]);

  // REACCIONES DE VICTORIA
  useEffect(() => {
    if (playerScore >= META_PUNTOS && !winner) {
      setWinner('Jugador');
      setToduEmotion('sad'); // Tú ganas -> Todú pierde y se pone triste
    } else if (toduScore >= META_PUNTOS && !winner) {
      setWinner('Todú');
      setToduEmotion('happy'); // Todú gana -> Se burla de ti
    }
  }, [playerScore, toduScore, winner]);

  const jugarRevancha = () => {
    setPlayerScore(0);
    setToduScore(0);
    setWinner(null);
    setActivePlayer('player');
    setApuestaConfirmada(false);
    setApuestaXP(APUESTA_MINIMA);
    setPartidaId(null);
    setResultadoApuesta(null);
    setErrorApuesta(null);
    setToduEmotion('idle');
  };

  const selectedValues = dice.filter((d) => d.selected && !d.locked).map((d) => d.value);
  const currentSelectionPoints = calculatePoints(selectedValues);
  const canRollOrBank = currentSelectionPoints > 0;
  const isFirstRoll = dice.every((d) => d.value === null);

  return {
    META_PUNTOS, dice, turnScore, playerScore, toduScore, activePlayer, winner, isRolling, message,
    toduEmotion, rollDice, toggleDieSelection, bankPoints, jugarRevancha, currentSelectionPoints,
    canRollOrBank, isFirstRoll, xpDisponible, apuestaMinima: APUESTA_MINIMA, apuestaMaxima,
    apuestaXP, setApuestaXP, apuestaConfirmada, confirmarApuesta, cargandoApuesta, errorApuesta,
    premioSiGanas, resolviendoApuesta, resultadoApuesta, verificandoPartida, resolverApuesta
  };
}