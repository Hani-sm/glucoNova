import { Button } from '@/components/ui/button';
import { X, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OnboardingBannerProps {
  onResume: () => void;
  onDismiss: () => void;
}

export default function OnboardingBanner({ onResume, onDismiss }: OnboardingBannerProps) {
  const { t } = useTranslation();
  
  return (
    <div 
      className="bg-emerald-400/10 border-b border-emerald-400/20 px-6 py-3 flex items-center justify-between"
      data-testid="banner-onboarding"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="text-sm font-medium text-white">{t('onboarding.banner.completeSetup')}</p>
          <p className="text-xs text-gray-400">
            {t('onboarding.banner.addHealthInfo')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={onResume}
          className="bg-emerald-400 hover:bg-emerald-500 text-white"
          data-testid="button-resume-setup"
        >
          {t('onboarding.banner.resumeSetup')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDismiss}
          className="text-gray-400 hover:text-white"
          data-testid="button-dismiss-banner"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
