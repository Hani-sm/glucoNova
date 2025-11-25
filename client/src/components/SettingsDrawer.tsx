import { useState, useEffect } from 'react';
import { X, Moon, Sun, Bell, BellOff, Database, RotateCcw, Activity, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from 'react-i18next';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState('mg/dL');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedUnits = localStorage.getItem('units') || 'mg/dL';
    
    setTheme(savedTheme);
    setNotifications(savedNotifications);
    setUnits(savedUnits);
  }, [isOpen]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    toast({
      title: t('settings.themeUpdated'),
      description: t('settings.switchedToMode', { theme: newTheme }),
    });
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
    toast({
      title: enabled ? t('settings.notificationsEnabled') : t('settings.notificationsDisabled'),
    });
  };

  const handleUnitsChange = (newUnits: string) => {
    setUnits(newUnits);
    localStorage.setItem('units', newUnits);
    toast({
      title: t('settings.unitsUpdated'),
      description: t('settings.changedToUnits', { units: newUnits }),
    });
  };

  const handleExportData = () => {
    toast({
      title: t('settings.exportStarted'),
      description: t('settings.dataExportBegin'),
    });
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('onboardingSkipped');
    toast({
      title: t('settings.onboardingReset'),
      description: t('settings.tutorialRerun'),
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
        onClick={onClose}
        data-testid="settings-backdrop"
      />

      {/* Drawer */}
      <div 
        className="fixed right-0 top-0 h-screen w-[420px] flex flex-col bg-[rgba(7,12,15,0.85)] backdrop-blur-md shadow-2xl z-[70] animate-in slide-in-from-right duration-300"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 100% 50%, rgba(7,12,15,0.7) 0%, rgba(7,12,15,0.85) 50%, rgba(7,12,15,0.95) 100%)',
          borderLeft: '1px solid rgba(33,200,155,0.1)',
        }}
        data-testid="settings-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">{t('settings.title')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#CAD6D4] hover:text-white hover:bg-white/5 transition-colors"
            data-testid="button-close-settings"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary/50">
          
          {/* Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
              <h3 className="text-sm font-semibold text-white">{t('settings.theme')}</h3>
            </div>
            <RadioGroup value={theme} onValueChange={handleThemeChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" data-testid="radio-theme-light" />
                <Label htmlFor="light" className="text-[#CAD6D4] cursor-pointer">{t('settings.light')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" data-testid="radio-theme-dark" />
                <Label htmlFor="dark" className="text-[#CAD6D4] cursor-pointer">{t('settings.dark')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="bg-white/10" />

          {/* Notifications Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {notifications ? <Bell className="w-4 h-4 text-primary" /> : <BellOff className="w-4 h-4 text-primary" />}
              <h3 className="text-sm font-semibold text-white">{t('settings.notifications')}</h3>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-[#CAD6D4]">{t('settings.enableNotifications')}</Label>
              <Switch 
                id="notifications" 
                checked={notifications} 
                onCheckedChange={handleNotificationsChange}
                data-testid="switch-notifications"
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Units Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">{t('settings.units')}</h3>
            </div>
            <RadioGroup value={units} onValueChange={handleUnitsChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mg/dL" id="mgdl" data-testid="radio-units-mgdl" />
                <Label htmlFor="mgdl" className="text-[#CAD6D4] cursor-pointer">{t('settings.mgdl')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mmol/L" id="mmol" data-testid="radio-units-mmol" />
                <Label htmlFor="mmol" className="text-[#CAD6D4] cursor-pointer">{t('settings.mmol')}</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="bg-white/10" />

          {/* Language Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">{t('settings.language')}</h3>
            </div>
            <div className="flex justify-end">
              <LanguageSelector />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Data & Privacy Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">{t('settings.dataPrivacy')}</h3>
            </div>
            <Button 
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start bg-white/5 border-white/10 text-[#CAD6D4] hover:bg-white/10 hover:text-white"
              data-testid="button-export-data"
            >
              {t('settings.exportData')}
            </Button>
          </div>

          <Separator className="bg-white/10" />

          {/* Onboarding Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-white">{t('settings.onboarding')}</h3>
            </div>
            <Button 
              onClick={handleResetOnboarding}
              variant="outline"
              className="w-full justify-start bg-white/5 border-white/10 text-[#CAD6D4] hover:bg-white/10 hover:text-white"
              data-testid="button-reset-onboarding"
            >
              {t('settings.resetTutorial')}
            </Button>
            <p className="text-xs text-[#9AA8A6]">
              {t('settings.rerunTutorial')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10">
          <p className="text-xs text-[#9AA8A6] text-center">
            {t('settings.savedAutomatically')}
          </p>
        </div>
      </div>
    </>
  );
}
