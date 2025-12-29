// hooks/useMultilangPage.js
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from "@/utils/baseUrl";

// Маппинг slug'ов для разных языков (Polylang использует разные slug'ы)
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
        uk: 'doctors',
        ru: 'vrachi'
    },
    cziny: {
        uk: 'cziny',
        ru: 'czeny'
    },
    akcziyi: {
        uk: 'akcziyi',
        ru: 'akczii'
    },
    kontakty: {
        uk: 'contacts',
        ru: 'kontakty'
    }
};

export const useMultilangPage = (slug) => {
    const { language } = useLanguage();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получаем правильный slug для текущего языка
    const getLocalizedSlug = (baseSlug) => {
        const mapping = SLUG_MAPPING[baseSlug];
        return mapping ? mapping[language] : baseSlug;
    };

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                setError(null);

                const baseUrl = getBaseUrl();
                const localizedSlug = getLocalizedSlug(slug);

                let data = null;

                // Используем только стандартный WordPress REST API
                let requestUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed&cache_buster=${Date.now()}`;
                const response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    // Если стандартный endpoint не работает, попробуем без языкового параметра
                    const fallbackUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&_embed&cache_buster=${Date.now()}`;
                    const fallbackResponse = await fetch(fallbackUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });

                    if (!fallbackResponse.ok) {
                        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                    }

                    const fallbackResponseText = await fallbackResponse.text();

                    // Проверяем, является ли ответ JSON
                    const contentType = fallbackResponse.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            data = JSON.parse(fallbackResponseText);
                        } catch (parseError) {
                            throw new Error('Server returned invalid JSON');
                        }
                    } else {
                        throw new Error('Server returned HTML instead of JSON data');
                    }
                } else {
                    const responseText = await response.text();

                    // Проверяем, является ли ответ JSON
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            data = JSON.parse(responseText);
                        } catch (parseError) {
                            throw new Error('Server returned invalid JSON');
                        }
                    } else {
                        throw new Error('Server returned HTML instead of JSON data');
                    }
                }

                if (data) {

                    let processedData;
                    if (Array.isArray(data)) {
                        if (data.length === 0) {
                            throw new Error('Page not found - empty array');
                        }
                        processedData = data[0];
                    } else {
                        processedData = data;
                    }

                    setPageData(processedData);
                    setError(null);
                } else {
                    throw new Error(`No data received from ${slug}`);
                }

            } catch (err) {
                let errorMessage = 'An unknown error occurred';
                if (err instanceof Error) {
                    if (err.message.includes('HTML instead of JSON')) {
                        errorMessage = 'Server configuration error. Please contact administrator.';
                    } else if (err.message.includes('HTTP error')) {
                        errorMessage = 'Page not found or server error.';
                    } else {
                        errorMessage = err.message;
                    }
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
            };

            fetchPage();
        }, [slug, language]);

    return { pageData, loading, error };
};