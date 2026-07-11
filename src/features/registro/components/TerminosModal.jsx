'use client';
import { X } from 'lucide-react';

export default function TerminosModal({ onClose, onAceptar }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1f1638] w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden border border-white/10">
        <div className="px-6 pt-6 pb-4 flex justify-between items-center bg-[#1f1638] sticky top-0 border-b border-white/10">
          <h2 className="text-xl font-bold text-violet-400">Términos y Condiciones de Uso</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-grow text-[14px] text-slate-400 space-y-5 pr-4 leading-relaxed text-justify">
          <div className="space-y-1">
            <p className="font-bold text-white">1. Aceptación de los Términos</p>
            <p>Al crear una cuenta y utilizar la aplicación &quot;Todú&quot; (en adelante, &quot;El Servicio&quot;), usted acepta estar sujeto a los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de los mismos, no deberá utilizar la aplicación.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">2. Restricción de Edad</p>
            <p>El Servicio está estrictamente dirigido a personas mayores de 18 años. Al crear una cuenta, aceptar estos Términos y Condiciones y utilizar la aplicación, usted declara y garantiza que tiene al menos 18 años de edad y que posee la capacidad legal para celebrar este contrato. Si determinamos que una cuenta pertenece a un menor de edad, nos reservamos el derecho de suspender o eliminar dicha cuenta y todo su historial de datos de forma inmediata y sin previo aviso.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">3. Naturaleza del Servicio</p>
            <p>Todú es una herramienta digital de gestión de tiempo y gamificación diseñada para ayudar a mitigar la procrastinación. El Servicio se proporciona con fines de productividad personal y de ninguna manera sustituye el tratamiento, diagnóstico o asesoramiento médico o psicológico profesional para trastornos de atención, ansiedad u otras condiciones de salud mental.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">4. Propiedad Intelectual</p>
            <p>Todo el contenido, diseño visual, animaciones del avatar interactivo, código fuente, logotipos y mecánicas de evolución (incluyendo la lógica de experiencia e inventario) son propiedad exclusiva de los desarrolladores de Todú. Se otorga al usuario una licencia personal, limitada, no transferible y revocable para utilizar la aplicación strictly para fines personales y no comerciales.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">5. Reglas de Uso y Conducta (Fair Use)</p>
            <p>El usuario se compromete a utilizar la aplicación de manera legítima. Queda estrictamente prohibido:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Realizar ingeniería inversa, descompilar o modificar el código del cliente o servidor.</li>
              <li>Manipular las peticiones de red (API) o explotar vulnerabilidades técnicas con el fin de alterar artificialmente las estadísticas de experiencia (XP), eludir la pérdida del sistema de rachas o desbloquear accesorios del inventario sin cumplir los requisitos de la aplicación.</li>
            </ul>
            <p className="pt-2 font-medium text-rose-400">Cualquier violación a esta cláusula resultará en la suspensión o eliminación inmediata y permanente de la cuenta del usuario sin previo aviso.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">6. Limitación de Responsabilidad</p>
            <p>El Servicio se proporciona &quot;tal cual&quot; y &quot;según disponibilidad&quot;. El equipo de desarrollo no garantiza que la aplicación esté libre de interrupciones o errores. No nos hacemos responsables por la pérdida temporal o permanente de datos (historial de tareas o rachas) ocasionada por fallas en la infraestructura de la nube, mantenimientos del servidor o problemas de conectividad en el dispositivo del usuario.</p>
          </div>
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end bg-black/20">
          <button
            type="button"
            onClick={onAceptar}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
