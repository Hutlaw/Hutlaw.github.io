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
    starsCtx.fillStyle = `rgba(255,255,255,${Math.sin(star.twinkle)*0.5+0.5})`;
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
const baseX = 7, baseY = 11, modValue = 97;
function eccEncryptMessage() {
  let message = document.getElementById("eccMessage").value;
  let pubX = parseInt(document.getElementById("publicX").value);
  let pubY = parseInt(document.getElementById("publicY").value);
  if (!message || isNaN(pubX) || isNaN(pubY)) {
    alert("Please enter a message and valid numeric public key values.");
    return;
  }
  let offset = (pubX + pubY) % 256;
  let encrypted = [];
  for (let i = 0; i < message.length; i++) {
    let c = message.charCodeAt(i);
    encrypted.push(((c + offset) % 256).toString());
  }
  document.getElementById("eccEncrypted").value = encrypted.join(" ");
}
function eccDecryptMessage() {
  let ciphertext = document.getElementById("eccCiphertext").value;
  let privKey = parseInt(document.getElementById("privateKey").value);
  if (!ciphertext || isNaN(privKey)) {
    alert("Please enter ciphertext and a valid numeric private key.");
    return;
  }
  let computedPubX = (privKey * baseX) % modValue;
  let computedPubY = (privKey * baseY) % modValue;
  let offset = (computedPubX + computedPubY) % 256;
  let parts = ciphertext.trim().split(" ").filter(p => p !== "");
  let decrypted = "";
  for (let part of parts) {
    let num = parseInt(part);
    if (isNaN(num)) continue;
    let charCode = (num - offset + 256) % 256;
    decrypted += String.fromCharCode(charCode);
  }
  document.getElementById("eccDecrypted").value = decrypted;
}
function eccCalculateKeysFromInput() {
  let privKey = parseInt(document.getElementById("calcPrivateKey").value);
  if (isNaN(privKey)) {
    alert("Please enter a valid numeric private key.");
    return;
  }
  let pubX = (privKey * baseX) % modValue;
  let pubY = (privKey * baseY) % modValue;
  document.getElementById("calcPublicX").value = pubX;
  document.getElementById("calcPublicY").value = pubY;
  alert("Public key calculated from input.");
}
function eccGenerateKeys() {
  let privKey = Math.floor(Math.random() * 90) + 10;
  let pubX = (privKey * baseX) % modValue;
  let pubY = (privKey * baseY) % modValue;
  document.getElementById("calcPrivateKey").value = privKey;
  document.getElementById("calcPublicX").value = pubX;
  document.getElementById("calcPublicY").value = pubY;
  document.getElementById("publicX").value = pubX;
  document.getElementById("publicY").value = pubY;
  document.getElementById("privateKey").value = privKey;
  alert("Keys auto-generated.");
}
initializeBubbles();