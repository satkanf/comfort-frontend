<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'satkans1_db_comfort' );

/** Database username */
define( 'DB_USER', 'satkans1_admin' );

/** Database password */
define( 'DB_PASSWORD', 'zsr+sOuKFg}MT,#t' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '(W)Z4wPYRz#2xr0dSCg.1$^R!z)}=#!.3VTYuo.AysW&%P<3HA6-_*EvItvSATT)' );
define( 'SECURE_AUTH_KEY',  'S)%V1RkxJIQ*Q9j%1%h k%`(.SwNn 9F_-24k*98s#Qw:xH1@2VOAhe+(`(HOx-z' );
define( 'LOGGED_IN_KEY',    '?p|Gee<#3nzkmZ7uS>Uc9/9eJ{s%|@lO]Z}R:aV9Y9aXU8P>`X=k>qCu|PxHy;N~' );
define( 'NONCE_KEY',        '7MyK $tc~F21GpJ/~pY6Kb^BilwccCfCW_/ZSwW/*kWSsAku-nW{aGfcOU(suQ=Y' );
define( 'AUTH_SALT',        's=`i4^*%38jhz(TOn7(e%*fkA,:s?,`+yG;?%ec[O8^w[XGVrX>x=8F/?;Yx/10`' );
define( 'SECURE_AUTH_SALT', 'Sh%@5DyV$1:M<g~p-P+BT3bvZhSTf_.t:>Mr!NP)$M7,/)y(M;q9x{KuN1]CEzUt' );
define( 'LOGGED_IN_SALT',   'w~i9<)_lHhH>;:zV|PxZhP;GaQC?b%Tq`qFupX-~F3:L=6dH$,0&Da}A3>/`NxBQ' );
define( 'NONCE_SALT',       '=m| (Jpb*_|0!NZ-;>M-b:2fae?oOWGZQ:2MOU)u .?/!ELpI2t(MNPZn17qENh=' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';



define('JWT_AUTH_SECRET_KEY', 'u9rDN31{=MD}eA!tZi9dG,bC]^yI6>tp7I>N!cHN&8AB(X[D)17pd9INC8|5T)u5');
define('JWT_AUTH_CORS_ENABLE', true);


