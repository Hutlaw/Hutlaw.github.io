async function generateMyKeyPair() {
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
  const pubJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
  const privJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
  document.getElementById("myPublicKey").value = JSON.stringify(pubJwk);
  document.getElementById("myPrivateKey").value = JSON.stringify(privJwk);
}

async function signalEncryptMessage() {
  const senderPrivText = document.getElementById("myPrivateKey").value;
  const senderPubText = document.getElementById("myPublicKey").value;
  if (!senderPrivText || !senderPubText) {
    alert("Please generate your key pair first.");
    return;
  }
  let senderPrivateKey, senderPublicKey;
  try {
    senderPrivateKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(senderPrivText),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
    senderPublicKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(senderPubText),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
  } catch (e) {
    alert("Invalid sender keys. Please generate a valid key pair.");
    return;
  }
  const recipientPubText = document.getElementById("recipientPublicKey").value;
  if (!recipientPubText) {
    alert("Please enter the recipient's public key.");
    return;
  }
  let recipientPublicKey;
  try {
    recipientPublicKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(recipientPubText),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
  } catch (e) {
    alert("Invalid recipient public key.");
    return;
  }
  const message = document.getElementById("signalMessage").value;
  if (!message) {
    alert("Please enter a message to encrypt.");
    return;
  }
  let sharedKey;
  try {
    sharedKey = await crypto.subtle.deriveKey(
      { name: "ECDH", public: recipientPublicKey },
      senderPrivateKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  } catch (e) {
    alert("Failed to derive shared key.");
    return;
  }
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  let ciphertext;
  try {
    ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      sharedKey,
      encodedMessage
    );
  } catch (e) {
    alert("Encryption failed.");
    return;
  }
  let senderPublicJwk;
  try {
    senderPublicJwk = await crypto.subtle.exportKey("jwk", senderPublicKey);
  } catch (e) {
    alert("Failed to export sender public key.");
    return;
  }
  const encryptedObj = {
    senderPublicKey: senderPublicJwk,
    iv: arrayBufferToBase64(iv.buffer),
    ciphertext: arrayBufferToBase64(ciphertext)
  };
  document.getElementById("signalEncrypted").value = JSON.stringify(encryptedObj);
}

async function signalDecryptMessage() {
  const encryptedText = document.getElementById("signalCiphertext").value;
  if (!encryptedText) {
    alert("Please enter the encrypted message.");
    return;
  }
  let encryptedObj;
  try {
    encryptedObj = JSON.parse(encryptedText);
  } catch (e) {
    alert("Invalid encrypted message format.");
    return;
  }
  if (!encryptedObj.senderPublicKey || !encryptedObj.iv || !encryptedObj.ciphertext) {
    alert("Encrypted message is missing required parameters.");
    return;
  }
  let senderPublicKey;
  try {
    senderPublicKey = await crypto.subtle.importKey(
      "jwk",
      encryptedObj.senderPublicKey,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
  } catch (e) {
    alert("Invalid sender public key in the encrypted message.");
    return;
  }
  const myPrivText = document.getElementById("myPrivateKey").value;
  if (!myPrivText) {
    alert("Please provide your private key.");
    return;
  }
  let recipientPrivateKey;
  try {
    recipientPrivateKey = await crypto.subtle.importKey(
      "jwk",
      JSON.parse(myPrivText),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
  } catch (e) {
    alert("Invalid private key provided.");
    return;
  }
  let sharedKey;
  try {
    sharedKey = await crypto.subtle.deriveKey(
      { name: "ECDH", public: senderPublicKey },
      recipientPrivateKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  } catch (e) {
    alert("Failed to derive shared key.");
    return;
  }
  const iv = base64ToArrayBuffer(encryptedObj.iv);
  const ciphertext = base64ToArrayBuffer(encryptedObj.ciphertext);
  let decrypted;
  try {
    decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      sharedKey,
      ciphertext
    );
  } catch (e) {
    alert("Decryption failed. Invalid key or corrupted data.");
    return;
  }
  const decoder = new TextDecoder();
  document.getElementById("signalDecrypted").value = decoder.decode(decrypted);
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

const starsCanvas = document.getElementById("stars");
const starsCtx = starsCanvas.getContext("2d");
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
    starsCtx.fillStyle = `rgba(255,255,255,${Math.sin(star.twinkle) * 0.5 + 0.5})`;
    starsCtx.fill();
    star.twinkle += star.speed;
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
generateStars();
drawStars();
window.addEventListener("resize", () => { resizeCanvas(); generateStars(); });
window.addEventListener("touchmove", e => { e.preventDefault(); }, { passive: false });
const bubbles = document.querySelectorAll(".bubble");
let currentIndex = 0;
let touchStartY = 0;
let touchEndY = 0;
function initializeBubbles() {
  bubbles.forEach(b => b.classList.remove("top", "middle", "bottom"));
  let topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  let bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add("middle");
  bubbles[topIndex].classList.add("top");
  bubbles[bottomIndex].classList.add("bottom");
}
function rotateBubbles(direction) {
  bubbles.forEach(b => b.classList.remove("top", "middle", "bottom"));
  currentIndex = direction === "down" ? (currentIndex + 1) % bubbles.length : (currentIndex - 1 + bubbles.length) % bubbles.length;
  let topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  let bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add("middle");
  bubbles[topIndex].classList.add("top");
  bubbles[bottomIndex].classList.add("bottom");
}
function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}
function handleTouchEnd(event) {
  touchEndY = event.changedTouches[0].clientY;
  let swipeDistance = touchStartY - touchEndY;
  if (Math.abs(swipeDistance) > 50) {
    rotateBubbles(swipeDistance > 0 ? "down" : "up");
  }
}
let scrollTimeout;
window.addEventListener("wheel", event => {
  if (scrollTimeout) return;
  rotateBubbles(event.deltaY > 0 ? "down" : "up");
  scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 500);
});
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchend", handleTouchEnd);
initializeBubbles();