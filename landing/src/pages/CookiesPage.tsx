import React, { useEffect } from 'react';
import { Cookie, Settings, CheckSquare } from 'lucide-react';

const CookiesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Cookie className="h-10 w-10 text-blue-600 mr-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Política de Cookies</h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. ¿Qué son las Cookies?</h2>
          <p className="text-gray-700 leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su computadora o dispositivo móvil. Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio. Esta política explica cómo utilizamos las cookies y tecnologías similares en nuestro sitio web, de conformidad con la legislación de la Unión Europea, incluida la Directiva ePrivacy y el Reglamento General de Protección de Datos (RODO/GDPR) aplicable en Polonia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. ¿Cómo Utilizamos las Cookies?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Utilizamos cookies para diversos fines, tales como:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li><strong>Cookies Esenciales:</strong> Estas cookies son estrictamente necesarias para proporcionarle los servicios disponibles a través de nuestro sitio web y para utilizar algunas de sus funciones, como el acceso a áreas seguras. Sin estas cookies, los servicios que ha solicitado, como la autenticación de usuarios o la gestión de su cuenta, no se pueden proporcionar.</li>
            <li><strong>Cookies de Rendimiento y Funcionalidad:</strong> Estas cookies se utilizan para mejorar el rendimiento y la funcionalidad de nuestro sitio web, pero no son esenciales para su uso. Sin embargo, sin estas cookies, ciertas funcionalidades (como recordar sus preferencias) pueden dejar de estar disponibles.</li>
            <li><strong>Cookies de Análisis y Personalización:</strong> Estas cookies recopilan información que se utiliza de forma agregada para ayudarnos a comprender cómo se utiliza nuestro sitio web o cuán efectivas son nuestras campañas de marketing, o para ayudarnos a personalizar nuestro sitio web para usted.</li>
            <li><strong>Cookies de Terceros:</strong> En algunos casos, también utilizamos cookies proporcionadas por terceros de confianza. Por ejemplo, podemos utilizar Google Analytics para ayudarnos a comprender cómo utiliza el sitio y las formas en que podemos mejorar su experiencia. Estas cookies pueden rastrear cosas como cuánto tiempo pasa en el sitio y las páginas que visita.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Su Consentimiento para el Uso de Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Al utilizar nuestro sitio web, usted acepta el uso de cookies de acuerdo con esta Política de Cookies. Cuando visite nuestro sitio web por primera vez, se le presentará un banner de cookies que le pedirá su consentimiento para el uso de cookies no esenciales. Las cookies esenciales se establecerán automáticamente ya que son necesarias para el funcionamiento del sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Cómo Controlar y Eliminar Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Tiene derecho a decidir si acepta o rechaza las cookies (excepto las esenciales). Puede ejercer sus preferencias de cookies:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li><strong>A través de nuestro banner de cookies:</strong> Puede gestionar sus preferencias de cookies no esenciales a través del banner de consentimiento de cookies que aparece en su primera visita.</li>
            <li><strong>Configuración del navegador:</strong> La mayoría de los navegadores web le permiten controlar la mayoría de las cookies a través de la configuración del navegador. Para obtener más información sobre las cookies, incluido cómo ver qué cookies se han configurado y cómo administrarlas y eliminarlas, visite <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.aboutcookies.org</a> o <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Tenga en cuenta que si elige bloquear las cookies, es posible que no pueda acceder a todas o algunas partes de nuestro sitio web y que algunas funcionalidades dejen de funcionar.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Cambios a esta Política de Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos actualizar esta Política de Cookies de vez en cuando para reflejar, por ejemplo, cambios en las cookies que utilizamos o por otras razones operativas, legales o regulatorias. Por lo tanto, vuelva a visitar esta Política de Cookies regularmente para mantenerse informado sobre nuestro uso de cookies y tecnologías relacionadas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Contáctenos</h2>
          <p className="text-gray-700 leading-relaxed">
            Si tiene alguna pregunta sobre nuestro uso de cookies u otras tecnologías, envíenos un correo electrónico a:
            <br />
            <strong>Maciej Szajdek Easy Process</strong>
            <br />
            Email: info@easyprocess.pl
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPage;
