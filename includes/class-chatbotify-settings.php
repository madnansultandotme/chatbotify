<?php
class ChatBotify_Settings {
    public static function init() {
        add_action('admin_menu', [__CLASS__, 'add_admin_page']);
        add_action('admin_init', [__CLASS__, 'register_settings']);
    }

    public static function add_admin_page() {
        add_menu_page(
            'ChatBotify Settings', 'ChatBotify', 'manage_options', 
            'chatbotify', [__CLASS__, 'settings_page'], 'dashicons-format-chat'
        );
    }

    public static function register_settings() {
        register_setting('chatbotify_settings', 'chatbotify_api_key');
        register_setting('chatbotify_settings', 'chatbotify_theme_color');
    }

    public static function settings_page() {
        include plugin_dir_path(__FILE__) . '../admin/templates/chatbotify-settings-template.php';
    }
}
