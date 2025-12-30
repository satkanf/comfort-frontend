const https = require('https');

function testContactsFlow() {
    console.log('=== Тестирование потока useMultilangContacts ===\n');

    const baseUrl = 'https://comfort.satkan.site/wp-json/wp/v2';
    const language = 'ru';

    // Шаг 1: Получить localized slug
    const SLUG_MAPPING = {
        contacts: { uk: 'contacts', ru: 'contacts' }
    };
    const baseSlug = 'contacts';
    const localizedSlug = SLUG_MAPPING[baseSlug]?.[language] || baseSlug;

    console.log('Language:', language);
    console.log('Base slug:', baseSlug);
    console.log('Localized slug:', localizedSlug);

    // Шаг 2: Запрос ID по slug
    const slugRequestUrl = `${baseUrl}/pages?slug=${localizedSlug}&lang=${language}&_fields=id`;
    console.log('\nШаг 2: Запрос ID по slug');
    console.log('URL:', slugRequestUrl);

    https.get(slugRequestUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const slugData = JSON.parse(data);
                console.log('Статус ответа:', res.statusCode);
                console.log('Данные slug:', slugData);
                console.log('Это массив:', Array.isArray(slugData));
                console.log('Длина массива:', Array.isArray(slugData) ? slugData.length : 'N/A');

                if (Array.isArray(slugData) && slugData.length > 0) {
                    const pageId = slugData[0].id;
                    console.log('Найден ID страницы:', pageId);

                    // Шаг 3: Запрос страницы по ID
                    const pageRequestUrl = `${baseUrl}/pages/${pageId}?_embed`;
                    console.log('\nШаг 3: Запрос страницы по ID');
                    console.log('URL:', pageRequestUrl);

                    https.get(pageRequestUrl, (pageRes) => {
                        let pageData = '';

                        pageRes.on('data', (chunk) => {
                            pageData += chunk;
                        });

                        pageRes.on('end', () => {
                            try {
                                const page = JSON.parse(pageData);
                                console.log('Статус ответа страницы:', pageRes.statusCode);
                                console.log('Заголовок страницы:', page.title?.rendered);
                                console.log('ACF существует:', !!page.acf);
                                if (page.acf) {
                                    console.log('ACF ключи:', Object.keys(page.acf));
                                }
                            } catch (e) {
                                console.error('Ошибка парсинга страницы:', e.message);
                            }
                        });
                    });

                } else {
                    console.log('Страница не найдена по slug');
                }

            } catch (e) {
                console.error('Ошибка парсинга slug ответа:', e.message);
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса slug:', e.message);
    });
}

testContactsFlow();
