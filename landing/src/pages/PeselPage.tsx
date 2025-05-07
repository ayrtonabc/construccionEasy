import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Clock, Shield, HelpCircle } from 'lucide-react';
import PeselForm from '../components/PeselForm';

const PeselPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-green-500/10 inline-block rounded-full px-4 py-2 mb-6">
                <span className="text-green-600 font-medium">Servicio Gratuito PESEL</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Obtén tu Número PESEL <br />
                <span className="text-blue-600">Fácil y Rápido</span>
              </h2>
              
              <p className="text-gray-600 mb-6">
                Completa el siguiente formulario paso a paso para iniciar tu solicitud de PESEL con nuestra ayuda gratuita.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Proceso Guiado</h3>
                    <p className="text-gray-600">Te acompañamos en cada etapa del formulario.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileCheck className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Documentación Simplificada</h3>
                    <p className="text-gray-600">Asegúrate de tener toda la información correcta.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Shield className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Soporte Gratuito</h3>
                    <p className="text-gray-600">Nuestro equipo te asiste sin costo alguno.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <PeselForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-gray-600">Todo lo que necesitas saber sobre el número PESEL</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Qué es el número PESEL?</h3>
              <p className="text-gray-600">El número PESEL es un identificador único asignado a cada residente en Polonia. Se utiliza para trámites administrativos, médicos y fiscales.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Quién necesita un número PESEL?</h3>
              <p className="text-gray-600">Todos los residentes en Polonia, incluyendo extranjeros con permiso de residencia temporal o permanente, necesitan un número PESEL.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Cuánto tiempo tarda el proceso?</h3>
              <p className="text-gray-600">Normalmente, el proceso de obtención del número PESEL toma entre 2 y 4 semanas desde la presentación de la solicitud completa.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Qué documentos necesito?</h3>
              <p className="text-gray-600">Necesitarás tu pasaporte, permiso de residencia (si aplica), contrato de arrendamiento o prueba de domicilio en Polonia, y en algunos casos, certificado de nacimiento.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeselPage;