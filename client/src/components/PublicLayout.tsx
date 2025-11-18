interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Clear floating circles - outside card and around edges
  const clearCircles = [
    { id: 1, size: 10, left: 15, top: 10 },
    { id: 2, size: 8, left: 85, top: 15 },
    { id: 3, size: 12, left: 10, top: 70 },
    { id: 4, size: 9, left: 88, top: 75 },
    { id: 5, size: 7, left: 5, top: 50 },
    { id: 6, size: 11, left: 92, top: 45 },
    { id: 11, size: 9, left: 20, top: 30 },
    { id: 12, size: 10, left: 78, top: 25 },
    { id: 13, size: 8, left: 12, top: 85 },
    { id: 14, size: 11, left: 90, top: 60 },
    { id: 15, size: 7, left: 25, top: 88 },
    { id: 16, size: 10, left: 82, top: 90 },
  ];

  // Darker emerald green floating elements with blur - behind card
  const darkerEmeraldCircles = [
    { id: 30, size: 80, left: 25, top: 20, delay: 0 },
    { id: 31, size: 100, left: 70, top: 35, delay: 2 },
    { id: 32, size: 90, left: 15, top: 60, delay: 4 },
    { id: 33, size: 110, left: 80, top: 70, delay: 6 },
    { id: 34, size: 75, left: 50, top: 15, delay: 1 },
    { id: 35, size: 95, left: 35, top: 80, delay: 3 },
    { id: 36, size: 85, left: 65, top: 50, delay: 5 },
    { id: 37, size: 105, left: 45, top: 45, delay: 7 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
      
      {/* Animated Light Waves */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 right-0 h-96 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16, 185, 129, 0.08), transparent)',
            animation: 'wave1 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/3 left-0 right-0 h-96 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 30% 50%, rgba(6, 182, 212, 0.06), transparent)',
            animation: 'wave2 18s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-96 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 75% 45% at 70% 100%, rgba(16, 185, 129, 0.07), transparent)',
            animation: 'wave3 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Clear Floating Circles - Outside Card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {clearCircles.map((circle) => (
          <div
            key={circle.id}
            className="absolute rounded-full bg-emerald-400/25"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animation: `floatGentle ${15 + circle.id % 8}s ease-in-out infinite`,
              animationDelay: `${circle.id * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Darker Emerald Green Floating Elements - Behind Card with Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {darkerEmeraldCircles.map((circle) => (
          <div
            key={circle.id}
            className="absolute rounded-full bg-emerald-600/40 blur-xl"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animation: `floatDarker ${20 + circle.id % 5}s ease-in-out infinite`,
              animationDelay: `${circle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes floatGentle {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.25; 
          }
          25% { 
            transform: translate(20px, -30px); 
            opacity: 0.35; 
          }
          50% { 
            transform: translate(-15px, -50px); 
            opacity: 0.3; 
          }
          75% { 
            transform: translate(-25px, -25px); 
            opacity: 0.28; 
          }
        }

        @keyframes floatDarker {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.4; 
          }
          20% { 
            transform: translate(30px, -40px) scale(1.1); 
            opacity: 0.5; 
          }
          40% { 
            transform: translate(-20px, -70px) scale(0.95); 
            opacity: 0.45; 
          }
          60% { 
            transform: translate(-40px, -50px) scale(1.05); 
            opacity: 0.48; 
          }
          80% { 
            transform: translate(10px, -30px) scale(0.98); 
            opacity: 0.42; 
          }
        }

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
