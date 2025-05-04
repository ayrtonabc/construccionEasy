import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Edit, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { JobOffer } from '../../types/types';

export default function JobOffersManagement() {
  // Estados para la lista de ofertas de trabajo
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el formulario de creación/edición
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<JobOffer | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    hourly_pay: '',
    benefits: '',
    city: '',
    image_url: '',
    whatsapp_url: '',
    is_active: true
  });
  
  // Estado para mensajes de error/éxito
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Cargar ofertas de trabajo al montar el componente
  useEffect(() => {
    fetchJobOffers();
  }, []);
  
  // Función para cargar ofertas de trabajo
  const fetchJobOffers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setJobOffers(data || []);
    } catch (error) {
      console.error('Error al cargar ofertas de trabajo:', error);
      setMessage({ text: 'Error al cargar ofertas de trabajo', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Filtrar ofertas por término de búsqueda
  const filteredOffers = jobOffers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Iniciar creación de nueva oferta
  const startCreating = () => {
    setFormData({
      title: '',
      hourly_pay: '',
      benefits: '',
      city: '',
      image_url: '',
      whatsapp_url: '',
      is_active: true
    });
    setIsCreating(true);
    setIsEditing(false);
  };
  
  // Iniciar edición de oferta existente
  const startEditing = (offer: JobOffer) => {
    setCurrentOffer(offer);
    setFormData({
      title: offer.title,
      hourly_pay: offer.hourly_pay,
      benefits: offer.benefits,
      city: offer.city,
      image_url: offer.image_url,
      whatsapp_url: offer.whatsapp_url,
      is_active: offer.is_active
    });
    setIsEditing(true);
    setIsCreating(false);
  };
  
  // Cancelar creación/edición
  const cancelForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentOffer(null);
    setMessage({ text: '', type: '' });
  };
  
  // Validar formulario
  const validateForm = () => {
    if (!formData.title.trim()) {
      setMessage({ text: 'El título es obligatorio', type: 'error' });
      return false;
    }
    if (!formData.hourly_pay.trim()) {
      setMessage({ text: 'El pago por hora es obligatorio', type: 'error' });
      return false;
    }
    if (!formData.city.trim()) {
      setMessage({ text: 'La ciudad es obligatoria', type: 'error' });
      return false;
    }
    if (!formData.image_url.trim()) {
      setMessage({ text: 'La URL de la imagen es obligatoria', type: 'error' });
      return false;
    }
    if (!formData.whatsapp_url.trim()) {
      setMessage({ text: 'La URL de WhatsApp es obligatoria', type: 'error' });
      return false;
    }
    return true;
  };
  
  // Guardar nueva oferta
  const createJobOffer = async () => {
    if (!validateForm()) return;
    
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .insert([
          {
            title: formData.title,
            hourly_pay: formData.hourly_pay,
            benefits: formData.benefits,
            city: formData.city,
            image_url: formData.image_url,
            whatsapp_url: formData.whatsapp_url,
            is_active: formData.is_active
          }
        ])
        .select();
      
      if (error) throw error;
      
      setJobOffers([...(data || []), ...jobOffers]);
      setMessage({ text: 'Oferta de trabajo creada con éxito', type: 'success' });
      setIsCreating(false);
      fetchJobOffers(); // Recargar para obtener los IDs actualizados
    } catch (error) {
      console.error('Error al crear oferta de trabajo:', error);
      setMessage({ text: 'Error al crear oferta de trabajo', type: 'error' });
    }
  };
  
  // Actualizar oferta existente
  const updateJobOffer = async () => {
    if (!validateForm() || !currentOffer) return;
    
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .update({
          title: formData.title,
          hourly_pay: formData.hourly_pay,
          benefits: formData.benefits,
          city: formData.city,
          image_url: formData.image_url,
          whatsapp_url: formData.whatsapp_url,
          is_active: formData.is_active
        })
        .eq('id', currentOffer.id)
        .select();
      
      if (error) throw error;
      
      setJobOffers(jobOffers.map(offer => 
        offer.id === currentOffer.id ? { ...offer, ...data[0] } : offer
      ));
      setMessage({ text: 'Oferta de trabajo actualizada con éxito', type: 'success' });
      setIsEditing(false);
      setCurrentOffer(null);
    } catch (error) {
      console.error('Error al actualizar oferta de trabajo:', error);
      setMessage({ text: 'Error al actualizar oferta de trabajo', type: 'error' });
    }
  };
  
  // Eliminar oferta
  const deleteJobOffer = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar esta oferta de trabajo?')) return;
    
    try {
      const { error } = await supabase
        .from('job_offers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setJobOffers(jobOffers.filter(offer => offer.id !== id));
      setMessage({ text: 'Oferta de trabajo eliminada con éxito', type: 'success' });
    } catch (error) {
      console.error('Error al eliminar oferta de trabajo:', error);
      setMessage({ text: 'Error al eliminar oferta de trabajo', type: 'error' });
    }
  };
  
  // Cambiar estado activo/inactivo
  const toggleActiveStatus = async (offer: JobOffer) => {
    try {
      const newStatus = !offer.is_active;
      
      const { error } = await supabase
        .from('job_offers')
        .update({ is_active: newStatus })
        .eq('id', offer.id);
      
      if (error) throw error;
      
      setJobOffers(jobOffers.map(o => 
        o.id === offer.id ? { ...o, is_active: newStatus } : o
      ));
    } catch (error) {
      console.error('Error al cambiar estado de oferta:', error);
      setMessage({ text: 'Error al cambiar estado de la oferta', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Ofertas de Trabajo</h1>
        <button
          onClick={startCreating}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Oferta de Trabajo
        </button>
      </div>

      {/* Mensaje de error/éxito */}
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-400" />
              ) : (
                <Check className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Buscar ofertas por título o ciudad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Formulario de creación/edición */}
      {(isCreating || isEditing) && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {isCreating ? 'Crear Nueva Oferta de Trabajo' : 'Editar Oferta de Trabajo'}
            </h2>
            <button onClick={cancelForm} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                name="title"
                id="title"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="hourly_pay" className="block text-sm font-medium text-gray-700">Pago por Hora</label>
              <input
                type="text"
                name="hourly_pay"
                id="hourly_pay"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.hourly_pay}
                onChange={handleInputChange}
                placeholder="Ej: 25 PLN"
              />
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="city"
                id="city"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">URL de Imagen</label>
              <input
                type="text"
                name="image_url"
                id="image_url"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            
            <div>
              <label htmlFor="whatsapp_url" className="block text-sm font-medium text-gray-700">URL de WhatsApp</label>
              <input
                type="text"
                name="whatsapp_url"
                id="whatsapp_url"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.whatsapp_url}
                onChange={handleInputChange}
                placeholder="https://wa.me/48123456789"
              />
            </div>
            
            <div className="flex items-center h-full">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Oferta Activa</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Beneficios</label>
            <textarea
              name="benefits"
              id="benefits"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.benefits}
              onChange={handleInputChange}
              placeholder="Alojamiento, transporte, etc."
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={cancelForm}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={isCreating ? createJobOffer : updateJobOffer}
            >
              {isCreating ? 'Crear Oferta' : 'Actualizar Oferta'}
            </button>
          </div>
        </div>
      )}

      {/* Lista de ofertas de trabajo */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        {loading ? (
          <div className="p-6 text-center">Cargando ofertas de trabajo...</div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No se encontraron ofertas que coincidan con la búsqueda' : 'No hay ofertas de trabajo disponibles'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredOffers.map((offer) => (
              <li key={offer.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={offer.image_url} 
                        alt={offer.title} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{offer.title}</h3>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {offer.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Pago: {offer.hourly_pay}</span>
                        <span className="mx-2">•</span>
                        <span>Ciudad: {offer.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleActiveStatus(offer)}
                      className={`p-1 rounded-full ${offer.is_active ? 'text-green-600 hover:text-green-900' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      {offer.is_active ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <X className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => startEditing(offer)}
                      className="p-1 rounded-full text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteJobOffer(offer.id)}
                      className="p-1 rounded-full text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
