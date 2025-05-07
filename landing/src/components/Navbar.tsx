import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Determine if the navbar should have a solid background initially or on scroll
  const showSolidBackground = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // Set initial scroll state based on current scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Run only once on mount

  // Recalculate solid background state when location changes
  useEffect(() => {
    setIsScrolled(window.scrollY > 0); // Update scroll state on navigation
  }, [location.pathname]);


  const menuItems = [
    { name: 'Inicio', to: '/', type: 'route' },
    { name: 'Servicios', to: 'servicios', type: 'scroll' },
    { name: 'Ventajas', to: 'advantages', type: 'scroll' },
    { name: 'Proceso', to: 'process', type: 'scroll' },
    { name: 'Precios', to: 'pricing', type: 'scroll' },
    { name: 'Contacto', to: '/contact', type: 'route' },
  ];

  const renderLink = (item: any) => {
    const linkTextColorClass = showSolidBackground
      ? 'text-gray-600 hover:text-blue-600'
      : 'text-white/90 hover:text-white';

    if (item.type === 'scroll' && isHomePage) {
      return (
        <ScrollLink
          to={item.to}
          smooth={true}
          duration={500}
          className={`cursor-pointer transition-all duration-300 hover:scale-110 ${linkTextColorClass}`}
          onClick={() => setIsOpen(false)}
        >
          {item.name}
        </ScrollLink>
      );
    }
    return (
      <RouterLink
        to={item.to === 'servicios' && !isHomePage ? '/servicios' : item.to} // Ensure servicios link works directly
        className={`transition-all duration-300 hover:scale-110 ${linkTextColorClass}`}
        onClick={() => setIsOpen(false)}
      >
        {item.name}
      </RouterLink>
    );
  };

  const logoSrc = showSolidBackground ? "img/logob.png" : "img/logo.png";
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
              <img
                src={logoSrc}
                alt="Logo"
                className="h-6 w-auto"
              />
            </RouterLink>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderLink(item)}
              </motion.div>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-300 ${mobileButtonColorClass}`}
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
            {/* Ensure mobile menu background matches solid state */}
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md shadow-lg">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="block px-3 py-2"
                >
                  {/* Mobile links should always use the 'scrolled' text color */}
                   <RouterLink
                     to={item.to === 'servicios' && !isHomePage ? '/servicios' : item.to}
                     className={`block rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900`}
                     onClick={() => setIsOpen(false)}
                   >
                     {item.name}
                   </RouterLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;