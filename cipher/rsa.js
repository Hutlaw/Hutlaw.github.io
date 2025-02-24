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
function modPow(base, exponent, modulus) {
  base = BigInt(base);
  exponent = BigInt(exponent);
  modulus = BigInt(modulus);
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}
function gcd(a, b) {
  a = BigInt(a);
  b = BigInt(b);
  while (b !== 0n) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}
function modInverse(a, m) {
  let m0 = BigInt(m), a0 = BigInt(a), x0 = 0n, x1 = 1n;
  if (m0 === 1n) return 0n;
  while (a0 > 1n) {
    let q = a0 / m0;
    let t = m0;
    m0 = a0 % m0;
    a0 = t;
    t = x0;
    x0 = x1 - q * x0;
    x1 = t;
  }
  return (x1 + BigInt(m)) % BigInt(m);
}
function isPrime(num) {
  num = parseInt(num);
  if (isNaN(num) || num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}
function rsaEncryptMessage() {
  let message = document.getElementById("rsaMessage").value;
  let e = document.getElementById("publicE").value;
  let n = document.getElementById("publicN").value;
  if (!message || !e || !n || isNaN(e) || isNaN(n)) {
    alert("Please enter a message and valid numeric public key values (e and n).");
    return;
  }
  let encrypted = [];
  for (let i = 0; i < message.length; i++) {
    let m = BigInt(message.charCodeAt(i));
    let c = modPow(m, e, n);
    encrypted.push(c.toString());
  }
  document.getElementById("rsaEncrypted").value = encrypted.join(" ");
}
function rsaDecryptMessage() {
  let ciphertext = document.getElementById("rsaCiphertext").value;
  let d = document.getElementById("privateD").value;
  let n = document.getElementById("privateN").value;
  if (!ciphertext || !d || !n || isNaN(d) || isNaN(n)) {
    alert("Please enter ciphertext and valid numeric private key values (d and n).");
    return;
  }
  let decrypted = "";
  let parts = ciphertext.trim().split(" ").filter(p => p !== "");
  for (let part of parts) {
    let c = BigInt(part);
    let m = modPow(c, d, n);
    decrypted += String.fromCharCode(Number(m));
  }
  document.getElementById("rsaDecrypted").value = decrypted;
}
function calculateKeysFromInput() {
  let pVal = document.getElementById("primeP").value;
  let qVal = document.getElementById("primeQ").value;
  let p = parseInt(pVal), q = parseInt(qVal);
  if (!pVal || !qVal || isNaN(p) || isNaN(q) || !isPrime(p) || !isPrime(q) || p === q) {
    alert("Please enter two distinct prime numbers for P and Q.");
    return;
  }
  let n = p * q;
  let phi = (p - 1) * (q - 1);
  let candidates = [3, 5, 17, 257, 65537];
  let e;
  for (let cand of candidates) {
    if (cand < phi && gcd(cand, phi) === 1n) { e = cand; break; }
  }
  if (!e) { alert("Failed to find suitable public exponent."); return; }
  let d = modInverse(e, phi);
  document.getElementById("publicE").value = e;
  document.getElementById("publicN").value = n;
  document.getElementById("privateD").value = d.toString();
  document.getElementById("privateN").value = n;
  alert("Keys generated from input primes.");
}
function generateRSAKeys() {
  let primes = [11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
  let p = primes[Math.floor(Math.random()*primes.length)];
  let q = primes[Math.floor(Math.random()*primes.length)];
  while(p === q) { q = primes[Math.floor(Math.random()*primes.length)]; }
  let n = p * q;
  let phi = (p - 1) * (q - 1);
  let candidates = [3, 5, 17, 257, 65537];
  let e;
  for (let cand of candidates) {
    if (cand < phi && gcd(cand, phi) === 1n) { e = cand; break; }
  }
  if (!e) { alert("Failed to generate keys."); return; }
  let d = modInverse(e, phi);
  document.getElementById("publicE").value = e;
  document.getElementById("publicN").value = n;
  document.getElementById("privateD").value = d.toString();
  document.getElementById("privateN").value = n;
  document.getElementById("primeP").value = p;
  document.getElementById("primeQ").value = q;
  alert("Keys auto-generated.");
}
initializeBubbles();