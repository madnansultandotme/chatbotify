<div class="wrap">
    <h1>ChatBotify Settings</h1>
    <form method="post" action="options.php">
        <?php settings_fields('chatbotify_settings'); ?>
        <?php do_settings_sections('chatbotify_settings'); ?>
        <table class="form-table">
            <tr>
                <th scope="row"><label for="chatbotify_api_key">API Key</label></th>
                <td><input type="text" id="chatbotify_api_key" name="chatbotify_api_key" 
                           value="<?php echo esc_attr(get_option('chatbotify_api_key')); ?>" /></td>
            </tr>
            <tr>
                <th scope="row"><label for="chatbotify_theme_color">Theme Color</label></th>
                <td><input type="text" id="chatbotify_theme_color" name="chatbotify_theme_color" 
                           value="<?php echo esc_attr(get_option('chatbotify_theme_color')); ?>" /></td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div>
