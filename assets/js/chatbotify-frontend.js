jQuery(document).ready(function($) {
    // Cache DOM elements
    const chatContainer = $('.chatbot-container');
    const messagesContainer = $('#chatbot-messages');
    const inputField = $('#chatbot-input');
    const sendButton = $('#chatbot-send');
    const minimizeBtn = $('.minimize-btn');
    
    let isMinimized = false;
    let typingTimer = null;
    const loadingIndicator = '<div class="message ai-message"><div class="message-content"><div class="avatar">AI</div><div class="text typing-indicator"><span></span><span></span><span></span></div></div></div>';

    // Initialize the chat
    function initChat() {
        inputField.prop('disabled', false);
        sendButton.prop('disabled', true);
        console.log("Chatbot frontend initialized.");
        scrollToBottom();
    }

    // Handle minimizing/maximizing the chat window
    minimizeBtn.on('click', function() {
        isMinimized = !isMinimized;
        chatContainer.toggleClass('minimized');
        $(this).text(isMinimized ? '+' : '−');
    });

    // Enable/disable send button based on input
    inputField.on('input', function() {
        const inputVal = $(this).val();
        const shouldEnable = inputVal.trim().length > 0;
        sendButton.prop('disabled', !shouldEnable);
    });

    // Format and display messages
    function addMessage(message, type = 'user') {
        const avatar = type === 'user' ? 'You' : 'AI';
        const messageHtml = `
            <div class="message ${type}-message">
                <div class="message-content">
                    <div class="avatar">${avatar}</div>
                    <div class="text">${message}</div>
                </div>
            </div>
        `;
        messagesContainer.append(messageHtml);
        scrollToBottom();
    }

    // Add typing indicator
    function showTypingIndicator() {
        messagesContainer.append(loadingIndicator);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        messagesContainer.find('.typing-indicator').parent().parent().remove();
    }

    // Scroll to bottom of messages
    function scrollToBottom() {
        const container = $('.chatbot-messages-container');
        container.scrollTop(container[0].scrollHeight);
    }

    // Handle sending messages
    function sendMessage() {
        const message = inputField.val().trim();
        if (!message) return;

        // Display user message
        addMessage(message, 'user');
        inputField.val('');
        sendButton.prop('disabled', true);

        // Show typing indicator
        showTypingIndicator();

        // Send message to server
        $.post(chatbotify_ajax.ajax_url, {
            action: 'chatbotify_get_response',
            message: message
        })
        .done(function(response) {
            console.log("Server Response:", response);
            removeTypingIndicator();
            
            // Add slight delay to simulate natural conversation
            setTimeout(() => {
                addMessage(response, 'ai');
            }, 500);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX Request Failed:", textStatus, errorThrown);
            removeTypingIndicator();
            addMessage("I apologize, but I'm having trouble connecting right now. Please try again.", 'ai');
        });
    }

    // Event Listeners
    sendButton.on('click', sendMessage);

    inputField.on('keypress', function(e) {
        if (e.which === 13 && !sendButton.prop('disabled')) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle window resize
    $(window).on('resize', function() {
        if ($(window).width() <= 480) {
            chatContainer.removeClass('minimized');
            isMinimized = false;
            minimizeBtn.text('−');
        }
    });

    // Initialize the chat
    initChat();
});

// Add CSS for typing indicator animation
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        background-color: #e2e8f0 !important;
        padding: 12px 16px !important;
    }
    .typing-indicator span {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #94a3b8;
        border-radius: 50%;
        margin: 0 2px;
        animation: typing 1.4s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
`;
document.head.appendChild(style);