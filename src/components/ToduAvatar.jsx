'use client';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

export default function ToduAvatar({ emotion = 'idle', mensaje = '', size = 110, zoom = 1.3 }) {
  const { rive, RiveComponent } = useRive({
    src: '/toduoptimo.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Efecto Maestro: Controla los inputs descubiertos por la ingeniería inversa
  useEffect(() => {
    if (!rive) return;
    window.__todoRive = rive; // TEMPORAL: para poder probar desde la consola
    try {
      // Obtenemos los inputs directamente de la máquina de estados
      const inputs = rive.stateMachineInputs('State Machine 1');
      
      // 1. Activar que nos siga con la mirada
      const isTracking = inputs.find(i => i.name === 'IsTracking');
      if (isTracking) isTracking.value = true;

      // 2. Controlar la perilla de emociones (Expressions)
      const expressions = inputs.find(i => i.name === 'Expressions');
      if (expressions) {
        // Mapeamos los nombres de texto a los números que Rive espera
        const EMOCION_A_NUMERO = {
          'idle': 1, 'normal smile_face': 1,
          'happy': 2, 'super happy_face': 2,
          'sad': 3, 'sad_face': 3,
          'scared': 4, 'scared_face': 4,
          'surprised': 5, 'surprised_face': 5
        };
        // Asignamos el valor numérico, por defecto 0 (idle)
        expressions.value = EMOCION_A_NUMERO[emotion] ?? 1;
      }
    } catch (e) {
      console.error('[DIAGNÓSTICO ToduAvatar]', e);
    }
  }, [rive, emotion]);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      
      {/* GLOBO DE DIÁLOGO */}
      {mensaje && (
        // Ajustamos -top-10 a -top-2 y en tablets a -top-6 para no tapar los títulos
        <div className="absolute -top-2 md:-top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 pointer-events-none">
          <div className="bg-white text-violet-900 text-[11px] font-black px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-[0_10px_25px_rgba(139,92,246,0.3)] whitespace-nowrap border-2 border-violet-100 relative">
            {mensaje}
            {/* Colita del globo */}
            <div className="absolute -bottom-[8px] left-2 w-0 h-0 border-t-[8px] border-t-white border-r-[8px] border-r-transparent border-l-[8px] border-l-transparent drop-shadow-sm"></div>
          </div>
        </div>
      )}

      {/* AVATAR RIVE */}
      <div
        style={{ width: size, height: size }}
        className="relative flex justify-center items-center overflow-hidden"
      >
        <div className="absolute inset-0 flex justify-center items-center">
          <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} className="flex justify-center items-center">
            <RiveComponent className="w-full h-full" />
          </div>
        </div>
      </div>
      
    </div>
  );
}