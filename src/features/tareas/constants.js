// `backendKey` es el enum que espera Manuel en `POST /tareas`
// ("easy" | "medium" | "hard", validado con Zod). Como el front tiene
// 4 niveles locales y el backend solo maneja 3, las dos dificultades
// más bajas (trivial y fácil) se mandan ambas como "easy".
export const DIFICULTADES = [
  { key: 'trivial', label: 'Trivial', xpValor: 10, backendKey: 'easy' },
  { key: 'facil', label: 'Fácil', xpValor: 25, backendKey: 'easy' },
  { key: 'intermedia', label: 'Intermedia', xpValor: 50, backendKey: 'medium' },
  { key: 'dificil', label: 'Difícil', xpValor: 100, backendKey: 'hard' },
];

// L=1 ... D=7, coincide con el `diasSemana` que espera el backend
// (1=lunes ... 7=domingo).
export const DIAS_SEMANA = [
  { numero: 1, letra: 'L', label: 'Lunes' },
  { numero: 2, letra: 'M', label: 'Martes' },
  { numero: 3, letra: 'M', label: 'Miércoles' },
  { numero: 4, letra: 'J', label: 'Jueves' },
  { numero: 5, letra: 'V', label: 'Viernes' },
  { numero: 6, letra: 'S', label: 'Sábado' },
  { numero: 7, letra: 'D', label: 'Domingo' },
];
