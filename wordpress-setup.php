<?php
/**
 * WordPress setup for multilanguage React integration
 * Добавьте этот код в functions.php вашей темы
 */

// 1. Регистрация типов записей и таксономий
add_action('init', 'register_custom_post_types');
function register_custom_post_types() {
    // Услуги
    register_post_type('services',
        array(
            'labels' => array(
                'name' => 'Услуги',
                'singular_name' => 'Услуга'
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail'),
            'show_in_rest' => true,
            'rest_base' => 'services'
        )
    );

    // Врачи
    register_post_type('doctors',
        array(
            'labels' => array(
                'name' => 'Врачи',
                'singular_name' => 'Врач'
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail'),
            'show_in_rest' => true,
            'rest_base' => 'doctors'
        )
    );

    // Таксономия для услуг
    register_taxonomy('services-caservices-catt', 'services',
        array(
            'label' => 'Категории услуг',
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true
        )
    );

    // Таксономия для врачей
    register_taxonomy('category-doctors', 'doctors',
        array(
            'label' => 'Специализации',
            'hierarchical' => true,
            'show_in_rest' => true,
            'public' => true
        )
    );
}

// 2. Кастомные REST API endpoints
add_action('rest_api_init', 'register_custom_endpoints');
function register_custom_endpoints() {
    // Мультиязычные страницы
    register_rest_route('multilang/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'get_multilang_page',
        'permission_callback' => '__return_true'
    ));

    // Переводы
    register_rest_route('custom/v1', '/translations/(?P<lang>[a-z]{2})', array(
        'methods' => 'GET',
        'callback' => 'get_translations',
        'permission_callback' => '__return_true'
    ));

    // Страница контактов
    register_rest_route('custom/v1', '/page/contacts', array(
        'methods' => 'GET',
        'callback' => 'get_contacts_page',
        'permission_callback' => '__return_true'
    ));

    // Формы
    register_rest_route('custom/v1', '/booking', array(
        'methods' => 'POST',
        'callback' => 'handle_booking_form',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('custom/v1', '/callback', array(
        'methods' => 'POST',
        'callback' => 'handle_callback_form',
        'permission_callback' => '__return_true'
    ));
}

// 3. Обработчики endpoints
function get_multilang_page($request) {
    $slug = $request->get_param('slug');
    $lang = $request->get_param('lang') ?: 'uk';

    // Получаем страницу по slug
    $page = get_page_by_path($slug, OBJECT, 'page');

    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', array('status' => 404));
    }

    // Получаем ACF данные
    $acf_data = get_fields($page->ID);

    // Получаем embedded данные
    $embedded = array();
    if (isset($_GET['_embed'])) {
        $embedded = array(
            'wp:featuredmedia' => get_post_thumbnail_data($page->ID),
            'wp:term' => wp_get_post_terms($page->ID, get_taxonomies(), array('fields' => 'all'))
        );
    }

    return array(
        'id' => $page->ID,
        'title' => array('rendered' => get_the_title($page->ID)),
        'content' => array('rendered' => apply_filters('the_content', $page->post_content)),
        'acf' => $acf_data,
        '_embedded' => $embedded,
        'lang' => $lang
    );
}

function get_translations($request) {
    $lang = $request->get_param('lang');

    // Пока возвращаем пустой объект - фронтенд использует дефолтные переводы
    return array();
}

function get_contacts_page($request) {
    // Получаем страницу контактов (замените ID на реальный)
    $contacts_page = get_post(123); // ID страницы контактов

    if (!$contacts_page) {
        return new WP_Error('page_not_found', 'Contacts page not found', array('status' => 404));
    }

    $acf_data = get_fields($contacts_page->ID);

    return array(
        'id' => $contacts_page->ID,
        'title' => array('rendered' => get_the_title($contacts_page->ID)),
        'acf' => $acf_data,
        '_embedded' => array()
    );
}

function handle_booking_form($request) {
    $params = $request->get_json_params();

    // Обработка формы бронирования
    $name = sanitize_text_field($params['name']);
    $phone = sanitize_text_field($params['phone']);
    $date = sanitize_text_field($params['date']);
    $time = sanitize_text_field($params['time']);
    $specialty = sanitize_text_field($params['specialty']);

    // Отправка email или сохранение в базу данных
    $to = get_option('admin_email');
    $subject = 'Новая заявка на прием';
    $message = "Имя: $name\nТелефон: $phone\nДата: $date\nВремя: $time\nСпециальность: $specialty";

    wp_mail($to, $subject, $message);

    return array('success' => true, 'message' => 'Заявка отправлена');
}

function handle_callback_form($request) {
    $params = $request->get_json_params();

    // Аналогично обработке формы бронирования
    $name = sanitize_text_field($params['name']);
    $phone = sanitize_text_field($params['phone']);

    $to = get_option('admin_email');
    $subject = 'Заявка на обратный звонок';
    $message = "Имя: $name\nТелефон: $phone";

    wp_mail($to, $subject, $message);

    return array('success' => true, 'message' => 'Заявка отправлена');
}

// 4. Вспомогательные функции
function get_post_thumbnail_data($post_id) {
    $thumbnail_id = get_post_thumbnail_id($post_id);
    if (!$thumbnail_id) return array();

    $thumbnail = wp_get_attachment_image_src($thumbnail_id, 'full');
    $thumbnail_medium = wp_get_attachment_image_src($thumbnail_id, 'medium');

    return array(array(
        'id' => $thumbnail_id,
        'source_url' => $thumbnail[0],
        'media_details' => array(
            'sizes' => array(
                'medium' => array(
                    'source_url' => $thumbnail_medium[0],
                    'width' => $thumbnail_medium[1],
                    'height' => $thumbnail_medium[2]
                ),
                'full' => array(
                    'source_url' => $thumbnail[0],
                    'width' => $thumbnail[1],
                    'height' => $thumbnail[2]
                )
            )
        )
    ));
}

// 5. Добавляем CORS headers
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: *');
        return $value;
    });
});

// 6. ACF поля (добавьте через интерфейс ACF или кодом)
function register_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        // Поля для главной страницы
        acf_add_local_field_group(array(
            'key' => 'group_home_page',
            'title' => 'Главная страница',
            'fields' => array(
                array(
                    'key' => 'field_home_blocks',
                    'label' => 'Блоки',
                    'name' => 'add_block',
                    'type' => 'flexible_content',
                    'layouts' => array(
                        array(
                            'key' => 'layout_hero',
                            'name' => 'hero_section',
                            'label' => 'Hero секция',
                            'fields' => array(
                                array('key' => 'field_hero_title', 'label' => 'Заголовок', 'name' => 'hero_title', 'type' => 'text'),
                                array('key' => 'field_hero_subtitle', 'label' => 'Подзаголовок', 'name' => 'hero_subtitle', 'type' => 'textarea')
                            )
                        ),
                        array(
                            'key' => 'layout_services',
                            'name' => 'about_services',
                            'label' => 'Секция услуг',
                            'fields' => array(
                                array('key' => 'field_services_title', 'label' => 'Заголовок', 'name' => 'title', 'type' => 'text'),
                                array('key' => 'field_services_services', 'label' => 'Услуги', 'name' => 'services', 'type' => 'relationship', 'post_type' => array('services'))
                            )
                        ),
                        array(
                            'key' => 'layout_doctors',
                            'name' => 'home_doctors',
                            'label' => 'Секция врачей',
                            'fields' => array(
                                array('key' => 'field_doctors_title', 'label' => 'Заголовок', 'name' => 'title', 'type' => 'text'),
                                array('key' => 'field_doctors_doctors', 'label' => 'Врачи', 'name' => 'home_doctors_add', 'type' => 'relationship', 'post_type' => array('doctors'))
                            )
                        )
                    ),
                    'location' => array(
                        array(
                            array('param' => 'page', 'operator' => '==', 'value' => 'golovna')
                        )
                    )
                )
            )
        ));

        // Поля для страницы контактов
        acf_add_local_field_group(array(
            'key' => 'group_contacts',
            'title' => 'Контактная информация',
            'fields' => array(
                array('key' => 'field_location', 'label' => 'Адрес', 'name' => 'location', 'type' => 'group'),
                array('key' => 'field_phone', 'label' => 'Телефоны', 'name' => 'phone', 'type' => 'repeater'),
                array('key' => 'field_email', 'label' => 'Email', 'name' => 'email', 'type' => 'group'),
                array('key' => 'field_social', 'label' => 'Соцсети', 'name' => 'social', 'type' => 'repeater')
            ),
            'location' => array(
                array(
                    array('param' => 'page', 'operator' => '==', 'value' => 'contacts')
                )
            )
        ));
    }
}
add_action('acf/init', 'register_acf_fields');

?>








