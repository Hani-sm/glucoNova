import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressItemProps {
  label: string;
  value: number;
  detail: string;
}

function ProgressItem({ label, value, detail }: ProgressItemProps) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{detail}</span>
      </div>
      <Progress value={value} className="h-2" data-testid={`progress-${label.toLowerCase().replace(' ', '-')}`} />
    </div>
  );
}

export default function ProgressCard() {
  return (
    <Card className="p-6" data-testid="card-progress">
      <h3 className="font-semibold mb-4">Goals & Streaks</h3>
      <ProgressItem label="Days in Range" value={100} detail="3 Days – 100%" />
      <ProgressItem label="Weekly Logging" value={85} detail="85%" />
      <ProgressItem label="Activity Goal" value={70} detail="70%" />
    </Card>
  );
}
