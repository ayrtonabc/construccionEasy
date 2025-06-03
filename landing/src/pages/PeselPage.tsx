import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Clock, Shield, HelpCircle } from 'lucide-react';
import PeselForm from '../components/PeselForm';
import { useTranslation } from 'react-i18next'; // Añadir import

const PeselPage = () => {
  const { t } = useTranslation(); // Añadir hook de traducción
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-green-500/10 inline-block rounded-full px-4 py-2 mb-6">
                <span className="text-green-600 font-medium">{t('peselPage.hero.badge', 'Servicio Gratuito PESEL')}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" dangerouslySetInnerHTML={{ __html: t('peselPage.hero.title', 'Obtén tu Número PESEL <br /> <span class="text-blue-600">Fácil y Rápido</span>') }} />
              
              <p className="text-gray-600 mb-6">
                {t('peselPage.hero.description', 'Completa el siguiente formulario paso a paso para iniciar tu solicitud de PESEL con nuestra ayuda gratuita.')}
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Clock className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('peselPage.hero.feature1Title', 'Proceso Guiado')}</h3>
                    <p className="text-gray-600">{t('peselPage.hero.feature1Desc', 'Te acompañamos en cada etapa del formulario.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <FileCheck className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('peselPage.hero.feature2Title', 'Documentación Simplificada')}</h3>
                    <p className="text-gray-600">{t('peselPage.hero.feature2Desc', 'Asegúrate de tener toda la información correcta.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Shield className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t('peselPage.hero.feature3Title', 'Soporte Gratuito')}</h3>
                    <p className="text-gray-600">{t('peselPage.hero.feature3Desc', 'Nuestro equipo te asiste sin costo alguno.')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('peselPage.faq.title', 'Preguntas Frecuentes')}</h2>
            <p className="text-xl text-gray-600">{t('peselPage.faq.subtitle', 'Todo lo que necesitas saber sobre el número PESEL')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('peselPage.faq.q1Title', '¿Qué es el número PESEL?')}</h3>
              <p className="text-gray-600">{t('peselPage.faq.q1Answer', 'El número PESEL es un identificador único asignado a cada residente en Polonia. Se utiliza para trámites administrativos, médicos y fiscales.')}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('peselPage.faq.q2Title', '¿Quién necesita un número PESEL?')}</h3>
              <p className="text-gray-600">{t('peselPage.faq.q2Answer', 'Todos los residentes en Polonia, incluyendo extranjeros con permiso de residencia temporal o permanente, necesitan un número PESEL.')}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('peselPage.faq.q3Title', '¿Cuánto tiempo tarda el proceso?')}</h3>
              <p className="text-gray-600">{t('peselPage.faq.q3Answer', 'Normalmente, el proceso de obtención del número PESEL toma entre 2 y 4 semanas desde la presentación de la solicitud completa.')}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('peselPage.faq.q4Title', '¿Qué documentos necesito?')}</h3>
              <p className="text-gray-600">{t('peselPage.faq.q4Answer', 'Necesitarás tu pasaporte, permiso de residencia (si aplica), contrato de arrendamiento o prueba de domicilio en Polonia, y en algunos casos, certificado de nacimiento.')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeselPage;
