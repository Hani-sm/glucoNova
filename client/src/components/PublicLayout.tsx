interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
      
      {/* Enhanced Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Ocean Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/15 to-purple-700/20"></div>
        
        {/* Animated Wave Layers */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-r from-cyan-400/30 to-blue-500/40 rounded-t-full animate-wave-slow"></div>
        <div className="absolute bottom-10 left-0 right-0 h-32 bg-gradient-to-r from-blue-500/40 to-purple-600/50 rounded-t-full animate-wave-medium"></div>
        <div className="absolute bottom-20 left-0 right-0 h-28 bg-gradient-to-r from-purple-600/50 to-cyan-400/60 rounded-t-full animate-wave-fast"></div>
        
        {/* Floating Light Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl animate-pulse-fast"></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {children}
        <footer className="absolute bottom-6 text-center">
          <p className="text-cyan-100/40 text-sm">
            © 2025 GlucoNova. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
