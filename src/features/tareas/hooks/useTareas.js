'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';

export default function useTareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pollingRef = useRef(null);

  const cargarTareas = useCallback((mostrarLoading = false) => {
    if (mostrarLoading) setLoading(true);
    return api.get('/tareas/mis-tareas')
      .then((data) => setTareas(data.tareas || []))
      .catch((err) => setError(err.message))
      .finally(() => { if (mostrarLoading) setLoading(false); });
  }, []);

  useEffect(() => {
    let cancelled = false;
    cargarTareas(true);

    // Refresca sola cada 30 segundos — sin esto, el frontend nunca se
    // entera de que una tarea pasó a "vencida" a menos que recargues
    // la página a mano.
    pollingRef.current = setInterval(() => {
      if (!cancelled) cargarTareas(false);
    }, 30000);

    return () => {
      cancelled = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [cargarTareas]);

  const crearTarea = useCallback(async (payload) => {
    const data = await api.post('/tareas', payload);
    setTareas((prev) => [data.tarea, ...prev]);
    return data.tarea;
  }, []);

  const editarTarea = useCallback(async (id, payload) => {
    const data = await api.put(`/tareas/${id}`, payload);
    setTareas((prev) => prev.map((t) => (t.id === id ? data.tarea : t)));
    return data.tarea;
  }, []);

  const eliminarTarea = useCallback(async (tarea) => {
    setTareas((prev) => prev.filter((t) => t.id !== tarea.id));
    try {
      await api.delete(`/tareas/${tarea.id}`);
    } catch (err) {
      setTareas((prev) => [tarea, ...prev]);
      throw err;
    }
  }, []);

  const subirEvidencia = useCallback(async (id, file) => {
    const formData = new FormData();
    formData.append('evidencia', file);
    const data = await api.post(`/tareas/${id}/evidencia`, formData);
    if (data.tarea) {
      setTareas((prev) => prev.map((t) => (t.id === id ? data.tarea : t)));
    }
    return data;
  }, []);

  return {
    tareas,
    loading,
    error,
    crearTarea,
    editarTarea,
    eliminarTarea,
    subirEvidencia,
    refrescar: () => cargarTareas(false),
  };
}