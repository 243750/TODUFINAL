'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, Lock, Trash2, LogOut, HelpCircle, X, ShieldCheck, User
} from 'lucide-react';
import { useSidebar } from '../../../context/SidebarContext';
import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../lib/routes';
import usePerfil from '../../../features/perfil/hooks/usePerfil';
import Card from '../../../features/perfil/components/Card';
import { AVATAR_MAP, AVATARES_KEYS } from '../../../lib/avatarOptions';

const inputClass =
  'w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500/50 transition-colors disabled:opacity-40';

export default function AjustesPage() {
  const { open: openSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const {
    usernameLoading,
    usernameMsg,
    actualizarUsername,
    passwordLoading,
    passwordMsg,
    actualizarPassword,
    deleteLoading,
    deleteMsg,
    eliminarCuenta,
  } = usePerfil();

  const [username, setUsername] = useState(user?.username || '');

  const handleUsername = async (e) => {
    e.preventDefault();
    await actualizarUsername(username);
  };

  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNuevo, setPasswordNuevo] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');

  const handlePassword = async (e) => {
    e.preventDefault();
    await actualizarPassword({ passwordActual, passwordNuevo, passwordConfirmar });
    setPasswordActual('');
    setPasswordNuevo('');
    setPasswordConfirmar('');
  };

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    await eliminarCuenta(deletePassword);
  };

  const [avatarActivo, setAvatarActivo] = useState('ana');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAvatarActivo(localStorage.getItem('todu_avatar') || 'ana');
    }
  }, []);

  const handleSelectAvatar = (avKey) => {
    setAvatarActivo(avKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('todu_avatar', avKey);
      window.dispatchEvent(new Event('avatar_changed'));
    }
  };

  const isGoogleProvider = user?.authProvider === 'google';
  const ActiveAvatarIcon = AVATAR_MAP[avatarActivo] || User;

  return (
    <div className="min-h-screen bg-[#150f27] text-slate-200 font-sans pb-28">
      <header className="flex items-center justify-between p-6 lg:hidden">
        <button onClick={openSidebar} className="text-slate-400 hover:text-white transition-colors">
          <Menu className="w-7 h-7" />
        </button>
        <h1 className="text-sm font-black text-white uppercase tracking-widest">Ajustes</h1>
        <div className="w-7" />
      </header>

      <div className="hidden lg:flex items-start justify-between px-8 pt-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">Ajustes</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestiona tu perfil, seguridad y preferencias de la cuenta.
          </p>
        </div>
        <button
          onClick={() => setShowHelp(true)}
          className="text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 p-2.5 rounded-full border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.15)] flex-shrink-0"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

      <main className="max-w-md lg:max-w-3xl mx-auto px-6 pt-2 lg:pt-6 flex flex-col gap-5">
        <div className="flex items-center gap-4 bg-[#1f1638] border border-white/5 rounded-3xl p-5">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            <ActiveAvatarIcon className="w-14 h-14" />          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.username || 'Invitado'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <Card icon={User} title="Mi Avatar">
          <p className="text-xs text-slate-400 mb-4">Elige cómo quieres verte en Todú. Esto se reflejará en tu menú de navegación.</p>
          <div className="flex flex-wrap gap-3">
            {AVATARES_KEYS.map(avKey => {
              const IconComponent = AVATAR_MAP[avKey];
              return (
                <button
                  key={avKey}
                  type="button"
                  onClick={() => handleSelectAvatar(avKey)}
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all overflow-hidden ${                    avatarActivo === avKey 
                      ? 'bg-violet-500/30 border-2 border-violet-400 scale-110 shadow-[0_0_15px_rgba(139,92,246,0.5)] text-violet-300' 
                      : 'bg-black/30 border border-white/5 hover:bg-white/10 hover:scale-105 text-slate-400'
                  }`}
                >
                  <IconComponent className="w-14 h-14" />
                </button>
              );
            })}
          </div>
        </Card>

        <Card icon={User} title="Información de perfil">
          <form onSubmit={handleUsername} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Nuevo username"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={inputClass}
                  placeholder="correo@todu.app"
                  title="El correo no se puede cambiar por ahora"
                />
              </div>
            </div>
            {usernameMsg && (
              <p className={`text-xs font-semibold ${usernameMsg.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {usernameMsg.text}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={usernameLoading}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
              >
                {usernameLoading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </Card>

        {!isGoogleProvider && (
          <Card icon={ShieldCheck} title="Seguridad y contraseña">
            <form onSubmit={handlePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  className={inputClass}
                  placeholder="Contraseña actual"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordNuevo}
                    onChange={(e) => setPasswordNuevo(e.target.value)}
                    className={inputClass}
                    placeholder="Nueva contraseña"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    value={passwordConfirmar}
                    onChange={(e) => setPasswordConfirmar(e.target.value)}
                    className={inputClass}
                    placeholder="Repite la nueva contraseña"
                    required
                  />
                </div>
              </div>
              {passwordMsg && (
                <p className={`text-xs font-semibold ${passwordMsg.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {passwordMsg.text}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                >
                  {passwordLoading ? 'Guardando...' : 'Cambiar contraseña'}
                </button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-5">
          <Card icon={LogOut} title="Sesión">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Cierra tu sesión en este dispositivo. Tus datos siguen sincronizados en cualquier
              otro lugar donde hayas iniciado sesión.
            </p>
            <button
              onClick={() => {
                logout();
                router.push(ROUTES.login);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </Card>

          <Card icon={Trash2} title="Zona de peligro">
            {!confirmDelete ? (
              <>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
                </p>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold rounded-xl text-sm border border-rose-500/20 transition-colors"
                >
                  Eliminar mi cuenta
                </button>
              </>
            ) : (
              <form onSubmit={handleDelete} className="space-y-3">
                <p className="text-xs text-rose-300 leading-relaxed">
                  Esto borra tu cuenta y tu historial de tareas de forma permanente. Confirma tu
                  contraseña para continuar.
                </p>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className={inputClass}
                  placeholder="Tu contraseña"
                  required
                />
                {deleteMsg && <p className="text-xs font-semibold text-rose-400">{deleteMsg}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={deleteLoading}
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
                  >
                    {deleteLoading ? 'Eliminando...' : 'Sí, eliminar'}
                  </button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </main>

      {/* Modal de Ayuda */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
          <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)]">
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mb-6 border-b border-white/5 pb-6 pt-2">
              <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">Ajustes</h3>
              <p className="text-xs text-slate-400">Tu perfil, seguridad y cuenta</p>
            </div>
            <div className="space-y-4 text-sm text-slate-300">
              <p>
                Aquí puedes cambiar tu nombre de usuario, actualizar tu contraseña, cerrar sesión
                en este dispositivo, o eliminar tu cuenta de forma permanente.
              </p>
              <p>
                En <span className="text-white font-bold">Mi Avatar</span> puedes elegir entre 20 personajes — caras y criaturas de colores — para que te representen en el Sidebar y en tu perfil.
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl transition-colors text-sm tracking-wider uppercase"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}