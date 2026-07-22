'use client';
import DecoracionSVG from './DecoracionSVG';
import { CATALOGO_DECORACIONES } from './catalogo';
import ToduAvatar from '../ToduAvatar';

/**
 * El "Cuarto de Todú" como una escena real. Cada categoría tiene su
 * propia zona fija — no hay casillas para elegir, cada objeto aparece
 * solo en su lugar en cuanto lo compras:
 * - Trofeos    → estante detrás de Todú
 * - Mascotas   → sentadas a sus pies
 * - Pared      → cuadros, ventana, reloj — colgados en la pared (antes "Cuadros")
 * - Aire       → dron, flotando cerca del techo (antes "Drones")
 * - Accesorios → sobre un buró en la esquina inferior
 * - Piso       → alfombra (fondo) y planta (a nivel del suelo) — nueva
 * - Ambiente   → guirnalda de luces, tira superior — nueva
 */
export default function EscenaCuartoTodu({ compradas, emocionActual, mensaje, onCosquillas }) {
  const itemsComprados = CATALOGO_DECORACIONES.filter((it) => compradas.includes(it.id));
  const por = (cat) => itemsComprados.filter((it) => it.categoria === cat);

  const trofeos = por('Trofeos');
  const mascotas = por('Mascotas');
  const pared = por('Pared');
  const aire = por('Aire');
  const accesorios = por('Accesorios');
  const piso = por('Piso');
  const ambiente = por('Ambiente');

  const alfombra = piso.find((it) => it.id === 'piso_alfombra');
  const planta = piso.find((it) => it.id === 'piso_maceta');
  const guirnalda = ambiente[0];

  const POSICIONES_ESTANTE = ['20%', '50%', '80%'];
  const POSICIONES_PISO = ['50%'];
  const POSICIONES_PARED = ['8%', '36%', '64%', '92%'];
  const POSICIONES_DRONES = ['75%', '20%'];
  const POSICIONES_MASCOTAS = ['14%', '86%'];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden" style={{ minHeight: 360 }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#241a3d] via-[#1c1536] to-[#170f2b]" />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 48px)',
        }}
      />

      {/* Alfombra, pegada al piso, debajo de todo lo demás */}
      {alfombra && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-56 h-16 z-0">
          <DecoracionSVG itemId={alfombra.id} />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 h-20 bg-black/25 border-t border-white/5" />

      {/* Guirnalda, en la orilla superior */}
      {guirnalda && (
        <div className="absolute top-0 inset-x-0 h-8">
          <DecoracionSVG itemId={guirnalda.id} />
        </div>
      )}

      {/* Fila de pared: cuadros, ventana, reloj */}
      {pared.map((item, i) => (
        <div
          key={item.id}
          className="absolute w-14 h-14 -translate-x-1/2"
          style={{ left: POSICIONES_PARED[i], top: 14 }}
          title={item.nombre}
        >
          <DecoracionSVG itemId={item.id} />
        </div>
      ))}

      {aire.map((item, i) => (
        <div
          key={item.id}
          className="absolute w-12 h-12 -translate-x-1/2 z-20"
          style={{ left: POSICIONES_DRONES[i], top: 20 }}
          title={item.nombre}
        >
          <DecoracionSVG itemId={item.id} />
        </div>
      ))}

      <div className="absolute left-1/2 -translate-x-1/2 top-16 w-64 h-3 rounded-full bg-gradient-to-b from-[#a97a52] via-[#8b5e3c] to-[#5c3719] shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
        <div className="absolute -bottom-1.5 left-3 w-1 h-2 bg-[#3d2412] rounded-b-sm" />
        <div className="absolute -bottom-1.5 right-3 w-1 h-2 bg-[#3d2412] rounded-b-sm" />
      </div>
      {trofeos.map((item, i) => (
        <div
          key={item.id}
          className="absolute w-12 h-12 -translate-x-1/2"
          style={{ left: POSICIONES_ESTANTE[i], top: 24 }}
          title={item.nombre}
        >
          <DecoracionSVG itemId={item.id} />
        </div>
      ))}
      {trofeos.length === 0 && pared.length === 0 && (
        <p className="absolute left-1/2 -translate-x-1/2 top-8 text-[9px] text-slate-500 font-bold uppercase tracking-widest whitespace-nowrap">
          El cuarto espera su primera decoración
        </p>
      )}

      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-16 w-56 h-56 flex items-center justify-center cursor-pointer active:scale-95 transition-transform z-10"
        onClick={onCosquillas}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#6d28d9]/30 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <ToduAvatar emotion={emocionActual} mensaje={mensaje} size={260} />
      </div>

      {/* Planta, a un lado en el piso */}
      {planta && (
        <div className="absolute bottom-14 left-3 w-12 h-12 z-10" title={planta.nombre}>
          <DecoracionSVG itemId={planta.id} />
        </div>
      )}

      {mascotas.slice(0, 2).map((item, i) => (
        <div
          key={item.id}
          className="absolute w-14 h-14 -translate-x-1/2"
          style={{ left: POSICIONES_MASCOTAS[i], bottom: 14 }}
          title={item.nombre}
        >
          <DecoracionSVG itemId={item.id} />
        </div>
      ))}
      {mascotas.length > 2 && (
        <div
          className="absolute w-14 h-14 -translate-x-1/2"
          style={{ left: POSICIONES_PISO[0], bottom: 14 }}
          title={mascotas[2].nombre}
        >
          <DecoracionSVG itemId={mascotas[2].id} />
        </div>
      )}

      {accesorios.length > 0 && (
        <div className="absolute bottom-14 right-4 w-16 h-10 bg-gradient-to-b from-[#a97a52] via-[#8b5e3c] to-[#5c3719] rounded-t-md shadow-[0_4px_10px_rgba(0,0,0,0.4)]">
          <div className="absolute -bottom-3 left-1 w-1.5 h-3 bg-[#3d2412]" />
          <div className="absolute -bottom-3 right-1 w-1.5 h-3 bg-[#3d2412]" />
          <div className="absolute -top-8 left-0 flex gap-1">
            {accesorios.map((item) => (
              <div key={item.id} className="w-8 h-8" title={item.nombre}>
                <DecoracionSVG itemId={item.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
