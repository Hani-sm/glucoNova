import { useLocation, Link } from 'wouter';
import PublicLayout from '@/components/PublicLayout';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <PublicLayout>
      <div 
        className="w-full max-w-[1100px] mx-auto rounded-3xl p-14 backdrop-blur-xl shadow-2xl"
        style={{
          background: 'rgba(15, 25, 35, 0.6)',
          border: '1px solid rgba(45, 212, 191, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
        }}
        data-testid="container-role-selection"
      >
        {/* Header Section */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            GlucoNova
          </h1>
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#2dd4bf' }}>
            Select Your Role
          </h2>
          <p className="text-lg text-gray-400">
            Choose how you'll use GlucoNova
          </p>
        </div>

        {/* Two Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Patient Card */}
          <div
            onClick={() => handleRoleSelect('patient')}
            className="group relative rounded-2xl p-10 cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(20, 30, 45, 0.5)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              boxShadow: '0 4px 20px rgba(45, 212, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
            data-testid="card-role-patient"
          >
            {/* Glow Effect on Hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />

            <div className="relative z-10">
              {/* Icon and Badge */}
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)'
                  }}
                >
                  <User className="w-8 h-8" style={{ color: '#2dd4bf' }} />
                </div>
                <div 
                  className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    color: '#2dd4bf'
                  }}
                >
                  Patient
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-6">
                Patient Account
              </h3>

              {/* Description */}
              <p className="text-base text-gray-400 leading-relaxed mb-8">
                Manage your diabetes with AI-powered insights
              </p>

              {/* CTA */}
              <p 
                className="text-sm font-semibold transition-all duration-300 group-hover:translate-x-2"
                style={{ color: '#2dd4bf' }}
              >
                Click to continue as Patient →
              </p>
            </div>
          </div>

          {/* Healthcare Provider Card */}
          <div
            onClick={() => handleRoleSelect('doctor')}
            className="group relative rounded-2xl p-10 cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(20, 30, 45, 0.5)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
              boxShadow: '0 4px 20px rgba(45, 212, 191, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
            }}
            data-testid="card-role-doctor"
          >
            {/* Glow Effect on Hover */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />

            <div className="relative z-10">
              {/* Icon and Badge */}
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    boxShadow: '0 0 20px rgba(45, 212, 191, 0.2)'
                  }}
                >
                  <Stethoscope className="w-8 h-8" style={{ color: '#2dd4bf' }} />
                </div>
                <div 
                  className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    color: '#2dd4bf'
                  }}
                >
                  Provider
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-6">
                Healthcare Provider
              </h3>

              {/* Description */}
              <p className="text-base text-gray-400 leading-relaxed mb-8">
                Access patient records and provide remote care
              </p>

              {/* CTA */}
              <p 
                className="text-sm font-semibold transition-all duration-300 group-hover:translate-x-2"
                style={{ color: '#2dd4bf' }}
              >
                Click to continue as Provider →
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
            style={{ color: '#2dd4bf' }}
            data-testid="link-back-to-login"
          >
            <span>←</span>
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
