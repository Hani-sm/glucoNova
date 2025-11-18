import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Shield, Check, X } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.getAllUsers();
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (userId: string, isApproved: boolean) => {
    try {
      await api.updateUserApproval(userId, isApproved);
      toast({
        title: isApproved ? 'User approved' : 'User rejected',
        description: `User has been ${isApproved ? 'approved' : 'rejected'} successfully`,
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Action failed',
        description: error.message || 'Failed to update user approval',
        variant: 'destructive',
      });
    }
  };

  const sidebarStyle = {
    '--sidebar-width': '20rem',
    '--sidebar-width-icon': '4rem',
  };

  const pendingUsers = users.filter(u => !u.isApproved && u.role !== 'admin');
  const approvedUsers = users.filter(u => u.isApproved);

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
              <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage user approvals and system settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-orange-500">{pendingUsers.length}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Approved Users</p>
                <p className="text-3xl font-bold text-primary">{approvedUsers.length}</p>
              </Card>
            </div>

            {pendingUsers.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Shield className="h-6 w-6 text-orange-500" />
                  <h2 className="text-xl font-bold">Pending Approvals</h2>
                </div>

                <div className="space-y-3">
                  {pendingUsers.map((user) => (
                    <Card key={user.id} className="p-4" data-testid={`card-pending-user-${user.id}`}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant="secondary">{user.role}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Registered: {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-primary"
                            onClick={() => handleApproval(user.id, true)}
                            data-testid={`button-approve-${user.id}`}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproval(user.id, false)}
                            data-testid={`button-reject-${user.id}`}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">All Users</h2>

              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users found</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4" data-testid={`card-user-${user.id}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant="secondary">{user.role}</Badge>
                            {user.isApproved ? (
                              <Badge className="bg-primary/20 text-primary">Approved</Badge>
                            ) : (
                              <Badge variant="destructive">Pending</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
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
