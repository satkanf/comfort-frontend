const https = require('https');

function testDoctorCertificates() {
    console.log('=== Проверка сертификатов врачей ===\n');

    const baseUrl = 'https://comfort.satkan.site/wp-json/wp/v2';

    // Получаем одного врача с сертификатами
    const url = `${baseUrl}/doctors?lang=ru&per_page=1&_embed&acf_format=standard`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const doctors = JSON.parse(data);
                if (doctors.length > 0) {
                    const doctor = doctors[0];
                    console.log('Врач:', doctor.title?.rendered);
                    console.log('Сертификаты в ACF:', doctor.acf?.doctor_certificates);

                    if (doctor.acf?.doctor_certificates && Array.isArray(doctor.acf.doctor_certificates)) {
                        console.log('Количество сертификатов:', doctor.acf.doctor_certificates.length);
                        console.log('Типы значений:', doctor.acf.doctor_certificates.map(item => typeof item));

                        // Если это ID, проверим, существуют ли медиа файлы
                        const ids = doctor.acf.doctor_certificates.filter(item => typeof item === 'number');
                        if (ids.length > 0) {
                            console.log('Проверяем медиа файлы для ID:', ids);
                            ids.forEach(id => {
                                const mediaUrl = `${baseUrl}/media/${id}`;
                                https.get(mediaUrl, (mediaRes) => {
                                    console.log(`Медиа ${id}: статус ${mediaRes.statusCode}`);
                                }).on('error', () => {
                                    console.log(`Медиа ${id}: не найдено`);
                                });
                            });
                        }
                    } else {
                        console.log('Сертификаты отсутствуют или не в массиве');
                    }
                } else {
                    console.log('Врачи не найдены');
                }

            } catch (e) {
                console.error('Ошибка парсинга:', e.message);
                console.log('Raw response (first 500 chars):', data.substring(0, 500));
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса:', e.message);
    });
}

testDoctorCertificates();
