import QuickActionCard from '../QuickActionCard';
import { Heart, Pill, MessageCircle, FileText } from 'lucide-react';

export default function QuickActionCardExample() {
  return (
    <div className="p-6 bg-background">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickActionCard
          icon={Heart}
          title="Blood Sugar Tracking"
          description="Log and monitor your glucose levels"
        />
        <QuickActionCard
          icon={Pill}
          title="Medication Reminders"
          description="Set up and manage your medications"
        />
        <QuickActionCard
          icon={MessageCircle}
          title="Doctor Communication"
          description="Message your healthcare provider"
        />
        <QuickActionCard
          icon={FileText}
          title="Health Reports"
          description="View and download your reports"
        />
      </div>
    </div>
  );
}
