export default function HealthMetricsIcon() {
  return (
    <svg className="w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28" viewBox="0 0 64 64">
      {/* Dashboard Container */}
      <rect x="10" y="14" width="44" height="36" rx="3" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
      
      {/* Heart Rate Graph Line (EKG style) */}
      <path 
        d="M 14 28 L 18 28 L 20 24 L 22 32 L 24 28 L 26 28 L 28 28"
        fill="none" 
        stroke="#10b981" 
        strokeWidth="1.8" 
        strokeLinecap="round"
        className="heart-rate-line"
      />
      
      {/* Glucose Meter */}
      <g transform="translate(34, 20)">
        <rect x="0" y="0" width="8" height="12" rx="1" fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity="0.8" />
        <rect x="1" y="9" width="6" height="2" fill="#06b6d4" opacity="0.6" className="glucose-bar" />
        <text x="4" y="6" fontSize="5" fill="#06b6d4" textAnchor="middle" opacity="0.9">G</text>
      </g>
      
      {/* Activity Bar Graph */}
      <g transform="translate(14, 36)">
        <rect x="0" y="6" width="3" height="4" fill="#10b981" opacity="0.6" className="bar-1" />
        <rect x="4" y="3" width="3" height="7" fill="#10b981" opacity="0.7" className="bar-2" />
        <rect x="8" y="5" width="3" height="5" fill="#10b981" opacity="0.6" className="bar-3" />
        <rect x="12" y="2" width="3" height="8" fill="#10b981" opacity="0.8" className="bar-4" />
      </g>
      
      {/* Data Pulse Dot */}
      <circle cx="46" cy="24" r="2" fill="#06b6d4" className="pulse-dot" />
      
      <style>{`
        @keyframes heartRate {
          0%, 100% { opacity: 0.6; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(2px); }
        }
        
        .heart-rate-line {
          animation: heartRate 1.5s ease-in-out infinite;
        }
        
        @keyframes glucosePulse {
          0%, 100% { opacity: 0.6; height: 2px; }
          50% { opacity: 1; height: 3px; }
        }
        
        .glucose-bar {
          animation: glucosePulse 2s ease-in-out infinite;
          transform-origin: bottom;
        }
        
        @keyframes barGrow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.1); }
        }
        
        .bar-1 { animation: barGrow 2.5s ease-in-out infinite; transform-origin: bottom; }
        .bar-2 { animation: barGrow 2.5s ease-in-out infinite 0.2s; transform-origin: bottom; }
        .bar-3 { animation: barGrow 2.5s ease-in-out infinite 0.4s; transform-origin: bottom; }
        .bar-4 { animation: barGrow 2.5s ease-in-out infinite 0.6s; transform-origin: bottom; }
        
        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}
