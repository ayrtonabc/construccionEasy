import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { JobOffer } from '../../types/types';
import { Plus, Edit2, Trash2, Save, X, Image, ExternalLink } from 'lucide-react';

export default function JobManagement() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado para el formulario de creación/edición
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentJob, setCurrentJob] = useState<JobOffer | null>(null);
  
  // Estados para los campos del formulario
  const [title, setTitle] = useState<string>('');
  const [hourlyPay, setHourlyPay] = useState<string>('');
  const [benefits, setBenefits] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Cargar trabajos al montar el componente
  useEffect(() => {
    loadJobs();
  }, []);

  // Función para cargar ofertas de trabajo
  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error('Error al cargar ofertas de trabajo:', error.message);
      setError('No se pudieron cargar las ofertas de trabajo');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el formulario de creación
  const handleAddNew = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    resetForm();
  };

  // Función para abrir el formulario de edición
  const handleEdit = (job: JobOffer) => {
    setIsFormOpen(true);
    setIsEditing(true);
    setCurrentJob(job);
    
    // Llenar el formulario con los datos del trabajo
    setTitle(job.title);
    setHourlyPay(job.hourly_pay);
    setBenefits(job.benefits);
    setCity(job.city);
    setImageUrl(job.image_url);
    setWhatsappUrl(job.whatsapp_url);
    setIsActive(job.is_active);
  };

  // Función para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setTitle('');
    setHourlyPay('');
    setBenefits('');
    setCity('');
    setImageUrl('');
    setWhatsappUrl('');
    setIsActive(true);
    setImageFile(null);
    setCurrentJob(null);
  };

  // Función para manejar el cambio de archivo de imagen
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  // Función para guardar una oferta de trabajo (crear o actualizar)
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!title || !hourlyPay || !benefits || !city || !whatsappUrl) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let finalImageUrl = imageUrl;
      
      // Si hay un archivo de imagen, subirlo primero
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `job-images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        // Obtener la URL pública de la imagen
        const { data } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);
          
        finalImageUrl = data.publicUrl;
      }
      
      // Datos para crear/actualizar
      const jobData = {
        title,
        hourly_pay: hourlyPay,
        benefits,
        city,
        image_url: finalImageUrl,
        whatsapp_url: whatsappUrl,
        is_active: isActive,
        updated_at: new Date().toISOString()
      };
      
      if (isEditing && currentJob) {
        // Actualizar trabajo existente
        const { error: updateError } = await supabase
          .from('job_offers')
          .update(jobData)
          .eq('id', currentJob.id);
          
        if (updateError) throw updateError;
        
        setSuccess('Oferta de trabajo actualizada correctamente');
      } else {
        // Crear nuevo trabajo
        const { error: insertError } = await supabase
          .from('job_offers')
          .insert({
            ...jobData,
            created_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
        
        setSuccess('Oferta de trabajo creada correctamente');
      }
      
      // Recargar la lista de trabajos
      await loadJobs();
      
      // Cerrar el formulario
      handleCloseForm();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error al guardar oferta de trabajo:', error.message);
      setError(`Error al guardar oferta de trabajo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una oferta de trabajo
  const handleDelete = async (jobId: string) => {
    if (!confirm('¿Está seguro que desea eliminar esta oferta de trabajo?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('job_offers')
        .delete()
        .eq('id', jobId);
        
      if (error) throw error;
      
      // Recargar la lista de trabajos
      await loadJobs();
      
      setSuccess('Oferta de trabajo eliminada correctamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error al eliminar oferta de trabajo:', error.message);
      setError(`Error al eliminar oferta de trabajo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar el estado activo/inactivo de una oferta
  const handleToggleActive = async (job: JobOffer) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('job_offers')
        .update({ 
          is_active: !job.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);
        
      if (error) throw error;
      
      // Recargar la lista de trabajos
      await loadJobs();
      
      setSuccess(`Oferta de trabajo ${!job.is_active ? 'activada' : 'desactivada'} correctamente`);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error: any) {
      console.error('Error al cambiar estado de oferta de trabajo:', error.message);
      setError(`Error al cambiar estado de oferta de trabajo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar estado de carga
  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Cargando ofertas de trabajo...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Ofertas de Trabajo</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nueva Oferta
        </button>
      </div>

      {/* Mensajes de error y éxito */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de creación/edición */}
      {isFormOpen && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Editar Oferta de Trabajo' : 'Nueva Oferta de Trabajo'}
            </h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Operario de Producción"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sueldo por Hora *
                </label>
                <input
                  type="text"
                  value={hourlyPay}
                  onChange={(e) => setHourlyPay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 20-25 PLN/hora"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Varsovia"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de WhatsApp *
                </label>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://wa.me/48123456789"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beneficios *
                </label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Alojamiento incluido, transporte, seguro médico..."
                  rows={3}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-500">o</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="URL de la imagen"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Sube una imagen o proporciona una URL. Si subes un archivo, se ignorará la URL.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Oferta activa</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Guardar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de ofertas de trabajo */}
      {jobs.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oferta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {job.image_url ? (
                        <img
                          src={job.image_url}
                          alt={job.title}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <Image className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{job.hourly_pay}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{job.benefits}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {job.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(job)}
                        className={`p-1 rounded-full ${job.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={job.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {job.is_active ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                      <a
                        href={job.whatsapp_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-600 hover:text-blue-900 rounded-full"
                        title="Abrir chat de WhatsApp"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 rounded-full"
                        title="Editar"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1 text-red-600 hover:text-red-900 rounded-full"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">No hay ofertas de trabajo disponibles.</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            Crear primera oferta
          </button>
        </div>
      )}
    </div>
  );
}

// Componente CheckCircle para mensajes de éxito
const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Componente AlertCircle para mensajes de error
const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
