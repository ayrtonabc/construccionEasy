import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormData {
  // Step 1 - Dirección en Polonia
  direccionCalle: string;
  numeroCasa: string;
  numeroEdificio: string;
  codigoPostal: string;
  ciudadDireccion: string;
  
  // Step 2 - Información Personal
  primerNombre: string;
  segundoNombre: string;
  otroNombre: string;
  apellidoPaterno: string;
  genero: string;
  fechaNacimiento: string;
  paisNacimiento: string;
  nacionalidad: string;
  pasaporteNumero: string;
  pasaporteVencimiento: string;
  
  // Step 3 - Información Familiar
  ciudadNacimiento: string;
  primerNombrePadre: string;
  apellidoPadre: string;
  primerNombreMadre: string;
  apellidoSolteroMadre: string;
  
  // Step 4 - Estado Civil
  estadoCivil: string;
  nombreConyuge: string;
  apellidoConyuge: string;
}

const PeselForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    direccionCalle: '',
    numeroCasa: '',
    numeroEdificio: '',
    codigoPostal: '',
    ciudadDireccion: '',
    
    // Step 2
    primerNombre: '',
    segundoNombre: '',
    otroNombre: '',
    apellidoPaterno: '',
    genero: '',
    fechaNacimiento: '',
    paisNacimiento: '',
    nacionalidad: '',
    pasaporteNumero: '',
    pasaporteVencimiento: '',
    
    // Step 3
    ciudadNacimiento: '',
    primerNombrePadre: '',
    apellidoPadre: '',
    primerNombreMadre: '',
    apellidoSolteroMadre: '',
    
    // Step 4
    estadoCivil: '',
    nombreConyuge: '',
    apellidoConyuge: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos del formulario
    console.log('Formulario enviado:', formData);
    // Mostrar mensaje de éxito o redireccionar
    alert('Solicitud enviada con éxito. Nos pondremos en contacto contigo pronto.');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paso 1: Dirección en Polonia</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección: Calle</label>
              <input
                type="text"
                name="direccionCalle"
                value={formData.direccionCalle}
                onChange={handleChange}
                placeholder="Nombre de la calle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Número casa</label>
                <input
                  type="text"
                  name="numeroCasa"
                  value={formData.numeroCasa}
                  onChange={handleChange}
                  placeholder="Ej: 10"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Número Edificio/Apartamento</label>
                <input
                  type="text"
                  name="numeroEdificio"
                  value={formData.numeroEdificio}
                  onChange={handleChange}
                  placeholder="Ej: 5A (Opcional)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  placeholder="Formato: XX-XXX"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input
                  type="text"
                  name="ciudadDireccion"
                  value={formData.ciudadDireccion}
                  onChange={handleChange}
                  placeholder="Ciudad de residencia"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paso 2: Información Personal</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primer Nombre</label>
                <input
                  type="text"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Segundo Nombre</label>
                <input
                  type="text"
                  name="segundoNombre"
                  value={formData.segundoNombre}
                  onChange={handleChange}
                  placeholder="(Opcional)"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Otro Nombre</label>
              <input
                type="text"
                name="otroNombre"
                value={formData.otroNombre}
                onChange={handleChange}
                placeholder="(Opcional)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Apellido Paterno</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">País de Nacimiento</label>
                <input
                  type="text"
                  name="paisNacimiento"
                  value={formData.paisNacimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nacionalidad</label>
                <input
                  type="text"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Número de Pasaporte</label>
                <input
                  type="text"
                  name="pasaporteNumero"
                  value={formData.pasaporteNumero}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="pasaporteVencimiento"
                  value={formData.pasaporteVencimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paso 3: Información Familiar</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad de Nacimiento</label>
              <input
                type="text"
                name="ciudadNacimiento"
                value={formData.ciudadNacimiento}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primer Nombre del Padre</label>
                <input
                  type="text"
                  name="primerNombrePadre"
                  value={formData.primerNombrePadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido del Padre</label>
                <input
                  type="text"
                  name="apellidoPadre"
                  value={formData.apellidoPadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primer Nombre de la Madre</label>
                <input
                  type="text"
                  name="primerNombreMadre"
                  value={formData.primerNombreMadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido de Soltera de la Madre</label>
                <input
                  type="text"
                  name="apellidoSolteroMadre"
                  value={formData.apellidoSolteroMadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Paso 4: Estado Civil</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado Civil</label>
              <select
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Seleccionar</option>
                <option value="soltero">Soltero/a</option>
                <option value="casado">Casado/a</option>
                <option value="divorciado">Divorciado/a</option>
                <option value="viudo">Viudo/a</option>
              </select>
            </div>
            
            {formData.estadoCivil === 'casado' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre del Cónyuge</label>
                  <input
                    type="text"
                    name="nombreConyuge"
                    value={formData.nombreConyuge}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido del Cónyuge</label>
                  <input
                    type="text"
                    name="apellidoConyuge"
                    value={formData.apellidoConyuge}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Solicitud de PESEL</h2>
        <div className="mt-2">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm text-gray-600">Paso {currentStep} de 4</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${currentStep === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </button>
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            >
              Enviar Solicitud
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PeselForm;