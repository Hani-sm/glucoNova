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
import NotFound from "@/pages/not-found";

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
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/login" component={LoginPage} />
      <Route path="/role-selection" component={RoleSelectionPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        {(params) => (
          <ProtectedRoute 
            component={user?.role === 'doctor' ? DoctorDashboard : user?.role === 'admin' ? AdminDashboard : DashboardPage}
            {...params}
          />
        )}
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
