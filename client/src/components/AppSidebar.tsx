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

  const timeInRange = 85;

  return (
    <>
      <aside 
        className="fixed left-0 top-0 h-screen flex flex-col backdrop-blur-sm"
        style={{ 
          width: '320px',
          padding: '24px',
          zIndex: 50,
          background: 'radial-gradient(ellipse 130% 100% at 0% 50%, rgba(7,12,15,0.68) 0%, rgba(7,12,15,0.78) 60%, rgba(7,12,15,0.88) 100%)',
          boxShadow: 'inset 1px 0 0 rgba(33,200,155,0.08), 0 4px 24px rgba(0,0,0,0.3)',
        }}
        role="navigation"
        aria-label="Main sidebar"
      >
        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50">
          
          {/* Header - Logo + App Name */}
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{
                background: 'linear-gradient(135deg, #21C89B 0%, #16A085 100%)',
                boxShadow: '0 4px 16px rgba(33, 200, 155, 0.35), 0 0 24px rgba(33, 200, 155, 0.15)',
              }}
            >
              GN
            </div>
            <h1 className="text-xl font-bold text-[#EAF6F3] tracking-tight">GlucoNova</h1>
          </div>

          {/* User Profile Card - Enhanced */}
          <div 
            className="rounded-xl mb-4"
            style={{
              padding: '14px',
              background: 'rgba(11,18,20,0.55)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(33,200,155,0.05)',
              borderRadius: '14px',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar 
                className="h-12 w-12 ring-2 ring-primary/20"
                style={{
                  boxShadow: '0 8px 24px rgba(33,200,155,0.12)',
                }}
              >
                <AvatarFallback 
                  className="text-white font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #21C89B 0%, #16A085 100%)',
                    fontSize: '16px',
                  }}
                >
                  {user?.name ? getInitials(user.name) : 'HS'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#EAF6F3] truncate" style={{ fontSize: '17px' }}>
                  {user?.name || 'Hanisha SM'}
                </p>
                <p className="text-[#9AA8A6]" style={{ fontSize: '13px' }}>Diabetes</p>
              </div>
            </div>
            <div style={{ fontSize: '13px' }}>
              <span className="text-[#9AA8A6]">In Range: </span>
              <span className="text-primary font-semibold">{timeInRange}%</span>
            </div>
          </div>

          {/* Navigation Menu - Enhanced Spacing & Sizing */}
          <nav className="space-y-[1px]">
            {menuItems.map((item) => {
              const isActive = location === item.url;
              const Icon = item.icon;
              
              return (
                <Link 
                  key={item.title}
                  href={item.url}
                >
                  <button
                    className="w-full flex items-center gap-4 rounded-lg text-[#9AA8A6] hover:text-[#EAF6F3] transition-all duration-150 group relative"
                    style={{
                      padding: '10px 12px',
                      backgroundColor: isActive ? 'rgba(33,200,155,0.08)' : 'transparent',
                      color: isActive ? '#EAF6F3' : undefined,
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
                    {/* Left accent bar - Rounded pill style */}
                    {isActive && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary"
                        style={{
                          width: '6px',
                          height: '32px',
                          borderRadius: '0 4px 4px 0',
                        }}
                      />
                    )}

                    {/* Hover accent bar animation */}
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-150"
                      style={{
                        width: isActive ? '0' : '6px',
                        height: '32px',
                        borderRadius: '0 4px 4px 0',
                        transform: isActive ? 'translateX(-6px) translateY(-50%)' : 'translateY(-50%)',
                      }}
                    />
                    
                    <Icon className="flex-shrink-0" style={{ width: '22px', height: '22px', strokeWidth: 2 }} />
                    <span className="font-medium flex-1 text-left" style={{ fontSize: '16px' }}>{item.title}</span>
                    
                    {/* Active indicator - white dot on right */}
                    {isActive && (
                      <div 
                        className="ml-auto rounded-full bg-white"
                        style={{ width: '10px', height: '10px' }}
                      />
                    )}
                  </button>
                </Link>
              );
            })}

            {/* Settings Item - Same styling */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-4 rounded-lg text-[#9AA8A6] hover:text-[#EAF6F3] transition-all duration-150 group relative"
              style={{
                padding: '10px 12px',
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
              {/* Hover accent bar */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-150"
                style={{
                  width: '6px',
                  height: '32px',
                  borderRadius: '0 4px 4px 0',
                }}
              />
              
              <Settings className="flex-shrink-0" style={{ width: '22px', height: '22px', strokeWidth: 2 }} />
              <span className="font-medium flex-1 text-left" style={{ fontSize: '16px' }}>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Action Buttons - Larger & Centered */}
        <div className="pt-4 mt-auto">
          <div className="flex gap-3 mb-3 justify-center">
            {/* Voice/Mic Button - Larger */}
            <button
              className="rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                width: '100px',
                height: '64px',
                background: 'rgba(10,18,21,0.6)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(33,200,155,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.08), 0 6px 24px rgba(33,200,155,0.3)';
                e.currentTarget.style.background = 'rgba(10,18,21,0.75)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(33,200,155,0.15)';
                e.currentTarget.style.background = 'rgba(10,18,21,0.6)';
              }}
              data-testid="button-voice"
              aria-label="Voice Assistant"
            >
              <Mic className="text-primary" style={{ width: '26px', height: '26px', strokeWidth: 2 }} />
            </button>

            {/* Upload/Share Button - Larger */}
            <button
              className="rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                width: '100px',
                height: '64px',
                background: 'rgba(10,18,21,0.6)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(33,200,155,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.08), 0 6px 24px rgba(33,200,155,0.3)';
                e.currentTarget.style.background = 'rgba(10,18,21,0.75)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(255,255,255,0.05), 0 4px 16px rgba(33,200,155,0.15)';
                e.currentTarget.style.background = 'rgba(10,18,21,0.6)';
              }}
              data-testid="button-upload"
              aria-label="Upload Report"
            >
              <Upload className="text-primary" style={{ width: '26px', height: '26px', strokeWidth: 2 }} />
            </button>
          </div>

          {/* Logout Link - Small Red Text Bottom-Left */}
          <button
            onClick={logout}
            className="flex items-center gap-2 hover:text-red-300 transition-colors"
            style={{
              fontSize: '13px',
              color: '#FF6B6B',
            }}
            data-testid="button-logout"
          >
            <LogOut style={{ width: '14px', height: '14px' }} />
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
