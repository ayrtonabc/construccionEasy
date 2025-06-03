import React, { useEffect } from 'react';
import { Database, Users, ShieldCheck } from 'lucide-react';

const RodoPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-8 md:p-12">
        <div className="flex items-center mb-8">
          <ShieldCheck className="h-10 w-10 text-blue-600 mr-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Información sobre RODO (GDPR)</h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. ¿Qué es RODO?</h2>
          <p className="text-gray-700 leading-relaxed">
            RODO es el acrónimo polaco para el Reglamento General de Protección de Datos (RGPD) de la Unión Europea (Reglamento (UE) 2016/679). Es una regulación en la ley de la UE sobre protección de datos y privacidad para todas las personas dentro de la Unión Europea (UE) y el Espacio Económico Europeo (EEE). También aborda la transferencia de datos personales fuera de la UE y el EEE. El objetivo principal del RODO es dar control a los ciudadanos y residentes sobre sus datos personales y simplificar el entorno regulatorio para los negocios internacionales unificando la regulación dentro de la UE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Administrador de Datos Personales</h2>
          <p className="text-gray-700 leading-relaxed">
            El administrador de sus datos personales es <strong>Maciej Szajdek Easy Process</strong>, con sede en Adres do doręczeń: Bynowo 33, 14-140 Bynowo, Polonia.
            <br />NIP: 7412172375
            <br />REGON: 541213719
            <br />Puede contactarnos en relación con la protección de datos personales en la dirección de correo electrónico: info@easyprocess.pl o por teléfono al 690 430 962.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Propósitos y Base Legal para el Procesamiento de Datos</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Sus datos personales serán procesados para los siguientes propósitos:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li>Para la ejecución de un contrato del cual usted es parte o para tomar medidas a su solicitud antes de celebrar un contrato (Artículo 6(1)(b) del RODO), específicamente para la prestación de servicios de asistencia en la legalización de residencia.</li>
            <li>Para cumplir con las obligaciones legales impuestas al Administrador (Artículo 6(1)(c) del RODO), por ejemplo, en relación con la contabilidad o la presentación de informes a las autoridades.</li>
            <li>Para los propósitos de los intereses legítimos perseguidos por el Administrador (Artículo 6(1)(f) del RODO), como el marketing directo de nuestros servicios, la gestión de reclamaciones o la mejora de nuestros servicios.</li>
            <li>Si ha dado su consentimiento para el procesamiento de sus datos personales para uno o más propósitos específicos (Artículo 6(1)(a) del RODO).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Sus Derechos Bajo RODO</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Usted tiene los siguientes derechos en relación con el procesamiento de sus datos personales:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
            <li><strong>Derecho de acceso:</strong> Puede solicitar información sobre si procesamos sus datos personales y, de ser así, acceder a ellos.</li>
            <li><strong>Derecho de rectificación:</strong> Puede solicitar la corrección de datos personales inexactos.</li>
            <li><strong>Derecho de supresión (derecho al olvido):</strong> Puede solicitar la eliminación de sus datos personales en determinadas circunstancias.</li>
            <li><strong>Derecho a la limitación del tratamiento:</strong> Puede solicitar la restricción del procesamiento de sus datos personales.</li>
            <li><strong>Derecho a la portabilidad de los datos:</strong> Tiene derecho a recibir los datos personales que nos ha proporcionado en un formato estructurado, de uso común y legible por máquina, y tiene derecho a transmitir esos datos a otro administrador.</li>
            <li><strong>Derecho de oposición:</strong> Puede oponerse al procesamiento de sus datos personales basado en intereses legítimos o para fines de marketing directo.</li>
            <li><strong>Derecho a retirar el consentimiento:</strong> Si el procesamiento se basa en su consentimiento, tiene derecho a retirarlo en cualquier momento, sin afectar la legalidad del procesamiento basado en el consentimiento antes de su retirada.</li>
            <li><strong>Derecho a presentar una queja:</strong> Tiene derecho a presentar una queja ante la autoridad de supervisión, que en Polonia es el Presidente de la Oficina de Protección de Datos Personales (Prezes Urzędu Ochrony Danych Osobowych - UODO).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Período de Conservación de Datos</h2>
          <p className="text-gray-700 leading-relaxed">
            Sus datos personales se conservarán durante el período necesario para cumplir con los fines para los que fueron recopilados, para cumplir con las obligaciones legales (por ejemplo, leyes fiscales o contables), o durante el período necesario para establecer, ejercer o defender reclamaciones legales.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Transferencia de Datos Fuera del EEE</h2>
          <p className="text-gray-700 leading-relaxed">
            En general, no transferimos sus datos personales fuera del Espacio Económico Europeo (EEE). Si tal transferencia fuera necesaria, nos aseguraremos de que se realice de acuerdo con los requisitos legales aplicables, por ejemplo, sobre la base de una decisión de adecuación de la Comisión Europea o utilizando cláusulas contractuales estándar aprobadas por la Comisión Europea.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RodoPage;
