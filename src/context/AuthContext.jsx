'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api, setToken, getStoredUser, setStoredUser, ApiError } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" = todavía no sabemos si hay sesión guardada (evita parpadeos
  // tipo "no hay sesión" antes de leer el localStorage).
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lectura intencional de localStorage tras el primer render: evita un
    // hydration mismatch de SSR (el servidor nunca tiene localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password }, { auth: false });
    setToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ username, email, password, fechaNacimiento }) => {
    const data = await api.post(
      '/auth/register',
      { username, email, password, fechaNacimiento },
      { auth: false }
    );
    setToken(data.token);
    setStoredUser(data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  // Actualiza el usuario en memoria (para que la UI reaccione al instante)
  // y en localStorage (para que sobreviva a un refresh), en un solo paso.
  const updateUser = useCallback((partialUpdate) => {
    setUser((prev) => {
      const updated = { ...prev, ...partialUpdate };
      setStoredUser(updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}

export { ApiError };