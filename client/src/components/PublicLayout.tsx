interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Floating emerald dots - scattered around the screen
  const floatingDots = [
    { id: 1, size: 12, left: 15, top: 10, duration: 18, delay: 0, xRange: 25, yRange: 35 },
    { id: 2, size: 14, left: 85, top: 15, duration: 22, delay: 2, xRange: -30, yRange: 40 },
    { id: 3, size: 16, left: 10, top: 70, duration: 20, delay: 4, xRange: 35, yRange: -30 },
    { id: 4, size: 13, left: 88, top: 75, duration: 24, delay: 1, xRange: -25, yRange: 35 },
    { id: 5, size: 15, left: 5, top: 50, duration: 19, delay: 3, xRange: 30, yRange: -40 },
    { id: 6, size: 14, left: 92, top: 45, duration: 21, delay: 5, xRange: -28, yRange: 38 },
    { id: 7, size: 12, left: 20, top: 30, duration: 23, delay: 0.5, xRange: 32, yRange: 42 },
    { id: 8, size: 17, left: 78, top: 25, duration: 17, delay: 2.5, xRange: -35, yRange: -35 },
    { id: 9, size: 13, left: 12, top: 85, duration: 25, delay: 1.5, xRange: 28, yRange: 36 },
    { id: 10, size: 15, left: 90, top: 60, duration: 20, delay: 3.5, xRange: -30, yRange: 40 },
    { id: 11, size: 14, left: 25, top: 88, duration: 22, delay: 4.5, xRange: 33, yRange: -38 },
    { id: 12, size: 16, left: 82, top: 90, duration: 19, delay: 2.2, xRange: -27, yRange: 34 },
    { id: 13, size: 18, left: 40, top: 18, duration: 21, delay: 1.8, xRange: 29, yRange: 37 },
    { id: 14, size: 13, left: 65, top: 55, duration: 23, delay: 3.2, xRange: -31, yRange: -39 },
    { id: 15, size: 15, left: 8, top: 35, duration: 18, delay: 0.8, xRange: 26, yRange: 33 },
    { id: 16, size: 17, left: 95, top: 82, duration: 24, delay: 4.2, xRange: -34, yRange: 41 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden relative">
      
      {/* Animated Light Waves - Behind everything */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
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

      {/* Small Floating Dots - Above waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {floatingDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-emerald-400/50"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              animation: `floatDot${dot.id} ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
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
        ${floatingDots.map((dot) => `
          @keyframes floatDot${dot.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.4; 
            }
            25% { 
              transform: translate3d(${dot.xRange * 0.4}px, ${dot.yRange * 0.4}px, 0); 
              opacity: 0.5; 
            }
            50% { 
              transform: translate3d(${dot.xRange}px, ${dot.yRange}px, 0); 
              opacity: 0.6; 
            }
            75% { 
              transform: translate3d(${dot.xRange * 0.6}px, ${dot.yRange * 0.7}px, 0); 
              opacity: 0.48; 
            }
          }
        `).join('\n')}

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
