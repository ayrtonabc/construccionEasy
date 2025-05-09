import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import PeselPDF from "../../assets/Wniosek_o_nadanie_PESEL (1).pdf";

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
    direccionCalle: "",
    numeroCasa: "",
    numeroEdificio: "",
    codigoPostal: "",
    ciudadDireccion: "",

    // Step 2
    primerNombre: "",
    segundoNombre: "",
    otroNombre: "",
    apellidoPaterno: "",
    genero: "",
    fechaNacimiento: "",
    paisNacimiento: "POLSKA",
    nacionalidad: "",
    pasaporteNumero: "",
    pasaporteVencimiento: "",

    // Step 3
    ciudadNacimiento: "",
    primerNombrePadre: "",
    apellidoPadre: "",
    primerNombreMadre: "",
    apellidoSolteroMadre: "",

    // Step 4
    estadoCivil: "",
    nombreConyuge: "",
    apellidoConyuge: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Función para convertir una fecha del formato YYYY-MM-DD a DD-MM-YYYY
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Función para generar el PDF
  const generatePDF = async () => {
    try {
      setIsLoading(true);

      // Fetch the PDF template
      const url = PeselPDF; // Ruta al PDF original
      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(existingPdfBytes, {
        ignoreEncryption: true,
      });

      // Get the form fields
      const form = pdfDoc.getForm();

      // Verificar los nombres de los campos disponibles
      const fields = form.getFields();
      console.log("Campos disponibles en el PDF:", form);
      console.log("Campos disponibles en el PDF:", fields.map((field) => field.getName()));
      // Mostrar los nombres de los campos en la consola

      fields.forEach((field, i) => {
        console.log(`Campo #${i + 1}:`, field.getName());
      });

      // Mapeo de campos del formulario a campos del PDF
      // Página 1 - Información de dirección
      try {
        // Usar los nombres exactos de los campos según aparecen en el PDF
        form.getTextField("Ulica").setText(formData.direccionCalle);
        form.getTextField("Numer domu").setText(formData.numeroCasa);
        form.getTextField("Numer lokalu").setText(formData.numeroEdificio);

        // Código postal (formato XX-XXX)
        const cpParts = formData.codigoPostal.split("-");
        if (cpParts.length === 2) {
          // Si el código postal ya tiene el formato XX-XXX
          form.getTextField("Kod pocztowy").setText(formData.codigoPostal);
        } else {
          // Si es necesario formatear el código postal
          const cp = formData.codigoPostal.replace(/\\D/g, "");
          if (cp.length >= 5) {
            form
              .getTextField("Kod pocztowy")
              .setText(`${cp.substring(0, 2)}-${cp.substring(2, 5)}`);
          } else {
            form.getTextField("Kod pocztowy").setText(formData.codigoPostal);
          }
        }

        form.getTextField("Miejscowość").setText(formData.ciudadDireccion);

        // Página 1 - Información personal
        form.getTextField("Imię pierwsze").setText(formData.primerNombre);
        form.getTextField("Imię drugie").setText(formData.segundoNombre);
        form.getTextField("Imiona kolejne").setText(formData.otroNombre);
        form.getTextField("Nazwisko").setText(formData.apellidoPaterno);

        // Género
        if (formData.genero === "masculino") {
          form.getCheckBox("mężczyzna").check();
        } else if (formData.genero === "femenino") {
          form.getCheckBox("kobieta").check();
        }

        // Fecha de nacimiento (formato DD-MM-YYYY)
        if (formData.fechaNacimiento) {
          const fechaFormateada = formatDate(formData.fechaNacimiento);
          form.getTextField("Data urodzenia").setText(fechaFormateada);
        }

        // País de nacimiento y nacionalidad
        form.getTextField("Kraj urodzenia").setText(formData.paisNacimiento);

        if (formData.nacionalidad === "polaca") {
          form.getCheckBox("polskie").check();
        } else if (formData.nacionalidad === "apátrida") {
          form.getCheckBox("bezpaństwowiec").check();
        } else if (formData.nacionalidad === "otra") {
          form.getCheckBox("inne").check();
        }

        // Datos del pasaporte
        form.getTextField("Seria i numer").setText(formData.pasaporteNumero);

        if (formData.pasaporteVencimiento) {
          const vencimientoFormateado = formatDate(
            formData.pasaporteVencimiento
          );
          form
            .getTextField("Data ważności paszportu")
            .setText(vencimientoFormateado);
        }

        // Página 2 - Información familiar
        form
          .getTextField("Miejsce urodzenia")
          .setText(formData.ciudadNacimiento);
        form
          .getTextField("Imię ojca (pierwsze)")
          .setText(formData.primerNombrePadre);
        form
          .getTextField("Nazwisko rodowe ojca")
          .setText(formData.apellidoPadre);
        form
          .getTextField("Imię matki (pierwsze)")
          .setText(formData.primerNombreMadre);
        form
          .getTextField("Nazwisko rodowe matki")
          .setText(formData.apellidoSolteroMadre);

        // Página 2 - Estado civil
        switch (formData.estadoCivil) {
          case "soltero":
            form.getCheckBox("kawaler / panna").check();
            break;
          case "casado":
            form.getCheckBox("żonaty / zamężna").check();
            // Información del cónyuge
            form.getTextField("Imię małżonka").setText(formData.nombreConyuge);
            form
              .getTextField("Nazwisko rodowe małżonka")
              .setText(formData.apellidoConyuge);
            break;
          case "divorciado":
            form.getCheckBox("rozwiedziony / rozwiedziona").check();
            break;
          case "viudo":
            form.getCheckBox("wdowiec / wdowa").check();
            break;
        }

        // Página 3 - Base legal (siempre la misma)
        form
          .getTextField("Podstawa prawna")
          .setText(
            "Paragraf 6, 8 rozporządzenia Ministra Cyfryzacji z dnia 26 czerwca 2020 r. w sprawie profilu zaufanego i podpisu zaufanego (tj. Dz.U. z 2020 r. poz. 1194)"
          );

        // Página 4 - Fecha y lugar
        const today = new Date();
        const formattedToday = `${String(today.getDate()).padStart(
          2,
          "0"
        )}-${String(today.getMonth() + 1).padStart(
          2,
          "0"
        )}-${today.getFullYear()}`;
        form.getTextField("Data").setText(formattedToday);
        // Usar el mismo campo Miejscowość para la ciudad final
        const miejscowoscFields = fields.filter(
          (field) => field.getName() === "Miejscowość"
        );
        if (miejscowoscFields.length > 1) {
          // Si hay más de un campo con el mismo nombre, usar el segundo
          (miejscowoscFields[1] as any).setText(formData.ciudadDireccion);
        }
      } catch (fieldError: any) {
        console.error("Error al completar un campo específico:", fieldError);
        throw new Error(`Error al completar el campo: ${fieldError.message}`);
      }

      // Guardar y descargar el PDF
      const pdfBytes = await pdfDoc.save();

      // Crear un blob y descargarlo
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `solicitud_pesel_${formData.primerNombre}_${formData.apellidoPaterno}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsLoading(false);

      // Mensaje de éxito solo después de completar el proceso
      alert(
        "Solicitud procesada con éxito. Se ha descargado el PDF con sus datos."
      );
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert(`Hubo un error al generar el PDF: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar datos necesarios
    if (
      !formData.primerNombre ||
      !formData.apellidoPaterno ||
      !formData.fechaNacimiento
    ) {
      alert(
        "Por favor complete al menos los campos obligatorios: Nombre, Apellido y Fecha de Nacimiento"
      );
      return;
    }

    // Solo procesar cuando estamos en el paso 4
    if (currentStep === 4) {
      // Generar el PDF
      await generatePDF();
    } else {
      // Si no estamos en el último paso, avanzar al siguiente
      nextStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Paso 1: Dirección en Polonia
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección: Calle
              </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Número casa
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Número Edificio/Apartamento
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Código Postal
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
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
            <h3 className="text-lg font-semibold text-gray-900">
              Paso 2: Información Personal
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primer Nombre
                </label>
                <input
                  type="text"
                  name="primerNombre"
                  value={formData.primerNombre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Segundo Nombre
                </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Otro Nombre
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Apellido Paterno
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Género
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  País de Nacimiento
                </label>
                <input
                  type="text"
                  name="paisNacimiento"
                  value={formData.paisNacimiento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nacionalidad
                </label>
                <select
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="polaca">Polaca</option>
                  <option value="apátrida">Apátrida</option>
                  <option value="otra">Otra</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Pasaporte
                </label>
                <input
                  type="text"
                  name="pasaporteNumero"
                  value={formData.pasaporteNumero}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fecha de Vencimiento
                </label>
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
            <h3 className="text-lg font-semibold text-gray-900">
              Paso 3: Información Familiar
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ciudad de Nacimiento
              </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Primer Nombre del Padre
                </label>
                <input
                  type="text"
                  name="primerNombrePadre"
                  value={formData.primerNombrePadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido del Padre
                </label>
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
                <label className="block text-sm font-medium text-gray-700">
                  Primer Nombre de la Madre
                </label>
                <input
                  type="text"
                  name="primerNombreMadre"
                  value={formData.primerNombreMadre}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Apellido de Soltera de la Madre
                </label>
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
            <h3 className="text-lg font-semibold text-gray-900">
              Paso 4: Estado Civil
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado Civil
              </label>
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

            {formData.estadoCivil === "casado" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Cónyuge
                  </label>
                  <input
                    type="text"
                    name="nombreConyuge"
                    value={formData.nombreConyuge}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Apellido del Cónyuge
                  </label>
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
        <h2 className="text-xl font-semibold text-gray-900">
          Solicitud de PESEL
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Completa el formulario para generar tu solicitud oficial en formato
          PDF
        </p>
        <div className="mt-4">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm text-gray-600">
              Paso {currentStep} de 4
            </span>
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
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              currentStep === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
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
              disabled={isLoading}
              className={`flex items-center px-6 py-2 ${
                isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } text-white rounded-md text-sm font-medium`}
            >
              {isLoading ? "Generando PDF..." : "Enviar Solicitud"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PeselForm;
