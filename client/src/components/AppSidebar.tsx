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

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  { title: 'My Details', icon: User, url: '/details' },
  { title: 'My Doctors', icon: Stethoscope, url: '/doctors' },
  { title: 'Glucose', icon: Droplet, url: '/glucose' },
  { title: 'Insulin', icon: Syringe, url: '/insulin' },
  { title: 'Food AI', icon: Utensils, url: '/food' },
  { title: 'Medications', icon: Pill, url: '/medications' },
  { title: 'Voice AI', icon: Mic, url: '/voice' },
  { title: 'Records', icon: FileText, url: '/records' },
  { title: 'Reports', icon: BarChart3, url: '/reports' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              HS
            </AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-bold text-foreground">GlucoNova</h1>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-3">
          <p className="font-semibold text-sm mb-1">Hanisha SM</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
              Diabetes in Range: 85%
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
                  <SidebarMenuButton asChild data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
              <button onClick={() => console.log('Logout clicked')} className="text-destructive">
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
