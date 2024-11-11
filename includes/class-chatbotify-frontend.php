<?php
class ChatBotify_Frontend {
    public static function init() {
        add_shortcode('chatbotify', [__CLASS__, 'render_chatbot']);
        add_action('wp_enqueue_scripts', [__CLASS__, 'enqueue_assets']);
    }
    
    public static function enqueue_assets() {
        wp_enqueue_style('chatbotify-frontend', plugins_url('../assets/css/chatbotify-frontend.css', __FILE__));
        wp_enqueue_script('chatbotify-frontend', plugins_url('../assets/js/chatbotify-frontend.js', __FILE__), ['jquery'], null, true);
        wp_enqueue_script('jquery');
        wp_localize_script('chatbotify-frontend', 'chatbotify_ajax', [
            'ajax_url' => admin_url('admin-ajax.php')
        ]);
    }
    
    public static function render_chatbot() {
    ob_start(); 
    ?>
    <div class="chatbot-container">
        <div class="chatbot-header">
            <div class="chatbot-status">
                <span class="status-dot"></span>
                <span class="status-text">AI Assistant</span>
            </div>
            <div class="chatbot-controls">
                <button class="minimize-btn">−</button>
                <button class="maximize-btn">□</button>
            </div>
        </div>
        <div class="chatbot-messages-container">
            <div id="chatbot-messages">
                <div class="message ai-message">
                    <div class="message-content">
                        <div class="avatar">AI</div>
                        <div class="text">Hello! How can I help you today?</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chatbot-input-area">
            <textarea id="chatbot-input" placeholder="Type your message..." rows="1"></textarea>
            <button id="chatbot-send">
                <svg viewBox="0 0 24 24" class="send-icon">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
            </button>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
}