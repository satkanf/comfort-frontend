// utils/translationHelpers.ts

// Форматирование дат с учетом языка
export const formatDate = (dateString: string, language: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString(getLocale(language), options);
};

// Форматирование валюты
export const formatCurrency = (amount: number, language: string): string => {
    const formatter = new Intl.NumberFormat(getLocale(language), {
        style: 'currency',
        currency: 'UAH'
    });

    return formatter.format(amount);
};

// Получение локали по языковому коду
const getLocale = (language: string): string => {
    const locales: Record<string, string> = {
        uk: 'uk-UA',
        ru: 'ru-RU',
        en: 'en-US'
    };

    return locales[language] || 'uk-UA';
};

// Плюрализация (множественное число)
export const pluralize = (count: number, language: string, forms: Record<string, string[]>): string => {
    const rules: Record<string, (n: number) => number> = {
        uk: (n: number) => {
            if (n % 10 === 1 && n % 100 !== 11) return 0;
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 1;
            return 2;
        },
        ru: (n: number) => {
            if (n % 10 === 1 && n % 100 !== 11) return 0;
            if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 1;
            return 2;
        },
        en: (n: number) => n === 1 ? 0 : 1
    };

    const rule = rules[language] || rules.uk;
    return forms[language][rule(count)] || '';
};