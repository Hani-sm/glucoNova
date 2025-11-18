import FloatingParticles from '../FloatingParticles';

export default function FloatingParticlesExample() {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#040815] to-[#071627] relative">
      <FloatingParticles />
      <div className="relative z-10 flex items-center justify-center h-full">
        <p className="text-white text-lg">Floating particles background effect</p>
      </div>
    </div>
  );
}
