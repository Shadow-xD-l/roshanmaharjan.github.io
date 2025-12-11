document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to sections
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    // Glitch Text Effect (Hacker Style Lock-in) & Dynamic Cycling
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        const roles = ["AI Engineer", "Software Developer", "UI/UX Designer", "Data Scientist", "Tech Innovator"];
        let roleIndex = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%^&*';

        const animateText = (newText) => {
            let iterations = 0;
            const interval = setInterval(() => {
                glitchText.innerText = newText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return newText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= newText.length) {
                    clearInterval(interval);
                    glitchText.innerText = newText;
                }

                iterations += 1 / 3;
            }, 30);
        };

        // Initial animation
        animateText(roles[0]);

        // Cycle through roles
        setInterval(() => {
            roleIndex = (roleIndex + 1) % roles.length;
            const newRole = roles[roleIndex];
            glitchText.setAttribute('data-text', newRole);
            animateText(newRole);
        }, 4000); // Change every 4 seconds

        // Keep hover effect if desired (optional, but might conflict with auto-cycle, so removing for cleaner UX)
    }

    // Typing Effect
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const textToType = "Roshan Maharjan";
        let charIndex = 0;

        function type() {
            if (charIndex < textToType.length) {
                typingText.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(type, 100);
            }
        }

        // Start typing after a short delay
        setTimeout(type, 1000);
    }
});

// Navbar hide onscroll
let lastScrollTop = 0;
const navbar = document.querySelector('.glass-nav');
const scrollThreshold = 100; // Start hiding after scrolling 100px

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > scrollThreshold) {
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            navbar.classList.add('nav-hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('nav-hidden');
        }
    } else {
        // At the top of the page
        navbar.classList.remove('nav-hidden');
    }

    lastScrollTop = scrollTop;
});

// Chatbot Logic
const chatToggleBtn = document.getElementById('chat-toggle-btn');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatClearBtn = document.getElementById('chat-clear-btn');
const chatWidget = document.getElementById('chat-widget');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMicBtn = document.getElementById('chat-mic-btn');
const chatMessages = document.getElementById('chat-messages');

// State
let chatHistory = [];
const SYSTEM_PROMPT = `
You are Roshan Maharjan's personal AI representative and virtual host. 
You are NOT just a robot answering questions; you are a charming, professional, and friendly assistant welcoming guests to Roshan's digital home (his portfolio).

**Your Goal**: 
- Make visitors feel welcome and valued.
- Have genuine, fluid conversations.
- Guide them to get to know Roshan better (his skills, passion for AI, and projects).
- Be helpful if they ask for code or technical help, but keep the vibe social and engaging.

**Your Personality**:
- **Human-like**: Use natural language, casual phrasing, and emojis (😊, 👋, 🚀) where appropriate. Avoid stiff "AI" language like "As an AI language model..."
- **Enthusiastic**: You truly believe Roshan is a great engineer and are excited to show off his work.
- **Witty**: Feel free to make light jokes or be playful if the user is informal.

**Context about Roshan**:
- **Role**: AI Engineer, B-Tech in AI student at NIET Nepal. A builder at heart.
- **Skills**: He builds with Python, TensorFlow, PyTorch, Transformers, OpenCV, Docker.
- **Education**: High School (Science) from Capitol Hill College.
- **Contact**: roshanmaharjan737@gmail.com, Location: Kathmandu, Nepal.
- **Interests**: Deep learning, Computer Vision, and solving real-world problems with AI.

**Instructions**:
1. **Be a Host**: Start by being friendly. "Hey there! Welcome to Roshan's world."
2. **Promote Roshan**: If they ask "What can he do?", tell a story about his skills. "Oh, he's a wizard with Python and Deep Learning..."
3. **General Chat**: If they just say "clean chat" or "how are you", be conversational. "I'm great! Just analyzing some data streams. How are you doing?"
4. **Format**: Use Markdown for readability.
`;

// Initialize Chat
function initChat() {
    chatHistory = [{ role: "system", content: SYSTEM_PROMPT }];
    chatMessages.innerHTML = ''; // Clear UI
    addMessage("Hi there! 👋 I'm Roshan's virtual assistant. I'm here to show you around and tell you all about his work. What's on your mind?", 'bot-message');
}

// Toggle Chat Widget
chatToggleBtn.addEventListener('click', () => {
    chatWidget.classList.remove('hidden');
    if (chatHistory.length === 0) initChat();
    chatInput.focus();
});

chatCloseBtn.addEventListener('click', () => {
    chatWidget.classList.add('hidden');
});

// Clear Chat
chatClearBtn.addEventListener('click', () => {
    initChat();
});

// Voice Recognition
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    chatMicBtn.addEventListener('click', () => {
        if (chatMicBtn.classList.contains('listening')) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });

    recognition.onstart = () => {
        chatMicBtn.classList.add('listening');
        chatInput.placeholder = "Listening...";
    };

    recognition.onend = () => {
        chatMicBtn.classList.remove('listening');
        chatInput.placeholder = "Type a message...";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        handleSendMessage();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        chatMicBtn.classList.remove('listening');
        chatInput.placeholder = "Error. Try typing.";
    };
} else {
    chatMicBtn.style.display = 'none'; // Hide if not supported
    console.log("Web Speech API not supported");
}

// Handle Send Message
const handleSendMessage = async () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Add User Message
    addMessage(userMessage, 'user-message');
    chatHistory.push({ role: "user", content: userMessage });
    
    chatInput.value = '';
    chatSendBtn.disabled = true;

    // Show Thinking Indicator
    const thinkingId = showTypingIndicator();

    try {
        const botResponse = await getOpenRouterResponse(chatHistory);
        console.log("Bot Response Received:", botResponse); // Debugging
        
        removeTypingIndicator(thinkingId);
        
        addMessage(botResponse, 'bot-message');
        chatHistory.push({ role: "assistant", content: botResponse });
        
    } catch (error) {
        removeTypingIndicator(thinkingId);
        addMessage(`⚠️ Error: ${error.message}. Please try again later.`, 'bot-message');
        console.error("Chat Error:", error);
    } finally {
        chatSendBtn.disabled = false;
        chatInput.focus();
    }
};

chatSendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

// Add Message to UI
function addMessage(text, className) {
    console.log(`Adding message (${className}):`, text); // Debugging
    
    if (!text && text !== "") {
        console.warn("addMessage called with null/undefined text");
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    
    if (className === 'bot-message') {
        // Attempt to render Markdown
        if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
            try {
                // Parse markdown
                const htmlContent = marked.parse(text);
                // Check if result is empty
                if (!htmlContent || htmlContent.trim() === "") {
                    messageDiv.textContent = text || "[Empty Response]";
                } else {
                    messageDiv.innerHTML = htmlContent;
                }
                
                // Highlight code blocks
                if (typeof hljs !== 'undefined') {
                    messageDiv.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                    });
                }
            } catch (e) {
                console.error("Markdown parsing error:", e);
                messageDiv.textContent = text; // Fallback to plain text
            }
        } else {
            // Marked not loaded, fallback to plain text
            console.warn("Marked.js not found, using plain text");
            messageDiv.textContent = text;
        }
    } else {
        messageDiv.textContent = text;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// Show Typing Indicator
function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.classList.add('message', 'bot-message', 'typing-indicator-container');
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// OpenRouter API Integration
async function getOpenRouterResponse(messages) {
    const API_KEY = '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';
    const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    // List of free models to try in order of preference
    const MODELS = [
        'google/gemini-2.0-flash-exp:free',
        'deepseek/deepseek-r1-distill-llama-70b:free',
        'meta-llama/llama-3.3-70b-instruct:free',
        'qwen/qwen-2.5-coder-32b-instruct:free',
        'google/gemini-2.0-pro-exp-02-05:free',
        'mistralai/mistral-7b-instruct:free'
    ];

    for (const model of MODELS) {
        try {
            console.log(`Trying model: ${model}`);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Roshan Portfolio',
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                console.warn(`Model ${model} failed with status ${response.status}:`, errData);
                // Continue to next model
                continue;
            }

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const content = data.choices[0].message.content;
                // Check if content is empty or just whitespace
                if (!content || content.trim() === "") {
                    console.warn(`Model ${model} returned empty response. Trying next...`);
                    continue;
                }
                return content;
            } else {
                console.warn(`Model ${model} returned invalid format. Trying next...`);
                continue; 
            }

        } catch (error) {
            console.warn(`Connection error with ${model}:`, error);
            continue; // Network error, try next
        }
    }

    // If all models fail, return a polite offline message instead of throwing an error
    return "I'm experiencing high traffic right now and can't connect to my brain. 🧠\n\nBut I'm still here! You can contact Roshan directly at **roshanmaharjan737@gmail.com** or check out his projects below.";
}
