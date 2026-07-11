'use client';
import { useEffect, useReducer } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

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

export default function useGamificacion() {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!user?.id) {
      dispatch({ type: 'FETCH_SUCCESS', payload: PROGRESO_PREVIEW });
      return;
    }

    let cancelled = false;
    dispatch({ type: 'FETCH_START' });

    api.get(`/xp/progreso/${user.id}`, { auth: false })
      .then((data) => { if (!cancelled) dispatch({ type: 'FETCH_SUCCESS', payload: data }); })
      .catch((err) => { if (!cancelled) dispatch({ type: 'FETCH_ERROR', payload: err.message }); });

    return () => { cancelled = true; };
  }, [user]);

  return state;
}