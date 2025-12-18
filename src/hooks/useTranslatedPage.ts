// hooks/useTranslatedPage.js
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function useTranslatedPage(slug) {
    const { language } = useLanguage();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log(`Fetching page ${slug} in language ${language}`);

                const response = await fetch(
                    `https://comfort.satkan.site/wp-json/multilang/v1/page/${slug}?lang=${language}&embed=true`,
                    {
                        headers: {
                            'Cache-Control': 'no-cache'
                        }
                    }
                );

                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Received data structure:', {
                    title: data.title,
                    acfKeys: data.acf ? Object.keys(data.acf) : 'No ACF',
                    hasBlocks: !!data.acf?.add_block,
                    blockCount: data.acf?.add_block?.length || 0
                });

                setPageData(data);

            } catch (err) {
                console.error('Error in useTranslatedPage:', err);
                setError(err.message);

                // Fallback на старый endpoint
                try {
                    console.log('Trying fallback endpoint...');
                    const fallbackResponse = await fetch(
                        `https://comfort.satkan.site/wp-json/custom/v1/page/${slug}`
                    );
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        console.log('Fallback data received');
                        setPageData(fallbackData);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback also failed:', fallbackErr);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug, language]);

    return { pageData, loading, error };
};


