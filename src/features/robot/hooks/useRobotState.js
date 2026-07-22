'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// Tabla CONFIRMADA visualmente en el editor de Rive (18 jul 2026) — el
// mapa número<->emoción vive únicamente en ToduAvatar.jsx. Aquí solo se
// usan los nombres en texto: 'idle' | 'happy' | 'sad' | 'scared' | 'surprised'.
// No volver a "descubrir" esto por ingeniería inversa si el .riv se
// vuelve a editar — confirmar de nuevo con el editor antes de tocar código.

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

// Cada cuánto se REPITE el mensaje de "ya viene" mientras la tarea
// siga sin completarse ni vencerse (la cara se queda asustada todo
// este tiempo, solo el TEXTO reaparece con esta frecuencia).
const INTERVALO_REPETIR_AVISO_MS = 3 * 60 * 1000; // 3 minutos

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

// Igual que parseTimeToToday, pero para `horaRecordatorio` de las tareas
// fijas — que el backend manda en 24h ("HH:MM" o "HH:MM:SS", sin AM/PM),
// nunca en el formato de 12h que usa `descripcion` en tareas normales.
const parseHoraRecordatorioToToday = (horaStr) => {
  if (!horaStr) return null;
  const match = horaStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);

  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now;
};

export default function useRobotState(contexto = null, tareas = []) {
  const [emocionActual, setEmocionActual] = useState('idle');
  const [mensaje, setMensaje] = useState('');

  const emocionRef = useRef('idle');

  const emocionTimer = useRef(null);
  const mensajeTimer = useRef(null);
  const ambienteTimer = useRef(null);
  const checkTareasTimer = useRef(null);

  // Guarda, por cada tarea con aviso activo, cuándo fue la última vez
  // que le mostramos el mensaje — así sabemos cuándo repetirlo (cada
  // INTERVALO_REPETIR_AVISO_MS) sin repetirlo en cada revisión de 60s.
  const ultimoAvisoRef = useRef(new Map());
  // Tareas que ya reaccionaron como "vencida" (esta solo pasa UNA vez,
  // no se repite como el aviso de "ya viene").
  const fallidaDadaRef = useRef(new Set());

  const iniciarLoopAmbiental = useCallback(() => {
    if (!contexto) return;
    if (ambienteTimer.current) clearTimeout(ambienteTimer.current);

    const espera = 12000 + Math.random() * 8000;

    ambienteTimer.current = setTimeout(() => {
      if (emocionRef.current === 'idle') {
        const diccionario = contexto === 'mi-todu' ? FRASES_MI_TODU : FRASES_MOTIVACIONALES;
        const frase = diccionario[Math.floor(Math.random() * diccionario.length)];

        setMensaje(frase);
        if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
        mensajeTimer.current = setTimeout(() => setMensaje(''), 5000);
      }
      iniciarLoopAmbiental();
    }, espera);
  }, [contexto]);

  /**
   * FUNCIÓN MAESTRA DE CONTROL.
   * duracionEmocion acepta un número (ms) para que la cara vuelva sola a
   * 'idle' después de ese tiempo, o `null` para que la cara se quede
   * "pegada" hasta que otra llamada a forzarEmocion la reemplace — esto
   * es lo que usa el aviso de tarea próxima, que debe seguir asustado
   * hasta que la tarea se complete o se pierda.
   */
  const forzarEmocion = useCallback((nuevaEmocion, nuevoMensaje = '', duracionEmocion = 10000, duracionMensaje = 5000) => {
    if (emocionTimer.current) clearTimeout(emocionTimer.current);
    if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
    if (ambienteTimer.current) clearTimeout(ambienteTimer.current);

    setEmocionActual(nuevaEmocion);
    emocionRef.current = nuevaEmocion;

    if (nuevoMensaje) {
      setMensaje(nuevoMensaje);
      if (duracionMensaje !== null) {
        mensajeTimer.current = setTimeout(() => setMensaje(''), duracionMensaje);
      }
    } else {
      setMensaje('');
    }

    if (duracionEmocion !== null) {
      emocionTimer.current = setTimeout(() => {
        setEmocionActual('idle');
        emocionRef.current = 'idle';
        iniciarLoopAmbiental();
      }, duracionEmocion);
    }
    // Si duracionEmocion es null, no se agenda ningún regreso automático:
    // la cara se queda así hasta la siguiente llamada a forzarEmocion.
  }, [iniciarLoopAmbiental]);

  const hacerCosquillas = useCallback(() => {
    forzarEmocion('happy', '', 2000, 0);
  }, [forzarEmocion]);

  const tareaCompletada = useCallback((tareaId = null) => {
    const frase = FRASES_EXITO[Math.floor(Math.random() * FRASES_EXITO.length)];
    forzarEmocion('happy', frase, 10000, 3000);
    // Limpia el registro de avisos/fallos de esta tarea, por si acaso
    // se vuelve a usar el mismo id en algún escenario raro.
    if (tareaId) {
      ultimoAvisoRef.current.delete(tareaId);
      fallidaDadaRef.current.delete(tareaId);
    }
  }, [forzarEmocion]);

  const tareaFallida = useCallback(() => {
    const frase = FRASES_FRACASO[Math.floor(Math.random() * FRASES_FRACASO.length)];
    forzarEmocion('sad', frase, 180000, 5000);
  }, [forzarEmocion]);

  useEffect(() => {
    if (!contexto) return;

    ambienteTimer.current = setTimeout(() => {
      if (emocionRef.current === 'idle') {
        const diccionario = contexto === 'mi-todu' ? FRASES_MI_TODU : FRASES_MOTIVACIONALES;
        const frase = diccionario[Math.floor(Math.random() * diccionario.length)];
        setMensaje(frase);
        mensajeTimer.current = setTimeout(() => setMensaje(''), 5000);
      }
      iniciarLoopAmbiental();
    }, 2500);

    return () => {
      if (ambienteTimer.current) clearTimeout(ambienteTimer.current);
    };
  }, [contexto, iniciarLoopAmbiental]);

  // VIGILANTE DE TAREAS (cada minuto revisa "por vencer" y "vencidas")
  useEffect(() => {
    if (contexto !== 'tareas' || !tareas || tareas.length === 0) return;

    const revisarTareas = () => {
      const ahora = new Date();
      const ahoraMs = ahora.getTime();

      for (const tarea of tareas) {
        // --- ¿Ya se venció? Reacción triste, una sola vez por tarea. ---
        if (tarea.estado === 'vencida' || tarea.estado === 'expired') {
          if (!fallidaDadaRef.current.has(tarea.id)) {
            fallidaDadaRef.current.add(tarea.id);
            ultimoAvisoRef.current.delete(tarea.id);
            tareaFallida();
          }
          continue;
        }

        if (tarea.estado === 'completed') {
          ultimoAvisoRef.current.delete(tarea.id);
          continue;
        }

        const esFija = tarea.tipo === 'fija';

        // Una fija solo avisa los días que le tocan — si hoy no aplica
        // (el backend ya nos lo dice con `aplicaHoy`), no hay nada que
        // revisar para ella hoy.
        if (esFija && tarea.aplicaHoy === false) continue;

        // El recordatorio de una fija es en 24h ("HH:MM[:SS]"), sin
        // AM/PM — necesita su propio parser. Las normales siguen usando
        // `descripcion` como siempre.
        const horaTarea = esFija
          ? parseHoraRecordatorioToToday(tarea.horaRecordatorio)
          : parseTimeToToday(tarea.descripcion);
        if (!horaTarea) continue;

        const diferenciaMs = horaTarea - ahora;
        const minutosFaltantes = Math.floor(diferenciaMs / 60000);

        // --- ¿Ya se pasó la hora y nunca se completó? Triste, casi al
        // instante (máximo 60s de retraso, sin depender de que el
        // backend termine de marcarla como "vencida" — el frontend ya
        // sabe la hora, no necesita esperar confirmación del servidor).
        // Esto NUNCA aplica a una fija: su `horaRecordatorio` es solo un
        // aviso (push), Manuel confirmó que no cuenta como incumplida. ---
        if (!esFija && diferenciaMs < 0 && !fallidaDadaRef.current.has(tarea.id)) {
          fallidaDadaRef.current.add(tarea.id);
          ultimoAvisoRef.current.delete(tarea.id);
          tareaFallida();
          continue;
        }
        if (esFija && diferenciaMs < 0) continue;

        // --- ¿Faltan 10 minutos o menos? ---
        if (minutosFaltantes >= 0 && minutosFaltantes <= 10) {
          const ultimoAviso = ultimoAvisoRef.current.get(tarea.id);
          const debeAvisar = !ultimoAviso || (ahoraMs - ultimoAviso) >= INTERVALO_REPETIR_AVISO_MS;

          if (debeAvisar) {
            ultimoAvisoRef.current.set(tarea.id, ahoraMs);
            const fraseBase = FRASES_ALERTA[Math.floor(Math.random() * FRASES_ALERTA.length)];
            const fraseFinal = `${fraseBase} ${tarea.titulo}`;
            // duracionEmocion = null: la cara se queda asustada hasta
            // completar la tarea o hasta que se pierda — el mensaje sí
            // se repetirá cada INTERVALO_REPETIR_AVISO_MS mientras tanto.
            forzarEmocion('scared', fraseFinal, null, 6000);
            break; // Solo un aviso a la vez
          } else if (emocionRef.current !== 'scared') {
            // Si por algún motivo la cara regresó a otro estado (por
            // ejemplo cosquillas) mientras el aviso seguía activo,
            // la regresamos a asustada sin repetir el mensaje todavía.
            setEmocionActual('scared');
            emocionRef.current = 'scared';
          }
        }
      }
    };

    revisarTareas();
    checkTareasTimer.current = setInterval(revisarTareas, 60000);

    return () => {
      if (checkTareasTimer.current) clearInterval(checkTareasTimer.current);
    };
  }, [contexto, tareas, forzarEmocion, tareaFallida]);

  useEffect(() => {
    return () => {
      if (emocionTimer.current) clearTimeout(emocionTimer.current);
      if (mensajeTimer.current) clearTimeout(mensajeTimer.current);
      if (ambienteTimer.current) clearTimeout(ambienteTimer.current);
      if (checkTareasTimer.current) clearInterval(checkTareasTimer.current);
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