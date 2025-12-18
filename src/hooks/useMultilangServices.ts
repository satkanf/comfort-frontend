// hooks/useMultilangServices.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MultilangService {
    id: number;
    title: { rendered: string };
    content?: { rendered: string };
    _embedded?: {
        'wp:term'?: Array<Array<{
            id: number;
            name: string;
            slug: string;
            taxonomy: string;
            acf?: any;
        }>>;
    };
}

interface ServiceBlock {
    acf_fc_layout: string;
    title: string;
    description?: string;
    services?: Array<{
        ID: number;
        post_title: string;
        post_name: string;
    }>;
}

export const useMultilangServices = (acfFieldName: string = 'about_services_add') => {
    const { language } = useLanguage();
    const [services, setServices] = useState<MultilangService[]>([]);
    const [serviceIds, setServiceIds] = useState<number[]>([]);
    const [taxonomyTerms, setTaxonomyTerms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [blockData, setBlockData] = useState<{
        title: string;
        description?: string;
    } | null>(null);

    // 1️⃣ Получаем ID услуг из мультиязычной страницы
    useEffect(() => {
        const fetchServiceIds = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`🔄 Загружаю услуги для языка: ${language}`);

                // Используем мультиязычный endpoint
                const response = await fetch(
                    `https://comfort.satkan.site/wp-json/multilang/v1/page/golovna?lang=${language}&embed=true`
                );

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки страницы: ${response.status}`);
                }

                const pageData = await response.json();
                console.log('✅ Страница загружена:', pageData.title);

                // Ищем блок с услугами
                const servicesBlock = pageData.acf?.add_block?.find(
                    (block: ServiceBlock) => {
                        // Ищем по нескольким возможным названиям блоков
                        const possibleBlocks = ['about_services', 'services', 'our_services'];
                        return possibleBlocks.includes(block.acf_fc_layout);
                    }
                );

                if (!servicesBlock) {
                    console.warn('Блок услуг не найден на странице');
                    setServiceIds([]);
                    setBlockData(null);
                    return;
                }

                console.log('✅ Найден блок услуг:', servicesBlock.acf_fc_layout);

                // Сохраняем данные блока (заголовок, описание)
                setBlockData({
                    title: servicesBlock.title || '',
                    description: servicesBlock.description
                });

                // Получаем ID услуг
                const ids: number[] = [];

                // Проверяем разные возможные структуры данных
                if (servicesBlock.services && Array.isArray(servicesBlock.services)) {
                    // Структура 1: servicesBlock.services = [{ID: 1, post_title: "...", ...}]
                    servicesBlock.services.forEach((service: any) => {
                        if (service.ID) ids.push(service.ID);
                    });
                } else if (servicesBlock[acfFieldName] && Array.isArray(servicesBlock[acfFieldName])) {
                    // Структура 2: servicesBlock[acfFieldName] = [{ID: 1, post_title: "...", ...}]
                    servicesBlock[acfFieldName].forEach((item: any) => {
                        if (item.ID) ids.push(item.ID);
                    });
                }

                console.log(`Найдено ID услуг: ${ids.length}`, ids);
                setServiceIds(ids);

            } catch (err: any) {
                console.error('Ошибка при получении ID услуг:', err);
                setError(err.message || 'Неизвестная ошибка');
                setServiceIds([]);
            }
        };

        fetchServiceIds();
    }, [language, acfFieldName]);

    // 2️⃣ Загружаем ACF данные для терминов таксономии
    useEffect(() => {
        const fetchTaxonomyTerms = async () => {
            try {
                // Загружаем все термины таксономии с ACF полями
                const response = await fetch(
                    `https://comfort.satkan.site/wp-json/wp/v2/services-caservices-catt?per_page=100&lang=${language}`
                );

                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();

                // Для каждого термина загружаем ACF данные
                const termsWithAcf = await Promise.all(
                    data.map(async (term: any) => {
                        try {
                            const acfResponse = await fetch(
                                `https://comfort.satkan.site/wp-json/wp/v2/services-caservices-catt/${term.id}?_fields=acf&lang=${language}`
                            );
                            if (acfResponse.ok) {
                                const acfData = await acfResponse.json();
                                return {
                                    ...term,
                                    acf: acfData.acf
                                };
                            }
                        } catch (err) {
                            console.error(`Error fetching ACF for term ${term.id}:`, err);
                        }
                        return term;
                    })
                );

                console.log('Taxonomy terms with ACF:', termsWithAcf.length);
                setTaxonomyTerms(termsWithAcf);
            } catch (err) {
                console.error("Ошибка при загрузке терминов таксономии:", err);
            }
        };

        if (language) {
            fetchTaxonomyTerms();
        }
    }, [language]);

    // 3️⃣ Загружаем все услуги по массиву ID
    useEffect(() => {
        if (!serviceIds.length || !language) {
            setLoading(false);
            return;
        }

        const fetchServices = async () => {
            try {
                console.log(`Загружаю услуги по ID: ${serviceIds.join(',')} для языка ${language}`);

                // Используем WP REST API с параметром языка
                const response = await fetch(
                    `https://comfort.satkan.site/wp-json/wp/v2/services?include=${serviceIds.join(",")}&_embed&lang=${language}`
                );

                if (!response.ok) throw new Error("Network response was not ok");
                const data = await response.json();
                console.log(`✅ Загружено услуг: ${data.length}`);

                // Обновляем услуги с ACF данными из терминов
                const servicesWithAcf = data.map((service: any) => {
                    // Находим категории для этой услуги
                    const serviceCategories = service._embedded?.['wp:term']?.flat() || [];
                    const filteredCategories = serviceCategories.filter((term: any) =>
                        term.taxonomy === 'services-caservices-catt'
                    );

                    // Добавляем ACF данные из загруженных терминов
                    const categoriesWithAcf = filteredCategories.map((category: any) => {
                        const termWithAcf = taxonomyTerms.find((t: any) => t.id === category.id);
                        return {
                            ...category,
                            acf: termWithAcf?.acf
                        };
                    });

                    return {
                        ...service,
                        _embedded: {
                            'wp:term': [categoriesWithAcf]
                        }
                    };
                });

                console.log('Services with ACF:', servicesWithAcf);
                setServices(servicesWithAcf);
            } catch (err: any) {
                console.error("Ошибка при загрузке услуг:", err);
                setError(err.message || 'Ошибка загрузки услуг');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [serviceIds, taxonomyTerms, language]);

    return {
        services,
        serviceIds,
        loading,
        error,
        blockData,
        language
    };
};