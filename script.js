// Configuration
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Euron API Configuration for Chat
const EURON_API_KEY = 'euri-05ceffc1be86d79665396af949ad8277f9d4407322766bfbd2c2d95da2a2142d';
const EURON_API_URL = 'https://api.euron.one/api/v1/euri/chat/completions';
const EURON_MODEL = 'gpt-4.1-nano';

// State
let currentAvatarStyle = 'robot';
let currentAvatarColor = '#FF6B9D';
let currentName = '';
let currentAge = '';
let introductionText = '';
let recognition = null;
let isRecording = false;
let accumulatedText = '';

// DOM Elements
const avatarCanvas = document.getElementById('avatarCanvas');
const ctx = avatarCanvas.getContext('2d');
const avatarNameInput = document.getElementById('avatarName');
const avatarAgeSelect = document.getElementById('avatarAge');
const avatarColorInput = document.getElementById('avatarColor');
const customIntroductionInput = document.getElementById('customIntroduction');
const styleButtons = document.querySelectorAll('.style-btn');
const generateBtn = document.getElementById('generateBtn');
const useCustomBtn = document.getElementById('useCustomBtn');
const recordBtn = document.getElementById('recordBtn');
const recordingStatus = document.getElementById('recordingStatus');
const speakBtn = document.getElementById('speakBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const introductionTextEl = document.getElementById('introductionText');
const sparkleContainer = document.getElementById('sparkleContainer');
const confettiContainer = document.getElementById('confettiContainer');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatMessages = document.getElementById('chatMessages');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeSpeechRecognition();
    setupEventListeners();
    drawAvatar();
});

// Initialize Speech Recognition
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                    accumulatedText += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update textarea with accumulated text and interim results
            customIntroductionInput.value = accumulatedText + interimTranscript;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                recordingStatus.innerHTML = '<span class="recording-indicator">⚠️</span><span>No speech detected. Try again!</span>';
                setTimeout(() => {
                    stopRecording();
                }, 2000);
            } else if (event.error === 'audio-capture') {
                alert('No microphone found. Please check your microphone settings! 🎤');
                stopRecording();
            } else if (event.error === 'not-allowed') {
                alert('Microphone permission denied. Please allow microphone access! 🎤');
                stopRecording();
            } else {
                stopRecording();
            }
        };
        
        recognition.onend = () => {
            if (isRecording) {
                // If still recording, restart (for continuous mode)
                try {
                    recognition.start();
                } catch (e) {
                    stopRecording();
                }
            }
        };
    } else {
        recordBtn.disabled = true;
        recordBtn.textContent = '🎤 Speech Recognition Not Supported';
        recordBtn.style.opacity = '0.5';
    }
}

// Event Listeners
function setupEventListeners() {
    // Avatar style selection
    styleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            styleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAvatarStyle = btn.dataset.style;
            drawAvatar();
        });
    });

    // Name input
    avatarNameInput.addEventListener('input', (e) => {
        currentName = e.target.value;
        drawAvatar();
    });

    // Age selection
    avatarAgeSelect.addEventListener('change', (e) => {
        currentAge = e.target.value;
    });

    // Color picker
    avatarColorInput.addEventListener('input', (e) => {
        currentAvatarColor = e.target.value;
        drawAvatar();
    });

    // Generate introduction
    generateBtn.addEventListener('click', generateIntroduction);

    // Use custom introduction
    useCustomBtn.addEventListener('click', useCustomIntroduction);

    // Record speech
    recordBtn.addEventListener('click', toggleSpeechRecognition);

    // Speak button
    speakBtn.addEventListener('click', speakIntroduction);

    // Chat functionality
    sendChatBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Copy button
    copyBtn.addEventListener('click', copyToClipboard);

    // Download button
    downloadBtn.addEventListener('click', downloadAvatarCard);
}

// Draw Avatar
function drawAvatar() {
    const canvas = avatarCanvas;
    const size = canvas.width;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw background
    ctx.fillStyle = currentAvatarColor;
    ctx.fillRect(0, 0, size, size);
    
    // Draw avatar based on style
    switch(currentAvatarStyle) {
        case 'robot':
            drawRobot();
            break;
        case 'animal':
            drawAnimal();
            break;
        case 'superhero':
            drawSuperhero();
            break;
        case 'alien':
            drawAlien();
            break;
    }
    
    // Draw name if provided
    if (currentName) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 24px Comic Neue';
        ctx.textAlign = 'center';
        ctx.fillText(currentName, size / 2, size - 20);
    }
}

function drawRobot() {
    const size = avatarCanvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Head (square)
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(centerX - 80, centerY - 100, 160, 160);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.strokeRect(centerX - 80, centerY - 100, 160, 160);
    
    // Eyes
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 50, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 30, centerY - 50, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Antenna
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 100);
    ctx.lineTo(centerX, centerY - 130);
    ctx.stroke();
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 130, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (grid)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.strokeRect(centerX - 30 + i * 20, centerY + 20 + j * 20, 15, 15);
        }
    }
}

function drawAnimal() {
    const size = avatarCanvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Head (circle)
    ctx.fillStyle = '#FFB347';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 20, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Ears
    ctx.fillStyle = '#FF8C42';
    ctx.beginPath();
    ctx.arc(centerX - 60, centerY - 80, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 60, centerY - 80, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 40, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 30, centerY - 40, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY + 10, 20, 0, Math.PI);
    ctx.stroke();
}

function drawSuperhero() {
    const size = avatarCanvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Head (circle)
    ctx.fillStyle = '#FFDBAC';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Mask
    ctx.fillStyle = '#1E3A8A';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 80, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#FFDBAC';
    ctx.beginPath();
    ctx.arc(centerX, centerY - 30, 60, 0, Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 25, centerY - 40, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Cape
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY + 50);
    ctx.lineTo(centerX - 80, centerY + 150);
    ctx.lineTo(centerX + 80, centerY + 150);
    ctx.lineTo(centerX + 50, centerY + 50);
    ctx.closePath();
    ctx.fill();
    
    // Emblem
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 20, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#DC143C';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('S', centerX, centerY + 30);
}

function drawAlien() {
    const size = avatarCanvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Head (oval)
    ctx.fillStyle = '#90EE90';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 70, 100, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Large eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX - 30, centerY - 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 30, centerY - 50, 25, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    ctx.arc(centerX - 25, centerY - 55, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 35, centerY - 55, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Small mouth
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Antenna
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 40, centerY - 120);
    ctx.lineTo(centerX - 20, centerY - 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX + 40, centerY - 120);
    ctx.lineTo(centerX + 20, centerY - 100);
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX - 40, centerY - 120, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + 40, centerY - 120, 6, 0, Math.PI * 2);
    ctx.fill();
}

// Generate Introduction with Gemini API
async function generateIntroduction() {
    const name = avatarNameInput.value.trim();
    const age = avatarAgeSelect.value;
    
    if (!name) {
        alert('Please enter your name first! 👤');
        return;
    }
    
    if (!age) {
        alert('Please select your age! 🎂');
        return;
    }
    
    // Show loading state
    generateBtn.classList.add('loading');
    generateBtn.disabled = true;
    introductionTextEl.textContent = 'Creating your amazing introduction... ✨';
    
    // Create sparkle effects
    createSparkles();
    
    try {
        const prompt = `Create a fun, exciting, and kid-friendly self-introduction for a ${age}-year-old child named ${name}. 
        Make it creative and include:
        - Their name and age
        - 2-3 fun personality traits
        - 2-3 favorite things (toys, activities, foods, etc.)
        - 1-2 fun facts or interesting things about them
        - Make it sound enthusiastic and positive
        - Keep it under 150 words
        - Use emojis sparingly (2-3 max)
        - Write it as if the child is introducing themselves`;
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        introductionText = data.candidates[0].content.parts[0].text;
        introductionTextEl.textContent = introductionText;
        
        // Enable buttons
        speakBtn.disabled = false;
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        
        // Create confetti
        createConfetti();
        
        // Add bounce animation
        avatarCanvas.classList.add('speaking');
        setTimeout(() => {
            avatarCanvas.classList.remove('speaking');
        }, 2000);
        
    } catch (error) {
        console.error('Error generating introduction:', error);
        // Fallback introduction if API fails
        introductionText = `Hi! I'm ${name} and I'm ${age} years old! I'm super excited to meet you! 
        I love playing games, making new friends, and having fun adventures. 
        I'm creative, friendly, and always ready for something new! 
        Let's be friends and have amazing times together! 🎉✨`;
        introductionTextEl.textContent = introductionText;
        
        // Enable buttons even with fallback
        speakBtn.disabled = false;
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        
        createConfetti();
    } finally {
        generateBtn.classList.remove('loading');
        generateBtn.disabled = false;
    }
}

// Use Custom Introduction
function useCustomIntroduction() {
    const customText = customIntroductionInput.value.trim();
    
    if (!customText) {
        alert('Please type your introduction in the text area first! ✍️');
        return;
    }
    
    // Set the introduction text
    introductionText = customText;
    introductionTextEl.textContent = introductionText;
    
    // Enable buttons
    speakBtn.disabled = false;
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    
    // Create confetti
    createConfetti();
    
    // Add bounce animation
    avatarCanvas.classList.add('speaking');
    setTimeout(() => {
        avatarCanvas.classList.remove('speaking');
    }, 2000);
}

// Toggle Speech Recognition
function toggleSpeechRecognition() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser. 😢');
        return;
    }
    
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Start Speech Recognition
function startRecording() {
    if (!recognition) return;
    
    try {
        // Clear previous text
        customIntroductionInput.value = '';
        accumulatedText = '';
        
        recognition.start();
        isRecording = true;
        
        // Update UI
        recordBtn.textContent = '⏹️ Stop Recording';
        recordBtn.style.background = 'linear-gradient(135deg, #FF4444, #CC0000)';
        recordingStatus.style.display = 'flex';
        recordingStatus.innerHTML = '<span class="recording-indicator">🔴</span><span>Recording... Speak now!</span>';
        
        // Add pulsing animation
        recordingStatus.classList.add('pulsing');
    } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Error starting speech recognition. Please try again!');
        isRecording = false;
    }
}

// Stop Speech Recognition
function stopRecording() {
    if (!recognition) return;
    
    try {
        recognition.stop();
    } catch (e) {
        // Ignore errors when stopping
    }
    
    isRecording = false;
    
    // Update UI
    recordBtn.textContent = '🎤 Record Your Introduction';
    recordBtn.style.background = '';
    recordingStatus.style.display = 'none';
    recordingStatus.classList.remove('pulsing');
    
    // If there's text in the textarea, automatically use it
    const recordedText = customIntroductionInput.value.trim();
    if (recordedText) {
        // Auto-apply the recorded introduction
        introductionText = recordedText;
        introductionTextEl.textContent = introductionText;
        
        // Enable buttons
        speakBtn.disabled = false;
        copyBtn.disabled = false;
        downloadBtn.disabled = false;
        
        // Create confetti
        createConfetti();
        
        // Add bounce animation
        avatarCanvas.classList.add('speaking');
        setTimeout(() => {
            avatarCanvas.classList.remove('speaking');
        }, 2000);
        
        // Show success message
        recordingStatus.style.display = 'flex';
        recordingStatus.innerHTML = '<span class="recording-indicator">✅</span><span>Recording saved! Your introduction is ready!</span>';
        recordingStatus.style.background = 'rgba(76, 175, 80, 0.2)';
        setTimeout(() => {
            recordingStatus.style.display = 'none';
            recordingStatus.style.background = '';
        }, 3000);
    }
}

// Text-to-Speech
function speakIntroduction() {
    if (!introductionText) {
        alert('Please generate an introduction first! ✨');
        return;
    }
    
    if ('speechSynthesis' in window) {
        // Stop any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(introductionText);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 1;
        
        // Try to use a child-friendly voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.includes('Child') || 
            voice.name.includes('Kid') ||
            voice.lang.includes('en')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Add speaking animation
        avatarCanvas.classList.add('speaking');
        
        utterance.onend = () => {
            avatarCanvas.classList.remove('speaking');
        };
        
        utterance.onerror = () => {
            avatarCanvas.classList.remove('speaking');
            alert('Sorry, there was an error with the speech. Please try again!');
        };
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Sorry, your browser does not support text-to-speech. 😢');
    }
}

// Load voices when available
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
    };
}

// Copy to Clipboard
async function copyToClipboard() {
    if (!introductionText) {
        alert('Please generate an introduction first! ✨');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(introductionText);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy text. Please try again!');
    }
}

// Download Avatar Card
function downloadAvatarCard() {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, currentAvatarColor);
    gradient.addColorStop(1, adjustColor(currentAvatarColor, 20));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw avatar from existing canvas
    const avatarSize = 200;
    ctx.drawImage(avatarCanvas, 100, 50, avatarSize, avatarSize);
    
    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Comic Neue';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText('My AI Avatar Introduction', canvas.width / 2, 300);
    ctx.fillText('My AI Avatar Introduction', canvas.width / 2, 300);
    
    if (currentName) {
        ctx.font = 'bold 24px Comic Neue';
        ctx.strokeText(`Created by: ${currentName}`, canvas.width / 2, 340);
        ctx.fillText(`Created by: ${currentName}`, canvas.width / 2, 340);
    }
    
    // Introduction text with background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(50, 380, canvas.width - 100, 180);
    
    ctx.fillStyle = '#000000';
    ctx.font = '20px Comic Neue';
    ctx.textAlign = 'left';
    const maxWidth = canvas.width - 120;
    const lines = wrapText(ctx, introductionText || 'No introduction generated yet.', maxWidth);
    let y = 410;
    lines.forEach(line => {
        ctx.fillText(line, 70, y);
        y += 28;
    });
    
    // Download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentName || 'avatar'}-avatar-card.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

// Chat Functions
async function sendChatMessage() {
    const question = chatInput.value.trim();
    
    if (!question) {
        return;
    }
    
    // Clear input
    chatInput.value = '';
    
    // Add user message to chat
    addChatMessage(question, 'user');
    
    // Show loading message
    const loadingId = addChatMessage('Thinking... 🤔', 'bot', true);
    
    // Disable input while processing
    chatInput.disabled = true;
    sendChatBtn.disabled = true;
    
    try {
        const response = await fetch(EURON_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${EURON_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: 'You are a friendly and helpful AI assistant for kids. Answer questions in a fun, kid-friendly way that\'s easy to understand. Keep your answers positive and engaging. Use simple words and maybe add an emoji or two.'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                model: EURON_MODEL
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        const answer = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || 'Sorry, I couldn\'t process that.';
        
        // Remove loading message and add real answer
        removeChatMessage(loadingId);
        addChatMessage(answer, 'bot');
        
    } catch (error) {
        console.error('Error getting chat response:', error);
        
        // Remove loading message
        removeChatMessage(loadingId);
        
        // Show friendly error message
        addChatMessage('Oops! I had trouble answering that. Could you try asking again? 😊', 'bot');
    } finally {
        // Re-enable input
        chatInput.disabled = false;
        sendChatBtn.disabled = false;
        chatInput.focus();
    }
}

function addChatMessage(text, sender, isTemporary = false) {
    const messageDiv = document.createElement('div');
    const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    messageDiv.id = messageId;
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    return isTemporary ? messageId : null;
}

function removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.style.transition = 'all 0.3s ease';
        message.style.opacity = '0';
        message.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function to wrap text
function wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + ' ' + word).width;
        if (width < maxWidth) {
            currentLine += ' ' + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Visual Effects
function createSparkles() {
    const container = sparkleContainer;
    container.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 1000);
        }, i * 50);
    }
}

function createConfetti() {
    const container = confettiContainer;
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

