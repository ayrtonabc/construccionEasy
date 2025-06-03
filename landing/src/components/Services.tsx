import React from 'react';
import { FileText, ArrowRight, CalendarCheck, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ServiceCard = ({ icon: Icon, title, description, features }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <div className="mb-4">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-700">
            <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-1 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const ServicesSection = () => {
  const { t } = useTranslation();

  return (
    <section id="servicios" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold gradient-text sm:text-4xl lg:text-5xl">
             {t('services.title')}
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard
            icon={FileText}
            title={t('services.card1Title')}
            description={t('services.card1Desc')}
            features={[
              t('services.card1Feature1'),
              t('services.card1Feature2'),
              t('services.card1Feature3'),
              t('services.card1Feature4')
            ]}
          />
          <ServiceCard
            icon={ArrowRight}
            title={t('services.card2Title')}
            description={t('services.card2Desc')}
            features={[
              t('services.card2Feature1'),
              t('services.card2Feature2'),
              t('services.card2Feature3'),
              t('services.card2Feature4'),
              t('services.card2Feature5')
            ]}
          />
          <ServiceCard
            icon={CalendarCheck}
            title={t('services.card3Title')}
            description={t('services.card3Desc')}
            features={[
              t('services.card3Feature1'),
              t('services.card3Feature2'),
              t('services.card3Feature3'),
              t('services.card3Feature4')
            ]}
          />
          <ServiceCard
            icon={Scale}
            title={t('services.card4Title')}
            description={t('services.card4Desc')}
            features={[
              t('services.card4Feature1'),
              t('services.card4Feature2'),
              t('services.card4Feature3'),
              t('services.card4Feature4')
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
