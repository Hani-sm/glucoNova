import PublicLayout from '../PublicLayout';
import { Card } from '@/components/ui/card';

export default function PublicLayoutExample() {
  return (
    <PublicLayout>
      <Card className="w-full max-w-md p-8 bg-slate-900/70 backdrop-blur-lg border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-2">GlucoNova</h1>
        <p className="text-accent text-center">Example centered content</p>
      </Card>
    </PublicLayout>
  );
}
