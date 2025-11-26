export default function MedicalAnalyticsIcon() {
  return (
    <svg className="w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28" viewBox="0 0 64 64">
      {/* Screen/Monitor Frame */}
      <rect x="12" y="16" width="40" height="30" rx="2" fill="none" stroke="#f8fafc" strokeWidth="1.5" opacity="0.8" />
      
      {/* Patient Chart Icon */}
      <g transform="translate(16, 20)">
        <rect x="0" y="0" width="6" height="8" rx="0.5" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.7" />
        <circle cx="3" cy="3" r="1.5" fill="#10b981" opacity="0.6" />
        <line x1="1" y1="6" x2="5" y2="6" stroke="#10b981" strokeWidth="0.8" opacity="0.5" />
      </g>
      
      {/* Trending Graph with Data Flow */}
      <g className="analytics-graph">
        <path 
          d="M 16 36 L 20 32 L 24 34 L 28 28 L 32 30 L 36 26 L 40 28 L 44 24"
          fill="none" 
          stroke="#06b6d4" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="data-flow-line"
        />
        {/* Data points */}
        <circle cx="20" cy="32" r="1.5" fill="#06b6d4" className="data-point-1" />
        <circle cx="28" cy="28" r="1.5" fill="#06b6d4" className="data-point-2" />
        <circle cx="36" cy="26" r="1.5" fill="#06b6d4" className="data-point-3" />
        <circle cx="44" cy="24" r="1.5" fill="#06b6d4" className="data-point-4" />
      </g>
      
      {/* Vital Stats Indicators */}
      <g transform="translate(16, 40)">
        {/* Heart rate */}
        <rect x="0" y="0" width="8" height="3" rx="0.5" fill="#10b981" opacity="0.3" className="stat-1" />
        {/* Blood pressure */}
        <rect x="10" y="0" width="8" height="3" rx="0.5" fill="#06b6d4" opacity="0.3" className="stat-2" />
        {/* Temperature */}
        <rect x="20" y="0" width="8" height="3" rx="0.5" fill="#10b981" opacity="0.3" className="stat-3" />
      </g>
      
      {/* Monitor Stand */}
      <line x1="32" y1="46" x2="32" y2="50" stroke="#f8fafc" strokeWidth="2" opacity="0.6" />
      <line x1="26" y1="50" x2="38" y2="50" stroke="#f8fafc" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      
      <style>{`
        @keyframes dataFlow {
          0% { 
            stroke-dasharray: 0, 100;
            opacity: 0.6;
          }
          100% { 
            stroke-dasharray: 100, 0;
            opacity: 1;
          }
        }
        
        .data-flow-line {
          stroke-dasharray: 100;
          animation: dataFlow 3s ease-in-out infinite;
        }
        
        @keyframes dataPointPulse {
          0%, 100% { 
            opacity: 0.5;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        .data-point-1 { animation: dataPointPulse 2s ease-in-out infinite; }
        .data-point-2 { animation: dataPointPulse 2s ease-in-out infinite 0.3s; }
        .data-point-3 { animation: dataPointPulse 2s ease-in-out infinite 0.6s; }
        .data-point-4 { animation: dataPointPulse 2s ease-in-out infinite 0.9s; }
        
        @keyframes statGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .stat-1 { animation: statGlow 2.5s ease-in-out infinite; }
        .stat-2 { animation: statGlow 2.5s ease-in-out infinite 0.5s; }
        .stat-3 { animation: statGlow 2.5s ease-in-out infinite 1s; }
        
        @keyframes graphShift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        
        .analytics-graph {
          animation: graphShift 3s ease-in-out infinite;
        }
      `}</style>
    </svg>
  );
}
