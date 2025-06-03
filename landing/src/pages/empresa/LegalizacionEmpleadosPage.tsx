import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle, Users, Building, Clock, FileCheck, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LegalizacionEmpleadosPage = () => {
  const { t } = useTranslation();

  // Beneficios clave para empresas
  const beneficios = [
    {
      icon: Clock,
      title: t('servicesCompany.residenceEmployees.benefit1.title', 'Ahorro de tiempo'),
      description: t('servicesCompany.residenceEmployees.benefit1.description', 'Reduzca hasta un 70% el tiempo dedicado a trámites migratorios de sus empleados.')
    },
    {
      icon: FileCheck,
      title: t('servicesCompany.residenceEmployees.benefit2.title', 'Cumplimiento legal garantizado'),
      description: t('servicesCompany.residenceEmployees.benefit2.description', 'Aseguramos que todos los procesos cumplan con la normativa vigente, eliminando riesgos legales.')
    },
    {
      icon: Users,
      title: t('servicesCompany.residenceEmployees.benefit3.title', 'Retención de talento'),
      description: t('servicesCompany.residenceEmployees.benefit3.description', 'Facilite la permanencia de sus mejores profesionales extranjeros sin preocupaciones migratorias.')
    },
    {
      icon: TrendingUp,
      title: t('servicesCompany.residenceEmployees.benefit4.title', 'Mayor productividad'),
      description: t('servicesCompany.residenceEmployees.benefit4.description', 'Sus empleados pueden enfocarse en su trabajo mientras nosotros nos encargamos de su situación legal.')
    }
  ];

  // Estadísticas impactantes
  const estadisticas = [
    { 
      valor: t('servicesCompany.residenceEmployees.stat1.value', '98%'), 
      descripcion: t('servicesCompany.residenceEmployees.stat1.description', 'Tasa de éxito en trámites') 
    },
    { 
      valor: t('servicesCompany.residenceEmployees.stat2.value', '+500'), 
      descripcion: t('servicesCompany.residenceEmployees.stat2.description', 'Empresas confían en nosotros') 
    },
    { 
      valor: t('servicesCompany.residenceEmployees.stat3.value', '-60%'), 
      descripcion: t('servicesCompany.residenceEmployees.stat3.description', 'Reducción en costos administrativos') 
    },
    { 
      valor: t('servicesCompany.residenceEmployees.stat4.value', '+2000'), 
      descripcion: t('servicesCompany.residenceEmployees.stat4.description', 'Empleados legalizados') 
    }
  ];

  // Pasos del proceso
  const procesoLegalizacion = [
    {
      numero: '01',
      titulo: t('servicesCompany.residenceEmployees.step1.title', 'Evaluación inicial'),
      descripcion: t('servicesCompany.residenceEmployees.step1.description', 'Analizamos la situación específica de cada empleado y los requisitos para su legalización.')
    },
    {
      numero: '02',
      titulo: t('servicesCompany.residenceEmployees.step2.title', 'Preparación de documentación'),
      descripcion: t('servicesCompany.residenceEmployees.step2.description', 'Recopilamos y preparamos todos los documentos necesarios según los requisitos legales.')
    },
    {
      numero: '03',
      titulo: t('servicesCompany.residenceEmployees.step3.title', 'Presentación de solicitudes'),
      descripcion: t('servicesCompany.residenceEmployees.step3.description', 'Gestionamos la presentación de todas las solicitudes ante las autoridades competentes.')
    },
    {
      numero: '04',
      titulo: t('servicesCompany.residenceEmployees.step4.title', 'Seguimiento y resolución'),
      descripcion: t('servicesCompany.residenceEmployees.step4.description', 'Monitoreamos el proceso y respondemos a cualquier requerimiento adicional hasta su resolución.')
    }
  ];

  // Testimonios de clientes
  const testimonios = [
    {
      nombre: t('servicesCompany.residenceEmployees.testimonial1.name', 'María Rodríguez'),
      cargo: t('servicesCompany.residenceEmployees.testimonial1.position', 'Directora de RRHH, Constructora Internacional'),
      texto: t('servicesCompany.residenceEmployees.testimonial1.text', 'Gracias a Easy Process, hemos podido incorporar a más de 50 trabajadores extranjeros sin ninguna complicación legal. Su servicio es impecable.')
    },
    {
      nombre: t('servicesCompany.residenceEmployees.testimonial2.name', 'Alejandro Méndez'),
      cargo: t('servicesCompany.residenceEmployees.testimonial2.position', 'CEO, Agencia de Reclutamiento Laboral'),
      texto: t('servicesCompany.residenceEmployees.testimonial2.text', 'Trabajar con Easy Process ha transformado nuestra capacidad para ofrecer trabajadores extranjeros a nuestros clientes. Un aliado indispensable.')
    }
  ];

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
                {t('servicesCompany.residenceEmployees.title', 'Legalización de Estancia para Empleados')}
              </h1>
              <h2 className="text-2xl text-blue-600 font-semibold mb-6">
                {t('servicesCompany.residenceEmployees.subtitle', 'Soluciones migratorias integrales para empresas')}
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {t('servicesCompany.residenceEmployees.description', 'Permita que su empresa crezca sin límites. Nos encargamos de todos los aspectos legales para que sus empleados extranjeros trabajen sin preocupaciones migratorias, mientras usted se enfoca en lo que realmente importa: su negocio.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  {t('servicesCompany.residenceEmployees.requestButton', 'Solicitar asesoría gratuita')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a 
                  href="https://wa.me/48690430962" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                >
                  {t('servicesCompany.residenceEmployees.whatsappButton', 'Contactar por WhatsApp')}
                </a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>
              <img 
                src="/img/legalizacion-empleados.webp" 
                alt="Legalización de estancia para empleados" 
                className="relative z-10 rounded-xl shadow-2xl object-cover w-full h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {estadisticas.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white"
              >
                <p className="text-4xl font-bold mb-2">{stat.valor}</p>
                <p className="text-sm">{stat.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('servicesCompany.residenceEmployees.benefitsTitle', 'Beneficios para su empresa')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('servicesCompany.residenceEmployees.benefitsSubtitle', 'Optimice sus recursos y elimine las preocupaciones relacionadas con la situación migratoria de sus empleados')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-50 border border-gray-100"
              >
                <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                  <beneficio.icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{beneficio.title}</h3>
                <p className="text-gray-600">{beneficio.description}</p>
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
              {t('servicesCompany.residenceEmployees.processTitle', 'Nuestro proceso de legalización')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('servicesCompany.residenceEmployees.processSubtitle', 'Un enfoque estructurado y eficiente para garantizar resultados óptimos')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {procesoLegalizacion.map((paso, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-xl p-8 shadow-lg border-t-4 border-blue-500"
              >
                <div className="absolute -top-5 left-8 bg-blue-600 text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center">
                  {paso.numero}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-4">{paso.titulo}</h3>
                <p className="text-gray-600">{paso.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección eliminada de testimonios */}

      {/* CTA Final */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('servicesCompany.residenceEmployees.ctaTitle', 'Optimice la gestión migratoria de su empresa hoy mismo')}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            {t('servicesCompany.residenceEmployees.ctaDescription', 'Permita que sus empleados se enfoquen en su trabajo mientras nosotros nos encargamos de su situación legal en Polonia')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/contact"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md shadow-lg text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {t('servicesCompany.residenceEmployees.ctaButton', 'Solicitar una consulta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a 
              href="tel:+48690430962"
              className="inline-flex items-center px-8 py-4 border border-white text-lg font-medium rounded-md shadow-lg text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300"
            >
              {t('servicesCompany.residenceEmployees.callButton', 'Llamar ahora: +48 690 430 962')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalizacionEmpleadosPage;