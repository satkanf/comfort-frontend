// src/utils/api.ts

// Утилитарная функция для JSONP запросов к WordPress API
export const fetchJSONP = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const callbackName = `wp_callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const script = document.createElement('script');
        script.src = `${url}&_jsonp=${callbackName}`;
        script.async = true;

        // Глобальная функция callback
        (window as any)[callbackName] = (data: any) => {
            resolve(data);
            cleanup();
        };

        script.onerror = () => {
            reject(new Error('JSONP request failed'));
            cleanup();
        };

        const cleanup = () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
            delete (window as any)[callbackName];
        };

        document.head.appendChild(script);

        // Таймаут на случай, если запрос зависнет
        setTimeout(() => {
            reject(new Error('JSONP request timeout'));
            cleanup();
        }, 15000);
    });
};

// Функция для получения данных цен по ID
export const fetchPriceData = async (priceIds: number[], language: string = 'uk'): Promise<any[]> => {
    try {
        const baseUrl = 'https://comfort.satkan.site';
        const pricePromises = priceIds.map(async (id) => {
            try {
                // Получаем полные данные цены
                const priceResponse = await fetch(`${baseUrl}/wp-json/wp/v2/price/${id}?_embed&lang=${language}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                if (!priceResponse.ok) {
                    console.error(`Failed to fetch price ${id}:`, priceResponse.status);
                    return null;
                }
                const priceData = await priceResponse.json();
                return priceData;
            } catch (err) {
                console.error(`Error loading price ${id}:`, err);
                return null;
            }
        });

        const priceData = await Promise.all(pricePromises);
        return priceData.filter(data => data !== null);
    } catch (err) {
        console.error('Error loading price data:', err);
        return [];
    }
};

// Устаревшая функция - оставлена для совместимости
export const fetchPrices = async (priceIds: number[]): Promise<string[]> => {
    const priceData = await fetchPriceData(priceIds);
    return priceData.map(data => data?.acf?.price || data?.acf?.price_value || data?.title?.rendered || 'Цена не указана');
};

// Функция для получения URL изображений по ID
export const fetchImageUrls = async (imageIds: (number | string)[]): Promise<string[]> => {
    try {
        const baseUrl = 'https://comfort.satkan.site';
        const imagePromises = imageIds.map(async (id) => {
            // Если это уже URL, возвращаем как есть
            if (typeof id === 'string' && (id.startsWith('http') || id.startsWith('//'))) {
                return id;
            }

            // Если это ID, получаем URL через API
            if (typeof id === 'number' || (typeof id === 'string' && !isNaN(Number(id)))) {
                try {
                    const mediaResponse = await fetch(`${baseUrl}/wp-json/wp/v2/media/${id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    });
                    if (!mediaResponse.ok) {
                        return '';
                    }
                    const mediaData = await mediaResponse.json();

                    // Пробуем получить разные размеры изображений
                    return mediaData.media_details?.sizes?.large?.source_url ||
                           mediaData.media_details?.sizes?.medium?.source_url ||
                           mediaData.media_details?.sizes?.full?.source_url ||
                           mediaData.guid?.rendered ||
                           mediaData.source_url ||
                           '';
                } catch (err) {
                    return '';
                }
            }

            return '';
        });

        const urls = await Promise.all(imagePromises);
        return urls.filter(url => url !== '');
    } catch (err) {
        return [];
    }
};

