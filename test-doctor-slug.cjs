const https = require('https');

function testDoctorSlug() {
    console.log('=== Проверка slug врача для разных языков ===\n');

    const baseUrl = 'https://comfort.satkan.site/wp-json/wp/v2';

    // Получаем список врачей для каждого языка
    const languages = ['uk', 'ru'];

    languages.forEach(lang => {
        console.log(`\n--- Врачи на языке: ${lang} ---`);
        const url = `${baseUrl}/doctors?lang=${lang}&per_page=5&_fields=id,title,slug,lang,translations`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const doctors = JSON.parse(data);
                    console.log(`Найдено врачей: ${doctors.length}`);

                    doctors.forEach(doctor => {
                        console.log(`ID: ${doctor.id}, Slug: ${doctor.slug}, Title: ${doctor.title?.rendered}, Lang: ${doctor.lang}`);
                        if (doctor.translations) {
                            console.log(`  Translations: ${JSON.stringify(doctor.translations)}`);
                        }
                    });

                } catch (e) {
                    console.error('Ошибка парсинга:', e.message);
                }
            });
        }).on('error', (e) => {
            console.error('Ошибка запроса:', e.message);
        });
    });
}

testDoctorSlug();
