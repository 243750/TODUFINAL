'use client';
import { useGamificacionContext } from '../../../context/GamificacionContext';

// El estado real ahora vive en <GamificacionProvider> (ver
// src/context/GamificacionContext.jsx) — este archivo se deja como un
// simple puente para NO tener que tocar los imports que ya existen en
// Sidebar.jsx, tareas/page.js, mi-todu/page.js, descubrir/page.js,
// useDadosGame.js y useDecoraciones.js. Todos siguen llamando
// useGamificacion() exactamente igual que antes.
export default function useGamificacion() {
  return useGamificacionContext();
}