import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/LanguageContext"

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
      variant="outline"
      size="sm"
    >
      {language === 'en' ? '中文' : 'English'}
    </Button>
  );
}