import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const languages = [
    { code: 'es', name: 'Español', flag: 'img/es.png' },
    { code: 'en', name: 'English', flag: '/img/en.png' },
    { code: 'pl', name: 'Polski', flag: '/img/pl.png' },
  ];

  useEffect(() => {
    if (i18n.language !== 'es' && i18n.language !== 'en' && i18n.language !== 'pl') {
      i18n.changeLanguage('es');
    }
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setDropdownOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center p-2 rounded-md hover:bg-gray-100/20 transition-colors"
      >
        <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-6 h-4 rounded-sm mr-2" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.code.toUpperCase()}</span>
      </button>
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <img src={lang.flag} alt={lang.name} className="w-5 h-3 rounded-sm mr-3" />
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [personServicesDropdownOpen, setPersonServicesDropdownOpen] = useState(false);
  const [companyServicesDropdownOpen, setCompanyServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const showSolidBackground = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      if (isHomePage) {
        const sections = ['servicios', 'contact'];
        const currentSection = sections.find((section) => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });

        setActiveSection(currentSection || '');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    setIsScrolled(window.scrollY > 0);
    setActiveSection('');
  }, [location.pathname]);

  const desktopMenuItems = [
    { name: t('navbar.home'), to: '/', type: 'route', priority: 'low' },
    {
      name: t('navbar.services_person'),
      to: '/servicios-personas',
      type: 'route',
      priority: 'medium',
      hasDropdown: true,
    },
    {
      name: t('navbar.services_company'),
      to: '/servicios-empresas',
      type: 'route',
      priority: 'medium',
      hasDropdown: true,
    },
  ];

  const mobileMenuItems = [
    { name: t('navbar.home'), to: '/', type: 'route', priority: 'low' },
    {
      name: t('navbar.services_person'),
      to: '/servicios-personas',
      type: 'route',
      priority: 'medium',
      hasDropdown: true,
    },
    {
      name: t('navbar.services_company'),
      to: '/servicios-empresas',
      type: 'route',
      priority: 'medium',
      hasDropdown: true,
    },
    { name: t('navbar.cta_button'), to: '/contact', type: 'route', priority: 'high' },
  ];

  const personServicesSubmenuItems = [
    { name: t('navbar.services_person_submenu.pesel'), to: '/pesel', type: 'route', isFree: true },
    { name: t('navbar.services_person_submenu.banking'), to: '/banking', type: 'route', isFree: true },
    { name: t('navbar.services_person_submenu.guide'), to: '/guia', type: 'route', isFree: true },
    { name: t('navbar.services_person_submenu.advisory'), to: '/contact', type: 'route', isFree: true },
    { name: t('navbar.services_person_submenu.residence'), to: 'servicios', type: 'scroll', isFree: false },
  ];

  const companyServicesSubmenuItems = [
    {
      name: t('navbar.services_company_submenu.residence_employees'),
      to: '/servicios-empresas/legalizacion-empleados',
      isFree: false,
    },
    {
      name: t('navbar.services_company_submenu.advisory_employees'),
      to: '/servicios-empresas/asesoramiento-empleados',
      isFree: false,
    },
    { name: t('navbar.services_company_submenu.job_board'), to: '/servicios-empresas/bolsa-trabajo', isFree: false },
  ];

  const primaryServiceItem = {
    name: t('navbar.services_person_submenu.residence'),
    to: '/servicios-personas/legalizacion',
    type: 'route',
    priority: 'highest',
    isPrimary: true,
  };

  const renderLink = (
    item: any,
    personServicesDropdownOpen: boolean,
    setPersonServicesDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    companyServicesDropdownOpen: boolean,
    setCompanyServicesDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isMobile: boolean = false
  ) => {
    const isActive =
      activeSection === item.to ||
      (item.to === '/' && location.pathname === '/') ||
      (item.to === '/contact' && location.pathname === '/contact');

    const baseClasses = 'transition-all duration-300 font-medium px-3 py-2 rounded-md text-sm';

    const priorityClasses = {
      highest: 'font-bold',
      high: 'font-semibold',
      medium: '',
      low: '',
    };

    let linkCombinedClasses = '';

    if (item.isPrimary) {
      if (showSolidBackground) {
        linkCombinedClasses = `bg-blue-600 text-white hover:bg-blue-700 ${priorityClasses[item.priority] || ''}`;
      } else {
        linkCombinedClasses = `bg-blue-600/90 text-white hover:bg-blue-700 ${priorityClasses[item.priority] || ''}`;
      }
    } else if (showSolidBackground) {
      if (isActive) {
        linkCombinedClasses = `text-indigo-700 ${priorityClasses[item.priority] || ''}`;
      } else {
        linkCombinedClasses = `text-gray-700 hover:bg-gray-50 hover:text-indigo-600 ${priorityClasses[item.priority] || ''}`;
      }
    } else {
      if (isActive) {
        linkCombinedClasses = `text-white ${priorityClasses[item.priority] || ''}`;
      } else {
        linkCombinedClasses = `text-white/90 hover:text-white hover:bg-white/10 ${priorityClasses[item.priority] || ''}`;
      }
    }

    if (item.hasDropdown) {
      const submenuItems = item.to === '/servicios-personas' ? personServicesSubmenuItems : companyServicesSubmenuItems;
      const dropdownTitle =
        item.to === '/servicios-personas'
          ? t('')
          : t('');

      return (
        <div className="relative group">
          <button
            className={`flex items-center space-x-1 ${baseClasses} ${linkCombinedClasses} group-hover:scale-105`}
            onClick={() =>
              item.to === '/servicios-personas'
                ? setPersonServicesDropdownOpen(!personServicesDropdownOpen)
                : setCompanyServicesDropdownOpen(!companyServicesDropdownOpen)
            }
            onMouseEnter={() =>
              item.to === '/servicios-personas'
                ? setPersonServicesDropdownOpen(true)
                : setCompanyServicesDropdownOpen(true)
            }
            onMouseLeave={() =>
              item.to === '/servicios-personas'
                ? setPersonServicesDropdownOpen(false)
                : setCompanyServicesDropdownOpen(false)
            }
          >
            <span>{item.name}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                item.to === '/servicios-personas' ? personServicesDropdownOpen : companyServicesDropdownOpen
                  ? 'rotate-180'
                  : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {(item.to === '/servicios-personas' ? personServicesDropdownOpen : companyServicesDropdownOpen) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                onMouseEnter={() =>
                  item.to === '/servicios-personas'
                    ? setPersonServicesDropdownOpen(true)
                    : setCompanyServicesDropdownOpen(true)
                }
                onMouseLeave={() =>
                  item.to === '/servicios-personas'
                    ? setPersonServicesDropdownOpen(false)
                    : setCompanyServicesDropdownOpen(false)
                }
              >
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
                  {dropdownTitle}
                </div>

                {submenuItems.map((subItem) => {
                  // Determinar si debemos usar ScrollLink o RouterLink basado en el tipo
                  if (subItem.type === 'scroll' && isHomePage) {
                    return (
                      <ScrollLink
                        key={subItem.name}
                        to={subItem.to}
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-80}
                        className={`block px-4 py-2.5 text-sm transition-colors duration-200 cursor-pointer ${
                          subItem.isFree ? 'text-gray-700 hover:bg-green-50 hover:text-green-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                        onClick={() => {
                          item.to === '/servicios-personas'
                            ? setPersonServicesDropdownOpen(false)
                            : setCompanyServicesDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        {subItem.isFree && (
                          <span className="inline-block text-xs font-normal text-green-500 mr-2">
                            ({t('navbar.free_tag', 'Gratis')})
                          </span>
                        )}
                        {subItem.name}
                      </ScrollLink>
                    );
                  } else {
                    return (
                      <RouterLink
                        key={subItem.name}
                        to={subItem.to}
                        className={`block px-4 py-2.5 text-sm transition-colors duration-200 ${
                          subItem.isFree ? 'text-gray-700 hover:bg-green-50 hover:text-green-600' : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                        onClick={() => {
                          item.to === '/servicios-personas'
                            ? setPersonServicesDropdownOpen(false)
                            : setCompanyServicesDropdownOpen(false);
                          setIsOpen(false);
                        }}
                      >
                        {subItem.isFree && (
                          <span className="inline-block text-xs font-normal text-green-500 mr-2">
                            ({t('navbar.free_tag', 'Gratis')})
                          </span>
                        )}
                        {subItem.name}
                      </RouterLink>
                    );
                  }
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (item.type === 'scroll' && isHomePage) {
      return (
        <ScrollLink
          to={item.to}
          spy={true}
          smooth={true}
          duration={500}
          offset={-80}
          className={`cursor-pointer ${baseClasses} ${linkCombinedClasses} hover:scale-105`}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </ScrollLink>
      );
    }

    return (
      <RouterLink
        to={item.to === 'servicios' && !isHomePage ? '/servicios' : item.to}
        className={`${baseClasses} ${linkCombinedClasses} hover:scale-105`}
        onClick={() => setIsOpen(false)}
      >
        {item.name}
      </RouterLink>
    );
  };

  const logoSrc = showSolidBackground ? '/img/logob.png' : '/img/logo.png';
  const mobileButtonColorClass = showSolidBackground ? 'text-gray-600' : 'text-white';
  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    showSolidBackground ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
  }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={navClasses}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <motion.div
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RouterLink to="/">
              <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
            </RouterLink>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {desktopMenuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderLink(
                  item,
                  personServicesDropdownOpen,
                  setPersonServicesDropdownOpen,
                  companyServicesDropdownOpen,
                  setCompanyServicesDropdownOpen
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: desktopMenuItems.length * 0.1 + 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RouterLink
                to="/contact"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  showSolidBackground
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                } transition-all duration-300 shadow-md hover:shadow-lg font-medium`}
              >
                <Phone size={16} />
                <span>{t('navbar.cta_button')}</span>
              </RouterLink>
            </motion.div>

            <div className={`transition-colors duration-300 ${showSolidBackground ? 'text-gray-600' : 'text-white'}`}>
              <LanguageSelector />
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            <div className={`transition-colors duration-300 ${mobileButtonColorClass}`}>
              <LanguageSelector />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-300 p-2 rounded-md ${mobileButtonColorClass} ${
                isOpen ? 'bg-gray-100/20' : ''
              }`}
              aria-label="Menú principal"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md shadow-lg">
              {mobileMenuItems.map((item, index) => (
                item.hasDropdown ? (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="block"
                  >
                    <div>
                      <button
                        onClick={() =>
                          item.to === '/servicios-personas'
                            ? setPersonServicesDropdownOpen(!personServicesDropdownOpen)
                            : setCompanyServicesDropdownOpen(!companyServicesDropdownOpen)
                        }
                        className={`flex items-center justify-between w-full text-left px-3 py-2.5 rounded-md text-base ${
                          (item.to === '/servicios-personas' ? personServicesDropdownOpen : companyServicesDropdownOpen) ||
                          (activeSection === item.to && isHomePage)
                            ? 'text-indigo-700 font-semibold'
                            : 'text-gray-700 font-medium'
                        } hover:bg-gray-50 hover:text-indigo-600`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${
                            (item.to === '/servicios-personas' ? personServicesDropdownOpen : companyServicesDropdownOpen)
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {(item.to === '/servicios-personas' ? personServicesDropdownOpen : companyServicesDropdownOpen) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 mt-2 space-y-1"
                          >
                            {(item.to === '/servicios-personas'
                              ? personServicesSubmenuItems
                              : companyServicesSubmenuItems
                            ).map((subItem) => {
                              // Determinar si debemos usar ScrollLink o RouterLink basado en el tipo para móvil
                              if (subItem.type === 'scroll' && isHomePage) {
                                return (
                                  <ScrollLink
                                    key={subItem.name}
                                    to={subItem.to}
                                    spy={true}
                                    smooth={true}
                                    duration={500}
                                    offset={-80}
                                    className={`block px-3 py-2.5 rounded-md text-sm cursor-pointer ${
                                      subItem.isFree ? 'text-green-600' : 'text-gray-600'
                                    } hover:text-indigo-600 hover:bg-indigo-50`}
                                    onClick={() => {
                                      item.to === '/servicios-personas'
                                        ? setPersonServicesDropdownOpen(false)
                                        : setCompanyServicesDropdownOpen(false);
                                      setIsOpen(false);
                                    }}
                                  >
                                    {subItem.isFree && (
                                      <span className="text-xs font-normal text-green-500 mr-2">
                                        ({t('navbar.free_tag', 'Gratis')})
                                      </span>
                                    )}
                                    {subItem.name}
                                  </ScrollLink>
                                );
                              } else {
                                return (
                                  <RouterLink
                                    key={subItem.name}
                                    to={subItem.to}
                                    className={`block px-3 py-2.5 rounded-md text-sm ${
                                      subItem.isFree ? 'text-green-600' : 'text-gray-600'
                                    } hover:text-indigo-600 hover:bg-indigo-50`}
                                    onClick={() => {
                                      item.to === '/servicios-personas'
                                        ? setPersonServicesDropdownOpen(false)
                                        : setCompanyServicesDropdownOpen(false);
                                      setIsOpen(false);
                                    }}
                                  >
                                    {subItem.isFree && (
                                      <span className="text-xs font-normal text-green-500 mr-2">
                                        ({t('navbar.free_tag', 'Gratis')})
                                      </span>
                                    )}
                                    {subItem.name}
                                  </RouterLink>
                                );
                              }
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="block"
                  >
                    <RouterLink
                      to={item.to === 'servicios' && !isHomePage ? '/servicios' : item.to}
                      className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                        (activeSection === item.to && isHomePage) ||
                        (location.pathname === item.to && item.to !== '/')
                          ? 'text-indigo-700 font-semibold'
                          : 'text-gray-700'
                      } hover:bg-gray-50 hover:text-indigo-600`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </RouterLink>
                  </motion.div>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;