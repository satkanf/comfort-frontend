const https = require('https');

function testAPI(url, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n=== Testing ${description} ===`);
        console.log('URL:', url);

        https.get(url, (res) => {
            let data = '';

            console.log('Status:', res.statusCode);

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
                            console.log('First item ID:', jsonData[0].id);
                        }
                    } else {
                        console.log('Response keys:', Object.keys(jsonData));
                    }
                    resolve(jsonData);
                } catch (e) {
                    console.error('JSON parse error:', e.message);
                    console.log('Raw response (first 200 chars):', data.substring(0, 200));
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
        ['https://comfort.satkan.site/wp-json/wp/v2/doctors?per_page=5&_embed', 'Doctors endpoint'],
        ['https://comfort.satkan.site/wp-json/wp/v2/doctors?include=380,369&_embed', 'Doctors by ID'],
        ['https://comfort.satkan.site/wp-json/wp/v2/posts?per_page=5&_embed', 'Posts endpoint (fallback)'],
        ['https://comfort.satkan.site/wp-json/wp/v2/types', 'Available post types']
    ];

    for (const [url, description] of tests) {
        try {
            await testAPI(url, description);
        } catch (e) {
            console.log(`Test failed: ${description}`);
        }
    }
}

runTests();

