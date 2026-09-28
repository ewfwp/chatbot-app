<?php

if (!defined('ABSPATH')) {
  exit;
}

class EWFWP_Chatbot_Widget extends \Elementor\Widget_Base {
  public function get_name(): string {
    return 'ewfwp-chatbot-app';
  }

  public function get_title(): string {
    return esc_html__('Chatbot applicatie', 'ewfwp-chatbot-app');
  }

  public function get_icon(): string {
    return 'eicon-site-identity';
  }

  public function get_categories(): array {
    return ['ewfwp-widgets'];
  }

  public function get_script_depends(): array {
    return ['ewfwp-chatbot-app-script'];
  }

  public function get_style_depends(): array {
    return ['ewfwp-chatbot-app-style'];
  }

  protected function register_controls(): void {
    // Momenteel geen configureerbare Elementor controls.
  }

  protected function render(): void {
    echo '<ewfwp-chatbot-app></ewfwp-chatbot-app>';
  }

  /**
   * Preview die Elementor direct in de editor kan renderen.
   */
  protected function content_template(): void
  {
    ?>
      <ewfwp-chatbot-app></ewfwp-chatbot-app>
    <?php
  }
}
