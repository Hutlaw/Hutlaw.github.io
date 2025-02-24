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
    starsCtx.fillStyle = `rgba(255, 255, 255, ${Math.sin(star.twinkle) * 0.5 + 0.5})`;
    starsCtx.fill();
    star.twinkle += star.speed;
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
generateStars();
drawStars();
window.addEventListener('resize', () => { resizeCanvas(); generateStars(); });
window.addEventListener('touchmove', e => { e.preventDefault(); }, { passive: false });
const bubbles = document.querySelectorAll('.bubble');
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
initializeBubbles();
async function aesEncryptMessage() {
  const message = document.getElementById("aesMessage").value;
  const keyStr = document.getElementById("aesKey").value;
  if (keyStr.length !== 16) {
    alert("Key must be exactly 16 characters long.");
    return;
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyStr);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const messageData = encoder.encode(message);
  try {
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, messageData);
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    document.getElementById("aesEncrypted").value = arrayBufferToBase64(combined);
  } catch (err) {
    alert("Encryption failed: " + err);
  }
}
async function aesDecryptMessage() {
  const base64 = document.getElementById("aesCiphertext").value;
  const keyStr = document.getElementById("aesKey").value;
  if (keyStr.length !== 16) {
    alert("Key must be exactly 16 characters long.");
    return;
  }
  const combinedBuffer = base64ToArrayBuffer(base64);
  const combined = new Uint8Array(combinedBuffer);
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const keyData = encoder.encode(keyStr);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["decrypt"]);
  try {
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, cryptoKey, data);
    document.getElementById("aesDecrypted").value = decoder.decode(decryptedBuffer);
  } catch (err) {
    alert("Decryption failed: " + err);
  }
}
function toggleAESExplanation() {
  const exp = document.getElementById("aesExplanation");
  exp.style.display = exp.style.display === "none" ? "block" : "none";
}
function generateRandomKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 16; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("aesKey").value = key;
}
function arrayBufferToBase64(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function base64ToArrayBuffer(base64) {
  let binary = atob(base64);
  let bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}