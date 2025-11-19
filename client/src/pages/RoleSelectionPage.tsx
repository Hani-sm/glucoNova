import { useLocation, Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <PublicLayout>
      <Card 
        className="w-full max-w-[900px] backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-16 py-14 shadow-2xl"
      >
        <h1 className="text-[2.5rem] font-extrabold tracking-tight text-white text-center mb-4">GlucoNova</h1>
        <p className="text-[1.6rem] font-bold text-emerald-400 text-center mb-2">Select Your Role</p>
        <p className="text-base text-gray-300 text-center mb-12">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-10 w-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group hover:border-emerald-400/30 min-h-[320px] flex flex-col"
            onClick={() => handleRoleSelect('patient')}
            data-testid="card-role-patient"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <User className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30">
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Patient</span>
              </div>
            </div>
            
            <h3 className="text-[1.75rem] font-bold text-white mb-6 leading-tight">Patient Account</h3>
            
            <p className="text-base text-gray-300 leading-relaxed mb-8 flex-grow text-center">
              Manage your diabetes with AI-powered insights
            </p>
            
            <p className="text-sm text-emerald-400 font-medium text-center">
              Click to continue as Patient
            </p>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-10 w-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group hover:border-emerald-400/30 min-h-[320px] flex flex-col"
            onClick={() => handleRoleSelect('doctor')}
            data-testid="card-role-doctor"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/15 border border-emerald-400/30">
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Provider</span>
              </div>
            </div>
            
            <h3 className="text-[1.75rem] font-bold text-white mb-6 leading-tight">Healthcare Provider</h3>
            
            <p className="text-base text-gray-300 leading-relaxed mb-8 flex-grow text-center">
              Access patient records and provide remote care
            </p>
            
            <p className="text-sm text-emerald-400 font-medium text-center opacity-0 group-hover:opacity-0">
              Click to continue as Provider
            </p>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Link 
            href="/login" 
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
            data-testid="link-back-to-login"
          >
            ← Back to Login
          </Link>
        </div>
      </Card>
    </PublicLayout>
  );
}
