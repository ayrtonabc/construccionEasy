import React, { useState } from "react";
    import { supabase } from "../../lib/supabase/client";
    import { UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, X, Edit } from "lucide-react"; // Added Edit icon
    import { useNavigate } from "react-router-dom";

    export default function CreateClientPage() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [success, setSuccess] = useState<string | null>(null);
      const [newlyCreatedClientId, setNewlyCreatedClientId] = useState<string | null>(null); // Store the new client's ID
      const navigate = useNavigate();

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        setNewlyCreatedClientId(null); // Reset on new submission

        try {
          // 1. Create user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              // Assuming email confirmation is disabled in Supabase settings for admin creation
            },
          });

          if (authError) {
            if (authError.message.includes("User already registered")) {
              throw new Error("Este correo electrónico ya está registrado.");
            }
             if (authError.message.includes("Password should be at least 6 characters")) {
              throw new Error("La contraseña debe tener al menos 6 caracteres.");
            }
            throw authError;
          }

          if (!authData.user) {
            throw new Error("No se pudo crear el usuario en Supabase Auth.");
          }

          const userId = authData.user.id;
          const username = email.split('@')[0];

          // 2. Create entry in 'users' table
          const { error: userError } = await supabase.from("users").insert({
            id: userId,
            email: email,
            username: username,
            role: "client",
            is_active: true,
          });

          if (userError) {
             if (userError.message.includes('duplicate key value violates unique constraint "users_username_key"')) {
               throw new Error(`El nombre de usuario "${username}" derivado del email ya existe. Intente con otro email.`);
             }
            // Consider cleanup if needed, though complex without admin privileges for auth deletion
            console.error("Error creating user profile, manual cleanup might be needed:", userError);
            throw new Error(`Error al crear perfil de usuario: ${userError.message}`);
          }

          // 3. Create entry in 'clients' table (with placeholders)
          const { data: clientInsertData, error: clientError } = await supabase.from("clients").insert({
            user_id: userId,
            email: email,
            full_name: email, // Placeholder
            passport_number: `TEMP-${Date.now()}`, // Placeholder - Ensure uniqueness
            date_of_birth: new Date().toISOString().split('T')[0], // Placeholder
            phone_number: '000000000', // Placeholder
            has_completed_form: false,
          }).select('id').single(); // Select the ID of the newly created client

          if (clientError) {
            console.error("Error creating client record, manual cleanup might be needed:", clientError);
            throw new Error(`Error al crear registro de cliente: ${clientError.message}`);
          }

          if (!clientInsertData || !clientInsertData.id) {
            throw new Error("No se pudo obtener el ID del cliente recién creado.");
          }

          const createdClientId = clientInsertData.id; // Get the actual client ID

          setSuccess(`Cliente "${email}" creado exitosamente.`);
          setNewlyCreatedClientId(createdClientId); // Store the ID for the button
          setEmail(""); // Clear form only on success
          setPassword("");

        } catch (error: any) {
          console.error("Error creating client:", error);
          setError(error.message || "Ocurrió un error inesperado.");
        } finally {
          setLoading(false);
        }
      };

      const handleCompleteForm = () => {
        if (newlyCreatedClientId) {
          // Navigate to the form, passing the client ID via state
          navigate('/form', { state: { clientId: newlyCreatedClientId, isAdminFilling: true } });
        }
      };

      return (
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <UserPlus className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Cliente</h1>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
                <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
                  <X size={18} />
                </button>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start justify-between">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{success}</span>
                </div>
                <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Show button to complete form only after successful creation */}
            {newlyCreatedClientId && (
              <div className="mb-6 text-center">
                <button
                  onClick={handleCompleteForm}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Completar Formulario del Cliente
                </button>
                 <p className="mt-2 text-sm text-gray-500">
                   O puede crear otro cliente a continuación.
                 </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico del Cliente
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="cliente@email.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña Temporal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={6} // Supabase default minimum password length
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres. El cliente podrá cambiarla después.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cliente...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear Cliente
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      );
    }
