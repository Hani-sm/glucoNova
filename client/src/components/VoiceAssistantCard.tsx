import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface VoiceAssistantCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

export default function VoiceAssistantCard({ 
  title, 
  subtitle, 
  buttonText,
  buttonVariant = 'default'
}: VoiceAssistantCardProps) {
  const [recognizedText, setRecognizedText] = useState('');

  const handleVoiceInput = () => {
    console.log('Voice input activated');
    setRecognizedText('Recognized: Glucose 120, BMI 24.5, Age 45');
  };

  return (
    <Card className="p-6" data-testid="card-voice-assistant">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <Mic className="h-10 w-10 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center">{subtitle}</p>
        <Button 
          className={buttonVariant === 'default' ? 'bg-[#f97316] hover:bg-[#f97316]/90 text-white' : ''}
          variant={buttonVariant}
          onClick={handleVoiceInput}
          data-testid="button-voice-record"
        >
          {buttonText}
        </Button>
      </div>
      {recognizedText && (
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Recognized:</p>
          <p className="text-sm" data-testid="text-recognized">{recognizedText}</p>
        </div>
      )}
    </Card>
  );
}
