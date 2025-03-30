const scriptText = document.getElementById('script-text');
const inputContainer = document.getElementById('input-container');
const scriptContainer = document.getElementById('script-container');
const controls = document.getElementById('controls');
const textInput = document.getElementById('text-input');
const shareLink = document.getElementById('share-link');
const warning = document.getElementById('warning');

let isPlaying = false;
let baseSpeed = 180; // Seconds per 1000 words

const urlParams = new URLSearchParams(window.location.search);
const preloadedText = urlParams.get('text');
if (preloadedText) {
    textInput.value = decodeURIComponent(preloadedText);
    startScrolling();
}

function calculateDuration(text) {
    const wordCount = text.split(/\s+/).length;
    const speedPerWord = baseSpeed / 1000; // Seconds per word
    return Math.max(wordCount * speedPerWord, 10); // Minimum 10 seconds
}

function startScrolling() {
    const userText = textInput.value.trim();
    if (!userText) {
        alert('Please paste some text first!');
        return;
    }
    inputContainer.style.display = 'none';
    scriptContainer.style.display = 'block';
    controls.style.display = 'block';
    scriptText.textContent = userText;

    const duration = calculateDuration(userText);
    scriptText.style.animation = `scrollText ${duration}s linear infinite`;
    isPlaying = true;

    const encodedText = encodeURIComponent(userText);
    const currentUrl = window.location.origin + window.location.pathname;
    shareLink.value = `${currentUrl}?text=${encodedText}`;
    
    // Show warning if text is too long for URL
    if (userText.length > 2000) {
        warning.style.display = 'block';
    }
}

function updateSpeed() {
    baseSpeed = parseInt(document.getElementById('speed').value);
    if (isPlaying) {
        const duration = calculateDuration(scriptText.textContent);
        scriptText.style.animation = `scrollText ${duration}s linear infinite`;
    }
}

function togglePlay() {
    if (isPlaying) {
        scriptText.style.animationPlayState = 'paused';
    } else {
        scriptText.style.animationPlayState = 'running';
    }
    isPlaying = !isPlaying;
}

function copyLink() {
    shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}