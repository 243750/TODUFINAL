'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { guardarCredencialesTemp } from '../storage';
import { ROUTES } from '../../../lib/routes';

export default function useRegistroPaso1() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleContinuar = useCallback((e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password || !confirmPassword) {
      setFormError('Completa todos los campos.');
      return;
    }
    if (password.length < 8) {
      setFormError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    guardarCredencialesTemp(email, password);
    router.push(ROUTES.registroCompletar);
  }, [email, password, confirmPassword, router]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    formError,
    handleContinuar,
  };
}
