'use client';
import { createContext, useContext, useEffect, useCallback, useReducer } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

// Solo se usa cuando NO hay sesión (preview de la UI sin backend).
// Si hay usuario logueado, nunca se muestra este valor: se espera al fetch real.
const PROGRESO_PREVIEW = {
  nivel: 5,
  xpActual: 150,
  xpSiguienteNivel: 300,
  progresoPorcentaje: 50,
  rachaActual: 0,
};

const initialState = { progreso: null, loading: true, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':   return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { progreso: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':   return { ...state, loading: false, error: action.payload };
    default:              return state;
  }
}

const GamificacionContext = createContext(/** @type {any} */ (null));

// Un solo estado de XP/Coins/Nivel COMPARTIDO por toda la app. Antes,
// useGamificacion() creaba su propio useReducer local en cada componente
// que lo llamaba (Sidebar, tareas/page.js, mi-todu/page.js, etc) — cada
// uno con SU PROPIA copia del progreso. Llamar refrescar() en un lugar
// (ej. al completar una tarea) solo actualizaba esa copia, no las demás,
// así que el Sidebar se quedaba con el XP/Coins viejos hasta recargar
// la página. Con Context, todos comparten el mismo estado: refrescar()
// en cualquier lado actualiza a todos a la vez, sin recargar nada.
export function GamificacionProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const cargar = useCallback(() => {
    if (!user?.id) {
      dispatch({ type: 'FETCH_SUCCESS', payload: PROGRESO_PREVIEW });
      return;
    }
    dispatch({ type: 'FETCH_START' });
    api.get(`/xp/progreso/${user.id}`, { auth: false })
      .then((data) => dispatch({ type: 'FETCH_SUCCESS', payload: data }))
      .catch((err) => dispatch({ type: 'FETCH_ERROR', payload: err.message }));
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <GamificacionContext.Provider value={{ ...state, refrescar: cargar }}>
      {children}
    </GamificacionContext.Provider>
  );
}

export function useGamificacionContext() {
  const ctx = useContext(GamificacionContext);
  if (!ctx) throw new Error('useGamificacionContext debe usarse dentro de <GamificacionProvider>');
  return ctx;
}