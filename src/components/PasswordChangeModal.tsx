import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Modal from './ModalComponent';
import { supabase } from '../lib/supabase/client';

interface PasswordChangeModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  open,
  onClose,
  userId,
  onSuccess
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Verificar si el usuario fue creado por admin al cargar el componente
  useEffect(() => {
    const checkUserType = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('first_login_completed, created_by_admin')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        // Solo mostrar modal para usuarios creados por admin y que no han completado el primer login
        if (data?.created_by_admin && !data?.first_login_completed) {
          setIsAdminUser(true);
        } else {
          setIsAdminUser(false);
          // Cerrar modal automáticamente si no aplica
          if (open) onClose();
        }
      } catch (error: any) {
        console.error('Error verificando tipo de usuario:', error);
        setIsAdminUser(false);
        if (open) onClose();
      }
    };

    if (open) {
      checkUserType();
    }
  }, [open, userId, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Actualizar la contraseña en Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Actualizar el flag de primer inicio de sesión en la tabla clients
      const { error: updateError } = await supabase
        .from('clients')
        .update({ first_login_completed: true })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error: any) {
      console.error('Error al cambiar la contraseña:', error);
      setError(error.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Cambio de contraseña requerido"
      subtitle="Por seguridad, debes cambiar tu contraseña temporal"
      open={open}
      setOpen={() => {}}
      footer={
        <div className="flex justify-end w-full">
          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`px-4 py-2 rounded-md text-white font-medium ${loading ? 'bg-gray-400' : success ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors`}
          >
            {loading ? 'Procesando...' : success ? 'Contraseña actualizada' : 'Cambiar contraseña'}
          </button>
        </div>
      }
    >
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>¡Contraseña actualizada correctamente!</span>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-gray-700 mb-4">
            Tu cuenta ha sido creada por un administrador. Por razones de seguridad, debes cambiar la contraseña temporal que te fue asignada antes de continuar.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                disabled={loading || success}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
                required
                disabled={loading || success}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;