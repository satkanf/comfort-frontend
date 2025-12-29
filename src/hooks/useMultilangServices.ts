// hooks/useMultilangServices.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from "@/utils/baseUrl";

// Маппинг slug'ов для разных языков
const SLUG_MAPPING = {
    golovna: {
        uk: 'golovna',
        ru: 'glavnaya'
    },
    poslugy: {
        uk: 'poslugy',
        ru: 'uslugi'
    },
    likari: {
        uk: 'likari',
        ru: 'vrachi'
    },
    aktsiyi: {
        uk: 'aktsiyi',
        ru: 'aktsii'
    },
    pro_nas: {
        uk: 'pro_nas',
        ru: 'o_nas'
    },
    tsini: {
        uk: 'tsini',
        ru: 'tseny'
    },
    kontakty: {
        uk: 'kontakty',
        ru: 'kontakty'
    }
};

const getLocalizedSlug = (baseSlug, language) => {
    const mapping = SLUG_MAPPING[baseSlug];
    return mapping ? mapping[language] : baseSlug;
};

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

                // Гибридный подход: пробуем прокси, если не работает - прямые запросы
                const baseUrl = getBaseUrl();

                const localizedSlug = getLocalizedSlug('golovna', language);

                // Используем только стандартный WordPress REST API
                const         requestUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed`;
        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const pageData = await response.json();

                // Если это массив (стандартный endpoint), берем первый элемент
                const page = Array.isArray(pageData) ? pageData[0] : pageData;

                // Ищем блок с услугами
                const servicesBlock = page.acf?.add_block?.find(
                    (block: ServiceBlock) => {
                        // Ищем по нескольким возможным названиям блоков
                        const possibleBlocks = ['about_services', 'services', 'our_services', 'about_services_add'];
                        return possibleBlocks.includes(block.acf_fc_layout);
                    }
                );

                if (!servicesBlock) {
                    // Резервный механизм: загружаем все услуги (максимум 20)
                    setServiceIds([]); // Пустой массив означает "загрузить все"
                    setBlockData({
                        title: language === 'uk' ? 'Наші послуги' : 'Наши услуги',
                        description: language === 'uk' ? 'Перелік доступних послуг' : 'Список доступных услуг'
                    });
                    return;
                }

                // Сохраняем данные блока (заголовок, описание)
                setBlockData({
                    title: servicesBlock.about_services_title ||
                          servicesBlock.title ||
                          servicesBlock.acf?.about_services_title ||
                          servicesBlock.acf?.title ||
                          '',
                    description: servicesBlock.about_services_desc ||
                               servicesBlock.description ||
                               servicesBlock.acf?.about_services_desc ||
                               servicesBlock.acf?.description ||
                               ''
                });

                // Получаем ID услуг
                const ids: number[] = [];

                // Проверяем разные возможные структуры данных
                if (servicesBlock.services && Array.isArray(servicesBlock.services)) {
                    // Структура 1: servicesBlock.services = [{ID: 1, post_title: "...", ...}]
                    servicesBlock.services.forEach((service: any) => {
                        if (service.ID) ids.push(service.ID);
                    });
                } else if (servicesBlock.acf && servicesBlock.acf[acfFieldName] && Array.isArray(servicesBlock.acf[acfFieldName])) {
                    // Структура 3: servicesBlock.acf[acfFieldName] = [{ID: 1, post_title: "...", ...}]
                    servicesBlock.acf[acfFieldName].forEach((item: any) => {
                        if (item.ID) ids.push(item.ID);
                    });
                } else if (servicesBlock.acf && servicesBlock.acf.services && Array.isArray(servicesBlock.acf.services)) {
                    // Структура 4: servicesBlock.acf.services = [{ID: 1, post_title: "...", ...}]
                    servicesBlock.acf.services.forEach((item: any) => {
                        if (item.ID) ids.push(item.ID);
                    });
                } else if (servicesBlock[acfFieldName] && Array.isArray(servicesBlock[acfFieldName])) {
                    // Структура 2: servicesBlock[acfFieldName] = [{ID: 1, post_title: "...", ...}] или [1, 2, 3, ...]
                    servicesBlock[acfFieldName].forEach((item: any) => {
                        if (typeof item === 'number') {
                            // Прямое число (ID)
                            ids.push(item);
                        } else if (item && typeof item === 'object' && item.ID) {
                            // Объект с полем ID
                            ids.push(item.ID);
                        }
                    });
                }

                setServiceIds(ids);

            } catch (err: any) {
                setError(err.message || 'Неизвестная ошибка');
                setServiceIds([]);
            }
        };

        fetchServiceIds();
    }, [language, acfFieldName]);

    // 2️⃣ Загружаем ACF данные для терминов таксономии (отключено - endpoint не существует)
    // useEffect(() => {
    //     const fetchTaxonomyTerms = async () => {
    //         try {
    //             // Загружаем все термины таксономии с ACF полями
    //             const baseUrl = getBaseUrl();
    //             const response = await fetch(`${baseUrl}/wp-json/wp/v2/service-category?per_page=100&lang=${language}`);
    //
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //
    //             const data = await response.json();
    //
    //             // Для каждого термина загружаем ACF данные
    //             const termsWithAcf = await Promise.all(
    //                 data.map(async (term: any) => {
    //                     try {
    //                         const baseUrl = getBaseUrl();
    //                         const acfResponse = await fetch(`${baseUrl}/wp-json/wp/v2/service-category/${term.id}?_fields=acf&lang=${language}`);
    //
    //                         if (!acfResponse.ok) {
    //                             throw new Error(`HTTP error! status: ${acfResponse.status}`);
    //                         }
    //
    //                         const acfData = await acfResponse.json();
    //                         if (acfData) {
    //                             return {
    //                                 ...term,
    //                                 acf: acfData.acf
    //                             };
    //                         }
    //                     } catch (err) {
    //                     }
    //                     return term;
    //                 })
    //             );
    //
    //             setTaxonomyTerms(termsWithAcf);
    //         } catch (err) {
    //         }
    //     };
    //
    //     if (language) {
    //         fetchTaxonomyTerms();
    //     }
    // }, [language]);

    // 3️⃣ Загружаем все услуги по массиву ID или все услуги если ID нет
    useEffect(() => {
        if (!language) {
            setLoading(false);
            return;
        }

        const fetchServices = async () => {
            try {
                const baseUrl = getBaseUrl();
                let url;

                if (serviceIds.length > 0) {
                    // Загружаем конкретные услуги по ID
                    url = `${baseUrl}/wp-json/wp/v2/services?include=${serviceIds.join(",")}&_embed&lang=${language}`;
                } else {
                    // Резервный механизм: загружаем все услуги (ограничим до 20)
                    url = `${baseUrl}/wp-json/wp/v2/services?per_page=20&_embed&lang=${language}`;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Услуги загружаются без дополнительных ACF данных из taxonomy
                const servicesWithAcf = data;

                setServices(servicesWithAcf);
            } catch (err: any) {
                setError(err.message || 'Ошибка загрузки услуг');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [serviceIds, language]);

    return {
        services,
        serviceIds,
        loading,
        error,
        blockData,
        language
    };
};