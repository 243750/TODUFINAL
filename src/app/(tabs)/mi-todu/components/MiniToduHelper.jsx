'use client';

export default function MiniToduHelper() {
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

      {/* Globo de diálogo (Speech Bubble) estilo cristal oscuro */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl rounded-bl-none p-4 shadow-lg relative">
        {/* Triangulito del globo */}
        <div className="absolute -left-3 bottom-0 w-0 h-0 border-t-[16px] border-t-transparent border-r-[16px] border-r-white/10 border-b-[0px] border-b-transparent"></div>

        <h4 className="text-[#FFD700] font-bold text-sm mb-1">Tip de Todú</h4>
        <p className="text-sm text-slate-200 leading-relaxed">
          ¡Hola! Aquí puedes ver tu progreso. Completa las tareas de tu panel principal para ganar XP y desbloquear nuevos accesorios para mí. 🚀
        </p>
      </div>
    </div>
  );
}
