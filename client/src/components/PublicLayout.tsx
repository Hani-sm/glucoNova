interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Generate circular floating elements
  const floatingCircles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    color: ['bg-cyan-400/40', 'bg-emerald-400/40', 'bg-blue-400/40', 'bg-teal-400/40'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="min-h-screen w-full bg-[#1a2332] text-white overflow-hidden relative">
      
      {/* Light Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Wave layers */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-t-full animate-wave-slow"></div>
        <div className="absolute bottom-10 left-0 right-0 h-28 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 rounded-t-full animate-wave-medium"></div>
        <div className="absolute bottom-20 left-0 right-0 h-24 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-full animate-wave-fast"></div>
      </div>

      {/* Clear Floating Circles - Outside Card */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCircles.slice(0, 6).map((circle) => (
          <div
            key={circle.id}
            className={`absolute rounded-full ${circle.color}`}
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              animation: `floatSlow ${circle.duration}s ease-in-out infinite`,
              animationDelay: `${circle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-4">
        {/* Container for card with blurred circles behind it */}
        <div className="relative w-full max-w-xl">
          {/* Blurred Floating Circles - Behind Card */}
          <div className="absolute inset-0 overflow-visible pointer-events-none">
            {floatingCircles.slice(6).map((circle) => (
              <div
                key={circle.id}
                className={`absolute rounded-full ${circle.color} blur-md`}
                style={{
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                  left: `${circle.left - 50}%`,
                  top: `${circle.top - 50}%`,
                  animation: `floatSlow ${circle.duration}s ease-in-out infinite`,
                  animationDelay: `${circle.delay}s`,
                }}
              />
            ))}
          </div>
          
          {children}
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-30px) translateX(15px); }
          50% { transform: translateY(-15px) translateX(-15px); }
          75% { transform: translateY(-40px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}
