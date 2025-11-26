import { useLocation, Link } from 'wouter';
import { useState, useEffect } from 'react';
import FloatingParticles from '@/components/FloatingParticles';
import CleanStethoscopeIcon from '@/components/icons/CleanStethoscopeIcon';
import HealthMetricsIcon from '@/components/icons/HealthMetricsIcon';
import MedicalAnalyticsIcon from '@/components/icons/MedicalAnalyticsIcon';

export default function RoleSelectionPage() {
  const [, navigate] = useLocation();
  const [patientIcon, setPatientIcon] = useState(0);
  const [doctorIcon, setDoctorIcon] = useState(0);

  // Patient icon cross-fade (4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPatientIcon(prev => (prev + 1) % 2);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Doctor icon cross-fade (4 seconds, offset by 2s)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDoctorIcon(prev => (prev + 1) % 2);
      }, 4000);
      return () => clearInterval(interval);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);


  const handleRoleSelect = (role: 'patient' | 'doctor') => {
    setTimeout(() => {
      navigate(`/register?role=${role}`);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Emerald Spotlight */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.08) 40%, transparent 70%)',
            animation: 'softPulse 8s ease-in-out infinite'
          }}
        />
        
        {/* Optimized Background Particles - Reduced Count, Larger Sizes */}
        {/* Background Layer - Behind cards with selective blur */}
        <FloatingParticles 
          count={10} 
          color="emerald" 
          opacity={40} 
          minSize={18} 
          maxSize={30} 
          minDuration={28} 
          maxDuration={42} 
          layer="background" 
        />
        
        {/* Foreground Layer - Sharp particles in front of cards */}
        <FloatingParticles 
          count={8} 
          color="emeraldLight" 
          opacity={55} 
          minSize={14} 
          maxSize={24} 
          minDuration={22} 
          maxDuration={35} 
          layer="foreground" 
        />
      </div>

      {/* Central Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 slide-in-bottom" style={{ animationDelay: '0ms' }}>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
            GlucoNova
          </h1>
          <h2 
            className="text-2xl lg:text-4xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Select Your Role
          </h2>
          <p className="text-lg text-slate-300/80">
            Choose which role you'd like to explore
          </p>
        </div>

        {/* Floating Glass Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-10">
          {/* Patient Card */}
          <div
            onClick={() => handleRoleSelect('patient')}
            className="group floating-card relative backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer active:scale-95 slide-in-bottom border border-emerald-500/10 hover:border-emerald-500/20"
            style={{ 
              animationDelay: '150ms',
              backgroundColor: '#0f172a',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '2px solid rgba(148, 163, 184, 0.6)',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            data-testid="card-role-patient"
          >
            {/* Enhanced Glow on Hover */}
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/8 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 -z-10" />

            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-400/30 backdrop-blur-xl">
                For Patients
              </span>
            </div>

            {/* Role Indicator - Larger, Higher Position with Premium Glow */}
            <div className="relative flex flex-col items-center mt-0 mb-8 group">
              {/* Large glow effect matching icon size */}
              <div className="absolute w-32 h-32 rounded-full bg-emerald-500/20 blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon container with hover lift */}
                <div className="relative z-10 w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center transform transition-all duration-300 group-hover:-translate-y-1">
                {/* Icon 1 - Clipboard */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                  style={{ opacity: patientIcon === 0 ? 1 : 0 }}
                >
                  <svg className="w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28" viewBox="0 0 64 64">
                    {/* Clipboard */}
                    <rect x="18" y="12" width="28" height="38" rx="2" fill="none" stroke="#6ee7b7" strokeWidth="1.8" opacity="0.8" className="stroke-draw" />
                    <rect x="26" y="10" width="12" height="4" rx="1" fill="none" stroke="#6ee7b7" strokeWidth="1.5" opacity="0.7" />
                    {/* Checkboxes */}
                    <rect x="22" y="22" width="4" height="4" rx="0.5" fill="none" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.7" />
                    <path d="M 23 24 L 24.5 25.5 L 27 23" stroke="#6ee7b7" strokeWidth="1.4" fill="none" className="check-draw" />
                    <line x1="30" y1="24" x2="42" y2="24" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.6" className="line-draw" />
                    
                    <rect x="22" y="32" width="4" height="4" rx="0.5" fill="none" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.7" />
                    <path d="M 23 34 L 24.5 35.5 L 27 33" stroke="#6ee7b7" strokeWidth="1.4" fill="none" className="check-draw" style={{ animationDelay: '0.3s' }} />
                    <line x1="30" y1="34" x2="42" y2="34" stroke="#6ee7b7" strokeWidth="1.2" opacity="0.6" className="line-draw" style={{ animationDelay: '0.3s' }} />
                  </svg>
                </div>
                
                {/* Icon 2 - Health Metrics Dashboard */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                  style={{ opacity: patientIcon === 1 ? 1 : 0 }}
                >
                  <HealthMetricsIcon />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 text-left">
              Patient Account
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-200/80 leading-relaxed max-w-md">
              Track your health metrics, manage insulin levels, and receive AI-powered insights for better diabetes management.
            </p>
            
            {/* Hover Hint Text */}
            <p className="mt-3 text-xs text-center text-emerald-300/0 group-hover:text-emerald-300/90 group-hover:translate-y-0 -translate-y-1 transition-all duration-300">
              Click here to continue as Patient
            </p>
          </div>

          {/* Provider Card */}
          <div
            onClick={() => handleRoleSelect('doctor')}
            className="group floating-card relative backdrop-blur-xl rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer active:scale-95 slide-in-bottom border border-cyan-500/10 hover:border-cyan-500/20"
            style={{ 
              animationDelay: '300ms',
              backgroundColor: '#0f172a',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
              border: '2px solid rgba(148, 163, 184, 0.6)',
              boxShadow: '0 24px 80px rgba(15, 23, 42, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            data-testid="card-role-doctor"
          >
            {/* Enhanced Glow on Hover */}
            <div className="absolute inset-0 rounded-3xl bg-cyan-500/8 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 -z-10" />

            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-medium border border-cyan-400/30 backdrop-blur-xl">
                For Providers
              </span>
            </div>

            {/* Role Indicator - Larger, Higher Position with Premium Glow */}
            <div className="relative flex flex-col items-center mt-0 mb-8 group">
              {/* Large glow effect matching icon size */}
              <div className="absolute w-32 h-32 rounded-full bg-cyan-500/20 blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Icon container with hover lift */}
              <div className="relative z-10 w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center transform transition-all duration-300 group-hover:-translate-y-1">
                {/* Icon 1 - Clean Stethoscope */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                  style={{ opacity: doctorIcon === 0 ? 1 : 0 }}
                >
                  <CleanStethoscopeIcon />
                </div>
                
                {/* Icon 2 - Medical Analytics Dashboard */}
                <div 
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
                  style={{ opacity: doctorIcon === 1 ? 1 : 0 }}
                >
                  <MedicalAnalyticsIcon />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3 text-left">
              Healthcare Provider
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-200/80 leading-relaxed max-w-md">
              Monitor patient data, analyze trends, and provide personalized care recommendations with advanced analytics.
            </p>
            
            {/* Hover Hint Text */}
            <p className="mt-3 text-xs text-center text-cyan-300/0 group-hover:text-cyan-300/90 group-hover:translate-y-0 -translate-y-1 transition-all duration-300">
              Click here to continue as Healthcare Provider
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center pt-6 slide-in-bottom" style={{ animationDelay: '450ms' }}>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400/80 transition-all duration-300 hover:gap-3 hover:text-emerald-300 hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            data-testid="link-back-to-login"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              window.history.pushState({}, '', '/login');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            <span>←</span>
            <span>Back to Login</span>
          </Link>
        </div>
      </div>

      <style>
        {`
          /* ==================================================
             BACKGROUND ANIMATIONS
             ================================================== */
          
          @keyframes softPulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          @keyframes slowFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          /* ==================================================
             SLIDE IN ANIMATIONS
             ================================================== */
          
          @keyframes slideInBottom {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .slide-in-bottom {
            animation: slideInBottom 0.6s ease-out forwards;
          }
          
          /* ==================================================
             FLOATING CARD ANIMATION
             ================================================== */
          
          @keyframes cardFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          .floating-card {
            animation: cardFloat 6s ease-in-out infinite;
          }
          
          /* ==================================================
             HOVER INTERACTIONS
             ================================================== */
          
          /* 3D Tilt on hover */
          .floating-card:hover {
            transform: translateY(-3px) rotateX(1deg) rotateY(-1deg) !important;
          }
          
          /* ==================================================
             CLIPBOARD ICON ANIMATIONS
             ================================================== */
          
          /* Stroke Drawing Animation */
          @keyframes strokeDraw {
            0% { stroke-dasharray: 0, 200; }
            100% { stroke-dasharray: 200, 0; }
          }
          
          .stroke-draw {
            stroke-dasharray: 200;
            animation: strokeDraw 2s ease-in-out infinite;
          }
          
          /* Checkmark Drawing */
          @keyframes checkDraw {
            0%, 20% { stroke-dasharray: 0, 10; opacity: 0.5; }
            40%, 100% { stroke-dasharray: 10, 0; opacity: 1; }
          }
          
          .check-draw {
            stroke-dasharray: 10;
            animation: checkDraw 3s ease-in-out infinite;
          }
          
          /* Line Drawing */
          @keyframes lineDraw {
            0%, 30% { stroke-dasharray: 0, 20; opacity: 0.3; }
            60%, 100% { stroke-dasharray: 20, 0; opacity: 0.6; }
          }
          
          .line-draw {
            stroke-dasharray: 20;
            animation: lineDraw 3s ease-in-out infinite;
          }
          
          /* ==================================================
             RESPONSIVENESS
             ================================================== */
          
          @media (max-width: 768px) {
            .floating-card {
              padding: 2rem;
            }
            
            .floating-card {
              box-shadow: 0 16px 60px rgba(15, 23, 42, 0.75);
            }
          }
          
          @media (max-width: 640px) {
            .floating-card {
              padding: 1.5rem;
            }
          }
          
          /* ==================================================
             ACCESSIBILITY - REDUCED MOTION
             ================================================== */
          
          @media (prefers-reduced-motion: reduce) {
            .slide-in-bottom,
            .floating-card {
              animation: none !important;
            }
            
            .slide-in-bottom {
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}
