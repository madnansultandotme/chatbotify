jQuery(document).ready(function($) {
    // Cache DOM elements
    const chatContainer = $('.chatbot-container');
    const messagesContainer = $('#chatbot-messages');
    const inputField = $('#chatbot-input');
    const sendButton = $('#chatbot-send');
    const minimizeBtn = $('.minimize-btn');
    const maximizeBtn = $('.maximize-btn');
    
    let isMinimized = false;
    let isMaximized = false;
    let typingTimer = null;
    let originalDimensions = {
        width: chatContainer.width(),
        height: chatContainer.height(),
        right: '20px',
        bottom: '20px'
    };
    
    const loadingIndicator = '<div class="message ai-message"><div class="message-content"><div class="avatar">AI</div><div class="text typing-indicator"><span></span><span></span><span></span></div></div></div>';

    // Initialize the chat
    function initChat() {
        inputField.prop('disabled', false);
        sendButton.prop('disabled', true);
        console.log("Chatbot frontend initialized.");
        scrollToBottom();
    }

    // Handle window states (minimize/maximize)
    function updateWindowState(state) {
        switch(state) {
            case 'minimize':
                isMinimized = true;
                isMaximized = false;
                chatContainer.addClass('minimized').removeClass('maximized');
                minimizeBtn.text('+');
                maximizeBtn.text('□');
                break;
            case 'maximize':
                isMinimized = false;
                isMaximized = true;
                chatContainer.removeClass('minimized').addClass('maximized');
                minimizeBtn.text('−');
                maximizeBtn.text('❐');
                break;
            case 'restore':
                isMinimized = false;
                isMaximized = false;
                chatContainer.removeClass('minimized maximized');
                minimizeBtn.text('−');
                maximizeBtn.text('□');
                break;
        }
    }

    // Handle minimizing/maximizing the chat window
    minimizeBtn.on('click', function() {
        if (isMinimized) {
            updateWindowState('restore');
        } else {
            updateWindowState('minimize');
        }
    });

    // Handle maximize/restore
    maximizeBtn.on('click', function() {
        if (isMaximized) {
            updateWindowState('restore');
        } else {
            updateWindowState('maximize');
        }
    });

    // Enable/disable send button based on input
    inputField.on('input', function() {
        const inputVal = $(this).val();
        const shouldEnable = inputVal.trim().length > 0;
        sendButton.prop('disabled', !shouldEnable);
        
        // Handle input overflow
        this.style.height = 'auto';
        const newHeight = Math.min(this.scrollHeight, 100); // Max height of 100px
        this.style.height = newHeight + 'px';
    });

    // Format and display messages with overflow handling
    function addMessage(message, type = 'user') {
        const avatar = type === 'user' ? 'You' : 'AI';
        const messageHtml = `
            <div class="message ${type}-message">
                <div class="message-content">
                    <div class="avatar">${avatar}</div>
                    <div class="text">
                        <div class="message-text-content">${message}</div>
                    </div>
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
        inputField.trigger('input'); // Reset input height
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
        if (e.which === 13 && !e.shiftKey && !sendButton.prop('disabled')) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle window resize
    $(window).on('resize', function() {
        if ($(window).width() <= 480) {
            if (!isMaximized) {
                updateWindowState('maximize');
            }
        }
    });

    // Initialize the chat
    initChat();
});