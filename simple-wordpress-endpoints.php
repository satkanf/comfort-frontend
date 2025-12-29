<?php
/**
 * Простые WordPress REST API endpoints для тестирования
 * Добавьте в functions.php
 */

// Разрешаем CORS
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: *");
});

// Простой endpoint для главной страницы
add_action('rest_api_init', function() {
    register_rest_route('multilang/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'simple_get_page',
        'permission_callback' => '__return_true'
    ));
});

function simple_get_page($request) {
    $slug = $request->get_param('slug');
    $lang = $request->get_param('lang') ?: 'uk';

    // Получаем страницу по slug
    $page = get_page_by_path($slug, OBJECT, 'page');

    if (!$page) {
        // Если страница не найдена, возвращаем тестовые данные
        return array(
            'id' => 1,
            'title' => array('rendered' => $slug === 'golovna' ? 'Головна' : 'Сторінка'),
            'content' => array('rendered' => '<p>Тестовый контент страницы</p>'),
            'acf' => array(
                'add_block' => array(
                    array(
                        'acf_fc_layout' => 'about_services',
                        'title' => 'Наші послуги',
                        'services' => array(
                            array('ID' => 1, 'post_title' => 'Тестовая услуга')
                        )
                    ),
                    array(
                        'acf_fc_layout' => 'home_doctors',
                        'title' => 'Наші лікарі',
                        'home_doctors_add' => array(
                            array('ID' => 1, 'post_title' => 'Тестовый врач')
                        )
                    )
                )
            ),
            '_embedded' => array(),
            'lang' => $lang
        );
    }

    // ACF данные или тестовые
    $acf_data = function_exists('get_fields') ? get_fields($page->ID) : array();

    return array(
        'id' => $page->ID,
        'title' => array('rendered' => get_the_title($page->ID)),
        'content' => array('rendered' => apply_filters('the_content', $page->post_content)),
        'acf' => $acf_data,
        '_embedded' => array(),
        'lang' => $lang
    );
}

// Простой endpoint для переводов
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/translations/(?P<lang>[a-z]{2})', array(
        'methods' => 'GET',
        'callback' => 'simple_get_translations',
        'permission_callback' => '__return_true'
    ));
});

function simple_get_translations($request) {
    $lang = $request->get_param('lang');

    // Возвращаем пустой объект - фронтенд использует дефолтные переводы
    return array(
        'status' => 'success',
        'lang' => $lang,
        'translations' => array()
    );
}

// Простой endpoint для контактов
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/page/contacts', array(
        'methods' => 'GET',
        'callback' => 'simple_get_contacts',
        'permission_callback' => '__return_true'
    ));
});

function simple_get_contacts($request) {
    return array(
        'id' => 1,
        'title' => array('rendered' => 'Контакти'),
        'acf' => array(
            'location' => array(
                'location_address' => 'Адреса',
                'location_value' => 'м. Ірпінь, вул. Західна 6'
            ),
            'phone' => array(
                array(
                    'phone_number' => '+38 (095) 422 00 32',
                    'phone_value' => '+380954220032'
                )
            ),
            'email' => array(
                'email_address' => 'Email',
                'email_value' => 'info@comfort.clinic'
            ),
            'working_hours' => array(
                'working_hours_name' => 'Години роботи',
                'working_hours_value' => "Пн-Пт: 9:00-18:00\nСб: 9:00-15:00\nНд: вихідний"
            ),
            'social' => array(),
            'block_contacts' => array(
                'block_contacts_title' => 'Контактна інформація',
                'block_contacts_subtitle' => 'Знайдіть нас за адресою нижче або скористайтеся контактними даними для зв\'язку'
            )
        ),
        '_embedded' => array()
    );
}

// Добавляем параметр lang к стандартным queries
add_filter('rest_services_query', 'add_lang_to_services', 10, 2);
function add_lang_to_services($args, $request) {
    // Пока просто возвращаем args без изменений
    return $args;
}

add_filter('rest_doctors_query', 'add_lang_to_doctors', 10, 2);
function add_lang_to_doctors($args, $request) {
    return $args;
}

// Создаем тестовые данные при активации темы
add_action('after_switch_theme', 'create_test_data');
function create_test_data() {
    // Создаем тестовую страницу "Головна" если её нет
    if (!get_page_by_path('golovna')) {
        wp_insert_post(array(
            'post_title' => 'Головна',
            'post_name' => 'golovna',
            'post_content' => 'Главная страница сайта',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
    }

    // Создаем тестовую страницу "Контакти" если её нет
    if (!get_page_by_path('contacts')) {
        wp_insert_post(array(
            'post_title' => 'Контакти',
            'post_name' => 'contacts',
            'post_content' => 'Страница контактов',
            'post_status' => 'publish',
            'post_type' => 'page'
        ));
    }
}

?>








