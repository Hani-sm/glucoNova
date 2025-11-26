import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  titleKey: string;
  value: string;
  unit: string;
  statusKey: string;
  icon: LucideIcon;
  statusVariant?: 'default' | 'secondary' | 'destructive';
  iconColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  testId?: string;
  showGlow?: boolean; // Add glow effect for top metric cards
}

export default function MetricCard({ 
  titleKey, 
  value, 
  unit, 
  statusKey, 
  icon: Icon,
  statusVariant = 'default',
  iconColor = '#21C89B',
  badgeBgColor = 'rgba(33, 200, 155, 0.2)',
  badgeTextColor = '#21C89B',
  testId,
  showGlow = false
}: MetricCardProps) {
  const { t } = useTranslation();
  return (
    <Card 
      className="p-5 card-interactive flex flex-col justify-between relative overflow-hidden" 
      style={{ 
        height: '110px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: showGlow 
          ? '0 0 20px 4px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0,0,0,0.3)' 
          : '0 4px 12px rgba(0,0,0,0.3)'
      }} 
      data-testid={testId || `card-metric-${t(titleKey).toLowerCase().replace(' ', '-')}`}
    >
      {showGlow && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08), transparent 70%)',
            zIndex: 0
          }}
        />
      )}
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm text-muted-foreground font-medium">{t(titleKey)}</p>
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>
      <div className="flex items-baseline gap-1.5 relative z-10">
        <h3 className="text-3xl font-bold text-foreground leading-none">{value}</h3>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <Badge 
        variant={statusVariant} 
        className="text-xs px-2 py-0.5 w-fit relative z-10"
        style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
        data-testid={`badge-status-${t(titleKey).toLowerCase().replace(' ', '-')}`}
      >
        {t(statusKey)}
      </Badge>
    </Card>
  );
}
