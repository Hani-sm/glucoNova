import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import MetricCard from '@/components/MetricCard';
import GlucoseTrendChart from '@/components/GlucoseTrendChart';
import VoiceAssistantCard from '@/components/VoiceAssistantCard';
import ProgressCard from '@/components/ProgressCard';
import QuickActionCard from '@/components/QuickActionCard';
import { Droplet, Target, Utensils, Syringe, Heart, Pill, MessageCircle, FileText } from 'lucide-react';

export default function DashboardPage() {
  const sidebarStyle = {
    '--sidebar-width': '20rem',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, Hanisha SM</h1>
              <p className="text-muted-foreground">Here's your health overview for today</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Glucose"
                value="112"
                unit="mg/dL"
                status="In Range"
                icon={Droplet}
              />
              <MetricCard
                title="Time in Range"
                value="85%"
                unit=""
                status="Excellent • +12%"
                icon={Target}
              />
              <MetricCard
                title="Carbs"
                value="45g"
                unit=""
                status="On Track • 25% used"
                icon={Utensils}
              />
              <MetricCard
                title="Active Insulin"
                value="2.5U"
                unit=""
                status="Active • -1.2U"
                icon={Syringe}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlucoseTrendChart />
              </div>
              
              <div className="space-y-4">
                <VoiceAssistantCard
                  title="Voice Food Logging"
                  subtitle="Tap mic to log your meal"
                  buttonText="Log Meal"
                />
                <ProgressCard />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard
                  icon={Heart}
                  title="Blood Sugar Tracking"
                  description="Log and monitor your glucose levels"
                />
                <QuickActionCard
                  icon={Pill}
                  title="Medication Reminders"
                  description="Set up and manage your medications"
                />
                <QuickActionCard
                  icon={MessageCircle}
                  title="Doctor Communication"
                  description="Message your healthcare provider"
                />
                <QuickActionCard
                  icon={FileText}
                  title="Health Reports"
                  description="View and download your reports"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
