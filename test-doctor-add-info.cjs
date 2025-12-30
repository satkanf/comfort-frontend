const https = require('https');

function testDoctorAddInfo() {
    console.log('=== Проверка doctor_add_info у врачей ===\n');

    const baseUrl = 'https://comfort.satkan.site/wp-json/wp/v2';

    // Получаем всех врачей с ACF
    const url = `${baseUrl}/doctors?lang=ru&per_page=10&_embed&acf_format=standard`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const doctors = JSON.parse(data);
                console.log(`Найдено ${doctors.length} врачей\n`);

                doctors.forEach((doctor, index) => {
                    console.log(`${index + 1}. ${doctor.title?.rendered}`);
                    console.log(`   ID: ${doctor.id}`);

                    if (doctor.acf?.doctor_add_info && Array.isArray(doctor.acf.doctor_add_info)) {
                        console.log(`   doctor_add_info: ${doctor.acf.doctor_add_info.length} блоков`);

                        doctor.acf.doctor_add_info.forEach((block, blockIndex) => {
                            console.log(`     Блок ${blockIndex + 1}: ${block.acf_fc_layout}`);
                            if (block.acf_fc_layout === 'doctor_add_certificates') {
                                console.log(`       Сертификаты: ${JSON.stringify(block.doctor_certificates)}`);
                            }
                        });
                    } else {
                        console.log(`   doctor_add_info: отсутствует или не массив`);
                    }

                    console.log('');
                });

            } catch (e) {
                console.error('Ошибка парсинга:', e.message);
                console.log('Raw response (first 1000 chars):', data.substring(0, 1000));
            }
        });
    }).on('error', (e) => {
        console.error('Ошибка запроса:', e.message);
    });
}

testDoctorAddInfo();
