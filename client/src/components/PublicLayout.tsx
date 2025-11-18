interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Generate minimal floating particles - very small and subtle
  const particles = [
    { id: 1, size: 8, left: 15, top: 10 },
    { id: 2, size: 10, left: 85, top: 15 },
    { id: 3, size: 6, left: 25, top: 70 },
    { id: 4, size: 8, left: 75, top: 60 },
    { id: 5, size: 7, left: 90, top: 80 },
    { id: 6, size: 9, left: 10, top: 85 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
      
      {/* Minimal Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-emerald-400/20"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `floatSlow ${20 + particle.id * 2}s ease-in-out infinite`,
              animationDelay: `${particle.id * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        {children}
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
