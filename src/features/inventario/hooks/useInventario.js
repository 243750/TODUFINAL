'use client';
import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '../../../lib/api';

export default function useInventario() {
  const [inventario, setInventario] = useState([]); // [{ itemId, isEquipped }]
  const [busyItem, setBusyItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.get('/inventario')
      .then((data) => { if (!cancelled) setInventario(data.inventario || []); })
      .catch(() => {}); // si el servicio de inventario no responde, solo no mostramos nada
    return () => { cancelled = true; };
  }, []);

  // Decide qué acción tomar según el estado actual del item:
  // no lo tiene -> lo agrega (si el nivel alcanza); lo tiene equipado -> lo desequipa;
  // lo tiene sin equipar -> lo equipa.
  const toggleItem = useCallback(async (item, nivelUsuario) => {
    const enInventario = inventario.find((i) => i.itemId === item.itemId);
    setError('');

    if (!enInventario && (nivelUsuario ?? 0) < item.nivelRequerido) {
      setError(`Necesitas nivel ${item.nivelRequerido} para desbloquear "${item.label}".`);
      return;
    }

    setBusyItem(item.itemId);

    try {
      if (!enInventario) {
        const res = await api.post('/inventario/agregar', { itemId: item.itemId });
        setInventario((prev) => [...prev, res.item]);
      } else if (enInventario.isEquipped) {
        await api.post('/inventario/desequipar', { itemId: item.itemId });
        setInventario((prev) =>
          prev.map((i) => (i.itemId === item.itemId ? { ...i, isEquipped: false } : i))
        );
      } else {
        await api.post('/inventario/equipar', { itemId: item.itemId });
        setInventario((prev) =>
          prev.map((i) => ({ ...i, isEquipped: i.itemId === item.itemId }))
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo actualizar el inventario.');
    } finally {
      setBusyItem(null);
    }
  }, [inventario]);

  return {
    inventario,
    busyItem,
    error,
    toggleItem,
  };
}