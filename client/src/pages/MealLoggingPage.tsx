import { useState, useRef, useEffect } from 'react';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mealSchema, type InsertMeal } from '@shared/schema';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Utensils, Mic, AlertCircle, TrendingUp, Activity, Sparkles, Keyboard, Scale } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function MealLoggingPage() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [description, setDescription] = useState('');
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [inputMode, setInputMode] = useState<'voice' | 'manual'>('manual');
  const [portionSize, setPortionSize] = useState('');
  const [portionUnit, setPortionUnit] = useState('grams');

  const { data: profileData } = useQuery({
    queryKey: ['/api/profile'],
  });
  
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
    createMealMutation.mutate({ ...data, voiceRecorded: isRecording });
  };

  // Simple rule-based estimator for common foods
  const estimateNutrition = (text: string) => {
    const lower = text.toLowerCase();
    const ingredients: string[] = [];
    let carbs = 0, protein = 0, fat = 0, calories = 0, sugar = 0;

    const add = (ing: string, c:{carbs?:number, protein?:number, fat?:number, calories?:number, sugar?:number}) => {
      ingredients.push(ing);
      carbs += c.carbs || 0;
      protein += c.protein || 0;
      fat += c.fat || 0;
      calories += c.calories || 0;
      sugar += c.sugar || 0;
    };

    if (lower.includes('rice')) add('rice', { carbs: 45, calories: 200, sugar: 0 });
    if (lower.includes('bread')) add('bread', { carbs: 30, protein: 5, calories: 180, sugar: 4 });
    if (lower.includes('oatmeal')) add('oatmeal', { carbs: 40, protein: 6, calories: 220, sugar: 1 });
    if (lower.includes('banana')) add('banana', { carbs: 27, calories: 105, sugar: 14 });
    if (lower.includes('apple')) add('apple', { carbs: 25, calories: 95, sugar: 19 });
    if (lower.includes('chicken')) add('chicken', { protein: 25, fat: 5, calories: 180 });
    if (lower.includes('salad')) add('salad', { carbs: 10, protein: 2, calories: 60 });
    if (lower.includes('pasta')) add('pasta', { carbs: 40, protein: 7, calories: 220, sugar: 2 });
    if (lower.includes('pizza')) add('pizza', { carbs: 35, protein: 12, fat: 12, calories: 300, sugar: 4 });
    if (lower.includes('milk')) add('milk', { carbs: 12, protein: 8, fat: 4, calories: 150, sugar: 12 });
    if (lower.includes('yogurt')) add('yogurt', { carbs: 15, protein: 10, fat: 2, calories: 120, sugar: 12 });
    if (lower.includes('brown rice')) carbs += 5;

    // Portion heuristics
    const gMatch = lower.match(/(\d+)(\s?)(g|grams)/);
    if (gMatch) {
      const grams = parseInt(gMatch[1], 10);
      const scale = grams / 100;
      carbs = Math.round(carbs * scale);
      protein = Math.round(protein * scale);
      fat = Math.round(fat * scale);
      calories = Math.round(calories * scale);
      sugar = Math.round(sugar * scale);
    }

    return { ingredients, macros: { carbs, protein, fat, calories, sugar } };
  };

  const impactInsights = (macros: any, profile: any) => {
    const type = profile?.profile?.diabetesType || 'unknown';
    const insulin = profile?.profile?.typicalInsulin || 0;
    const carbs = macros.carbs || 0;
    const glycemicLoad = Math.round(carbs * 0.55); // rough estimate
    let impact = 'moderate';
    if (carbs >= 60) impact = 'high';
    else if (carbs <= 25) impact = 'low';

    let recommendation = 'Consider pre-bolus insulin and post-meal walk.';
    if (type === 'type 1') recommendation = 'Match insulin dose to carbs (ICR). Pre-bolus 10–15 min.';
    if (type === 'type 2') recommendation = 'Prefer lower GI foods; add protein/fiber to reduce spike.';

    return {
      impact,
      glycemicLoad,
      recommendation,
      advisory: insulin > 0 ? 'Adjust dose per ICR/ISF if applicable.' : 'Monitor post-meal glucose closely.',
    };
  };

  const analyzeDescription = (text: string) => {
    if (!text.trim()) {
      toast({
        title: 'No Input',
        description: 'Please enter or speak a meal description first',
        variant: 'destructive',
      });
      return;
    }
    const est = estimateNutrition(text);
    const insights = impactInsights(est.macros, profileData);
    setAnalysis({ ...est, insights });
    // pre-fill form
    form.setValue('name', text.trim());
    form.setValue('carbs', est.macros.carbs || 0);
    form.setValue('protein', est.macros.protein || 0);
    form.setValue('fat', est.macros.fat || 0);
    form.setValue('calories', est.macros.calories || 0);
    
    toast({
      title: 'Analysis Complete',
      description: `Found ${est.ingredients.length} ingredients with nutritional breakdown`,
    });
  };

  // Voice recording handler
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          interim += transcript;
        }
        setTranscript(interim);
        setDescription(interim);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({
          title: 'Error',
          description: `Speech recognition error: ${event.error}`,
          variant: 'destructive',
        });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (transcript) {
          analyzeDescription(transcript);
        }
      };
    }
  }, [transcript, toast]);

  const handleVoiceRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Speech Recognition is not supported in your browser',
        variant: 'destructive',
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setDescription('');
      setAnalysis(null);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
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

                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as 'voice' | 'manual')} className="mb-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      Type Manually
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      Voice Input
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Food Description</label>
                      <Input
                        placeholder="e.g., Grilled chicken breast with steamed broccoli"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        data-testid="input-meal-description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none flex items-center gap-2">
                          <Scale className="h-3 w-3" />
                          Portion Size
                        </label>
                        <Input
                          type="number"
                          placeholder="200"
                          value={portionSize}
                          onChange={(e) => setPortionSize(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Unit</label>
                        <Select value={portionUnit} onValueChange={setPortionUnit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grams">Grams (g)</SelectItem>
                            <SelectItem value="oz">Ounces (oz)</SelectItem>
                            <SelectItem value="cup">Cup</SelectItem>
                            <SelectItem value="tbsp">Tablespoon</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="serving">Serving</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      type="button" 
                      onClick={() => {
                        const desc = portionSize ? `${description}, ${portionSize}${portionUnit}` : description;
                        analyzeDescription(desc);
                      }} 
                      className="w-full" 
                      disabled={!description.trim()}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Nutrition
                    </Button>
                  </TabsContent>

                  <TabsContent value="voice" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Speak Your Meal</label>
                      <Input
                        placeholder="e.g., Chicken salad with brown rice, 200g"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        data-testid="input-meal-description-voice"
                        className={isRecording ? 'border-red-500 animate-pulse' : ''}
                        readOnly={isRecording}
                      />
                      {isRecording && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <Activity className="h-3 w-3 animate-pulse" />
                          Listening... Speak now
                        </p>
                      )}
                      {transcript && !isRecording && (
                        <p className="text-xs text-green-500 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Captured: {transcript}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant={isRecording ? 'destructive' : 'default'} 
                        onClick={handleVoiceRecording} 
                        className="flex-1" 
                        data-testid="button-voice-record"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        {isRecording ? 'Stop Recording' : 'Start Voice Input'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => analyzeDescription(description)} 
                        className="flex-1" 
                        data-testid="button-analyze" 
                        disabled={!description.trim()}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Analysis Results */}
                {analysis && (
                  <div className="mb-6 space-y-4">
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          AI Nutritional Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Ingredients */}
                        {analysis.ingredients.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Detected Ingredients:</p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.ingredients.map((ing: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{ing}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Macros */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-2">Macronutrients:</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-background/50 rounded p-2">
                              <span className="text-muted-foreground">Carbs:</span>
                              <span className="ml-1 font-bold text-orange-500">{analysis.macros.carbs}g</span>
                            </div>
                            <div className="bg-background/50 rounded p-2">
                              <span className="text-muted-foreground">Protein:</span>
                              <span className="ml-1 font-bold text-blue-500">{analysis.macros.protein}g</span>
                            </div>
                            <div className="bg-background/50 rounded p-2">
                              <span className="text-muted-foreground">Fat:</span>
                              <span className="ml-1 font-bold text-yellow-500">{analysis.macros.fat}g</span>
                            </div>
                            <div className="bg-background/50 rounded p-2">
                              <span className="text-muted-foreground">Sugar:</span>
                              <span className="ml-1 font-bold text-red-500">{analysis.macros.sugar}g</span>
                            </div>
                          </div>
                          <div className="bg-primary/20 rounded p-2 mt-2 text-center">
                            <span className="text-muted-foreground text-sm">Total Calories:</span>
                            <span className="ml-2 font-bold text-lg text-primary">{analysis.macros.calories}</span>
                          </div>
                        </div>

                        {/* Blood Sugar Impact */}
                        <Alert className={`border-2 ${
                          analysis.insights.impact === 'high' ? 'border-red-500 bg-red-500/10' :
                          analysis.insights.impact === 'moderate' ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-green-500 bg-green-500/10'
                        }`}>
                          <TrendingUp className="h-4 w-4" />
                          <AlertDescription className="space-y-2">
                            <div>
                              <p className="font-semibold text-sm">Blood Sugar Impact: <span className="uppercase">{analysis.insights.impact}</span></p>
                              <p className="text-xs text-muted-foreground">Estimated Glycemic Load: {analysis.insights.glycemicLoad}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs"><strong>Recommendation:</strong> {analysis.insights.recommendation}</p>
                              <p className="text-xs"><strong>Advisory:</strong> {analysis.insights.advisory}</p>
                            </div>
                          </AlertDescription>
                        </Alert>

                        {/* Personalized Insights */}
                        {profileData?.profile && (
                          <div className="bg-background/50 rounded p-3 space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground">Personalized Insights:</p>
                            <p className="text-xs">
                              • Diabetes Type: <strong>{profileData.profile.diabetesType || 'Not specified'}</strong>
                            </p>
                            {profileData.profile.typicalInsulin > 0 && (
                              <p className="text-xs">
                                • Typical Insulin: <strong>{profileData.profile.typicalInsulin} units</strong>
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground italic">
                              This meal contains {analysis.macros.carbs}g of carbs. Consider your insulin-to-carb ratio when dosing.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

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
