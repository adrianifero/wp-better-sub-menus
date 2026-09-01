<?php
/**
 * Plugin Name: WP Better Sub Menus
 * Plugin URI:  https://wordpress.org/plugins/wp-better-sub-menus/
 * Description: Collapse and expand nested items on Appearance → Menus so large menus stay easy to edit.
 * Version:     1.1.0
 * Author:      Adrian Toro
 * Author URI:  https://adriantoro.com
 * Text Domain: wp-better-nav
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Tested up to: 7.1
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin UX improvements for the nav menus screen.
 */
final class WP_Better_Sub_Menus {

	const VERSION = '1.1.0';

	/**
	 * Bootstrap hooks.
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
	}

	/**
	 * Load CSS/JS only on Appearance → Menus.
	 *
	 * @param string $hook_suffix Current admin page hook.
	 */
	public function enqueue_admin_assets( $hook_suffix ) {
		if ( 'nav-menus.php' !== $hook_suffix ) {
			return;
		}

		wp_enqueue_style(
			'wp-better-sub-menus-admin',
			plugins_url( 'css/wpbetternav.admin.css', __FILE__ ),
			array(),
			self::VERSION
		);

		wp_enqueue_script(
			'wp-better-sub-menus-admin',
			plugins_url( 'js/wpbetternav.admin.js', __FILE__ ),
			array( 'jquery' ),
			self::VERSION,
			true
		);

		wp_localize_script(
			'wp-better-sub-menus-admin',
			'wpBetterSubMenus',
			array(
				'collapseLabel' => __( 'Collapse submenu', 'wp-better-nav' ),
				'expandLabel'   => __( 'Expand submenu', 'wp-better-nav' ),
			)
		);
	}
}

new WP_Better_Sub_Menus();
