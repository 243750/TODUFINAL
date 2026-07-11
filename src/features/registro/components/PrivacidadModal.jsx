'use client';
import { X } from 'lucide-react';

export default function PrivacidadModal({ onClose, onAceptar }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1f1638] w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[75vh] overflow-hidden border border-white/10">
        <div className="px-6 pt-6 pb-4 flex justify-between items-center bg-[#1f1638] sticky top-0 border-b border-white/10">
          <h2 className="text-xl font-bold text-violet-400">Aviso de Privacidad de Todú</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={22} />
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-grow text-[14px] text-slate-400 space-y-5 pr-4 leading-relaxed text-justify">
          <div className="space-y-1">
            <p className="font-bold text-white">Identidad del Responsable</p>
            <p>El equipo de desarrollo de &quot;Todú&quot; (en adelante, &quot;El Responsable&quot;), con sede en Chiapas, México, en el marco de sus actividades académicas y de desarrollo de software, es responsable del uso y protección de sus datos personales, en estricto apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">Datos Personales que Recabamos</p>
            <p>Para llevar a cabo las finalidades descritas en el presente aviso, recabaremos los siguientes datos personales:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-slate-300">Datos de identificación y contacto:</strong> Nombre de usuario y correo electrónico.</li>
              <li><strong className="text-slate-300">Datos de uso y comportamiento:</strong> Historial de creación, cumplimiento y vencimiento de tareas, así como el progreso de experiencia (XP) y rachas dentro de la aplicación.</li>
              <li><strong className="text-slate-300">Datos de ubicación (Geolocalización):</strong> Coordenadas de latitud y longitud, las cuales se obtienen única y exclusivamente con su consentimiento expreso y explícito en el momento de uso.</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">Tratamiento de Datos de Menores de Edad</p>
            <p>Todú no está diseñado para, ni dirigido a, menores de 18 años. Por lo tanto, no recabamos, procesamos ni almacenamos intencionalmente datos personales ni de geolocalización de menores de edad. Si usted es padre, madre o tutor legal y tiene conocimiento de que un menor a su cargo nos ha proporcionado información personal, le solicitamos que nos contacte para proceder con la eliminación definitiva de dichos datos de nuestros servidores.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">Finalidades del Tratamiento de Datos</p>
            <p>Los datos personales que recabamos tienen como finalidad principal:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Crear y gestionar su perfil de usuario dentro del sistema.</li>
              <li>Alimentar el algoritmo de la máquina de estados que controla las animaciones, nivel de evolución y estado emocional del avatar virtual.</li>
              <li>Sugerir puntos de interés y zonas de descanso al finalizar la jornada, mediante el uso de interfaces de programación (APIs) de terceros.</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">Cláusula Especial sobre Geolocalización</p>
            <p>La información de geolocalización es procesada de manera efímera. Esto significa que las coordenadas se utilizan momentáneamente para realizar la consulta de lugares recomendados y no se almacenan en nuestras bases de datos, garantizando su privacidad y seguridad espacial.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-white">Derechos ARCO y Revocación de Consentimiento</p>
            <p>Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (Derechos ARCO) al tratamiento de sus datos personales. Podrá ejercer estos derechos, así como eliminar permanentemente su cuenta y el historial de tareas, directamente desde la sección &quot;Ajustes de Perfil&quot; dentro de la aplicación.</p>
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
