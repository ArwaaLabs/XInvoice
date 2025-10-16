import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageSelector() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-9 w-9"
          data-testid="language-selector-trigger"
          title={t('language')}
        >
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => {
          const isActive = language.code === currentLanguage;
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="flex items-center justify-between cursor-pointer"
              data-testid={`language-option-${language.code}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{language.flag}</span>
                <span>{language.nativeName}</span>
              </div>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
