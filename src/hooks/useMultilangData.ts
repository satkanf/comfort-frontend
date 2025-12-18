// hooks/useMultilangData.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MultilangDataOptions {
    slug?: string;
    blockType?: string;
    acfField?: string;
    endpoint?: string;
}

export const useMultilangData = (options: MultilangDataOptions = {}) => {
    const { language } = useLanguage();
    const [data, setData] = useState<any>(null);
    const [blockData, setBlockData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        slug = 'golovna',
        blockType,
        acfField,
        endpoint = 'multilang/v1/page'
    } = options;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`🌐 Загружаю ${slug} для языка: ${language}`);

                // 1. Загружаем мультиязычную страницу
                const response = await fetch(
                    `https://comfort.satkan.site/wp-json/${endpoint}/${slug}?lang=${language}&embed=true`
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const pageData = await response.json();

                // 2. Если нужен конкретный блок - ищем его
                if (blockType) {
                    const block = pageData.acf?.add_block?.find(
                        (b: any) => b.acf_fc_layout === blockType
                    );

                    if (!block) {
                        console.warn(`Блок "${blockType}" не найден`);
                        setBlockData(null);
                    } else {
                        setBlockData(block);

                        // Если указано конкретное поле - возвращаем его
                        if (acfField && block[acfField]) {
                            setData(block[acfField]);
                        } else {
                            setData(block);
                        }
                    }
                } else {
                    // 3. Или возвращаем всю страницу
                    setData(pageData);
                    setBlockData(null);
                }

                console.log(`✅ Данные загружены для языка: ${language}`);

            } catch (err: any) {
                console.error('❌ Ошибка в useMultilangData:', err);
                setError(err.message || 'Ошибка загрузки данных');
                setData(null);
                setBlockData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [language, slug, blockType, acfField, endpoint]);

    return {
        data,
        blockData,
        loading,
        error,
        language,
        slug
    };
};