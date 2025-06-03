import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Brain, CheckCircle, BookOpen } from 'lucide-react';
    import { useTranslation } from 'react-i18next';

    const GuiaPage = () => {
      const { t } = useTranslation();
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

      const sections = [
        {
          image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: t('guide.page.section1.title'),
          description: t('guide.page.section1.description')
        },
        {
          image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: t('guide.page.section2.title'),
          description: t('guide.page.section2.description')
        },
        {
          image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80",
          title: t('guide.page.section3.title'),
          description: t('guide.page.section3.description')
        }
      ];

      return (
        <div className="pt-20 bg-gray-50">
          {/* Hero Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-blue-500/10 inline-block rounded-full px-4 py-2 mb-6">
                    <span className="text-blue-600 font-medium">{t('guide.sectionTag')}</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    dangerouslySetInnerHTML={{ __html: t('guide.page.title').replace('<br />', '<br/>').replace('<span class="text-blue-600">', '<span class="text-blue-600">') }}
                  />

                  <div className="space-y-6 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <Brain className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('guide.feature1.title')}</h3>
                        <p className="text-gray-600">{t('guide.feature1.description')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <CheckCircle className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('guide.feature2.title')}</h3>
                        <p className="text-gray-600">{t('guide.feature2.description')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        <BookOpen className="text-blue-600 h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t('guide.feature3.title')}</h3>
                        <p className="text-gray-600">{t('guide.feature3.description')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <img
                    src="img/guia.webp"
                    alt={t('guide.imageAlt')}
                    className="w-full h-auto rounded-2xl shadow-xl"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Informational Sections */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('guide.page.contentTitle')}</h2>
                <p className="text-xl text-gray-600">{t('guide.page.contentSubtitle')}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg"
                  >
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      );
    };

    export default GuiaPage;
