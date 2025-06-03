/**
 * Utilidades para el manejo de texto en la aplicación
 */

/**
 * Normaliza el texto para que sea compatible con fuentes que no soportan todos los caracteres Unicode
 * Reemplaza caracteres especiales polacos con sus equivalentes ASCII
 * @param text Texto a normalizar
 * @returns Texto normalizado
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  // Mapa de caracteres polacos a sus equivalentes ASCII
  const polishCharsMap: Record<string, string> = {
    'ą': 'a', 'Ą': 'A',
    'ć': 'c', 'Ć': 'C',
    'ę': 'e', 'Ę': 'E',
    'ł': 'l', 'Ł': 'L',
    'ń': 'n', 'Ń': 'N',
    'ó': 'o', 'Ó': 'O',
    'ś': 's', 'Ś': 'S',
    'ź': 'z', 'Ź': 'Z',
    'ż': 'z', 'Ż': 'Z'
  };
  
  // Reemplazar caracteres especiales
  return text.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (char) => polishCharsMap[char] || char);
}
