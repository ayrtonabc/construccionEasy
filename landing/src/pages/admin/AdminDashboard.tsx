import { useState, useEffect, ChangeEvent } from 'react';
import { Users, Clock, CheckCircle2, AlertTriangle, FileText, Save, Briefcase, Edit, X, Plus, ListChecks, CheckSquare, Calendar } from 'lucide-react'; // Added icons for tasks
import { supabase } from "../../lib/supabase/client";
import { Client, AdminStats, AdminActivityItem, AdminTask, OngoingResidenceProcess, NewResidenceApplication } from "../../types/types"; // Updated types
// Importar el módulo de registro de actividades
import {
  logUserActivity,
  logProcessUpdate,
} from "../../lib/activity-logger";

// Define a more comprehensive type for clientInfo state
interface ClientProcessInfo {
  id: string;
  fullName: string;
  processStartDate: string;
  nextStepTitle: string;
  nextStepText: string;
  // Add fields for process editing
  caseNumber?: string;
  voivodato?: string;
  processStage?: string; // For ongoing process
  completedSteps?: number;
  totalSteps?: number;
  // Add a flag to know which table the data came from
  processSource?: 'ongoing' | 'new' | null;
}

export default function AdminDashboard() {
  // Estados para almacenar datos de Supabase
  const [stats, setStats] = useState<AdminStats>({
    totalClients: 0,
    activeProcesses: 0,
    pendingDocuments: 0,
    urgentCases: 0 // This might be deprecated or repurposed
  });
  
  const [recentActivity, setRecentActivity] = useState<AdminActivityItem[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  // Use the more comprehensive type for clientInfo
  const [clientInfo, setClientInfo] = useState<ClientProcessInfo | null>(null);
  const [originalClientInfo, setOriginalClientInfo] = useState<ClientProcessInfo | null>(null); // To store original data for cancellation
  // const [urgentTasks, setUrgentTasks] = useState<AdminUrgentTask[]>([]); // Replaced by adminTasks
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isEditingProcess, setIsEditingProcess] = useState<boolean>(false); // State for editing mode

  // --- Task Management States ---
  const [pendingTasks, setPendingTasks] = useState<AdminTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<AdminTask[]>([]);
  const [activeTaskTab, setActiveTaskTab] = useState<'Pendiente' | 'Realizada'>('Pendiente');
  const [showNewTaskForm, setShowNewTaskForm] = useState<boolean>(false);
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<'Martyna' | 'Maciej' | 'Ayrton' | ''>('');
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>('');
  const [loadingTasks, setLoadingTasks] = useState<boolean>(false);
  const [savingTask, setSavingTask] = useState<boolean>(false);
  // --- End Task Management States ---

  // Función para cargar las estadísticas
  const loadStats = async (): Promise<void> => {
    try {
      // Contar clientes
      const { count: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      // Contar procesos activos (consider both tables)
      const { count: ongoingCount, error: ongoingError } = await supabase
        .from('ongoing_residence_processes')
        .select('*', { count: 'exact', head: true });
      const { count: newAppCount, error: newAppError } = await supabase
        .from('new_residence_applications')
        .select('*', { count: 'exact', head: true });


      // Contar documentos pendientes
      const { count: docsCount, error: docsError } = await supabase
        .from('client_documents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente');

      // Contar tareas pendientes (using the new table)
      const { count: pendingTasksCount, error: tasksError } = await supabase
        .from('admin_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pendiente');

      if (clientError || ongoingError || newAppError || docsError || tasksError) {
        console.error("Error al cargar estadísticas:", { clientError, ongoingError, newAppError, docsError, tasksError });
        return;
      }

      setStats({
        totalClients: clientCount || 0,
        activeProcesses: (ongoingCount || 0) + (newAppCount || 0), // Sum counts from both process tables
        pendingDocuments: docsCount || 0,
        urgentCases: pendingTasksCount || 0 // Use pending tasks count for urgent cases stat
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  // Función mejorada para cargar la actividad reciente
  const loadRecentActivity = async (): Promise<void> => {
    try {
      // Obtener los últimos 10 registros de actividad (aumentado para capturar más actividades de usuario)
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          description,
          activity_type,
          created_at,
          clients!inner(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

        console.log("Datos de actividad reciente:", data); // Debugging line
        

      if (error) {
        console.error("Error al cargar actividad reciente:", error);
        return;
      }

      // Formatear los datos para mostrarlos
      const formattedActivity = data ? data.map((log: any) => {
        // Calcular tiempo relativo
        const timeAgo = getTimeAgo(new Date(log.created_at));
        
        return {
          id: log.id,
          client: log.clients.full_name,
          action: log.activity_type,
          process: log.description,
          time: timeAgo
        };
      }) : [];

      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("Error al cargar actividad reciente:", error);
    }
  };

  // Función para cargar todos los clientes
  const loadAllClients = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) {
        console.error("Error al cargar clientes:", error);
        return;
      }

      setAllClients(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  // Función para cargar la información de un cliente específico (incluyendo detalles del proceso)
  const loadClientInfo = async (clientId: string): Promise<void> => {
    if (!clientId) {
      setClientInfo(null);
      setOriginalClientInfo(null);
      return;
    }
    
    try {
      setLoading(true); // Indicate loading specific client info
      let processInfo: OngoingResidenceProcess | NewResidenceApplication | null = null;
      let processSource: 'ongoing' | 'new' | null = null;

      // 1. Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single(); // Use single() as client ID should be unique

      if (clientError) throw clientError;
      if (!clientData) throw new Error("Client not found");

      // 2. Fetch ongoing process data
      const { data: ongoingData, error: ongoingError } = await supabase
        .from('ongoing_residence_processes')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle(); // Use maybeSingle() as it might not exist

      if (ongoingError) throw ongoingError;

      if (ongoingData) {
        processInfo = ongoingData;
        processSource = 'ongoing';
      } else {
        // 3. If no ongoing process, fetch new application data
        const { data: newData, error: newError } = await supabase
          .from('new_residence_applications')
          .select('*')
          .eq('client_id', clientId)
          .maybeSingle();

        if (newError) throw newError;

        if (newData) {
          processInfo = newData;
          processSource = 'new';
        }
      }

      // 4. Combine data into the state structure
      const combinedInfo: ClientProcessInfo = {
        id: clientData.id,
        fullName: clientData.full_name,
        processStartDate: processInfo?.start_date || '',
        nextStepTitle: processInfo?.next_step_title || '',
        nextStepText: processInfo?.next_steps || '',
        caseNumber: processInfo?.case_number || '',
        voivodato: processInfo?.voivodato || '',
        // Specific fields based on source
        processStage: processSource === 'ongoing' ? (processInfo as OngoingResidenceProcess)?.process_stage : undefined,
        completedSteps: processInfo?.completed_steps ?? 0, // Use ?? for default value
        totalSteps: processInfo?.total_steps ?? 0, // Use ?? for default value
        processSource: processSource,
      };

      setClientInfo(combinedInfo);
      setOriginalClientInfo(combinedInfo); // Store the original fetched data
      setIsEditingProcess(false); // Reset editing mode when selecting a new client

    } catch (error) {
      console.error("Error al cargar información del cliente:", error);
      setClientInfo(null);
      setOriginalClientInfo(null);
    } finally {
      setLoading(false); // Finish loading specific client info
    }
  };

  // --- Task Management Functions ---
  const loadAdminTasks = async (): Promise<void> => {
    setLoadingTasks(true);
    try {
      const { data, error } = await supabase
        .from('admin_tasks')
        .select('*')
        .order('deadline', { ascending: true, nullsFirst: false }) // Show tasks with deadlines first
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error al cargar tareas:", error);
        return;
      }

      const pending = data?.filter(task => task.status === 'Pendiente') || [];
      const completed = data?.filter(task => task.status === 'Realizada') || [];

      setPendingTasks(pending);
      setCompletedTasks(completed);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    setSavingTask(true);
    try {
      const { error } = await supabase
        .from('admin_tasks')
        .insert({
          description: newTaskDescription,
          assignee: newTaskAssignee || null, // Store null if empty
          deadline: newTaskDeadline || null, // Store null if empty
          status: 'Pendiente'
        });

      if (error) throw error;

      // Reset form and reload tasks
      setNewTaskDescription('');
      setNewTaskAssignee('');
      setNewTaskDeadline('');
      setShowNewTaskForm(false);
      await loadAdminTasks(); // Reload tasks
      await loadStats(); // Reload stats to update urgent cases count

    } catch (error) {
      console.error("Error al añadir tarea:", error);
    } finally {
      setSavingTask(false);
    }
  };

  const handleCompleteTask = async (taskId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('admin_tasks')
        .update({ status: 'Realizada', completed_at: new Date().toISOString() })
        .eq('id', taskId);

      if (error) throw error;

      await loadAdminTasks(); // Reload tasks
      await loadStats(); // Reload stats to update urgent cases count

    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  };
  // --- End Task Management Functions ---

  // Configurar actualizaciones en tiempo real de la actividad
  useEffect(() => {
    // Suscribirse a cambios en la tabla activity_logs
    const subscription = supabase
      .channel('activity_logs_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'activity_logs' 
        }, 
        (payload) => {
          // Cuando se inserta un nuevo registro, recargar la actividad reciente
          loadRecentActivity();
        }
      )
      .subscribe();

    // Limpieza al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    const loadAllData = async (): Promise<void> => {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadRecentActivity(),
        loadAllClients(),
        loadAdminTasks() // Load admin tasks instead of urgent tasks
      ]);
      setLoading(false);
    };

    loadAllData();

    // Configurar actualización automática cada minuto para mantener el "hace X tiempo" actualizado
    const intervalId = setInterval(() => {
      setRecentActivity(prev => prev.map(activity => ({
        ...activity,
        time: getTimeAgo(new Date(new Date().getTime() - getMinutesFromTimeAgo(activity.time) * 60000))
      })));
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Convierte una cadena de "hace X tiempo" a minutos
  const getMinutesFromTimeAgo = (timeAgo: string): number => {
    if (timeAgo === "Justo ahora") return 0;
    
    const match = timeAgo.match(/Hace (\d+) (\w+)/);
    if (!match) return 0;
    
    const amount = parseInt(match[1]);
    const unit = match[2];
    
    if (unit.startsWith("minuto")) return amount;
    if (unit.startsWith("hora")) return amount * 60;
    if (unit.startsWith("día")) return amount * 24 * 60;
    
    return 0;
  };

  // Cargar información del cliente cuando se selecciona uno
  useEffect(() => {
    loadClientInfo(selectedClient);
  }, [selectedClient]);

  // Handle changes in the editable client info fields
  const handleClientInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setClientInfo((prev) => {
      if (!prev) return null;
      const newValue = type === 'number' ? parseInt(value) || 0 : value; // Handle number conversion
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setClientInfo(originalClientInfo); // Restore original data
    setIsEditingProcess(false);
  };

  // Función para guardar los cambios del cliente (ahora incluye proceso)
  const handleSaveChanges = async (): Promise<void> => {
    if (!clientInfo) return;
    
    setSaving(true);
    
    try {
      let processUpdateData: Partial<OngoingResidenceProcess | NewResidenceApplication> = {
        start_date: clientInfo.processStartDate || null, // Handle empty string
        next_steps: clientInfo.nextStepText,
        next_step_title: clientInfo.nextStepTitle,
        case_number: clientInfo.caseNumber,
        voivodato: clientInfo.voivodato,
        completed_steps: clientInfo.completedSteps,
        total_steps: clientInfo.totalSteps,
        updated_at: new Date().toISOString(), // Always update timestamp
      };

      let tableName: 'ongoing_residence_processes' | 'new_residence_applications' | null = null;
      let processId: string | null = null;

      // Determine which table to update based on processSource
      if (clientInfo.processSource === 'ongoing') {
        tableName = 'ongoing_residence_processes';
        processUpdateData = {
          ...processUpdateData,
          process_stage: clientInfo.processStage, // Only for ongoing
        };
        // Fetch the ID for the ongoing process
        const { data: ongoingData, error: ongoingErr } = await supabase
          .from(tableName)
          .select('id')
          .eq('client_id', clientInfo.id)
          .single();
        if (ongoingErr || !ongoingData) throw new Error("Could not find ongoing process ID to update.");
        processId = ongoingData.id;

      } else if (clientInfo.processSource === 'new') {
        tableName = 'new_residence_applications';
         // Fetch the ID for the new application
         const { data: newData, error: newErr } = await supabase
         .from(tableName)
         .select('id')
         .eq('client_id', clientInfo.id)
         .single();
       if (newErr || !newData) throw new Error("Could not find new application ID to update.");
       processId = newData.id;
      }

      // Perform the update if a table and ID were determined
      if (tableName && processId) {
        const { error: updateError } = await supabase
          .from(tableName)
          .update(processUpdateData)
          .eq('id', processId); // Use the specific process ID

        if (updateError) {
          console.error(`Error updating ${tableName}:`, updateError);
          throw updateError;
        }
      } else {
         // Handle case where no process exists yet - maybe create one?
         // For now, we'll just log a warning.
         console.warn("No existing process found for client to update:", clientInfo.id);
         // Optionally, create a new record here if desired
      }
      
      // Log activity
      const updatedFields = Object.keys(processUpdateData).filter(key => key !== 'updated_at'); // Get list of updated fields
      try {
        await logProcessUpdate(
          clientInfo.id,
          clientInfo.fullName,
          clientInfo.processSource || 'unknown', // Pass process type
          updatedFields
        );
        console.log("Actividad registrada correctamente usando activity-logger");
      } catch (logError) {
        console.error("Error al registrar actividad con activity-logger:", logError);
        // Fallback logging
        try {
          await logUserActivity(
            clientInfo.id,
            "Actualización de proceso",
            `${clientInfo.fullName} actualizó su proceso: ${updatedFields.join(', ')}`
          );
        } catch (directError) {
          console.error("Error al registrar actividad directamente:", directError);
        }
      }
      
      setSaveSuccess(true);
      setIsEditingProcess(false); // Exit editing mode
      setOriginalClientInfo(clientInfo); // Update original info after successful save
      
      // Eliminar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      // Optionally revert changes on error
      // setClientInfo(originalClientInfo);
    } finally {
      setSaving(false);
    }
  };

  // Funciones de utilidad para formatear fechas
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Justo ahora";
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  const formatDueDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'Sin fecha';
    try {
      const date = new Date(dateString);
      // Adjust for potential timezone issues if the date string doesn't include timezone info
      const adjustedDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (adjustedDate.getTime() === today.getTime()) return "Hoy";
      if (adjustedDate.getTime() === tomorrow.getTime()) return "Mañana";

      return adjustedDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };

  // Renderizar estado de carga
  if (loading && !allClients.length) { // Show initial loading only if no clients are loaded yet
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Procesos Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeProcesses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Docs. Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingDocuments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tareas Pendientes</p> {/* Changed label */}
              <p className="text-2xl font-semibold text-gray-900">{stats.urgentCases}</p> {/* Stat now reflects pending tasks */}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.client}</p>
                    <p className="text-sm text-gray-600">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                        activity.action === 'Actualización de perfil' ? 'bg-blue-100 text-blue-800' :
                        activity.action === 'Actualización de proceso' ? 'bg-green-100 text-green-800' :
                        activity.action === 'Subida de documento' ? 'bg-purple-100 text-purple-800' :
                        activity.action === 'Pago realizado' ? 'bg-indigo-100 text-indigo-800' :
                        activity.action === 'Nuevo ticket' ? 'bg-orange-100 text-orange-800' :
                        activity.action === 'Respuesta a ticket' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.action}
                      </span>
                      {activity.process}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 whitespace-nowrap ml-2">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
          )}
        </div>

        {/* Client Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestión de Clientes</h2>
          
          {/* Client Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Seleccionar Cliente
            </label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-50"
              value={selectedClient}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setSelectedClient(e.target.value)
              }
            >
              <option value="">-- Seleccione un cliente --</option>
              {allClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Client Process Information - Only show if a client is selected */}
          {loading && selectedClient ? (
             <p className="text-gray-500 text-center py-4">Cargando información del cliente...</p>
          ) : clientInfo ? (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium text-gray-900 text-lg">{clientInfo.fullName}</p>
                <div className="flex space-x-2">
                  {saveSuccess && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Guardado
                    </span>
                  )}
                  {!isEditingProcess ? (
                     <button
                       className="bg-yellow-500 text-white py-1 px-3 rounded flex items-center text-sm hover:bg-yellow-600"
                       onClick={() => setIsEditingProcess(true)}
                     >
                       <Edit className="w-4 h-4 mr-1" />
                       Editar Proceso
                     </button>
                  ) : (
                    <>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded flex items-center text-sm hover:bg-red-600"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancelar
                      </button>
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded flex items-center text-sm hover:bg-blue-600"
                        onClick={handleSaveChanges}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Guardar
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Process Details - Editable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {/* Fecha de Inicio */}
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">
                     Fecha de inicio
                   </label>
                   {isEditingProcess ? (
                     <input
                       type="date"
                       name="processStartDate"
                       className="w-full p-2 border rounded"
                       value={clientInfo.processStartDate || ''}
                       onChange={handleClientInfoChange}
                     />
                   ) : (
                     <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.processStartDate || 'N/A'}</p>
                   )}
                 </div>

                 {/* Número de Caso */}
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">
                     Número de Caso
                   </label>
                   {isEditingProcess ? (
                     <input
                       type="text"
                       name="caseNumber"
                       className="w-full p-2 border rounded"
                       value={clientInfo.caseNumber || ''}
                       onChange={handleClientInfoChange}
                       placeholder="Ej: ABC-1234"
                     />
                   ) : (
                     <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.caseNumber || 'N/A'}</p>
                   )}
                 </div>

                 {/* Voivodato */}
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">
                     Voivodato
                   </label>
                   {isEditingProcess ? (
                     <input
                       type="text"
                       name="voivodato"
                       className="w-full p-2 border rounded"
                       value={clientInfo.voivodato || ''}
                       onChange={handleClientInfoChange}
                       placeholder="Ej: Mazowieckie"
                     />
                   ) : (
                     <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.voivodato || 'N/A'}</p>
                   )}
                 </div>

                 {/* Estado Actual (Process Stage - only if ongoing) */}
                 {clientInfo.processSource === 'ongoing' && (
                   <div>
                     <label className="block text-sm font-medium text-gray-600 mb-1">
                       Estado Actual
                     </label>
                     {isEditingProcess ? (
                       <select
                         name="processStage"
                         className="w-full p-2 border rounded bg-white"
                         value={clientInfo.processStage || ''}
                         onChange={handleClientInfoChange}
                       >
                         <option value="">Seleccionar...</option>
                         <option value="Solicitud Presentada">Solicitud Presentada</option>
                         <option value="Tarjeta Amarilla">Tarjeta Amarilla</option>
                         <option value="Sello Rojo">Sello Rojo</option>
                         <option value="Negativo">Negativo</option>
                         <option value="Desconocido">Desconocido</option>
                         {/* Add other stages from your types */}
                         <option value="Preparación de documentos">Preparación de documentos</option>
                         <option value="Presentación de solicitud">Presentación de solicitud</option>
                         <option value="En revisión">En revisión</option>
                         <option value="Entrevista programada">Entrevista programada</option>
                         <option value="Documentos adicionales requeridos">Documentos adicionales requeridos</option>
                         <option value="Decisión pendiente">Decisión pendiente</option>
                         <option value="Aprobado">Aprobado</option>
                         <option value="Rechazado">Rechazado</option>
                       </select>
                     ) : (
                       <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.processStage || 'N/A'}</p>
                     )}
                   </div>
                 )}

                 {/* Pasos Completados */}
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">
                     Pasos Completados
                   </label>
                   {isEditingProcess ? (
                     <input
                       type="number"
                       name="completedSteps"
                       className="w-full p-2 border rounded"
                       value={clientInfo.completedSteps ?? ''}
                       onChange={handleClientInfoChange}
                       min="0"
                       max={clientInfo.totalSteps}
                     />
                   ) : (
                     <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.completedSteps ?? 'N/A'}</p>
                   )}
                 </div>

                 {/* Total Pasos */}
                 <div>
                   <label className="block text-sm font-medium text-gray-600 mb-1">
                     Total Pasos
                   </label>
                   {isEditingProcess ? (
                     <input
                       type="number"
                       name="totalSteps"
                       className="w-full p-2 border rounded"
                       value={clientInfo.totalSteps ?? ''}
                       onChange={handleClientInfoChange}
                       min="1"
                     />
                   ) : (
                     <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.totalSteps ?? 'N/A'}</p>
                   )}
                 </div>
              </div>

              {/* Next Step Fields */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Título del próximo paso
                </label>
                {isEditingProcess ? (
                  <input
                    type="text"
                    name="nextStepTitle"
                    className="w-full p-2 border rounded"
                    value={clientInfo.nextStepTitle}
                    onChange={handleClientInfoChange}
                    placeholder="Ingrese título del próximo paso"
                  />
                ) : (
                  <p className="p-2 bg-white rounded border border-gray-200">{clientInfo.nextStepTitle || 'N/A'}</p>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Descripción del próximo paso
                </label>
                {isEditingProcess ? (
                  <textarea
                    name="nextStepText"
                    className="w-full p-2 border rounded"
                    value={clientInfo.nextStepText}
                    rows={3}
                    onChange={handleClientInfoChange}
                    placeholder="Describa el próximo paso a seguir"
                  />
                ) : (
                  <p className="p-2 bg-white rounded border border-gray-200 min-h-[6rem] whitespace-pre-wrap">{clientInfo.nextStepText || 'N/A'}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {selectedClient ? 'No se encontró información del proceso para este cliente.' : 'Seleccione un cliente para gestionar su proceso'}
            </p>
          )}
        </div>
      </div>

      {/* Task Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tareas Administrativas</h2>
          <button
            onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            className="bg-blue-500 text-white py-1 px-3 rounded flex items-center text-sm hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Tarea
          </button>
        </div>

        {/* New Task Form */}
        {showNewTaskForm && (
          <form onSubmit={handleAddTask} className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Descripción de la tarea..."
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Asignar a</label>
                <select
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value as any)}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="">Nadie</option>
                  <option value="Martyna">Martyna</option>
                  <option value="Maciej">Maciej</option>
                  <option value="Ayrton">Ayrton</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha Límite</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                disabled={savingTask}
              >
                {savingTask ? 'Guardando...' : 'Añadir Tarea'}
              </button>
            </div>
          </form>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTaskTab('Pendiente')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTaskTab === 'Pendiente'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pendientes ({pendingTasks.length})
            </button>
            <button
              onClick={() => setActiveTaskTab('Realizada')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTaskTab === 'Realizada'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Realizadas ({completedTasks.length})
            </button>
          </nav>
        </div>

        {/* Task List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loadingTasks ? (
            <p className="text-gray-500 text-center py-4">Cargando tareas...</p>
          ) : activeTaskTab === 'Pendiente' ? (
            pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                  <div className="flex-1 mr-4">
                    <p className="text-sm text-gray-800">{task.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                      {task.assignee && (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" /> {task.assignee}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" /> {formatDueDate(task.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="bg-green-100 text-green-700 p-1 rounded-full hover:bg-green-200"
                    title="Marcar como realizada"
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay tareas pendientes.</p>
            )
          ) : ( // Realizada Tab
            completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200 opacity-70">
                  <div className="flex-1 mr-4">
                    <p className="text-sm text-gray-700 line-through">{task.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                      {task.assignee && (
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" /> {task.assignee}
                        </span>
                      )}
                      {task.completed_at && (
                         <span className="flex items-center text-green-600">
                           <CheckCircle2 className="w-3 h-3 mr-1" /> Completada: {formatDueDate(task.completed_at)}
                         </span>
                      )}
                    </div>
                  </div>
                  {/* Optionally add a button to uncomplete or delete */}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay tareas realizadas.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
