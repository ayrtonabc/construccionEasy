export function Input({ label, name, value, onChange }) {
    return (
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <input type="text" name={name} value={value} onChange={onChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    );
  }
  
  export function Select({ label, name, value, onChange, children }) {
    return (
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <select name={name} value={value} onChange={onChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          {children}
        </select>
      </div>
    );
  }
  
  export function CountrySelect({ label, name, value, onChange }) {
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
  
    return (
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <select name={name} value={value} onChange={onChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar país</option>
          {countries.map((country, index) => (
            <option key={index} value={country.pl}>
              {country.es}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export function CitizenshipSelect({ label, name, value, onChange }) {
    const citizenships = [
      { es: "Polaco", pl: "polskie" },
      { es: "Sin Nacionalidad", pl: "bezpaństwowiec" },
      { es: "Otro", pl: "inne" },
    ];
  
    return (
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
        <select name={name} value={value} onChange={onChange} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Seleccionar opción</option>
          {citizenships.map((citizenship, index) => (
            <option key={index} value={citizenship.pl}>
              {citizenship.es}
            </option>
          ))}
        </select>
      </div>
    );
  }
