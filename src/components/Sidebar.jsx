'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ClipboardList, Bot, Compass, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const NAV_SECTIONS = [
  {
    label: null, // sin encabezado, son las pestañas principales
    items: [
      { href: '/tareas', label: 'Tareas', Icon: ClipboardList },
      { href: '/mi-todu', label: 'Mi Todú', Icon: Bot },
      { href: '/descubrir', label: 'Descubrir', Icon: Compass },
    ],
  },
  {
    label: 'Cuenta',
    items: [{ href: '/ajustes', label: 'Ajustes', Icon: Settings }],
  },
];

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full bg-[#1f1638] text-slate-200">
      {/* Perfil */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <div className="w-11 h-11 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-violet-300" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">
            {user?.username || 'Invitado'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Sin sesión'}</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className="mb-4">
            {section.label && (
              <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {section.label}
              </p>
            )}
            {section.items.map(({ href, label, Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-violet-300 bg-violet-500/10 border-r-2 border-violet-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Riel fijo en escritorio: siempre visible, no es un overlay */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-white/5 z-40">
        <SidebarContent />
      </aside>

      {/* Drawer en móvil: overlay + panel deslizable */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80%] shadow-2xl transition-transform duration-200 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent onNavigate={close} />
        </div>
      </div>
    </>
  );
}