import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet, TrendingUp } from 'lucide-react';

export default function InsulinPage() {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '320px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Droplet className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Insulin Tracking</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Insulin Management</h1>
              <p className="text-muted-foreground">Monitor and track your insulin doses</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-primary" />
                    Today's Insulin
                  </CardTitle>
                  <CardDescription>Total units administered</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">12.5 units</p>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Weekly Average
                  </CardTitle>
                  <CardDescription>Average daily insulin</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">14.2 units</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
