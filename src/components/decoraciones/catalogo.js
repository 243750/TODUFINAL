// Catálogo de decoraciones — fuente de verdad también usada por el
// backend (mismo id/precio) para validar que nadie compre a un precio
// distinto al real. Si agregas un objeto nuevo, agrégalo aquí Y en la
// tabla equivalente del backend, y dale una zona en EscenaCuartoTodu.jsx.

export const CATALOGO_DECORACIONES = [
  { id: 'trofeo_bronce', nombre: 'Trofeo de Bronce', categoria: 'Trofeos', precio: 200, descripcion: 'Tu primer trofeo. Todo campeón empezó por aquí.' },
  { id: 'trofeo_plata', nombre: 'Trofeo de Plata', categoria: 'Trofeos', precio: 500, descripcion: 'Ya vas en serio. Brilla más que el de bronce.' },
  { id: 'trofeo_oro', nombre: 'Trofeo de Oro', categoria: 'Trofeos', precio: 1000, descripcion: 'El trofeo definitivo. Solo para los más constantes.' },

  { id: 'mascota_gato', nombre: 'Gatito', categoria: 'Mascotas', precio: 300, descripcion: 'Un compañero tranquilo para tu cuarto.' },
  { id: 'mascota_ave', nombre: 'Pajarito', categoria: 'Mascotas', precio: 350, descripcion: 'Siempre alerta, siempre saltando de alegría.' },
  { id: 'mascota_conejo', nombre: 'Conejito', categoria: 'Mascotas', precio: 400, descripcion: 'Orejas largas, corazón tierno.' },

  { id: 'pared_paisaje', nombre: 'Cuadro de Paisaje', categoria: 'Pared', precio: 250, descripcion: 'Un paisaje tranquilo para decorar la pared.' },
  { id: 'pared_abstracto', nombre: 'Cuadro Abstracto', categoria: 'Pared', precio: 300, descripcion: 'Arte moderno, directo del estudio de Todú.' },
  { id: 'pared_nocturna', nombre: 'Ventana Nocturna', categoria: 'Pared', precio: 350, descripcion: 'Una vista a un cielo estrellado, siempre de noche.' },
  { id: 'pared_reloj', nombre: 'Reloj de Pared', categoria: 'Pared', precio: 260, descripcion: 'El segundero nunca se detiene, como tu racha.' },

  { id: 'aire_dron', nombre: 'Dron Explorador', categoria: 'Aire', precio: 700, descripcion: 'Sobrevuela el cuarto vigilando tu progreso.' },

  { id: 'accesorios_lampara', nombre: 'Lamparita', categoria: 'Accesorios', precio: 220, descripcion: 'Un poco de luz cálida para el buró.' },
  { id: 'accesorios_consola', nombre: 'Mini Consola', categoria: 'Accesorios', precio: 450, descripcion: 'Para las pausas entre tarea y tarea.' },
  { id: 'accesorios_acuario', nombre: 'Acuario Pequeño', categoria: 'Accesorios', precio: 500, descripcion: 'Un par de peces nadando tranquilos.' },

  { id: 'piso_alfombra', nombre: 'Alfombra', categoria: 'Piso', precio: 180, descripcion: 'Le da un toque acogedor al cuarto.' },
  { id: 'piso_maceta', nombre: 'Planta en Maceta', categoria: 'Piso', precio: 200, descripcion: 'Un poco de verde nunca está de más.' },

  { id: 'ambiente_luces', nombre: 'Guirnalda de Luces', categoria: 'Ambiente', precio: 260, descripcion: 'Ilumina el cuarto con un parpadeo de colores.' },
];

export const TOTAL_SLOTS_CUARTO = 6;