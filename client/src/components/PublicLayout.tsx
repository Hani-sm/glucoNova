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

  // Blurred circles - positioned around card edges to look like going behind
  const blurredCircles = [
    { id: 7, size: 50, left: 20, top: 15 },
    { id: 8, size: 60, left: 75, top: 25 },
    { id: 9, size: 45, left: 35, top: 70 },
    { id: 10, size: 55, left: 70, top: 65 },
    { id: 17, size: 40, left: 50, top: 10 },
    { id: 18, size: 58, left: 25, top: 45 },
    { id: 19, size: 42, left: 80, top: 50 },
    { id: 20, size: 48, left: 45, top: 75 },
  ];

  // Traversing elements - move across screen, behind and in front of card
  const traversingElements = [
    { id: 21, size: 38, startY: 20, direction: 'right' },
    { id: 22, size: 42, startY: 45, direction: 'left' },
    { id: 23, size: 35, startY: 65, direction: 'right' },
    { id: 24, size: 40, startY: 35, direction: 'left' },
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
              animation: `floatSlow ${12 + circle.id}s ease-in-out infinite`,
              animationDelay: `${circle.id * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Traversing Elements - Move across screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {traversingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-emerald-400/35 traversing-element"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              top: `${element.startY}%`,
              animation: `traverse${element.direction === 'right' ? 'Right' : 'Left'} ${15 + element.id}s linear infinite`,
              animationDelay: `${element.id * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg">
          {/* Blurred Floating Circles - Behind Card */}
          <div className="absolute inset-0 overflow-visible pointer-events-none" style={{ zIndex: -1 }}>
            {blurredCircles.map((circle) => (
              <div
                key={circle.id}
                className="absolute rounded-full bg-emerald-400/30 blur-2xl"
                style={{
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                  left: `${circle.left}%`,
                  top: `${circle.top}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `floatSlow ${10 + circle.id}s ease-in-out infinite`,
                  animationDelay: `${circle.id * 0.3}s`,
                }}
              />
            ))}
          </div>
          
          {children}
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { 
            transform: translateY(0) translateX(0) translate(-50%, -50%); 
            opacity: 0.3; 
          }
          25% { 
            transform: translateY(-40px) translateX(30px) translate(-50%, -50%); 
            opacity: 0.5; 
          }
          50% { 
            transform: translateY(-20px) translateX(-35px) translate(-50%, -50%); 
            opacity: 0.4; 
          }
          75% { 
            transform: translateY(-50px) translateX(15px) translate(-50%, -50%); 
            opacity: 0.45; 
          }
        }

        @keyframes traverseRight {
          0% { 
            left: -100px; 
            filter: blur(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
            filter: blur(0px);
          }
          35% {
            filter: blur(0px);
          }
          45% {
            filter: blur(20px);
            opacity: 0.3;
          }
          55% {
            filter: blur(20px);
            opacity: 0.3;
          }
          65% {
            filter: blur(0px);
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
            filter: blur(0px);
          }
          100% { 
            left: calc(100% + 100px); 
            filter: blur(0px);
            opacity: 0;
          }
        }

        @keyframes traverseLeft {
          0% { 
            left: calc(100% + 100px); 
            filter: blur(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
            filter: blur(0px);
          }
          35% {
            filter: blur(0px);
          }
          45% {
            filter: blur(20px);
            opacity: 0.3;
          }
          55% {
            filter: blur(20px);
            opacity: 0.3;
          }
          65% {
            filter: blur(0px);
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
            filter: blur(0px);
          }
          100% { 
            left: -100px; 
            filter: blur(0px);
            opacity: 0;
          }
        }

        .traversing-element {
          transition: filter 0.8s ease-in-out;
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
