'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';

export default function usePerfil() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();

  // Username
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState(null);

  const actualizarUsername = useCallback(async (username) => {
    setUsernameMsg(null);
    setUsernameLoading(true);
    try {
      const data = await api.put('/perfil/username', { username });
      updateUser({ username: data.user?.username || username });
      setUsernameMsg({ type: 'ok', text: 'Username actualizado.' });
    } catch (err) {
      setUsernameMsg({ type: 'error', text: err.message });
    } finally {
      setUsernameLoading(false);
    }
  }, [updateUser]);

  // Password
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const actualizarPassword = useCallback(async ({ passwordActual, passwordNuevo, passwordConfirmar }) => {
    setPasswordMsg(null);
    if (passwordNuevo !== passwordConfirmar) {
      setPasswordMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put('/perfil/password', { passwordActual, passwordNuevo });
      setPasswordMsg({ type: 'ok', text: 'Contraseña actualizada.' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message });
    } finally {
      setPasswordLoading(false);
    }
  }, []);

  // Eliminar cuenta
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(null);

  const eliminarCuenta = useCallback(async (password) => {
    setDeleteMsg(null);
    setDeleteLoading(true);
    try {
      await api.delete('/perfil', { body: { password } });
      logout();
      router.push(ROUTES.login);
    } catch (err) {
      setDeleteMsg(err.message);
      setDeleteLoading(false);
    }
  }, [logout, router]);

  return {
    user,
    usernameLoading,
    usernameMsg,
    actualizarUsername,
    passwordLoading,
    passwordMsg,
    actualizarPassword,
    deleteLoading,
    deleteMsg,
    eliminarCuenta,
  };
}