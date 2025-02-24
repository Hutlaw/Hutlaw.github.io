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
    stars.push({ x: Math.random() * starsCanvas.width, y: Math.random() * starsCanvas.height, size: Math.random() * 2, twinkle: Math.random() * Math.PI * 2, speed: Math.random() * 0.05 });
  }
}
function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  stars.forEach(star => {
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255, 255, 255, ${Math.sin(star.twinkle)*0.5+0.5})`;
    starsCtx.fill();
    star.twinkle += star.speed;
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
generateStars();
drawStars();
window.addEventListener('resize', () => { resizeCanvas(); generateStars(); });
window.addEventListener('touchmove', e => { e.preventDefault(); }, {passive: false});
const bubbles = document.querySelectorAll('.bubble');
let currentIndex = 0;
let touchStartY = 0;
let touchEndY = 0;
function initializeBubbles() {
  bubbles.forEach(b => b.classList.remove('top','middle','bottom'));
  let topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  let bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add('middle');
  bubbles[topIndex].classList.add('top');
  bubbles[bottomIndex].classList.add('bottom');
}
function rotateBubbles(direction) {
  bubbles.forEach(b => b.classList.remove('top','middle','bottom'));
  currentIndex = direction === 'down' ? (currentIndex + 1) % bubbles.length : (currentIndex - 1 + bubbles.length) % bubbles.length;
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
function vigenereEncode(text, key) {
  let result = "";
  let j = 0;
  key = key.toUpperCase();
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[A-Za-z]/)) {
      let base = 65;
      let p = char.toUpperCase().charCodeAt(0) - base;
      let k = key[j % key.length].charCodeAt(0) - base;
      result += String.fromCharCode(((p + k) % 26) + base);
      j++;
    } else {
      result += char;
    }
  }
  return result;
}
function vigenereDecode(text, key) {
  let result = "";
  let j = 0;
  key = key.toUpperCase();
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    if (char.match(/[A-Za-z]/)) {
      let base = 65;
      let c = char.toUpperCase().charCodeAt(0) - base;
      let k = key[j % key.length].charCodeAt(0) - base;
      result += String.fromCharCode(((c - k + 26) % 26) + base);
      j++;
    } else {
      result += char;
    }
  }
  return result;
}
function isValidKeyword(key) {
  return /^[A-Za-z]+$/.test(key);
}
function encodeMessage() {
  let text = document.getElementById("message").value;
  let key = document.getElementById("encodeKeyword").value;
  if (!key || !isValidKeyword(key)) {
    alert("Please enter a valid keyword (letters only) for encoding.");
    return;
  }
  document.getElementById("encoded").value = vigenereEncode(text, key);
}
function decodeMessage() {
  let text = document.getElementById("encodedInput").value;
  let key = document.getElementById("decodeKeyword").value;
  if (!key || !isValidKeyword(key)) {
    alert("Please enter a valid keyword (letters only) for decoding.");
    return;
  }
  document.getElementById("decoded").value = vigenereDecode(text, key);
}
initializeBubbles();