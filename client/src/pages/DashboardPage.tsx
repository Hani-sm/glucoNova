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
      const response = await apiRequest('/api/predictions/insulin', {
        method: 'POST',
      });
      return response.json();
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

  // Floating emerald dots - noticeable movement
  const floatingDots = [
    { id: 1, size: 12, left: 15, top: 10, duration: 18, delay: 0, xRange: 28, yRange: 35 },
    { id: 2, size: 14, left: 85, top: 15, duration: 22, delay: 2, xRange: -32, yRange: 38 },
    { id: 3, size: 16, left: 10, top: 70, duration: 20, delay: 4, xRange: 35, yRange: -30 },
    { id: 4, size: 13, left: 88, top: 75, duration: 24, delay: 1, xRange: -26, yRange: 33 },
    { id: 5, size: 15, left: 5, top: 50, duration: 19, delay: 3, xRange: 30, yRange: -36 },
    { id: 6, size: 14, left: 92, top: 45, duration: 21, delay: 5, xRange: -29, yRange: 34 },
    { id: 7, size: 12, left: 20, top: 30, duration: 23, delay: 0.5, xRange: 33, yRange: 40 },
    { id: 8, size: 17, left: 78, top: 25, duration: 17, delay: 2.5, xRange: -34, yRange: -32 },
    { id: 9, size: 13, left: 12, top: 85, duration: 25, delay: 1.5, xRange: 27, yRange: 35 },
    { id: 10, size: 15, left: 90, top: 60, duration: 20, delay: 3.5, xRange: -31, yRange: 37 },
    { id: 11, size: 14, left: 25, top: 88, duration: 22, delay: 4.5, xRange: 32, yRange: -35 },
    { id: 12, size: 16, left: 82, top: 90, duration: 19, delay: 2.2, xRange: -28, yRange: 33 },
    { id: 13, size: 18, left: 40, top: 18, duration: 21, delay: 1.8, xRange: 30, yRange: 34 },
    { id: 14, size: 13, left: 65, top: 55, duration: 23, delay: 3.2, xRange: -33, yRange: -36 },
    { id: 15, size: 15, left: 8, top: 35, duration: 18, delay: 0.8, xRange: 26, yRange: 31 },
    { id: 16, size: 17, left: 95, top: 82, duration: 24, delay: 4.2, xRange: -35, yRange: 38 },
  ];

  // Uneven circular elements with varying opacity
  const unevenCircles = [
    { id: 1, size: 25, left: 30, top: 20, duration: 20, delay: 0, opacity: 0.08, xRange: 38, yRange: 45 },
    { id: 2, size: 35, left: 70, top: 65, duration: 19, delay: 3, opacity: 0.32, xRange: -42, yRange: 48 },
    { id: 3, size: 20, left: 18, top: 55, duration: 22, delay: 1.5, opacity: 0.06, xRange: 45, yRange: -40 },
    { id: 4, size: 30, left: 85, top: 35, duration: 18, delay: 4, opacity: 0.25, xRange: -40, yRange: 46 },
    { id: 5, size: 28, left: 50, top: 80, duration: 24, delay: 2.5, opacity: 0.15, xRange: 43, yRange: -42 },
    { id: 6, size: 22, left: 12, top: 25, duration: 21, delay: 5, opacity: 0.1, xRange: -46, yRange: 50 },
    { id: 7, size: 32, left: 60, top: 10, duration: 23, delay: 1, opacity: 0.28, xRange: 37, yRange: 41 },
    { id: 8, size: 24, left: 92, top: 70, duration: 19, delay: 3.5, opacity: 0.12, xRange: -44, yRange: -47 },
  ];

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
        
        {/* Animated Light Waves - Behind everything */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div 
            className="absolute top-0 left-0 right-0 h-96 opacity-30"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(33, 200, 155, 0.08), transparent)',
              animation: 'wave1 15s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute top-1/3 left-0 right-0 h-96 opacity-20"
            style={{
              background: 'radial-gradient(ellipse 70% 40% at 30% 50%, rgba(33, 200, 155, 0.06), transparent)',
              animation: 'wave2 18s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-96 opacity-25"
            style={{
              background: 'radial-gradient(ellipse 75% 45% at 70% 100%, rgba(33, 200, 155, 0.07), transparent)',
              animation: 'wave3 20s ease-in-out infinite',
            }}
          />
        </div>

        {/* Small Floating Dots - Above waves */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {floatingDots.map((dot) => (
            <div
              key={dot.id}
              className="absolute rounded-full bg-primary/50"
              style={{
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                left: `${dot.left}%`,
                top: `${dot.top}%`,
                animation: `floatDot${dot.id} ${dot.duration}s ease-in-out infinite`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Uneven Circular Elements - Above waves */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {unevenCircles.map((circle) => (
            <div
              key={`circle-${circle.id}`}
              className="absolute rounded-full bg-primary"
              style={{
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                left: `${circle.left}%`,
                top: `${circle.top}%`,
                opacity: circle.opacity,
                animation: `floatCircle${circle.id} ${circle.duration}s ease-in-out infinite`,
                animationDelay: `${circle.delay}s`,
              }}
            />
          ))}
        </div>

        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10 }}>
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
                    <Card 
                      data-testid="card-insulin-prediction" 
                      className="p-5 card-interactive glass-card flex flex-col justify-between relative overflow-hidden" 
                      style={{ height: '120px', borderRadius: '12px' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 pointer-events-none" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          <h3 className="font-bold text-base text-foreground">AI Insulin Prediction</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between relative z-10">
                        {isLoadingPrediction ? (
                          <p className="text-sm text-muted-foreground">Loading...</p>
                        ) : latestPrediction?.prediction ? (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-primary leading-none">
                                {latestPrediction.prediction.predictedInsulin.toFixed(1)}
                              </span>
                              <span className="text-sm text-muted-foreground">units</span>
                            </div>
                            <span className="text-sm text-muted-foreground font-medium">
                              {(latestPrediction.prediction.confidence * 100).toFixed(0)}% conf.
                            </span>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No data</p>
                        )}
                      </div>
                      <Button
                        data-testid="button-generate-prediction"
                        onClick={() => generatePredictionMutation.mutate()}
                        disabled={generatePredictionMutation.isPending}
                        className="w-full bg-primary text-primary-foreground relative z-10"
                        size="sm"
                      >
                        {generatePredictionMutation.isPending ? 'Generating...' : 'Generate Prediction'}
                      </Button>
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

      <style>{`
        ${floatingDots.map((dot) => `
          @keyframes floatDot${dot.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0); 
              opacity: 0.4; 
            }
            25% { 
              transform: translate3d(${dot.xRange * 0.4}px, ${dot.yRange * 0.4}px, 0); 
              opacity: 0.5; 
            }
            50% { 
              transform: translate3d(${dot.xRange}px, ${dot.yRange}px, 0); 
              opacity: 0.6; 
            }
            75% { 
              transform: translate3d(${dot.xRange * 0.6}px, ${dot.yRange * 0.7}px, 0); 
              opacity: 0.48; 
            }
          }
        `).join('\n')}

        ${unevenCircles.map((circle) => `
          @keyframes floatCircle${circle.id} {
            0%, 100% { 
              transform: translate3d(0, 0, 0) scale(1); 
              opacity: ${circle.opacity}; 
            }
            25% { 
              transform: translate3d(${circle.xRange * 0.5}px, ${circle.yRange * 0.4}px, 0) scale(1.05); 
              opacity: ${circle.opacity * 1.3}; 
            }
            50% { 
              transform: translate3d(${circle.xRange}px, ${circle.yRange}px, 0) scale(1.1); 
              opacity: ${circle.opacity * 1.5}; 
            }
            75% { 
              transform: translate3d(${circle.xRange * 0.7}px, ${circle.yRange * 0.6}px, 0) scale(1.03); 
              opacity: ${circle.opacity * 1.2}; 
            }
          }
        `).join('\n')}

        @keyframes wave1 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) scaleX(1.1);
            opacity: 0.4;
          }
        }

        @keyframes wave2 {
          0%, 100% { 
            transform: translateX(0) scaleY(1);
            opacity: 0.2;
          }
          50% { 
            transform: translateX(40px) scaleY(1.15);
            opacity: 0.3;
          }
        }

        @keyframes wave3 {
          0%, 100% { 
            transform: translateY(0) scaleX(1);
            opacity: 0.25;
          }
          50% { 
            transform: translateY(30px) scaleX(1.1);
            opacity: 0.35;
          }
        }
      `}</style>
    </SidebarProvider>
  );
}
