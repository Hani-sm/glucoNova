import { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Upload, FileText, X, Check, Activity, Droplet, Pill, Mic, Heart, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showParser, setShowParser] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [showExistingReports, setShowExistingReports] = useState(false);
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

  // Fetch existing medical reports
  const { data: reportsData, isLoading: isLoadingReports } = useQuery<{ reports: any[] }>({
    queryKey: ['/api/reports'],
    enabled: isOpen && showExistingReports,
  });

  const progress = (step / 5) * 100;

  const handleFileUpload = useCallback((file: File) => {
    if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png') {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: t('onboarding.messages.fileTooLarge'),
          description: t('onboarding.messages.fileSizeLimit'),
          variant: 'destructive',
        });
        return;
      }
      setUploadedFile(file);
      setShowParser(true);
      
      // Send file to server for actual PDF parsing
      const parseFile = async () => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const token = localStorage.getItem('token');
          const response = await fetch('/api/reports/parse', {
            method: 'POST',
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Failed to parse document');
          }
          
          const parsedData = await response.json();
          
          // Update health data with parsed values from the document
          setHealthData(prev => ({
            ...prev,
            ...(parsedData.name && { name: parsedData.name }),
            ...(parsedData.dob && { dob: parsedData.dob }),
            ...(parsedData.weight && { weight: parsedData.weight }),
            ...(parsedData.height && { height: parsedData.height }),
            ...(parsedData.lastA1c && { lastA1c: parsedData.lastA1c }),
            ...(parsedData.medications && { medications: parsedData.medications }),
            ...(parsedData.typicalInsulin && { typicalInsulin: parsedData.typicalInsulin }),
            ...(parsedData.targetRange && { targetRange: parsedData.targetRange }),
          }));
        } catch (error) {
          console.error('PDF parsing error:', error);
          toast({
            title: t('onboarding.messages.parsingFailed'),
            description: t('onboarding.messages.parsingFailedDesc'),
            variant: 'destructive',
          });
        }
      };
      
      parseFile();
    } else {
      toast({
        title: t('onboarding.messages.invalidFileType'),
        description: t('onboarding.messages.supportedFileTypes'),
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
    setShowExistingReports(false);
    setStep(4);
  };

  const handleSelectExistingReport = () => {
    setShowExistingReports(true);
  };

  const handleReportSelection = async (reportId: string) => {
    try {
      setSelectedReportId(reportId);
      
      // Fetch patient details from the selected report
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reports/${reportId}/patient`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient details');
      }

      const data = await response.json();
      
      // Also try to parse the file to get health data
      const reportFile = reportsData?.reports.find(r => r._id === reportId);
      if (reportFile && reportFile.fileUrl) {
        try {
          // Fetch the file and parse it
          const fileResponse = await fetch(reportFile.fileUrl, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            const file = new File([blob], reportFile.fileName, { type: reportFile.fileType });
            
            // Parse the file
            const parseFormData = new FormData();
            parseFormData.append('file', file);
            
            const parseResponse = await fetch('/api/reports/parse', {
              method: 'POST',
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
              },
              body: parseFormData,
            });
            
            if (parseResponse.ok) {
              const parsedData = await parseResponse.json();
              
              // Update health data with parsed values
              setHealthData(prev => ({
                ...prev,
                name: parsedData.name || data.patient.name || prev.name,
                dob: parsedData.dob || prev.dob,
                weight: parsedData.weight || prev.weight,
                height: parsedData.height || prev.height,
                lastA1c: parsedData.lastA1c || prev.lastA1c,
                medications: parsedData.medications || prev.medications,
                typicalInsulin: parsedData.typicalInsulin || prev.typicalInsulin,
                targetRange: parsedData.targetRange || prev.targetRange,
              }));
            }
          }
        } catch (parseError) {
          console.error('Error parsing report file:', parseError);
          // Fall back to just using patient data
          setHealthData(prev => ({
            ...prev,
            name: data.patient.name || prev.name,
          }));
        }
      } else {
        // Just use patient data if file parsing is not available
        setHealthData(prev => ({
          ...prev,
          name: data.patient.name || prev.name,
        }));
      }
      
      setShowParser(true);
      setShowExistingReports(false);
      
      toast({
        title: t('onboarding.messages.reportLoaded'),
        description: t('onboarding.messages.reportLoadedDesc'),
      });
    } catch (error) {
      console.error('Error loading report:', error);
      toast({
        title: t('common.error'),
        description: t('onboarding.messages.loadPatientFailed'),
        variant: 'destructive',
      });
    }
  };

  const validateData = () => {
    if (!healthData.name.trim()) {
      toast({
        title: t('onboarding.messages.nameRequired'),
        description: t('onboarding.messages.nameRequiredDesc'),
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.dob) {
      toast({
        title: t('onboarding.messages.dobRequired'),
        description: t('onboarding.messages.dobRequiredDesc'),
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.weight || parseFloat(healthData.weight) <= 0) {
      toast({
        title: t('onboarding.messages.validWeightRequired'),
        description: t('onboarding.messages.validWeightRequiredDesc'),
        variant: 'destructive',
      });
      return false;
    }
    if (!healthData.height || parseFloat(healthData.height) <= 0) {
      toast({
        title: t('onboarding.messages.validHeightRequired'),
        description: t('onboarding.messages.validHeightRequiredDesc'),
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
        const profileData = {
          dateOfBirth: healthData.dob,
          weight: parseFloat(healthData.weight),
          height: parseFloat(healthData.height),
          lastA1c: healthData.lastA1c ? parseFloat(healthData.lastA1c) : undefined,
          medications: healthData.medications || undefined,
          typicalInsulin: healthData.typicalInsulin ? parseFloat(healthData.typicalInsulin) : undefined,
          targetRange: healthData.targetRange || undefined,
        };

        // Save user profile data to the database
        try {
          const profileResponse = await apiRequest('/api/profile', {
            method: 'POST',
            body: JSON.stringify(profileData),
          });
          await profileResponse.json();
        } catch (error: any) {
          // If profile already exists (409), update it instead
          if (error.message.includes('409')) {
            const updateResponse = await apiRequest('/api/profile', {
              method: 'PUT',
              body: JSON.stringify(profileData),
            });
            await updateResponse.json();
          } else {
            throw error;
          }
        }

        // Also save initial health data reading
        try {
          const healthResponse = await apiRequest('/api/health-data', {
            method: 'POST',
            body: JSON.stringify({
              glucose: 100,
              insulin: parseFloat(healthData.typicalInsulin) || 0,
              carbs: 0,
              activityLevel: 'moderate',
              notes: 'Initial reading after onboarding',
            }),
          });
          await healthResponse.json();
        } catch (error) {
          console.warn('Failed to save initial health reading:', error);
        }

        localStorage.setItem('onboardingCompleted', 'true');
        
        // Invalidate all queries to refresh dashboard data
        await queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/health-data'] });
        
        toast({
          title: t('onboarding.messages.profileCreated'),
          description: t('onboarding.messages.healthDataSaved'),
        });
        
        onComplete();
      } catch (error) {
        toast({
          title: t('onboarding.messages.saveProfileError'),
          description: t('onboarding.messages.saveProfileErrorDesc'),
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
          <DialogTitle>{t('onboarding.stepTitle', { step, total: 5 })}</DialogTitle>
          <DialogDescription>{t('onboarding.stepDescription')}</DialogDescription>
        </VisuallyHidden>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{t('onboarding.stepProgress', { step, total: 5 })}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground"
              data-testid="button-skip"
            >
              {t('onboarding.skipForNow')}
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
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t('onboarding.welcome.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {t('onboarding.welcome.description')}
            </p>
            <Button 
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-next-step"
            >
              {t('onboarding.welcome.startTour')}
            </Button>
          </div>
        )}

        {/* Step 2: Features Walkthrough */}
        {step === 2 && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">{t('onboarding.features.title')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.features.description')}</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.glucose.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.glucose.description')}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.insulin.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.insulin.description')}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.meal.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.meal.description')}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.medication.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.medication.description')}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.doctor.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.doctor.description')}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3 bg-secondary/50 border-border">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-foreground mb-1">{t('onboarding.features.voice.title')}</h3>
                    <p className="text-xs text-muted-foreground">{t('onboarding.features.voice.description')}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Button
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
              data-testid="button-next-features"
            >
              {t('onboarding.features.continueSetup')}
            </Button>
          </div>
        )}

        {/* Step 3: Upload Health Records OR Select Existing */}
        {step === 3 && !showParser && !showExistingReports && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">{t('onboarding.upload.title')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.upload.description')}</p>
            
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
                  <p className="text-sm text-foreground mb-2">{t('onboarding.upload.dragDrop')}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t('onboarding.upload.or')}</p>
                  <label htmlFor="file-upload">
                    <Button variant="outline" size="sm" asChild data-testid="button-browse">
                      <span>{t('onboarding.upload.browseFiles')}</span>
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

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleSelectExistingReport}
                className="flex-1"
                data-testid="button-select-existing"
              >
                <FileText className="w-4 h-4 mr-2" />
                {t('onboarding.upload.selectExisting')}
              </Button>
              <Button
                variant="outline"
                onClick={handleUseSample}
                className="flex-1"
                data-testid="button-use-sample"
              >
                {t('onboarding.upload.useDemoData')}
              </Button>
              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="flex-1"
                data-testid="button-manual-entry"
              >
                {t('onboarding.upload.enterManually')}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select from Existing Reports */}
        {step === 3 && showExistingReports && (
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('onboarding.existing.title')}</h2>
                <p className="text-sm text-muted-foreground">{t('onboarding.existing.description')}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExistingReports(false)}
                data-testid="button-back-to-upload"
              >
                {t('onboarding.existing.back')}
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              {isLoadingReports ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">{t('onboarding.existing.loading')}</p>
                </div>
              ) : reportsData && reportsData.reports && reportsData.reports.length > 0 ? (
                reportsData.reports.map((report: any) => (
                  <Card
                    key={report._id}
                    className="p-4 bg-secondary/50 border-border hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => handleReportSelection(report._id)}
                    data-testid={`report-card-${report._id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-foreground truncate">{report.fileName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}
                        </p>
                        {report.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {report.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                            {report.fileType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {(report.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-foreground mb-2">{t('onboarding.existing.noReports')}</p>
                  <p className="text-xs text-muted-foreground mb-4">{t('onboarding.existing.uploadToStart')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExistingReports(false)}
                    data-testid="button-upload-new"
                  >
                    {t('onboarding.existing.uploadNew')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Parser Results */}
        {step === 3 && showParser && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">{t('onboarding.confirm.title')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.confirm.description')}</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.name')}</Label>
                  <Input
                    value={healthData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.dob')}</Label>
                  <Input
                    type="date"
                    value={healthData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-dob"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.weight')}</Label>
                  <Input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-weight"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.height')}</Label>
                  <Input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-height"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.a1c')}</Label>
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
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.insulin')}</Label>
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
                <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.medications')}</Label>
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
              {t('onboarding.confirm.button')}
            </Button>
          </div>
        )}

        {/* Step 4: Manual Entry */}
        {step === 4 && (
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-2 text-foreground">{t('onboarding.manual.title')}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t('onboarding.manual.description')}</p>
            
            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.name')}</Label>
                  <Input
                    value={healthData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-name"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.dob')}</Label>
                  <Input
                    type="date"
                    value={healthData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-dob"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.weight')}</Label>
                  <Input
                    type="number"
                    value={healthData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-weight"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.height')}</Label>
                  <Input
                    type="number"
                    value={healthData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="h-9 bg-secondary border-input text-foreground text-sm"
                    data-testid="input-manual-height"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.insulin')}</Label>
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
                  <Label className="text-xs text-muted-foreground mb-1">{t('onboarding.form.targetRange')}</Label>
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
              {t('onboarding.manual.continue')}
            </Button>
          </div>
        )}

        {/* Step 5: Finish */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t('onboarding.finish.title')}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {t('onboarding.finish.description')}
            </p>
            <Button 
              onClick={handleNextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-go-dashboard"
            >
              {t('onboarding.finish.goToDashboard')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
