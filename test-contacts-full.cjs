const https = require('https');

function testContactsFull() {
    console.log('=== Полная проверка страницы контактов ===');

    const url = 'https://comfort.satkan.site/wp-json/wp/v2/pages/242?_embed'; // ID русской страницы контактов

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const page = JSON.parse(data);
                console.log('Статус:', res.statusCode);
                console.log('Заголовок:', page.title?.rendered);
                console.log('Slug:', page.slug);

                console.log('\n=== Все поля страницы ===');
                console.log('Ключи:', Object.keys(page));

                console.log('\n=== ACF поле ===');
                console.log('ACF существует:', !!page.acf);
                console.log('ACF значение:', page.acf);

                console.log('\n=== Meta поле ===');
                console.log('Meta существует:', !!page.meta);
                console.log('Meta значение:', page.meta);

                console.log('\n=== ACF через meta ===');
                if (page.meta) {
                    Object.keys(page.meta).forEach(key => {
                        if (key.includes('acf') || key.includes('ACF')) {
                            console.log(`${key}:`, page.meta[key]);
                        }
                    });
                }

                console.log('\n=== _embedded ===');
                console.log('_embedded существует:', !!page._embedded);
                if (page._embedded) {
                    console.log('_embedded ключи:', Object.keys(page._embedded));
                }

            } catch (e) {
                console.error('Ошибка парсинга:', e.message);
                console.log('Raw response (first 1000 chars):', data.substring(0, 1000));
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса:', e.message);
    });
}

testContactsFull();
