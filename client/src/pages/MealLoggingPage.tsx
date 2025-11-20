import { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mealSchema, type InsertMeal } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Utensils, Mic } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export default function MealLoggingPage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  
  const form = useForm<InsertMeal>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: '',
      carbs: 0,
      protein: 0,
      fat: 0,
      calories: 0,
      voiceRecorded: false,
    },
  });

  const createMealMutation = useMutation({
    mutationFn: async (data: InsertMeal) => {
      return apiRequest('/api/meals', 'POST', data);
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Meal logged successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      form.reset();
      setIsRecording(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log meal',
        variant: 'destructive',
      });
    },
  });

  const { data: mealHistory } = useQuery({
    queryKey: ['/api/meals'],
  });

  const onSubmit = (data: InsertMeal) => {
    createMealMutation.mutate(data);
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    form.setValue('voiceRecorded', !isRecording);
    
    if (!isRecording) {
      toast({
        title: 'Voice Recording',
        description: 'Voice recording feature will be available soon',
      });
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '320px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Utensils className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Food AI</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Log Meals</h1>
              <p className="text-muted-foreground">Track your nutrition and meal intake</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">New Meal</h2>
                </div>

                <div className="mb-4">
                  <Button
                    type="button"
                    variant={isRecording ? 'destructive' : 'outline'}
                    className="w-full"
                    onClick={handleVoiceRecording}
                    data-testid="button-voice-record"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    {isRecording ? 'Stop Recording' : 'Log with Voice'}
                  </Button>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meal Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Breakfast, Chicken Salad"
                              {...field}
                              data-testid="input-meal-name"
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
                          <FormLabel>Carbohydrates (grams)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter carbs"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-carbs"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Protein (grams, optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter protein"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-protein"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fat (grams, optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter fat"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-fat"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter calories"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              data-testid="input-calories"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createMealMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createMealMutation.isPending ? 'Logging...' : 'Log Meal'}
                    </Button>
                  </form>
                </Form>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Recent Meals</h2>
                </div>

                <div className="space-y-3">
                  {mealHistory?.meals?.slice(0, 5).map((meal: any) => (
                    <div
                      key={meal._id}
                      className="p-4 rounded-lg bg-secondary/50 space-y-2"
                      data-testid={`meal-${meal._id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold" data-testid={`text-meal-name-${meal._id}`}>
                          {meal.name}
                        </span>
                        {meal.voiceRecorded && (
                          <Mic className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(meal.timestamp).toLocaleString()}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Carbs:</span>
                          <span className="ml-1 font-semibold" data-testid={`text-carbs-${meal._id}`}>
                            {meal.carbs}g
                          </span>
                        </div>
                        {meal.protein > 0 && (
                          <div>
                            <span className="text-muted-foreground">Protein:</span>
                            <span className="ml-1 font-semibold">{meal.protein}g</span>
                          </div>
                        )}
                        {meal.fat > 0 && (
                          <div>
                            <span className="text-muted-foreground">Fat:</span>
                            <span className="ml-1 font-semibold">{meal.fat}g</span>
                          </div>
                        )}
                        {meal.calories > 0 && (
                          <div>
                            <span className="text-muted-foreground">Calories:</span>
                            <span className="ml-1 font-semibold">{meal.calories}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No meals logged yet. Log your first meal!
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
