interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Generate simple floating particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    color: ['bg-cyan-500/30', 'bg-emerald-500/30', 'bg-slate-400/20'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="min-h-screen w-full bg-[#1a2332] text-white overflow-hidden relative">
      
      {/* Simple Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute rounded-full ${particle.color}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `float ${15 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {children}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
