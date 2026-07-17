'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Check, X, MapPin } from 'lucide-react';
import { api } from '../../lib/api';

const MOCK_PLACES = [
  {
    id: '1',
    name: 'Café de Especialidad 5 B',
    rating: 4.8,
    reviews: 124,
    category: 'Cafeterías',
    distance: '1.2 km',
    isOpen: true,
    address: 'Blvd. Belisario Domínguez, Tuxtla Gutiérrez',
    lat: 16.7530, lng: -93.1190,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    toduTip: 'Tiene el WiFi más estable de la zona. Ideal para programar sin interrupciones.'
  },
  {
    id: '2',
    name: 'Biblioteca Central Universitaria',
    rating: 4.9,
    reviews: 312,
    category: 'Bibliotecas',
    distance: '3.5 km',
    isOpen: true,
    address: 'Campus Universitario',
    lat: 16.7780, lng: -93.1620,
    imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80',
    toduTip: 'Silencio absoluto. Perfecto si tienes que estudiar para Cálculo o Ecuaciones Diferenciales.'
  },
  {
    id: '3',
    name: 'Parque de la Marimba',
    rating: 4.7,
    reviews: 890,
    category: 'Parques',
    distance: '5.0 km',
    isOpen: true,
    address: 'Centro, Tuxtla Gutiérrez',
    lat: 16.7516, lng: -93.1145,
    imageUrl: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
    toduTip: 'Excelente lugar para despejar la mente y tomar aire fresco después de clases.'
  },
  {
    id: '4',
    name: 'El Rincón del Coiteco',
    rating: 4.5,
    reviews: 89,
    category: 'Para comer',
    distance: '0.8 km',
    isOpen: false,
    address: 'Centro, Ocozocoautla',
    lat: 16.7890, lng: -93.3760,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    toduTip: 'Gran opción para recargar energías con comida local y buen ambiente.'
  }
];

const CATEGORIES = ['Todos', 'Cafeterías', 'Bibliotecas', 'Parques', 'Para comer'];

export default function PlacesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFormId, setOpenFormId] = useState(null);
  const [mapOpenId, setMapOpenId] = useState(null);
  const [hora, setHora] = useState('18:00');
  const [savingId, setSavingId] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

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

  const filteredPlaces = MOCK_PLACES.filter(place => {
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
          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Recomendaciones Inteligentes</p>
        </div>
      </header>

      {/* Se expandió el max-w para que luzca bien en escritorio */}
      <main className="max-w-7xl mx-auto flex flex-col mt-4">
        
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

        {/* CONTENEDOR GRID RESPONSIVO (Aquí está el cambio clave) */}
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
                    <span className="text-[10px] font-bold text-white">{place.distance}</span>
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
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-2 text-[11px] font-bold text-violet-300 hover:text-violet-200 bg-black/30"
                    >
                      Abrir en Google Maps ↗
                    </a>
                  </div>
                )}

                {/* Info flex-1 empuja los botones hacia abajo para alinear las tarjetas */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-sm font-bold text-white leading-tight line-clamp-2">{place.name}</h2>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20 flex-shrink-0">
                      <span className="text-xs text-amber-400">★</span>
                      <span className="text-xs font-bold text-amber-400">{place.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 line-clamp-1">{place.address}</p>
                  
                  <div className="flex justify-between items-center mt-2 pt-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{place.category}</span>
                    {place.isOpen ? (
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"></span>
                        Abierto
                      </span>
                    ) : (
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
      </main>
    </div>
  );
}