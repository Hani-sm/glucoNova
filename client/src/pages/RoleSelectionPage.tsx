import { useLocation } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <PublicLayout>
      <Card 
        className="w-full max-w-3xl backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-16 shadow-2xl"
      >
        <h1 className="text-4xl font-bold tracking-tight text-white text-center mb-3">GlucoNova</h1>
        <p className="text-2xl font-semibold text-emerald-400 text-center mb-3">Select Your Role</p>
        <p className="text-base text-gray-300 text-center mb-8">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('patient')}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <User className="h-8 w-8 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Patient</span>
                </div>
                <h3 className="text-xl font-bold text-white">Patient Account</h3>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage your diabetes with AI-powered insights
              </p>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('patient');
                }}
                className="w-full h-11 text-base bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                variant="outline"
                data-testid="button-continue-patient"
              >
                Click to continue as Patient
              </Button>
            </div>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('doctor')}
            data-testid="card-role-doctor"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Provider</span>
                </div>
                <h3 className="text-xl font-bold text-white">Healthcare Provider</h3>
              </div>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                Access patient records and provide remote care
              </p>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('doctor');
                }}
                className="w-full h-11 text-base bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                variant="outline"
                data-testid="button-continue-doctor"
              >
                Click to continue as Provider
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2">
          <a 
            href="/login" 
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            data-testid="link-back-to-login"
          >
            ← Back to Login
          </a>
        </div>

        <p className="text-center text-sm text-white/60 mt-6">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
