'use client';
import { useState, useEffect, useCallback } from 'react';
import { CATALOGO_DECORACIONES } from '../../../components/decoraciones/catalogo';
import { api, ApiError } from '../../../lib/api';

export default function useDecoraciones() {
  const [compradas, setCompradas] = useState([]);
  const [colocadas, setColocadas] = useState({});
  const [comprando, setComprando] = useState(null);
  const [error, setError] = useState(null);
  const [cargandoInventario, setCargandoInventario] = useState(true);

  // Carga el inventario real al montar — antes esto se quedaba siempre
  // en `[]` local, así que recargar la página "perdía" las compras.
  useEffect(() => {
    let cancelled = false;
    api.get('/tienda/inventario')
      .then((data) => { if (!cancelled) setCompradas(data.items || []); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setCargandoInventario(false); });
    return () => { cancelled = true; };
  }, []);

  const yaComprado = useCallback((itemId) => compradas.includes(itemId), [compradas]);

  // Llama al backend real de Manuel (POST /tienda/comprar, ya probado
  // con curl del lado del servidor). Devuelve la respuesta completa
  // ({ mensaje, itemId, precio, xpDisponible }) para que quien llame
  // pueda refrescar useGamificacion() con el saldo real, o `null` si
  // falló (el mensaje de error ya queda en `error`).
  const comprar = useCallback(async (itemId, precio) => {
    setError(null);
    setComprando(itemId);
    try {
      const data = await api.post('/tienda/comprar', { itemId });
      setCompradas((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
      return data;
    } catch (err) {
      const mensaje = err instanceof ApiError
        ? err.message
        : 'No se pudo completar la compra.';
      setError(mensaje);
      return null;
    } finally {
      setComprando(null);
    }
  }, []);

  const colocarEnSlot = useCallback((slotIndex, itemId) => {
    setColocadas((prev) => ({ ...prev, [slotIndex]: itemId }));
  }, []);

  const quitarDeSlot = useCallback((slotIndex) => {
    setColocadas((prev) => {
      const nuevo = { ...prev };
      delete nuevo[slotIndex];
      return nuevo;
    });
  }, []);

  const noColocadas = CATALOGO_DECORACIONES.filter(
    (item) => yaComprado(item.id) && !Object.values(colocadas).includes(item.id)
  );

  return {
    compradas,
    colocadas,
    comprando,
    error,
    cargandoInventario,
    yaComprado,
    comprar,
    colocarEnSlot,
    quitarDeSlot,
    noColocadas,
  };
}