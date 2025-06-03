import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // 1. Dirección
    addressCity: "",
    addressStreet: "",
    addressHouseNumber: "",
    addressApartmentNumber: "",
    addressPostalCode: "",

    // 2. Datos personales
    firstName: "",
    secondName: "",
    lastName: "",
    gender: "",
    birthDate: "",
    countryOfBirth: "",
    countryOfResidence: "",
    citizenship: "",
    idDocumentAuthority: "",
    idDocumentExpiryDate: "",
    idDocumentSeriesAndNumber: "",
    travelDocumentType: "",
    travelDocumentExpiryDate: "",
    travelDocumentSeriesAndNumber: "",
    passportExpiryDate: "",
    passportSeriesAndNumber: "",

    // 3. Datos adicionales
    placeOfBirth: "",
    parentsSurname: "",
    fathersFirstName: "",
    fathersSurname: "",
    mothersFirstName: "",
    mothersSurname: "",

    // 4. Estado civil
    maritalStatus: "",
    spousePESEL: "",
    spouseLastName: "",
    spouseFirstName: "",
    eventDate: "",
    eventType: "",
    eventAuthority: "",
    eventDocumentReference: "",

    // 5. Notificación
    notificationFormat: "",
    email: "",
    epuapAddress: "",

    // 6. Firma
    city: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const generatePDF = () => {
    const input = document.getElementById("form-preview");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("Wniosek_o_nadanie_PESEL.pdf");
    });
  };

  const renderFormPreview = () => (
    <div id="form-preview" className="bg-white text-sm p-8 border border-gray-300 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-center font-bold text-xl mb-4">Wniosek o nadanie numeru PESEL</h2>
      <p className="text-center text-gray-600 mb-6">Rzeczpospolita Polska EL/W/1</p>

      {/* Page 1 */}
      <div className="border-b pb-6 mb-6">
        <h3 className="font-semibold mb-2">1. Wnioskodawca</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Miejscowość:</strong> {formData.addressCity}</div>
          <div><strong>Kod pocztowy:</strong> {formData.addressPostalCode}</div>
          <div><strong>Ulica:</strong> {formData.addressStreet}</div>
          <div><strong>Numer domu:</strong> {formData.addressHouseNumber}</div>
          <div><strong>Numer lokalu:</strong> {formData.addressApartmentNumber || "-"}</div>
        </div>

        <h3 className="font-semibold mt-6 mb-2">2. Dane osoby, której dotyczy wniosek</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Imię pierwsze:</strong> {formData.firstName}</div>
          <div><strong>Imię drugie:</strong> {formData.secondName || "-"}</div>
          <div><strong>Nazwisko:</strong> {formData.lastName}</div>
          <div><strong>Płeć:</strong> {formData.gender === "K" ? "Kobieta" : formData.gender === "M" ? "Mężczyzna" : "-"}</div>
          <div><strong>Data urodzenia:</strong> {formData.birthDate}</div>
          <div><strong>Kraj urodzenia:</strong> {formData.countryOfBirth}</div>
          <div><strong>Kraj miejsca zamieszkania:</strong> {formData.countryOfResidence}</div>
          <div><strong>Obywatelstwo:</strong> {formData.citizenship}</div>
        </div>
      </div>

      {/* Page 2 */}
      <div className="border-b pb-6 mb-6">
        <h3 className="font-semibold mb-2">3. Dodatkowe dane osoby</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Miejsce urodzenia:</strong> {formData.placeOfBirth || "-"}</div>
          <div><strong>Nazwisko rodowe:</strong> {formData.parentsSurname || "-"}</div>
          <div><strong>Imię ojca:</strong> {formData.fathersFirstName || "-"}</div>
          <div><strong>Nazwisko ojca:</strong> {formData.fathersSurname || "-"}</div>
          <div><strong>Imię matki:</strong> {formData.mothersFirstName || "-"}</div>
          <div><strong>Nazwisko matki:</strong> {formData.mothersSurname || "-"}</div>
        </div>
      </div>

      {/* Page 3 */}
      <div className="border-b pb-6 mb-6">
        <h3 className="font-semibold mb-2">4. Stan cywilny</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Stan cywilny:</strong> {formData.maritalStatus}</div>
          {formData.maritalStatus === "żonaty/zamężna" && (
            <>
              <div><strong>PESEL małżonka:</strong> {formData.spousePESEL}</div>
              <div><strong>Imię małżonka:</strong> {formData.spouseFirstName}</div>
              <div><strong>Nazwisko małżonka:</strong> {formData.spouseLastName}</div>
            </>
          )}
          <div><strong>Data zdarzenia:</strong> {formData.eventDate || "-"}</div>
          <div><strong>Zdarzenie:</strong> {formData.eventType || "-"}</div>
          <div><strong>Autorzytacja:</strong> {formData.eventAuthority || "-"}</div>
          <div><strong>Sygnatura akt:</strong> {formData.eventDocumentReference || "-"}</div>
        </div>
      </div>

      {/* Page 4 */}
      <div className="border-b pb-6 mb-6">
        <h3 className="font-semibold mb-2">5. Powiadomienie</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Format powiadomienia:</strong> {formData.notificationFormat === "elektroniczna" ? "Elektroniczna" : "Papierowa"}</div>
          {formData.notificationFormat === "elektroniczna" && (
            <>
              <div><strong>Email:</strong> {formData.email || "-"}</div>
              <div><strong>ePUAP:</strong> {formData.epuapAddress || "-"}</div>
            </>
          )}
        </div>
      </div>

      {/* Page 5 */}
      <div className="border-b pb-6 mb-6">
        <h3 className="font-semibold mb-2">6. Podpisy</h3>
        <div className="grid grid-cols-2 gap-2">
          <div><strong>Miejscowość:</strong> {formData.city || "-"}</div>
          <div><strong>Data:</strong> {formData.date || "-"}</div>
        </div>
        <p className="mt-4 italic">Podpis wnioskodawcy: _________________________</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Dirección del Solicitante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Ciudad" name="addressCity" value={formData.addressCity} onChange={handleChange} />
              <Input label="Calle" name="addressStreet" value={formData.addressStreet} onChange={handleChange} />
              <Input label="Número de Casa" name="addressHouseNumber" value={formData.addressHouseNumber} onChange={handleChange} />
              <Input label="Número de Apartamento" name="addressApartmentNumber" value={formData.addressApartmentNumber} onChange={handleChange} />
              <Input label="Código Postal" name="addressPostalCode" value={formData.addressPostalCode} onChange={handleChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Datos Personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Primer Nombre" name="firstName" value={formData.firstName} onChange={handleChange} />
              <Input label="Segundo Nombre" name="secondName" value={formData.secondName} onChange={handleChange} />
              <Input label="Apellido" name="lastName" value={formData.lastName} onChange={handleChange} />
              <Select label="Género" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="K">Femenino</option>
                <option value="M">Masculino</option>
              </Select>
              <Input label="Fecha de Nacimiento (dd-mm-yyyy)" name="birthDate" value={formData.birthDate} onChange={handleChange} />
              <CountrySelect label="País de Nacimiento" name="countryOfBirth" value={formData.countryOfBirth} onChange={handleChange} />
              <CountrySelect label="País de Residencia" name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} />
              <CitizenshipSelect label="Ciudadanía o Estatus" name="citizenship" value={formData.citizenship} onChange={handleChange} />
              <Input label="Autoridad que Emite el Documento de Identidad" name="idDocumentAuthority" value={formData.idDocumentAuthority} onChange={handleChange} />
              <Input label="Vencimiento del Documento de Identidad (dd-mm-yyyy)" name="idDocumentExpiryDate" value={formData.idDocumentExpiryDate} onChange={handleChange} />
              <Input label="Serie y Número del Documento de Identidad" name="idDocumentSeriesAndNumber" value={formData.idDocumentSeriesAndNumber} onChange={handleChange} />
              <Input label="Tipo de Documento de Viaje" name="travelDocumentType" value={formData.travelDocumentType} onChange={handleChange} />
              <Input label="Vencimiento del Documento de Viaje (dd-mm-yyyy)" name="travelDocumentExpiryDate" value={formData.travelDocumentExpiryDate} onChange={handleChange} />
              <Input label="Serie y Número del Documento de Viaje" name="travelDocumentSeriesAndNumber" value={formData.travelDocumentSeriesAndNumber} onChange={handleChange} />
              <Input label="Vencimiento del Pasaporte (dd-mm-yyyy)" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleChange} />
              <Input label="Serie y Número del Pasaporte" name="passportSeriesAndNumber" value={formData.passportSeriesAndNumber} onChange={handleChange} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Datos Adicionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Lugar de Nacimiento" name="placeOfBirth" value={formData.placeOfBirth} onChange={handleChange} />
              <Input label="Apellido de Soltera" name="parentsSurname" value={formData.parentsSurname} onChange={handleChange} />
              <Input label="Nombre del Padre" name="fathersFirstName" value={formData.fathersFirstName} onChange={handleChange} />
              <Input label="Apellido Paterno" name="fathersSurname" value={formData.fathersSurname} onChange={handleChange} />
              <Input label="Nombre de la Madre" name="mothersFirstName" value={formData.mothersFirstName} onChange={handleChange} />
              <Input label="Apellido Materno" name="mothersSurname" value={formData.mothersSurname} onChange={handleChange} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Estado Civil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Estado Civil" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="kawaler/panna">Soltero/a</option>
                <option value="żonaty/zamężna">Casado/a</option>
                <option value="rozwiedziony/rozwiedziona">Divorciado/a</option>
                <option value="wdowiec/wdowa">Viudo/a</option>
              </Select>

              {formData.maritalStatus === "żonaty/zamężna" && (
                <>
                  <Input label="Número PESEL del Cónyuge" name="spousePESEL" value={formData.spousePESEL} onChange={handleChange} />
                  <Input label="Apellido del Cónyuge" name="spouseLastName" value={formData.spouseLastName} onChange={handleChange} />
                  <Input label="Nombre del Cónyuge" name="spouseFirstName" value={formData.spouseFirstName} onChange={handleChange} />
                </>
              )}

              <Input label="Fecha del Evento (dd-mm-yyyy)" name="eventDate" value={formData.eventDate} onChange={handleChange} />
              <Select label="Tipo de Evento" name="eventType" value={formData.eventType} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="zawarcie związku małżeńskiego">Matrimonio</option>
                <option value="rozwiązanie związku małżeńskiego">Disolución del Matrimonio</option>
                <option value="unieważnienie związku małżeńskiego">Nulidad del Matrimonio</option>
                <option value="zgon małżonka">Muerte del Cónyuge</option>
                <option value="zgon małżonka- znalezienie zwłok">Muerte del Cónyuge - Hallazgo del Cadáver</option>
              </Select>
              <Input label="Autoridad del Evento" name="eventAuthority" value={formData.eventAuthority} onChange={handleChange} />
              <Input label="Referencia del Documento del Evento" name="eventDocumentReference" value={formData.eventDocumentReference} onChange={handleChange} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Notificación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Formato de Notificación" name="notificationFormat" value={formData.notificationFormat} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="papierowa">Papelera</option>
                <option value="elektroniczna">Electrónica</option>
              </Select>
              {formData.notificationFormat === "elektroniczna" && (
                <>
                  <Input label="Correo Electrónico" name="email" value={formData.email} onChange={handleChange} />
                  <Input label="Dirección ePUAP" name="epuapAddress" value={formData.epuapAddress} onChange={handleChange} />
                </>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Firma y Fecha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} />
              <Input label="Fecha (dd-mm-yyyy)" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="font-bold text-lg mb-2">Aviso Legal</h3>
              <p>Declaro bajo juramento que los datos proporcionados son verdaderos y completos. Soy consciente de que proporcionar información falsa constituye un delito.</p>
            </div>
          </div>
        );
      case 7:
        return renderFormPreview();
      default:
        return null;
    }
  };

  const handleFinish = () => {
    setStep(7);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">Solicitud de Asignación de Número PESEL</h1>
          <p className="text-sm opacity-90">Formulario para ciudadanos latinoamericanos</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {["Dirección", "Datos Personales", "Adicionales", "Estado Civil", "Notificación", "Firma", "Vista Previa"].map((label, index) => (
                <div key={index} className={`flex flex-col items-center ${step > index + 1 ? "text-green-600" : step === index + 1 ? "text-blue-600" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step > index + 1 ? "border-green-600 bg-green-600 text-white" : step === index + 1 ? "border-blue-600 bg-white text-blue-600" : "border-gray-300"}`}>
                    {step > index + 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="mt-2 text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full">
              <div className="h-1 bg-blue-600 rounded-full" style={{ width: `${(step / 7) * 100}%` }}></div>
            </div>
          </div>

          {renderStepContent()}

          <div className="mt-8 flex justify-between">
            {step > 1 && step !== 7 && (
              <button onClick={handleBack} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors">
                Atrás
              </button>
            )}
            {step < 6 ? (
              <button onClick={handleNext} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Siguiente
              </button>
            ) : step === 6 ? (
              <button onClick={handleFinish} className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Finalizar y Ver Formulario
              </button>
            ) : (
              <button onClick={generatePDF} className="ml-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Descargar PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
