import React, { useEffect } from "react";
    import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
    import { useTranslation } from 'react-i18next';

    // Landing components
    import Navbar from "./components/Navbar";
    import Hero from "./components/Hero";
    import Services from "./components/Services";
    import Advantages from "./components/Advantages";
    import Process from "./components/Process";
    import Banking from "./components/Banking";
    import Guide from "./components/Guide";
    import Pricing from "./components/Pricing";
    import Footer from "./components/Footer";
    import PolandMap from "./components/PolandMap";
    import Pesel from "./components/Pesel";

    // Landing pages
    import LoginPage from "./pages/LoginPage";
    import ContactPage from "./pages/ContactPage";
    import ServiciosPage from "./pages/ServiciosPage";
    import GuiaPage from "./pages/GuiaPage";
    import BankingPage from "./pages/BankingPage";
    import RegisterPage from "./pages/RegisterPage";
    import Form from "./pages/Form";
    import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"; // Import Privacy Policy Page
    import RodoPage from "./pages/RodoPage"; // Import RODO Page
    import CookiesPage from "./pages/CookiesPage"; // Import Cookies Page

    // Pages for Company Services
    import ServiciosEmpresasPage from "./pages/empresa/ServiciosEmpresasPage";
    import LegalizacionEmpleadosPage from "./pages/empresa/LegalizacionEmpleadosPage";
    import AsesoramientoEmpleadosPage from "./pages/empresa/AsesoramientoEmpleadosPage";
    import BolsaTrabajoPage from "./pages/empresa/BolsaTrabajoPage";

    // Admin components
    import AdminNavbar from "./components/AdminNavbar";

    // Admin pages
    import HomePage from "./pages/dashboard/HomePage";
    import DocumentsPage from "./pages/dashboard/DocumentsPage";
    import TicketsPage from "./pages/dashboard/TicketsPage";
    import PaymentsPage from "./pages/dashboard/PaymentsPage";
    import ProfilePage from "./pages/dashboard/ProfilePage";
    import AdminDashboard from "./pages/admin/AdminDashboard";
    import ClientsManagement from "./pages/admin/ClientsManagement";
    import ClientDetail from "./pages/admin/ClientDetail";
    import ProcessManagement from "./pages/admin/ProcessManagement";
    import AdminTickets from "./pages/admin/AdminTickets";
    import PaymentsManagement from "./pages/admin/PaymentsManagement";
    import CreateClientPage from "./pages/admin/CreateClientPage"; // Import the new page
    import JobManagement from "./pages/admin/JobManagement"; // Importar la página de gestión de trabajos

    // Auth context (usando el AuthProvider del proyecto Landing)
    import { AuthProvider, useAuth } from "./context/AuthContext";
    import NavbarClient from "./components/NavbarClient";
    import ClientDashboard from "./pages/dashboard/HomePage";
import PeselPage from "./pages/PeselPage";
import RecursosPage from "./pages/RecursosPage";

    interface ProtectedRouteProps {
      children: React.ReactNode;
      requireAdmin?: boolean;
    }

    interface DashboardLayoutProps {
      children: React.ReactNode;
      isAdmin?: boolean;
    }

    // Componente de protección de rutas para el dashboard
    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
      const { user, isAdmin, loading } = useAuth();
      /* const location = useLocation(); */

      if (loading) {
        return <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
      }
      
       if (!user) {
         return <Navigate to="/login" replace />;
       }

       if (!requireAdmin && isAdmin && window.location.pathname === '/dashboard') {
        return <Navigate to="/admin" replace />;
      }
      

       /* if (requireAdmin && !isAdmin) {
         return <Navigate to="/dashboard" replace />;
       } */
      
      return children;
    };

    // Componente de Layout para el Dashboard
    const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, isAdmin = false }) => {
      return (
        <div className="min-h-screen bg-gray-50">
          {isAdmin ? <AdminNavbar /> : <NavbarClient dashboard />}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      );
    };

    function App() {
      const { t, i18n } = useTranslation();

      useEffect(() => {
    // Establecer español como idioma predeterminado al cargar la aplicación
    if (i18n.language !== 'es' && i18n.language !== 'en' && i18n.language !== 'pl') {
      i18n.changeLanguage('es');
    }
    
    document.title = t('pageTitles.main');
    document.documentElement.lang = i18n.language;
  }, [i18n.language, t, i18n]);
  
  // Asegurar que el atributo lang del HTML esté en español por defecto
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (!htmlElement.lang || htmlElement.lang === 'en-US') {
      htmlElement.lang = 'es';
    }
  }, []);


      const ClientDashboardWrapper = () => {
        const { user } = useAuth();
        return <ClientDashboard user={user} />;
      };
      return (
        <AuthProvider>
          <Router>
            <Routes>
              {/* Landing Routes */}
              <Route
                path="/"
                element={
                  <>
                    <Navbar />
                    {/* Main value proposition */}
                    <Hero />
                    {/* Core service offering */}
                    <Services />
                    <Process />
                    <Advantages />
                    {/* Pricing and conversion */}
                    <Pricing />
                    {/* Additional value services */}
                    <Pesel />
                    <Banking />
                    {/* Resources and support */}
                    <Guide />
                    {/* Trust and coverage */}
                    <PolandMap />
                    {/* Footer */}
                    <Footer />
                  </>
                }
              />
              
              {/* Authentication and registration */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Onboarding forms */}
              <Route path="/form" element={<Form />} />
              
              {/* Landing info pages */}
              <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
              <Route path="/servicios" element={<><Navbar /><ServiciosPage /><Footer /></>} />
              <Route path="/guia" element={<><Navbar /><GuiaPage /><Footer /></>} />
              <Route path="/banking" element={<><Navbar /><BankingPage /><Footer /></>} />
              <Route path="/pesel" element={<><Navbar /><PeselPage /><Footer /></>} />
              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicyPage /><Footer /></>} />
              <Route path="/rodo" element={<><Navbar /><RodoPage /><Footer /></>} />
              <Route path="/cookies" element={<><Navbar /><CookiesPage /><Footer /></>} />
              <Route path="/recursos" element={<><Navbar /><RecursosPage /><Footer /></>} />

              {/* Company Services Pages */}
              <Route path="/servicios-empresas" element={<><Navbar /><ServiciosEmpresasPage /><Footer /></>} />
              <Route path="/servicios-empresas/legalizacion-empleados" element={<><Navbar /><LegalizacionEmpleadosPage /><Footer /></>} />
              <Route path="/servicios-empresas/asesoramiento-empleados" element={<><Navbar /><AsesoramientoEmpleadosPage /><Footer /></>} />
              <Route path="/servicios-empresas/bolsa-trabajo" element={<><Navbar /><BolsaTrabajoPage /><Footer /></>} />

              {/* Dashboard Client Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ClientDashboardWrapper  />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/documentos" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <DocumentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/tickets" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <TicketsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/pagos" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <PaymentsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/perfil" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/clientes" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <ClientsManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
               {/* Add route for the new client creation page */}
              <Route path="/admin/crear-cliente" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <CreateClientPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/clientes/:id" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <ClientDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/procesos" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <ProcessManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/tickets" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <AdminTickets />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/pagos" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <PaymentsManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/trabajos" element={
                <ProtectedRoute requireAdmin={true}>
                  <DashboardLayout isAdmin={true}>
                    <JobManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      );
    }

    export default App;
