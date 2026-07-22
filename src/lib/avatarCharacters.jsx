// Avatares "personaje" — reemplazan los íconos planos de Lucide por
// caras y criaturas a color (mismo estilo que las decoraciones de
// src/components/decoraciones/DecoracionSVG.jsx: SVG a mano, sin
// depender de ninguna API externa ni de imágenes).
//
// Cada componente es autocontenido: trae su propio círculo de fondo de
// color, así que se puede usar directo con className="w-X h-X" igual
// que un ícono de Lucide (viewBox cuadrado 120x120, escala sin
// distorsión a cualquier tamaño).

export function AvatarAna({ className }) {
  return (
    <svg viewBox="40 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="55" fill="#7C3AED" />
      <circle cx="100" cy="94" r="34" fill="#2b2320" />
      <circle cx="100" cy="103" r="30" fill="#FFDBB4" />
      <ellipse cx="72" cy="120" rx="9" ry="24" fill="#2b2320" />
      <ellipse cx="128" cy="120" rx="9" ry="24" fill="#2b2320" />
      <circle cx="91" cy="100" r="2.5" fill="#2b2320" />
      <circle cx="109" cy="100" r="2.5" fill="#2b2320" />
      <path d="M92 114 Q100 119 108 114" stroke="#8a5a3f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarZola({ className }) {
  return (
    <svg viewBox="360 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="100" r="55" fill="#F59E0B" />
      <circle cx="420" cy="98" r="44" fill="#1c1a17" />
      <circle cx="388" cy="90" r="7" fill="#1c1a17" />
      <circle cx="452" cy="90" r="7" fill="#1c1a17" />
      <circle cx="420" cy="58" r="8" fill="#1c1a17" />
      <circle cx="420" cy="104" r="30" fill="#C68642" />
      <circle cx="411" cy="101" r="2.5" fill="#1c1a17" />
      <circle cx="429" cy="101" r="2.5" fill="#1c1a17" />
      <path d="M412 115 Q420 120 428 115" stroke="#5c3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarKai({ className }) {
  return (
    <svg viewBox="520 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="580" cy="100" r="55" fill="#EC4899" />
      <circle cx="580" cy="103" r="30" fill="#8D5524" />
      <circle cx="571" cy="100" r="2.5" fill="#241209" />
      <circle cx="589" cy="100" r="2.5" fill="#241209" />
      <path d="M572 114 Q580 119 588 114" stroke="#4a260f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarMia({ className }) {
  return (
    <svg viewBox="40 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="260" r="55" fill="#10B981" />
      <circle cx="100" cy="254" r="33" fill="#d9a441" />
      <ellipse cx="140" cy="278" rx="8" ry="18" fill="#d9a441" />
      <circle cx="100" cy="263" r="30" fill="#FFDBB4" />
      <circle cx="91" cy="260" r="2.5" fill="#2b2320" />
      <circle cx="109" cy="260" r="2.5" fill="#2b2320" />
      <path d="M92 274 Q100 279 108 274" stroke="#8a5a3f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarSam({ className }) {
  return (
    <svg viewBox="360 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="260" r="55" fill="#3B82F6" />
      <circle cx="420" cy="254" r="33" fill="#9CA3AF" />
      <circle cx="420" cy="222" r="8" fill="#9CA3AF" />
      <circle cx="420" cy="263" r="30" fill="#C68642" />
      <circle cx="411" cy="260" r="2.5" fill="#1c1a17" />
      <circle cx="429" cy="260" r="2.5" fill="#1c1a17" />
      <path d="M412 274 Q420 279 428 274" stroke="#5c3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarRex({ className }) {
  return (
    <svg viewBox="520 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="580" cy="260" r="55" fill="#F97316" />
      <rect x="574" y="212" width="12" height="26" rx="5" fill="#a94428" />
      <circle cx="580" cy="263" r="30" fill="#8D5524" />
      <circle cx="571" cy="260" r="2.5" fill="#241209" />
      <circle cx="589" cy="260" r="2.5" fill="#241209" />
      <path d="M572 274 Q580 279 588 274" stroke="#4a260f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarTheo({ className }) {
  return (
    <svg viewBox="200 360 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="260" cy="420" r="55" fill="#14B8A6" />
      <circle cx="260" cy="412" r="33" fill="#221f1c" />
      <circle cx="260" cy="423" r="30" fill="#E8B48C" />
      <ellipse cx="260" cy="442" rx="17" ry="9" fill="#221f1c" />
      <circle cx="251" cy="420" r="2.5" fill="#1c1a17" />
      <circle cx="269" cy="420" r="2.5" fill="#1c1a17" />
    </svg>
  );
}

export function AvatarLuna({ className }) {
  return (
    <svg viewBox="360 360 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="420" r="55" fill="#F43F5E" />
      <circle cx="420" cy="414" r="33" fill="#1c1a17" />
      <circle cx="393" cy="392" r="7" fill="#1c1a17" />
      <circle cx="447" cy="392" r="7" fill="#1c1a17" />
      <circle cx="420" cy="423" r="30" fill="#C68642" />
      <circle cx="411" cy="420" r="2.5" fill="#1c1a17" />
      <circle cx="429" cy="420" r="2.5" fill="#1c1a17" />
      <path d="M412 434 Q420 439 428 434" stroke="#5c3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarNico({ className }) {
  return (
    <svg viewBox="40 520 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="580" r="55" fill="#EAB308" />
      <circle cx="100" cy="573" r="33" fill="#2b2320" />
      <circle cx="100" cy="583" r="30" fill="#FFDBB4" />
      <rect x="82" y="575" width="12" height="9" rx="2" fill="none" stroke="#2b2320" strokeWidth="1.5" />
      <rect x="106" y="575" width="12" height="9" rx="2" fill="none" stroke="#2b2320" strokeWidth="1.5" />
      <line x1="94" y1="579" x2="106" y2="579" stroke="#2b2320" strokeWidth="1.5" />
      <path d="M92 594 Q100 599 108 594" stroke="#8a5a3f" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarIvan({ className }) {
  return (
    <svg viewBox="200 520 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="260" cy="580" r="55" fill="#6366F1" />
      <circle cx="260" cy="572" r="33" fill="#5b3a29" />
      <ellipse cx="294" cy="600" rx="8" ry="20" fill="#5b3a29" />
      <circle cx="260" cy="583" r="30" fill="#E8B48C" />
      <circle cx="251" cy="580" r="2.5" fill="#2b2320" />
      <circle cx="269" cy="580" r="2.5" fill="#2b2320" />
      <path d="M252 594 Q260 599 268 594" stroke="#7a4a30" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarCoco({ className }) {
  return (
    <svg viewBox="360 520 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="580" r="55" fill="#D946EF" />
      <circle cx="420" cy="572" r="35" fill="#d9a441" />
      <ellipse cx="392" cy="598" rx="10" ry="16" fill="#d9a441" />
      <ellipse cx="448" cy="598" rx="10" ry="16" fill="#d9a441" />
      <circle cx="420" cy="583" r="30" fill="#C68642" />
      <circle cx="411" cy="580" r="2.5" fill="#1c1a17" />
      <circle cx="429" cy="580" r="2.5" fill="#1c1a17" />
      <path d="M412 594 Q420 599 428 594" stroke="#5c3a1e" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarDiego({ className }) {
  return (
    <svg viewBox="520 520 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="580" cy="580" r="55" fill="#0EA5E9" />
      <circle cx="580" cy="573" r="33" fill="#1c1a17" />
      <circle cx="580" cy="583" r="30" fill="#8D5524" />
      <circle cx="571" cy="580" r="2.5" fill="#241209" />
      <circle cx="589" cy="580" r="2.5" fill="#241209" />
      <path d="M570 591 Q577 588 580 591 Q583 588 590 591" stroke="#1c1a17" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarRobot1({ className }) {
  return (
    <svg viewBox="40 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="55" fill="#6366F1" />
      <line x1="100" y1="70" x2="100" y2="58" stroke="#C7CCD1" strokeWidth="3" />
      <circle cx="100" cy="55" r="4" fill="#22D3EE" />
      <circle cx="100" cy="103" r="30" fill="#C7CCD1" />
      <rect x="91" y="97" width="7" height="7" rx="1" fill="#22D3EE" />
      <rect x="112" y="97" width="7" height="7" rx="1" fill="#22D3EE" />
      <rect x="90" y="115" width="20" height="4" rx="2" fill="#5b6069" />
    </svg>
  );
}

export function AvatarRobot2({ className }) {
  return (
    <svg viewBox="200 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="260" cy="100" r="55" fill="#F43F5E" />
      <circle cx="260" cy="103" r="30" fill="#E8B4A8" />
      <rect x="242" y="94" width="36" height="16" rx="8" fill="#241f1f" />
      <rect x="246" y="99" width="28" height="5" rx="2.5" fill="#22D3EE" />
      <rect x="255" y="128" width="10" height="3" rx="1.5" fill="#8a6a63" />
    </svg>
  );
}

export function AvatarGato({ className }) {
  return (
    <svg viewBox="360 40 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="100" r="55" fill="#F59E0B" />
      <polygon points="396,80 406,80 392,58" fill="#F4C89A" />
      <polygon points="444,80 434,80 448,58" fill="#F4C89A" />
      <circle cx="420" cy="103" r="28" fill="#F4C89A" />
      <ellipse cx="411" cy="99" rx="4" ry="6" fill="#166534" />
      <ellipse cx="429" cy="99" rx="4" ry="6" fill="#166534" />
      <polygon points="416,110 424,110 420,115" fill="#f0a3a3" />
      <line x1="392" y1="110" x2="405" y2="112" stroke="#8a5a3f" strokeWidth="1.2" />
      <line x1="392" y1="116" x2="405" y2="116" stroke="#8a5a3f" strokeWidth="1.2" />
      <line x1="448" y1="110" x2="435" y2="112" stroke="#8a5a3f" strokeWidth="1.2" />
      <line x1="448" y1="116" x2="435" y2="116" stroke="#8a5a3f" strokeWidth="1.2" />
    </svg>
  );
}

export function AvatarPanda({ className }) {
  return (
    <svg viewBox="40 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="260" r="55" fill="#22C55E" />
      <circle cx="78" cy="235" r="12" fill="#1c1a17" />
      <circle cx="122" cy="235" r="12" fill="#1c1a17" />
      <circle cx="100" cy="263" r="30" fill="#FFFFFF" />
      <ellipse cx="89" cy="260" rx="9" ry="12" fill="#1c1a17" />
      <ellipse cx="111" cy="260" rx="9" ry="12" fill="#1c1a17" />
      <circle cx="89" cy="261" r="3" fill="#fff" />
      <circle cx="111" cy="261" r="3" fill="#fff" />
      <polygon points="97,276 103,276 100,281" fill="#1c1a17" />
    </svg>
  );
}

export function AvatarBuho({ className }) {
  return (
    <svg viewBox="200 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="260" cy="260" r="55" fill="#14B8A6" />
      <polygon points="240,232 248,232 236,215" fill="#C9A576" />
      <polygon points="280,232 272,232 284,215" fill="#C9A576" />
      <circle cx="260" cy="263" r="28" fill="#C9A576" />
      <circle cx="248" cy="258" r="11" fill="#fff" />
      <circle cx="272" cy="258" r="11" fill="#fff" />
      <circle cx="248" cy="258" r="5" fill="#241f1f" />
      <circle cx="272" cy="258" r="5" fill="#241f1f" />
      <polygon points="256,270 264,270 260,278" fill="#F59E0B" />
    </svg>
  );
}

export function AvatarConejo({ className }) {
  return (
    <svg viewBox="360 200 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="260" r="55" fill="#D946EF" />
      <ellipse cx="405" cy="222" rx="8" ry="24" fill="#F3F0EA" />
      <ellipse cx="405" cy="224" rx="4" ry="17" fill="#f4b8d8" />
      <ellipse cx="435" cy="222" rx="8" ry="24" fill="#F3F0EA" />
      <ellipse cx="435" cy="224" rx="4" ry="17" fill="#f4b8d8" />
      <circle cx="420" cy="263" r="26" fill="#F3F0EA" />
      <circle cx="412" cy="259" r="2.5" fill="#2b2320" />
      <circle cx="428" cy="259" r="2.5" fill="#2b2320" />
      <ellipse cx="420" cy="269" rx="4" ry="3" fill="#f28fb8" />
    </svg>
  );
}

export function AvatarUnicornio({ className }) {
  return (
    <svg viewBox="360 360 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="420" cy="420" r="55" fill="#F9A8D4" />
      <polygon points="415,378 425,378 420,358" fill="#FCD34D" />
      <ellipse cx="392" cy="410" rx="6" ry="12" fill="#93C5FD" />
      <ellipse cx="396" cy="422" rx="6" ry="12" fill="#F9A8D4" />
      <ellipse cx="392" cy="434" rx="6" ry="12" fill="#C4B5FD" />
      <circle cx="420" cy="423" r="28" fill="#FFFFFF" />
      <path d="M410 417 Q412 413 415 417" stroke="#241f1f" strokeWidth="1.5" fill="none" />
      <path d="M425 417 Q427 413 430 417" stroke="#241f1f" strokeWidth="1.5" fill="none" />
      <circle cx="412" cy="419" r="2" fill="#241f1f" />
      <circle cx="428" cy="419" r="2" fill="#241f1f" />
    </svg>
  );
}

export function AvatarPinguino({ className }) {
  return (
    <svg viewBox="520 360 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="580" cy="420" r="55" fill="#0EA5E9" />
      <circle cx="580" cy="423" r="30" fill="#1F2937" />
      <ellipse cx="580" cy="432" rx="17" ry="20" fill="#fff" />
      <circle cx="571" cy="415" r="7" fill="#fff" />
      <circle cx="589" cy="415" r="7" fill="#fff" />
      <circle cx="571" cy="416" r="3" fill="#1F2937" />
      <circle cx="589" cy="416" r="3" fill="#1F2937" />
      <polygon points="575,423 585,423 580,430" fill="#F59E0B" />
    </svg>
  );
}
