<?php

add_action('rest_api_init', function () {

    // /wp-json/custom/v1/page/{slug}
    register_rest_route('custom/v1', '/page/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods'  => 'GET',
        'callback' => 'get_page_by_slug'
    ]);

});

function get_page_by_slug(WP_REST_Request $request) {

    // Получаем слаг из URL
    $slug = $request->get_param('slug');

    // Ищем страницу по слагу
    $page = get_page_by_path($slug);

    if (!$page) {
        return new WP_Error(
            'not_found',
            'Page not found',
            ['status' => 404]
        );
    }

    $page_id = $page->ID;

    return [
        'id'      => $page_id,
        'slug'    => $slug,
        'title'   => get_the_title($page_id),
        'content' => apply_filters('the_content', get_post_field('post_content', $page_id)),

        // ACF если есть
        'acf'     => function_exists('get_fields') ? get_fields($page_id) : null,
    ];
}
