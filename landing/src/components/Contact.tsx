import React, { useState } from 'react';
    import { MapPin, Phone, Mail } from 'lucide-react';
    import { useTranslation } from 'react-i18next';

    const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            setIsSubmitting(true);
    setSubmitStatus(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form data submitted:', formData);
    // Reset form and show success message
    setFormData({ name: '', email: '', phone: '', message: '' });
    setSubmitStatus('success');
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(null), 5000); // Hide message after 5s
    // In a real application, you would send the data to a backend here
    // and handle potential errors, setting submitStatus to 'error' if needed.
      };

      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      const contactInfoStatic = [
        {
          icon: MapPin,
          titleKey: 'contact.info1.title',
          detail: 'Ostroda, Polonia' // Directamente la ciudad y país
        },
        {
          icon: Phone,
          titleKey: 'contact.info2.title',
          detail: '+48 690 430 962'
        },
        {
          icon: Mail,
          titleKey: 'contact.info3.title',
          detail: 'info@easyprocess.pl'
        }
      ];

      const contactInfo = contactInfoStatic.map(info => ({
        ...info,
        title: t(info.titleKey)
      }));

      return (
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div class="lg:col-span-1 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="space-y-8">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <item.icon className="text-indigo-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                        <p className="mt-1 text-gray-600">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div class="lg:col-span-2 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus === 'success' && (
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300" role="alert">
                      {t('contact.form.successMessage')}
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300" role="alert">
                      {t('contact.form.errorMessage')}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.nameLabel')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      placeholder={t('contact.form.namePlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.emailLabel')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>
                  </div> {/* End grid for name, email, phone */}

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      {t('contact.form.messageLabel')}
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out resize-none"
                      placeholder={t('contact.form.messagePlaceholder')}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('contact.form.submitButton')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      );
    };

    export default Contact;
