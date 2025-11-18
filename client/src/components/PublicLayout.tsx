interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Generate circular floating elements - small and subtle
  const floatingCircles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 12 + 6,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
    color: ['bg-cyan-400/30', 'bg-emerald-400/30', 'bg-blue-400/20', 'bg-slate-400/20'][Math.floor(Math.random() * 4)]
  }));

  return (
    <div className="min-h-screen w-full bg-[#1a2332] text-white overflow-hidden relative">
      
      {/* Light Wave Background - subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-r from-cyan-500/8 to-emerald-500/8 rounded-t-full animate-wave-slow"></div>
        <div className="absolute bottom-8 left-0 right-0 h-20 bg-gradient-to-r from-emerald-500/6 to-blue-500/6 rounded-t-full animate-wave-medium"></div>
        <div className="absolute bottom-16 left-0 right-0 h-16 bg-gradient-to-r from-blue-500/4 to-cyan-500/4 rounded-t-full animate-wave-fast"></div>
      </div>

      {/* Small Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingCircles.map((circle) => (
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
        {children}
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
