import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function QuickActionCard({ icon: Icon, title, description }: QuickActionCardProps) {
  return (
    <Card 
      className="p-4 hover-elevate cursor-pointer" 
      onClick={() => console.log(`${title} clicked`)}
      data-testid={`card-action-${title.toLowerCase().replace(' ', '-')}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
