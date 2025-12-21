import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LayoutWrapper } from './components/layout/LayoutWrapper';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { ToastProvider } from './components/ui/Toast';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';

// User pages
import { UserDashboardPage } from './pages/user/UserDashboardPage';
import { ProjectListPage } from './pages/user/ProjectListPage';
import { ProjectDetailPage as UserProjectDetailPage } from './pages/user/ProjectDetailPage';
import { AppointmentsPage } from './pages/user/AppointmentsPage';
import { AboutPage } from './pages/client/AboutPage';
import { TourPage } from './pages/user/TourPage';

// Client pages
import { DashboardPage } from './pages/client/DashboardPage';
import { ProjectsPage } from './pages/client/ProjectsPage';
import { ProjectDetailPage as ClientProjectDetailPage } from './pages/client/ProjectDetailPage';
import { TowersPage } from './pages/client/TowersPage';
import { FlatsPage } from './pages/client/FlatsPage';
import { GalleryPage } from './pages/client/GalleryPage';
import { AnalyticsPage } from './pages/client/AnalyticsPage';
import { BillingPage } from './pages/client/BillingPage';
import { AppointmentsPage as ClientAppointmentsPage } from './pages/client/AppointmentsPage';
import { VirtualToursPage } from './pages/client/VirtualToursPage';

// Admin pages
import { SystemDashboardPage } from './pages/admin/SystemDashboardPage';
import { ClientsPage } from './pages/admin/ClientsPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { LogsPage } from './pages/admin/LogsPage';

function App() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user) return '/login';
    
    switch (user.role) {
      case 'USER':
        return '/user/home';
      case 'CLIENT':
        return '/client/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <ToastProvider>
      <Router>
        <ScrollToTop behavior="auto" />
        <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* Protected routes with layout */}
        <Route element={<LayoutWrapper />}>
          {/* User routes */}
          <Route
            path="/user/home"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/projects"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <ProjectListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/projects/:id/virtual-tour"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <TourPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/appointments"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/about"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          {/* Client routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projects"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/towers"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <TowersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/flats"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <FlatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/gallery"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/analytics"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/appointments"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/virtual-tours"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <VirtualToursPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/billing"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/about"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <AboutPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SystemDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LogsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all - redirect to default route */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
