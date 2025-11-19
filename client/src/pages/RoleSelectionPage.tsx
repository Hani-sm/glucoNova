import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, ArrowRight } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();
  const [hoveredRole, setHoveredRole] = useState<'patient' | 'doctor' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <PublicLayout>
      <Card 
        className="w-full max-w-[1400px] backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-12 py-5 shadow-2xl"
      >
        <h1 className="text-[2rem] font-extrabold tracking-tight text-white text-center mb-1">GlucoNova</h1>
        <p className="text-[1.3rem] font-bold text-emerald-400 text-center mb-0.5">Select Your Role</p>
        <p className="text-base text-gray-300 text-center mb-4 leading-relaxed">Choose how you'll use GlucoNova</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 w-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group hover:scale-105"
            onClick={() => handleRoleSelect('patient')}
            onMouseEnter={() => setHoveredRole('patient')}
            onMouseLeave={() => setHoveredRole(null)}
            data-testid="card-role-patient"
          >
            <div className="flex flex-col items-start text-left h-full gap-4">
              <div className="flex flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                  <User className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Patient</span>
                </div>
              </div>
              
              <h3 className="text-[1.4rem] font-bold text-white leading-tight">Patient Account</h3>
              
              <p className="text-[0.9rem] text-gray-300 leading-5">
                Manage your diabetes with AI-powered insights, track your health data, and receive personalized recommendations
              </p>
              
              <div className="flex items-center gap-2 mt-auto h-5">
                {hoveredRole === 'patient' ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    <ArrowRight className="h-3 w-3" />
                    Click to continue as Patient
                  </p>
                ) : null}
              </div>
            </div>
          </Card>

          <Card 
            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 w-full hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 group hover:scale-105"
            onClick={() => handleRoleSelect('doctor')}
            onMouseEnter={() => setHoveredRole('doctor')}
            onMouseLeave={() => setHoveredRole(null)}
            data-testid="card-role-doctor"
          >
            <div className="flex flex-col items-start text-left h-full gap-4">
              <div className="flex flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center group-hover:bg-emerald-400/20 transition-colors">
                  <Stethoscope className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Provider</span>
                </div>
              </div>
              
              <h3 className="text-[1.4rem] font-bold text-white leading-tight">Healthcare Provider</h3>
              
              <p className="text-[0.9rem] text-gray-300 leading-5">
                Access patient records, review health data, and provide remote care with comprehensive monitoring tools
              </p>
              
              <div className="flex items-center gap-2 mt-auto h-5">
                {hoveredRole === 'doctor' ? (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    <ArrowRight className="h-3 w-3" />
                    Click to continue as Provider
                  </p>
                ) : null}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <Link 
            href="/login" 
            className="text-[0.95rem] text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            data-testid="link-back-to-login"
          >
            ← Back to Login
          </Link>
        </div>

        <p className="text-center text-[0.85rem] text-white/60 mt-3">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </Card>
    </PublicLayout>
  );
}
