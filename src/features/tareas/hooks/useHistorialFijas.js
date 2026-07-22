'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';

// Historial de tareas fijas (GET /tareas/historial-fijas de Manuel).
// Se llena una vez por noche (00:05, justo antes del reset diario de
// las fijas) — no cambia en tiempo real al completar una tarea hoy,
// así que solo hace falta cargarlo una vez al montar.
export default function useHistorialFijas() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get('/tareas/historial-fijas')
      .then((data) => setHistorial(data.historial || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { historial, loading, error, refrescar: cargar };
}