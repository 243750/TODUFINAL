// Centraliza el acceso a sessionStorage para el wizard de registro (2 pasos).
// Evita repetir claves mágicas y llamadas crudas a window.sessionStorage
// en cada página del flujo.

const KEY_EMAIL = 'todu_registro_email';
const KEY_PASSWORD = 'todu_registro_password';

export function guardarCredencialesTemp(email, password) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(KEY_EMAIL, email);
  window.sessionStorage.setItem(KEY_PASSWORD, password);
}

export function leerCredencialesTemp() {
  if (typeof window === 'undefined') return { email: null, password: null };
  return {
    email: window.sessionStorage.getItem(KEY_EMAIL),
    password: window.sessionStorage.getItem(KEY_PASSWORD),
  };
}

export function limpiarCredencialesTemp() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(KEY_EMAIL);
  window.sessionStorage.removeItem(KEY_PASSWORD);
}

export function hayCredencialesTemp() {
  if (typeof window === 'undefined') return false;
  return !!window.sessionStorage.getItem(KEY_EMAIL);
}
