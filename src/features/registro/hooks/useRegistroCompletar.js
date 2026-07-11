'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';
import { leerCredencialesTemp, limpiarCredencialesTemp, hayCredencialesTemp } from '../storage';

export default function useRegistroCompletar() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fechaNacimiento: '',
    aceptaTerminosYPrivacidad: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorServer, setErrorServer] = useState('');
  const [success, setSuccess] = useState(false);

  // Si alguien llega aquí directo (sin pasar por /registro), no tenemos
  // el email/password guardados — lo regresamos al paso 1.
  useEffect(() => {
    if (!hayCredencialesTemp()) {
      router.replace(ROUTES.registro);
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrorServer((prev) => (prev ? '' : prev));
  }, []);

  const aceptarTerminos = useCallback(() => {
    setFormData((prev) => ({ ...prev, aceptaTerminosYPrivacidad: true }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.aceptaTerminosYPrivacidad) return;
    if (formData.username.trim().length < 2) {
      setErrorServer('El nombre de usuario debe tener al menos 2 caracteres.');
      return;
    }
    if (!formData.fechaNacimiento) {
      setErrorServer('Ingresa tu fecha de nacimiento.');
      return;
    }

    const { email, password } = leerCredencialesTemp();
    if (!email || !password) {
      router.replace(ROUTES.registro);
      return;
    }

    setLoading(true);
    setErrorServer('');

    try {
      await register({
        username: formData.username.trim(),
        email,
        password,
        fechaNacimiento: formData.fechaNacimiento,
      });

      limpiarCredencialesTemp();
      setSuccess(true);
      router.push(ROUTES.tareas);
    } catch (err) {
      // El backend responde 403 con "Debes ser mayor de 18 años para registrarte"
      // cuando la fecha de nacimiento no cumple el filtro de edad.
      setErrorServer(err.message || 'No se pudo conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  }, [formData, register, router]);

  return {
    formData,
    loading,
    errorServer,
    success,
    handleChange,
    handleSubmit,
    aceptarTerminos,
  };
}
