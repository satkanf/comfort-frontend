<?php
/**
 * comfort clinik functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package comfort_clinik
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function comfort_clinik_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on comfort clinik, use a find and replace
		* to change 'comfort-clinik' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'comfort-clinik', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'comfort-clinik' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'comfort_clinik_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'comfort_clinik_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function comfort_clinik_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'comfort_clinik_content_width', 640 );
}
add_action( 'after_setup_theme', 'comfort_clinik_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function comfort_clinik_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'comfort-clinik' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'comfort-clinik' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'comfort_clinik_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function comfort_clinik_scripts() {
	wp_enqueue_style( 'comfort-clinik-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'comfort-clinik-style', 'rtl', 'replace' );

	wp_enqueue_script( 'comfort-clinik-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'comfort_clinik_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

register_post_type('doctorss', [
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
]);
add_filter('acf/rest_api/field_settings/show_in_rest', '__return_true');
add_filter('acf/rest_api/field_settings/schema', '__return_true');

function polilang_translate_string(){
   
}

if( function_exists('acf_add_options_page') ) {
    
    $languages = array( 'uk' , 'ru' );
    foreach ( $languages as $lang ) {
      acf_add_options_page( array(
        'page_title' => 'Site Options (' . strtoupper( $lang ) . ')',
        'menu_title' => __('Site Options (' . strtoupper( $lang ) . ')', 'text-domain'),
        'menu_slug'  => "site-options-${lang}",
        'post_id'    => $lang
      ) );
    }
  }
  
// add_action('rest_api_init', function () {
//     register_rest_route('custom/v1', '/strings', [
//         'methods' => 'GET',
//         'callback' => function () {
//             global $wpdb;
//             $table = $wpdb->prefix . 'wp_polylang_strings'; // название таблицы может отличаться
//             $results = $wpdb->get_results("SELECT * FROM $table", ARRAY_A);
//             return $results;
//         },
//         'permission_callback' => '__return_true', // для публичного доступа, или добавь проверку
//     ]);
// });
// add_action('rest_api_init', function () {
//     register_rest_route('custom/v1', '/acf-field-group/(?P<id>\d+)', [
//         'methods' => 'GET',
//         'callback' => function ($request) {
//             $id = $request['id'];
            
//             // Получаем ACF поля по ID группы
//             if (!function_exists('get_fields')) {
//                 return new WP_Error('acf_not_found', 'ACF не установлен', ['status' => 500]);
//             }

//             $fields = get_fields($id); // Получаем все поля группы по ID
//             if (!$fields) {
//                 return new WP_Error('no_fields', 'Поля не найдены', ['status' => 404]);
//             }

//             return $fields;
//         },
//         'permission_callback' => '__return_true', // публичный доступ, можно добавить проверку
//     ]);
// });

// В functions.php или отдельном плагине добавить:

// Включаем REST API для меню
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_menus_data',
        'permission_callback' => '__return_true'
    ));
});

function get_menus_data() {
    $menus = wp_get_nav_menus();
    $data = array();
    
    foreach ($menus as $menu) {
        $data[] = array(
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'items' => wp_get_nav_menu_items($menu->term_id)
        );
    }
    
    return $data;
}

// Кастомные эндпоинты для страниц
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'get_page_by_slug',
        'permission_callback' => '__return_true'
    ));
});

function get_page_by_slug($data) {
    $slug = $data['slug'];
    $lang = isset($_GET['lang']) ? $_GET['lang'] : 'uk';
    
    // Получаем страницу по slug с учетом языка
    $page = get_page_by_path($slug, OBJECT, 'page');
    
    if (!$page) {
        return new WP_Error('no_page', 'Page not found', array('status' => 404));
    }
    
    return array(
        'id' => $page->ID,
        'title' => get_the_title($page->ID),
        'content' => apply_filters('the_content', $page->post_content),
        'acf' => get_fields($page->ID),
        'lang' => $lang
    );
}

// Добавляем колонку для таксономии
add_filter('manage_doctors_posts_columns', 'add_taxonomy_column');
function add_taxonomy_column($columns) {
    // Замените 'your_cpt' на слаг вашего типа записи
    
    $new_columns = array();
    
    foreach($columns as $key => $title) {
        $new_columns[$key] = $title;
        
        // Добавляем колонку таксономии после заголовка
        if($key == 'title') {
            $new_columns['cat'] = 'Категорія'; // Название колонки
            // Или для нескольких таксономий:
            // $new_columns['category'] = 'Категории';
            // $new_columns['tag'] = 'Метки';
        }
    }
    
    return $new_columns;
}

// Заполняем колонку данными из таксономии
add_action('manage_doctors_posts_custom_column', 'fill_taxonomy_column', 10, 2);
function fill_taxonomy_column($column, $post_id) {
    if($column == 'cat') {
        // Замените 'genre' на слаг вашей таксономии
        $terms = get_the_terms($post_id, 'category-doctors');
        
        if(!empty($terms) && !is_wp_error($terms)) {
            $term_links = array();
            
            foreach($terms as $term) {
                // Ссылка на отфильтрованные записи по таксономии
                $term_links[] = sprintf(
                    '<a href="%s">%s</a>',
                    esc_url(add_query_arg(array(
                        'post_type' => get_post_type($post_id),
                        'category-doctors' => $term->slug
                    ), 'edit.php')),
                    esc_html($term->name)
                );
            }
            
            echo implode(', ', $term_links);
        } else {
            echo '<span style="color:#999">— Не указано —</span>';
        }
    }
}




// Разрешить все CORS запросы
add_action('init', 'handle_cors');
function handle_cors() {
    // Удалить существующие заголовки, если они есть
    header_remove();
    
    // Установить CORS заголовки
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: false");
    header("Access-Control-Max-Age: 86400"); // 24 часа
    
    // Обработка предварительного запроса (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}

// Для REST API WordPress
add_action('rest_api_init', 'add_cors_headers_to_rest_api');
function add_cors_headers_to_rest_api() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: false');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        return $value;
    });
}






// functions.php

// Мультиязычный endpoint для страниц
add_action('rest_api_init', function () {
    register_rest_route('multilang/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', array(
        'methods' => 'GET',
        'callback' => 'get_multilang_page',
        'permission_callback' => '__return_true'
    ));
});

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
    
    $response = array(
        'id' => $page->ID,
        'title' => array('rendered' => get_the_title($page->ID)),
        'content' => array('rendered' => apply_filters('the_content', $page->post_content)),
        'acf' => $acf_data,
        '_embedded' => $embedded,
        'lang' => $lang
    );
    
    return new WP_REST_Response($response, 200);
}

// Endpoint для переводов
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/translations/(?P<lang>[a-z]{2})', array(
        'methods' => 'GET',
        'callback' => 'get_translations',
        'permission_callback' => '__return_true'
    ));
});

function get_translations($request) {
    $lang = $request->get_param('lang');
    
    // Здесь можно загрузить переводы из файлов или базы данных
    // Пока возвращаем пустой объект - фронтенд будет использовать дефолтные переводы
    $translations = array();
    
    return new WP_REST_Response($translations, 200);
}

// Добавляем параметр lang к стандартным WP REST API
add_filter('rest_services_query', 'add_lang_param_to_services', 10, 2);
function add_lang_param_to_services($args, $request) {
    if ($request->get_param('lang')) {
        // Здесь можно добавить логику фильтрации по языку
        // Для Polylang: $args['lang'] = $request->get_param('lang');
    }
    return $args;
}

// Аналогично для doctors
add_filter('rest_doctors_query', 'add_lang_param_to_doctors', 10, 2);
function add_lang_param_to_doctors($args, $request) {
    if ($request->get_param('lang')) {
        // Логика фильтрации по языку
    }
    return $args;
}

// Вспомогательная функция для получения thumbnail данных
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