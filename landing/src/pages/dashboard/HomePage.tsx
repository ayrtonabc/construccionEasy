import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, AlertCircle, Percent } from 'lucide-react'; // Added Percent icon
import { supabase } from '../../lib/supabase/client';
import { User } from "@supabase/supabase-js";
import { 
  Client, 
  OngoingResidenceProcess, 
  DocumentStats,
  JobOffer,
  NewResidenceApplication
} from '../../types/types';
import { Link } from 'react-router-dom';

interface ClientDashboardProps {
  user: User | null;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  const [isJobSearching, setIsJobSearching] = useState<boolean>(false);
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [clientData, setClientData] = useState<Client | null>(null);
  const [processData, setProcessData] = useState<OngoingResidenceProcess | null>(null);
  const [newApplicationData, setNewApplicationData] = useState<NewResidenceApplication | null>(null);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({ verified: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [savingJobPreference, setSavingJobPreference] = useState<boolean>(false);

  useEffect(() => {
    console.log("ID del usuario recibido en props:", user?.id);
  }, [user]);
  
  // Obtener datos del cliente al montar el componente
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (!user || !user.id) return;
        const userId = user.id
        
        // Obtener datos del cliente por user_id
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (clientError) throw clientError;
        
        if (clientData) {
          console.log('CLIENT DATA:', clientData);
          setClientData(clientData as Client);
          // Establecer el estado de búsqueda de trabajo según el valor en la base de datos
          setIsJobSearching(clientData.interested_in_jobs || false);
          
          // Si el cliente ha completado el formulario, obtener datos del proceso
          if (clientData.has_completed_form) {
            // Primero intentamos obtener un proceso en curso
            const { data: processData, error: processError } = await supabase
              .from('ongoing_residence_processes')
              .select('*')
              .eq('client_id', clientData.id)
              .maybeSingle();
              
            if (processError && processError.code !== 'PGRST116') throw processError;
            
            if (processData) {
              console.log('PROCESS DATA:', processData);
              setProcessData(processData as OngoingResidenceProcess);
            } else {
              // Si no hay proceso en curso, intentamos obtener una nueva aplicación
              const { data: newAppData, error: newAppError } = await supabase
                .from('new_residence_applications')
                .select('*')
                .eq('client_id', clientData.id)
                .maybeSingle();
                
              if (newAppError && newAppError.code !== 'PGRST116') throw newAppError;
              
              if (newAppData) {
                console.log('NEW APPLICATION DATA:', newAppData);
                setNewApplicationData(newAppData as NewResidenceApplication);
              }
            }
          }
          
          // Obtener documentos para contar estados
          const { data: documents, error: documentsError } = await supabase
            .from('client_documents')
            .select('*')
            .eq('client_id', clientData.id);
            
          if (documentsError) throw documentsError;
          
          if (documents) {
            // Contar estados de documentos
            const stats: DocumentStats = {
              verified: documents.filter(doc => doc.status === 'Verificado').length,
              pending: documents.filter(doc => doc.status === 'Pendiente').length,
              rejected: documents.filter(doc => doc.status === 'Rechazado').length
            };
            setDocumentStats(stats);
          }
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, [user]);

  // Cargar ofertas de trabajo activas
  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('job_offers')
          .select('*')
          .eq('is_active', true);
          
        if (error) throw error;
        
        if (data) {
          setJobOffers(data as JobOffer[]);
        }
      } catch (error) {
        console.error('Error al cargar ofertas de trabajo:', error);
      }
    };
    
    fetchJobOffers();
  }, []);

  // Mostrar un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando información del proceso...</p>
      </div>
    );
  }

  // Verificar si el usuario ha completado el formulario
  const hasCompletedForm = clientData?.has_completed_form === true;

  // Obtener título y mensaje para los próximos pasos desde los datos
  const getNextStepTitle = () => {
    if (!hasCompletedForm) {
      return "Complete el formulario de solicitud";
    }
    
    // Priorizar datos de la base de datos
    if (processData?.next_step_title) {
      return processData.next_step_title;
    }
    
    if (newApplicationData?.next_step_title) {
      return newApplicationData.next_step_title;
    }
    
    // Fallback a los mensajes generados
    return getDefaultNextStepMessage(processData, documentStats);
  };
  
  const getNextStepMessage = () => {
    if (!hasCompletedForm) {
      return "Para iniciar su proceso de residencia, es necesario completar el formulario con toda la información requerida.";
    }
    
    // Priorizar datos de la base de datos
    if (processData?.next_steps) {
      return processData.next_steps;
    }
    
    if (newApplicationData?.next_steps) {
      return newApplicationData.next_steps;
    }
    
    // Fallback a los mensajes generados
    return getDefaultNextStepDescription(processData, documentStats);
  };
  
  // Función para manejar el cambio en la preferencia de búsqueda de trabajo
  const handleJobSearchToggle = async () => {
    if (!clientData) return;
    
    // Evitar múltiples clics mientras se guarda
    setSavingJobPreference(true);
    
    try {
      // Actualizar el estado local primero para una UI más responsiva
      const newValue = !isJobSearching;
      setIsJobSearching(newValue);
      
      console.log('Intentando actualizar interested_in_jobs para cliente:', clientData.id);
      console.log('Valor actual:', isJobSearching, 'Nuevo valor:', newValue);
      
      // Actualizar en la base de datos
      const { data, error } = await supabase
        .from('clients')
        .update({ interested_in_jobs: newValue })
        .eq('id', clientData.id)
        .select();
        
      if (error) {
        console.error('Error detallado:', error.code, error.message, error.details, error.hint);
        throw error;
      }
      
      console.log('Respuesta de Supabase:', data);
      console.log(`Preferencia de búsqueda de trabajo actualizada a: ${newValue}`);
    } catch (error) {
      console.error('Error al actualizar preferencia de trabajo:', error);
      // Revertir el cambio local si hay error
      setIsJobSearching(!isJobSearching);
    } finally {
      setSavingJobPreference(false);
    }
  };

  // Calcular el porcentaje de progreso
  const calculateProgress = () => {
    let completed = 0;
    let total = 0;

    if (processData) {
      completed = processData.completed_steps;
      total = processData.total_steps;
    } else if (newApplicationData) {
      completed = newApplicationData.completed_steps;
      total = newApplicationData.total_steps;
    } else {
      // Fallback using document stats if no process data
      completed = documentStats.verified;
      total = 6; // Assuming 6 total documents/steps as fallback
    }

    if (total === 0) return 0; // Avoid division by zero
    return Math.round((completed / total) * 100);
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="space-y-8">
      {/* Mensaje para usuarios que no han completado el formulario */}
      {!hasCompletedForm && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Formulario pendiente
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                Para iniciar su proceso de residencia, por favor complete el formulario de solicitud.
              </p>
              <div className="mt-4">
                <Link to="/form" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Completar formulario
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasCompletedForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado del Proceso</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información del Caso */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">Información del Caso</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Fecha de Inicio: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData?.start_date 
                      ? formatDate(processData.start_date) 
                      : newApplicationData?.start_date 
                        ? formatDate(newApplicationData.start_date)
                        : 'Pendiente'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Número de Caso: 
                  <span className="font-medium text-gray-900 ml-2">
                  {processData?.case_number 
                    ? processData.case_number 
                    : newApplicationData?.case_number 
                    ? newApplicationData.case_number 
                    : 'Reservado'}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Voivodato: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData?.voivodato ? processData.voivodato : newApplicationData?.voivodato ? newApplicationData?.voivodato  : 'No disponible'}
                  </span>
                </p>
              </div>
            </div>

            {/* Estado Actual */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-medium text-yellow-900">Estado Actual</h3>
              </div>
              <p className="text-sm text-yellow-800 font-medium">
                {processData?.process_stage 
                  ? mapProcessStage(processData.process_stage) 
                  : 'Documentación siendo procesada'}
              </p>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Próxima Cita: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData?.next_appointment_date 
                      ? formatDate(processData.next_appointment_date) 
                      : newApplicationData?.next_appointment_date ? formatDate(newApplicationData?.next_appointment_date)  : 'Sin programar'}
                  </span>
                </p>
              </div>
            </div>

            {/* Etapa Proceso */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-900">Etapa Proceso</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Completados: 
                  <span className="font-medium text-gray-900 ml-2">
                    {processData 
                      ? `${processData.completed_steps} de ${processData.total_steps}` : newApplicationData
                      ? `${newApplicationData.completed_steps} de ${newApplicationData.total_steps}` 
                      : `${documentStats.verified} de 6`}
                  </span>
                </p>
                {/* Display Progress Percentage */}
                <div className="flex items-center text-sm text-gray-600">
                   <Percent className="h-4 w-4 text-green-600 mr-1" />
                   Progreso:
                   <span className="font-medium text-green-700 ml-2">
                     {progressPercentage}% completado
                   </span>
                 </div>
                 {/* Progress Bar */}
                 <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                   <div 
                     className="bg-green-600 h-2.5 rounded-full" 
                     style={{ width: `${progressPercentage}%` }}
                   ></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Próximos Pasos - Mostrar siempre, pero contenido diferente dependiendo del estado */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Pasos</h2>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {getNextStepTitle()}
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                {getNextStepMessage()}
              </p>
            </div>
          </div>
        </div>
      </div>
      


      {/* Ofertas de Trabajo */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Ofertas de Trabajo</h2>
          <div className="flex items-center">
            <span className="mr-3 text-sm text-gray-600">
              {isJobSearching ? 'Mostrar ofertas' : 'Ocultar ofertas'}
            </span>
            <button
              type="button"
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isJobSearching ? 'bg-blue-600' : 'bg-gray-200'}`}
              onClick={handleJobSearchToggle}
              disabled={savingJobPreference}
            >
              <span className="sr-only">Toggle job search</span>
              <span
                className={`${isJobSearching ? 'translate-x-5' : 'translate-x-0'} inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
        </div>
        {isJobSearching && (
          <>
            {jobOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobOffers.map((offer) => (
                  <div key={offer.id} className="bg-gray-100 rounded-lg p-4">
                    <img src={offer.image_url} alt={offer.title} className="w-full h-32 object-cover rounded-md mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                    <p className="text-sm text-gray-600">Pago por hora: {offer.hourly_pay}</p>
                    <p className="text-sm text-gray-600">Ciudad: {offer.city}</p>
                    <p className="text-sm text-gray-600 mb-2">Beneficios: {offer.benefits}</p>
                    <a 
                      href={offer.whatsapp_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block"
                    >
                      Contactar por WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay ofertas de trabajo disponibles en este momento.</p>
            )}
            <p className="text-sm text-gray-600 mt-4">
              Aclaración: Las ofertas laborales presentadas son proporcionadas por terceros. No promovemos ni estamos a favor de cobros por cupos, documentación o cualquier otro concepto relacionado con estas ofertas. Si te encuentras con alguna situación de este tipo, por favor infórmanos.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// Función para formatear fechas
function formatDate(dateString: string): string {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// Función para mapear las etapas del proceso a texto más descriptivo
function mapProcessStage(stage: string): string {
  const stageMap: Record<string, string> = {
    'Presentacion Solicitud': 'Solicitud presentada',
    'Tengo Carta Amarilla': 'Esperando cita para huellas',
    'Ya tuve cita huellas': 'Esperando resolución',
    'Sello Rojo': 'Proceso completado',
    'Negativa': 'Solicitud rechazada',
    'Desconozco': 'Documentación siendo procesada'
  };
  
  return stageMap[stage] || stage;
}

// Funciones auxiliares para determinar el mensaje y descripción del próximo paso (usado como fallback)
function getDefaultNextStepMessage(processData: OngoingResidenceProcess | null, documentStats: DocumentStats): string {
  if (!processData) {
    return "Envío de documentación";
  }
  
  switch(processData.process_stage) {
    case 'Presentacion Solicitud':
      return "Esperar confirmación de recepción";
    case 'Tengo Carta Amarilla':
      return "Cita para huellas";
    case 'Ya tuve cita huellas':
      return "Esperar resolución";
    case 'Sello Rojo':
      return "Proceso completo";
    case 'Negativa':
      return "Proceso con resultado negativo";
    default:
      if (documentStats.pending > 0) {
        return "Completar documentación pendiente";
      } else {
        return "Documentación siendo procesada";
      }
  }
}

function getDefaultNextStepDescription(processData: OngoingResidenceProcess | null, documentStats: DocumentStats): string {
  if (!processData) {
    return "Por favor, complete todos los documentos requeridos para iniciar su proceso.";
  }
  
  switch(processData.process_stage) {
    case 'Presentacion Solicitud':
      return "Estamos esperando que las autoridades confirmen la recepción de su solicitud.";
    case 'Tengo Carta Amarilla':
      return "Pendiente de asignación. Se le notificará cuando la cita esté programada.";
    case 'Ya tuve cita huellas':
      return "Su caso está siendo revisado por las autoridades. Le informaremos cuando haya novedades.";
    case 'Sello Rojo':
      return "¡Felicidades! Su proceso de residencia ha sido completado exitosamente.";
    case 'Negativa':
      return "Su solicitud ha sido rechazada. Contacte a nuestro equipo para analizar las opciones disponibles.";
    default:
      if (documentStats.pending > 0) {
        return `Tiene ${documentStats.pending} documentos pendientes de verificación. Por favor, complete la documentación.`;
      } else if (documentStats.rejected > 0) {
        return `Tiene ${documentStats.rejected} documentos rechazados que requieren corrección.`;
      } else {
        return "Su documentación está siendo verificada. Le notificaremos cuando haya avances.";
      }
  }
}

export default ClientDashboard;
