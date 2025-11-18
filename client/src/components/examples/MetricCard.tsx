import MetricCard from '../MetricCard';
import { Droplet, Target, Utensils, Syringe } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-background">
      <MetricCard
        title="Glucose"
        value="112"
        unit="mg/dL"
        status="In Range"
        icon={Droplet}
      />
      <MetricCard
        title="Time in Range"
        value="85%"
        unit=""
        status="Excellent • +12%"
        icon={Target}
      />
      <MetricCard
        title="Carbs"
        value="45g"
        unit=""
        status="On Track • 25% used"
        icon={Utensils}
      />
      <MetricCard
        title="Active Insulin"
        value="2.5U"
        unit=""
        status="Active • -1.2U"
        icon={Syringe}
      />
    </div>
  );
}
