interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  // Floating emerald dots - noticeable movement
  const floatingDots = [
    { id: 1, size: 12, left: 15, top: 10, duration: 35, delay: 0, xRange: 2, yRange: 3 },
    { id: 2, size: 14, left: 85, top: 15, duration: 38, delay: 2, xRange: -2, yRange: 3 },
    { id: 3, size: 16, left: 10, top: 70, duration: 36, delay: 4, xRange: 2, yRange: -2 },
    { id: 4, size: 13, left: 88, top: 75, duration: 40, delay: 1, xRange: -2, yRange: 3 },
    { id: 5, size: 15, left: 5, top: 50, duration: 37, delay: 3, xRange: 2, yRange: -3 },
    { id: 6, size: 14, left: 92, top: 45, duration: 39, delay: 5, xRange: -2, yRange: 3 },
    { id: 7, size: 12, left: 20, top: 30, duration: 41, delay: 0.5, xRange: 2, yRange: 3 },
    { id: 8, size: 17, left: 78, top: 25, duration: 34, delay: 2.5, xRange: -2, yRange: -2 },
    { id: 9, size: 13, left: 12, top: 85, duration: 42, delay: 1.5, xRange: 2, yRange: 3 },
    { id: 10, size: 15, left: 90, top: 60, duration: 37, delay: 3.5, xRange: -2, yRange: 3 },
    { id: 11, size: 14, left: 25, top: 88, duration: 39, delay: 4.5, xRange: 2, yRange: -3 },
    { id: 12, size: 16, left: 82, top: 90, duration: 36, delay: 2.2, xRange: -2, yRange: 3 },
    { id: 13, size: 18, left: 40, top: 18, duration: 38, delay: 1.8, xRange: 2, yRange: 3 },
    { id: 14, size: 13, left: 65, top: 55, duration: 40, delay: 3.2, xRange: -2, yRange: -3 },
    { id: 15, size: 15, left: 8, top: 35, duration: 35, delay: 0.8, xRange: 2, yRange: 2 },
    { id: 16, size: 17, left: 95, top: 82, duration: 41, delay: 4.2, xRange: -2, yRange: 3 },
  ];

  // Uneven circular elements with varying opacity
  const unevenCircles = [
    { id: 1, size: 25, left: 30, top: 20, duration: 38, delay: 0, opacity: 0.08, xRange: 2, yRange: 3 },
    { id: 2, size: 35, left: 70, top: 65, duration: 36, delay: 3, opacity: 0.32, xRange: -3, yRange: 3 },
    { id: 3, size: 20, left: 18, top: 55, duration: 40, delay: 1.5, opacity: 0.06, xRange: 3, yRange: -2 },
    { id: 4, size: 30, left: 85, top: 35, duration: 35, delay: 4, opacity: 0.25, xRange: -2, yRange: 3 },
    { id: 5, size: 28, left: 50, top: 80, duration: 42, delay: 2.5, opacity: 0.15, xRange: 3, yRange: -3 },
    { id: 6, size: 22, left: 12, top: 25, duration: 39, delay: 5, opacity: 0.1, xRange: -3, yRange: 3 },
    { id: 7, size: 32, left: 60, top: 10, duration: 41, delay: 1, opacity: 0.28, xRange: 2, yRange: 3 },
    { id: 8, size: 24, left: 92, top: 70, duration: 36, delay: 3.5, opacity: 0.12, xRange: -3, yRange: -3 },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 text-white overflow-x-hidden relative">
      
      {/* Animated Light Waves - Behind everything */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <div 
          className="absolute top-0 left-0 right-0 h-96 opacity-30"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52, 211, 153, 0.08), transparent)',
            animation: 'wave1 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute top-1/3 left-0 right-0 h-96 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 70% 40% at 30% 50%, rgba(52, 211, 153, 0.06), transparent)',
            animation: 'wave2 18s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-96 opacity-25"
          style={{
            background: 'radial-gradient(ellipse 75% 45% at 70% 100%, rgba(52, 211, 153, 0.07), transparent)',
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

      {/* Uneven Circular Elements - Above waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {unevenCircles.map((circle) => (
          <div
            key={`circle-${circle.id}`}
            className="absolute rounded-full bg-emerald-400"
            style={{
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              left: `${circle.left}%`,
              top: `${circle.top}%`,
              opacity: circle.opacity,
              animation: `floatCircle${circle.id} ${circle.duration}s ease-in-out infinite`,
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
        ${floatingDots.map((dot) => `
          @keyframes floatDot${dot.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.35; 
            }
            25% { 
              transform: translate3d(${dot.xRange * 0.2}px, ${dot.yRange * 0.15}px, 0); 
              opacity: 0.36; 
            }
            50% { 
              transform: translate3d(${dot.xRange * 0.5}px, ${dot.yRange * 0.55}px, 0); 
              opacity: 0.39; 
            }
            75% { 
              transform: translate3d(${dot.xRange * 0.3}px, ${dot.yRange * 0.4}px, 0); 
              opacity: 0.35; 
            }
          }
        `).join('\n')}

        ${unevenCircles.map((circle) => `
          @keyframes floatCircle${circle.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: ${circle.opacity}; 
            }
            25% { 
              transform: translate3d(${circle.xRange * 0.2}px, ${circle.yRange * 0.15}px, 0) scale(1.002); 
              opacity: ${circle.opacity + 0.005}; 
            }
            50% { 
              transform: translate3d(${circle.xRange * 0.5}px, ${circle.yRange * 0.55}px, 0) scale(1.003); 
              opacity: ${circle.opacity + 0.01}; 
            }
            75% { 
              transform: translate3d(${circle.xRange * 0.3}px, ${circle.yRange * 0.4}px, 0) scale(1.002); 
              opacity: ${circle.opacity + 0.003}; 
            }
          }
        `).join('\n')}

        @keyframes wave1 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-1.5px) scaleX(1.003);
            opacity: 0.32;
          }
        }

        @keyframes wave2 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.2;
          }
          50% { 
            transform: translateX(2px) scaleY(1.004);
            opacity: 0.22;
          }
        }

        @keyframes wave3 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.25;
          }
          50% { 
            transform: translateY(1.5px) scaleX(1.003);
            opacity: 0.27;
          }
        }
      `}</style>
    </div>
  );
}
