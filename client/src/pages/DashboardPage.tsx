import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import MetricCard from '@/components/MetricCard';
import GlucoseTrendChart from '@/components/GlucoseTrendChart';
import VoiceAssistantCard from '@/components/VoiceAssistantCard';
import ProgressCard from '@/components/ProgressCard';
import QuickActionCard from '@/components/QuickActionCard';
import OnboardingModal from '@/components/OnboardingModal';
import OnboardingBanner from '@/components/OnboardingBanner';
import { Droplet, Target, Utensils, Syringe, Heart, Pill, MessageCircle, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    const onboardingSkipped = localStorage.getItem('onboardingSkipped');
    
    if (!onboardingCompleted && !onboardingSkipped) {
      setShowOnboarding(true);
    } else if (!onboardingCompleted && onboardingSkipped === 'true') {
      setShowBanner(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowBanner(false);
    toast({
      title: 'Setup Complete!',
      description: 'Your profile has been configured successfully',
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setShowBanner(true);
  };

  const handleResumeSetup = () => {
    localStorage.removeItem('onboardingSkipped');
    setShowBanner(false);
    setShowOnboarding(true);
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
  };

  const { data: healthData, isLoading: isLoadingHealth } = useQuery({
    queryKey: ['/api/health-data'],
  });

  const { data: mealsData, isLoading: isLoadingMeals } = useQuery({
    queryKey: ['/api/meals'],
  });

  const { data: latestPrediction, isLoading: isLoadingPrediction } = useQuery({
    queryKey: ['/api/predictions/latest'],
  });

  const generatePredictionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/predictions/insulin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/predictions/latest'] });
      toast({
        title: 'Prediction Generated',
        description: 'Your insulin recommendation is ready',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Prediction Failed',
        description: error.message || 'Unable to generate prediction',
        variant: 'destructive',
      });
    },
  });

  const latestGlucose = healthData?.data?.[0]?.glucose || 0;
  const latestInsulin = healthData?.data?.[0]?.insulin || 0;
  
  const totalCarbs = mealsData?.data?.reduce((sum: number, meal: any) => sum + (meal.carbs || 0), 0) || 0;
  
  const calculateTimeInRange = () => {
    if (!healthData?.data || healthData.data.length === 0) return 0;
    
    const inRangeCount = healthData.data.filter((entry: any) => {
      const glucose = entry.glucose;
      return glucose >= 70 && glucose <= 180;
    }).length;
    
    return Math.round((inRangeCount / healthData.data.length) * 100);
  };
  
  const timeInRange = calculateTimeInRange();

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return 'Low';
    if (glucose > 180) return 'High';
    return 'In Range';
  };

  const sidebarStyle = {
    '--sidebar-width': '240px',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          {showBanner && (
            <OnboardingBanner 
              onResume={handleResumeSetup}
              onDismiss={handleDismissBanner}
            />
          )}
          <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto" style={{ padding: '24px' }}>
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
                {/* Main Content Grid: 1fr + 360px */}
                <div className="grid gap-7" style={{ gridTemplateColumns: '1fr 360px' }}>
                  {/* Left Column - Main Content */}
                  <div className="space-y-6">
                    {/* Top Stats Row - 4 cards across */}
                    <div className="grid grid-cols-4 gap-4">
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

                    {/* Glucose Trends Chart */}
                    <GlucoseTrendChart />

                    {/* Quick Actions at bottom */}
                    <div>
                      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                      <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  {/* Right Column - 360px wide */}
                  <div className="space-y-4">
                    <Card data-testid="card-insulin-prediction" className="relative overflow-hidden" style={{ height: '120px', borderRadius: '12px' }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-emerald-400/10 pointer-events-none" />
                      <CardHeader className="relative pb-2 pt-3 px-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                          <CardTitle className="text-base">AI Insulin Prediction</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="relative px-4 pb-3">
                        <div className="flex items-center justify-between">
                          {isLoadingPrediction ? (
                            <p className="text-xs text-muted-foreground">Loading...</p>
                          ) : latestPrediction?.prediction ? (
                            <>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-emerald-400">
                                  {latestPrediction.prediction.predictedInsulin.toFixed(1)}
                                </span>
                                <span className="text-xs text-muted-foreground">units</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {(latestPrediction.prediction.confidence * 100).toFixed(0)}% confidence
                              </span>
                            </>
                          ) : (
                            <p className="text-xs text-muted-foreground">No data</p>
                          )}
                        </div>
                        <Button
                          data-testid="button-generate-prediction"
                          onClick={() => generatePredictionMutation.mutate()}
                          disabled={generatePredictionMutation.isPending}
                          className="w-full mt-2"
                          size="sm"
                        >
                          {generatePredictionMutation.isPending ? 'Generating...' : 'Generate Prediction'}
                        </Button>
                      </CardContent>
                    </Card>
                    <VoiceAssistantCard
                      title="Voice Food Logging"
                      subtitle="Tap mic to log your meal"
                      buttonText="Log Meal"
                    />
                    <ProgressCard />
                  </div>
                </div>
              </>
            )}
            </div>
          </main>
        </div>
      </div>

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </SidebarProvider>
  );
}
