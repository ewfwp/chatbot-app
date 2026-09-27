<?php

if (!defined('ABSPATH')) {
  exit;
}

class EWFWP_Example_Widget extends \Elementor\Widget_Base {
  public function get_name(): string {
    return 'ewfwp-example-app';
  }

  public function get_title(): string {
    return esc_html__('Example applicatie', 'ewfwp-example-app');
  }

  public function get_icon(): string {
    return 'eicon-site-identity';
  }

  public function get_categories(): array {
    return ['ewfwp-widgets'];
  }

  public function get_script_depends(): array {
    return ['ewfwp-example-app-script'];
  }

  public function get_style_depends(): array {
    return ['ewfwp-example-app-style'];
  }

  protected function register_controls(): void {
    // Momenteel geen configureerbare Elementor controls.
  }

  protected function render(): void {
    echo '<ewfwp-example-app></ewfwp-example-app>';
  }

  /**
   * Preview die Elementor direct in de editor kan renderen.
   */
  protected function content_template(): void
  {
    ?>
      <ewfwp-example-app></ewfwp-example-app>
    <?php
  }
}
