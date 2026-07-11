'use client';
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../../lib/api';

export default function useTareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get('/tareas/mis-tareas')
      .then((data) => { if (!cancelled) setTareas(data.tareas || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

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
  };
}