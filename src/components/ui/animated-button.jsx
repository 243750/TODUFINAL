'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * AnimatedButton
 * Adaptado de https://www.vengenceui.com (componente "animated-button")
 * a la paleta violeta de Todú. Diferencias respecto al original:
 * - El original usaba `bg-neutral-50 dark:bg-black` con Tailwind `dark:`
 *   para adaptarse a modo claro/oscuro. Todú siempre está en modo oscuro
 *   violeta, así que aquí el fondo/borde son fijos (gradiente violeta),
 *   sin variantes `dark:`.
 * - Se pasó de TypeScript (.tsx) a JavaScript (.jsx) para seguir la
 *   convención del resto de componentes del proyecto.
 * - Se usa `cn()` desde `src/lib/utils.js` (clsx + tailwind-merge) en vez
 *   del alias `@/lib/utils`, ya que el proyecto no usa el alias `@/` en
 *   ningún otro archivo.
 */
const AnimatedButton = ({
  children = 'Nueva tarea',
  className = '',
  as = 'button',
  ...rest
}) => {
  const Component = motion[as] || motion.button;

  return (
    <Component
      {...rest}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
      className={cn(
        'group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl relative overflow-hidden',
        'bg-gradient-to-tr from-[#6d28d9] to-[#a78bfa] border border-violet-400/30',
        'text-white font-black text-sm tracking-wider uppercase transition-colors',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300 disabled:pointer-events-none disabled:opacity-50',
        'shadow-[0_10px_30px_rgba(167,139,250,0.4)]',
        '[--shine:rgba(255,255,255,.66)]',
        className
      )}
    >
      {/* Texto (y cualquier ícono) con máscara de brillo que recorre de derecha a izquierda */}
      <motion.span
        className="tracking-wide flex items-center justify-center gap-2 h-full w-full relative z-10"
        style={{
          WebkitMaskImage:
            'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
          maskImage:
            'linear-gradient(-75deg, white calc(var(--mask-x) + 20%), transparent calc(var(--mask-x) + 30%), white calc(var(--mask-x) + 100%))',
        }}
        initial={{ '--mask-x': '100%' }}
        animate={{ '--mask-x': '-100%' }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
          repeatDelay: 1,
        }}
      >
        {children}
      </motion.span>

      {/* Brillo recorriendo el borde */}
      <motion.span
        className="block absolute inset-0 rounded-2xl p-px"
        style={{
          background:
            'linear-gradient(-75deg, transparent 30%, var(--shine) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
        }}
        initial={{ backgroundPosition: '100% 0', opacity: 0 }}
        animate={{ backgroundPosition: ['100% 0', '0% 0'], opacity: [0, 1, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </Component>
  );
};

export default AnimatedButton;