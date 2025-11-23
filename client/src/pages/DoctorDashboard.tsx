import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, apiRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, BarChart3, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  healthMetrics?: {
    avgGlucose?: number;
    lastGlucose?: number;
    timeInRange?: number;
    recentReadings?: number;
  };
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [patientHealthData, setPatientHealthData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingPatientData, setLoadingPatientData] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.getPatients();
      const enrichedPatients = await Promise.all(
        response.patients.map(async (patient: any) => {
          try {
            const healthData = await apiRequest(`/api/health-data?userId=${patient.id}`);
            const data = (healthData as any).data || [];
            
            const avgGlucose = data.length > 0
              ? Math.round(data.reduce((sum: number, item: any) => sum + item.glucose, 0) / data.length)
              : 0;
            
            const timeInRange = data.length > 0
              ? Math.round((data.filter((item: any) => item.glucose >= 70 && item.glucose <= 180).length / data.length) * 100)
              : 0;

            return {
              ...patient,
              healthMetrics: {
                avgGlucose,
                lastGlucose: data.length > 0 ? data[0].glucose : 0,
                timeInRange,
                recentReadings: data.length,
              },
            };
          } catch (error) {
            return patient;
          }
        })
      );
      setPatients(enrichedPatients);
    } catch (error: any) {
      toast({
        title: 'Failed to load patients',
        description: error.message || 'Please try refreshing the page',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      setLoadingPatientData(true);
      const response = await apiRequest(`/api/health-data?userId=${patientId}`);
      setPatientHealthData((response as any).data || []);
    } catch (error) {
      console.error('Failed to fetch patient data:', error);
    } finally {
      setLoadingPatientData(false);
    }
  };

  const handlePatientSelect = async (patient: PatientData) => {
    setSelectedPatient(patient);
    await fetchPatientData(patient.id);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = patientHealthData
    .slice(0, 20)
    .reverse()
    .map((item: any) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      glucose: item.glucose,
    }));

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-neutral-900 via-zinc-900 to-neutral-950 relative overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative" style={{ zIndex: 10, marginLeft: '280px' }}>
        <header className="flex items-center justify-between border-b border-border" style={{ height: '72px', padding: '0 24px' }}>
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Patient Management</h2>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto">
          <div className="w-full" style={{ padding: '24px 32px' }}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1">Welcome, Dr. {user?.name}</h1>
              <p className="text-muted-foreground">Manage your patients and review their health data</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient List */}
              <div className="lg:col-span-1">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your Patients ({patients.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-secondary/50"
                        data-testid="input-search-patients"
                      />
                    </div>

                    {loading ? (
                      <p className="text-muted-foreground text-center py-8 text-sm">Loading patients...</p>
                    ) : filteredPatients.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8 text-sm">
                        {searchTerm ? 'No patients found' : 'No patients assigned'}
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredPatients.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              selectedPatient?.id === patient.id
                                ? 'bg-primary/20 border border-primary/50'
                                : 'bg-secondary/50 hover:bg-secondary/70'
                            }`}
                            data-testid={`card-patient-${patient.id}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-sm">{patient.name}</h3>
                                <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                              </div>
                              {patient.healthMetrics && patient.healthMetrics.lastGlucose > 0 && (
                                <div className="text-right">
                                  <p className="text-xs font-semibold">{patient.healthMetrics.lastGlucose}</p>
                                  <p className="text-xs text-muted-foreground">mg/dL</p>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Patient Details */}
              <div className="lg:col-span-2 space-y-6">
                {selectedPatient ? (
                  <>
                    {/* Patient Info */}
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Patient Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-semibold text-foreground">{selectedPatient.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-semibold text-foreground">{selectedPatient.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Registered</p>
                            <p className="font-semibold text-foreground">
                              {new Date(selectedPatient.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Recent Readings</p>
                            <p className="font-semibold text-foreground">
                              {selectedPatient.healthMetrics?.recentReadings || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Health Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="glass-card">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Avg Glucose</p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedPatient.healthMetrics?.avgGlucose || '--'}
                              </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-primary/50" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="glass-card">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Time in Range</p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedPatient.healthMetrics?.timeInRange || '--'}%
                              </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-primary/50" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="glass-card">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Current</p>
                              <p className="text-2xl font-bold text-foreground">
                                {selectedPatient.healthMetrics?.lastGlucose || '--'}
                              </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-primary/50" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Glucose Chart */}
                    {loadingPatientData ? (
                      <Card className="glass-card">
                        <CardContent className="pt-6">
                          <p className="text-muted-foreground text-center">Loading health data...</p>
                        </CardContent>
                      </Card>
                    ) : chartData.length > 0 ? (
                      <Card className="glass-card">
                        <CardHeader>
                          <CardTitle>Glucose Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 200]} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--card))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="glucose"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="glass-card">
                        <CardContent className="pt-6">
                          <p className="text-muted-foreground text-center">No health data available</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="glass-card">
                    <CardContent className="pt-12 pb-12">
                      <p className="text-muted-foreground text-center text-lg">Select a patient to view their health data</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
