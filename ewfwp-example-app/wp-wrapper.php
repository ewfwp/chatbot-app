<?php
/**
 * Plugin Name: EWFWP Example Widget
 * Description: Example Widget ontwikkeld voor WordPress met Elementor ondersteuning.
 * Version: 1.0.0
 * Author: Aaron Weggemans
 */

if (!defined('ABSPATH')) {
  exit;
}

/**
 * Registreer de Angular JavaScript- en CSS-bestanden.
 */
function ewfwp_register_widget_assets(): void {
  $handle = 'ewfwp-example-app';

  $script_path = plugin_dir_path(__FILE__) . 'web-component/web-component.js';
  $style_path  = plugin_dir_path(__FILE__) . 'web-component/assets/styles.css';

  $script_url = plugins_url('web-component/web-component.js', __FILE__);
  $style_url  = plugins_url('web-component/assets/styles.css', __FILE__);

  if (file_exists($script_path)) {
    wp_register_script($handle . '-script', $script_url, [], (string) filemtime($script_path), true);
  }

  if (file_exists($style_path)) {
    wp_register_style($handle . '-style', $style_url, [], (string) filemtime($style_path));
  }
}

add_action('wp_enqueue_scripts', 'ewfwp_register_widget_assets');
add_action('elementor/frontend/after_register_scripts', 'ewfwp_register_widget_assets');
add_action('elementor/frontend/after_register_styles', 'ewfwp_register_widget_assets');

/**
 * Registreer EWFWP Elementor categorie.
 */
function ewfwp_register_category($elements_manager): void {
  $elements_manager->add_category(
    'ewfwp-widgets',
    [
      'title' => esc_html__('EWFWP Widgets', 'ewfwp-example-app'),
      'icon'  => 'fa fa-plug',
    ]
  );
}

add_action('elementor/elements/categories_registered', 'ewfwp_register_category');

/**
 * Registreer EWFWP Elementor widget.
 */
function ewfwp_register_widget($widgets_manager): void {
  require_once plugin_dir_path(__FILE__) . 'widgets/widget-config.php';
  $widgets_manager->register(new \EWFWP_Example_Widget());
}

add_action('elementor/widgets/register', 'ewfwp_register_widget');
