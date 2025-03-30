const scriptText = document.getElementById('script-text');
const inputContainer = document.getElementById('input-container');
const scriptContainer = document.getElementById('script-container');
const controls = document.getElementById('controls');
const textInput = document.getElementById('text-input');
const shareLink = document.getElementById('share-link');

let isPlaying = false;
let duration = 60; // Default scroll duration in seconds

function initialize() {
    // Event listeners
    document.getElementById('start-button').addEventListener('click', startScrolling);
    document.getElementById('speed').addEventListener('input', updateSpeed);
    document.getElementById('play-pause-button').addEventListener('click', togglePlay);
    document.getElementById('copy-button').addEventListener('click', copyLink);

    // Check for preloaded text in the URL
    checkForPreloadedText();
}

function checkForPreloadedText() {
    const urlParams = new URLSearchParams(window.location.search);
    const preloadedText = urlParams.get('text');
    if (preloadedText) {
        textInput.value = decodeURIComponent(preloadedText);
        startScrolling();
    }
}

function generateShareableLink(text) {
    const encodedText = encodeURIComponent(text);
    const currentUrl = window.location.origin + window.location.pathname;
    return `${currentUrl}?text=${encodedText}`;
}

function updateAnimation() {
    scriptText.style.animation = `scrollText ${duration}s linear infinite`;
}
// Check URL for preloaded text
const urlParams = new URLSearchParams(window.location.search);
const preloadedText = urlParams.get('text');
if (preloadedText) {
    textInput.value = decodeURIComponent(preloadedText);
    startScrolling();
}

function startScrolling() {
    const userText = textInput.value.trim();
    if (!userText) {
        alert('Please paste some text first!');
        return;
    }

    // Hide input, show script and controls
    inputContainer.style.display = 'none';
    scriptContainer.style.display = 'block';
    controls.style.display = 'block';

    // Set and start scrolling
    scriptText.textContent = userText;
    scriptText.style.animation = `scrollText ${duration}s linear infinite`;
    isPlaying = true;

    // Generate shareable link
    shareLink.value = generateShareableLink(userText);
}

function updateSpeed() {
    duration = parseInt(document.getElementById('speed').value);
    if (isPlaying) {
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

function main() {
  initialize();
}
