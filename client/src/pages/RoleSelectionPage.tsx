import { useLocation, Link } from 'wouter';
import { User, Stethoscope } from 'lucide-react';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    navigate(`/register?role=${role}`);
  };

  // Same floating dots from PublicLayout
  const floatingDots = [
    { id: 1, size: 12, left: 15, top: 10, duration: 18, delay: 0, xRange: 28, yRange: 35 },
    { id: 2, size: 14, left: 85, top: 15, duration: 22, delay: 2, xRange: -32, yRange: 38 },
    { id: 3, size: 16, left: 10, top: 70, duration: 20, delay: 4, xRange: 35, yRange: -30 },
    { id: 4, size: 13, left: 88, top: 75, duration: 24, delay: 1, xRange: -26, yRange: 33 },
    { id: 5, size: 15, left: 5, top: 50, duration: 19, delay: 3, xRange: 30, yRange: -36 },
    { id: 6, size: 14, left: 92, top: 45, duration: 21, delay: 5, xRange: -29, yRange: 34 },
    { id: 7, size: 12, left: 20, top: 30, duration: 23, delay: 0.5, xRange: 33, yRange: 40 },
    { id: 8, size: 17, left: 78, top: 25, duration: 17, delay: 2.5, xRange: -34, yRange: -32 },
    { id: 9, size: 13, left: 12, top: 85, duration: 25, delay: 1.5, xRange: 27, yRange: 35 },
    { id: 10, size: 15, left: 90, top: 60, duration: 20, delay: 3.5, xRange: -31, yRange: 37 },
    { id: 11, size: 14, left: 25, top: 88, duration: 22, delay: 4.5, xRange: 32, yRange: -35 },
    { id: 12, size: 16, left: 82, top: 90, duration: 19, delay: 2.2, xRange: -28, yRange: 33 },
    { id: 13, size: 18, left: 40, top: 18, duration: 21, delay: 1.8, xRange: 30, yRange: 34 },
    { id: 14, size: 13, left: 65, top: 55, duration: 23, delay: 3.2, xRange: -33, yRange: -36 },
    { id: 15, size: 15, left: 8, top: 35, duration: 18, delay: 0.8, xRange: 26, yRange: 31 },
    { id: 16, size: 17, left: 95, top: 82, duration: 24, delay: 4.2, xRange: -35, yRange: 38 },
  ];

  // Same uneven circles from PublicLayout
  const unevenCircles = [
    { id: 1, size: 25, left: 30, top: 20, duration: 20, delay: 0, opacity: 0.08, xRange: 38, yRange: 45 },
    { id: 2, size: 35, left: 70, top: 65, duration: 19, delay: 3, opacity: 0.32, xRange: -42, yRange: 48 },
    { id: 3, size: 20, left: 18, top: 55, duration: 22, delay: 1.5, opacity: 0.06, xRange: 45, yRange: -40 },
    { id: 4, size: 30, left: 85, top: 35, duration: 18, delay: 4, opacity: 0.25, xRange: -40, yRange: 46 },
    { id: 5, size: 28, left: 50, top: 80, duration: 24, delay: 2.5, opacity: 0.15, xRange: 43, yRange: -42 },
    { id: 6, size: 22, left: 12, top: 25, duration: 21, delay: 5, opacity: 0.1, xRange: -46, yRange: 50 },
    { id: 7, size: 32, left: 60, top: 10, duration: 23, delay: 1, opacity: 0.28, xRange: 37, yRange: 41 },
    { id: 8, size: 24, left: 92, top: 70, duration: 19, delay: 3.5, opacity: 0.12, xRange: -44, yRange: -47 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 text-white overflow-x-hidden relative">
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
            className="absolute rounded-full bg-emerald-400/50"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `floatDot${dot.id} ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Uneven Circular Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {unevenCircles.map((circle) => (
          <div
            key={`circle-${circle.id}`}
            className="absolute rounded-full bg-emerald-400"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              opacity: circle.opacity,
              animation: `floatCircle${circle.id} ${circle.duration}s ease-in-out infinite`,
              animationDelay: `${circle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Content - No max-width constraint */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <div 
          className="w-full max-w-5xl backdrop-blur-md bg-white/8 border border-white/15 rounded-3xl px-12 py-10 shadow-2xl"
          data-testid="container-role-selection"
        >
          {/* Header Section */}
          <div className="text-center mb-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 justify-items-center">
            {/* Patient Card */}
            <div
              onClick={() => handleRoleSelect('patient')}
              className="group relative rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02]"
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
                  className="text-sm font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
                  style={{ color: '#2dd4bf' }}
                >
                  Click to continue as Patient →
                </p>
              </div>
            </div>

            {/* Healthcare Provider Card */}
            <div
              onClick={() => handleRoleSelect('doctor')}
              className="group relative rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-[1.02]"
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
                  className="text-sm font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
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
      </div>

      <style>{`
        ${floatingDots.map((dot) => `
          @keyframes floatDot${dot.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.4; 
            }
            25% { 
              transform: translate3d(${dot.xRange * 0.4}px, ${dot.yRange * 0.4}px, 0); 
              opacity: 0.5; 
            }
            50% { 
              transform: translate3d(${dot.xRange}px, ${dot.yRange}px, 0); 
              opacity: 0.6; 
            }
            75% { 
              transform: translate3d(${dot.xRange * 0.6}px, ${dot.yRange * 0.7}px, 0); 
              opacity: 0.48; 
            }
          }
        `).join('\n')}

        ${unevenCircles.map((circle) => `
          @keyframes floatCircle${circle.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: ${circle.opacity}; 
            }
            25% { 
              transform: translate3d(${circle.xRange * 0.5}px, ${circle.yRange * 0.4}px, 0) scale(1.05); 
              opacity: ${circle.opacity * 1.3}; 
            }
            50% { 
              transform: translate3d(${circle.xRange}px, ${circle.yRange}px, 0) scale(1.1); 
              opacity: ${circle.opacity * 1.5}; 
            }
            75% { 
              transform: translate3d(${circle.xRange * 0.7}px, ${circle.yRange * 0.6}px, 0) scale(1.03); 
              opacity: ${circle.opacity * 1.2}; 
            }
          }
        `).join('\n')}

        @keyframes wave1 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) scaleX(1.1);
            opacity: 0.4;
          }
        }

        @keyframes wave2 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.2;
          }
          50% { 
            transform: translateX(40px) scaleY(1.15);
            opacity: 0.3;
          }
        }

        @keyframes wave3 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.25;
          }
          50% { 
            transform: translateY(30px) scaleX(1.1);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
