import { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Activity, Droplet, TrendingUp, AlertCircle } from 'lucide-react';
import GlucoseTrendChart from '@/components/GlucoseTrendChart';
import MetricCard from '@/components/MetricCard';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertHealthDataSchema } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function GlucosePage() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertHealthDataSchema),
    defaultValues: {
      glucose: 0,
      insulin: 0,
      carbs: 0,
      activityLevel: 'moderate',
      notes: '',
    },
  });

  const { data: healthData, isLoading } = useQuery({
    queryKey: ['/api/health-data'],
  });

  const createHealthDataMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/health-data', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Glucose reading recorded successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/health-data'] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to record glucose reading',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: any) => {
    createHealthDataMutation.mutate(data);
  };

  const latestGlucose = healthData?.data?.[0]?.glucose || 0;
  const avgGlucose = healthData?.data?.length > 0 
    ? Math.round(healthData.data.reduce((sum: number, item: any) => sum + item.glucose, 0) / healthData.data.length)
    : 0;
  const highReadings = healthData?.data?.filter((item: any) => item.glucose > 180).length || 0;
  const lowReadings = healthData?.data?.filter((item: any) => item.glucose < 70).length || 0;

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return { status: 'Low', color: '#FF6B6B' };
    if (glucose > 180) return { status: 'High', color: '#FFB84D' };
    return { status: 'In Range', color: '#51CF66' };
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Glucose Monitoring</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Glucose Tracking</h1>
              <p className="text-muted-foreground">Monitor your blood glucose levels and trends</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading glucose data...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Statistics */}
                <div className="grid grid-cols-4 gap-4">
                  <MetricCard
                    title="Current"
                    value={latestGlucose > 0 ? latestGlucose.toString() : '--'}
                    unit="mg/dL"
                    status={latestGlucose > 0 ? getGlucoseStatus(latestGlucose).status : 'No Data'}
                    icon={Droplet}
                    iconColor="#60A5FA"
                    badgeBgColor="rgba(96, 165, 250, 0.2)"
                    badgeTextColor="#60A5FA"
                  />
                  <MetricCard
                    title="Average"
                    value={avgGlucose > 0 ? avgGlucose.toString() : '--'}
                    unit="mg/dL"
                    status={avgGlucose > 0 ? getGlucoseStatus(avgGlucose).status : 'No Data'}
                    icon={TrendingUp}
                    iconColor="#A78BFA"
                    badgeBgColor="rgba(167, 139, 250, 0.2)"
                    badgeTextColor="#A78BFA"
                  />
                  <MetricCard
                    title="High Readings"
                    value={highReadings.toString()}
                    unit=""
                    status={highReadings > 0 ? 'Needs Attention' : 'Good'}
                    icon={AlertCircle}
                    iconColor="#FB923C"
                    badgeBgColor="rgba(251, 146, 60, 0.2)"
                    badgeTextColor="#FB923C"
                  />
                  <MetricCard
                    title="Low Readings"
                    value={lowReadings.toString()}
                    unit=""
                    status={lowReadings > 0 ? 'Needs Attention' : 'Good'}
                    icon={AlertCircle}
                    iconColor="#2DD4BF"
                    badgeBgColor="rgba(45, 212, 191, 0.2)"
                    badgeTextColor="#2DD4BF"
                  />
                </div>

                {/* Main Chart */}
                <GlucoseTrendChart />

                {/* Input and Recent Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 glass-card">
                    <CardHeader>
                      <CardTitle>Record New Reading</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="glucose"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Glucose (mg/dL)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter glucose reading"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="insulin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Insulin (units)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter insulin dose"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="carbs"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Carbs (grams)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter carb intake"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Add any notes"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={createHealthDataMutation.isPending}
                          >
                            {createHealthDataMutation.isPending ? 'Recording...' : 'Record Reading'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>

                  <Card className="p-6 glass-card">
                    <CardHeader>
                      <CardTitle>Recent Readings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {healthData?.data?.slice(0, 8).map((reading: any, index: number) => {
                          const status = getGlucoseStatus(reading.glucose);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: status.color }}
                                  />
                                  <span className="font-semibold">{reading.glucose} mg/dL</span>
                                  <span className="text-xs text-muted-foreground">({status.status})</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(reading.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          );
                        }) || (
                          <p className="text-sm text-muted-foreground text-center py-8">
                            No readings yet. Record your first reading!
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
