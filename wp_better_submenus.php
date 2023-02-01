<?php 
/**
 * Plugin Name: WP Better Sub Menus
 * Description: A better way to display the nav menus in your admin area 
 * Version: 1.0.5
 * Author: Adrian Toro 
 * Domain Path: /languages
 * Text Domain: wp-better-nav

**/

class WPBetterNavMenu {
		
	public function __construct() {
		
		
		// Scripts:
		add_action( 'admin_enqueue_scripts', array($this, 'enqueue_scripts_admin') );
		
		
	}
	public static function enqueue_scripts_admin( $hook_suffix ) {
		
		if ( $hook_suffix === 'nav-menus.php' ){
			
			wp_enqueue_style( 'wpbetternav.style.admin', plugins_url( '/css/wpbetternav.admin.css' , __FILE__ ), array(), '181016v05' );

			wp_enqueue_script( 'wpbetternav.script.admin', plugins_url( '/js/wpbetternav.admin.js' , __FILE__ ), array( 'jquery' ), '230201v02', true );
		}
	}
}

$WPBetterNavMenu = new WPBetterNavMenu();
