import { 
  LayoutDashboard, 
  User, 
  Stethoscope, 
  Droplet, 
  Syringe, 
  Utensils, 
  Pill, 
  Mic, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  { title: 'Health Data', icon: Droplet, url: '/health-data' },
  { title: 'Meals', icon: Utensils, url: '/meals' },
  { title: 'Reports', icon: FileText, url: '/reports' },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.name ? getInitials(user.name) : 'GN'}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-bold text-foreground">GlucoNova</h1>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">{user?.name || 'User'}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs capitalize">
              {user?.role || 'patient'}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}
                    className={location === item.url ? 'bg-sidebar-accent' : ''}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild data-testid="button-logout">
              <button onClick={handleLogout} className="text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
