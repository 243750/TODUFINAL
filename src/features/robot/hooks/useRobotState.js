'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

function mapEmotionToRive(backendEmotion) {
  if (!backendEmotion) return 'idle';
  const emotion = backendEmotion.toLowerCase();
  if (['happy', 'sad', 'scared', 'surprised'].includes(emotion)) return emotion;
  return 'idle';
}

const FRASES_MI_TODU = [
  "¿Sabías que beber agua mejora tu enfoque un 30%? 🚰",
  "Dormir 8 horas es tu mejor hack de productividad. 🛏️",
  "La técnica Pomodoro te salva del cansancio mental. 🍅",
  "¡Mírame nada más! 😄",
  "Cada tarea que completas me hace crecer.",
  "¿Vamos por más XP hoy?",
  "Tu racha me tiene orgulloso.",
  "¡Sube de nivel y desbloqueamos más cosas!",
];

const FRASES_MOTIVACIONALES = [
  "Cada paso cuenta, sigue adelante",
  "No dejes para mañana lo que puedes hacer hoy",
  "El esfuerzo de hoy es el éxito de mañana",
  "Concéntrate y verás los resultados",
  "Un poco de progreso cada día suma grandes resultados",
  "Eres más capaz de lo que imaginas",
  "Mantén el enfoque, ya casi lo logras",
  "La disciplina es el puente entre metas y logros",
  "Haz de hoy un día productivo",
  "Vamos, cumplamos eso, tú puedes",
  "Una tarea a la vez, no te satures",
];

// Recibe el contexto y OPCIONALMENTE la lista de tareas para leerlas
export default function useRobotState(contexto = null, tareas = []) {
  const { user } = useAuth();
  const [emocionActual, setEmocionActual] = useState('idle');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const mensajeTimeoutRef = useRef(null);

  const hablar = useCallback((texto, duracion = 4000) => {
    setMensaje(texto);
    if (mensajeTimeoutRef.current) clearTimeout(mensajeTimeoutRef.current);
    if (texto) {
      mensajeTimeoutRef.current = setTimeout(() => setMensaje(''), duracion);
    }
  }, []);

  const forzarEmocion = useCallback((emocionRive, texto = '') => {
    setEmocionActual(emocionRive);
    if (texto) hablar(texto);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setEmocionActual('idle'), 4000);
  }, [hablar]);

  const refrescar = useCallback(() => {
    if (!user?.id) return;
    api.get(`/robot/estado/${user.id}`)
      .then((data) => setEmocionActual(mapEmotionToRive(data.emocion)))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!contexto) return;

    // Saludo Inicial
    const saludoTimer = setTimeout(() => {
      let fraseInicial = "¡Hola!";
      if (contexto === 'mi-todu') fraseInicial = FRASES_MI_TODU[Math.floor(Math.random() * FRASES_MI_TODU.length)];
      if (contexto === 'tareas') fraseInicial = FRASES_MOTIVACIONALES[Math.floor(Math.random() * FRASES_MOTIVACIONALES.length)];
      hablar(fraseInicial, 4000);
    }, 1000);

    let timerAmbiente;
    const loopAutonomo = () => {
      const espera = 15000 + Math.random() * 15000; // Entre 15 y 30 segundos
      
      timerAmbiente = setTimeout(() => {
        let frase = '';
        
        // Si estamos en tareas y HAY tareas pendientes, 40% de probabilidad de mencionar una tarea real
        if (contexto === 'tareas' && tareas.length > 0 && Math.random() < 0.4) {
          const tareaAzar = tareas[Math.floor(Math.random() * tareas.length)];
          // Nos aseguramos de no usar nombres larguísimos
          const tituloCorto = tareaAzar.titulo.length > 20 ? tareaAzar.titulo.substring(0, 20) + "..." : tareaAzar.titulo;
          
          const frasesDinamicas = [
            `Recuerda que tenemos pendiente "${tituloCorto}" para hoy.`,
            `¡Vamos! Cumplamos "${tituloCorto}", tú puedes.`,
            `No te olvides de "${tituloCorto}".`
          ];
          frase = frasesDinamicas[Math.floor(Math.random() * frasesDinamicas.length)];
        } else {
          // Si no, frase normal
          const diccionario = contexto === 'mi-todu' ? FRASES_MI_TODU : FRASES_MOTIVACIONALES;
          frase = diccionario[Math.floor(Math.random() * diccionario.length)];
        }

        // Obligamos a que use TODAS las emociones
        const emociones = ['happy', 'surprised', 'idle', 'scared', 'sad']; 
        const emocionAleatoria = emociones[Math.floor(Math.random() * emociones.length)];

        const probabilidadHablar = Math.random();
        if (probabilidadHablar < 0.5) {
          forzarEmocion(emocionAleatoria, frase); // Habla y hace gesto
        } else if (probabilidadHablar < 0.8) {
          forzarEmocion(emocionAleatoria); // Solo hace el gesto
        }
        
        loopAutonomo();
      }, espera);
    };

    loopAutonomo();

    return () => {
      clearTimeout(saludoTimer);
      clearTimeout(timerAmbiente);
    };
  }, [contexto, hablar, forzarEmocion, tareas]);

  const dispararEvento = useCallback(async (evento, textoOpcional = '', emocionInmediata = null) => {
    if (!user?.id) return;
    setLoading(true);
    
    if (emocionInmediata) setEmocionActual(emocionInmediata);
    if (textoOpcional) hablar(textoOpcional);

    try {
      const data = await api.post('/robot/evento', { userId: user.id, event: evento });
      const mappedEmotion = mapEmotionToRive(data.emotion);
      setEmocionActual(mappedEmotion);

      if (mappedEmotion !== 'idle') {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setEmocionActual('idle'), 4000);
      }
    } catch {
      if (emocionInmediata) {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
         timeoutRef.current = setTimeout(() => setEmocionActual('idle'), 4000);
      }
    } finally {
      setLoading(false);
    }
  }, [user, hablar]);

  const tareaCompletada = useCallback((texto) => dispararEvento('TASK_COMPLETED', texto || '¡Excelente trabajo! ✨', 'happy'), [dispararEvento]);
  const tareaRechazada  = useCallback((texto) => dispararEvento('TASK_EXPIRED', texto || '¡Oh no! Perdimos esa. 😢', 'sad'), [dispararEvento]);
  const subioDeNivel    = useCallback(() => dispararEvento('LEVEL_UP', '¡Guau! ¡Subimos de nivel! 🚀', 'surprised'), [dispararEvento]);
  const sinActividad    = useCallback(() => dispararEvento('NO_ACTIVITY', 'Te echo de menos...', 'sad'), [dispararEvento]);
  const diaDeRacha      = useCallback(() => dispararEvento('STREAK_DAY', '¡La racha sigue viva! 🔥', 'happy'), [dispararEvento]);

  return {
    emocionActual, mensaje, loading, hablar, forzarEmocion, refrescar,
    tareaCompletada, tareaRechazada, subioDeNivel, sinActividad, diaDeRacha,
  };
}