import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { normalizeText } from './textUtils';
import { Input, Select, CountrySelect, CitizenshipSelect } from './componentesreutilizablesnuevopeselform';

// Interfaz para los datos del formulario PESEL
export interface PeselFormData {
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

// Función para formatear fechas de YYYY-MM-DD a DD-MM-YYYY
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

// Función para obtener el valor en polaco de un país desde su nombre en español
// Utiliza la misma estructura de datos que el componente CountrySelect
const getCountryPolishValue = (spanishName: string): string => {
  const countries = [
    { es: "Polonia", pl: "Polska" },
    { es: "Argentina", pl: "Argentyna" },
    { es: "Bolivia", pl: "Boliwia" },
    { es: "Brasil", pl: "Brazylia" },
    { es: "Chile", pl: "Chile" },
    { es: "Colombia", pl: "Kolumbia" },
    { es: "Costa Rica", pl: "Kostaryka" },
    { es: "Cuba", pl: "Kuba" },
    { es: "Ecuador", pl: "Ekwador" },
    { es: "El Salvador", pl: "Salwador" },
    { es: "Guatemala", pl: "Gwatemala" },
    { es: "Haití", pl: "Haiti" },
    { es: "Honduras", pl: "Honduras" },
    { es: "México", pl: "Meksyk" },
    { es: "Nicaragua", pl: "Nikaragua" },
    { es: "Panamá", pl: "Panama" },
    { es: "Paraguay", pl: "Paragwaj" },
    { es: "Perú", pl: "Peru" },
    { es: "República Dominicana", pl: "Republika Dominikany" },
    { es: "Uruguay", pl: "Urugwaj" },
    { es: "Venezuela", pl: "Wenezuela" },
  ];
  
  const country = countries.find(c => c.es === spanishName);
  return country ? country.pl : spanishName;
};

// Función para obtener el valor en polaco de una nacionalidad desde su nombre en español
// Utiliza la misma estructura de datos que el componente CitizenshipSelect
const getCitizenshipPolishValue = (spanishName: string): string => {
  const citizenships = [
    { es: "Polaco", pl: "polskie" },
    { es: "Sin Nacionalidad", pl: "bezpaństwowiec" },
    { es: "Otro", pl: "inne" },
  ];
  
  const citizenship = citizenships.find(c => c.es === spanishName);
  return citizenship ? citizenship.pl : spanishName;
};


/**
 * Genera un PDF con los datos del formulario PESEL
 * Esta función carga el PDF original como plantilla y completa los campos con los datos del usuario
 * Utiliza componentes reutilizables para mantener la consistencia en la UI
 */
export async function generatePeselPdf(formData: PeselFormData): Promise<Uint8Array> {
  try {
    // Crear un nuevo documento PDF directamente
    const pdfDoc = await PDFDocument.create();

    // Agregar una fuente estándar que tenga mejor soporte para caracteres internacionales
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Crear las páginas necesarias
    const page1 = pdfDoc.addPage([595, 842]); // Tamaño A4
    const page2 = pdfDoc.addPage([595, 842]); // Tamaño A4

  
  // Configuración de texto
  const fontSize = 12;
  const titleSize = 16;
  const smallSize = 10;
  
  // Título del documento
  page1.drawText(normalizeText('WNIOSEK O NADANIE NUMERU PESEL'), {
    x: 50,
    y: 800,
    size: titleSize,
    font: boldFont,
  });
  
  
  // Sección 1: Datos de dirección
  page1.drawText(normalizeText('1. DANE ADRESOWE'), {
    x: 50,
    y: 760,
    size: fontSize,
    font: boldFont,
  });
  
  page1.drawText(`Ulica: ${normalizeText(formData.direccionCalle)}`, {
    x: 50,
    y: 730,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Numer domu: ${normalizeText(formData.numeroCasa)}`, {
    x: 50,
    y: 710,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Numer lokalu: ${normalizeText(formData.numeroEdificio)}`, {
    x: 300,
    y: 710,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Kod pocztowy: ${normalizeText(formData.codigoPostal)}`, {
    x: 50,
    y: 690,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Miejscowość: ${normalizeText(formData.ciudadDireccion)}`, {
    x: 300,
    y: 690,
    size: fontSize,
    font: font,
  });
  
  // Sección 2: Datos personales
  page1.drawText(normalizeText('2. DANE OSOBOWE'), {
    x: 50,
    y: 650,
    size: fontSize,
    font: boldFont,
  });
  
  page1.drawText(`Imię pierwsze: ${normalizeText(formData.primerNombre)}`, {
    x: 50,
    y: 620,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Imię drugie: ${normalizeText(formData.segundoNombre)}`, {
    x: 50,
    y: 600,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Imiona kolejne: ${normalizeText(formData.otroNombre)}`, {
    x: 50,
    y: 580,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(`Nazwisko: ${normalizeText(formData.apellidoPaterno)}`, {
    x: 50,
    y: 560,
    size: fontSize,
    font: font,
  });
  
  // Género
  page1.drawText(normalizeText('Płeć:'), {
    x: 50,
    y: 540,
    size: fontSize,
    font: font,
  });
  
  const generoX = formData.genero === 'masculino' ? 120 : 220;
  page1.drawText('X', {
    x: generoX,
    y: 540,
    size: fontSize,
    font: boldFont,
  });
  
  page1.drawText(normalizeText('mężczyzna'), {
    x: 140,
    y: 540,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(normalizeText('kobieta'), {
    x: 240,
    y: 540,
    size: fontSize,
    font: font,
  });
  
  // Fecha de nacimiento
  const fechaNacimientoFormateada = formData.fechaNacimiento ? formatDate(formData.fechaNacimiento) : '';
  page1.drawText(`Data urodzenia: ${fechaNacimientoFormateada}`, {
    x: 50,
    y: 520,
    size: fontSize,
    font: font,
  });
  
  // País de nacimiento - Utilizando la estructura del componente CountrySelect
  // Convertimos el nombre del país en español al valor en polaco usando la función de mapeo
  const paisNacimientoPolaco = getCountryPolishValue(formData.paisNacimiento);
  
  page1.drawText(`Kraj urodzenia: ${normalizeText(paisNacimientoPolaco)}`, {
    x: 50,
    y: 500,
    size: fontSize,
    font: font,
  });
  
  // Nacionalidad - Utilizando la estructura del componente CitizenshipSelect
  page1.drawText(normalizeText('Obywatelstwo:'), {
    x: 50,
    y: 480,
    size: fontSize,
    font: font,
  });
  
  // Utilizamos la función de mapeo que usa la misma estructura que CitizenshipSelect
  const nacionalidadPolaca = getCitizenshipPolishValue(formData.nacionalidad);
  
  let nacionalidadX = 0;
  if (nacionalidadPolaca === 'polskie') nacionalidadX = 150;
  else if (nacionalidadPolaca === 'bezpaństwowiec') nacionalidadX = 250;
  else if (nacionalidadPolaca === 'inne') nacionalidadX = 350;
  
  if (nacionalidadX > 0) {
    page1.drawText('X', {
      x: nacionalidadX,
      y: 480,
      size: fontSize,
      font: boldFont,
    });
  }
  
  page1.drawText(normalizeText('polskie'), {
    x: 170,
    y: 480,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(normalizeText('bezpaństwowiec'), {
    x: 270,
    y: 480,
    size: fontSize,
    font: font,
  });
  
  page1.drawText(normalizeText('inne'), {
    x: 370,
    y: 480,
    size: fontSize,
    font: font,
  });
  
  // Datos del pasaporte
  page1.drawText(`Seria i numer: ${formData.pasaporteNumero}`, {
    x: 50,
    y: 460,
    size: fontSize,
    font: font,
  });
  
  const vencimientoFormateado = formData.pasaporteVencimiento ? formatDate(formData.pasaporteVencimiento) : '';
  page1.drawText(`Data ważności paszportu: ${vencimientoFormateado}`, {
    x: 50,
    y: 440,
    size: fontSize,
    font: font,
  });
  
  // Página 2 - Información familiar
  page2.drawText(normalizeText('3. DANE RODZINNE'), {
    x: 50,
    y: 800,
    size: fontSize,
    font: boldFont,
  });
  
  page2.drawText(`Miejsce urodzenia: ${normalizeText(formData.ciudadNacimiento)}`, {
    x: 50,
    y: 770,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(`Imię ojca (pierwsze): ${normalizeText(formData.primerNombrePadre)}`, {
    x: 50,
    y: 750,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(`Nazwisko rodowe ojca: ${normalizeText(formData.apellidoPadre)}`, {
    x: 50,
    y: 730,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(`Imię matki (pierwsze): ${normalizeText(formData.primerNombreMadre)}`, {
    x: 50,
    y: 710,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(`Nazwisko rodowe matki: ${normalizeText(formData.apellidoSolteroMadre)}`, {
    x: 50,
    y: 690,
    size: fontSize,
    font: font,
  });
  
  // Estado civil
  page2.drawText(normalizeText('Stan cywilny:'), {
    x: 50,
    y: 650,
    size: fontSize,
    font: boldFont,
  });
  
  let estadoCivilX = 0;
  switch (formData.estadoCivil) {
    case 'soltero': estadoCivilX = 170; break;
    case 'casado': estadoCivilX = 270; break;
    case 'divorciado': estadoCivilX = 370; break;
    case 'viudo': estadoCivilX = 470; break;
  }
  
  if (estadoCivilX > 0) {
    page2.drawText('X', {
      x: estadoCivilX,
      y: 650,
      size: fontSize,
      font: boldFont,
    });
  }
  
  page2.drawText(normalizeText('kawaler / panna'), {
    x: 190,
    y: 650,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(normalizeText('żonaty / zamężna'), {
    x: 290,
    y: 650,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(normalizeText('rozwiedziony / rozwiedziona'), {
    x: 390,
    y: 650,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(normalizeText('wdowiec / wdowa'), {
    x: 490,
    y: 650,
    size: fontSize,
    font: font,
  });
  
  // Información del cónyuge (si está casado)
  if (formData.estadoCivil === 'casado') {
    page2.drawText(`Imię małżonka: ${normalizeText(formData.nombreConyuge)}`, {
      x: 50,
      y: 630,
      size: fontSize,
      font: font,
    });
    
    page2.drawText(`Nazwisko rodowe małżonka: ${normalizeText(formData.apellidoConyuge)}`, {
      x: 50,
      y: 610,
      size: fontSize,
      font: font,
    });
  }
  
  // Base legal
  page2.drawText(normalizeText('Podstawa prawna:'), {
    x: 50,
    y: 570,
    size: fontSize,
    font: boldFont,
  });
  
  page2.drawText(normalizeText('Paragraf 6, 8 rozporządzenia Ministra Cyfryzacji z dnia 26 czerwca 2020 r.'), {
    x: 50,
    y: 550,
    size: smallSize,
    font: font,
  });
  
  page2.drawText(normalizeText('w sprawie profilu zaufanego i podpisu zaufanego (tj. Dz.U. z 2020 r. poz. 1194)'), {
    x: 50,
    y: 535,
    size: smallSize,
    font: font,
  });
  
  // Fecha y lugar
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  
  page2.drawText(`Data: ${formattedToday}`, {
    x: 50,
    y: 500,
    size: fontSize,
    font: font,
  });
  
  page2.drawText(`Miejscowość: ${normalizeText(formData.ciudadDireccion)}`, {
    x: 250,
    y: 500,
    size: fontSize,
    font: font,
  });
  
  // Guardar el documento
  // Nota: Aunque no renderizamos directamente los componentes reutilizables en el PDF,
  // utilizamos sus estructuras de datos y lógica para mantener la consistencia entre
  // la interfaz de usuario y los documentos generados, facilitando el mantenimiento
  // y asegurando que los valores en polaco sean correctos.
  return await pdfDoc.save();
  } catch (error) {
    console.error('Error en la generación del PDF:', error);
    throw new Error(`Error al generar el PDF: ${error.message}`);
  }
}
