import AppSidebar from '@/components/AppSidebar';
import { Activity } from 'lucide-react';
import GlucoseTrendChart from '@/components/GlucoseTrendChart';

export default function GlucosePage() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '320px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Glucose Monitoring</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Glucose Trends</h1>
              <p className="text-muted-foreground">Track your blood glucose levels over time</p>
            </div>

            <div className="space-y-6">
              <GlucoseTrendChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
