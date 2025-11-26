import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const timeRanges = ['6h', '24h', '7d', '30d'] as const;
type TimeRange = typeof timeRanges[number];

function formatChartData(data: any[], range: TimeRange) {
  if (!data || data.length === 0) return [];

  const now = new Date();
  const filtered = data.filter((item) => {
    const itemDate = new Date(item.timestamp);
    const diffMs = now.getTime() - itemDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    switch (range) {
      case '6h':
        return diffHours <= 6;
      case '24h':
        return diffHours <= 24;
      case '7d':
        return diffDays <= 7;
      case '30d':
        return diffDays <= 30;
      default:
        return true;
    }
  });

  const sorted = [...filtered].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return sorted.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    glucose: item.glucose,
    timestamp: new Date(item.timestamp),
  }));
}

export default function GlucoseTrendChart() {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const { data: healthData } = useQuery({
    queryKey: ['/api/health-data'],
  });

  const chartData = useMemo(() => {
    return formatChartData((healthData as any)?.data || [], selectedRange);
  }, [healthData, selectedRange]);

  const currentGlucose = chartData.length > 0 ? chartData[chartData.length - 1].glucose : 0;
  
  const getStatusText = (glucose: number) => {
    if (glucose < 70) return t('glucose.status.low');
    if (glucose > 180) return t('glucose.status.high');
    return t('glucose.status.inRange');
  };

  return (
    <Card 
      className="p-5 card-interactive glass-card flex flex-col" 
      style={{ height: '360px' }} 
      data-testid="card-glucose-trends"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">{t('glucose.trends.title')}</h2>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              size="sm"
              variant={selectedRange === range ? 'default' : 'ghost'}
              onClick={() => {
                setSelectedRange(range);
                console.log(`Time range changed to ${range}`);
              }}
              className={selectedRange === range ? 'bg-primary text-primary-foreground' : ''}
              data-testid={`button-timerange-${range}`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.length > 0 ? chartData : []}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              domain={[60, 150]}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <ReferenceLine y={70} stroke="#FF6B6B" strokeDasharray="5 5" opacity={0.5} />
            <ReferenceLine y={180} stroke="#FFB84D" strokeDasharray="5 5" opacity={0.5} />
            <Area 
              type="monotone" 
              dataKey="glucose" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fill="url(#glucoseGradient)"
              dot={{ fill: '#22d3ee', r: 5, strokeWidth: 2, stroke: '#22d3ee' }}
              activeDot={{ r: 7, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">{t('glucose.trends.currentStatus')}</span>
          <span className="font-bold text-xl text-foreground">{currentGlucose} mg/dL</span>
        </div>
        <Badge className="bg-primary/20 text-primary px-3 py-1" data-testid="badge-status">
          {getStatusText(currentGlucose)}
        </Badge>
      </div>
    </Card>
  );
}
