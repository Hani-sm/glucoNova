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
    { id: 7, size: 90, left: 20, top: 15 },
    { id: 8, size: 110, left: 75, top: 25 },
    { id: 9, size: 85, left: 35, top: 70 },
    { id: 10, size: 95, left: 70, top: 65 },
    { id: 17, size: 80, left: 50, top: 10 },
    { id: 18, size: 100, left: 25, top: 45 },
    { id: 19, size: 75, left: 80, top: 50 },
    { id: 20, size: 90, left: 45, top: 80 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      
      {/* Subtle Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-t-full"></div>
        <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-r from-cyan-500/4 to-emerald-500/4 rounded-t-full"></div>
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
              animation: `floatSlow ${20 + circle.id * 2}s ease-in-out infinite`,
              animationDelay: `${circle.id * 0.5}s`,
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
                  animation: `floatSlow ${15 + circle.id * 2}s ease-in-out infinite`,
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
      `}</style>
    </div>
  );
}
