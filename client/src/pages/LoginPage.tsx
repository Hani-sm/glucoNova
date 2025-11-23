import { useState, FormEvent, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  console.log('LoginPage component rendering...');
  
  useEffect(() => {
    console.log('LoginPage mounted successfully');
  }, []);
  
  const [, navigate] = useLocation();
  const { setSkipAuthUser, login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSkip = () => {
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    setShowRoleModal(false);
    // Use the auth context function to set skip auth user
    setSkipAuthUser(role);
    // Navigate based on role
    navigate(role === 'patient' ? '/dashboard' : '/dashboard');
  };

  // Floating dots animation data
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

  // Uneven circles animation data
  const unevenCircles = [
    { id: 1, size: 25, left: 30, top: 20, duration: 55, delay: 0, opacity: 0.05, xRange: 0.5, yRange: 0.75 },
    { id: 2, size: 35, left: 70, top: 65, duration: 52, delay: 3, opacity: 0.15, xRange: -0.75, yRange: 0.75 },
    { id: 3, size: 20, left: 18, top: 55, duration: 58, delay: 1.5, opacity: 0.03, xRange: 0.75, yRange: -0.5 },
    { id: 4, size: 30, left: 85, top: 35, duration: 50, delay: 4, opacity: 0.12, xRange: -0.5, yRange: 0.75 },
    { id: 5, size: 28, left: 50, top: 80, duration: 60, delay: 2.5, opacity: 0.08, xRange: 0.75, yRange: -0.75 },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Login attempt for:', email);
      await login(email, password);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back to GlucoNova!',
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden relative flex items-center justify-center px-4 py-8"
      id="login-page-container"
    >
      {/* Skip for Now Button - Top Right */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-4 py-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors duration-300 hover:bg-emerald-400/10 rounded-lg border border-emerald-400/20 backdrop-blur-sm"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        Skip for Now →
      </button>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 max-w-md w-full border border-emerald-500/20 shadow-2xl backdrop-blur-3xl"
            style={{
              backdropFilter: 'blur(30px) brightness(1.05)',
              WebkitBackdropFilter: 'blur(30px) brightness(1.05)',
              boxShadow: '0 8px 32px rgba(45, 212, 191, 0.12)'
            }}
          >
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Select Your Role</h2>
            <p className="text-gray-300 text-center mb-8 text-sm">Choose which role you'd like to explore</p>

            <div className="space-y-4">
              {/* Patient Option */}
              <button
                onClick={() => handleRoleSelect('patient')}
                className="w-full group relative rounded-xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] overflow-hidden border-2"
                style={{
                  background: 'rgba(30, 30, 50, 0.4)',
                  borderColor: 'rgba(45, 212, 191, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(45, 212, 191, 0.15)',
                        border: '1.5px solid rgba(45, 212, 191, 0.4)'
                      }}
                    >
                      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Patient</h3>
                  </div>
                  <p className="text-sm text-gray-400">Manage your glucose levels and health data</p>
                </div>
              </button>

              {/* Doctor Option */}
              <button
                onClick={() => handleRoleSelect('doctor')}
                className="w-full group relative rounded-xl p-6 cursor-pointer transition-all duration-500 hover:scale-[1.02] overflow-hidden border-2"
                style={{
                  background: 'rgba(30, 30, 50, 0.4)',
                  borderColor: 'rgba(45, 212, 191, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(45, 212, 191, 0.15)',
                        border: '1.5px solid rgba(45, 212, 191, 0.4)'
                      }}
                    >
                      <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V6.75m-10-3v3m5-3v3m-8 3h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Healthcare Provider</h3>
                  </div>
                  <p className="text-sm text-gray-400">Manage patient records and provide care</p>
                </div>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowRoleModal(false)}
              className="w-full mt-6 px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-300 transition-colors border border-gray-600/30 rounded-lg hover:bg-gray-600/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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

      {/* Login Card with Enhanced Glass-Morphism Effect */}
      <div 
        className="w-full max-w-md rounded-2xl px-10 py-8 shadow-2xl transition-all duration-300 relative animate-float"
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.35)',
          backdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%) brightness(1.1)',
          border: '1px solid rgba(45, 212, 191, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(45, 212, 191, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
          zIndex: 20,
        }}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">GlucoNova</h1>
          <p className="text-sm font-semibold text-emerald-400">Login</p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-gray-200 text-sm font-medium mb-2 block">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
              placeholder="email@example.com"
              required
              disabled={isLoading}
              style={{
                backgroundColor: 'rgba(70, 85, 110, 0.4)',
                border: '1px solid rgba(45, 212, 191, 0.25)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-gray-200 text-sm font-medium mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
                placeholder="Enter your password"
                required
                disabled={isLoading}
                style={{
                  backgroundColor: 'rgba(70, 85, 110, 0.4)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-300">
              <input type="checkbox" className="w-4 h-4 rounded mr-2" style={{ accentColor: '#2dd4bf' }} />
              Remember me
            </label>
            <Link href="#" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/40 text-white"
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #10b981 100%)',
              boxShadow: '0 4px 15px rgba(45, 212, 191, 0.3)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/role-selection" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10" />

        <p className="text-center text-xs text-gray-500">
          © 2025 GlucoNova. All rights reserved.
        </p>
      </div>

      <style>{`
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
        #login-page-container::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(500px, 90vw);
          height: min(680px, 90vh);
          z-index: 15;
          pointer-events: none;
          background: radial-gradient(ellipse closest-side, rgba(30, 41, 59, 0.4) 0%, transparent 100%);
          filter: blur(20px);
        }
        
        @keyframes wave1 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-2px) scaleX(1.003);
            opacity: 0.32;
          }
          50% { 
            transform: translateY(-3px) scaleX(1.005);
            opacity: 0.33;
          }
          75% {
            transform: translateY(-1.5px) scaleX(1.003);
            opacity: 0.31;
          }
        }
        @keyframes wave2 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-2.5px) scaleX(1.004);
            opacity: 0.22;
          }
          50% { 
            transform: translateY(-3.5px) scaleX(1.006);
            opacity: 0.24;
          }
          75% {
            transform: translateY(-2px) scaleX(1.004);
            opacity: 0.21;
          }
        }
        @keyframes wave3 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.25;
          }
          25% {
            transform: translateY(-1.8px) scaleX(1.003);
            opacity: 0.26;
          }
          50% { 
            transform: translateY(-2.8px) scaleX(1.005);
            opacity: 0.28;
          }
          75% {
            transform: translateY(-1.2px) scaleX(1.003);
            opacity: 0.26;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1.4);
          }
          50% {
            transform: translateY(-2px) scale(1.4);
          }
        }
        ${floatingDots.map(dot => `
          @keyframes floatDot${dot.id} {
            0%, 100% {
              transform: translate3d(0, 0, 0);
              opacity: 0.25;
            }
            12.5% {
              transform: translate3d(${dot.xRange * 1}px, ${dot.yRange * 0.8}px, 0);
              opacity: 0.255;
            }
            25% {
              transform: translate3d(${dot.xRange * 2}px, ${dot.yRange * 1.5}px, 0);
              opacity: 0.26;
            }
            37.5% {
              transform: translate3d(${dot.xRange * 3}px, ${dot.yRange * 2.2}px, 0);
              opacity: 0.265;
            }
            50% {
              transform: translate3d(${dot.xRange * 4}px, ${dot.yRange * 3}px, 0);
              opacity: 0.28;
            }
            62.5% {
              transform: translate3d(${dot.xRange * 3.5}px, ${dot.yRange * 2.5}px, 0);
              opacity: 0.27;
            }
            75% {
              transform: translate3d(${dot.xRange * 2.5}px, ${dot.yRange * 2}px, 0);
              opacity: 0.265;
            }
            87.5% {
              transform: translate3d(${dot.xRange * 1}px, ${dot.yRange * 0.8}px, 0);
              opacity: 0.255;
            }
          }
        `).join('')}
        ${unevenCircles.map(circle => `
          @keyframes floatCircle${circle.id} {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: ${circle.opacity};
            }
            12.5% {
              transform: translate3d(${circle.xRange * 1}px, ${circle.yRange * 0.8}px, 0) scale(1.0005);
              opacity: ${circle.opacity + 0.0005};
            }
            25% {
              transform: translate3d(${circle.xRange * 2}px, ${circle.yRange * 1.5}px, 0) scale(1.001);
              opacity: ${circle.opacity + 0.002};
            }
            37.5% {
              transform: translate3d(${circle.xRange * 3}px, ${circle.yRange * 2.2}px, 0) scale(1.0015);
              opacity: ${circle.opacity + 0.0025};
            }
            50% {
              transform: translate3d(${circle.xRange * 4}px, ${circle.yRange * 3}px, 0) scale(1.002);
              opacity: ${circle.opacity + 0.003};
            }
            62.5% {
              transform: translate3d(${circle.xRange * 3.5}px, ${circle.yRange * 2.5}px, 0) scale(1.0015);
              opacity: ${circle.opacity + 0.0025};
            }
            75% {
              transform: translate3d(${circle.xRange * 2.5}px, ${circle.yRange * 2}px, 0) scale(1.001);
              opacity: ${circle.opacity + 0.002};
            }
            87.5% {
              transform: translate3d(${circle.xRange * 1}px, ${circle.yRange * 0.8}px, 0) scale(1.0005);
              opacity: ${circle.opacity + 0.0005};
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
}