// Catálogo de accesorios tal como los define el backend (POST /inventario/agregar).
// El emoji es un fallback visual mientras no haya arte propio para cada uno.
// nivelRequerido: nivel mínimo de gamificación para poder desbloquear el accesorio.
export const CATALOGO_ACCESORIOS = [
  { itemId: 'ninja', label: 'Ninja', emoji: '🥷', nivelRequerido: 1 },
  { itemId: 'robot', label: 'Robot', emoji: '🤖', nivelRequerido: 3 },
  { itemId: 'wizard', label: 'Mago', emoji: '🧙', nivelRequerido: 5 },
  { itemId: 'superhero', label: 'Superhéroe', emoji: '🦸', nivelRequerido: 7 },
  { itemId: 'pirate', label: 'Pirata', emoji: '🏴‍☠️', nivelRequerido: 9 },
  { itemId: 'princess', label: 'Princesa', emoji: '👸', nivelRequerido: 11 },
  { itemId: 'bunny', label: 'Bunny', emoji: '🐰', nivelRequerido: 13 },
  { itemId: 'halloween', label: 'Halloween', emoji: '🎃', nivelRequerido: 15 },
];