// Service Worker de Todú — solo maneja notificaciones push.
// No cachea nada (no es un service worker de "modo offline"); su única
// tarea es recibir el push que manda el backend (task-service ->
// PushNotifier.ts, vía VAPID) y mostrarlo como notificación del sistema.

self.addEventListener('install', () => {
  // Activa esta versión de inmediato, sin esperar a que se cierren
  // las pestañas viejas.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: 'Todú', body: event.data.text() };
  }

  const titulo = payload.title || 'Todú';
  const opciones = {
    body: payload.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    // El backend puede mandar una url a dónde llevar al usuario al
    // tocar la notificación (ej. directo a /tareas). Si no manda nada,
    // cae a /tareas por default.
    data: { url: payload.url || '/tareas' },
  };

  event.waitUntil(self.registration.showNotification(titulo, opciones));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/tareas';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const cliente of clientList) {
        if (cliente.url.includes(url) && 'focus' in cliente) {
          return cliente.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});