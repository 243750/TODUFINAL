import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combina clases condicionales (clsx) y resuelve conflictos de utilidades
// de Tailwind (twMerge) — es la convención estándar de shadcn/ui. La usa
// AnimatedButton para poder aceptar className extra sin pisar mal las
// clases base.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}