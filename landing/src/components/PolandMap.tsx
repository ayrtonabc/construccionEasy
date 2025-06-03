import React from 'react';
    import { MapPin, Users, Laptop } from 'lucide-react';
    import { useTranslation } from 'react-i18next';

    const PolandMap = () => {
      const { t } = useTranslation();

      const features = [
        {
          icon: MapPin,
          title: t('map.feature1.title'),
          description: t('map.feature1.description')
        },
        {
          icon: Users,
          title: t('map.feature2.title'),
          description: t('map.feature2.description')
        },
        {
          icon: Laptop,
          title: t('map.feature3.title'),
          description: t('map.feature3.description')
        }
      ];

      return (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                {t('map.sectionTag')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                {t('map.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('map.subtitle')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <feature.icon className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('map.coverageTitle')}
                  </h3>
                  <p className="text-gray-600">
                    {t('map.coverageDescription')}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="p-4">
                  <img
                    src="/img/mapa.webp"
                    alt={t('map.imageAlt')}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };

    export default PolandMap;
