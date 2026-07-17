import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

// Configuración de metadatos de la PWA
export const metadata = {
  title: "Todú - Panel de Control",
  description: "Tu gestor de tareas gamificado",
  manifest: '/manifest.json', // Vincula el manifest
};

// Next.js 15+/16 separó themeColor y viewport de "metadata" a su propio
// export "viewport" — de ahí el warning que viste en la terminal. No era un
// error, solo una convención que cambió; ya está en el lugar correcto.
export const viewport = {
  themeColor: '#150f27',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// MODIFICADO: Añadimos { children: React.ReactNode } para satisfacer a TypeScript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Meta tags para iOS/Apple PWA compatibility */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Todú" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}