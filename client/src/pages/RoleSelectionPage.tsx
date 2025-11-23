import { useLocation, Link } from 'wouter';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  // Floating dots animation data - matching LoginPage
  const floatingDots = [
    { id: 1, size: 12, left: 15, top: 10, duration: 50, delay: 0, xRange: 0.5, yRange: 0.75 },
    { id: 2, size: 14, left: 85, top: 15, duration: 55, delay: 2, xRange: -0.5, yRange: 0.75 },
    { id: 3, size: 16, left: 10, top: 70, duration: 52, delay: 4, xRange: 0.5, yRange: -0.5 },
    { id: 4, size: 13, left: 88, top: 75, duration: 58, delay: 1, xRange: -0.5, yRange: 0.75 },
    { id: 5, size: 15, left: 5, top: 50, duration: 54, delay: 3, xRange: 0.5, yRange: -0.75 },
    { id: 6, size: 14, left: 92, top: 45, duration: 56, delay: 5, xRange: -0.5, yRange: 0.75 },
    { id: 7, size: 12, left: 20, top: 30, duration: 60, delay: 0.5, xRange: 0.5, yRange: 0.75 },
    { id: 8, size: 17, left: 78, top: 25, duration: 48, delay: 2.5, xRange: -0.5, yRange: -0.5 },
  ];

  // Uneven circles animation data - matching LoginPage
  const unevenCircles = [
    { id: 1, size: 25, left: 30, top: 20, duration: 55, delay: 0, opacity: 0.05, xRange: 0.5, yRange: 0.75 },
    { id: 2, size: 35, left: 70, top: 65, duration: 52, delay: 3, opacity: 0.15, xRange: -0.75, yRange: 0.75 },
    { id: 3, size: 20, left: 18, top: 55, duration: 58, delay: 1.5, opacity: 0.03, xRange: 0.75, yRange: -0.5 },
    { id: 4, size: 30, left: 85, top: 35, duration: 50, delay: 4, opacity: 0.12, xRange: -0.5, yRange: 0.75 },
    { id: 5, size: 28, left: 50, top: 80, duration: 60, delay: 2.5, opacity: 0.08, xRange: 0.75, yRange: -0.75 },
  ];

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden relative flex items-center justify-center px-4 py-8"
      id="role-selection-page-container"
    >
      {/* Animated Light Waves */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div 
          className="absolute top-0 left-0 right-0 h-96 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52, 211, 153, 0.08), transparent)',
            animation: 'wave1 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/3 left-0 right-0 h-96 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 30% 50%, rgba(52, 211, 153, 0.06), transparent)',
            animation: 'wave2 18s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-96 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 75% 45% at 70% 100%, rgba(52, 211, 153, 0.07), transparent)',
            animation: 'wave3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Small Floating Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {floatingDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-emerald-400/50 transition-all duration-300"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `floatDot${dot.id} ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
              filter: 'blur(0px)',
              willChange: 'transform, filter',
            }}
          />
        ))}
      </div>

      {/* Uneven Circular Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {unevenCircles.map((circle) => (
          <div
            key={`circle-${circle.id}`}
            className="absolute rounded-full bg-emerald-400 transition-all duration-300"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              opacity: circle.opacity,
              animation: `floatCircle${circle.id} ${circle.duration}s ease-in-out infinite`,
              animationDelay: `${circle.delay}s`,
              filter: 'blur(0px)',
              willChange: 'transform, filter, opacity',
            }}
          />
        ))}
      </div>

      {/* Content - Enhanced Layout with Larger Cards */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="animate-float" data-testid="container-role-selection">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
              GlucoNova
            </h1>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2dd4bf' }}>
              Select Your Role
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose how you'll use GlucoNova to manage your health journey
            </p>
          </div>

          {/* Two Role Cards - Side by Side with Increased Size */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-8 rounded-3xl" style={{
            backgroundColor: 'rgba(30, 41, 59, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(45, 212, 191, 0.2)',
          }}>
            {/* Patient Card */}
            <div
              onClick={() => handleRoleSelect('patient')}
              className="group relative rounded-2xl p-12 cursor-pointer transition-all duration-500 hover:scale-[1.03] overflow-visible"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.35)',
                backdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
                border: '1.5px solid rgba(45, 212, 191, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(45, 212, 191, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                minHeight: '450px',
              }}
              data-testid="card-role-patient"
            >

              <div className="relative z-10 h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-6 inline-block">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.05))',
                      border: '2px solid rgba(45, 212, 191, 0.4)',
                      boxShadow: '0 8px 20px rgba(45, 212, 191, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <User className="w-8 h-8" style={{ color: '#2dd4bf' }} />
                  </div>
                </div>

                {/* Badge */}
                <div 
                  className="inline-block mb-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    color: '#2dd4bf',
                    boxShadow: '0 4px 12px rgba(45, 212, 191, 0.15)'
                  }}
                >
                  For Patients
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  Patient Account
                </h3>

                {/* Description */}
                <p className="text-base text-gray-300 leading-relaxed mb-6">
                  Track your glucose levels, receive AI-powered insights, and manage your diabetes with professional guidance from healthcare providers.
                </p>

                {/* Hover Text Below Card Content */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center py-4 px-4 rounded-lg" style={{
                    background: 'rgba(45, 212, 191, 0.1)',
                    border: '1px solid rgba(45, 212, 191, 0.3)'
                  }}>
                    <span className="text-lg font-semibold text-emerald-300">Click to continue as Patient</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Healthcare Provider Card */}
            <div
              onClick={() => handleRoleSelect('doctor')}
              className="group relative rounded-2xl p-12 cursor-pointer transition-all duration-500 hover:scale-[1.03] overflow-visible"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.35)',
                backdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
                border: '1.5px solid rgba(45, 212, 191, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(45, 212, 191, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
                minHeight: '450px',
              }}
              data-testid="card-role-doctor"
            >

              <div className="relative z-10 h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-6 inline-block">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.05))',
                      border: '2px solid rgba(45, 212, 191, 0.4)',
                      boxShadow: '0 8px 20px rgba(45, 212, 191, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Stethoscope className="w-8 h-8" style={{ color: '#2dd4bf' }} />
                  </div>
                </div>

                {/* Badge */}
                <div 
                  className="inline-block mb-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: 'rgba(45, 212, 191, 0.15)',
                    border: '1.5px solid rgba(45, 212, 191, 0.4)',
                    color: '#2dd4bf',
                    boxShadow: '0 4px 12px rgba(45, 212, 191, 0.15)'
                  }}
                >
                  For Providers
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                  Healthcare Provider
                </h3>

                {/* Description */}
                <p className="text-base text-gray-300 leading-relaxed mb-6">
                  Manage patient records, provide remote care, and monitor progress with advanced analytics and secure communication tools.
                </p>

                {/* Hover Text Below Card Content */}
                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center py-4 px-4 rounded-lg" style={{
                    background: 'rgba(45, 212, 191, 0.1)',
                    border: '1px solid rgba(45, 212, 191, 0.3)'
                  }}>
                    <span className="text-lg font-semibold text-emerald-300">Click to continue as Provider</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center pt-8 border-t border-white/10">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3 hover:text-emerald-300"
              style={{ color: '#2dd4bf' }}
              data-testid="link-back-to-login"
            >
              <span>←</span>
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Floating dots animations */
          @keyframes floatDot1 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(1.5px, 2.5px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(2.25px, 3.8px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(3px, 5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(2.5px, 4px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(2px, 3px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot2 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(-1.5px, 2.5px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(-2.25px, 3.8px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(-3px, 5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(-2.5px, 4px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(-2px, 3px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot3 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(0.75px, -0.5px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(1.5px, -1.25px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(2.25px, -1.9px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(3px, -2.5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(2.5px, -2px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(2px, -1.5px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(0.75px, -0.5px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot4 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(-1.5px, 2.5px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(-2.25px, 3.8px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(-3px, 5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(-2.5px, 4px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(-2px, 3px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot5 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(0.75px, -0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(1.5px, -2.25px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(2.25px, -3.45px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(3px, -4.5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(2.5px, -3.6px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(2px, -2.7px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(0.75px, -0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot6 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(-1.5px, 2.5px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(-2.25px, 3.8px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(-3px, 5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(-2.5px, 4px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(-2px, 3px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(-0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot7 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(1.5px, 2.5px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(2.25px, 3.8px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(3px, 5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(2.5px, 4px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(2px, 3px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(0.75px, 0.9px, 0); 
              opacity: 0.355; 
            }
          }

          @keyframes floatDot8 {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            12.5% { 
              transform: translate3d(-0.75px, -0.5px, 0); 
              opacity: 0.355; 
            }
            25% { 
              transform: translate3d(-1.5px, -1.25px, 0); 
              opacity: 0.36; 
            }
            37.5% { 
              transform: translate3d(-2.25px, -1.9px, 0); 
              opacity: 0.365; 
            }
            50% { 
              transform: translate3d(-3px, -2.5px, 0); 
              opacity: 0.39; 
            }
            62.5% { 
              transform: translate3d(-2.5px, -2px, 0); 
              opacity: 0.375; 
            }
            75% { 
              transform: translate3d(-2px, -1.5px, 0); 
              opacity: 0.365; 
            }
            87.5% { 
              transform: translate3d(-0.75px, -0.5px, 0); 
              opacity: 0.355; 
            }
          }

          /* Uneven circles animations */
          @keyframes floatCircle1 {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: 0.05; 
            }
            12.5% { 
              transform: translate3d(0.75px, 0.9px, 0) scale(1.001); 
              opacity: 0.052; 
            }
            25% { 
              transform: translate3d(1.5px, 2.5px, 0) scale(1.002); 
              opacity: 0.055; 
            }
            37.5% { 
              transform: translate3d(2.25px, 3.8px, 0) scale(1.0025); 
              opacity: 0.0575; 
            }
            50% { 
              transform: translate3d(3px, 5px, 0) scale(1.003); 
              opacity: 0.06; 
            }
            62.5% { 
              transform: translate3d(2.5px, 4px, 0) scale(1.0025); 
              opacity: 0.0575; 
            }
            75% { 
              transform: translate3d(2px, 3px, 0) scale(1.002); 
              opacity: 0.055; 
            }
            87.5% { 
              transform: translate3d(0.75px, 0.9px, 0) scale(1.001); 
              opacity: 0.052; 
            }
          }

          @keyframes floatCircle2 {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: 0.15; 
            }
            12.5% { 
              transform: translate3d(-1.125px, 0.9px, 0) scale(1.001); 
              opacity: 0.152; 
            }
            25% { 
              transform: translate3d(-2.25px, 2.5px, 0) scale(1.002); 
              opacity: 0.155; 
            }
            37.5% { 
              transform: translate3d(-3.375px, 3.8px, 0) scale(1.0025); 
              opacity: 0.1575; 
            }
            50% { 
              transform: translate3d(-4.5px, 5px, 0) scale(1.003); 
              opacity: 0.16; 
            }
            62.5% { 
              transform: translate3d(-3.75px, 4px, 0) scale(1.0025); 
              opacity: 0.1575; 
            }
            75% { 
              transform: translate3d(-3px, 3px, 0) scale(1.002); 
              opacity: 0.155; 
            }
            87.5% { 
              transform: translate3d(-1.125px, 0.9px, 0) scale(1.001); 
              opacity: 0.152; 
            }
          }

          @keyframes floatCircle3 {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: 0.03; 
            }
            12.5% { 
              transform: translate3d(1.125px, -0.5px, 0) scale(1.001); 
              opacity: 0.032; 
            }
            25% { 
              transform: translate3d(2.25px, -1.25px, 0) scale(1.002); 
              opacity: 0.035; 
            }
            37.5% { 
              transform: translate3d(3.375px, -1.9px, 0) scale(1.0025); 
              opacity: 0.0375; 
            }
            50% { 
              transform: translate3d(4.5px, -2.5px, 0) scale(1.003); 
              opacity: 0.04; 
            }
            62.5% { 
              transform: translate3d(3.75px, -2px, 0) scale(1.0025); 
              opacity: 0.0375; 
            }
            75% { 
              transform: translate3d(3px, -1.5px, 0) scale(1.002); 
              opacity: 0.035; 
            }
            87.5% { 
              transform: translate3d(1.125px, -0.5px, 0) scale(1.001); 
              opacity: 0.032; 
            }
          }

          @keyframes floatCircle4 {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: 0.12; 
            }
            12.5% { 
              transform: translate3d(-0.75px, 0.9px, 0) scale(1.001); 
              opacity: 0.122; 
            }
            25% { 
              transform: translate3d(-1.5px, 2.5px, 0) scale(1.002); 
              opacity: 0.125; 
            }
            37.5% { 
              transform: translate3d(-2.25px, 3.8px, 0) scale(1.0025); 
              opacity: 0.1275; 
            }
            50% { 
              transform: translate3d(-3px, 5px, 0) scale(1.003); 
              opacity: 0.13; 
            }
            62.5% { 
              transform: translate3d(-2.5px, 4px, 0) scale(1.0025); 
              opacity: 0.1275; 
            }
            75% { 
              transform: translate3d(-2px, 3px, 0) scale(1.002); 
              opacity: 0.125; 
            }
            87.5% { 
              transform: translate3d(-0.75px, 0.9px, 0) scale(1.001); 
              opacity: 0.122; 
            }
          }

          @keyframes floatCircle5 {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: 0.08; 
            }
            12.5% { 
              transform: translate3d(1.125px, -0.9px, 0) scale(1.001); 
              opacity: 0.082; 
            }
            25% { 
              transform: translate3d(2.25px, -2.25px, 0) scale(1.002); 
              opacity: 0.085; 
            }
            37.5% { 
              transform: translate3d(3.375px, -3.45px, 0) scale(1.0025); 
              opacity: 0.0875; 
            }
            50% { 
              transform: translate3d(4.5px, -4.5px, 0) scale(1.003); 
              opacity: 0.09; 
            }
            62.5% { 
              transform: translate3d(3.75px, -3.6px, 0) scale(1.0025); 
              opacity: 0.0875; 
            }
            75% { 
              transform: translate3d(3px, -2.7px, 0) scale(1.002); 
              opacity: 0.085; 
            }
            87.5% { 
              transform: translate3d(1.125px, -0.9px, 0) scale(1.001); 
              opacity: 0.082; 
            }
          }

          @keyframes wave1 {
            0%, 100% { 
              transform: translateY(0) scaleX(1);
              opacity: 0.3;
            }
            25% {
              transform: translateY(-1.2px) scaleX(1.003);
              opacity: 0.31;
            }
            50% { 
              transform: translateY(-1.5px) scaleX(1.005);
              opacity: 0.32;
            }
            75% {
              transform: translateY(-0.8px) scaleX(1.003);
              opacity: 0.31;
            }
          }

          @keyframes wave2 {
            0%, 100% { 
              transform: translateX(0) scaleY(1);
              opacity: 0.2;
            }
            25% {
              transform: translateX(1.5px) scaleY(1.004);
              opacity: 0.21;
            }
            50% { 
              transform: translateX(2px) scaleY(1.006);
              opacity: 0.22;
            }
            75% {
              transform: translateX(1px) scaleY(1.004);
              opacity: 0.21;
            }
          }

          @keyframes wave3 {
            0%, 100% { 
              transform: translateY(0) scaleX(1);
              opacity: 0.25;
            }
            25% {
              transform: translateY(1px) scaleX(1.003);
              opacity: 0.26;
            }
            50% { 
              transform: translateY(1.5px) scaleX(1.005);
              opacity: 0.27;
            }
            75% {
              transform: translateY(0.8px) scaleX(1.003);
              opacity: 0.26;
            }
          }
          
          /* Glass-morphism card with enhanced visual depth */
          .animate-float {
            position: relative;
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-float::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            padding: 2px;
            background: linear-gradient(135deg, 
              rgba(45, 212, 191, 0.3) 0%, 
              rgba(16, 185, 129, 0.2) 50%, 
              rgba(45, 212, 191, 0.3) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
            opacity: 0.6;
          }
          
          /* Blur effect for elements behind the glass card */
          #role-selection-page-container::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(1200px, 90vw);
            height: min(680px, 90vh);
            z-index: 15;
            pointer-events: none;
            background: radial-gradient(ellipse closest-side, rgba(30, 41, 59, 0.4) 0%, transparent 100%);
            filter: blur(20px);
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
        `}
      </style>
    </div>
  );
}
