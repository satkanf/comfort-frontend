const https = require('https');

function debugContactsSocial() {
    console.log('=== Проверка данных contactsData?.acf?.social ===\n');

    // Получаем ID страницы контактов
    const contactsUrl = 'https://comfort.satkan.site/wp-json/wp/v2/pages?slug=contacts&_fields=id';

    https.get(contactsUrl, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const pages = JSON.parse(data);
                if (Array.isArray(pages) && pages.length > 0) {
                    const pageId = pages[0].id;
                    console.log('ID страницы контактов:', pageId);

                    // Получаем полные данные страницы
                    const fullContactsUrl = `https://comfort.satkan.site/wp-json/wp/v2/pages/${pageId}?_embed`;

                    https.get(fullContactsUrl, (res) => {
                        let fullData = '';

                        res.on('data', (chunk) => {
                            fullData += chunk;
                        });

                        res.on('end', () => {
                            try {
                                const page = JSON.parse(fullData);
                                console.log('\n=== contactsData?.acf?.social ===');
                                console.log('Существует:', !!page.acf?.social);
                                console.log('Тип данных:', typeof page.acf?.social);
                                console.log('Это массив:', Array.isArray(page.acf?.social));
                                console.log('Длина массива:', Array.isArray(page.acf?.social) ? page.acf.social.length : 'N/A');

                                if (page.acf?.social && Array.isArray(page.acf.social)) {
                                    console.log('\n=== Содержимое массива ===');
                                    page.acf.social.forEach((item, index) => {
                                        console.log(`\nЭлемент ${index}:`);
                                        console.log('  social_name:', item.social_name);
                                        console.log('  social_link:', item.social_link);
                                        console.log('  social_icon:', item.social_icon);
                                        console.log('  Тип social_icon:', typeof item.social_icon);
                                        console.log('  social_icon является числом:', typeof item.social_icon === 'number');
                                    });
                                } else {
                                    console.log('Массив social пустой или не существует');
                                }

                                console.log('\n=== Все ACF поля ===');
                                console.log(Object.keys(page.acf || {}));

                            } catch (e) {
                                console.error('Ошибка парсинга полных данных:', e.message);
                            }
                        });
                    });

                } else {
                    console.log('Страница контактов не найдена');
                }

            } catch (e) {
                console.error('Ошибка парсинга списка страниц:', e.message);
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса списка страниц:', e.message);
    });
}

debugContactsSocial();
