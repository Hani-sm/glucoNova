import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickActionCardProps {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
  iconBgColor?: string;
  iconColor?: string;
  testId?: string;
}

export default function QuickActionCard({ 
  icon: Icon, 
  titleKey, 
  descriptionKey,
  iconBgColor = 'rgba(33, 200, 155, 0.2)',
  iconColor = '#21C89B'
}: QuickActionCardProps) {
  const { t } = useTranslation();
  return (
    <Card 
      className="p-5 card-interactive glass-card cursor-pointer" 
      onClick={() => console.log(`${t(titleKey)} clicked`)}
      data-testid={`card-action-${t(titleKey).toLowerCase().replace(' ', '-')}`}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-base text-foreground mb-1">{t(titleKey)}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{t(descriptionKey)}</p>
        </div>
      </div>
    </Card>
  );
}
