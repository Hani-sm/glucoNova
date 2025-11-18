import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import DoctorDashboard from "@/pages/DoctorDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component, allowedRoles, requireApproval = true, ...rest }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (requireApproval && !user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Account Pending Approval</h1>
          <p className="text-muted-foreground mb-4">
            Your account is currently under review by our admin team. 
            You will receive an email notification once your account has been approved.
          </p>
          <p className="text-sm text-muted-foreground">
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    );
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
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard">
        {(params) => (
          <ProtectedRoute 
            component={user?.role === 'doctor' ? DoctorDashboard : user?.role === 'admin' ? AdminDashboard : DashboardPage}
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
