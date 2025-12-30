const https = require('https');

function testContactsDetail() {
    const languages = ['uk', 'ru'];

    languages.forEach(lang => {
        console.log(`\n=== Тестируем контакты ${lang} с _fields=acf ===`);

        const slug = lang === 'ru' ? 'contacts' : 'contacts';
        const url = `https://comfort.satkan.site/wp-json/wp/v2/pages?slug=${slug}&lang=${lang}&_embed&_fields=acf`;

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

                    if (Array.isArray(response) && response.length > 0) {
                        const page = response[0];
                        console.log('Заголовок:', page.title?.rendered);
                        console.log('ACF существует:', !!page.acf);
                        if (page.acf) {
                            console.log('Ключи ACF:', Object.keys(page.acf));
                            console.log('ACF полное:', JSON.stringify(page.acf, null, 2));
                        } else {
                            console.log('ACF отсутствует или пустое');
                        }
                    } else {
                        console.log('Неправильный формат ответа');
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

testContactsDetail();
