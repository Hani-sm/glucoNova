import VoiceAssistantCard from '../VoiceAssistantCard';

export default function VoiceAssistantCardExample() {
  return (
    <div className="p-6 bg-background grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
      <VoiceAssistantCard
        title="Voice Food Logging"
        subtitle="Tap mic to log your meal"
        buttonText="Log Meal"
      />
      <VoiceAssistantCard
        title="Voice Health Assistant"
        subtitle="Tap microphone to record health data"
        buttonText="Record"
        buttonVariant="default"
      />
    </div>
  );
}
