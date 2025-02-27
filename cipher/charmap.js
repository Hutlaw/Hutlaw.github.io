const starsCanvas = document.getElementById('stars');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
function generateStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({ 
      x: Math.random() * starsCanvas.width, 
      y: Math.random() * starsCanvas.height, 
      size: Math.random() * 2, 
      twinkle: Math.random() * Math.PI * 2, 
      speed: Math.random() * 0.05 
    });
  }
}
function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(star => {
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255,255,255,${Math.sin(star.twinkle)*0.5+0.5})`;
    starsCtx.fill();
    star.twinkle += star.speed;
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
generateStars();
drawStars();
window.addEventListener('resize', () => { 
  resizeCanvas(); 
  generateStars(); 
});
window.addEventListener('touchmove', e => { e.preventDefault(); }, {passive: false});

/* Updated bubble rotation system to match main.js */
const bubbles = document.querySelectorAll('.bubble'); // Changed selector here
let currentIndex = 0;
let touchStartY = 0;
let touchEndY = 0;
function initializeBubbles() {
  bubbles.forEach(b => b.classList.remove('top', 'middle', 'bottom'));
  let topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  let bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add('middle');
  bubbles[topIndex].classList.add('top');
  bubbles[bottomIndex].classList.add('bottom');
}
function rotateBubbles(direction) {
  bubbles.forEach(b => b.classList.remove('top', 'middle', 'bottom'));
  currentIndex = direction === 'down' ? (currentIndex + 1) % bubbles.length 
                                      : (currentIndex - 1 + bubbles.length) % bubbles.length;
  let topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  let bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add('middle');
  bubbles[topIndex].classList.add('top');
  bubbles[bottomIndex].classList.add('bottom');
}
function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}
function handleTouchEnd(event) {
  touchEndY = event.changedTouches[0].clientY;
  let swipeDistance = touchStartY - touchEndY;
  if (Math.abs(swipeDistance) > 50) {
    rotateBubbles(swipeDistance > 0 ? 'down' : 'up');
  }
}
let scrollTimeout;
window.addEventListener('wheel', event => {
  if (scrollTimeout) return;
  rotateBubbles(event.deltaY > 0 ? 'down' : 'up');
  scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 500);
});
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchend', handleTouchEnd);
initializeBubbles();

/* --- Existing CharMap Encoding/Decoding functionality --- */
const encodingTable = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'g': 6, 'h': 7, 'i': 8, 'j': 9, 'k': 11, 'l': 12,
  'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 21, 'u': 22, 'v': 23, 'w': 24,
  'x': 25, 'y': 26, 'z': 27, 'f': 28,
  '1': 29, '2': 31, '3': 32, '4': 33, '5': 34, '6': 35, '7': 36, '8': 37, '9': 38, '0': 39,
  ' ': 41, '`': 42, '~': 43, '!': 44, '@': 45, '#': 46, '$': 47, '%': 48, '^': 49, '&': 51, '*': 52,
  '(': 53, ')': 54, '-': 55, '_': 56, '=': 57, '+': 58, '{': 59, '[': 61, '}': 62, ']': 63, '\\': 64,
  '|': 65, '"': 66, "'": 67, ';': 68, ':': 69, '/': 71, '?': 72, '>': 73, '.': 74, '<': 75, ',': 76,
  'á': 77, 'é': 78, 'í': 79, 'ó': 80, 'ú': 81, 'à': 82, 'è': 83, 'ç': 84, 'ñ': 85, 'ö': 86, 'ü': 87
};
const decodingTable = Object.fromEntries(Object.entries(encodingTable).map(([k,v]) => [v,k]));

function encodeMessage() {
  let input = document.getElementById("message").value.toLowerCase();
  let encodedMessage = "";
  for (let char of input) {
    encodedMessage += char in encodingTable ? encodingTable[char] + "0" : char;
  }
  document.getElementById("encoded").value = encodedMessage.trim();
}

function decodeMessage() {
  let encodedInput = document.getElementById("encodedInput").value.trim();
  let decodedMessage = "";
  let parts = encodedInput.split("0").filter(part => part !== "");
  for (let part of parts) {
    decodedMessage += part in decodingTable ? decodingTable[part] : "?";
  }
  document.getElementById("decoded").value = decodedMessage;
}