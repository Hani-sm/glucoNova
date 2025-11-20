import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, Check, Activity, Droplet, Pill, Mic, Heart, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
}

interface HealthData {
  name: string;
  dob: string;
  weight: string;
  height: string;
  lastA1c: string;
  medications: string;
  typicalInsulin: string;
  targetRange: string;
}

export default function OnboardingModal({ isOpen, onClose, onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showParser, setShowParser] = useState(false);
  const [healthData, setHealthData] = useState<HealthData>({
    name: '',
    dob: '',
    weight: '',
    height: '',
    lastA1c: '',
    medications: '',
    typicalInsulin: '',
    targetRange: '70-180',
  });
  const { toast } = useToast();

  const progress = (step / 5) * 100;

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 20MB',
          variant: 'destructive',
        });
        return;
      }
      setUploadedFile(file);
      setShowParser(true);
      
      // Simulate parsing PDF data
      setTimeout(() => {
        setHealthData({
          name: 'John Doe',
          dob: '1980-05-15',
          weight: '75',
          height: '175',
          lastA1c: '6.5',
          medications: 'Metformin, Insulin',
          typicalInsulin: '20',
          targetRange: '70-180',
        });
      }, 500);
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF, JPEG, or PNG file',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUseSample = () => {
    setShowParser(true);
    setHealthData({
      name: 'Jane Smith',
      dob: '1985-03-20',
      weight: '68',
      height: '165',
      lastA1c: '7.2',
      medications: 'Insulin Glargine',
      typicalInsulin: '18',
      targetRange: '70-180',
    });
  };

  const handleManualEntry = () => {
    setShowParser(false);
    setStep(4);
  };

  const validateData = () => {
    if (!healthData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.dob) {
      toast({
        title: 'Date of birth required',
        description: 'Please enter your date of birth',
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.weight || parseFloat(healthData.weight) <= 0) {
      toast({
        title: 'Valid weight required',
        description: 'Please enter a valid weight in kg',
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.height || parseFloat(healthData.height) <= 0) {
      toast({
        title: 'Valid height required',
        description: 'Please enter a valid height in cm',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    // Validate before moving from step 3 (parser) or step 4 (manual) to step 5
    if ((step === 3 && showParser) || step === 4) {
      if (!validateData()) {
        return;
      }
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        // Save initial health data to the database
        const response = await fetch('/api/health-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            glucose: 100, // Default starting value
            insulin: parseFloat(healthData.typicalInsulin) || 0,
            carbs: 0,
            activityLevel: 'moderate',
            notes: `Initial profile: Weight ${healthData.weight}kg, Height ${healthData.height}cm, Last A1c ${healthData.lastA1c}, Medications: ${healthData.medications}`,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save initial health data');
        }

        localStorage.setItem('onboardingCompleted', 'true');
        localStorage.setItem('healthData', JSON.stringify(healthData));
        
        toast({
          title: 'Profile created successfully',
          description: 'Your health data has been saved',
        });
        
        onComplete();
      } catch (error) {
        toast({
          title: 'Error saving profile',
          description: 'Please try again or contact support',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    onSkip();
  };

  const handleInputChange = (field: keyof HealthData, value: string) => {
    setHealthData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent 
        className="glass-card"
        style={{ 
          width: '640px', 
          height: '460px', 
          maxWidth: '90vw', 
          padding: '28px'
        }}
        data-testid="dialog-onboarding"
      >
        <VisuallyHidden>
          <DialogTitle>Onboarding - Step {step} of 4</DialogTitle>
          <DialogDescription>Complete your profile setup to get personalized health insights</DialogDescription>
        </VisuallyHidden>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Step {step} of 5</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground"
              data-testid="button-skip"
            >
              Skip for now
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Welcome to GlucoNova</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Your AI-powered diabetes management platform. Let's take a quick tour of what you can do!
            </p>
            <Button 
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-next-step"
            >
              Start Tour
            </Button>
          </div>
        )}

        {/* Step 2: Features Walkthrough */}
        {step === 2 && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">Available Features</h2>
            <p className="text-sm text-muted-foreground mb-4">Everything you need to manage your diabetes effectively</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Glucose Monitoring</h3>
                    <p className="text-xs text-muted-foreground">Track your blood glucose levels with visual trends and insights</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">AI Insulin Prediction</h3>
                    <p className="text-xs text-muted-foreground">Get personalized insulin recommendations powered by AI</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Meal Tracking</h3>
                    <p className="text-xs text-muted-foreground">Log meals manually or use voice input for easy tracking</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Medication Management</h3>
                    <p className="text-xs text-muted-foreground">Keep track of your medications and schedules</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Doctor Collaboration</h3>
                    <p className="text-xs text-muted-foreground">Share your data with your healthcare team securely</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">Voice Assistant</h3>
                    <p className="text-xs text-muted-foreground">Log meals hands-free using voice commands</p>
                  </div>
                </div>
              </Card>
            </div>

            <Button
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              data-testid="button-next-features"
            >
              Continue to Setup
            </Button>
          </div>
        )}

        {/* Step 3: Upload Health Records */}
        {step === 3 && !showParser && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">Upload Health Records</h2>
            <p className="text-sm text-muted-foreground mb-4">Upload a PDF of your health summary to auto-extract your information</p>
            
            <div
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
                isDragging ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              data-testid="dropzone-upload"
            >
              {uploadedFile ? (
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                    data-testid="button-remove-file"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-foreground mb-2">Drag and drop your PDF here</p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild data-testid="button-browse">
                      <span>Browse Files</span>
                    </Button>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleUseSample}
                className="flex-1"
                data-testid="button-use-sample"
              >
                Use Demo Data
              </Button>
              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="flex-1"
                data-testid="button-manual-entry"
              >
                Enter Manually
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Parser Results */}
        {step === 3 && showParser && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">Confirm Your Information</h2>
            <p className="text-sm text-muted-foreground mb-4">Review and edit the extracted data</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Name</Label>
                  <Input
                    value={healthData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Date of Birth</Label>
                  <Input
                    type="date"
                    value={healthData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-dob"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-weight"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Height (cm)</Label>
                  <Input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-height"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Last A1c (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={healthData.lastA1c}
                    onChange={(e) => handleInputChange('lastA1c', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-a1c"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Typical Insulin (U)</Label>
                  <Input
                    type="number"
                    value={healthData.typicalInsulin}
                    onChange={(e) => handleInputChange('typicalInsulin', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-insulin"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Medications</Label>
                <Input
                  value={healthData.medications}
                  onChange={(e) => handleInputChange('medications', e.target.value)}
                  className="h-9 bg-secondary border-input text-foreground text-sm"
                  data-testid="input-medications"
                />
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              data-testid="button-confirm"
            >
              Confirm & Continue
            </Button>
          </div>
        )}

        {/* Step 4: Manual Entry */}
        {step === 4 && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">Enter Your Details</h2>
            <p className="text-sm text-muted-foreground mb-4">Fill in your health information manually</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Name</Label>
                  <Input
                    value={healthData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-name"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Date of Birth</Label>
                  <Input
                    type="date"
                    value={healthData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-dob"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Weight (kg)</Label>
                  <Input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-weight"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Height (cm)</Label>
                  <Input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-height"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Typical Insulin (U)</Label>
                  <Input
                    type="number"
                    value={healthData.typicalInsulin}
                    onChange={(e) => handleInputChange('typicalInsulin', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    placeholder="Daily units"
                    data-testid="input-manual-insulin"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">Target Range</Label>
                  <Input
                    value={healthData.targetRange}
                    onChange={(e) => handleInputChange('targetRange', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    placeholder="e.g., 70-180"
                    data-testid="input-manual-range"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              data-testid="button-next-manual"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 5: Finish */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">All Set!</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Your account is ready. You can now access personalized health insights and AI-powered insulin predictions.
            </p>
            <Button 
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-go-dashboard"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
