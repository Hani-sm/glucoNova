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
      className="p-5 card-interactive glass-card flex flex-col justify-between" 
      style={{ height: '110px' }} 
      data-testid={`card-metric-${title.toLowerCase().replace(' ', '-')}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <h3 className="text-3xl font-bold text-foreground leading-none">{value}</h3>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <Badge 
        variant={statusVariant} 
        className="bg-primary/20 text-primary text-xs px-2 py-0.5 w-fit"
        data-testid={`badge-status-${title.toLowerCase().replace(' ', '-')}`}
      >
        {status}
      </Badge>
    </Card>
  );
}
