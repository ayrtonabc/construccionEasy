import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, FileText, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Documento {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  archivo: string;
  disponible: boolean;
}

const RecursosPage = () => {
  const { t } = useTranslation();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [documentosFiltrados, setDocumentosFiltrados] = useState<Documento[]>([]);

  // Desplazamiento automático hacia arriba cuando el componente se monta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lista de documentos disponibles para descargar
  const documentos: Documento[] = [
    // Documentos de Residencia
    {
      id: '1',
      titulo: t('downloads.doc1.title', 'Solicitud de Permiso de Residencia Temporal y Trabajo'),
      descripcion: t('downloads.doc1.description', 'Formulario principal para iniciar el trámite de residencia.'),
      categoria: 'residencia',
      archivo: '/documentos/solicitud-permiso-residencia-trabajo.pdf',
      disponible: true
    },
    {
      id: '2',
      titulo: t('downloads.doc2.title', 'Formulario de Solicitud de Número PESEL'),
      descripcion: t('downloads.doc2.description', 'Para obtener el número de identificación personal si no te lo asignan automáticamente.'),
      categoria: 'identificacion',
      archivo: '/documentos/solicitud-pesel.pdf',
      disponible: true
    },
    {
      id: '3',
      titulo: t('downloads.doc3.title', 'Declaración de Domicilio (Zameldowanie)'),
      descripcion: t('downloads.doc3.description', 'Documento oficial para registrar tu lugar de residencia en Polonia.'),
      categoria: 'residencia',
      archivo: '/documentos/declaracion-domicilio.pdf',
      disponible: true
    },
    {
      id: '4',
      titulo: t('downloads.doc4.title', 'Contrato de Trabajo o Carta de Oferta Laboral'),
      descripcion: t('downloads.doc4.description', 'Necesario si tu residencia está basada en empleo. Puede ser un contrato definitivo o una oferta formal.'),
      categoria: 'laboral',
      archivo: '/documentos/contrato-trabajo-modelo.pdf',
      disponible: true
    },
    {
      id: '5',
      titulo: t('downloads.doc5.title', 'Formulario de Cancelación de Poderes'),
      descripcion: t('downloads.doc5.description', 'Solo es necesario si otorgaste representación y quieres cancelarla.'),
      categoria: 'legal',
      archivo: '/documentos/cancelacion-poderes.pdf',
      disponible: true
    },
    {
      id: '6',
      titulo: t('downloads.doc6.title', 'Formulario de Declaración de Recursos Financieros'),
      descripcion: t('downloads.doc6.description', 'Demuestra que tienes medios suficientes para vivir en Polonia sin necesidad de asistencia social.'),
      categoria: 'residencia',
      archivo: '/documentos/declaracion-recursos-financieros.pdf',
      disponible: false
    },
    {
      id: '7',
      titulo: t('downloads.doc7.title', 'Formulario de Alojamiento o Cesión de Vivienda'),
      descripcion: t('downloads.doc7.description', 'Documento firmado por el arrendador o propietario que certifica que vives legalmente en la propiedad.'),
      categoria: 'residencia',
      archivo: '/documentos/formulario-alojamiento.pdf',
      disponible: false
    },
    {
      id: '8',
      titulo: t('downloads.doc8.title', 'Formulario de Representación (Poder Notarial)'),
      descripcion: t('downloads.doc8.description', 'Si otra persona presenta la solicitud en tu nombre.'),
      categoria: 'legal',
      archivo: '/documentos/poder-notarial.pdf',
      disponible: false
    },
    {
      id: '9',
      titulo: t('downloads.doc9.title', 'Formulario de Recolección de la Decisión'),
      descripcion: t('downloads.doc9.description', 'Documento que autoriza a otra persona a recoger la decisión en tu lugar (opcional).'),
      categoria: 'legal',
      archivo: '/documentos/formulario-recoleccion-decision.pdf',
      disponible: false
    },
    {
      id: '10',
      titulo: t('downloads.doc10.title', 'Declaración del Empleador'),
      descripcion: t('downloads.doc10.description', 'Confirmación del empleador de que aún estás trabajando o vas a ser contratado.'),
      categoria: 'laboral',
      archivo: '/documentos/declaracion-empleador.pdf',
      disponible: false
    },
    // Documentos Adicionales
    {
      id: '11',
      titulo: t('downloads.doc11.title', 'Formulario de Información Adicional sobre el Empleo (Załącznik nr 1)'),
      descripcion: t('downloads.doc11.description', 'Requerido si solicitas la Karta Pobytu por trabajo. Contiene información detallada sobre tu empleador, condiciones laborales, salario, etc.'),
      categoria: 'laboral',
      archivo: '/documentos/informacion-adicional-empleo.pdf',
      disponible: false
    },
    {
      id: '12',
      titulo: t('downloads.doc12.title', 'Formulario de Información del Estudiante (Załącznik nr 2)'),
      descripcion: t('downloads.doc12.description', 'Para quienes solicitan la residencia por estudios. Proporcionado por la universidad o institución educativa.'),
      categoria: 'estudiante',
      archivo: '/documentos/informacion-estudiante.pdf',
      disponible: false
    },
    {
      id: '13',
      titulo: t('downloads.doc13.title', 'Formulario de Información sobre Actividades Empresariales (Załącznik nr 3)'),
      descripcion: t('downloads.doc13.description', 'Si eres autónomo o tienes una empresa registrada en Polonia.'),
      categoria: 'laboral',
      archivo: '/documentos/informacion-actividades-empresariales.pdf',
      disponible: false
    },
    {
      id: '14',
      titulo: t('downloads.doc14.title', 'Certificado de Matrimonio o Nacimiento'),
      descripcion: t('downloads.doc14.description', 'Para solicitudes por reunificación familiar. También puede requerirse para hijos o cónyuge.'),
      categoria: 'familia',
      archivo: '/documentos/certificado-matrimonio-nacimiento.pdf',
      disponible: false
    },
    {
      id: '15',
      titulo: t('downloads.doc15.title', 'Declaración del Empleador sobre Continuación del Trabajo'),
      descripcion: t('downloads.doc15.description', 'Carta firmada donde el empleador declara que mantendrás tu empleo. Puede complementar el contrato laboral.'),
      categoria: 'laboral',
      archivo: '/documentos/declaracion-continuacion-trabajo.pdf',
      disponible: false
    },
    {
      id: '16',
      titulo: t('downloads.doc16.title', 'Comprobante de Estudios'),
      descripcion: t('downloads.doc16.description', 'Carta de aceptación o certificado de matrícula expedido por la universidad (si aplica).'),
      categoria: 'estudiante',
      archivo: '/documentos/comprobante-estudios.pdf',
      disponible: false
    },
    {
      id: '17',
      titulo: t('downloads.doc17.title', 'Comprobante de Seguro Médico'),
      descripcion: t('downloads.doc17.description', 'Si no estás asegurado por ZUS (seguridad social pública).'),
      categoria: 'residencia',
      archivo: '/documentos/comprobante-seguro-medico.pdf',
      disponible: false
    },
    {
      id: '18',
      titulo: t('downloads.doc18.title', 'Confirmación de Empadronamiento (Zameldowanie)'),
      descripcion: t('downloads.doc18.description', 'Es el registro oficial en tu lugar de residencia en Polonia.'),
      categoria: 'residencia',
      archivo: '/documentos/confirmacion-empadronamiento.pdf',
      disponible: false
    },
    {
      id: '19',
      titulo: t('downloads.doc19.title', 'Recibo de pago de la tasa consular / administrativa'),
      descripcion: t('downloads.doc19.description', 'Generalmente 340 PLN por solicitud de permiso de residencia temporal.'),
      categoria: 'residencia',
      archivo: '/documentos/recibo-pago-tasa.pdf',
      disponible: false
    },
    {
      id: '20',
      titulo: t('downloads.doc20.title', 'Justificante de Medios Económicos'),
      descripcion: t('downloads.doc20.description', 'Extractos bancarios, contrato de trabajo, declaración de ingresos, etc. Debes demostrar que puedes mantenerte económicamente.'),
      categoria: 'residencia',
      archivo: '/documentos/justificante-medios-economicos.pdf',
      disponible: false
    },
    {
      id: '21',
      titulo: t('downloads.doc21.title', 'Copia de Visa o Permiso de Entrada'),
      descripcion: t('downloads.doc21.description', 'Si aplica para tu caso particular.'),
      categoria: 'residencia',
      archivo: '/documentos/copia-visa-permiso.pdf',
      disponible: false
    },
    {
      id: '22',
      titulo: t('downloads.doc22.title', 'Traducciones juradas de documentos extranjeros'),
      descripcion: t('downloads.doc22.description', 'Todo documento no redactado en polaco debe estar traducido por un traductor jurado en Polonia.'),
      categoria: 'legal',
      archivo: '/documentos/traducciones-juradas.pdf',
      disponible: false
    }
  ];

  // Lista de categorías disponibles
  const categorias = [
    { id: 'todas', nombre: t('downloads.categories.all', 'Todas') },
    { id: 'residencia', nombre: t('downloads.categories.residence', 'Residencia') },
    { id: 'legal', nombre: t('downloads.categories.legal', 'Legal') },
    { id: 'identificacion', nombre: t('downloads.categories.identification', 'Identificación') },
    { id: 'laboral', nombre: t('downloads.categories.labor', 'Laboral') },
    { id: 'estudiante', nombre: t('downloads.categories.student', 'Estudiante') },
    { id: 'familia', nombre: t('downloads.categories.family', 'Familia') }
  ];

  // Filtrar documentos según búsqueda y categoría seleccionada
  useEffect(() => {
    let resultados = documentos;
    
    // Filtrar por categoría
    if (categoriaSeleccionada !== 'todas') {
      resultados = resultados.filter(doc => doc.categoria === categoriaSeleccionada);
    }
    
    // Filtrar por término de búsqueda
    if (busqueda.trim() !== '') {
      const terminoBusqueda = busqueda.toLowerCase();
      resultados = resultados.filter(doc => 
        doc.titulo.toLowerCase().includes(terminoBusqueda) || 
        doc.descripcion.toLowerCase().includes(terminoBusqueda)
      );
    }
    
    setDocumentosFiltrados(resultados);
  }, [busqueda, categoriaSeleccionada, documentos]);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t('downloads.title', 'Centro de Descargas')}
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t('downloads.subtitle', 'Acceda a documentos y formularios relacionados con procesos de residencia en Polonia')}
          </motion.p>
          
          {/* Buscador */}
          <motion.div 
            className="max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder={t('downloads.searchPlaceholder', 'Buscar documentos...')}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </motion.div>
          
          {/* Filtro de categorías */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center mr-2">
              <Filter className="h-5 w-5 text-gray-500 mr-1" />
              <span className="text-gray-600">{t('downloads.filterByCategory', 'Filtrar por categoría:')}</span>
            </div>
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                onClick={() => setCategoriaSeleccionada(categoria.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  categoriaSeleccionada === categoria.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoria.nombre}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lista de documentos */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {documentosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentosFiltrados.map((documento, index) => (
                <motion.div
                  key={documento.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border ${documento.disponible ? 'border-gray-100' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <div className={`rounded-full p-2 mr-4 ${documento.disponible ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <FileText className={`h-6 w-6 ${documento.disponible ? 'text-blue-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{documento.titulo}</h3>
                        {documento.disponible ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                            {t('downloads.available', 'Disponible')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 mt-1">
                            {t('downloads.comingSoon', 'Próximamente')}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">{documento.descripcion}</p>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categorias.find(cat => cat.id === documento.categoria)?.nombre || documento.categoria}
                      </span>
                      {documento.disponible ? (
                        <a
                          href={documento.archivo}
                          download
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {t('downloads.downloadButton', 'Descargar')}
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-gray-500 text-sm">
                          {t('downloads.notAvailableYet', 'No disponible aún')}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('downloads.noResults', 'No se encontraron documentos')}
              </h3>
              <p className="text-gray-500">
                {t('downloads.tryAnotherSearch', 'Intente con otra búsqueda o seleccione otra categoría')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Nota informativa */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            {t('downloads.noteTitle', 'Información importante')}
          </h3>
          <p className="text-blue-700 text-sm">
            {t('downloads.noteText', 'Los documentos proporcionados son solo para referencia. Asegúrese de verificar la versión más reciente en los sitios oficiales. Para asistencia con estos documentos, no dude en contactarnos.')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default RecursosPage;