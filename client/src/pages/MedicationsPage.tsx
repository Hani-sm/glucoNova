import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, Clock } from 'lucide-react';

export default function MedicationsPage() {
  const medications = [
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timing: 'Morning & Evening',
    },
    {
      id: 2,
      name: 'Insulin Glargine',
      dosage: '10 units',
      frequency: 'Once daily',
      timing: 'Bedtime',
    },
  ];

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '320px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Pill className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Medications</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">My Medications</h1>
              <p className="text-muted-foreground">Track your prescribed medications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medications.map((med) => (
                <Card key={med.id} className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" />
                      {med.name}
                    </CardTitle>
                    <CardDescription>{med.dosage}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{med.frequency}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {med.timing}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
