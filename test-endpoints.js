// Тестовый файл для проверки WordPress REST API endpoints
const baseUrl = 'https://comfort.satkan.site/wp-json';

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🧪 Тестируем: ${description}`);
    console.log(`📡 URL: ${baseUrl}${endpoint}`);

    const response = await fetch(`${baseUrl}${endpoint}`);
    const data = await response.json();

    console.log(`✅ Статус: ${response.status}`);
    if (response.ok) {
      console.log(`📊 Данные получены:`, typeof data === 'object' ? Object.keys(data) : data);
    } else {
      console.log(`❌ Ошибка:`, data);
    }
  } catch (error) {
    console.log(`💥 Ошибка сети:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Начинаем тестирование WordPress REST API\n');

  // Стандартные endpoints
  await testEndpoint('/wp/v2/pages', 'Стандартные страницы');
  await testEndpoint('/wp/v2/posts', 'Стандартные посты');

  // Наши кастомные endpoints
  await testEndpoint('/multilang/v1/page/golovna?lang=uk', 'Мультиязычная главная страница (UK)');
  await testEndpoint('/custom/v1/translations/uk', 'Переводы (UK)');
  await testEndpoint('/custom/v1/page/contacts', 'Страница контактов');

  // Стандартные endpoints с параметром lang
  await testEndpoint('/wp/v2/services?lang=uk', 'Услуги с языком UK');
  await testEndpoint('/wp/v2/doctors?lang=uk', 'Врачи с языком UK');

  console.log('\n✨ Тестирование завершено');
}

// Запускаем тесты
runTests();








