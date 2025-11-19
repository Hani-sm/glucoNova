import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: string;
  icon: LucideIcon;
  statusVariant?: 'default' | 'secondary' | 'destructive';
}

export default function MetricCard({ 
  title, 
  value, 
  unit, 
  status, 
  icon: Icon,
  statusVariant = 'default'
}: MetricCardProps) {
  return (
    <Card 
      className="p-6 card-interactive glass-card flex flex-col" 
      style={{ height: '110px' }} 
      data-testid={`card-metric-${title.toLowerCase().replace(' ', '-')}`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-baseline gap-1 mb-2">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <Badge 
        variant={statusVariant} 
        className="bg-primary/20 text-primary text-xs w-fit"
        data-testid={`badge-status-${title.toLowerCase().replace(' ', '-')}`}
      >
        {status}
      </Badge>
    </Card>
  );
}
