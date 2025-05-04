import React, { useEffect, useState } from "react";
import { FormInput } from "../components/FormInput";
import { FormSelect } from "../components/FormSelect";
import { FormRadio } from "../components/FormRadio";
import { FileUpload } from "../components/FileUpload";
import { ProgressBar } from "../components/ProgressBar";
import {
  FormData,
  FormStep,
  initialFormData,
  TattooDetail,
  RelativeDetail,
  TravelDetail,
} from "../types/types"; // Added TravelDetail
import {
  ClipboardList,
  ArrowLeft,
  ArrowRight,
  Send,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "../lib/supabase/client";
import DuplicatePassportModal from "../components/DuplicatePassportModal";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../context/AuthContext"; // Import useAuth

// Helper to generate unique IDs
const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`;

const Form: React.FC= () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [formType, setFormType] = useState<FormStep>("selection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isPassportDuplicate, setIsPassportDuplicate] = useState(false);
  const [hasCompletedForm, setHasCompletedForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const { user: loggedInUser, isAdmin } = useAuth(); // Get logged-in user info

  // Check if admin is filling the form for a specific client
  const clientIdFromState = location.state?.clientId;
  const isAdminFilling = location.state?.isAdminFilling === true && isAdmin;

  // Determine the user ID to use for operations
  // If admin is filling, use the passed clientId's associated user_id
  // Otherwise, use the logged-in user's ID
  const [targetUserId, setTargetUserId] = useState<string | null>(null);
  const [targetClientId, setTargetClientId] = useState<string | null>(clientIdFromState);

  useEffect(() => {
    const determineTargetUser = async () => {
      if (isAdminFilling && targetClientId) {
        // Admin is filling for a specific client, find the client's user_id
        const { data: clientData, error } = await supabase
          .from('clients')
          .select('user_id')
          .eq('id', targetClientId)
          .single();
        if (!error && clientData) {
          setTargetUserId(clientData.user_id);
        } else {
          console.error("Admin filling form: Could not find user_id for client", targetClientId, error);
          // Handle error, maybe redirect or show message
          setSubmitError("No se pudo encontrar el usuario asociado al cliente.");
        }
      } else if (loggedInUser) {
        // Normal client flow, use logged-in user's ID
        setTargetUserId(loggedInUser.id);
        // Also try to find the client ID associated with this user
        const { data: clientData, error } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', loggedInUser.id)
          .single();
        if (!error && clientData) {
          setTargetClientId(clientData.id);
        }
      }
    };

    determineTargetUser();
  }, [isAdminFilling, targetClientId, loggedInUser]);


// Verificar si el usuario ya completó un formulario al cargar el componente
useEffect(() => {
  // Skip this check if admin is filling the form
  if (isAdminFilling) return;

  const checkUserFormStatus = async () => {
    try {
      if (!targetUserId) {
        console.log("No hay ID de usuario objetivo para verificar estado");
        return;
      }

      // Consultar si el usuario ya ha completado un formulario
      const { data, error } = await supabase
        .from("clients")
        .select("has_completed_form")
        .eq("user_id", targetUserId) // Use targetUserId
        .limit(1);

      if (error) {
        console.error("Error al verificar estado del formulario:", error);
        return;
      }

      if (data && data.length > 0 && data[0].has_completed_form === true) {
        setHasCompletedForm(true);
        setIsDuplicateModalOpen(true);
      }
    } catch (error) {
      console.error("Error al verificar estado del formulario:", error);
    }
  };

  // Only run check if we have a targetUserId and it's not admin filling
  if (targetUserId && !isAdminFilling) {
    checkUserFormStatus();
  }
}, [targetUserId, isAdminFilling]);


  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string) => (file: File | null) => {
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleRadioChange = (name: keyof FormData) => (value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Tattoo Handlers ---
  const handleAddTattoo = () => {
    setFormData((prev) => ({
      ...prev,
      tattoos: [...prev.tattoos, { id: generateId(), location: "" }],
    }));
  };

  const handleTattooChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      tattoos: prev.tattoos.map((tattoo) =>
        tattoo.id === id ? { ...tattoo, location: value } : tattoo
      ),
    }));
  };

  const handleRemoveTattoo = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      tattoos: prev.tattoos.filter((tattoo) => tattoo.id !== id),
    }));
  };

  // --- Relative Handlers ---
  const handleAddRelative = () => {
    setFormData((prev) => ({
      ...prev,
      relatives: [
        ...prev.relatives,
        {
          id: generateId(),
          relationship: "",
          full_name: "",
          residency_status: "",
        },
      ],
    }));
  };

  const handleRelativeChange = (
    id: string,
    field: keyof Omit<RelativeDetail, "id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      relatives: prev.relatives.map((relative) =>
        relative.id === id ? { ...relative, [field]: value } : relative
      ),
    }));
  };

  const handleRemoveRelative = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      relatives: prev.relatives.filter((relative) => relative.id !== id),
    }));
  };

  // --- Travel Handlers ---
  const handleAddTravel = () => {
    setFormData((prev) => ({
      ...prev,
      travels: [
        ...prev.travels,
        {
          id: generateId(),
          start_date: "",
          end_date: "",
          country: "",
          reason: "",
        },
      ],
    }));
  };

  const handleTravelChange = (
    id: string,
    field: keyof Omit<TravelDetail, "id">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      travels: prev.travels.map((travel) =>
        travel.id === id ? { ...travel, [field]: value } : travel
      ),
    }));
  };

  const handleRemoveTravel = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      travels: prev.travels.filter((travel) => travel.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation check for conditional fields before proceeding
    // Skip duplicate check if admin is filling
    if (hasCompletedForm && !isAdminFilling) {
      setIsDuplicateModalOpen(true);
      return;
    }

    if (formType === "new") {
      if (
        formData.hasTattoos === true &&
        formData.tattoos.some((t) => !t.location.trim())
      ) {
        alert("Por favor, complete la ubicación de todos los tatuajes.");
        return;
      }
      if (
        formData.relativesInPoland === true &&
        formData.relatives.some(
          (r) =>
            !r.relationship.trim() ||
            !r.full_name.trim() ||
            !r.residency_status.trim()
        )
      ) {
        alert("Por favor, complete todos los detalles de los familiares.");
        return;
      }
      if (
        formData.hasTraveledLastFiveYears === true &&
        formData.travels.some(
          (t) =>
            !t.start_date.trim() ||
            !t.end_date.trim() ||
            !t.country.trim() ||
            !t.reason.trim()
        )
      ) {
        alert("Por favor, complete todos los detalles de los viajes.");
        return;
      }
    }

    if (currentStep < getTotalSteps()) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        setIsSubmitting(true);
        setSubmitError(null);

        if (!targetClientId) {
          throw new Error("No se pudo determinar el ID del cliente para guardar los datos.");
        }

        // Guardar los datos en Supabase según el tipo de formulario
        if (formType === "new") {
          await saveNewResidenceApplication(targetClientId, targetUserId); // Pass IDs
        } else if (formType === "ongoing") {
          await saveOngoingResidenceProcess(targetClientId, targetUserId); // Pass IDs
        }

        console.log("Formulario enviado con éxito");
        setSubmitSuccess(true);
        setCurrentStep((prev) => prev + 1); // Avanzar al paso de éxito
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Error al enviar el formulario"
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Función para guardar un nuevo proceso de residencia
  const saveNewResidenceApplication = async (clientId: string, userId: string | null) => {
    // 1. Update the existing client record instead of inserting
    const { error: clientError } = await supabase
      .from("clients")
      .update({
        full_name: formData.fullName,
        passport_number: formData.passportNumber,
        date_of_birth: formData.dateOfBirth,
        email: formData.email, // Update email if changed
        phone_number: formData.phoneNumber,
        current_job: formData.currentJob,
        current_agency: formData.currentAgencyName,
        has_completed_form: true, // Mark form as completed
        // user_id should already be set correctly from CreateClientPage if admin is filling
      })
      .eq('id', clientId); // Use the passed clientId

    if (clientError)
      throw new Error(`Error al actualizar cliente: ${clientError.message}`);

    // 2. Insertar información extendida del cliente (this remains an insert)
    const { error: extendedInfoError } = await supabase
      .from("new_residence_applications")
      .insert({
        client_id: clientId, // Use the passed clientId
        place_of_birth: formData.placeOfBirth,
        pesel_number: formData.peselNumber,
        height_cm: parseInt(formData.height) || null, // Handle potential NaN
        eye_color: formData.eyeColor,
        hair_color: formData.hairColor,
        has_tattoos: formData.hasTattoos,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        marital_status: formData.maritalStatus,
        education_level: formData.educationLevel,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        eu_entry_date: formData.euEntryDate || null,
        poland_arrival_date: formData.polandArrivalDate || null,
        transport_method: formData.transportMethod,
        traveled_last_5_years: formData.hasTraveledLastFiveYears,
        has_relatives_in_poland: formData.relativesInPoland,
        // Add default values for progress if needed
        completed_steps: 0,
        total_steps: 6, // Example total steps
        voivodato: '', // Example default
      });

    if (extendedInfoError)
      throw new Error(
        `Error al guardar información adicional: ${extendedInfoError.message}`
      );

    // 3. Subir el documento de pasaporte si existe
    if (formData.passportFile) {
      try {
        const passportFilePath = await uploadFile(
          clientId, // Use passed clientId
          "passport",
          formData.passportFile,
          userId // Pass the target user ID
        );
        console.log(`Pasaporte subido correctamente: ${passportFilePath}`);
      } catch (error) {
        console.error("Error al subir pasaporte:", error);
        // Decide if this should throw or just warn
        // throw error;
      }
    }

    // 4. Opcional: Guardar detalles adicionales (tatuajes, viajes, familiares)
    if (formData.hasTattoos === true && formData.tattoos.length > 0) {
      await saveTattooDetails(clientId, formData.tattoos);
    }

    if (formData.hasTraveledLastFiveYears === true && formData.travels.length > 0) {
      await saveTravelDetails(clientId, formData.travels);
    }

    if (formData.relativesInPoland === true && formData.relatives.length > 0) {
      await saveRelativeDetails(clientId, formData.relatives);
    }
  };

  // Función para guardar un proceso de residencia en curso
  const saveOngoingResidenceProcess = async (clientId: string, userId: string | null) => {
    // 1. Update the existing client record
    const { error: clientError } = await supabase
      .from("clients")
      .update({
        full_name: formData.fullName,
        passport_number: formData.passportNumber,
        date_of_birth: formData.dateOfBirth,
        email: formData.email,
        phone_number: formData.phoneNumber,
        current_job: formData.currentJob,
        has_completed_form: true,
      })
      .eq('id', clientId); // Use the passed clientId

    if (clientError)
      throw new Error(`Error al actualizar cliente: ${clientError.message}`);

    // 2. Insertar la información del proceso en curso (this remains an insert)
    const { error: processError } = await supabase
      .from("ongoing_residence_processes")
      .insert({
        client_id: clientId, // Use the passed clientId
        first_name: formData.fullName.split(" ")[0],
        last_name:
          formData.lastName || formData.fullName.split(" ").slice(1).join(" "),
        has_work_permit: formData.hasWorkPermit,
        voivodato: formData.voivodeship,
        process_stage: formData.processStage,
        case_number: formData.caseNumber,
        current_address: formData.currentAddress,
        whatsapp_number: formData.whatsappNumber,
        // Add default values for progress if needed
        completed_steps: 0,
        total_steps: 5, // Example total steps
      });

    if (processError)
      throw new Error(`Error al guardar proceso: ${processError.message}`);

    // 3. Subir documentos
    if (formData.passportFile) {
      try {
        await uploadFile(clientId, "passport", formData.passportFile, userId);
      } catch (error) {
        console.error("Error al subir pasaporte:", error);
        // Decide if this should throw or just warn
      }
    }

    if (formData.yellowCard) {
      try {
        await uploadFile(clientId, "yellow_card", formData.yellowCard, userId);
      } catch (error) {
        console.error("Error al subir tarjeta amarilla:", error);
        // Decide if this should throw or just warn
      }
    }
  };

  // Función para subir archivos a Supabase Storage
  const uploadFile = async (
    clientId: string,
    documentType: string,
    file: File,
    userId: string | null // Accept target user ID
  ) => {
    // Use the passed userId, not necessarily the logged-in user's ID
    if (!userId) {
      throw new Error(
        "No se pudo identificar el usuario para la subida del archivo."
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${clientId}_${documentType}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `documents/${fileName}`; // Keep path structure simple

    const { error: uploadError } = await supabase.storage
      .from("client-documents") // Ensure this bucket name is correct
      .upload(filePath, file);

    if (uploadError)
      throw new Error(`Error al subir archivo: ${uploadError.message}`);

    // Registrar el documento en la tabla client_documents
    const { error: docError } = await supabase.from("client_documents").insert({
      client_id: clientId,
      document_type: documentType,
      file_path: filePath,
      file_name: file.name, // Store original file name
      // user_id: userId, // Associate with the target user
      status: 'Pendiente', // Default status
      upload_date: new Date().toISOString(),
    });

    if (docError)
      throw new Error(`Error al registrar documento: ${docError.message}`);
    return filePath;
  };

  // Funciones para guardar detalles adicionales (opcional) - Ensure they use the correct clientId
  const saveTattooDetails = async (
    clientId: string,
    tattoos: TattooDetail[]
  ) => {
    const tattooInserts = tattoos.map((tattoo) => ({
      client_id: clientId, // Use passed clientId
      location: tattoo.location,
    }));

    if (tattooInserts.length > 0) {
      const { error } = await supabase
        .from("client_tattoos")
        .insert(tattooInserts);

      if (error) throw new Error(`Error al guardar tatuajes: ${error.message}`);
    }
  };

  const saveTravelDetails = async (
    clientId: string,
    travels: TravelDetail[]
  ) => {
    const travelInserts = travels.map((travel) => ({
      client_id: clientId, // Use passed clientId
      start_date: travel.start_date || null,
      end_date: travel.end_date || null,
      country: travel.country,
      reason: travel.reason,
    }));

    if (travelInserts.length > 0) {
      const { error } = await supabase
        .from("client_travels")
        .insert(travelInserts);

      if (error) throw new Error(`Error al guardar viajes: ${error.message}`);
    }
  };

  const saveRelativeDetails = async (
    clientId: string,
    relatives: RelativeDetail[]
  ) => {
    const relativeInserts = relatives.map((relative) => ({
      client_id: clientId, // Use passed clientId
      relationship: relative.relationship,
      full_name: relative.full_name,
      residency_status: relative.residency_status,
    }));

    if (relativeInserts.length > 0) {
      const { error } = await supabase
        .from("client_relatives")
        .insert(relativeInserts);

      if (error)
        throw new Error(`Error al guardar familiares: ${error.message}`);
    }
  };

  // Renderizar un mensaje de éxito después del envío
  const renderSuccessMessage = () => (
    <div className="text-center py-8">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">
        ¡Registro Completado!
      </h2>
      <p className="mt-4 text-lg text-gray-600">
        La información del cliente ha sido {isAdminFilling ? 'guardada' : 'enviada'} correctamente.
        {isAdminFilling ? ' Puede gestionar al cliente ahora.' : ' Nos pondremos en contacto pronto.'}
      </p>
      <button
      onClick={() => {
        // Redirect admin to client list, client to their dashboard
        navigate(isAdminFilling ? "/admin/clientes" : "/dashboard");
      }}
        className="mt-8 inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {isAdminFilling ? 'Volver a Clientes' : 'Ir al Panel'}
      </button>
    </div>
  );

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const getTotalSteps = () => {
    // Adjust total steps if needed, maybe based on formType
    if (formType === "new") return 5; // Example: Reduced steps for simplicity
    if (formType === "ongoing") return 5; // Example: Reduced steps
    return 1; // Only selection step
  };

  // Don't render selection screen if admin is filling the form
  const renderSelectionScreen = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Seleccione el Tipo de Proceso
      </h2>
      <div className="space-y-4">
        <label
          className={`block p-6 border rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
            formData.processType === "new"
              ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="processType"
            value="new"
            checked={formData.processType === "new"}
            onChange={(e) => {
              handleInputChange(e);
              setFormType("new");
              setCurrentStep(1);
              setFormData((prev) => ({
                ...initialFormData,
                processType: "new",
              }));
            }}
            className="mr-3 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="font-medium text-gray-700">
            Necesito iniciar un nuevo proceso de residencia
          </span>
        </label>
        <label
          className={`block p-6 border rounded-lg transition-all duration-200 ease-in-out cursor-pointer ${
            formData.processType === "ongoing"
              ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <input
            type="radio"
            name="processType"
            value="ongoing"
            checked={formData.processType === "ongoing"}
            onChange={(e) => {
              handleInputChange(e);
              setFormType("ongoing");
              setCurrentStep(1);
              setFormData((prev) => ({
                ...initialFormData,
                processType: "ongoing",
              }));
            }}
            className="mr-3 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <span className="font-medium text-gray-700">
            Ya tengo un proceso de residencia en curso
          </span>
        </label>
      </div>
    </div>
  );

  // Helper to render form sections consistently
  const renderFormSection = (title: string, children: React.ReactNode) => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-6">
        {title}
      </h3>
      {children}
    </div>
  );

  // Simplified renderNewProcessForm for example
  const renderNewProcessForm = () => {
    switch (currentStep) {
      case 1: // Información Personal
        return renderFormSection(
          "Información Personal",
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Nombre Completo"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <FormInput
                label="Número de Pasaporte"
                type="text"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleInputChange}
              />
              <FormInput
                label="Lugar de Nacimiento"
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
              />
              <FormInput
                label="Fecha de Nacimiento"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
               <FormInput
                label="Correo Electrónico"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormInput
                label="Número de Teléfono"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              {/* Add other fields as needed */}
            </div>
          </>
        );
      // Add cases for other steps (2, 3, 4, 5) similar to the original code
      // ...
       case 2: // Información Familiar (Simplified)
        return renderFormSection(
          "Información Familiar",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre del Padre"
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleInputChange}
            />
            <FormInput
              label="Nombre de la Madre"
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleInputChange}
            />
             <FormSelect
              label="Estado Civil"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "single", label: "Soltero/a" },
                { value: "married", label: "Casado/a" },
                { value: "divorced", label: "Divorciado/a" },
                { value: "widowed", label: "Viudo/a" },
              ]}
            />
            <FormSelect
              label="Nivel de Educación"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "primary", label: "Primaria" },
                { value: "secondary", label: "Secundaria" },
                { value: "bachelor", label: "Licenciatura" },
                { value: "master", label: "Maestría" },
                { value: "phd", label: "Doctorado" },
              ]}
            />
          </div>
        );
       case 3: // Información de Contacto (Simplified)
        return renderFormSection(
          "Información de Contacto",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormInput
                label="Dirección"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <FormInput
              label="Ciudad"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <FormInput
              label="Código Postal"
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        );
       case 4: // Información de Viaje y Trabajo (Simplified)
        return renderFormSection(
          "Información de Viaje y Trabajo",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FormInput
                label="Trabajo Actual"
                type="text"
                name="currentJob"
                value={formData.currentJob}
                onChange={handleInputChange}
              />
              <FormInput
                label="Nombre de la Agencia Actual"
                type="text"
                name="currentAgencyName"
                value={formData.currentAgencyName}
                onChange={handleInputChange}
              />
          </div>
        );
      case 5: // Documentos
        return renderFormSection(
          "Documentos",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileUpload
                label="Subir Pasaporte"
                name="passportFile"
                onChange={handleFileChange("passportFile")}
                required={true} // Make passport required
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Simplified renderOngoingProcessForm for example
  const renderOngoingProcessForm = () => {
     switch (currentStep) {
      case 1: // Información Personal
        return renderFormSection(
          "Información Personal",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Nombre Completo"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
             <FormInput
              label="Apellidos" // Added last name for ongoing
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <FormInput
              label="Fecha de Nacimiento"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número de Pasaporte"
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
            />
          </div>
        );
      case 2: // Información Laboral
        return renderFormSection(
          "Información Laboral",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Trabajo Actual"
              type="text"
              name="currentJob"
              value={formData.currentJob}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <FormRadio
                label="¿Tienes permiso de trabajo?"
                name="hasWorkPermit"
                value={formData.hasWorkPermit}
                onChange={handleRadioChange("hasWorkPermit")}
              />
            </div>
          </div>
        );
      case 3: // Información del Proceso
        return renderFormSection(
          "Información del Proceso",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Voivodato"
              name="voivodeship"
              value={formData.voivodeship}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "dolnoslaskie", label: "Baja Silesia" },
                { value: "kujawsko-pomorskie", label: "Cuyavia-Pomerania" },
                { value: "lubelskie", label: "Lublin" },
                { value: "lubuskie", label: "Lubusz" },
                { value: "lodzkie", label: "Łódź" },
                { value: "malopolskie", label: "Pequeña Polonia" },
                { value: "mazowieckie", label: "Mazovia" },
                { value: "opolskie", label: "Opole" },
                { value: "podkarpackie", label: "Subcarpacia" },
                { value: "podlaskie", label: "Podlaquia" },
                { value: "pomorskie", label: "Pomerania" },
                { value: "slaskie", label: "Silesia" },
                { value: "swietokrzyskie", label: "Santa Cruz" },
                { value: "warminsko-mazurskie", label: "Varmia-Masuria" },
                { value: "wielkopolskie", label: "Gran Polonia" },
                { value: "zachodniopomorskie", label: "Pomerania Occidental" },
                { value: "unknown", label: "Desconocido" },
              ]}
            />
            <FormSelect
              label="Etapa del Proceso"
              name="processStage"
              value={formData.processStage}
              onChange={handleInputChange}
              options={[
                { value: "", label: "Seleccione..." },
                { value: "submitted", label: "Solicitud Presentada" },
                { value: "yellow-card", label: "Tarjeta Amarilla" },
                { value: "red-stamp", label: "Sello Rojo" },
                { value: "negative", label: "Negativo" },
                { value: "unknown", label: "Desconocido" },
              ]}
            />
            <FormInput
              label="Número de Caso (Opcional)"
              type="text"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={handleInputChange}
              required={false}
            />
          </div>
        );
      case 4: // Información de Contacto
        return renderFormSection(
          "Información de Contacto",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Número de Teléfono"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            <FormInput
              label="Número de WhatsApp"
              type="tel"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Dirección Actual"
                type="text"
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleInputChange}
              />
            </div>
            <FormInput
              label="Correo Electrónico"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
        );
      case 5: // Documentos
        return renderFormSection(
          "Documentos",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FileUpload
                label="Subir Pasaporte"
                name="passportFile"
                onChange={handleFileChange("passportFile")}
                required={true} // Passport usually required
              />
            </div>
            <div className="md:col-span-2">
              <FileUpload
                label="Tarjeta Amarilla (Opcional)"
                name="yellowCard"
                onChange={handleFileChange("yellowCard")}
                required={false}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Determine initial form type if admin is filling
  useEffect(() => {
    if (isAdminFilling) {
      // Default to 'new' process for admin filling, or could be passed in state
      setFormType("new");
      setCurrentStep(1); // Start from step 1
    }
  }, [isAdminFilling]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <ClipboardList className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {isAdminFilling ? `Formulario para Cliente ID: ${targetClientId}` : 'Registro de Proceso de Residencia'}
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            {isAdminFilling ? 'Complete la información del cliente.' : 'Complete los pasos para registrar su proceso.'}
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          {/* Hide progress bar if admin is filling and form type isn't selected yet */}
          {formType !== "selection" && !submitSuccess && (
            <div className="mb-8">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={getTotalSteps()}
              />
            </div>
          )}
          {/* Show duplicate modal only for clients, not admins */}
          {hasCompletedForm && !isAdminFilling ? (
            <DuplicatePassportModal
              isOpen={isDuplicateModalOpen}
              onClose={() => setIsDuplicateModalOpen(false)}
            />
          ) : null}

          {submitSuccess ? (
            renderSuccessMessage()
          ) :  (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Conditionally render selection screen */}
              {formType === "selection" && !isAdminFilling && renderSelectionScreen()}
              {formType === "new" && renderNewProcessForm()}
              {formType === "ongoing" && renderOngoingProcessForm()}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {submitError}
                </div>
              )}

              {/* Show navigation buttons only if a form type is selected */}
              {formType !== "selection" && (
                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mb-4 sm:mb-0"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                      Anterior
                    </button>
                  ) : (
                    <div className="w-full sm:w-auto mb-4 sm:mb-0"></div> // Placeholder
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
                    disabled={isSubmitting || isPassportDuplicate}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Procesando...
                      </>
                    ) : isPassportDuplicate ? (
                        "Proceso existente"
                      ) : currentStep === getTotalSteps() ? (
                      <>
                        Enviar{" "}
                        <Send className="ml-2 h-5 w-5" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        Siguiente{" "}
                        <ArrowRight
                          className="ml-2 h-5 w-5"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
        <footer className="mt-10 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos
            reservados.
          </p>
        </footer>
      </div>

    </div>
  );
}

export default Form;
