import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import MetricCard from '@/components/MetricCard';
import GlucoseTrendChart from '@/components/GlucoseTrendChart';
import VoiceAssistantCard from '@/components/VoiceAssistantCard';
import ProgressCard from '@/components/ProgressCard';
import QuickActionCard from '@/components/QuickActionCard';
import { Droplet, Target, Utensils, Syringe, Heart, Pill, MessageCircle, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['/api/health-data'],
  });

  const { data: mealsData, isLoading: isLoadingMeals } = useQuery({
    queryKey: ['/api/meals'],
  });

  const latestGlucose = healthData?.healthData?.[0]?.glucose || 0;
  const latestInsulin = healthData?.healthData?.[0]?.insulin || 0;
  
  const totalCarbs = mealsData?.meals?.reduce((sum: number, meal: any) => sum + (meal.carbs || 0), 0) || 0;
  
  const calculateTimeInRange = () => {
    if (!healthData?.healthData || healthData.healthData.length === 0) return 0;
    
    const inRangeCount = healthData.healthData.filter((entry: any) => {
      const glucose = entry.glucose;
      return glucose >= 70 && glucose <= 180;
    }).length;
    
    return Math.round((inRangeCount / healthData.healthData.length) * 100);
  };
  
  const timeInRange = calculateTimeInRange();

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return 'Low';
    if (glucose > 180) return 'High';
    return 'In Range';
  };

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
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.name || 'User'}</h1>
              <p className="text-muted-foreground">Here's your health overview for today</p>
            </div>

            {isLoadingHealth || isLoadingMeals ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your health data...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <MetricCard
                    title="Glucose"
                    value={latestGlucose > 0 ? latestGlucose.toString() : '--'}
                    unit="mg/dL"
                    status={latestGlucose > 0 ? getGlucoseStatus(latestGlucose) : 'No Data'}
                    icon={Droplet}
                  />
                  <MetricCard
                    title="Time in Range"
                    value={`${timeInRange}%`}
                    unit=""
                    status={timeInRange >= 70 ? 'Excellent' : timeInRange >= 50 ? 'Good' : 'Needs Improvement'}
                    icon={Target}
                  />
                  <MetricCard
                    title="Carbs Today"
                    value={totalCarbs > 0 ? `${totalCarbs}g` : '--'}
                    unit=""
                    status={totalCarbs > 0 ? 'Tracked' : 'No Data'}
                    icon={Utensils}
                  />
                  <MetricCard
                    title="Active Insulin"
                    value={latestInsulin > 0 ? `${latestInsulin}U` : '--'}
                    unit=""
                    status={latestInsulin > 0 ? 'Active' : 'No Data'}
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
                    <Link href="/health-data">
                      <div className="cursor-pointer">
                        <QuickActionCard
                          icon={Heart}
                          title="Blood Sugar Tracking"
                          description="Log and monitor your glucose levels"
                        />
                      </div>
                    </Link>
                    <Link href="/meals">
                      <div className="cursor-pointer">
                        <QuickActionCard
                          icon={Utensils}
                          title="Meal Logging"
                          description="Track your nutrition and carbs"
                        />
                      </div>
                    </Link>
                    <Link href="/reports">
                      <div className="cursor-pointer">
                        <QuickActionCard
                          icon={FileText}
                          title="Health Reports"
                          description="View and download your reports"
                        />
                      </div>
                    </Link>
                    <div className="cursor-pointer">
                      <QuickActionCard
                        icon={MessageCircle}
                        title="Doctor Communication"
                        description="Message your healthcare provider"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
