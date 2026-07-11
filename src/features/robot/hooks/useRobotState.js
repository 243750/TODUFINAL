'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function useRobotState() {
  const { user } = useAuth();
  const [emocionActual, setEmocionActual] = useState('idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    api.get(`/robot/estado/${user.id}`)
      .then((data) => {
        setEmocionActual(data.emocion ?? 'idle');
      })
      .catch(() => {
        setEmocionActual('idle');
      });
  }, [user]);

  const dispararEvento = useCallback(async (evento) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await api.post('/robot/evento', { userId: user.id, event: evento });
      setEmocionActual((data.emotion ?? 'idle').toLowerCase());

      if (['Happy', 'Surprised', 'Scared'].includes(data.emotion)) {
        setTimeout(async () => {
          try {
            const estadoActual = await api.get(`/robot/estado/${user.id}`);
            setEmocionActual(estadoActual.emocion ?? 'idle');
          } catch {
            setEmocionActual('idle');
          }
        }, 4000);
      }
    } catch {
      // Si falla el backend el robot no se rompe
    } finally {
      setLoading(false);
    }
  }, [user]);

  const tareaCompletada = useCallback(() => dispararEvento('TASK_COMPLETED'), [dispararEvento]);
  const tareaRechazada  = useCallback(() => dispararEvento('TASK_EXPIRED'),   [dispararEvento]);
  const subioDeNivel    = useCallback(() => dispararEvento('LEVEL_UP'),       [dispararEvento]);
  const sinActividad    = useCallback(() => dispararEvento('NO_ACTIVITY'),    [dispararEvento]);
  const diaDeRacha      = useCallback(() => dispararEvento('STREAK_DAY'),     [dispararEvento]);

  return {
    emocionActual,
    loading,
    tareaCompletada,
    tareaRechazada,
    subioDeNivel,
    sinActividad,
    diaDeRacha,
  };
}