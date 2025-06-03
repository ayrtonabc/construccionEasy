import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const legalLinks = [
    { name: t('footer.privacyPolicy'), href: '/privacy-policy' },
    { name: t('footer.rodo'), href: '/rodo' },
    { name: t('footer.cookies'), href: '/cookies' },
    { name: t('footer.downloads', 'Recursos'), href: '/recursos' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Logo y descripción */}
          <div className="text-center">
            <img 
              src={isScrolled ? "/img/logo.png" : "/img/logo.png"} // Consider using a single logo if they are the same
              alt={`${t('footer.companyName')} Logo`}
              className="h-8 w-auto mx-auto mb-4" // Increased logo size slightly
            />
            {/* Removed Easy process text below logo */}
            <p className="text-gray-400 text-sm max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Enlaces legales */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-400 hover:text-white text-sm font-medium 
                          transition-colors duration-300 ease-in-out whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright y NIP */}
          <div className="text-center text-gray-500 text-sm">
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            <p className="mt-1">{t('footer.nip')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
