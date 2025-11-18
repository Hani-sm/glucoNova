interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Small clear floating circles - outside card and around edges
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

  // Darker, clearer circular elements - subtle floating
  const darkerCircles = [
    { id: 40, size: 60, left: 18, top: 25, delay: 0 },
    { id: 41, size: 70, left: 75, top: 20, delay: 1.5 },
    { id: 42, size: 55, left: 12, top: 55, delay: 3 },
    { id: 43, size: 65, left: 82, top: 65, delay: 4.5 },
    { id: 44, size: 50, left: 30, top: 75, delay: 2 },
    { id: 45, size: 58, left: 88, top: 40, delay: 3.5 },
  ];

  // Elements that cross behind the card with blur effect
  const crossingElements = [
    { id: 50, size: 90, startY: 25, direction: 'right', duration: 25, delay: 0 },
    { id: 51, size: 100, startY: 50, direction: 'left', duration: 28, delay: 5 },
    { id: 52, size: 85, startY: 65, direction: 'right', duration: 30, delay: 10 },
    { id: 53, size: 95, startY: 35, direction: 'left', duration: 26, delay: 15 },
    { id: 54, size: 80, startY: 55, direction: 'right', duration: 32, delay: 8 },
    { id: 55, size: 105, startY: 45, direction: 'left', duration: 27, delay: 12 },
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

      {/* Small Clear Floating Circles - Outside Card */}
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

      {/* Darker, Clearer Circular Elements - Subtle Floating */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {darkerCircles.map((circle) => (
          <div
            key={circle.id}
            className="absolute rounded-full bg-emerald-700/50"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animation: `floatSubtle ${18 + circle.id % 6}s ease-in-out infinite`,
              animationDelay: `${circle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Crossing Elements - Blur Only When Behind Card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {crossingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-emerald-600/45"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              top: `${element.startY}%`,
              animation: `crossWith${element.direction === 'right' ? 'Right' : 'Left'}Blur ${element.duration}s linear infinite`,
              animationDelay: `${element.delay}s`,
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

        @keyframes floatSubtle {
          0%, 100% { 
            transform: translate(0, 0); 
            opacity: 0.5; 
          }
          33% { 
            transform: translate(15px, -20px); 
            opacity: 0.55; 
          }
          66% { 
            transform: translate(-18px, -35px); 
            opacity: 0.52; 
          }
        }

        @keyframes crossWithRightBlur {
          0% { 
            left: -120px; 
            filter: blur(0px);
            opacity: 0;
          }
          5% {
            opacity: 0.45;
          }
          35% {
            filter: blur(0px);
            opacity: 0.45;
          }
          45% {
            filter: blur(25px);
            opacity: 0.3;
          }
          55% {
            filter: blur(25px);
            opacity: 0.3;
          }
          65% {
            filter: blur(0px);
            opacity: 0.45;
          }
          95% {
            opacity: 0.45;
          }
          100% { 
            left: calc(100% + 120px); 
            filter: blur(0px);
            opacity: 0;
          }
        }

        @keyframes crossWithLeftBlur {
          0% { 
            left: calc(100% + 120px); 
            filter: blur(0px);
            opacity: 0;
          }
          5% {
            opacity: 0.45;
          }
          35% {
            filter: blur(0px);
            opacity: 0.45;
          }
          45% {
            filter: blur(25px);
            opacity: 0.3;
          }
          55% {
            filter: blur(25px);
            opacity: 0.3;
          }
          65% {
            filter: blur(0px);
            opacity: 0.45;
          }
          95% {
            opacity: 0.45;
          }
          100% { 
            left: -120px; 
            filter: blur(0px);
            opacity: 0;
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
