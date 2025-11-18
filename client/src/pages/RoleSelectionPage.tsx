import { useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  return (
    <PublicLayout>
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">GlucoNova</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Select Your Role</h2>
          <p className="text-muted-foreground">Choose how you'll use GlucoNova</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card 
            className="p-8 bg-slate-900/70 backdrop-blur-lg border-white/10 cursor-pointer hover-elevate"
            onClick={() => {
              console.log('Patient role selected');
              navigate('/dashboard');
            }}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <Badge className="mb-3 bg-primary/20 text-primary">PATIENT</Badge>
              <h3 className="text-xl font-bold mb-3">Patient Account</h3>
              <p className="text-muted-foreground mb-4">
                Manage your diabetes with AI-powered insights
              </p>
              <a href="#" className="text-sm text-accent hover:underline">
                Click to continue as Patient →
              </a>
            </div>
          </Card>

          <Card 
            className="p-8 bg-slate-900/70 backdrop-blur-lg border-white/10 cursor-pointer hover-elevate"
            onClick={() => {
              console.log('Provider role selected');
              navigate('/dashboard');
            }}
            data-testid="card-role-provider"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Stethoscope className="h-8 w-8 text-accent" />
              </div>
              <Badge className="mb-3 bg-accent/20 text-accent">PROVIDER</Badge>
              <h3 className="text-xl font-bold mb-3">Healthcare Provider</h3>
              <p className="text-muted-foreground mb-4">
                Access patient records and provide remote care
              </p>
              <a href="#" className="text-sm text-accent hover:underline">
                Click to continue as Provider →
              </a>
            </div>
          </Card>
        </div>

        <div className="text-center">
          <a 
            href="/login" 
            className="text-sm text-muted-foreground hover:text-accent"
            data-testid="link-back-login"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
