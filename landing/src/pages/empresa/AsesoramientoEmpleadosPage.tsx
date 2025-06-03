import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, Users, Building, Clock, FileCheck, Award, TrendingUp, Globe, BookOpen, HeartHandshake, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AsesoramientoEmpleadosPage = () => {
  const { t } = useTranslation();

  // Servicios específicos de asesoramiento
  const servicios = [
    {
      icon: Globe,
      title: t('servicesCompany.advisoryEmployees.service1.title', 'Adaptación cultural'),
      description: t('servicesCompany.advisoryEmployees.service1.description', 'Programas de orientación cultural y lingüística para facilitar la integración de sus empleados en Polonia.')
    },
    {
      icon: BookOpen,
      title: t('servicesCompany.advisoryEmployees.service2.title', 'Formación legal'),
      description: t('servicesCompany.advisoryEmployees.service2.description', 'Capacitación sobre derechos, obligaciones y normativas laborales en Polonia para empleados extranjeros.')
    },
    {
      icon: HeartHandshake,
      title: t('servicesCompany.advisoryEmployees.service3.title', 'Apoyo continuo'),
      description: t('servicesCompany.advisoryEmployees.service3.description', 'Asistencia permanente para resolver dudas y situaciones cotidianas durante toda la estancia.')
    },
    {
      icon: Briefcase,
      title: t('servicesCompany.advisoryEmployees.service4.title', 'Gestión administrativa'),
      description: t('servicesCompany.advisoryEmployees.service4.description', 'Ayuda con trámites bancarios, sanitarios, fiscales y otros aspectos administrativos esenciales.')
    }
  ];

  // Beneficios para empresas
  const beneficios = [
    t('servicesCompany.advisoryEmployees.benefit1', 'Mayor retención de talento internacional'),
    t('servicesCompany.advisoryEmployees.benefit2', 'Reducción del estrés de adaptación en empleados extranjeros'),
    t('servicesCompany.advisoryEmployees.benefit3', 'Mejora en la productividad desde el primer día'),
    t('servicesCompany.advisoryEmployees.benefit4', 'Cumplimiento de obligaciones como empleador'),
    t('servicesCompany.advisoryEmployees.benefit5', 'Imagen corporativa fortalecida'),
    t('servicesCompany.advisoryEmployees.benefit6', 'Menor rotación de personal internacional')
  ];

  // Fases del proceso de asesoramiento
  const fases = [
    {
      numero: 1,
      titulo: t('servicesCompany.advisoryEmployees.phase1.title', 'Evaluación de necesidades'),
      descripcion: t('servicesCompany.advisoryEmployees.phase1.description', 'Analizamos las necesidades específicas de sus empleados extranjeros y su empresa.')
    },
    {
      numero: 2,
      titulo: t('servicesCompany.advisoryEmployees.phase2.title', 'Diseño del programa'),
      descripcion: t('servicesCompany.advisoryEmployees.phase2.description', 'Creamos un programa personalizado de asesoramiento adaptado a su sector y empleados.')
    },
    {
      numero: 3,
      titulo: t('servicesCompany.advisoryEmployees.phase3.title', 'Implementación'),
      descripcion: t('servicesCompany.advisoryEmployees.phase3.description', 'Ejecutamos el programa con sesiones individuales y grupales según sea necesario.')
    },
    {
      numero: 4,
      titulo: t('servicesCompany.advisoryEmployees.phase4.title', 'Seguimiento continuo'),
      descripcion: t('servicesCompany.advisoryEmployees.phase4.description', 'Mantenemos apoyo constante y evaluamos resultados para mejorar continuamente.')
    }
  ];

  // Configuración de servicios y beneficios

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {t('servicesCompany.advisoryEmployees.title', 'Asesoramiento para Empleados')}
              </h1>
              <h2 className="text-2xl text-indigo-600 font-semibold mb-6">
                {t('servicesCompany.advisoryEmployees.subtitle', 'Soluciones integrales para la adaptación de su personal internacional')}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {t('servicesCompany.advisoryEmployees.description', 'Facilitamos la integración de sus empleados extranjeros en Polonia, eliminando barreras culturales, administrativas y legales para que puedan desempeñarse al máximo desde el primer día.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  {t('servicesCompany.advisoryEmployees.requestInfoButton', 'Solicitar información')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="https://wa.me/48690430962" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
                >
                  {t('servicesCompany.advisoryEmployees.whatsappButton', 'Contactar por WhatsApp')}
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-200 rounded-full opacity-40"></div>
              <img 
                src="/img/asesoramiento-empleados.webp" 
                alt="Asesoramiento para empleados" 
                className="relative z-10 rounded-xl shadow-2xl object-cover w-full h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Servicios específicos */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('servicesCompany.advisoryEmployees.servicesTitle', 'Servicios de asesoramiento integral')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('servicesCompany.advisoryEmployees.servicesSubtitle', 'Ofrecemos soluciones completas para que sus empleados extranjeros se sientan como en casa')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicios.map((servicio, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-indigo-50 border border-gray-100"
              >
                <div className="bg-indigo-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <servicio.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{servicio.title}</h3>
                <p className="text-gray-600">{servicio.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              {t('servicesCompany.advisoryEmployees.benefitsTitle', 'Beneficios para su empresa')}
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              {t('servicesCompany.advisoryEmployees.benefitsSubtitle', 'Invertir en el bienestar y adaptación de sus empleados extranjeros genera múltiples ventajas')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex items-start"
              >
                <CheckCircle className="h-6 w-6 text-indigo-300 mr-4 flex-shrink-0 mt-1" />
                <p className="text-lg">{beneficio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('servicesCompany.advisoryEmployees.processTitle', 'Nuestro proceso de asesoramiento')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('servicesCompany.advisoryEmployees.processSubtitle', 'Un enfoque metódico y personalizado para garantizar la mejor experiencia')}
            </p>
          </div>

          <div className="relative">
            {/* Línea conectora */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {fases.map((fase, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white rounded-xl p-8 shadow-lg z-10"
                >
                  <div className="bg-indigo-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-6 mx-auto md:mx-0">
                    {fase.numero}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center md:text-left">{fase.titulo}</h3>
                  <p className="text-gray-600 text-center md:text-left">{fase.descripcion}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aquí terminan las secciones principales */}

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('servicesCompany.advisoryEmployees.ctaTitle', 'Transforme la experiencia de sus empleados internacionales')}
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
            {t('servicesCompany.advisoryEmployees.ctaSubtitle', 'Permítanos ayudarle a crear un entorno de trabajo inclusivo y productivo para su equipo multicultural')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              {t('servicesCompany.advisoryEmployees.requestProposalButton', 'Solicitar una propuesta personalizada')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a 
              href="tel:+48690430962"
              className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-md shadow-lg text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300"
            >
              {t('servicesCompany.advisoryEmployees.callNowButton', 'Llamar ahora: +48 690 430 962')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AsesoramientoEmpleadosPage;