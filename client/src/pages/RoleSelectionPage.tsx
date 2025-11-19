import { useLocation, Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <PublicLayout>
      <Card 
        className="w-full max-w-[1200px] backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-16 py-12 shadow-2xl"
      >
        <h1 className="text-[2.75rem] font-extrabold tracking-tight text-white text-center mb-3">GlucoNova</h1>
        <p className="text-[1.75rem] font-bold text-emerald-400 text-center mb-2">Select Your Role</p>
        <p className="text-base text-gray-300 text-center mb-10">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 max-w-[1000px] mx-auto">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-10 pt-12 pb-10 w-full min-h-[320px] hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('patient')}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-start text-left h-full gap-5">
              <div className="flex flex-row items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                  <User className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Patient</span>
                </div>
              </div>
              
              <h3 className="text-[1.5rem] font-bold text-white">Patient Account</h3>
              
              <p className="text-base text-gray-300 leading-relaxed">
                Manage your diabetes with AI-powered insights
              </p>
              
              <div className="flex items-center gap-1 mt-auto">
                <p className="text-sm text-emerald-400 font-semibold">
                  Click to continue as Patient
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl px-10 pt-12 pb-10 w-full min-h-[320px] hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group"
            onClick={() => handleRoleSelect('doctor')}
            data-testid="card-role-doctor"
          >
            <div className="flex flex-col items-start text-left h-full gap-5">
              <div className="flex flex-row items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                  <Stethoscope className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Provider</span>
                </div>
              </div>
              
              <h3 className="text-[1.5rem] font-bold text-white">Healthcare Provider</h3>
              
              <p className="text-base text-gray-300 leading-relaxed">
                Access patient records and provide remote care
              </p>
              
              <div className="flex items-center gap-1 mt-auto">
                <p className="text-sm text-emerald-400 font-semibold">
                  Click to continue as Provider
                </p>
              </div>
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
