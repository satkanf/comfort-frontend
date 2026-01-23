<?php
/**
 * Plugin Name: Polylang REST API Extended
 * Description: Extends REST API with Polylang multilingual support
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

class Polylang_REST_API_Extended {
    
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
        add_filter('rest_prepare_post', [$this, 'add_translation_data'], 10, 3);
        add_filter('rest_prepare_page', [$this, 'add_translation_data'], 10, 3);
        add_filter('rest_post_query', [$this, 'filter_query_by_language'], 10, 2);
        add_filter('rest_page_query', [$this, 'filter_query_by_language'], 10, 2);
    }
    
    // Регистрируем кастомные маршруты
    public function register_routes() {
        // Получить все языки
        register_rest_route('polylang/v2', '/languages', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_languages'],
                'permission_callback' => '__return_true'
            ]
        ]);
        
        // Получить переводы конкретного поста/страницы
        register_rest_route('polylang/v2', '/translations/(?P<id>\d+)', [
            [
                'methods' => 'GET',
                'callback' => [$this, 'get_translations'],
                'permission_callback' => '__return_true',
                'args' => [
                    'id' => [
                        'validate_callback' => function($param) {
                            return is_numeric($param);
                        }
                    ]
                ]
            ]
        ]);
    }
    
    // Получаем список языков
    public function get_languages() {
        if (!function_exists('pll_languages_list')) {
            return new WP_Error('polylang_not_active', 'Polylang is not active', ['status' => 404]);
        }
        
        $languages = pll_languages_list(['fields' => '']);
        $result = [];
        
        foreach ($languages as $language) {
            $result[] = [
                'id' => $language->term_id,
                'name' => $language->name,
                'slug' => $language->slug,
                'locale' => $language->locale,
                'description' => $language->description,
                'is_default' => isset($language->is_default) ? $language->is_default : false,
                'flag' => $this->get_flag_url($language),
                'home_url' => pll_home_url($language->slug),
                'code' => $language->slug
            ];
        }
        
        return $result;
    }
    
    // Получаем переводы
    public function get_translations($request) {
        $post_id = $request['id'];
        $post_type = get_post_type($post_id);
        
        if (!$post_type) {
            return new WP_Error('post_not_found', 'Post not found', ['status' => 404]);
        }
        
        $translations = [];
        
        if (function_exists('pll_get_post_translations')) {
            $post_translations = pll_get_post_translations($post_id);
            
            foreach ($post_translations as $lang => $translation_id) {
                if ($translation_id != $post_id) {
                    $post = get_post($translation_id);
                    if ($post) {
                        $translations[] = [
                            'id' => $translation_id,
                            'lang' => $lang,
                            'slug' => $post->post_name,
                            'title' => $post->post_title,
                            'link' => get_permalink($translation_id),
                            'type' => $post_type
                        ];
                    }
                }
            }
        }
        
        return [
            'id' => $post_id,
            'type' => $post_type,
            'current_language' => function_exists('pll_get_post_language') ? 
                pll_get_post_language($post_id) : null,
            'translations' => $translations
        ];
    }
    
    // Добавляем данные о переводах к ответу API
    public function add_translation_data($response, $post, $request) {
        if (function_exists('pll_get_post_translations')) {
            $translations = pll_get_post_translations($post->ID);
            $language = pll_get_post_language($post->ID);
            
            $response->data['polylang'] = [
                'language' => $language,
                'translations' => []
            ];
            
            foreach ($translations as $lang => $post_id) {
                if ($post_id != $post->ID) {
                    $translation_post = get_post($post_id);
                    if ($translation_post) {
                        $response->data['polylang']['translations'][$lang] = [
                            'id' => $post_id,
                            'slug' => $translation_post->post_name,
                            'title' => $translation_post->post_title,
                            'link' => get_permalink($post_id)
                        ];
                    }
                }
            }
        }
        
        return $response;
    }
    
    // Фильтруем запросы по языку
    public function filter_query_by_language($args, $request) {
        $lang = $request->get_param('lang');
        
        if ($lang && function_exists('pll_get_post')) {
            if (!isset($args['tax_query'])) {
                $args['tax_query'] = ['relation' => 'AND'];
            }
            
            $args['tax_query'][] = [
                'taxonomy' => 'language',
                'field' => 'slug',
                'terms' => $lang
            ];
        }
        
        return $args;
    }
    
    // Получаем URL флага
    private function get_flag_url($language) {
        if (isset($language->flag_url) && $language->flag_url) {
            return $language->flag_url;
        }
        
        if (isset($language->flag) && $language->flag) {
            $upload_dir = wp_upload_dir();
            return $upload_dir['baseurl'] . '/polylang/' . $language->flag;
        }
        
        return null;
    }
}

new Polylang_REST_API_Extended();