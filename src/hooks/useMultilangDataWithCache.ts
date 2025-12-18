// hooks/useMultilangDataWithCache.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Простой кэш в памяти
const cache: Record<string, any> = {};

export const useMultilangDataWithCache = (options: any) => {
    const { language } = useLanguage();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const cacheKey = `${options.slug}_${options.blockType}_${language}`;

    useEffect(() => {
        const fetchData = async () => {
            // Проверяем кэш
            if (cache[cacheKey] && !options.forceRefresh) {
                console.log(`📦 Использую кэш для ${cacheKey}`);
                setData(cache[cacheKey]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // ... логика загрузки данных

                // Сохраняем в кэш
                cache[cacheKey] = data;

                setData(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [language, options.slug, options.blockType]);

    // Функция для очистки кэша
    const clearCache = () => {
        Object.keys(cache).forEach(key => delete cache[key]);
    };

    return { data, loading, clearCache };
};