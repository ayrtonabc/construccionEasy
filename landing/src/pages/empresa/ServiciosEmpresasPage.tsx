import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ServiciosEmpresasPage = () => {
  const { t } = useTranslation();

  const companyServices = [
    {
      name: t('navbar.services_company_submenu.residence_employees'),
      description: t('servicesCompany.residenceEmployeesDesc', 'Servicios de legalización de estancia para los empleados de su empresa.'),
      link: '/servicios-empresas/legalizacion-empleados',
      icon: '📄' // Placeholder icon
    },
    {
      name: t('navbar.services_company_submenu.advisory_employees'),
      description: t('servicesCompany.advisoryEmployeesDesc', 'Asesoramiento integral para sus empleados en Polonia.'),
      link: '/servicios-empresas/asesoramiento-empleados',
      icon: '🤝' // Placeholder icon
    },
    {
      name: t('navbar.services_company_submenu.job_board'),
      description: t('servicesCompany.jobBoardDesc', 'Acceso a nuestra bolsa de trabajo para encontrar el talento que necesita.'),
      link: '/servicios-empresas/bolsa-trabajo',
      icon: '👥' // Placeholder icon
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 pt-24 sm:pt-32">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
          {t('servicesCompany.title', 'Servicios para Empresas')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('servicesCompany.subtitle', 'Ofrecemos soluciones integrales para ayudar a su empresa a crecer y gestionar su personal extranjero en Polonia.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companyServices.map((service) => (
          <Link 
            key={service.name} 
            to={service.link} 
            className="block bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-6 text-blue-600">{service.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">{service.name}</h2>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <span className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300">
              {t('servicesCompany.learnMore', 'Saber más')} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServiciosEmpresasPage;