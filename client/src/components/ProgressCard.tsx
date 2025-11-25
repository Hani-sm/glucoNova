import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from 'react-i18next';

interface ProgressItemProps {
  label: string;
  value: number;
  detail: string;
}

function ProgressItem({ label, value, detail }: ProgressItemProps) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground font-medium">{detail}</span>
      </div>
      <Progress value={value} className="h-2.5" data-testid={`progress-${label.toLowerCase().replace(' ', '-')}`} />
    </div>
  );
}

export default function ProgressCard() {
  const { t } = useTranslation();
  
  return (
    <Card 
      className="p-5 card-interactive glass-card" 
      data-testid="card-progress"
    >
      <h3 className="font-bold text-base text-foreground mb-5">{t('dashboard.progress.goalsAndStreaks')}</h3>
      <ProgressItem label={t('dashboard.progress.daysInRange')} value={100} detail={t('dashboard.progress.daysInRangeDetail', { days: 3, percent: 100 })} />
      <ProgressItem label={t('dashboard.progress.weeklyLogging')} value={85} detail={t('dashboard.progress.weeklyLoggingDetail', { percent: 85 })} />
      <ProgressItem label={t('dashboard.progress.activityGoal')} value={70} detail={t('dashboard.progress.activityGoalDetail', { percent: 70 })} />
    </Card>
  );
}
