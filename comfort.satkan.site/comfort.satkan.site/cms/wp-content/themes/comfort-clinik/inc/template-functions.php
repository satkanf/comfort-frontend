<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package comfort_clinik
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function comfort_clinik_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'comfort_clinik_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function comfort_clinik_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'comfort_clinik_pingback_header' );


add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/booking', [
        'methods'  => 'POST',
        'callback' => 'save_booking_form',
        'permission_callback' => '__return_true'
    ]);
});

function save_booking_form($request) {
    $data = $request->get_json_params();

    $name = sanitize_text_field($data['name'] ?? '');
    $phone = sanitize_text_field($data['phone'] ?? '');
    $date = sanitize_text_field($data['date'] ?? '');
    $time = sanitize_text_field($data['time'] ?? '');
    $specialty = sanitize_text_field($data['specialty'] ?? '');
    $doctor = sanitize_text_field($data['doctorName'] ?? '');

    // Створюємо пост запису
    $post_id = wp_insert_post([
        'post_type'   => 'booking',
        'post_title'  => $name . ' | ' . $phone,
        'post_content'=> "Дата: $date\nЧас: $time\nСпеціаліст: $specialty\nЛікар: $doctor",
        'post_status' => 'publish'
    ]);

    if (!$post_id) {
        return new WP_REST_Response([
            'success' => false, 
            'message' => 'Помилка збереження запису'
        ], 500);
    }

    // Зберігаємо метадані
    update_post_meta($post_id, '_booking_name', $name);
    update_post_meta($post_id, '_booking_phone', $phone);
    update_post_meta($post_id, '_booking_date', $date);
    update_post_meta($post_id, '_booking_time', $time);
    update_post_meta($post_id, '_booking_specialty', $specialty);
    update_post_meta($post_id, '_booking_doctor', $doctor);
    update_post_meta($post_id, '_booking_status', 'pending');
    update_post_meta($post_id, '_booking_created', current_time('mysql'));

    // Відправляємо HTML лист
    $to = "info@satkan.site";
    $subject = "🩺 Новий запис на прийом - " . $name;
    
    $primary_color = "#8c6363";
    $light_bg = "#f9f5f4";
    $border_color = "#e0d6d6";
    $dark_bg = "#2c3e50";
    
    // Форматуємо дату для кращого відображення
    $formatted_date = $date ? date('d.m.Y', strtotime($date)) : $date;
    
    $html_message = '
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Новий запис на прийом - Comfort Clinic</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; line-height: 1.6;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f5f5" style="padding: 20px;">
                <tr>
                    <td align="center">
                        <!-- Основний контейнер -->
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <!-- Шапка -->
                            <tr>
                                <td bgcolor="' . $primary_color . '" style="padding: 30px 20px; text-align: center;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-size: 28px; font-weight: bold; padding-bottom: 10px;">
                                                Comfort Clinic
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: rgba(255,255,255,0.9); font-size: 16px; padding-bottom: 15px;">
                                                🩺 Новий запис на медичний прийом
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Контент -->
                            <tr>
                                <td style="padding: 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <!-- Заголовок -->
                                        <tr>
                                            <td style="padding-bottom: 20px;">
                                                
                                                <p style="margin: 10px 0 0 0; color: #666666; font-size: 16px;">
                                                    Пацієнт записався на прийом через сайт
                                                </p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Основна інформація -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ' . $light_bg . '; border: 1px solid ' . $border_color . '; border-radius: 6px;">
                                                    <tr>
                                                        <td style="padding: 25px;">
                                                            <!-- Ім\'я та телефон -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                                                <tr>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>👤 Пацієнт:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($name) . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>📱 Телефон:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            <a href="tel:' . esc_attr($phone) . '" style="color: ' . $primary_color . '; text-decoration: none;">
                                                                                ' . esc_html($phone) . '
                                                                            </a>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <!-- Дата та час -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                                                <tr>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>📅 Дата прийому:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($formatted_date) . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>🕐 Час прийому:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($time) . '
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <!-- Лікар та спеціальність -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>👨‍⚕️ Лікар:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($doctor) . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>🎯 Спеціальність:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($specialty) . '
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Кнопки дій -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" style="padding-bottom: 15px;">
                                                            <p style="margin: 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                                🔔 Зателефонуйте клієнту для підтвердження
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" width="33%" style="padding: 0 5px;">
                                                                        <a href="tel:' . esc_attr($phone) . '" style="display: inline-block; width: 100%; padding: 12px 15px; background-color: ' . $primary_color . '; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px; text-align: center;">
                                                                            📞 Зателефонувати
                                                                        </a>
                                                                    </td>
                                                                    
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Додаткова інформація -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f8f8; border-radius: 6px; padding: 20px;">
                                                    <tr>
                                                        <td>
                                                            <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                                📊 Інформація про запис:
                                                            </p>
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                      
                                                                    <td width="25%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Час створення:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('H:i:s') . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="25%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Дата:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('d.m.Y') . '
                                                                        </p>
                                                                    </td>
                                                                    
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Футер -->
                            <tr>
                                <td bgcolor="' . $primary_color . '" style="padding: 25px; color: #bdc3c7; font-size: 14px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding-bottom: 15px;">
                                                <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: bold;">
                                                    Comfort Clinic
                                                </p>
                                                
                                                <p style="margin: 5px 0;">
                                                    Сайт: <a href="https://comfort.satkan.site" style="color: #3498db; text-decoration: none;">comfort.satkan.site</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding-top: 15px; border-top: 1px solid #34495e;">
                                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                                    © ' . date('Y') . ' Всі права захищені.<br>
                                                    Це автоматичне повідомлення про новий запис на прийом.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>';
    
    // Налаштування заголовків листа
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: "Comfort Clinic - Записи" <noreply@comfort.satkan.site>',
        'Reply-To: "Comfort Clinic" <info@comfort.satkan.site>',
        'X-Priority: 1',
        'X-MSMail-Priority: High',
        'Importance: High'
    ];
    
    // Відправляємо лист адміністратору
    $mail_sent = wp_mail($to, $subject, $html_message, $headers);
    
    
}

add_action('init', function () {
    register_post_type('booking', [
        'labels' => [
            'name' => 'Записи',
            'singular_name' => 'Запись',
            'add_new' => 'Добавить заявку',
        ],
        'public' => false,
        'show_ui' => false,
        'supports' => ['title', 'editor'],
        'menu_icon' => 'dashicons-calendar-alt',
    ]);
});



add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/callbackform', array(
        'methods'  => 'POST',
        'callback' => 'handle_contact_form_request',
        'permission_callback' => '__return_true'
    ));
});

function handle_contact_form_request(WP_REST_Request $request) {
     $data = $request->get_json_params();
    $name  = sanitize_text_field($data['name']);
    $phone = sanitize_text_field($data['phone']);
    $email  = sanitize_email($data['email']);
    $message_text = sanitize_textarea_field($data['message']);
    
    $to = "satkan.furs@gmail.com";
    $subject = "📧 Нове повідомлення з форми зворотного зв'язку";
    
    $primary_color = "#8c6363";
    $light_bg = "#f9f5f4";
    $border_color = "#e0d6d6";
    $dark_bg = "#2c3e50";
    
    $html_message = '
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Нове повідомлення - Comfort Clinic</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif; line-height: 1.6;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f5f5" style="padding: 20px;">
                <tr>
                    <td align="center">
                        <!-- Основний контейнер -->
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <!-- Шапка -->
                            <tr>
                                <td bgcolor="' . $primary_color . '" style="padding: 30px 20px; text-align: center;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-size: 28px; font-weight: bold; padding-bottom: 10px;">
                                                Comfort Clinic
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: rgba(255,255,255,0.9); font-size: 16px; padding-bottom: 15px;">
                                                Новий запит з форми зворотного зв\'язку
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Контент -->
                            <tr>
                                <td style="padding: 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <!-- Привітання -->
                                        <tr>
                                            <td style="padding-bottom: 20px;">
                                                <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">
                                                    Новий запит від клієнта
                                                </p>
                                                <p style="margin: 10px 0 0 0; color: #666666; font-size: 16px;">
                                                    Клієнт заповнив контактну форму на сайті
                                                </p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Дані клієнта -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ' . $light_bg . '; border: 1px solid ' . $border_color . '; border-radius: 6px;">
                                                    <tr>
                                                        <td style="padding: 25px;">
                                                            <!-- Ім\'я -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                                                <tr>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>👤 Ім\'я:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            ' . esc_html($name) . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="50%" valign="top">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>📱 Телефон:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            <a href="tel:' . esc_attr($phone) . '" style="color: ' . $primary_color . '; text-decoration: none;">
                                                                                ' . esc_html($phone) . '
                                                                            </a>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <!-- Email -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                                                <tr>
                                                                    <td>
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>📧 Email:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                            <a href="mailto:' . esc_attr($email) . '" style="color: ' . $primary_color . '; text-decoration: none;">
                                                                                ' . esc_html($email) . '
                                                                            </a>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                            <!-- Повідомлення -->
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td>
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                            <strong>💬 Повідомлення:</strong>
                                                                        </p>
                                                                        <div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin-top: 10px;">
                                                                            <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                                                                ' . nl2br(esc_html($message_text)) . '
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Кнопки дій -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td align="center" style="padding-bottom: 15px;">
                                                            <p style="margin: 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                                🔔 Оберіть дію для швидкого відгуку
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td align="center" width="50%" style="padding: 0 5px;">
                                                                        <a href="tel:' . esc_attr($phone) . '" style="display: inline-block; width: 100%; padding: 12px 15px; background-color: ' . $primary_color . '; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px; text-align: center;">
                                                                            📞 Зателефонувати
                                                                        </a>
                                                                    </td>
                                                                    <td align="center" width="50%" style="padding: 0 5px;">
                                                                        <a href="mailto:' . esc_attr($email) . '?subject=Відповідь на ваш запит" style="display: inline-block; width: 100%; padding: 12px 15px; background-color: #3498db; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 6px; text-align: center;">
                                                                            📧 Написати email
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Деталі запиту -->
                                        <tr>
                                            <td style="padding-bottom: 25px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f8f8; border-radius: 6px; padding: 20px;">
                                                    <tr>
                                                        <td>
                                                            <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                                📋 Деталі запиту:
                                                            </p>
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td width="33%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Час отримання:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('H:i:s') . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="33%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Дата:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('d.m.Y') . '
                                                                        </p>
                                                                    </td>
                                                                   
                                                                </tr>
                                                                
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Важлива інформація -->
                                        
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Футер -->
                            <tr>
                                <td bgcolor="' . $primary_color . '" style="padding: 25px; color: #bdc3c7; font-size: 14px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding-bottom: 15px;">
                                                <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: bold;">
                                                    Comfort Clinic
                                                </p>
                                               
                                                </p>
                                                <p style="margin: 5px 0;">
                                                    Сайт: <a href="https://comfort.satkan.site" style="color: #3498db; text-decoration: none;">comfort.satkan.site</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding-top: 15px; border-top: 1px solid #34495e;">
                                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                                    © ' . date('Y') . ' Всі права захищені.<br>
                                                    Це автоматичне повідомлення. Будь ласка, не відповідайте на цей лист.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>';
    
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: "Comfort Clinic" <noreply@comfort.satkan.site>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'X-Priority: 1',
        'X-MSMail-Priority: High',
        'Importance: High'
    ];
    
    $mail_sent = wp_mail($to, $subject, $html_message, $headers);
    
    
   
}

add_action('init', function () {
    register_post_type('callbackform', [
        'labels' => [
            'name' => 'Сообщения',
            'singular_name' => 'Сообщения',
            
        ],
        'public' => false,
        'show_ui' => true,
        'supports' => ['title', 'editor'],
        'menu_icon' => 'dashicons-calendar-alt',
    ]);
});



add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/callback', array(
        'methods'  => 'POST',
        'callback' => 'handle_callback_request',
        'permission_callback' => '__return_true'
    ));
});

function handle_callback_request(WP_REST_Request $request) {
    $name  = sanitize_text_field($request['name']);
    $phone = sanitize_text_field($request['phone']);

    $to = "satkan.furs@gmail.com";
    $subject = "Нова заявка на дзвінок - Comfort Clinic";
    
    $primary_color = "#8c6363";
    
    $html_message = '
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Нова заявка - Comfort Clinic</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
        <center>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f5f5f5" style="padding: 20px;">
                <tr>
                    <td align="center">
                        <!-- Основний контейнер -->
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <!-- Шапка -->
                            <tr>
                                <td bgcolor="' . $primary_color . '" style="padding: 30px 20px; text-align: center;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td style="color: #ffffff; font-size: 28px; font-weight: bold; padding-bottom: 10px;">
                                                Comfort Clinic
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="color: rgba(255,255,255,0.9); font-size: 16px; padding-bottom: 15px;">
                                                Нова заявка на зворотний дзвінок
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Контент -->
                            <tr>
                                <td style="padding: 30px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <!-- Привітання -->
                                        <tr>
                                            <td style="padding-bottom: 20px;">
                                                <p style="margin: 0; color: #333333; font-size: 18px; font-weight: bold;">
                                                    Вітаємо!
                                                </p>
                                                <p style="margin: 10px 0 0 0; color: #666666; font-size: 16px;">
                                                    На сайті була залишена нова заявка на зворотний дзвінок.
                                                </p>
                                            </td>
                                        </tr>
                                        
                                        <!-- Дані клієнта -->
                                        <tr>
                                            <td style="padding: 20px; background-color: #f9f5f4; border: 1px solid #e0d6d6; border-radius: 6px; margin-bottom: 20px;">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                    <tr>
                                                        <td style="padding-bottom: 15px;">
                                                            <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                <strong>👤 Ім\'я клієнта:</strong>
                                                            </p>
                                                            <p style="margin: 0; color: ' . $primary_color . '; font-size: 18px; font-weight: bold;">
                                                                ' . esc_html($name ?: 'Не вказано') . '
                                                            </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p style="margin: 0 0 5px 0; color: #666666; font-size: 14px;">
                                                                <strong>📱 Контактний телефон:</strong>
                                                            </p>
                                                            <p style="margin: 0; color: ' . $primary_color . '; font-size: 22px; font-weight: bold;">
                                                                <a href="tel:' . esc_attr($phone) . '" style="color: ' . $primary_color . '; text-decoration: none;">
                                                                    ' . esc_html($phone) . '
                                                                </a>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                        <!-- Кнопка дзвінка -->
                                        <tr>
                                            <td style="padding: 20px 0; text-align: center;">
                                                <p style="margin: 0 0 15px 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                    ⏰ Зателефонуйте клієнту якомога швидше
                                                </p>
                                                <a href="tel:' . esc_attr($phone) . '" style="display: inline-block; padding: 15px 35px; background-color: ' . $primary_color . '; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 6px;">
                                                    📞 Зателефонувати зараз
                                                </a>
                                            </td>
                                        </tr>
                                        
                                        <!-- Деталі -->
                                        <tr>
                                            <td>
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f8f8; border-radius: 6px; padding: 15px;">
                                                    <tr>
                                                        <td>
                                                            <p style="margin: 0 0 10px 0; color: #333333; font-size: 16px; font-weight: bold;">
                                                                📋 Деталі заявки:
                                                            </p>
                                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                                <tr>
                                                                    <td width="50%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Час отримання:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('H:i:s') . '
                                                                        </p>
                                                                    </td>
                                                                    <td width="50%" valign="top" style="padding-bottom: 10px;">
                                                                        <p style="margin: 0 0 5px 0; color: #666666; font-size: 13px;">
                                                                            <strong>Дата:</strong>
                                                                        </p>
                                                                        <p style="margin: 0; color: #333333; font-size: 14px;">
                                                                            ' . date('d.m.Y') . '
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                               
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        
                                       
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Футер -->
                            <tr>
                                <td bgcolor="#8c6363" style="padding: 25px; color: #bdc3c7; font-size: 14px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center" style="padding-bottom: 15px;">
                                                <p style="margin: 5px 0;">
                                                    Сайт: <a href="https://comfort.satkan.site" style="color: #3498db; text-decoration: none;">comfort.satkan.site</a>
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="padding-top: 15px; border-top: 1px solid #34495e;">
                                                <p style="margin: 0; font-size: 12px; color: #95a5a6;">
                                                    © ' . date('Y') . 'Всі права захищені.<br>
                                                    Це автоматичне повідомлення. Будь ласка, не відповідайте на цей лист.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>';
    
    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'From: "Comfort Clinic" <noreply@comfort.satkan.site>',
        'Reply-To: "Comfort Clinic" <info@comfort.satkan.site>',
        'X-Priority: 1',
        'X-MSMail-Priority: High'
    ];
    
    $mail_sent = wp_mail($to, $subject, $html_message, $headers);
    
    return new WP_REST_Response([
        'success' => true,
        'message' => 'Дякуємо за заявку! Ми зв\'яжемося з вами найближчим часом.',
        'data' => ['name' => $name, 'phone' => $phone]
    ], 200);
}

add_action('init', function () {
    register_post_type('callback_requests', [
        'labels' => [
            'name' => 'Звонки',
            'singular_name' => 'Звонок'
        ],
        'public' => false,
        'show_ui' =>false,
        'menu_icon' => 'dashicons-phone',
        'supports' => ['title']
    ]);
});





