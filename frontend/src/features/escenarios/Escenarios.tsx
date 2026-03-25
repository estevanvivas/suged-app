import { useEffect, useState } from 'react';
import { supabase } from '../../app/supabase';
import { useAuth } from '../../app/AuthContext';
import { MapPin, Users, DollarSign, X, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { fetchAPI } from '../../utils/api';

interface Escenario {
  id: string;
  nombre: string;
  descripcion: string;
  aforo: number;
  tarifa_hora: number;
  imagen_url: string;
  estado: 'ACTIVO' | 'MANTENIMIENTO' | 'INACTIVO';
}

export default function Escenarios() {
  const { perfil, session } = useAuth();
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [cargando, setCargando] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [escenarioEditando, setEscenarioEditando] = useState<Escenario | null>(null);
  const [guardando, setGuardando] = useState(false);

  const obtenerEscenarios = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('escenarios')
      .select('*')
      .order('creado_en', { ascending: false });

    if (!error && data) setEscenarios(data);
    setCargando(false);
  };

  useEffect(() => {
    obtenerEscenarios();
  }, []);

  const abrirModalCrear = () => {
    setEscenarioEditando(null);
    setIsModalOpen(true);
  };

  const abrirModalEditar = (escenario: Escenario) => {
    setEscenarioEditando(escenario);
    setIsModalOpen(true);
  };

  const manejarGuardarEscenario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) return;

    setGuardando(true);
    const formData = new FormData(e.currentTarget);
    let imagen_url_final = escenarioEditando?.imagen_url || null;

    try {
      const archivoImagen = formData.get('imagen_archivo') as File;

      if (archivoImagen && archivoImagen.size > 0) {
        const fileExt = archivoImagen.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('escenarios')
          .upload(fileName, archivoImagen);

        if (uploadError) {
          throw new Error(`Error al subir la foto: ${uploadError.message}`);
        }

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

      const endpoint = escenarioEditando
        ? `/api/escenarios/${escenarioEditando.id}`
        : '/api/escenarios';

      const method = escenarioEditando ? 'PUT' : 'POST';

      const res = await fetchAPI(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEscenario),
      });

      if (!res.ok) throw new Error((await res.json()).error);

      setIsModalOpen(false);
      obtenerEscenarios();
      toast.success(
        escenarioEditando
          ? 'Escenario actualizado con éxito'
          : 'Escenario registrado con éxito'
      );
    } catch (error: any) {
      toast.error('Error al guardar el escenario', {
        description: error.message,
      });
    } finally {
      setGuardando(false);
    }
  };

  const manejarEliminar = async (id: string) => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el escenario y todas sus dependencias. No se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'rounded-2xl' },
    });

    if (!confirmacion.isConfirmed) return;

    try {
      const res = await fetchAPI(`/api/escenarios/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error((await res.json()).error);

      obtenerEscenarios();
      toast.success('Escenario eliminado correctamente');
    } catch (error: any) {
      toast.error('Error al eliminar', {
        description: error.message,
      });
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[80vh] relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 pb-4 md:pb-6 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Escenarios Deportivos
          </h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Gestiona los espacios de la UPTC
          </p>
        </div>

        {perfil?.rol === 'ADMIN' && (
          <button
            onClick={abrirModalCrear}
            className="w-full sm:w-auto bg-[#FFCC29] text-[#1A1A1A] px-5 py-3 md:py-2.5 rounded-lg font-bold hover:bg-[#e6b825] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Nuevo Escenario
          </button>
        )}
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-40 text-slate-500 font-medium animate-pulse">
          Cargando...
        </div>
      ) : escenarios.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <MapPin className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-medium text-[#1A1A1A]">
            No hay escenarios
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {escenarios.map((escenario) => (
            <div
              key={escenario.id}
              className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col group"
            >
              <div className="h-40 md:h-48 bg-slate-100 w-full relative overflow-hidden">
                {escenario.imagen_url ? (
                  <img
                    src={escenario.imagen_url}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400">
                    Sin imagen
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] md:text-xs font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide ${
                      escenario.estado === 'ACTIVO'
                        ? 'bg-green-500 text-white'
                        : escenario.estado === 'MANTENIMIENTO'
                        ? 'bg-[#FFCC29] text-[#1A1A1A]'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {escenario.estado}
                  </span>
                </div>
              </div>

              <div className="p-4 md:p-5 flex-1 flex flex-col">
                <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-1">
                  {escenario.nombre}
                </h3>

                <p className="text-slate-600 text-xs md:text-sm mb-4 line-clamp-2 flex-1">
                  {escenario.descripcion}
                </p>

                <div className="flex flex-col gap-3 text-xs md:text-sm text-slate-700 mt-auto border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      Aforo:{' '}
                      <strong className="text-[#1A1A1A]">{escenario.aforo}</strong>
                    </span>

                    <span className="flex items-center gap-2">
                      <DollarSign size={16} className="text-slate-400" />
                      <strong className="text-[#1A1A1A]">
                        ${escenario.tarifa_hora}/hr
                      </strong>
                    </span>
                  </div>

                  {perfil?.rol === 'ADMIN' && (
                    <div className="flex items-center justify-end mt-2 pt-3 border-t border-slate-50 gap-1">
                      <button
                        onClick={() => abrirModalEditar(escenario)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => manejarEliminar(escenario.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-red-600 rounded-md transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100 bg-slate-50 shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-[#1A1A1A]">
                {escenarioEditando ? 'Editar Escenario' : 'Registrar Escenario'}
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
                  defaultValue={escenarioEditando?.nombre}
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
                  defaultValue={escenarioEditando?.descripcion}
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
                    defaultValue={escenarioEditando?.aforo || 0}
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
                    defaultValue={escenarioEditando?.tarifa_hora || 0}
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
                    defaultValue={escenarioEditando?.estado || 'ACTIVO'}
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