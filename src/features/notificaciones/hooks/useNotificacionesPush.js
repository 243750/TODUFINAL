'use client';
import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../../lib/api';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// El navegador pide la llave VAPID como Uint8Array, pero Manuel la va
// a dar en base64url (el formato normal de una llave pública VAPID) —
// esto la convierte, es el snippet estándar que recomienda la doc de
// Web Push (no hay nada "de Todú" específico aquí).
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function useNotificacionesPush() {
  // IMPORTANTE: arrancan en el mismo valor que tendría el servidor
  // (false / 'default') y solo se actualizan dentro de un useEffect —
  // que corre únicamente en el navegador, después de la hidratación.
  // Calcularlos directo en el cuerpo del componente (leyendo `window`
  // o `navigator`) causaba un mismatch de hidratación: el servidor
  // siempre renderiza "no soportado" (no tiene window), pero el
  // navegador podía renderizar el switch real desde el primer render,
  // antes de que React terminara de hidratar.
  const [soportado, setSoportado] = useState(false);
  // 'unsupported' | 'default' | 'granted' | 'denied'
  const [permiso, setPermiso] = useState('default');
  const [suscrito, setSuscrito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const esSoportado =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      !!VAPID_PUBLIC_KEY;

    setSoportado(esSoportado);

    if (!esSoportado) {
      setPermiso('unsupported');
      return;
    }
    setPermiso(Notification.permission);

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setSuscrito(true);
      });
    });
  }, []);

  const activar = useCallback(async () => {
    if (!soportado) {
      setError('Tu navegador no soporta notificaciones push, o falta configurar la llave VAPID.');
      return false;
    }
    setCargando(true);
    setError(null);
    try {
      const registro = await navigator.serviceWorker.register('/sw.js');
      const permisoResultado = await Notification.requestPermission();
      setPermiso(permisoResultado);
      if (permisoResultado !== 'granted') {
        setError('No diste permiso de notificaciones — puedes activarlo luego desde los ajustes del navegador.');
        return false;
      }

      const subscripcion = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const subJson = subscripcion.toJSON();
      await apiFetch('/tareas/notificaciones/suscribir', {
        method: 'POST',
        body: { endpoint: subJson.endpoint, keys: subJson.keys },
      });

      setSuscrito(true);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo activar las notificaciones.');
      return false;
    } finally {
      setCargando(false);
    }
  }, [soportado]);

  const desactivar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const registro = await navigator.serviceWorker.getRegistration();
      const sub = await registro?.pushManager.getSubscription();
      if (sub) {
        await apiFetch('/tareas/notificaciones/suscribir', {
          method: 'DELETE',
          body: { endpoint: sub.endpoint },
        });
        await sub.unsubscribe();
      }
      setSuscrito(false);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo desactivar las notificaciones.');
      return false;
    } finally {
      setCargando(false);
    }
  }, []);

  return { soportado, permiso, suscrito, cargando, error, activar, desactivar };
}