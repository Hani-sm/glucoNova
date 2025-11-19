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
    <Card 
      className="p-5 card-interactive glass-card flex flex-col" 
      style={{ height: '220px' }} 
      data-testid="card-voice-assistant"
    >
      <h3 className="font-bold text-base text-foreground mb-4">{title}</h3>
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Mic className="h-7 w-7 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center px-2">{subtitle}</p>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
          onClick={handleVoiceInput}
          data-testid="button-voice-record"
          size="sm"
        >
          {buttonText}
        </Button>
      </div>
      {recognizedText && (
        <div className="bg-secondary/50 rounded-lg p-3 mt-3">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Recognized:</p>
          <p className="text-sm text-foreground" data-testid="text-recognized">{recognizedText}</p>
        </div>
      )}
    </Card>
  );
}
