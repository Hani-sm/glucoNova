import { useLocation, Link } from 'wouter';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #1a2332 50%, #0f1923 100%)'
    }}>
      {/* Animated Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 120 + 60}px`,
              height: `${Math.random() * 120 + 60}px`,
              background: `radial-gradient(circle, rgba(45, 212, 191, ${Math.random() * 0.15 + 0.05}) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(40px)'
            }}
          />
        ))}
      </div>

      {/* Wave Pattern Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#2dd4bf', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q250,50 500,100 T1000,100 L1000,0 L0,0 Z"
            fill="url(#waveGradient)"
            opacity="0.15"
          >
            <animate
              attributeName="d"
              dur="20s"
              repeatCount="indefinite"
              values="M0,100 Q250,50 500,100 T1000,100 L1000,0 L0,0 Z;
                      M0,100 Q250,150 500,100 T1000,100 L1000,0 L0,0 Z;
                      M0,100 Q250,50 500,100 T1000,100 L1000,0 L0,0 Z"
            />
          </path>
          <path
            d="M0,200 Q300,150 600,200 T1200,200 L1200,0 L0,0 Z"
            fill="url(#waveGradient)"
            opacity="0.1"
          >
            <animate
              attributeName="d"
              dur="25s"
              repeatCount="indefinite"
              values="M0,200 Q300,150 600,200 T1200,200 L1200,0 L0,0 Z;
                      M0,200 Q300,250 600,200 T1200,200 L1200,0 L0,0 Z;
                      M0,200 Q300,150 600,200 T1200,200 L1200,0 L0,0 Z"
            />
          </path>
        </svg>
      </div>

      {/* Main Glassmorphic Card */}
      <div 
        className="relative w-full max-w-[1100px] rounded-3xl p-14 backdrop-blur-xl shadow-2xl"
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

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(20px);
          }
          50% {
            transform: translateY(-10px) translateX(-20px);
          }
          75% {
            transform: translateY(-40px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}
