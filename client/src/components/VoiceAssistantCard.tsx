import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  onVoiceInput?: (text: string) => void;
}

export default function VoiceAssistantCard({ 
  title, 
  subtitle, 
  buttonText,
  buttonVariant = 'default',
  onVoiceInput
}: VoiceAssistantCardProps) {
  const { toast } = useToast();
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          interim += transcript;
        }
        setRecognizedText(interim);
      };

      recognitionRef.current.onerror = (event: any) => {
        toast({
          title: 'Error',
          description: `Speech recognition error: ${event.error}`,
          variant: 'destructive',
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (recognizedText && onVoiceInput) {
          onVoiceInput(recognizedText);
        }
      };
    }
  }, [recognizedText, onVoiceInput, toast]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Error',
        description: 'Speech Recognition is not supported in your browser',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setRecognizedText('');
      recognitionRef.current.start();
    }
  };

  return (
    <Card 
      className="p-5 card-interactive glass-card flex flex-col" 
      style={{ height: '220px' }} 
      data-testid="card-voice-assistant"
    >
      <h3 className="font-bold text-base text-foreground mb-4">{title}</h3>
      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isListening 
            ? 'bg-red-500/20 animate-pulse' 
            : 'bg-primary/20'
        }`}>
          {isListening ? (
            <Square className="h-7 w-7 text-red-500" />
          ) : (
            <Mic className="h-7 w-7 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center px-2">{subtitle}</p>
        <Button 
          className={isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
          onClick={handleVoiceInput}
          data-testid="button-voice-record"
          size="sm"
        >
          {isListening ? 'Stop Recording' : buttonText}
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
