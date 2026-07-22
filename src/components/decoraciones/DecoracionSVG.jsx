'use client';

const ESTILOS = `
  @keyframes destello-trofeo {
    0%, 70%, 100% { transform: translateX(-60px) skewX(-20deg); opacity: 0; }
    75% { opacity: 0.9; }
    85% { transform: translateX(60px) skewX(-20deg); opacity: 0; }
  }
  @keyframes flotar-suave {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  @keyframes respirar {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.04); }
  }
  @keyframes parpadeo {
    0%, 92%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  @keyframes rebote-pajaro {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-6px) rotate(-3deg); }
  }
  @keyframes oreja-mecer {
    0%, 100% { transform: rotate(-4deg); }
    50% { transform: rotate(4deg); }
  }
  @keyframes brillo-cuadro {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.5; }
  }
  @keyframes vuelo-dron {
    0%, 100% { transform: translate(0px, 0px) rotate(-2deg); }
    50% { transform: translate(10px, -6px) rotate(2deg); }
  }
  @keyframes helice-girar {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes luz-dron {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }
  @keyframes titilar-foco {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px rgba(253,224,71,0.8)); }
    50% { opacity: 0.75; filter: drop-shadow(0 0 2px rgba(253,224,71,0.4)); }
  }
  @keyframes pantalla-consola {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes twinkle-guirnalda {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  @keyframes twinkle-estrella {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes segundero-girar {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes nadar-derecha {
    0% { transform: translateX(-8px); }
    50% { transform: translateX(8px) scaleX(-1); }
    100% { transform: translateX(-8px); }
  }
  @keyframes nadar-izquierda {
    0% { transform: translateX(8px) scaleX(-1); }
    50% { transform: translateX(-8px); }
    100% { transform: translateX(8px) scaleX(-1); }
  }
  @keyframes burbuja-subir {
    0% { transform: translateY(0); opacity: 0.7; }
    100% { transform: translateY(-24px); opacity: 0; }
  }
  @keyframes hoja-mecer {
    0%, 100% { transform: rotate(-6deg); }
    50% { transform: rotate(6deg); }
  }

  .todu-trofeo-brillo { animation: destello-trofeo 5s ease-in-out infinite; }
  .todu-flotar { animation: flotar-suave 3s ease-in-out infinite; }
  .todu-respirar { animation: respirar 2.4s ease-in-out infinite; transform-origin: bottom center; }
  .todu-parpadeo { animation: parpadeo 4s ease-in-out infinite; transform-origin: center; }
  .todu-rebote-pajaro { animation: rebote-pajaro 2.2s ease-in-out infinite; }
  .todu-oreja-izq { animation: oreja-mecer 3.4s ease-in-out infinite; transform-origin: bottom center; }
  .todu-oreja-der { animation: oreja-mecer 3.4s ease-in-out infinite reverse; transform-origin: bottom center; }
  .todu-brillo-cuadro { animation: brillo-cuadro 4s ease-in-out infinite; }
  .todu-vuelo-dron { animation: vuelo-dron 4s ease-in-out infinite; }
  .todu-helice { animation: helice-girar 0.4s linear infinite; transform-origin: center; }
  .todu-luz-dron { animation: luz-dron 1.2s ease-in-out infinite; }
  .todu-titilar-foco { animation: titilar-foco 2.6s ease-in-out infinite; }
  .todu-pantalla-consola { animation: pantalla-consola 1.8s ease-in-out infinite; }
  .todu-twinkle-guirnalda { animation: twinkle-guirnalda 1.4s ease-in-out infinite; }
  .todu-twinkle-estrella { animation: twinkle-estrella 2.5s ease-in-out infinite; transform-origin: center; }
  .todu-segundero { animation: segundero-girar 8s steps(60) infinite; transform-origin: center; }
  .todu-nadar-der { animation: nadar-derecha 4s ease-in-out infinite; }
  .todu-nadar-izq { animation: nadar-izquierda 4.6s ease-in-out infinite; }
  .todu-burbuja { animation: burbuja-subir 2.4s ease-in infinite; }
  .todu-hoja { animation: hoja-mecer 3.2s ease-in-out infinite; transform-origin: bottom center; }
`;

function TrofeoBase({ colorPrincipal, colorSombra, colorBrillo }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full todu-flotar" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={`clip-copa-${colorPrincipal}`}>
          <path d="M28 20 L52 20 L49 44 Q40 50 31 44 Z" />
        </clipPath>
      </defs>
      <rect x="28" y="64" width="24" height="6" rx="2" fill={colorSombra} />
      <rect x="34" y="56" width="12" height="10" fill={colorSombra} />
      <path d="M28 24 Q16 24 18 36 Q20 44 30 42" stroke={colorPrincipal} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M52 24 Q64 24 62 36 Q60 44 50 42" stroke={colorPrincipal} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M28 20 L52 20 L49 44 Q40 50 31 44 Z" fill={colorPrincipal} />
      <g clipPath={`url(#clip-copa-${colorPrincipal})`}>
        <rect x="0" y="18" width="14" height="34" fill={colorBrillo} opacity="0.6" className="todu-trofeo-brillo" />
      </g>
      <path d="M40 26 L42 31 L47 31 L43 34 L44.5 39 L40 36 L35.5 39 L37 34 L33 31 L38 31 Z" fill={colorBrillo} />
    </svg>
  );
}

function GatitoSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full todu-flotar" xmlns="http://www.w3.org/2000/svg">
      <g className="todu-respirar">
        <ellipse cx="40" cy="50" rx="18" ry="14" fill="#a78bfa" />
        <circle cx="40" cy="32" r="16" fill="#c4b5fd" />
        <path d="M27 22 L24 10 L34 18 Z" fill="#c4b5fd" />
        <path d="M53 22 L56 10 L46 18 Z" fill="#c4b5fd" />
        <g className="todu-parpadeo">
          <circle cx="34" cy="31" r="2.5" fill="#1f1638" />
          <circle cx="46" cy="31" r="2.5" fill="#1f1638" />
        </g>
        <path d="M38 37 L42 37 L40 39.5 Z" fill="#f472b6" />
        <line x1="20" y1="35" x2="30" y2="36" stroke="#1f1638" strokeWidth="1" />
        <line x1="20" y1="39" x2="30" y2="39" stroke="#1f1638" strokeWidth="1" />
        <line x1="60" y1="35" x2="50" y2="36" stroke="#1f1638" strokeWidth="1" />
        <line x1="60" y1="39" x2="50" y2="39" stroke="#1f1638" strokeWidth="1" />
        <path d="M56 54 Q68 50 64 38" stroke="#a78bfa" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function PajaritoSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full todu-rebote-pajaro" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="46" rx="16" ry="14" fill="#34d399" />
      <circle cx="40" cy="28" r="12" fill="#6ee7b7" />
      <path d="M46 40 Q60 38 56 54 Q46 54 44 46 Z" fill="#10b981" />
      <path d="M28 28 L18 30 L28 33 Z" fill="#fbbf24" />
      <circle cx="38" cy="26" r="2.2" fill="#1f1638" className="todu-parpadeo" />
      <line x1="35" y1="60" x2="33" y2="66" stroke="#fbbf24" strokeWidth="2" />
      <line x1="45" y1="60" x2="47" y2="66" stroke="#fbbf24" strokeWidth="2" />
    </svg>
  );
}

function ConejitoSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full todu-flotar" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="14" rx="5" ry="16" fill="#f1f5f9" className="todu-oreja-izq" />
      <ellipse cx="50" cy="14" rx="5" ry="16" fill="#f1f5f9" className="todu-oreja-der" />
      <g className="todu-respirar">
        <ellipse cx="40" cy="52" rx="18" ry="15" fill="#e2e8f0" />
        <circle cx="40" cy="34" r="15" fill="#f8fafc" />
        <g className="todu-parpadeo">
          <circle cx="34" cy="33" r="2.3" fill="#1f1638" />
          <circle cx="46" cy="33" r="2.3" fill="#1f1638" />
        </g>
        <path d="M38 39 L42 39 L40 41.5 Z" fill="#f472b6" />
        <circle cx="58" cy="58" r="5" fill="#f1f5f9" />
      </g>
    </svg>
  );
}

function CuadroSVG({ colorFondo, tipo }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="68" height="68" rx="3" fill="#3a2b5c" />
      <rect x="12" y="12" width="56" height="56" rx="2" fill={colorFondo} />
      {tipo === 'paisaje' ? (
        <>
          <rect x="12" y="42" width="56" height="26" fill="#1e3a2f" />
          <circle cx="55" cy="26" r="8" fill="#fde68a" />
          <path d="M12 46 Q30 30 45 46 Q58 34 68 46 L68 68 L12 68 Z" fill="#166534" />
        </>
      ) : (
        <>
          <circle cx="30" cy="30" r="12" fill="#f472b6" opacity="0.8" />
          <rect x="40" y="38" width="20" height="20" fill="#a78bfa" opacity="0.8" transform="rotate(20 50 48)" />
          <circle cx="52" cy="24" r="7" fill="#facc15" opacity="0.9" />
        </>
      )}
      <rect x="12" y="12" width="56" height="56" rx="2" fill="white" className="todu-brillo-cuadro" />
    </svg>
  );
}

function VentanaSVG() {
  const estrellas = [
    { cx: 20, cy: 20, r: 1.6, delay: '0s' },
    { cx: 34, cy: 14, r: 1.2, delay: '0.5s' },
    { cx: 55, cy: 22, r: 1.8, delay: '1s' },
    { cx: 46, cy: 40, r: 1.3, delay: '1.5s' },
    { cx: 24, cy: 46, r: 1.5, delay: '0.8s' },
    { cx: 60, cy: 50, r: 1.2, delay: '1.8s' },
  ];
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="68" height="68" rx="3" fill="#3a2b5c" />
      <rect x="12" y="12" width="56" height="56" rx="2" fill="#0b1030" />
      <circle cx="55" cy="26" r="9" fill="#e2e8f0" />
      <circle cx="59" cy="22" r="8" fill="#0b1030" />
      {estrellas.map((e, i) => (
        <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="white" className="todu-twinkle-estrella" style={{ animationDelay: e.delay }} />
      ))}
      <line x1="40" y1="12" x2="40" y2="68" stroke="#3a2b5c" strokeWidth="2" />
      <line x1="12" y1="40" x2="68" y2="40" stroke="#3a2b5c" strokeWidth="2" />
    </svg>
  );
}

function RelojSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="28" fill="#f8fafc" stroke="#3a2b5c" strokeWidth="4" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1="40" y1="16" x2="40" y2="20"
          stroke="#1f1638" strokeWidth="2"
          transform={`rotate(${deg} 40 40)`}
        />
      ))}
      <line x1="40" y1="40" x2="40" y2="24" stroke="#1f1638" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="40" x2="52" y2="40" stroke="#1f1638" strokeWidth="2.5" strokeLinecap="round" />
      <g className="todu-segundero">
        <line x1="40" y1="40" x2="40" y2="18" stroke="#f472b6" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <circle cx="40" cy="40" r="2.5" fill="#1f1638" />
    </svg>
  );
}

function DronSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full todu-vuelo-dron" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="42" rx="12" ry="8" fill="#334155" />
      <circle cx="40" cy="40" r="3" fill="#38bdf8" className="todu-luz-dron" />
      <line x1="28" y1="36" x2="14" y2="26" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="36" x2="66" y2="26" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="48" x2="14" y2="58" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <line x1="52" y1="48" x2="66" y2="58" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <g className="todu-helice" style={{ transformOrigin: '14px 26px' }}>
        <ellipse cx="14" cy="26" rx="9" ry="2.5" fill="#94a3b8" opacity="0.8" />
      </g>
      <g className="todu-helice" style={{ transformOrigin: '66px 26px' }}>
        <ellipse cx="66" cy="26" rx="9" ry="2.5" fill="#94a3b8" opacity="0.8" />
      </g>
      <g className="todu-helice" style={{ transformOrigin: '14px 58px' }}>
        <ellipse cx="14" cy="58" rx="9" ry="2.5" fill="#94a3b8" opacity="0.8" />
      </g>
      <g className="todu-helice" style={{ transformOrigin: '66px 58px' }}>
        <ellipse cx="66" cy="58" rx="9" ry="2.5" fill="#94a3b8" opacity="0.8" />
      </g>
    </svg>
  );
}

function LamparaSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="66" width="20" height="6" rx="2" fill="#3a2b5c" />
      <rect x="38" y="40" width="4" height="26" fill="#64748b" />
      <path d="M24 40 L56 40 L48 20 L32 20 Z" fill="#fde68a" className="todu-titilar-foco" />
    </svg>
  );
}

function ConsolaSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="28" width="48" height="30" rx="6" fill="#1f1638" stroke="#a78bfa" strokeWidth="2" />
      <rect x="24" y="34" width="32" height="18" rx="2" fill="#38bdf8" className="todu-pantalla-consola" />
      <circle cx="22" cy="60" r="2.5" fill="#f472b6" />
      <circle cx="58" cy="60" r="2.5" fill="#34d399" />
    </svg>
  );
}

function AcuarioSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="24" width="64" height="44" rx="4" fill="#0e7490" opacity="0.35" stroke="#22d3ee" strokeWidth="2" />
      <ellipse cx="20" cy="64" rx="6" ry="3" fill="#78716c" />
      <ellipse cx="34" cy="65" rx="5" ry="2.5" fill="#57534e" />
      <g className="todu-nadar-der" style={{ transformOrigin: '30px 40px' }}>
        <path d="M22 40 Q30 32 38 40 Q30 48 22 40 Z" fill="#fb923c" />
        <path d="M22 40 L16 36 L16 44 Z" fill="#fb923c" />
      </g>
      <g className="todu-nadar-izq" style={{ transformOrigin: '52px 52px' }}>
        <path d="M44 52 Q52 46 60 52 Q52 58 44 52 Z" fill="#facc15" />
        <path d="M60 52 L66 48 L66 56 Z" fill="#facc15" />
      </g>
      <circle cx="50" cy="60" r="1.5" fill="#a5f3fc" className="todu-burbuja" style={{ animationDelay: '0s' }} />
      <circle cx="55" cy="60" r="1" fill="#a5f3fc" className="todu-burbuja" style={{ animationDelay: '0.8s' }} />
      <circle cx="45" cy="60" r="1.2" fill="#a5f3fc" className="todu-burbuja" style={{ animationDelay: '1.4s' }} />
    </svg>
  );
}

function AlfombraSVG() {
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="30" rx="58" ry="26" fill="#7c3aed" opacity="0.35" />
      <ellipse cx="60" cy="30" rx="44" ry="18" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.6" />
      <ellipse cx="60" cy="30" rx="28" ry="10" fill="none" stroke="#c4b5fd" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function PlantaSVG() {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 60 L52 60 L48 76 L32 76 Z" fill="#b45309" />
      <rect x="26" y="56" width="28" height="6" rx="2" fill="#92400e" />
      <path d="M40 58 Q30 40 34 20" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round" className="todu-hoja" style={{ animationDelay: '0s' }} />
      <path d="M40 58 Q40 36 40 16" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" className="todu-hoja" style={{ animationDelay: '0.4s' }} />
      <path d="M40 58 Q50 40 46 20" stroke="#166534" strokeWidth="4" fill="none" strokeLinecap="round" className="todu-hoja" style={{ animationDelay: '0.8s' }} />
    </svg>
  );
}

function GuirnaldaSVG() {
  const colores = ['#f472b6', '#facc15', '#38bdf8', '#34d399', '#a78bfa', '#fb923c'];
  return (
    <svg viewBox="0 0 320 30" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 4 Q40 20 80 4 T160 4 T240 4 T320 4" stroke="#3a2b5c" strokeWidth="1.5" fill="none" />
      {colores.map((color, i) => {
        const x = 20 + i * 55;
        const y = i % 2 === 0 ? 12 : 16;
        return (
          <circle
            key={i}
            cx={x} cy={y} r="4.5"
            fill={color}
            className="todu-twinkle-guirnalda"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        );
      })}
    </svg>
  );
}

export default function DecoracionSVG({ itemId }) {
  const item = {
    trofeo_bronce: <TrofeoBase colorPrincipal="#cd7f32" colorSombra="#8b5a2b" colorBrillo="#f4c896" />,
    trofeo_plata: <TrofeoBase colorPrincipal="#c0c0c0" colorSombra="#8a8a8a" colorBrillo="#f2f2f2" />,
    trofeo_oro: <TrofeoBase colorPrincipal="#ffc107" colorSombra="#b8860b" colorBrillo="#fff6d6" />,
    mascota_gato: <GatitoSVG />,
    mascota_ave: <PajaritoSVG />,
    mascota_conejo: <ConejitoSVG />,
    pared_paisaje: <CuadroSVG colorFondo="#0f2c5c" tipo="paisaje" />,
    pared_abstracto: <CuadroSVG colorFondo="#1e1338" tipo="abstracto" />,
    pared_nocturna: <VentanaSVG />,
    pared_reloj: <RelojSVG />,
    aire_dron: <DronSVG />,
    accesorios_lampara: <LamparaSVG />,
    accesorios_consola: <ConsolaSVG />,
    accesorios_acuario: <AcuarioSVG />,
    piso_alfombra: <AlfombraSVG />,
    piso_maceta: <PlantaSVG />,
    ambiente_luces: <GuirnaldaSVG />,
  }[itemId];

  return (
    <>
      <style>{ESTILOS}</style>
      {item || null}
    </>
  );
}
