import React, { useState } from 'react'; // Import useState
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, TicketCheck, UserCircle, CreditCard, LogOut, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface NavbarClientProps {
  dashboard?: boolean;
}

export default function NavbarClient({ dashboard = false }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const { signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Definir los items de navegación según el modo (dashboard o landing)
  const navItems = dashboard
    ? [
        { to: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Inicio", exact: true },
        { to: "/dashboard/documentos", icon: <FileText className="w-5 h-5" />, label: "Documentos" },
        { to: "/dashboard/tickets", icon: <TicketCheck className="w-5 h-5" />, label: "Tickets" },
        { to: "/dashboard/pagos", icon: <CreditCard className="w-5 h-5" />, label: "Pagos" },
        { to: "/dashboard/perfil", icon: <UserCircle className="w-5 h-5" />, label: "Perfil" }
      ]
    : [
        { to: "/", icon: <Home className="w-5 h-5" />, label: "Inicio", exact: true },
        { to: "/servicios", icon: <FileText className="w-5 h-5" />, label: "Servicios" },
        { to: "/guia", icon: <FileText className="w-5 h-5" />, label: "Guía" },
        { to: "/banking", icon: <CreditCard className="w-5 h-5" />, label: "Banking" },
        { to: "/contact", icon: <TicketCheck className="w-5 h-5" />, label: "Contacto" }
      ];


       // Función personalizada para determinar si un link está activo
  const isLinkActive = (path: string) => {
    // Para la página de inicio, debe ser exactamente la ruta especificada
    if (path === '/' || path === '/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src="/logob.png" className="h-6" alt="Logo" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex h-full">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/dashboard'}
                className={ `
                  inline-flex items-center px-4 py-2 text-sm font-medium h-full transition-colors
                  ${isLinkActive(item.to)
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'}
                `}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}

            {/* Botón de cerrar sesión solo si estamos en el dashboard */}
            {dashboard && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent h-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Salir</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/' || item.to === '/dashboard'}
                  onClick={toggleMobileMenu} // Close menu on click
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}

              {dashboard && (
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu(); // Close menu on click
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Salir</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
