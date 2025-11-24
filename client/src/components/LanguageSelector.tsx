import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/i18n/config';
import { useToast } from '@/hooks/use-toast';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const currentLanguage = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    toast({
      title: t('settings.languageChanged'),
      description: `Language changed to ${
        SUPPORTED_LANGUAGES.find((l) => l.code === languageCode)?.nativeName
      }`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('settings.selectLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('settings.selectLanguage')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={
              currentLanguage.code === language.code
                ? 'bg-primary/10 font-semibold'
                : ''
            }
          >
            <span className="flex items-center gap-2">
              {currentLanguage.code === language.code && (
                <span className="text-primary">✓</span>
              )}
              <span>{language.nativeName}</span>
              <span className="text-muted-foreground text-xs">
                ({language.name})
              </span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
