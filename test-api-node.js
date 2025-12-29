const https = require('https');

function testAPI(url) {
    return new Promise((resolve, reject) => {
        console.log('Testing:', url);
        https.get(url, (res) => {
            let data = '';

            console.log('Status:', res.statusCode);
            console.log('Headers:', res.headers);

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log('Data type:', typeof jsonData);
                    console.log('Is array:', Array.isArray(jsonData));
                    if (Array.isArray(jsonData)) {
                        console.log('Array length:', jsonData.length);
                        if (jsonData.length > 0) {
                            console.log('First item title:', jsonData[0].title?.rendered || 'no title');
                            console.log('ACF exists:', !!jsonData[0].acf);
                            if (jsonData[0].acf) {
                                console.log('add_block exists:', !!jsonData[0].acf.add_block);
                                if (jsonData[0].acf.add_block) {
                                    console.log('add_block length:', jsonData[0].acf.add_block.length);
                                    jsonData[0].acf.add_block.forEach((block, i) => {
                                        console.log(`Block ${i}:`, block.acf_fc_layout);
                                    });
                                }
                            }
                        }
                    }
                    resolve(jsonData);
                } catch (e) {
                    console.error('JSON parse error:', e.message);
                    console.log('Raw response (first 500 chars):', data.substring(0, 500));
                    reject(e);
                }
            });
        }).on('error', (e) => {
            console.error('Request error:', e.message);
            reject(e);
        });
    });
}

async function runTests() {
    const tests = [
        'https://comfort.satkan.site/wp-json/wp/v2/pages?slug=golovna&_embed',
        'https://comfort.satkan.site/wp-json/wp/v2/pages?slug=glavnaya&_embed',
        'https://comfort.satkan.site/wp-json/wp/v2/pages?per_page=5&_embed'
    ];

    for (const url of tests) {
        try {
            await testAPI(url);
            console.log('---');
        } catch (e) {
            console.log('Test failed:', url);
            console.log('---');
        }
    }
}

runTests();

