import { useState, FormEvent, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { User, Stethoscope, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    
    if (!roleParam || (roleParam !== 'patient' && roleParam !== 'doctor')) {
      navigate('/role-selection');
      return;
    }
    
    setRole(roleParam as 'patient' | 'doctor');
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      navigate('/role-selection');
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: t('auth.passwordMismatch'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      toast({
        title: t('auth.registrationSuccess'),
        description: t('auth.welcomeMessage'),
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: t('auth.registrationFailed'),
        description: error.message || t('auth.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return null;
  }

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden relative flex items-center justify-center px-4 py-8"
      id="register-page-container"
    >
      {/* Back to Role Selection Button - Top Left */}
      <Link 
        href="/role-selection" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors duration-300 hover:bg-emerald-400/10 rounded-lg border border-emerald-400/20 backdrop-blur-sm"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <span>←</span>
        <span>{t('auth.backToRoles')}</span>
      </Link>

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

      {/* Register Card with Enhanced Glass-Morphism Effect */}
      <div 
        className="w-full max-w-2xl rounded-2xl px-10 py-8 shadow-2xl transition-all duration-300 relative animate-float"
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
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{t('app.name')}</h1>
          <p className="text-sm font-semibold text-emerald-400">{t('auth.createAccount')}</p>
        </div>
        
        {/* Role Badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              backgroundColor: 'rgba(45, 212, 191, 0.1)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
            }}
          >
            {role === 'patient' ? (
              <User className="h-5 w-5 text-emerald-400" />
            ) : (
              <Stethoscope className="h-5 w-5 text-emerald-400" />
            )}
            <span className="text-sm font-medium text-emerald-400">
              {role === 'patient' ? t('common.patient') : t('auth.selectRole.healthcareProvider')}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-gray-200 text-sm font-medium mb-2 block">
                {t('auth.fullName')}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
                placeholder={t('auth.enterFullName')}
                required
                disabled={isLoading}
                style={{
                  backgroundColor: 'rgba(70, 85, 110, 0.4)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
                data-testid="input-name"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-gray-200 text-sm font-medium mb-2 block">
                {t('auth.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
                placeholder={t('auth.emailPlaceholder')}
                required
                disabled={isLoading}
                style={{
                  backgroundColor: 'rgba(70, 85, 110, 0.4)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
                data-testid="input-email"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-gray-200 text-sm font-medium mb-2 block">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
                  placeholder={t('auth.createPassword')}
                  required
                  disabled={isLoading}
                  style={{
                    backgroundColor: 'rgba(70, 85, 110, 0.4)',
                    border: '1px solid rgba(45, 212, 191, 0.25)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}
                  data-testid="input-password"
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

            <div>
              <label htmlFor="confirmPassword" className="text-gray-200 text-sm font-medium mb-2 block">
                {t('auth.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all duration-300 placeholder-gray-500 text-white text-sm"
                  placeholder={t('auth.reEnterPassword')}
                  required
                  disabled={isLoading}
                  style={{
                    backgroundColor: 'rgba(70, 85, 110, 0.4)',
                    border: '1px solid rgba(45, 212, 191, 0.25)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                  }}
                  data-testid="input-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-400 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div 
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'rgba(45, 212, 191, 0.05)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
            }}
          >
            <p className="text-xs text-gray-300">
              {t('auth.accountReviewNotice')}
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/40 text-white"
            style={{
              background: 'linear-gradient(135deg, #2dd4bf 0%, #10b981 100%)',
              boxShadow: '0 4px 15px rgba(45, 212, 191, 0.3)',
            }}
            data-testid="button-create-account"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t('auth.creatingAccount')}
              </span>
            ) : t('auth.createAccount')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium" data-testid="link-login">
              {t('auth.login')}
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
        #register-page-container::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(800px, 90vw);
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
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2px);
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
