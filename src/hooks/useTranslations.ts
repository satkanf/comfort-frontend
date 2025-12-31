import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslations = () => {
  const { language, t } = useLanguage();

  return {
    language,
    t
  };
};






