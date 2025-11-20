import AppSidebar from '@/components/AppSidebar';
import VoiceAssistantCard from '@/components/VoiceAssistantCard';
import { Mic } from 'lucide-react';

export default function VoiceAIPage() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '320px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Mic className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Voice AI Assistant</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Voice Assistant</h1>
              <p className="text-muted-foreground">Log meals and get insights using voice commands</p>
            </div>

            <div className="max-w-2xl">
              <VoiceAssistantCard
                title="Voice Food Logging"
                subtitle="Tap the microphone to log your meal using voice"
                buttonText="Start Recording"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
