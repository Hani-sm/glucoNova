interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Clear floating circles - outside card
  const clearCircles = [
    { id: 1, size: 10, left: 15, top: 10 },
    { id: 2, size: 8, left: 85, top: 15 },
    { id: 3, size: 12, left: 10, top: 70 },
    { id: 4, size: 9, left: 88, top: 75 },
    { id: 5, size: 7, left: 5, top: 50 },
    { id: 6, size: 11, left: 92, top: 45 },
  ];

  // Blurred circles - behind card
  const blurredCircles = [
    { id: 7, size: 80, left: 30, top: 25 },
    { id: 8, size: 100, left: 60, top: 40 },
    { id: 9, size: 70, left: 45, top: 60 },
    { id: 10, size: 90, left: 55, top: 20 },
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
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
