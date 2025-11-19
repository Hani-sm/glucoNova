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
        className="w-full max-w-6xl backdrop-blur-md bg-white/8 border border-white/15 rounded-2xl p-24 shadow-2xl"
      >
        <h1 className="text-6xl font-bold tracking-tight text-white text-center mb-5">GlucoNova</h1>
        <p className="text-4xl font-semibold text-emerald-400 text-center mb-4">Select Your Role</p>
        <p className="text-xl text-gray-300 text-center mb-12">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-12 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('patient')}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                <User className="h-12 w-12 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-base font-semibold text-emerald-400 uppercase tracking-wide">Patient</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Patient Account</h3>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Manage your diabetes with AI-powered insights
              </p>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('patient');
                }}
                className="w-full h-14 text-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 transition-all"
                variant="outline"
                data-testid="button-continue-patient"
              >
                Click to continue as Patient
              </Button>
            </div>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-12 hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('doctor')}
            data-testid="card-role-doctor"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                <Stethoscope className="h-12 w-12 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-base font-semibold text-emerald-400 uppercase tracking-wide">Provider</span>
                </div>
                <h3 className="text-3xl font-bold text-white">Healthcare Provider</h3>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Access patient records and provide remote care
              </p>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoleSelect('doctor');
                }}
                className="w-full h-14 text-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400/30 transition-all"
                variant="outline"
                data-testid="button-continue-doctor"
              >
                Click to continue as Provider
              </Button>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Link 
            href="/login" 
            className="text-lg text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            data-testid="link-back-to-login"
          >
            ← Back to Login
          </Link>
        </div>

        <p className="text-center text-lg text-white/60 mt-10">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
