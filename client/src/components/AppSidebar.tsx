import { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  Heart,
  Activity,
  Droplet, 
  Utensils, 
  Pill, 
  Mic, 
  Settings,
  Upload,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import SettingsDrawer from '@/components/SettingsDrawer';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
  { title: 'My Details', icon: User, url: '/health-data' },
  { title: 'My Doctors', icon: Heart, url: '/doctors' },
  { title: 'Glucose', icon: Activity, url: '/glucose' },
  { title: 'Insulin', icon: Droplet, url: '/insulin' },
  { title: 'Food AI', icon: Utensils, url: '/meals' },
  { title: 'Medications', icon: Pill, url: '/medications' },
  { title: 'Voice AI', icon: Mic, url: '/voice' },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate time in range (mock for now)
  const timeInRange = 85;

  return (
    <>
      <aside 
        className="fixed left-0 top-0 h-screen flex flex-col bg-[rgba(7,12,15,0.7)] backdrop-blur-sm shadow-[inset_1px_0_0_rgba(33,200,155,0.1),0_4px_16px_rgba(0,0,0,0.2)]"
        style={{ 
          width: '240px',
          zIndex: 50,
          background: 'radial-gradient(ellipse 120% 100% at 0% 50%, rgba(7,12,15,0.7) 0%, rgba(7,12,15,0.85) 50%, rgba(7,12,15,0.9) 100%)',
        }}
        role="navigation"
        aria-label="Main sidebar"
      >
        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50">
          
          {/* Header - Logo + App Name */}
          <div className="flex items-center gap-3 mb-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #21C89B 0%, #16A085 100%)',
                boxShadow: '0 0 20px rgba(33, 200, 155, 0.4)',
              }}
            >
              GN
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">GlucoNova</h1>
          </div>

          {/* User Profile Pill */}
          <div 
            className="rounded-lg p-4 mb-6"
            style={{
              background: 'rgba(11,18,20,0.55)',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback 
                  className="text-white font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #21C89B 0%, #16A085 100%)',
                  }}
                >
                  {user?.name ? getInitials(user.name) : 'HS'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">
                  {user?.name || 'Hanisha SM'}
                </p>
                <p className="text-xs text-[#9AA8A6]">Diabetes</p>
              </div>
            </div>
            <div className="text-xs">
              <span className="text-[#9AA8A6]">In Range: </span>
              <span className="text-primary font-semibold">{timeInRange}%</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.title}
                  href={item.url}
                >
                  <button
                    className="w-full flex items-center gap-4 py-3 px-2 rounded-md text-[#CAD6D4] hover:text-white transition-all duration-200 group relative"
                    style={{
                      backgroundColor: isActive ? 'rgba(33,200,155,0.08)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(33,200,155,0.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* Left accent bar on hover */}
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 group-hover:h-8"
                      style={{
                        height: isActive ? '32px' : '0',
                      }}
                    />
                    
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-[15px] font-medium flex-1 text-left">{item.title}</span>
                    
                    {/* Active indicator - white dot on right */}
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-white ml-auto" />
                    )}
                  </button>
                </Link>
              );
            })}

            {/* Settings Item */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-4 py-3 px-2 rounded-md text-[#CAD6D4] hover:text-white transition-all duration-200 group relative"
              style={{
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(33,200,155,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              data-testid="button-settings"
            >
              {/* Left accent bar on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r transition-all duration-200 group-hover:h-8" />
              
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className="text-[15px] font-medium flex-1 text-left">Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Action Buttons - Fixed at bottom */}
        <div className="px-6 pb-6 pt-4 border-t border-white/5">
          <div className="flex gap-3 mb-4">
            {/* Voice/Mic Button */}
            <button
              className="flex-1 h-12 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: 'rgba(33,200,155,0.1)',
                boxShadow: '0 0 12px rgba(33,200,155,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(33,200,155,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 12px rgba(33,200,155,0.2)';
              }}
              data-testid="button-voice"
              aria-label="Voice Assistant"
            >
              <Mic className="w-5 h-5 text-primary" />
            </button>

            {/* Upload/Share Button */}
            <button
              className="flex-1 h-12 rounded-lg flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: 'rgba(33,200,155,0.1)',
                boxShadow: '0 0 12px rgba(33,200,155,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(33,200,155,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 12px rgba(33,200,155,0.2)';
              }}
              data-testid="button-upload"
              aria-label="Upload Report"
            >
              <Upload className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Logout Link */}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Settings Drawer */}
      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
