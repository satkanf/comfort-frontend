const https = require('https');

function debugServiceAPI() {
    console.log('=== Проверка API услуги ===\n');

    // Проверяем конкретную услугу
    const serviceSlug = 'radiovolnovoe-udalenie-novoobrazovanij';
    const url = `https://comfort.satkan.site/wp-json/wp/v2/services?slug=${serviceSlug}&lang=ru&_embed`;

    console.log('URL:', url);

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const services = JSON.parse(data);
                console.log('Найдено услуг:', services.length);

                if (services.length > 0) {
                    const service = services[0];
                    console.log('\n=== Услуга ===');
                    console.log('ID:', service.id);
                    console.log('Slug:', service.slug);
                    console.log('Title:', service.title?.rendered);

                    console.log('\n=== ACF ===');
                    console.log('ACF exists:', !!service.acf);
                    if (service.acf) {
                        console.log('ACF keys:', Object.keys(service.acf));

                        if (service.acf.service_content) {
                            console.log('\n=== Service Content ===');
                            console.log('Type:', typeof service.acf.service_content);
                            console.log('Is array:', Array.isArray(service.acf.service_content));
                            console.log('Length:', service.acf.service_content.length);

                            service.acf.service_content.forEach((block, index) => {
                                console.log(`\nBlock ${index}:`);
                                console.log('  acf_fc_layout:', block.acf_fc_layout);
                                if (block.acf_fc_layout === 'service_tx_im') {
                                    console.log('  service_tx_image:', block.service_tx_image);
                                    console.log('  service_text_im exists:', !!block.service_text_im);
                                }
                            });
                        }
                    }
                }

            } catch (e) {
                console.error('Ошибка парсинга:', e.message);
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса:', e.message);
    });
}

debugServiceAPI();
