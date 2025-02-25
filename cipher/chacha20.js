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
    starsCtx.fillStyle = `rgba(255,255,255,${Math.sin(star.twinkle) * 0.5 + 0.5})`;
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
function rotateLeft(x, n) {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}
function quarterRound(state, a, b, c, d) {
  state[a] = (state[a] + state[b]) >>> 0;
  state[d] ^= state[a];
  state[d] = rotateLeft(state[d], 16);
  state[c] = (state[c] + state[d]) >>> 0;
  state[b] ^= state[c];
  state[b] = rotateLeft(state[b], 12);
  state[a] = (state[a] + state[b]) >>> 0;
  state[d] ^= state[a];
  state[d] = rotateLeft(state[d], 8);
  state[c] = (state[c] + state[d]) >>> 0;
  state[b] ^= state[c];
  state[b] = rotateLeft(state[b], 7);
}
function chacha20Block(keyWords, counter, nonceWords) {
  let constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
  let state = [constants[0], constants[1], constants[2], constants[3],
               keyWords[0], keyWords[1], keyWords[2], keyWords[3],
               keyWords[4], keyWords[5], keyWords[6], keyWords[7],
               counter, nonceWords[0], nonceWords[1], nonceWords[2]];
  let workingState = state.slice();
  for (let i = 0; i < 10; i++) {
    quarterRound(workingState, 0, 4, 8, 12);
    quarterRound(workingState, 1, 5, 9, 13);
    quarterRound(workingState, 2, 6, 10, 14);
    quarterRound(workingState, 3, 7, 11, 15);
    quarterRound(workingState, 0, 5, 10, 15);
    quarterRound(workingState, 1, 6, 11, 12);
    quarterRound(workingState, 2, 7, 8, 13);
    quarterRound(workingState, 3, 4, 9, 14);
  }
  let output = [];
  for (let i = 0; i < 16; i++) {
    let result = (workingState[i] + state[i]) >>> 0;
    output.push(result);
  }
  let keystream = [];
  for (let i = 0; i < 16; i++) {
    keystream.push(resultToBytes(output[i]));
  }
  return keystream.flat();
}
function resultToBytes(num) {
  let bytes = [];
  bytes.push(num & 0xff);
  bytes.push((num >>> 8) & 0xff);
  bytes.push((num >>> 16) & 0xff);
  bytes.push((num >>> 24) & 0xff);
  return bytes;
}
function hexToBytes(hex) {
  let bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }
  return bytes;
}
function bytesToHex(bytes) {
  return bytes.map(b => ('0' + b.toString(16)).slice(-2)).join('');
}
function stringToBytes(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}
function bytesToString(bytes) {
  return String.fromCharCode(...bytes);
}
function chacha20Cipher(dataBytes, keyBytes, counter, nonceBytes) {
  let keyWords = [];
  for (let i = 0; i < 8; i++) {
    keyWords.push(keyBytes[i * 4] | (keyBytes[i * 4 + 1] << 8) | (keyBytes[i * 4 + 2] << 16) | (keyBytes[i * 4 + 3] << 24));
  }
  let nonceWords = [];
  for (let i = 0; i < 3; i++) {
    nonceWords.push(nonceBytes[i * 4] | (nonceBytes[i * 4 + 1] << 8) | (nonceBytes[i * 4 + 2] << 16) | (nonceBytes[i * 4 + 3] << 24));
  }
  let output = [];
  let blockCount = Math.ceil(dataBytes.length / 64);
  for (let i = 0; i < blockCount; i++) {
    let keystream = chacha20Block(keyWords, (counter + i) >>> 0, nonceWords);
    let block = dataBytes.slice(i * 64, (i + 1) * 64);
    for (let j = 0; j < block.length; j++) {
      output.push(block[j] ^ keystream[j]);
    }
  }
  return output;
}
function chacha20EncryptMessage() {
  let message = document.getElementById("chacha20Message").value;
  let keyHex = document.getElementById("chacha20Key").value.trim();
  let nonceHex = document.getElementById("chacha20Nonce").value.trim();
  let counter = parseInt(document.getElementById("chacha20Counter").value);
  if (!message || keyHex.length !== 64 || nonceHex.length !== 24 || isNaN(counter)) {
    alert("Please enter a message, a 256-bit key (64 hex characters), a 96-bit nonce (24 hex characters), and a valid counter.");
    return;
  }
  let keyBytes = hexToBytes(keyHex);
  let nonceBytes = hexToBytes(nonceHex);
  let messageBytes = stringToBytes(message);
  let encryptedBytes = chacha20Cipher(messageBytes, keyBytes, counter, nonceBytes);
  document.getElementById("chacha20Encrypted").value = bytesToHex(encryptedBytes);
}
function chacha20DecryptMessage() {
  let ciphertextHex = document.getElementById("chacha20Ciphertext").value.trim();
  let keyHex = document.getElementById("chacha20KeyDec").value.trim();
  let nonceHex = document.getElementById("chacha20NonceDec").value.trim();
  let counter = parseInt(document.getElementById("chacha20CounterDec").value);
  if (!ciphertextHex || keyHex.length !== 64 || nonceHex.length !== 24 || isNaN(counter)) {
    alert("Please enter ciphertext, a 256-bit key (64 hex characters), a 96-bit nonce (24 hex characters), and a valid counter.");
    return;
  }
  let keyBytes = hexToBytes(keyHex);
  let nonceBytes = hexToBytes(nonceHex);
  let ciphertextBytes = hexToBytes(ciphertextHex);
  let decryptedBytes = chacha20Cipher(ciphertextBytes, keyBytes, counter, nonceBytes);
  document.getElementById("chacha20Decrypted").value = bytesToString(decryptedBytes);
}