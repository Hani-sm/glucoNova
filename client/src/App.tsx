import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import RoleSelectionPage from "@/pages/RoleSelectionPage";
import DashboardPage from "@/pages/DashboardPage";
import DoctorDashboard from "@/pages/DoctorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import HealthDataPage from "@/pages/HealthDataPage";
import MealLoggingPage from "@/pages/MealLoggingPage";
import MedicalReportsPage from "@/pages/MedicalReportsPage";
import DoctorsPage from "@/pages/DoctorsPage";
import GlucosePage from "@/pages/GlucosePage";
import InsulinPage from "@/pages/InsulinPage";
import MedicationsPage from "@/pages/MedicationsPage";
import VoiceAIPage from "@/pages/VoiceAIPage";
import MessagesPage from "@/pages/MessagesPage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import ActivityPage from "@/pages/ActivityPage";
import AlertsPage from "@/pages/AlertsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import DocumentsOCRPage from "@/pages/DocumentsOCRPage";
import NotFound from "@/pages/not-found";
import { ReactNode, Component } from "react";
import '@/i18n/config'; // Initialize i18n

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught error:', error);
    console.error('ErrorBoundary error info:', errorInfo);
    console.error('Component stack:', errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: 'linear-gradient(to bottom right, rgb(23, 23, 23), rgb(24, 24, 27), rgb(10, 10, 10))',
          color: 'white',
          padding: '40px',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>GlucoNova - Error</h1>
            <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>An error occurred in the application</p>
            <details style={{ textAlign: 'left', marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', color: '#2dd4bf' }}>Error Details</summary>
              <pre style={{
                background: 'rgba(0,0,0,0.5)',
                padding: '10px',
                borderRadius: '5px',
                overflowX: 'auto',
                marginTop: '10px'
              }}>{this.state.error?.stack || String(this.state.error)}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple test component to verify React is working
function TestComponent() {
  console.log('TestComponent rendering...');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">GlucoNova Test Page</h1>
        <p className="text-xl text-emerald-400">If you can see this, React is working!</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ component: Component, allowedRoles, requireApproval = true, ...rest }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to="/dashboard" />;
  }

  return <Component {...rest} />;
}

function Router() {
  console.log('Router component rendering...');
  const { user } = useAuth();

  return (
    <Switch>
      {/* Test route - temporary for debugging */}
      <Route path="/test" component={TestComponent} />
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/role-selection" component={RoleSelectionPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        {(params) => {
          const { user } = useAuth();
          // For skip auth users or authenticated users, show the appropriate dashboard
          if (user?.role === 'doctor') {
            return <DoctorDashboard {...params} />;
          }
          if (user?.role === 'admin') {
            return <AdminDashboard {...params} />;
          }
          // For patient role or skip auth patient users, show patient dashboard
          return <DashboardPage {...params} />;
        }}
      </Route>
      <Route path="/health-data">
        {(params) => (
          <ProtectedRoute 
            component={HealthDataPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/meals">
        {(params) => (
          <ProtectedRoute 
            component={MealLoggingPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/reports">
        {(params) => (
          <ProtectedRoute 
            component={MedicalReportsPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route path="/doctors">
        {(params) => (
          <ProtectedRoute 
            component={DoctorsPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/glucose">
        {(params) => (
          <ProtectedRoute 
            component={GlucosePage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/insulin">
        {(params) => (
          <ProtectedRoute 
            component={InsulinPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/medications">
        {(params) => (
          <ProtectedRoute 
            component={MedicationsPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/voice">
        {(params) => (
          <ProtectedRoute 
            component={VoiceAIPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/messages">
        {(params) => (
          <ProtectedRoute 
            component={MessagesPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route path="/ai-insights">
        {(params) => (
          <ProtectedRoute 
            component={AIInsightsPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route path="/activity">
        {(params) => (
          <ProtectedRoute 
            component={ActivityPage}
            allowedRoles={['patient']}
            {...params}
          />
        )}
      </Route>
      <Route path="/alerts">
        {(params) => (
          <ProtectedRoute 
            component={AlertsPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route path="/appointments">
        {(params) => (
          <ProtectedRoute 
            component={AppointmentsPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route path="/documents">
        {(params) => (
          <ProtectedRoute 
            component={DocumentsOCRPage}
            allowedRoles={['patient', 'doctor']}
            {...params}
          />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log('App component rendering...');
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;