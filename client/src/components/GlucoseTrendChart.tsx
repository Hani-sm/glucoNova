import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const timeRanges = ['6h', '24h', '7d', '30d'] as const;
type TimeRange = typeof timeRanges[number];

const mockData: Record<TimeRange, Array<{ time: string; glucose: number }>> = {
  '6h': [
    { time: '12 AM', glucose: 95 },
    { time: '2 AM', glucose: 88 },
    { time: '4 AM', glucose: 92 },
    { time: '6 AM', glucose: 105 },
    { time: '8 AM', glucose: 118 },
    { time: '10 AM', glucose: 112 },
  ],
  '24h': [
    { time: '12 AM', glucose: 95 },
    { time: '6 AM', glucose: 105 },
    { time: '12 PM', glucose: 125 },
    { time: '6 PM', glucose: 110 },
    { time: '12 AM', glucose: 98 },
  ],
  '7d': [
    { time: 'Mon', glucose: 108 },
    { time: 'Tue', glucose: 112 },
    { time: 'Wed', glucose: 105 },
    { time: 'Thu', glucose: 118 },
    { time: 'Fri', glucose: 102 },
    { time: 'Sat', glucose: 115 },
    { time: 'Sun', glucose: 110 },
  ],
  '30d': [
    { time: 'Week 1', glucose: 110 },
    { time: 'Week 2', glucose: 108 },
    { time: 'Week 3', glucose: 112 },
    { time: 'Week 4', glucose: 106 },
  ],
};

export default function GlucoseTrendChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');

  return (
    <Card 
      className="p-5 card-interactive glass-card flex flex-col" 
      style={{ height: '360px' }} 
      data-testid="card-glucose-trends"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">Glucose Trends</h2>
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
          <AreaChart data={mockData[selectedRange]}>
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
            <Area 
              type="monotone" 
              dataKey="glucose" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              fill="url(#glucoseGradient)"
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Current Status</span>
          <span className="font-bold text-xl text-foreground">98 mg/dL</span>
        </div>
        <Badge className="bg-primary/20 text-primary px-3 py-1" data-testid="badge-status">
          Within Target
        </Badge>
      </div>
    </Card>
  );
}
