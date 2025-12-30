const https = require('https');

function testContactsACFFull() {
    console.log('=== Проверка ACF полей страницы контактов ===\n');

    // Получаем ID страницы контактов
    const slugUrl = 'https://comfort.satkan.site/wp-json/wp/v2/pages?slug=contacts&_fields=id';

    https.get(slugUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const slugData = JSON.parse(data);
                if (Array.isArray(slugData) && slugData.length > 0) {
                    const pageId = slugData[0].id;
                    console.log('ID страницы контактов:', pageId);

                    // Получаем полные ACF данные
                    const acfUrl = `https://comfort.satkan.site/wp-json/wp/v2/pages/${pageId}?_embed`;

                    https.get(acfUrl, (acfRes) => {
                        let acfData = '';

                        acfRes.on('data', (chunk) => {
                            acfData += chunk;
                        });

                        acfRes.on('end', () => {
                            try {
                                const page = JSON.parse(acfData);
                                console.log('Заголовок страницы:', page.title?.rendered);
                                console.log('\n=== Все ACF поля ===');
                                console.log(JSON.stringify(page.acf, null, 2));

                                console.log('\n=== Ключи ACF ===');
                                console.log(Object.keys(page.acf || {}));

                            } catch (e) {
                                console.error('Ошибка парсинга ACF:', e.message);
                            }
                        });
                    });

                }
            } catch (e) {
                console.error('Ошибка парсинга slug:', e.message);
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса slug:', e.message);
    });
}

testContactsACFFull();
