<?php
/*
Plugin Name: ChatBotify
Description: Adds an AI-powered chatbot to your WordPress site.
Version: 1.0
Author: Team Zeppelin
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Include necessary files
include_once plugin_dir_path(__FILE__) . 'includes/class-chatbotify-settings.php';
include_once plugin_dir_path(__FILE__) . 'includes/class-chatbotify-api.php';
include_once plugin_dir_path(__FILE__) . 'includes/class-chatbotify-frontend.php';
// add_action('wp_ajax_chatbotify_get_response', 'chatbotify_get_response');
// add_action('wp_ajax_nopriv_chatbotify_get_response', 'chatbotify_get_response');

// function chatbotify_get_response() {
//     $message = sanitize_text_field($_POST['message']);
//     $response = ChatBotify_API::get_response($message);
//     echo $response;
//     wp_die();
// }
add_action('wp_ajax_chatbotify_get_response', 'chatbotify_get_response_callback');
add_action('wp_ajax_nopriv_chatbotify_get_response', 'chatbotify_get_response_callback'); // For non-logged-in users

function chatbotify_get_response_callback() {
    // Get the message from the AJAX request
    $message = sanitize_text_field($_POST['message']);

    // Get the response from the OpenAI API
    $response = ChatBotify_API::get_response($message);

    // Return the response to the frontend
    echo $response;

    // Always call wp_die() after an AJAX request
    wp_die();
}

// Initialize settings and frontend
ChatBotify_Settings::init();
ChatBotify_Frontend::init();
