'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// === DICCIONARIOS DE FRASES (SIN EMOJIS) ===
const FRASES_MI_TODU = [
  "Sabias que beber agua mejora tu enfoque un 30 por ciento",
  "Dormir 8 horas es tu mejor hack de productividad",
  "La tecnica Pomodoro te salva del cansancio mental",
  "Cada tarea completada me hace crecer un poco mas",
  "Sube de nivel y desbloquearemos mas cosas juntos",
  "Un dia a la vez lo estas haciendo genial",
  "Mantener tu espacio limpio despeja tu mente",
  "Descansar la vista de la pantalla es vital"
];

const FRASES_MOTIVACIONALES = [
  "Cada paso cuenta sigue adelante",
  "El esfuerzo de hoy es el exito de manana",
  "Concentrate un momento y veras los resultados",
  "Un poco de progreso suma grandes logros",
  "Manten el enfoque ya casi lo logramos",
  "La disciplina te llevara mas lejos que la motivacion",
  "Haz de hoy un dia increiblemente productivo",
  "Una tarea a la vez no te satures"
];

const FRASES_EXITO = [
  "Bien lo logramos",
  "Eres increible buen trabajo",
  "Asi se hace una menos",
  "Excelente vamos por la que sigue",
  "Sabia que podias hacerlo",
  "Que buen ritmo llevas hoy",
  "Mision cumplida impecable",
  "Me enorgullece verte avanzar",
  "Eso es todo pura productividad",
  "Genial sumando experiencia a la cartera"
];

const FRASES_FRACASO = [
  "No pasa nada la siguiente si",
  "Tranquilo manana lo intentamos de nuevo",
  "No me abandones cumplamos la proxima si",
  "A veces pasa pero no te rindas",
  "Un tropiezo no define tu dia",
  "Descansa un poco y volvemos con todo",
  "Ups se nos paso el tiempo",
  "Quedara para despues animo",
  "No te desanimes tu puedes con la siguiente",
  "Lo importante es seguir intentando"
];

const FRASES_ALERTA = [
  "No olvides esto es pronto",
  "Atencion el tiempo se acaba para esta tarea",
  "Recuerda que tenemos esto pendiente en minutos",
  "Preparate ya casi es hora",
  "Echale un ojo al reloj tenemos trabajo"
];

// Helper para convertir "09:30 PM" a objeto Date de hoy
const parseTimeToToday = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let [_, h, m, ampm] = match;
  h = parseInt(h, 10);
  m = parseInt(m, 10);
  if (ampm && ampm.toUpperCase() === 'PM' && h < 12) h += 12;
  if (ampm && ampm.toUpperCase() === 'AM' && h === 12) h = 0;
  
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now;
};

export default function useRobotState(contexto = null, tareas = []) {
  const [emocionActual, setEmocionActual] = useState('idle');
  const [mensaje, setMensaje] = useState('');
  
  // Referencia sincrónica para que los cronómetros sepan siempre cómo se siente Todú
  const emocionRef = useRef('idle');

  const emocionTimer = useRef(null);
  const mensajeTimer = useRef(null);
  const ambienteTimer = useRef(null);
  const checkTareasTimer = useRef(null);

  // CICLO AUTÓNOMO (Bucle para que hable solo a intervalos más naturales)
  const iniciarLoopAmbiental = useCallback(() => {
    if (!contexto) return;
    if (ambienteTimer.current) clearTimeout(ambienteTimer.current);

    // Reducimos el tiempo: entre 12 y 20 segundos
    const espera = 12000 + Math.random() * 8000;
    
    ambienteTimer.current = setTimeout(() => {
      // Solo habla si su cara está normal
      if (emocionRef.current === 'idle') {
        const diccionario = contexto === 'mi-todu' ? FRASES_MI_TODU : FRASES_MOTIVACIONALES;
        const frase = diccionario[Math.floor(Math.random() * diccionario.length)];
        
        setMensaje(frase);
        if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
        mensajeTimer.current = setTimeout(() => setMensaje(''), 5000);
      }
      iniciarLoopAmbiental(); // Vuelve a llamarse a sí mismo
    }, espera);
  }, [contexto]);

  // FUNCIÓN MAESTRA DE CONTROL
  const forzarEmocion = useCallback((nuevaEmocion, nuevoMensaje = '', duracionEmocion = 10000, duracionMensaje = 5000) => {
    // 1. Limpiamos cualquier acción anterior para que no se traslapen
    if (emocionTimer.current) clearTimeout(emocionTimer.current);
    if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
    if (ambienteTimer.current) clearTimeout(ambienteTimer.current);

    // 2. Aplicamos la nueva emoción
    setEmocionActual(nuevaEmocion);
    emocionRef.current = nuevaEmocion;
    
    // 3. Aplicamos el nuevo texto (o lo borramos si vienen cosquillas vacías)
    if (nuevoMensaje) {
      setMensaje(nuevoMensaje);
      mensajeTimer.current = setTimeout(() => setMensaje(''), duracionMensaje);
    } else {
      setMensaje('');
    }

    // 4. Temporizador para regresar a la normalidad
    emocionTimer.current = setTimeout(() => {
      setEmocionActual('idle');
      emocionRef.current = 'idle';
      iniciarLoopAmbiental(); // Retoma su plática casual
    }, duracionEmocion);
  }, [iniciarLoopAmbiental]);

  // COSQUILLAS (Clic en el avatar)
  const hacerCosquillas = useCallback(() => {
    // Fuerzan la emoción happy durante 2 segundos, sin mostrar ningún texto
    forzarEmocion('happy', '', 2000, 0);
  }, [forzarEmocion]);

  // EVENTOS DE TAREAS
  const tareaCompletada = useCallback(() => {
    const frase = FRASES_EXITO[Math.floor(Math.random() * FRASES_EXITO.length)];
    forzarEmocion('happy', frase, 10000, 5000);
  }, [forzarEmocion]);

  const tareaFallida = useCallback(() => {
    const frase = FRASES_FRACASO[Math.floor(Math.random() * FRASES_FRACASO.length)];
    forzarEmocion('sad', frase, 10000, 5000);
  }, [forzarEmocion]);

  // ARRANQUE DEL CICLO AMBIENTAL (Primera carga)
  useEffect(() => {
    if (!contexto) return;
    
    // Hacer que lance el primer mensaje muy rápido (2.5 segundos) al entrar
    ambienteTimer.current = setTimeout(() => {
      if (emocionRef.current === 'idle') {
        const diccionario = contexto === 'mi-todu' ? FRASES_MI_TODU : FRASES_MOTIVACIONALES;
        const frase = diccionario[Math.floor(Math.random() * diccionario.length)];
        setMensaje(frase);
        mensajeTimer.current = setTimeout(() => setMensaje(''), 5000);
      }
      iniciarLoopAmbiental(); // Después del primero, arranca el ciclo normal
    }, 2500);

    return () => {
      if (ambienteTimer.current) clearTimeout(ambienteTimer.current);
    };
  }, [contexto, iniciarLoopAmbiental]);

  // VIGILANTE DE TAREAS (Cada minuto revisa si falta poco)
  useEffect(() => {
    if (contexto !== 'tareas' || !tareas || tareas.length === 0) return;

    const revisarTareas = () => {
      const ahora = new Date();
      for (const tarea of tareas) {
        if (tarea.estado === 'completed') continue;

        const horaTarea = parseTimeToToday(tarea.descripcion);
        if (!horaTarea) continue;

        const diferenciaMs = horaTarea - ahora;
        const minutosFaltantes = Math.floor(diferenciaMs / 60000);

        // Si faltan exactamente entre 0 y 10 minutos
        if (minutosFaltantes >= 0 && minutosFaltantes <= 10) {
          const fraseBase = FRASES_ALERTA[Math.floor(Math.random() * FRASES_ALERTA.length)];
          const fraseFinal = `${fraseBase} ${tarea.titulo}`;
          forzarEmocion('surprised', fraseFinal, 10000, 5000);
          break; // Solo alerta por la primera que encuentre
        }
      }
    };

    revisarTareas();
    checkTareasTimer.current = setInterval(revisarTareas, 60000);

    return () => {
      if (checkTareasTimer.current) clearInterval(checkTareasTimer.current);
    };
  }, [contexto, tareas, forzarEmocion]);

  // LIMPIEZA GENERAL AL DESMONTAR
  useEffect(() => {
    return () => {
      if (emocionTimer.current) clearTimeout(emocionTimer.current);
      if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
    };
  }, []);

  return { 
    emocionActual, 
    mensaje, 
    tareaCompletada, 
    tareaFallida, 
    forzarEmocion,
    hacerCosquillas 
  };
}