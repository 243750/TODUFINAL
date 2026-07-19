'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Check, X, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { api, ApiError } from '../../lib/api';
const CATEGORIES = ['Todos', 'Cafeterías', 'Bibliotecas', 'Parques', 'Para comer', 'Otros'];

// Imagen genérica por categoría — el backend de /geo/cercanos no trae
// fotos reales del lugar todavía (eso necesitaría una llamada aparte
// a la API de fotos de Google), así que usamos una representativa.
const IMAGEN_POR_CATEGORIA = {
  'Cafeterías': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
  'Bibliotecas': 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80',
  'Parques': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
  'Para comer': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
  'Otros': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=600&q=80',
};

// Traduce los "types" que regresa Google Places a nuestras categorías en español.
function inferirCategoria(types = []) {
  if (types.includes('cafe')) return 'Cafeterías';
  if (types.includes('library')) return 'Bibliotecas';
  if (types.includes('park')) return 'Parques';
  if (types.some((t) => ['restaurant', 'meal_takeaway', 'food', 'bakery'].includes(t))) return 'Para comer';
  return 'Otros';
}

// Distancia en línea recta (fórmula de Haversine) entre tu ubicación
// real y la del lugar — no es la ruta exacta caminando/en auto, pero
// es un cálculo real a partir de coordenadas reales, no inventado.
function calcularDistanciaKm(lat1, lng1, lat2, lng2) {
  if (lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PlacesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFormId, setOpenFormId] = useState(null);
  const [mapOpenId, setMapOpenId] = useState(null);
  const [hora, setHora] = useState('18:00');
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const [ubicacion, setUbicacion] = useState(null);
  const [estadoUbicacion, setEstadoUbicacion] = useState('pidiendo'); // pidiendo | lista | negada | error
  const [places, setPlaces] = useState([]);
  const [cargandoPlaces, setCargandoPlaces] = useState(false);
  const [errorPlaces, setErrorPlaces] = useState(null);

  // --- Paso 1: pedir tu ubicación real al navegador ---
  const pedirUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      setEstadoUbicacion('error');
      setErrorPlaces('Tu navegador no soporta geolocalización.');
      return;
    }
    setEstadoUbicacion('pidiendo');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setEstadoUbicacion('lista');
      },
      (err) => {
        setEstadoUbicacion(err.code === err.PERMISSION_DENIED ? 'negada' : 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    pedirUbicacion();
  }, [pedirUbicacion]);

  // --- Paso 2: con la ubicación en mano, pedirle al backend los lugares reales ---
  useEffect(() => {
    if (!ubicacion) return;
    let cancelled = false;
    setCargandoPlaces(true);
    setErrorPlaces(null);

    api
      .get(`/geo/cercanos?lat=${ubicacion.lat}&lng=${ubicacion.lng}&radius=3000`)
      .then((data) => {
        if (cancelled) return;
        const mapeados = (data.places || []).map((p) => ({
          id: p.id,
          name: p.name,
          rating: p.rating,
          reviews: p.userRatingsTotal || 0,
          category: inferirCategoria(p.types),
          distanciaKm: calcularDistanciaKm(ubicacion.lat, ubicacion.lng, p.geometry?.lat, p.geometry?.lng),
          isOpen: p.openNow,
          address: p.address,
          lat: p.geometry?.lat,
          lng: p.geometry?.lng,
          imageUrl: IMAGEN_POR_CATEGORIA[inferirCategoria(p.types)],
          toduTip: p.tip || 'Todú todavía no tiene un tip para este lugar — pero seguro vale la pena.',
        }));
        setPlaces(mapeados);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 403) {
          setErrorPlaces('Necesitas subir de nivel para desbloquear Places.');
        } else {
          setErrorPlaces(err.message || 'No se pudieron cargar los lugares cercanos.');
        }
      })
      .finally(() => {
        if (!cancelled) setCargandoPlaces(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ubicacion]);

  const handleAgregarComoTarea = async (place) => {
    setSavingId(place.id);
    setErrorMsg(null);
    try {
      await api.post('/tareas', {
        titulo: `Visitar ${place.name}`,
        descripcion: `${place.address} · ${hora} hrs`,
        xpValor: 25,
      });
      setSavedIds((prev) => [...prev, place.id]);
      setOpenFormId(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSavingId(null);
    }
  };

  const filteredPlaces = places.filter((place) => {
    const matchesCategory = activeCategory === 'Todos' || place.category === activeCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-10 overflow-x-hidden">
      
      <header className="sticky top-0 z-50 bg-[#150f27]/90 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-white/5">
        <Link href="/descubrir" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white tracking-wide">Todú Places</h1>
          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Cerca de ti, en tiempo real</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto flex flex-col mt-4">

        {/* --- Estados de ubicación --- */}
        {estadoUbicacion === 'pidiendo' && (
          <div className="px-6 py-16 flex flex-col items-center text-center gap-3">
            <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Pidiendo permiso de ubicación...</p>
          </div>
        )}

        {estadoUbicacion === 'negada' && (
          <div className="px-6 py-16 flex flex-col items-center text-center gap-3 max-w-sm mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <p className="text-sm text-white font-bold">Bloqueaste el permiso de ubicación</p>
            <p className="text-xs text-slate-400">
              Places necesita saber dónde estás para recomendarte lugares reales cerca de ti. Actívalo en los ajustes de tu navegador para este sitio y vuelve a intentar.
            </p>
            <button
              onClick={pedirUbicacion}
              className="mt-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {estadoUbicacion === 'error' && (
          <div className="px-6 py-16 flex flex-col items-center text-center gap-3 max-w-sm mx-auto">
            <AlertCircle className="w-8 h-8 text-rose-400" />
            <p className="text-sm text-white font-bold">No pudimos obtener tu ubicación</p>
            <p className="text-xs text-slate-400">{errorPlaces || 'Intenta de nuevo en un momento.'}</p>
            <button
              onClick={pedirUbicacion}
              className="mt-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {estadoUbicacion === 'lista' && (
          <>
            <div className="px-6 mb-4 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="¿Qué estás buscando hoy?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                />
              </div>
            </div>

            <div className="px-6 mb-6 overflow-x-auto pb-2 scrollbar-hide flex gap-2 snap-x">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeCategory === category
                      ? 'bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                      : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {cargandoPlaces ? (
              <div className="px-6 py-16 flex flex-col items-center text-center gap-3">
                <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Buscando lugares cerca de ti...</p>
              </div>
            ) : errorPlaces ? (
              <div className="px-6 py-16 flex flex-col items-center text-center gap-3 max-w-sm mx-auto">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <p className="text-sm text-white font-bold">No se pudieron cargar los lugares</p>
                <p className="text-xs text-slate-400">{errorPlaces}</p>
              </div>
            ) : (
              <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces.length > 0 ? (
                  filteredPlaces.map((place) => (
                    <div key={place.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:border-white/20 transition-colors h-full">
                      
                      <div
                        className="relative h-48 w-full overflow-hidden cursor-pointer flex-shrink-0"
                        onClick={() => setMapOpenId(mapOpenId === place.id ? null : place.id)}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${place.imageUrl})` }}
                        ></div>
                        <div className="absolute top-3 left-3 bg-[#150f27]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-violet-400" />
                          <span className="text-[10px] font-bold text-white">
                            {place.distanciaKm != null ? `${place.distanciaKm.toFixed(1)} km` : '—'}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-[#150f27]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-bold text-violet-300">
                          Ver ubicación
                        </div>
                      </div>

                      {mapOpenId === place.id && (
                        <div className="border-b border-white/10 flex-shrink-0">
                          <div className="w-full h-48">
                            <iframe
                              title={`Mapa de ${place.name}`}
                              className="w-full h-full"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              src={`https://maps.google.com/maps?q=${place.lat},${place.lng}&z=15&output=embed`}
                            />
                          </div>
                          
                            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center py-2 text-[11px] font-bold text-violet-300 hover:text-violet-200 bg-black/30"
                          >
                            Abrir en Google Maps ↗
                          </a>
                        </div>
                      )}

                      <div className="p-4 flex flex-col gap-2 flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{place.name}</h2>
                          {place.rating != null && (
                            <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 flex-shrink-0">
                              <span className="text-xs text-amber-400">★</span>
                              <span className="text-xs font-bold text-amber-400">{place.rating}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1">{place.address}</p>

                        <div className="flex justify-between items-center mt-2 pt-3">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{place.category}</span>
                          {place.isOpen === true && (
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>
                              Abierto
                            </span>
                          )}
                          {place.isOpen === false && (
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Cerrado
                            </span>
                          )}
                        </div>

                        <div className="pt-3 mt-auto flex items-end gap-3">
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center mb-1">
                            <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M75 45 C85 40, 90 60, 80 65" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"/>
                              <ellipse cx="50" cy="60" rx="30" ry="28" fill="white" />
                              <line x1="50" y1="32" x2="50" y2="15" stroke="white" strokeWidth="5" strokeLinecap="round" />
                              <circle cx="50" cy="12" r="4" fill="#FFC107" />
                              <path d="M35 55 Q40 48 45 55" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" fill="none" />
                              <path d="M55 55 Q60 48 65 55" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" fill="none" />
                            </svg>
                          </div>

                          <div className="relative flex-1 bg-[#1f1638] border border-white/10 rounded-2xl p-3 shadow-md">
                            <div className="absolute -left-[6px] bottom-[12px] w-3 h-3 bg-[#1f1638] border-l border-b border-white/10 transform rotate-45"></div>
                            <h4 className="text-[#FFC107] text-[11px] font-bold mb-1">Todú:</h4>
                            <p className="text-[11px] text-slate-300 leading-snug font-medium">
                              {place.toduTip}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4 mt-auto">
                        {savedIds.includes(place.id) ? (
                          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                            <Check className="w-4 h-4" />
                            Agregado a Mis Tareas
                          </div>
                        ) : openFormId === place.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              value={hora}
                              onChange={(e) => setHora(e.target.value)}
                              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/50"
                            />
                            <button
                              onClick={() => handleAgregarComoTarea(place)}
                              disabled={savingId === place.id}
                              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors"
                            >
                              {savingId === place.id ? '...' : 'Confirmar'}
                            </button>
                            <button
                              onClick={() => setOpenFormId(null)}
                              className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setOpenFormId(place.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 text-xs font-bold transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Agregar a Mis Tareas
                          </button>
                        )}
                        {errorMsg && openFormId === place.id && (
                          <p className="text-[11px] text-rose-400 font-semibold mt-2 text-center">{errorMsg}</p>
                        )}
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <span className="text-4xl block mb-3">📍</span>
                    <p className="text-sm text-slate-400 font-medium">No encontramos lugares con esos filtros.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}