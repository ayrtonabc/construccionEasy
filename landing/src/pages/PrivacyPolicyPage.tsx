import React, { useEffect } from 'react';
import { Shield, FileText, UserCheck } from 'lucide-react';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <Shield className="h-10 w-10 text-blue-600 mr-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Política de Privacidad</h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introducción</h2>
          <p className="text-gray-700 leading-relaxed">
            Bienvenido a Maciej Szajdek Easy Process. Nos comprometemos a proteger su privacidad y asegurar que su información personal sea manejada de manera segura y responsable. Esta Política de Privacidad describe cómo recopilamos, usamos, procesamos y divulgamos su información, incluyendo información personal, en conjunto con su acceso y uso de nuestros servicios en Polonia.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Información que Recopilamos</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Recopilamos diferentes tipos de información en relación con los servicios que proporcionamos, incluyendo:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li><strong>Información que usted nos proporciona directamente:</strong> Esto incluye información que usted proporciona cuando se registra para una cuenta, completa un formulario, solicita servicios, o se comunica con nosotros. Por ejemplo, nombre, dirección de correo electrónico, número de teléfono, información de pasaporte, y otros detalles relevantes para su proceso de residencia.</li>
            <li><strong>Información recopilada automáticamente:</strong> Cuando utiliza nuestros servicios, podemos recopilar automáticamente cierta información, como su dirección IP, tipo de dispositivo, sistema operativo, e información sobre su uso de nuestros servicios.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cómo Usamos su Información</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Usamos su información para los siguientes propósitos:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li>Proveer, operar y mantener nuestros servicios de legalización de residencia.</li>
            <li>Procesar sus solicitudes y gestionar su cuenta.</li>
            <li>Comunicarnos con usted, incluyendo responder a sus comentarios, preguntas y solicitudes.</li>
            <li>Cumplir con nuestras obligaciones legales y regulatorias en Polonia y la Unión Europea.</li>
            <li>Mejorar y personalizar nuestros servicios.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Intercambio y Divulgación de Información</h2>
          <p className="text-gray-700 leading-relaxed">
            No compartiremos su información personal con terceros, excepto en las siguientes circunstancias: con su consentimiento; con proveedores de servicios de confianza que trabajan en nuestro nombre; para cumplir con las leyes o responder a procesos legales o solicitudes legales, incluyendo de autoridades policiales y agencias gubernamentales en Polonia; para proteger los derechos y la propiedad de Maciej Szajdek Easy Process, nuestros agentes, clientes y otros.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Sus Derechos (RODO/GDPR)</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            De acuerdo con el Reglamento General de Protección de Datos (RGPD) de la UE, usted tiene ciertos derechos con respecto a su información personal. Estos incluyen:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li>El derecho de acceso a su información personal.</li>
            <li>El derecho a la rectificación de información incorrecta o incompleta.</li>
            <li>El derecho al borrado (derecho al olvido) en ciertas circunstancias.</li>
            <li>El derecho a la limitación del procesamiento.</li>
            <li>El derecho a la portabilidad de los datos.</li>
            <li>El derecho a oponerse al procesamiento.</li>
            <li>El derecho a presentar una queja ante una autoridad de supervisión (en Polonia, es el Presidente de la Oficina de Protección de Datos Personales - Prezes Urzędu Ochrony Danych Osobowych).</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Para ejercer estos derechos, por favor contáctenos a través de los detalles proporcionados al final de esta política.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Seguridad de los Datos</h2>
          <p className="text-gray-700 leading-relaxed">
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra el acceso no autorizado, alteración, divulgación o destrucción.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cambios a esta Política de Privacidad</h2>
          <p className="text-gray-700 leading-relaxed">
            Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización" en la parte superior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contáctenos</h2>
          <p className="text-gray-700 leading-relaxed">
            Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en:
            <br />
            <strong>Maciej Szajdek Easy Process</strong>
            <br />
            Adres do doręczeń: Bynowo 33, 14-140 Bynowo, Polonia
            <br />
            NIP: 7412172375
            <br />
            REGON: 541213719
            <br />
            Email: info@easyprocess.pl
            <br />
            Teléfono: 690 430 962
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
