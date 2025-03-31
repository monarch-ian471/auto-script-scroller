// DOM Elements with error handling
const elements = {
    scriptContainer: document.getElementById('script-container'),
    inputContainer: document.getElementById('input-container'),
    controls: document.getElementById('controls'),
    textInput: document.getElementById('text-input'),
    shareLink: document.getElementById('share-link'),
    warning: document.getElementById('warning'),
    speedInput: document.getElementById('speed')
};

Object.entries(elements).forEach(([name, el]) => {
    if (!el) throw new Error(`${name} not found in DOM`);
});

// State
let isPlaying = false;
let scrollSpeed = 80; // Default speed set to 80 px/s
let textChunks = [];
let currentChunkIndex = 0;
let lastTime = null;
const CHUNK_SIZE = 10000;
const DEFAULT_DURATION = 15 * 60; // 15 minutes for full scroll
const CHAR_PER_PIXEL = 7;

// Preload from URL or Local Storage
const urlParams = new URLSearchParams(window.location.search);
const preloadedText = urlParams.get('text') || (urlParams.get('useLocalStorage') && localStorage.getItem('scrollText'));
if (preloadedText) {
    elements.textInput.value = decodeURIComponent(preloadedText);
    startScrolling();
}

// Utility Functions
const splitTextIntoChunks = (text, chunkSize = CHUNK_SIZE) =>
    Array.from({ length: Math.ceil(text.length / chunkSize) }, (_, i) =>
        text.slice(i * chunkSize, (i + 1) * chunkSize)
    );

const createChunkElement = chunk => {
    const div = document.createElement('div');
    div.className = 'script-chunk';
    div.textContent = chunk;
    return div;
};

const calculateScrollSpeed = text => {
    const totalHeight = text.length * CHAR_PER_PIXEL;
    return totalHeight / DEFAULT_DURATION;
};

// Core Functions
function startScrolling() {
    const userText = elements.textInput.value.trim();
    if (!userText) {
        alert('Please paste some text first!');
        return;
    }

    elements.inputContainer.style.display = 'none';
    elements.scriptContainer.style.display = 'block';
    elements.controls.style.display = 'block';

    textChunks = splitTextIntoChunks(userText);
    currentChunkIndex = 0;
    elements.scriptContainer.innerHTML = '';
    appendNextChunk();
    appendNextChunk();

    scrollSpeed = 80; // Fixed default speed
    elements.speedInput.value = scrollSpeed; // Sync input with default
    isPlaying = true;
    requestAnimationFrame(scrollStep);
    updateShareLink(userText);
}

function appendNextChunk() {
    if (currentChunkIndex < textChunks.length) {
        elements.scriptContainer.appendChild(createChunkElement(textChunks[currentChunkIndex]));
        currentChunkIndex++;
        const chunks = elements.scriptContainer.children;
        while (chunks.length > 3 && chunks[0].getBoundingClientRect().bottom < 0) {
            elements.scriptContainer.removeChild(chunks[0]);
        }
    }
}

function scrollStep(timestamp) {
    if (!isPlaying) return;
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000;
    elements.scriptContainer.scrollTop += scrollSpeed * deltaTime;

    const nearBottom = elements.scriptContainer.scrollTop + elements.scriptContainer.clientHeight >= elements.scriptContainer.scrollHeight - 200;
    if (nearBottom) {
        if (currentChunkIndex < textChunks.length) {
            appendNextChunk();
        } else if (currentChunkIndex === textChunks.length) {
            isPlaying = false;
        }
    }

    lastTime = timestamp;
    requestAnimationFrame(scrollStep);
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        lastTime = null;
        requestAnimationFrame(scrollStep);
    }
}

function updateSpeed() {
    scrollSpeed = parseInt(elements.speedInput.value) || 80; // Fallback to 80 if invalid
}

function updateShareLink(text) {
    const currentUrl = window.location.origin + window.location.pathname;
    if (text.length > 2000) {
        localStorage.setItem('scrollText', text);
        elements.shareLink.value = `${currentUrl}?useLocalStorage=true`;
        elements.warning.style.display = 'block';
    } else {
        const encodedText = encodeURIComponent(text);
        elements.shareLink.value = `${currentUrl}?text=${encodedText}`;
        elements.warning.style.display = 'none';
    }
}

function copyLink() {
    elements.shareLink.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}