import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={language === 'uk' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('uk')}
        className="h-7 px-3 text-xs"
      >
        УКР
      </Button>
      <Button
        variant={language === 'ru' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('ru')}
        className="h-7 px-3 text-xs"
      >
        РУС
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
