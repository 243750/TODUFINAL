export default function manifest() {
  return {
    name: 'Todú - Gestión Gamificada',
    short_name: 'Todú',
    description: 'PWA de gestión de tiempo y mitigación de procrastinación',
    start_url: '/tareas', // MODIFICADO: Redirige a tareas en vez de un dashboard inexistente
    display: 'standalone',
    background_color: '#150f27', // Color de fondo de la app
    theme_color: '#150f27', // Color de la barra de estado superior
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // Deberás agregar íconos .png más grandes (192x192, 512x512) en /public para producción
    ],
  }
}