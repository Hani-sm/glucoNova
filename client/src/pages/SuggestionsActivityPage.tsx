import { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Lightbulb, Activity, TrendingUp, Apple, Heart, Footprints, Loader2, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SuggestionsData {
  dailyFocus: string;
  patterns: string[];
}

export default function SuggestionsActivityPage() {
  const { data: suggestions, isLoading } = useQuery<SuggestionsData>({
    queryKey: ['/api/suggestions-activity/today'],
  });

  const breakfastIdeas = [
    { name: 'Oats Upma with Vegetables', benefit: 'High fiber, low GI - stabilizes morning glucose' },
    { name: 'Moong Dal Cheela with Mint Chutney', benefit: 'Protein-rich, helps reduce glucose spikes' },
    { name: 'Vegetable Poha with Peanuts', benefit: 'Balanced carbs with protein and healthy fats' },
    { name: 'Sprouted Moong Salad', benefit: 'Rich in fiber and nutrients, minimal glucose impact' },
  ];

  const lunchDinnerSwaps = [
    { from: 'White Rice', to: 'Brown Rice / Millet / Quinoa', reason: 'Lower GI, better fiber content' },
    { from: 'Fried Pakoras', to: 'Baked Samosas / Air-fried snacks', reason: 'Reduced fat and calories' },
    { from: 'Regular Roti', to: 'Multigrain / Bajra Roti', reason: 'More fiber, slower digestion' },
    { from: 'Sugary Desserts', to: 'Fruit Salad with Nuts', reason: 'Natural sugars with fiber and protein' },
  ];

  const snackSuggestions = [
    { name: 'Handful of Almonds (10-12)', carbs: '6g', protein: '6g', impact: 'Low' },
    { name: 'Roasted Chana', carbs: '12g', protein: '8g', impact: 'Low' },
    { name: 'Cucumber & Carrot Sticks with Hummus', carbs: '8g', protein: '4g', impact: 'Low' },
    { name: 'Buttermilk (Chaas)', carbs: '5g', protein: '3g', impact: 'Low' },
  ];

  const activityGoals = [
    { goal: 'Daily Steps', target: '7,000 - 10,000 steps', benefit: 'Improves insulin sensitivity' },
    { goal: 'Post-Meal Walk', target: '15-20 minutes', benefit: 'Reduces glucose spikes by 20-30%' },
    { goal: 'Strength Training', target: '2-3 times/week', benefit: 'Builds muscle, improves glucose uptake' },
    { goal: 'Flexibility & Yoga', target: '10-15 minutes daily', benefit: 'Reduces stress, supports metabolism' },
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Suggestions & Activity</h2>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">AI Health Coach</h1>
              <p className="text-muted-foreground">Personalized food suggestions and activity recommendations for better diabetes management</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-2">Loading recommendations...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Daily Focus Tip */}
                <div className="rounded-lg p-6 border border-emerald-500/30" style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(34,211,238,0.1) 100%)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 20px rgba(16,185,129,0.15)',
                }}>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">Today's Focus</h3>
                      <p className="text-muted-foreground">
                        {suggestions?.dailyFocus || "Focus on reducing afternoon snacks and aim for a 20-minute walk after lunch. Your highest carb meals tend to be dinner - try balancing with more vegetables."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Food Suggestions for Diabetes */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="w-5 h-5 text-emerald-400" />
                      Food Suggestions for Diabetes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Breakfast Ideas */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-emerald-400">☀️</span>
                        Breakfast Ideas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {breakfastIdeas.map((idea, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-emerald-500/20">
                            <p className="font-medium text-sm text-foreground">{idea.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{idea.benefit}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lunch/Dinner Swaps */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-blue-400">🔄</span>
                        Healthier Swaps
                      </h4>
                      <div className="space-y-2">
                        {lunchDinnerSwaps.map((swap, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-blue-500/20">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-red-400 line-through">{swap.from}</span>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-emerald-400 font-medium">{swap.to}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{swap.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Snack Suggestions */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-purple-400">🥜</span>
                        Smart Snack Options
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {snackSuggestions.map((snack, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-purple-500/20">
                            <p className="font-medium text-sm text-foreground">{snack.name}</p>
                            <div className="flex gap-3 mt-1 text-xs">
                              <span className="text-primary">{snack.carbs} carbs</span>
                              <span className="text-emerald-400">{snack.protein} protein</span>
                              <span className="text-emerald-400">Impact: {snack.impact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Suggestions */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Activity Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activityGoals.map((activity, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-secondary/50 border border-cyan-500/20">
                          <div className="flex items-start gap-3">
                            <Footprints className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-foreground">{activity.goal}</h5>
                              <p className="text-sm text-primary mt-1">{activity.target}</p>
                              <p className="text-xs text-muted-foreground mt-2">{activity.benefit}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Patterns from Logs */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      Insights from Your Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {suggestions?.patterns && suggestions.patterns.length > 0 ? (
                      <div className="space-y-3">
                        {suggestions.patterns.map((pattern: string, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-secondary/50 border border-orange-500/20">
                            <p className="text-sm text-foreground flex items-start gap-2">
                              <span className="text-orange-400">•</span>
                              {pattern}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-foreground font-medium">Start Logging to See Patterns</p>
                        <p className="text-muted-foreground text-sm mt-2">
                          Log your meals and activities to receive personalized insights
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* General Diabetes Tips */}
                <div className="rounded-lg p-6 border border-blue-500/30" style={{
                  background: 'rgba(59, 130, 246, 0.08)',
                  backdropFilter: 'blur(8px)',
                }}>
                  <h3 className="font-semibold text-foreground mb-3">💡 General Diabetes Management Tips</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Maintain consistent meal timing throughout the day</p>
                    <p>✓ Never skip breakfast - it helps regulate blood sugar</p>
                    <p>✓ Stay hydrated with 2.5-3L water daily</p>
                    <p>✓ Aim for 7-8 hours of quality sleep</p>
                    <p>✓ Practice stress management through meditation or yoga</p>
                    <p>✓ Monitor blood glucose regularly and track trends</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
