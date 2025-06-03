import React from 'react';
    import { Clock, UserCheck, FileCheck, Mail, Languages, Monitor } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTranslation } from 'react-i18next';

    const AdvantageCard = ({ icon: Icon, title, description }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
      >
        <div className="text-blue-500 mr-4">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </motion.div>
    );

    const Advantages = () => {
      const { t } = useTranslation();
      const advantages = [
        {
          icon: Clock,
          title: t('advantages.card1.title'),
          description: t('advantages.card1.description')
        },
        {
          icon: UserCheck,
          title: t('advantages.card2.title'),
          description: t('advantages.card2.description')
        },
        {
          icon: FileCheck,
          title: t('advantages.card3.title'),
          description: t('advantages.card3.description')
        },
        {
          icon: Monitor,
          title: t('advantages.card4.title'),
          description: t('advantages.card4.description')
        },
        {
          icon: Mail,
          title: t('advantages.card5.title'),
          description: t('advantages.card5.description')
        },
        {
          icon: Languages,
          title: t('advantages.card6.title'),
          description: t('advantages.card6.description')
        }
      ];

      return (
        <section id="advantages" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('advantages.title')}</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('advantages.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advantages.map((advantage, index) => (
                <AdvantageCard key={index} {...advantage} />
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default Advantages;
