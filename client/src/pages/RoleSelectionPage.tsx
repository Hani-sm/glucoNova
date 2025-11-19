import { useLocation, Link } from 'wouter';
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
        className="w-full max-w-[560px] backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-10 py-12 shadow-2xl"
      >
        <h1 className="text-[2.75rem] font-extrabold tracking-tight text-white text-center mb-3">GlucoNova</h1>
        <p className="text-[1.75rem] font-bold text-emerald-400 text-center mb-2">Select Your Role</p>
        <p className="text-base text-gray-300 text-center mb-10">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('patient')}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                <User className="h-8 w-8 text-emerald-400" />
              </div>
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
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
                className="w-full h-11 text-base bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 transition-all"
                variant="outline"
                data-testid="button-continue-patient"
              >
                Continue as Patient
              </Button>
            </div>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-8 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('doctor')}
            data-testid="card-role-doctor"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
              </div>
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
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
                className="w-full h-11 text-base bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 transition-all"
                variant="outline"
                data-testid="button-continue-doctor"
              >
                Continue as Provider
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Link 
            href="/login" 
            className="text-[0.95rem] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            data-testid="link-back-to-login"
          >
            ← Back to Login
          </Link>
        </div>

        <p className="text-center text-[0.85rem] text-white/60 mt-8">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
