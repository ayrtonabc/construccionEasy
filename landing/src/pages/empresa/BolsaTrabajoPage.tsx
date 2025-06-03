import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Briefcase, MapPin, Clock, Euro, CheckCircle, Users, Building, FileCheck } from 'lucide-react';

const BolsaTrabajoPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background - Optimizado para móviles */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12 pt-20 sm:py-16 sm:pt-28 md:pt-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {t('servicesCompany.jobBoard.title', 'Bolsa de Trabajo Legal')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              {t('servicesCompany.jobBoard.intro', 'Conectamos empresas con profesionales que cuentan con estatus legal en Polonia. Oportunidades para personas con procesos de residencia en curso o finalizados.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base">
                <CheckCircle size={18} className="mr-2 text-green-300" />
                <span>{t('servicesCompany.jobBoard.feature.legalContracts', 'Contratos legales')}</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base">
                <Users size={18} className="mr-2 text-green-300" />
                <span>{t('servicesCompany.jobBoard.feature.legalResidents', 'Para residentes legales')}</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base">
                <Building size={18} className="mr-2 text-green-300" />
                <span>{t('servicesCompany.jobBoard.feature.registeredCompanies', 'Empresas registradas')}</span>
              </div>  
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-sm sm:text-base">
                <FileCheck size={18} className="mr-2 text-green-300" />
                <span>{t('servicesCompany.jobBoard.feature.processSupport', 'Apoyo en trámites')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Información sobre la bolsa de trabajo */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 sm:p-6 rounded-xl mb-8 sm:mb-10 border border-blue-100">
            <h2 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-2 sm:mb-3">{t('servicesCompany.jobBoard.howItWorks.title', '¿Cómo funciona nuestra bolsa de trabajo?')}</h2>
            <p className="text-gray-700 mb-4">
              {t('servicesCompany.jobBoard.howItWorks.description', 'La plataforma facilita la conexión entre personas con procesos de residencia legal en Polonia y empresas con vacantes disponibles. Las ofertas publicadas requieren estatus legal para trabajar.')}
            </p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-sm text-yellow-800 font-medium">
                <strong>{t('servicesCompany.jobBoard.importantNote.title', 'Importante')}:</strong> {t('servicesCompany.jobBoard.importantNote.text', 'Actuamos exclusivamente como intermediarios entre las empresas/agencias y los interesados. No tenemos responsabilidad sobre las ofertas publicadas ni intervenimos en los procesos de contratación. Nuestro único objetivo es apoyar la conexión entre ambas partes.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('servicesCompany.jobBoard.selectionProcess.title', 'Proceso de selección')}</h3>
                  <p className="text-sm text-gray-600">{t('servicesCompany.jobBoard.selectionProcess.description', 'Las ofertas incluyen información sobre requisitos y condiciones laborales.')}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full mr-3">
                  <FileCheck className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{t('servicesCompany.jobBoard.documentation.title', 'Documentación')}</h3>
                  <p className="text-sm text-gray-600">{t('servicesCompany.jobBoard.documentation.description', 'Información sobre los documentos necesarios para trabajar legalmente.')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings Section - Enhanced */}
          <div className="mb-8 sm:mb-12">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 sm:p-4 rounded-full mb-4">
                  <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                  {t('servicesCompany.jobBoard.searchJobsTitle', 'Busca oportunidades laborales')}
                </h3>
                <p className="text-gray-600 mb-5 max-w-2xl">
                  {t('servicesCompany.jobBoard.comingSoon', 'Próximamente publicaremos ofertas de empleo para personas con estatus legal en Polonia. Mientras tanto, puedes registrarte para recibir notificaciones cuando haya nuevas oportunidades disponibles.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <input 
                    type="email" 
                    placeholder={t('servicesCompany.jobBoard.emailPlaceholder', 'Tu correo electrónico')}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                    {t('servicesCompany.jobBoard.notifyButton', 'Notificarme')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sección para empresas */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">{t('servicesCompany.jobBoard.forCompaniesTitle', '¿Es una Empresa Buscando Talento Legal?')}</h2>
            <p className="text-gray-600 mb-5 sm:mb-6 max-w-3xl mx-auto px-1 sm:px-0">
              {t('servicesCompany.jobBoard.forCompaniesSubtitle', 'Publique sus ofertas de empleo y conecte con profesionales que cuentan con estatus legal para trabajar en Polonia. Información sobre documentación y proceso de contratación.')}
            </p>
            <p className="text-sm text-gray-500 italic mb-5 max-w-3xl mx-auto">
              {t('servicesCompany.jobBoard.disclaimer', 'Nuestra plataforma funciona únicamente como punto de encuentro entre empresas y candidatos. No intervenimos en los procesos de selección ni en las condiciones laborales ofrecidas.')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-4xl mx-auto">
              <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2">{t('servicesCompany.jobBoard.feature1.title', 'Candidatos disponibles')}</h3>
                <p className="text-sm text-gray-600">{t('servicesCompany.jobBoard.feature1.description', 'Acceso a profesionales con documentación legal para trabajar en Polonia.')}</p>
              </div>
              
              <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2">{t('servicesCompany.jobBoard.feature2.title', 'Información legal')}</h3>
                <p className="text-sm text-gray-600">{t('servicesCompany.jobBoard.feature2.description', 'Datos sobre requisitos para la contratación de extranjeros con residencia.')}</p>
              </div>
              
              <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
                <div className="bg-blue-100 p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 sm:mb-2">{t('servicesCompany.jobBoard.feature3.title', 'Publicación de ofertas')}</h3>
                <p className="text-sm text-gray-600">{t('servicesCompany.jobBoard.feature3.description', 'Sus ofertas visibles para personas con capacidad legal para trabajar.')}</p>
              </div>
            </div>
            
            <a 
              href="/contact"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors duration-300 text-base sm:text-lg shadow-md hover:shadow-lg"
            >
              {t('servicesCompany.jobBoard.publishOfferButton', 'Publicar Oferta')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BolsaTrabajoPage;