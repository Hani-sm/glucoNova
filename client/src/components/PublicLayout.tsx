import FloatingParticles from './FloatingParticles';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#040815] to-[#071627] relative">
      <FloatingParticles />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {children}
        <footer className="absolute bottom-6 text-center">
          <p className="text-foreground/40 text-sm">
            © 2025 GlucoNova. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
