import { memo, useMemo } from 'react';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  opacity?: number;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  layer?: 'foreground' | 'background';
}

const FloatingParticles = memo(function FloatingParticles({
  count = 10,
  color = 'emerald',
  opacity = 40,
  minSize = 10,
  maxSize = 20,
  minDuration = 20,
  maxDuration = 35,
  layer = 'foreground'
}: FloatingParticlesProps) {
  // Unified emerald color palette for brand consistency
  const colorMap: Record<string, string> = useMemo(() => ({
    emerald: 'rgba(16, 185, 129',
    emeraldLight: 'rgba(52, 211, 153',
    emeraldDark: 'rgba(5, 150, 105'
  }), []);
  
  const baseColor = colorMap[color] || colorMap.emerald;
  
  // Layer-based configurations for depth and performance
  const layerConfig = useMemo(() => ({
    foreground: {
      zIndex: 20,
      opacity: opacity,
      glowIntensity: 1.3,
      description: 'Sharp particles that move in front of cards'
    },
    background: {
      zIndex: 5,
      opacity: opacity * 0.7,
      glowIntensity: 0.8,
      description: 'Particles behind cards with dynamic blur on overlap'
    }
  }), [opacity]);
  
  const config = layerConfig[layer];
  
  // Memoize particle data to prevent expensive recalculations
  const particles = useMemo(() => {
    const particleArray = [];
    for (let i = 0; i < count; i++) {
      particleArray.push({
        index: i,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * (maxDuration - minDuration) + minDuration,
        delay: Math.random() * 5,
        leftPos: Math.random() * 100,
        topPos: Math.random() * 100,
        horizontalRange: 30 + Math.random() * 40,
        verticalRange: 40 + Math.random() * 60
      });
    }
    return particleArray;
  }, [count, maxSize, minSize, maxDuration, minDuration]);
  
  const opacityValue = config.opacity / 100;

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden" 
      style={{ zIndex: config.zIndex }}
    >
      {particles.map((particle) => (
        <div
          key={`particle-${layer}-${particle.index}`}
          className={`absolute rounded-full particle-${layer}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.leftPos}%`,
            top: `${particle.topPos}%`,
            background: `radial-gradient(circle, ${baseColor}, ${opacityValue}) 0%, ${baseColor}, ${opacityValue * 0.2}) 100%)`,
            boxShadow: `
              0 0 ${particle.size * 2.5}px ${baseColor}, ${opacityValue * config.glowIntensity * 0.9}),
              0 0 ${particle.size * 5}px ${baseColor}, ${opacityValue * config.glowIntensity * 0.5}),
              inset 0 0 ${particle.size / 2.5}px ${baseColor}, ${opacityValue * 0.4})
            `,
            animation: `floatComplex-${particle.index % 3} ${particle.duration}s ease-in-out infinite, particlePulse ${particle.duration * 0.6}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`,
            willChange: 'transform',
            imageRendering: 'crisp-edges',
            // Custom property for horizontal/vertical range
            ['--float-h' as any]: `${particle.horizontalRange}px`,
            ['--float-v' as any]: `${particle.verticalRange}px`
          }}
        />
      ))}
      
      <style>{`
        /* Complex floating animations with varied paths */
        @keyframes floatComplex-0 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          25% { 
            transform: translate(var(--float-h, 50px), calc(var(--float-v, 60px) * -0.5)) rotate(5deg); 
          }
          50% { 
            transform: translate(calc(var(--float-h, 50px) * 0.7), calc(var(--float-v, 60px) * -1)) rotate(0deg); 
          }
          75% { 
            transform: translate(calc(var(--float-h, 50px) * -0.3), calc(var(--float-v, 60px) * -0.7)) rotate(-5deg); 
          }
        }
        
        @keyframes floatComplex-1 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          33% { 
            transform: translate(calc(var(--float-h, 50px) * -0.6), calc(var(--float-v, 60px) * -0.6)) rotate(-4deg); 
          }
          66% { 
            transform: translate(calc(var(--float-h, 50px) * 0.8), calc(var(--float-v, 60px) * -0.9)) rotate(4deg); 
          }
        }
        
        @keyframes floatComplex-2 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg); 
          }
          20% { 
            transform: translate(calc(var(--float-h, 50px) * 0.5), calc(var(--float-v, 60px) * -0.4)) rotate(3deg); 
          }
          40% { 
            transform: translate(calc(var(--float-h, 50px) * 0.9), calc(var(--float-v, 60px) * -0.8)) rotate(-3deg); 
          }
          60% { 
            transform: translate(calc(var(--float-h, 50px) * 0.4), calc(var(--float-v, 60px) * -1)) rotate(2deg); 
          }
          80% { 
            transform: translate(calc(var(--float-h, 50px) * -0.2), calc(var(--float-v, 60px) * -0.6)) rotate(-2deg); 
          }
        }
        
        /* Particle pulse animation - subtle scale and opacity */
        @keyframes particlePulse {
          0%, 100% { 
            opacity: ${opacityValue}; 
            transform: scale(1); 
          }
          50% { 
            opacity: ${Math.min(opacityValue + 0.15, 1)}; 
            transform: scale(1.1); 
          }
        }
        
        /* Foreground particles - always sharp, enhanced with screen blend */
        .particle-foreground {
          filter: none !important;
          mix-blend-mode: screen;
          transition: none;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Background particles - dynamic blur based on position */
        .particle-background {
          filter: blur(0px);
          transition: filter 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Particles in top-center area (where cards typically are) */
        @media (min-width: 640px) {
          .particle-background[style*="left: 2"][style*="top: 1"],
          .particle-background[style*="left: 2"][style*="top: 2"],
          .particle-background[style*="left: 3"][style*="top: 1"],
          .particle-background[style*="left: 3"][style*="top: 2"],
          .particle-background[style*="left: 3"][style*="top: 3"],
          .particle-background[style*="left: 4"][style*="top: 2"],
          .particle-background[style*="left: 4"][style*="top: 3"],
          .particle-background[style*="left: 5"][style*="top: 2"],
          .particle-background[style*="left: 5"][style*="top: 3"],
          .particle-background[style*="left: 6"][style*="top: 2"],
          .particle-background[style*="left: 6"][style*="top: 3"],
          .particle-background[style*="left: 7"][style*="top: 2"] {
            filter: blur(3.5px);
          }
        }
        
        /* Selective blur pattern - creates variety in depth */
        .particle-background:nth-child(4n+1) {
          animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
        }
        
        .particle-background:nth-child(4n+2) {
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
        }
        
        .particle-background:nth-child(4n+3) {
          animation-timing-function: cubic-bezier(0.35, 0.1, 0.65, 0.9);
        }
        
        /* Blur cycles that sync with movement - creates dynamic depth */
        @keyframes blurCycle-1 {
          0%, 100% { filter: blur(0px); }
          30%, 70% { filter: blur(2.5px); }
          50% { filter: blur(4px); }
        }
        
        @keyframes blurCycle-2 {
          0%, 100% { filter: blur(0px); }
          25%, 75% { filter: blur(3px); }
          50% { filter: blur(1.5px); }
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .particle-foreground,
          .particle-background {
            animation: none !important;
            opacity: ${opacityValue * 0.5};
          }
        }
      `}</style>
    </div>
  );
});

FloatingParticles.displayName = 'FloatingParticles';

export default FloatingParticles;
