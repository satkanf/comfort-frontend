import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'uk' | 'ru';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLang?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
                                                                    children,
                                                                    defaultLang = 'uk'
                                                                  }) => {
  const [language, setLanguage] = useState<string>(defaultLang);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Инициализация языка
  useEffect(() => {
    const savedLang = localStorage.getItem('preferred_language');
    const browserLang = navigator.language.split('-')[0];

    if (savedLang && ['uk', 'ru'].includes(savedLang)) {
      setLanguage(savedLang);
    } else if (browserLang === 'uk' || browserLang === 'ru') {
      setLanguage(browserLang);
    }
  }, []);

  // Загрузка переводов
  const loadTranslations = async (lang: string) => {
    if (translations[lang]) return; // Уже загружены

    setIsLoading(true);
    try {
      const response = await fetch(
          `https://comfort.satkan.site/wp-json/custom/v1/translations/${lang}`
      );

      if (response.ok) {
        const data = await response.json();
        setTranslations(prev => ({ ...prev, [lang]: data }));
      }
    } catch (error) {
      console.warn(`Failed to load translations for ${lang}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем переводы при изменении языка
  useEffect(() => {
    loadTranslations(language);
  }, [language]);

  // Функция изменения языка
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    document.documentElement.lang = lang; // Для accessibility

    // Обновляем URL с учетом языка (опционально)
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };

  // Функция перевода
  const t = (
      key: string,
      defaultValue: string = key,
      params?: Record<string, string>
  ): string => {
    let translation = translations[language]?.[key] || defaultValue;

    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }

    return translation;
  };

  return (
      <LanguageContext.Provider value={{
        language,
        changeLanguage,
        t,
        isLoading
      }}>
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};