// hooks/useTranslations.ts
import { useLanguage } from '@/contexts/LanguageContext';

// Локальные переводы (можно вынести в JSON файлы)
const translations = {
    common: {
        loading: {
            uk: 'Завантаження...',
            ru: 'Загрузка...',
            en: 'Loading...'
        },
        error: {
            uk: 'Помилка',
            ru: 'Ошибка',
            en: 'Error'
        },
        readMore: {
            uk: 'Детальніше',
            ru: 'Подробнее',
            en: 'Read more'
        }
    },
    services: {
        title: {
            uk: 'Наші послуги',
            ru: 'Наши услуги',
            en: 'Our Services'
        },
        allServices: {
            uk: 'Всі послуги',
            ru: 'Все услуги',
            en: 'All Services'
        }
    },
    // ... другие категории
};

export const useTranslations = (category?: string) => {
    const { language } = useLanguage();

    const t = (key: string, defaultValue: string = ''): string => {
        // Если указана категория, ищем в ней
        if (category && translations[category as keyof typeof translations]) {
            const categoryTranslations = translations[category as keyof typeof translations];
            if (categoryTranslations[key as keyof typeof categoryTranslations]) {
                return categoryTranslations[key as keyof typeof categoryTranslations][language] || defaultValue;
            }
        }

        // Ищем в common
        if (translations.common[key as keyof typeof translations.common]) {
            return translations.common[key as keyof typeof translations.common][language] || defaultValue;
        }

        // Ищем во всех категориях
        for (const cat in translations) {
            const categoryTranslations = translations[cat as keyof typeof translations];
            if (categoryTranslations[key as keyof typeof categoryTranslations]) {
                return categoryTranslations[key as keyof typeof categoryTranslations][language] || defaultValue;
            }
        }

        return defaultValue || key;
    };

    return { t, language };
};

// Использование:
// const { t } = useTranslations('services');
// <h2>{t('title')}</h2>
// <button>{t('readMore')}</button>