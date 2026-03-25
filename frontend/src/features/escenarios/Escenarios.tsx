import { useState } from 'react';
import { supabase } from '../../app/supabase';
import { useAuth } from '../../app/AuthContext';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchAPI } from '../../utils/api';

export default function CrearEscenario() {
  const { perfil, session } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const abrirModalCrear = () => {
    setIsModalOpen(true);
  };

  const manejarGuardarEscenario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    setGuardando(true);
    const formData = new FormData(e.currentTarget);
    let imagen_url_final = null;

    try {
      const archivoImagen = formData.get('imagen_archivo') as File;

      if (archivoImagen && archivoImagen.size > 0) {
        const fileExt = archivoImagen.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('escenarios')
          .upload(fileName, archivoImagen);

        if (uploadError) throw new Error(`Error al subir la foto: ${uploadError.message}`);

        const {
          data: { publicUrl },
        } = supabase.storage.from('escenarios').getPublicUrl(fileName);

        imagen_url_final = publicUrl;
      }

      const datosEscenario = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        aforo: parseInt(formData.get('aforo') as string) || 0,
        tarifa_hora: parseInt(formData.get('tarifa_hora') as string) || 0,
        estado: formData.get('estado'),
        imagen_url: imagen_url_final,
      };

      const res = await fetchAPI('/api/escenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEscenario),
      });

      if (!res.ok) throw new Error((await res.json()).error);

      setIsModalOpen(false);
      toast.success('Escenario registrado con éxito');
    } catch (error: any) {
      toast.error('Error al guardar el escenario', {
        description: error.message,
      });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      {perfil?.rol === 'ADMIN' && (
        <button
          onClick={abrirModalCrear}
          className="bg-[#FFCC29] text-[#1A1A1A] px-5 py-3 rounded-lg font-bold hover:bg-[#e6b825] transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Plus size={20} /> Nuevo Escenario
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-[#1A1A1A]">
                Registrar Escenario
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-[#1A1A1A] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form
              onSubmit={manejarGuardarEscenario}
              className="p-4 md:p-6 overflow-y-auto space-y-4 flex-1"
            >
              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                  Nombre *
                </label>
                <input
                  required
                  name="nombre"
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#FFCC29]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#FFCC29] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                    Aforo *
                  </label>
                  <input
                    required
                    name="aforo"
                    type="number"
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#FFCC29]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                    Tarifa/Hora *
                  </label>
                  <input
                    required
                    name="tarifa_hora"
                    type="number"
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#FFCC29]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                    Estado
                  </label>
                  <select
                    name="estado"
                    defaultValue="ACTIVO"
                    className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-[#FFCC29] bg-white"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                    <option value="INACTIVO">Inactivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#1A1A1A] mb-1.5">
                    Foto del Escenario
                  </label>
                  <input
                    name="imagen_archivo"
                    type="file"
                    accept="image/*"
                    className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:border-[#FFCC29] bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-bold file:bg-[#FFCC29]/20 file:text-[#1A1A1A] hover:file:bg-[#FFCC29]/30 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="bg-[#FFCC29] text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold hover:bg-[#e6b825]"
                >
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}