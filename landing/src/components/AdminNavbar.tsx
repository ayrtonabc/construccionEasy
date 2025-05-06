import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TicketCheck,
  LogOut,
  CreditCard,
  UserPlus, // Import UserPlus icon
  Briefcase, // Importar icono para trabajos
  Menu, // Import Menu icon for mobile
  X, // Import X icon for mobile
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    {
      to: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      to: "/admin/clientes",
      icon: <Users className="w-5 h-5" />,
      label: "Clientes",
    },
    {
      to: "/admin/procesos",
      icon: <FolderKanban className="w-5 h-5" />,
      label: "Procesos",
    },
    {
      to: "/admin/tickets",
      icon: <TicketCheck className="w-5 h-5" />,
      label: "Tickets",
    },
    {
      to: "/admin/pagos",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Pagos",
    },
    {
      to: "/admin/trabajos",
      icon: <Briefcase className="w-5 h-5" />,
      label: "Trabajos",
    },
  ];
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src="/logo.png" className="h-6" alt="Logo" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-100 hover:bg-indigo-600"
                  }
                `}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-2">Salir</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                  onClick={toggleMobileMenu} // Close menu on click
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${
                      isActive
                        ? "bg-indigo-800 text-white"
                        : "text-indigo-100 hover:bg-indigo-600"
                    }
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => {
                  handleSignOut();
                  toggleMobileMenu(); // Close menu on click
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-indigo-100 hover:bg-indigo-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-3">Salir</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}