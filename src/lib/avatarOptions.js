import {
  AvatarAna, AvatarZola, AvatarKai, AvatarMia, AvatarSam, AvatarRex,
  AvatarTheo, AvatarLuna, AvatarNico, AvatarIvan, AvatarCoco, AvatarDiego,
  AvatarRobot1, AvatarRobot2, AvatarGato, AvatarPanda, AvatarBuho,
  AvatarConejo, AvatarUnicornio, AvatarPinguino,
} from './avatarCharacters';

// Fuente única del mapa de avatares — antes estaba duplicado idéntico
// en Sidebar.jsx y ajustes/page.js; con dos copias, un ajuste en un
// lado y no en el otro los desincroniza (el mismo tipo de problema que
// tuvimos con catalogo.js/EscenaCuartoTodu.jsx). Ambos archivos ahora
// importan esto en vez de definir su propia copia.
//
// Cada avatar ya trae su propio color de fondo (ver avatarCharacters.jsx),
// a diferencia de los íconos de Lucide de antes que eran monocromo.
export const AVATAR_MAP = {
  ana: AvatarAna,
  zola: AvatarZola,
  kai: AvatarKai,
  mia: AvatarMia,
  sam: AvatarSam,
  rex: AvatarRex,
  theo: AvatarTheo,
  luna: AvatarLuna,
  nico: AvatarNico,
  ivan: AvatarIvan,
  coco: AvatarCoco,
  diego: AvatarDiego,
  robot1: AvatarRobot1,
  robot2: AvatarRobot2,
  gato: AvatarGato,
  panda: AvatarPanda,
  buho: AvatarBuho,
  conejo: AvatarConejo,
  unicornio: AvatarUnicornio,
  pinguino: AvatarPinguino,
};

export const AVATARES_KEYS = Object.keys(AVATAR_MAP);