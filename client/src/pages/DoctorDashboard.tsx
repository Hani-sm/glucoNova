import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Search, Users } from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.getPatients();
        setPatients(response.patients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarStyle = {
    '--sidebar-width': '20rem',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome, Dr. {user?.name}</h1>
              <p className="text-muted-foreground">Manage your patients and review their health data</p>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Patient Management</h2>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-patients"
                />
              </div>

              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading patients...</p>
              ) : filteredPatients.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchTerm ? 'No patients found matching your search' : 'No patients assigned yet'}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="p-4 hover-elevate cursor-pointer" data-testid={`card-patient-${patient.id}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">{patient.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(patient.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
