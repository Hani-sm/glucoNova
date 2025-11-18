import AppSidebar from '../AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppSidebarExample() {
  const style = {
    '--sidebar-width': '20rem',
    '--sidebar-width-icon': '4rem',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold">Main Content Area</h1>
          <p className="text-muted-foreground">This is where the dashboard content would appear</p>
        </main>
      </div>
    </SidebarProvider>
  );
}
