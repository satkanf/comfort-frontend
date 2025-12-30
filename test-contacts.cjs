const https = require('https');

function testContacts() {
    const languages = ['uk', 'ru'];

    languages.forEach(lang => {
        console.log(`\n=== Тестируем контакты для языка: ${lang} ===`);

        const slug = lang === 'ru' ? 'contacts' : 'contacts';
        const url = `https://comfort.satkan.site/wp-json/wp/v2/pages?slug=${slug}&lang=${lang}&_embed`;

        console.log('URL:', url);

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('Статус:', res.statusCode);
                    console.log('Тип ответа:', Array.isArray(response) ? 'array' : 'object');
                    console.log('Длина:', Array.isArray(response) ? response.length : 'N/A');

                    if (Array.isArray(response) && response.length > 0) {
                        const page = response[0];
                        console.log('Заголовок:', page.title?.rendered);
                        console.log('ACF существует:', !!page.acf);
                        if (page.acf) {
                            console.log('Ключи ACF:', Object.keys(page.acf));
                        }
                    } else if (!Array.isArray(response)) {
                        console.log('Заголовок:', response.title?.rendered);
                        console.log('ACF существует:', !!response.acf);
                    } else {
                        console.log('Пустой массив - страница не найдена');
                    }
                } catch (e) {
                    console.error('Ошибка парсинга:', e.message);
                }
            });
        }).on('error', (e) => {
            console.error('Ошибка запроса:', e.message);
        });
    });
}

testContacts();
