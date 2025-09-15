 class Chatbot {
    constructor() {
        this.messagesArea = document.querySelector('.messages-area');
        this.messageInput = document.querySelector('.message-input');
        this.sendButton = document.querySelector('.send-button');
        this.isTyping = false;
        
        // Check if elements exist
        if (!this.messagesArea || !this.messageInput || !this.sendButton) {
            console.error('Required elements not found! Make sure your HTML has the correct class names.');
            return;
        }
        
        // Initialize the chatbot
        this.init();
        this.clearExampleMessages();
        this.addWelcomeMessage();
    }

    // Initialize event listeners and setup
    init() {
        // Send button click event
        this.sendButton.addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Enter key press event
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Input field events
        this.messageInput.addEventListener('input', () => {
            this.toggleSendButton();
        });

        this.messageInput.addEventListener('focus', () => {
            this.scrollToBottom();
        });
    }

    // Clear example messages from HTML
    clearExampleMessages() {
        this.messagesArea.innerHTML = '';
    }

    // Add welcome message
    addWelcomeMessage() {
        this.addBotMessage("Hello! I'm your chatbot assistant. How can I help you today?");
    }

    // Handle sending user message
    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addUserMessage(message);
        
        // Clear input
        this.messageInput.value = '';
        this.toggleSendButton();

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get bot response
            const response = await this.getBotResponse(message);
            this.addBotMessage(response);
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.addBotMessage("Sorry, I'm having trouble responding right now. Please try again.");
        } finally {
            this.hideTypingIndicator();
        }
    }

    // Add user message to chat
    addUserMessage(message) {
        const messageElement = this.createMessageElement(message, 'user');
        this.messagesArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    // Add bot message to chat
    addBotMessage(message) {
        const messageElement = this.createMessageElement(message, 'bot');
        this.messagesArea.appendChild(messageElement);
        this.scrollToBottom();
    }

    // Create message element
    createMessageElement(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        bubbleDiv.textContent = message;
        
        messageDiv.appendChild(bubbleDiv);
        
        // Add fade-in animation
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        // Animate in
        requestAnimationFrame(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        });
        
        return messageDiv;
    }

    // Show typing indicator
    showTypingIndicator() {
        this.isTyping = true;
        this.sendButton.disabled = true;
        this.sendButton.textContent = '...';
        
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing-indicator');
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
        `;
        
        // Add CSS for typing animation if not already present
        this.addTypingCSS();
        
        this.messagesArea.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // Hide typing indicator
    hideTypingIndicator() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        this.sendButton.textContent = 'Send';
        
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Add typing animation CSS
    addTypingCSS() {
        if (document.querySelector('#typing-css')) return;
        
        const style = document.createElement('style');
        style.id = 'typing-css';
        style.textContent = `
            .typing-dots {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .typing-dots .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #999;
                animation: typing 1.4s infinite ease-in-out;
            }
            .typing-dots .dot:nth-child(1) { animation-delay: 0s; }
            .typing-dots .dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots .dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.4;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Get bot response (this is where you'll integrate with AI APIs)
    async getBotResponse(userMessage) {
        // Simulate API delay
        await this.delay(1000 + Math.random() * 2000);
        
        // Simple rule-based responses (replace with AI API)
        return this.getSimpleResponse(userMessage);
    }

    // Simple response logic (replace this with AI API integration)
    getSimpleResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            const greetings = [
                "Hello! How can I help you today?",
                "Hi there! What can I do for you?",
                "Hey! I'm here to assist you.",
                "Hello! Nice to meet you!"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }
        
        // How are you responses
        if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
            const responses = [
                "I'm doing great, thank you for asking! How are you?",
                "I'm functioning perfectly! How can I help you today?",
                "I'm doing well! What would you like to chat about?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Help responses
        if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
            return "I'm here to help! You can ask me questions, have a conversation, or request assistance with various topics. What do you need help with?";
        }
        
        // Name responses
        if (lowerMessage.includes('your name') || lowerMessage.includes('who are you')) {
            return "I'm your friendly chatbot assistant! I'm here to help answer questions and have conversations with you.";
        }
        
        // Thanks responses
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            const responses = [
                "You're welcome! Happy to help!",
                "No problem! Anything else I can do for you?",
                "Glad I could help! Is there anything else you need?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Goodbye responses
        if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
            const responses = [
                "Goodbye! Have a great day!",
                "See you later! Take care!",
                "Bye! Feel free to come back anytime!"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
        
        // Weather responses
        if (lowerMessage.includes('weather')) {
            return "I don't have access to real-time weather data, but you can check your local weather app or website for current conditions!";
        }
        
        // Time responses
        if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
            const now = new Date();
            return `Current time is ${now.toLocaleTimeString()} and today's date is ${now.toLocaleDateString()}.`;
        }
        
        // Default responses
        const defaultResponses = [
            "That's interesting! Can you tell me more about that?",
            "I understand what you're saying. What would you like to know more about?",
            "Thanks for sharing that with me! How can I help you further?",
            "I see! Is there something specific you'd like help with?",
            "That's a great point! What else would you like to discuss?",
            "I'm here to help! Could you provide more details about what you need?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Toggle send button based on input
    toggleSendButton() {
        if (this.messageInput.value.trim()) {
            this.sendButton.disabled = false;
            this.sendButton.style.opacity = '1';
        } else {
            this.sendButton.disabled = true;
            this.sendButton.style.opacity = '0.6';
        }
    }

    // Scroll to bottom of messages
    scrollToBottom() {
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 100);
    }

    // Utility function for delays
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// INITIALIZATION - THIS WAS MISSING!
// ============================================

// Wait for the page to load completely
document.addEventListener('DOMContentLoaded', function() {
    // Create and initialize the chatbot
    window.chatbot = new Chatbot();
    console.log('Chatbot initialized successfully!');
});

// Alternative initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.chatbot = new Chatbot();
    });
} else {
    // DOM is already ready
    window.chatbot = new Chatbot();
}