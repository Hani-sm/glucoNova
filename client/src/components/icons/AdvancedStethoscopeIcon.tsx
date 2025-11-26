export default function AdvancedStethoscopeIcon() {
  return (
    <svg className="w-16 h-16" viewBox="0 0 100 140" style={{ transformStyle: 'preserve-3d' }}>
      <defs>
        {/* Medical-grade metallic gradient */}
        <linearGradient id="tubingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>
        
        {/* Metal shine gradient */}
        <linearGradient id="metalShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f0f9ff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.7" />
        </linearGradient>
        
        {/* Diaphragm glow */}
        <radialGradient id="diaphragmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Ground shadow */}
      <ellipse cx="50" cy="135" rx="28" ry="4" fill="#0f172a" opacity="0.3" className="shadow-base" />
      
      {/* Main stethoscope structure */}
      <g className="stethoscope-float">
        
        {/* ==== EARPIECES ==== */}
        {/* Left earpiece */}
        <g className="earpiece-left">
          <circle cx="28" cy="15" r="5" fill="#164e63" opacity="0.8" />
          <circle cx="28" cy="15" r="4" fill="url(#metalShine)" />
          <circle cx="27" cy="14" r="1.5" fill="#f0f9ff" opacity="0.9" />
          
          {/* Curved arm extending outward */}
          <path 
            d="M 28 20 Q 20 28 18 40"
            fill="none"
            stroke="url(#tubingGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        
        {/* Right earpiece */}
        <g className="earpiece-right">
          <circle cx="72" cy="15" r="5" fill="#164e63" opacity="0.8" />
          <circle cx="72" cy="15" r="4" fill="url(#metalShine)" />
          <circle cx="73" cy="14" r="1.5" fill="#f0f9ff" opacity="0.9" />
          
          {/* Curved arm extending outward */}
          <path 
            d="M 72 20 Q 80 28 82 40"
            fill="none"
            stroke="url(#tubingGradient)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        
        {/* ==== LONG DOUBLE-LUMEN TUBING (70% of height) ==== */}
        {/* Left tube - thick rubber tubing */}
        <g className="left-tubing">
          <path 
            d="M 18 40 L 18 95"
            fill="none"
            stroke="#0c4a6e"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.5"
            filter="blur(2px)"
          />
          <path 
            d="M 18 40 L 18 95"
            fill="none"
            stroke="url(#tubingGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            className="tube-sway"
          />
          <path 
            d="M 16.5 40 L 16.5 95"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
        
        {/* Right tube - thick rubber tubing */}
        <g className="right-tubing">
          <path 
            d="M 82 40 L 82 95"
            fill="none"
            stroke="#0c4a6e"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.5"
            filter="blur(2px)"
          />
          <path 
            d="M 82 40 L 82 95"
            fill="none"
            stroke="url(#tubingGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            className="tube-sway"
          />
          <path 
            d="M 83.5 40 L 83.5 95"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
        
        {/* ==== Y-SHAPED BIFURCATION ==== */}
        <g className="y-junction">
          {/* Connector housing */}
          <rect x="35" y="92" width="30" height="12" rx="3" fill="#164e63" opacity="0.8" />
          <rect x="35" y="92" width="30" height="12" rx="3" fill="url(#metalShine)" opacity="0.9" />
          
          {/* Detail lines */}
          <line x1="38" y1="95" x2="62" y2="95" stroke="#0c4a6e" strokeWidth="0.5" opacity="0.6" />
          <line x1="38" y1="101" x2="62" y2="101" stroke="#0c4a6e" strokeWidth="0.5" opacity="0.6" />
          
          {/* Shine highlight */}
          <rect x="38" y="93.5" width="8" height="3" rx="1" fill="#f0f9ff" opacity="0.7" />
        </g>
        
        {/* ==== STEM TO CHESTPIECE ==== */}
        <g className="stem-tube">
          <path 
            d="M 50 104 L 50 115"
            fill="none"
            stroke="#0c4a6e"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.5"
            filter="blur(2px)"
          />
          <path 
            d="M 50 104 L 50 115"
            fill="none"
            stroke="url(#tubingGradient)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path 
            d="M 48.5 104 L 48.5 115"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
        
        {/* ==== LARGE CIRCULAR CHESTPIECE WITH DIAPHRAGM ==== */}
        <g className="chestpiece">
          {/* Glow effect */}
          <circle cx="50" cy="125" r="16" fill="url(#diaphragmGlow)" className="glow-pulse" filter="blur(3px)" />
          
          {/* Outer rim shadow */}
          <circle cx="50" cy="126" r="14" fill="#0c4a6e" opacity="0.6" />
          
          {/* Main chestpiece body */}
          <circle cx="50" cy="125" r="14" fill="#164e63" opacity="0.9" />
          
          {/* Outer metal rim */}
          <circle 
            cx="50" cy="125" r="14" 
            fill="none" 
            stroke="url(#metalShine)" 
            strokeWidth="2.5" 
            className="rim-pulse"
          />
          
          {/* Diaphragm membrane - inner circle */}
          <circle cx="50" cy="125" r="11" fill="#0891b2" opacity="0.4" className="diaphragm-vibrate" />
          
          {/* Inner ring detail */}
          <circle 
            cx="50" cy="125" r="11" 
            fill="none" 
            stroke="#06b6d4" 
            strokeWidth="1.5" 
            opacity="0.8"
            className="diaphragm-vibrate"
          />
          
          {/* Center acoustic point */}
          <circle cx="50" cy="125" r="3" fill="#0c4a6e" opacity="0.9" />
          <circle cx="50" cy="125" r="2" fill="#06b6d4" opacity="0.8" />
          
          {/* Realistic shine highlights */}
          <circle cx="45" cy="121" r="2.5" fill="#f0f9ff" opacity="0.8" className="shine" />
          <circle cx="53" cy="122" r="1.8" fill="#f0f9ff" opacity="0.6" className="shine" />
          <ellipse cx="48" cy="128" rx="3" ry="1.5" fill="#f0f9ff" opacity="0.4" />
        </g>
        
        {/* Sound wave indicators */}
        <g className="sound-waves" opacity="0.6">
          <path 
            d="M 30 120 Q 25 123 25 125 Q 25 127 30 130"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            className="wave-animate"
          />
          <path 
            d="M 70 120 Q 75 123 75 125 Q 75 127 70 130"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.5"
            className="wave-animate"
          />
        </g>
      </g>
      
      <style>{`
        /* Gentle floating animation */
        @keyframes gentleFloat {
          0%, 100% { 
            transform: translateY(0) rotateZ(-1deg);
          }
          50% { 
            transform: translateY(-6px) rotateZ(1deg);
          }
        }
        
        .stethoscope-float {
          animation: gentleFloat 5s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Tube sway - realistic rubber tube movement */
        @keyframes tubeSway {
          0%, 100% { 
            transform: translateX(0);
            opacity: 1;
          }
          50% { 
            transform: translateX(1px);
            opacity: 0.95;
          }
        }
        
        .tube-sway {
          animation: tubeSway 4s ease-in-out infinite;
        }
        
        /* Diaphragm membrane vibration */
        @keyframes diaphragmVibrate {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.03);
          }
        }
        
        .diaphragm-vibrate {
          animation: diaphragmVibrate 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Chestpiece rim pulse */
        @keyframes rimPulse {
          0%, 100% { 
            stroke-width: 2.5;
            opacity: 0.9;
          }
          50% { 
            stroke-width: 3;
            opacity: 1;
          }
        }
        
        .rim-pulse {
          animation: rimPulse 2.5s ease-in-out infinite;
        }
        
        /* Glow pulse effect */
        @keyframes glowEffect {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(0.95);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        
        .glow-pulse {
          animation: glowEffect 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Metallic shine movement */
        @keyframes shineGlint {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .shine {
          animation: shineGlint 3s ease-in-out infinite;
        }
        
        /* Sound wave animation */
        @keyframes waveMotion {
          0%, 100% { 
            opacity: 0.4;
            transform: scaleX(1);
          }
          50% { 
            opacity: 0.8;
            transform: scaleX(1.2);
          }
        }
        
        .wave-animate {
          animation: waveMotion 2s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Shadow breathing */
        @keyframes shadowBreathe {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.4;
            transform: scale(1.05);
          }
        }
        
        .shadow-base {
          animation: shadowBreathe 5s ease-in-out infinite;
          transform-origin: center;
        }
      `}</style>
    </svg>
  );
}
