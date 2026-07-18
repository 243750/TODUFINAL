'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ClipboardList, Bot, Compass, Settings, LogOut, 
  User, Rocket, Zap, Flame, Sparkles, Ghost, Cpu, Gamepad2, Skull
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import useGamificacion from '../features/gamificacion/hooks/useGamificacion';

const NAV_SECTIONS = [
  {
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

const AVATAR_MAP = {
  user: User,
  bot: Bot,
  rocket: Rocket,
  zap: Zap,
  flame: Flame,
  sparkles: Sparkles,
  ghost: Ghost,
  cpu: Cpu,
  gamepad: Gamepad2,
  skull: Skull
};

function SidebarContent({ onNavigate }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [avatarKey, setAvatarKey] = useState('user');

  const { progreso } = useGamificacion();
  const { nivel, xpActual, xpDisponible } = progreso || {};

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAvatarKey(localStorage.getItem('todu_avatar') || 'user');
      const handleAvatar = () => setAvatarKey(localStorage.getItem('todu_avatar') || 'user');
      window.addEventListener('avatar_changed', handleAvatar);
      return () => window.removeEventListener('avatar_changed', handleAvatar);
    }
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate?.();
    router.push('/login');
  };

  const ActiveAvatarIcon = AVATAR_MAP[avatarKey] || User;

  return (
    <div className="flex flex-col h-full bg-[#1f1638] text-slate-200">
      <div className="flex flex-col p-6 border-b border-white/5 gap-5">
        
        {/* ENLACE DIRECTO A AJUSTES CON EL NUEVO AVATAR */}
        <Link href="/ajustes" onClick={onNavigate} className="flex items-center gap-3 p-2 -mx-2 rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 shadow-inner">
            <ActiveAvatarIcon className="w-5 h-5 text-violet-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">
              {user?.username || 'Invitado'}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || 'Sin sesión'}</p>
          </div>
        </Link>

        {/* TARJETA DE PROGRESO */}
        {user && (
          <div className="bg-[#2a1f4c]/50 rounded-xl p-3 border border-violet-500/20 shadow-inner">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[10px] text-violet-300/80 font-bold uppercase tracking-wider">Nivel Actual</p>
                <p className="text-lg font-black text-white leading-none mt-1">{nivel || 1}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-violet-300/80 font-bold uppercase tracking-wider">XP Total</p>
                <p className="text-xs font-bold text-violet-300 mt-1">{xpActual || 0}</p>
              </div>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-violet-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${((xpActual || 0) % 1000) / 10}%` }}></div>
            </div>
            <div className="bg-black/30 rounded-lg p-2.5 flex items-center justify-between border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-base">🪙</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Cartera</span>
              </div>
              <span className="text-sm font-black text-amber-400">{xpDisponible || 0} XP</span>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i} className="mb-4">
            {section.label && <p className="px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{section.label}</p>}
            {section.items.map(({ href, label, Icon }) => {
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link key={href} href={href} onClick={onNavigate} className={`flex items-center gap-3 px-6 py-3 text-sm font-semibold transition-colors ${isActive ? 'text-violet-300 bg-violet-500/10 border-r-2 border-violet-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors">
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
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-white/5 z-40">
        <SidebarContent />
      </aside>
      <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
        <div className={`absolute inset-y-0 left-0 w-72 max-w-[80%] shadow-2xl transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent onNavigate={close} />
        </div>
      </div>
    </>
  );
}