'use client';
import { useState, useEffect } from 'react';

// === TIPS SIN EMOJIS ===
const TIPS_MINI_TODU = [
  "Aqui puedes ver tu progreso. Completa tareas para ganar experiencia.",
  "Sube de nivel para desbloquear nuevos accesorios para mi.",
  "Explora el campus en Descubrir para encontrar lugares de estudio.",
  "Manten una racha activa para multiplicar tus recompensas diarias.",
  "En el Arcade puedes apostar para multiplicar tu experiencia.",
  "Recuerda que las tareas dificiles otorgan mas experiencia al completarlas."
];

export default function MiniToduHelper() {
  const [tipIndex, setTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Inicia desvanecimiento
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS_MINI_TODU.length);
        setIsVisible(true); // Aparece nuevo texto
      }, 500);
    }, 15000); // Rota cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mt-8 flex items-end gap-4 p-4">
      {/* El Todúcito SVG */}
      <div className="w-16 h-16 flex-shrink-0 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g transform="rotate(5 60 60)">
            <rect x="35" y="40" width="50" height="55" rx="25" fill="currentColor" />
            <path d="M60 30V40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="60" cy="27" r="3" fill="#FFD700"/>
            <path d="M45 55Q50 50 55 55" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M65 55Q70 50 75 55" stroke="#FFD700" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M85 65Q95 55 90 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>

      {/* Globo de diálogo Animado */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl rounded-bl-none p-4 shadow-lg relative flex-1 min-h-[100px] flex flex-col justify-center">
        {/* Triangulito del globo */}
        <div className="absolute -left-3 bottom-0 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white/10 border-b-[0px] border-b-transparent"></div>
        
        <h4 className="text-[#FFD700] font-bold text-sm mb-1">Tip de Todú</h4>
        <p className={`text-sm text-slate-200 leading-relaxed transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {TIPS_MINI_TODU[tipIndex]}
        </p>
      </div>
    </div>
  );
}