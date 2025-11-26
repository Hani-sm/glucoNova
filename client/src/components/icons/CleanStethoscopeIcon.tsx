export default function CleanStethoscopeIcon() {
  return (
    <svg className="w-24 h-24 md:w-24 md:h-24 lg:w-28 lg:h-28" viewBox="0 0 64 64">
      <defs>
        {/* Subtle glow for stethoscope */}
        <filter id="stethoscopeGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Left earpiece tip */}
      <circle cx="22" cy="12" r="2.5" fill="none" stroke="#a5f3fc" strokeWidth="1.5" filter="url(#stethoscopeGlow)" />
      
      {/* Right earpiece tip */}
      <circle cx="42" cy="12" r="2.5" fill="none" stroke="#a5f3fc" strokeWidth="1.5" filter="url(#stethoscopeGlow)" />
      
      {/* U-shaped earpiece connector */}
      <path 
        d="M 22 14 Q 22 20 24 24 Q 28 30 32 30 Q 36 30 40 24 Q 42 20 42 14"
        fill="none"
        stroke="#a5f3fc"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="url(#stethoscopeGlow)"
      />
      
      {/* Tubing - drops down then curves to the right */}
      <path 
        d="M 32 30 L 32 40 Q 32 46 38 50 Q 44 54 48 54"
        fill="none"
        stroke="#a5f3fc"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#stethoscopeGlow)"
      />
      
      {/* Diaphragm - animated */}
      <g className="origin-center animate-[diaphragmMove_3s_ease-in-out_infinite]" style={{ transformOrigin: '48px 54px' }}>
        {/* Outer circle */}
        <circle 
          cx="48" 
          cy="54" 
          r="6" 
          fill="none" 
          stroke="#a5f3fc" 
          strokeWidth="1.8" 
          filter="url(#stethoscopeGlow)"
        />
        
        {/* Inner detail circle */}
        <circle 
          cx="48" 
          cy="54" 
          r="4" 
          fill="none" 
          stroke="#6ee7b7" 
          strokeWidth="1.2" 
          opacity="0.7"
        />
      </g>
      
      <style>{`
        @keyframes diaphragmMove {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </svg>
  );
}
