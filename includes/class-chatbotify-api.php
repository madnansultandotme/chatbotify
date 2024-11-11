<?php
class ChatBotify_API {
    public static function get_response($message) {
        // Get the OpenAI API key from the plugin settings
        $api_key = get_option('chatbotify_api_key');
        
        // Ensure API key is set
        if (empty($api_key)) {
            return 'API key is missing.';
        }

        // OpenAI chat completions API endpoint
        $url = 'https://api.openai.com/v1/chat/completions';

        // Construct the body for the request
        $body = [
            'model' => 'gpt-3.5-turbo', // Or 'gpt-3.5-turbo' depending on the model you're using
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                ['role' => 'user', 'content' => $message]
            ]
        ];

        // Send the request to OpenAI using wp_remote_post
        $response = wp_remote_post($url, [
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $api_key
            ],
            'body' => json_encode($body),
        ]);

        // Check for errors in the response
        if (is_wp_error($response)) {
            return 'Error retrieving response: ' . $response->get_error_message();
        }

        // Retrieve and decode the response body
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body);

        // Return the chatbot response
        if (isset($data->choices[0]->message->content)) {
            return $data->choices[0]->message->content;
        } else {
            return 'No response from the AI.';
        }
    }
}
