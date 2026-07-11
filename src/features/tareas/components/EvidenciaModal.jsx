'use client';
import { useState } from 'react';
import { X, Camera } from 'lucide-react';

export default function EvidenciaModal({ tarea, onClose, onSuccess, subirEvidencia }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubir = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await subirEvidencia(tarea.id, file);
      setResultado(data);
      if (data.validacion?.approved) {
        onSuccess(data.tarea);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#150f27]/95 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div className="bg-[#1f1638] border border-violet-500/30 rounded-[2rem] p-6 w-full max-w-sm relative shadow-[0_0_40px_rgba(139,92,246,0.15)]">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-black text-white mb-1">Subir evidencia</h3>
        <p className="text-xs text-slate-400 mb-6 truncate">{tarea.titulo}</p>

        {preview ? (
          <div className="relative mb-4">
            <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-2xl border border-white/10" />
            <button
              onClick={() => { setFile(null); setPreview(null); setResultado(null); }}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-violet-500/30 rounded-2xl cursor-pointer hover:border-violet-500/60 transition-colors mb-4">
            <Camera className="w-10 h-10 text-violet-400 mb-2" />
            <span className="text-sm text-slate-400">Toca para seleccionar foto</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
          </label>
        )}

        {resultado && (
          <div className={`rounded-2xl p-4 mb-4 text-sm font-semibold ${
            resultado.validacion?.approved
              ? 'bg-green-500/10 border border-green-500/20 text-green-400'
              : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
          }`}>
            {resultado.validacion?.approved ? '✅' : '❌'} {resultado.mensaje}
            {resultado.validacion?.reason && (
              <p className="text-xs font-normal mt-1 opacity-80">{resultado.validacion.reason}</p>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-4">{error}</p>
        )}

        <button
          onClick={handleSubir}
          disabled={!file || loading || !!resultado?.validacion?.approved}
          className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black rounded-2xl transition-colors text-sm tracking-wider uppercase"
        >
          {loading ? 'Analizando con IA...' : 'Verificar evidencia'}
        </button>
      </div>
    </div>
  );
}
