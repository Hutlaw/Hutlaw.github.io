function generateMyKeyPair() {
  var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  function randomString(length) {
    var str = "";
    for (var i = 0; i < length; i++) {
      str += base64Chars.charAt(Math.floor(Math.random() * base64Chars.length));
    }
    return str;
  }
  var key = {
    "crv": "P-256",
    "ext": true,
    "key_ops": [],
    "kty": "EC",
    "x": randomString(43),
    "y": randomString(43)
  };
  document.getElementById("myPublicKey").value = JSON.stringify(key);
  document.getElementById("myPrivateKey").value = JSON.stringify(key);
}

function sumAscii(str) {
  var sum = 0;
  for (var i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

function caesarEncrypt(text, shift) {
  return text.split("").map(function(ch) {
    if (ch >= "A" && ch <= "Z") {
      var code = ch.charCodeAt(0);
      var newCode = ((code - 65 + shift) % 26) + 65;
      return String.fromCharCode(newCode);
    } else if (ch >= "a" && ch <= "z") {
      var code = ch.charCodeAt(0);
      var newCode = ((code - 97 + shift) % 26) + 97;
      return String.fromCharCode(newCode);
    } else {
      return ch;
    }
  }).join("");
}

function caesarDecrypt(text, shift) {
  return text.split("").map(function(ch) {
    if (ch >= "A" && ch <= "Z") {
      var code = ch.charCodeAt(0);
      var newCode = ((code - 65 - shift + 26) % 26) + 65;
      return String.fromCharCode(newCode);
    } else if (ch >= "a" && ch <= "z") {
      var code = ch.charCodeAt(0);
      var newCode = ((code - 97 - shift + 26) % 26) + 97;
      return String.fromCharCode(newCode);
    } else {
      return ch;
    }
  }).join("");
}

function signalEncryptMessage() {
  var senderKeyText = document.getElementById("myPublicKey").value;
  var recipientKeyText = document.getElementById("recipientPublicKey").value;
  if (!senderKeyText || !recipientKeyText) {
    alert("Please generate your key pair and enter the recipient's public key.");
    return;
  }
  var senderKey, recipientKey;
  try {
    senderKey = JSON.parse(senderKeyText);
    recipientKey = JSON.parse(recipientKeyText);
  } catch (e) {
    alert("Invalid key format.");
    return;
  }
  if (!senderKey.x || !recipientKey.x) {
    alert("Key is missing required property 'x'.");
    return;
  }
  var shift = (sumAscii(senderKey.x) + sumAscii(recipientKey.x)) % 26;
  var message = document.getElementById("signalMessage").value;
  if (!message) {
    alert("Please enter a message to encrypt.");
    return;
  }
  var ciphertext = caesarEncrypt(message, shift);
  var encryptedObj = {
    senderPublicKey: senderKey,
    shift: shift,
    ciphertext: ciphertext
  };
  document.getElementById("signalEncrypted").value = JSON.stringify(encryptedObj);
}

function signalDecryptMessage() {
  var encryptedText = document.getElementById("signalCiphertext").value;
  if (!encryptedText) {
    alert("Please enter the encrypted message.");
    return;
  }
  var encryptedObj;
  try {
    encryptedObj = JSON.parse(encryptedText);
  } catch (e) {
    alert("Invalid encrypted message format.");
    return;
  }
  if (!encryptedObj.senderPublicKey || encryptedObj.ciphertext === undefined || encryptedObj.shift === undefined) {
    alert("Encrypted message is missing required parameters.");
    return;
  }
  var senderKey = encryptedObj.senderPublicKey;
  var recipientKeyText = document.getElementById("myPrivateKey").value;
  if (!recipientKeyText) {
    alert("Please provide your private key.");
    return;
  }
  var recipientKey;
  try {
    recipientKey = JSON.parse(recipientKeyText);
  } catch (e) {
    alert("Invalid recipient key format.");
    return;
  }
  if (!senderKey.x || !recipientKey.x) {
    alert("Key is missing required property 'x'.");
    return;
  }
  var computedShift = (sumAscii(senderKey.x) + sumAscii(recipientKey.x)) % 26;
  if (computedShift !== encryptedObj.shift) {
    alert("Decryption failed. Keys do not match.");
    return;
  }
  var plaintext = caesarDecrypt(encryptedObj.ciphertext, computedShift);
  document.getElementById("signalDecrypted").value = plaintext;
}

var starsCanvas = document.getElementById("stars");
var starsCtx = starsCanvas.getContext("2d");
var stars = [];
function resizeCanvas() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
function generateStars() {
  stars = [];
  for (var i = 0; i < 100; i++) {
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
  stars.forEach(function(star) {
    starsCtx.beginPath();
    starsCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    starsCtx.fillStyle = "rgba(255,255,255," + (Math.sin(star.twinkle) * 0.5 + 0.5) + ")";
    starsCtx.fill();
    star.twinkle += star.speed;
  });
  requestAnimationFrame(drawStars);
}
resizeCanvas();
generateStars();
drawStars();
window.addEventListener("resize", function() { resizeCanvas(); generateStars(); });
window.addEventListener("touchmove", function(e) { e.preventDefault(); }, { passive: false });
var bubbles = document.querySelectorAll(".bubble");
var currentIndex = 0;
var touchStartY = 0;
var touchEndY = 0;
function initializeBubbles() {
  bubbles.forEach(function(b) { b.classList.remove("top", "middle", "bottom"); });
  var topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  var bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add("middle");
  bubbles[topIndex].classList.add("top");
  bubbles[bottomIndex].classList.add("bottom");
}
function rotateBubbles(direction) {
  bubbles.forEach(function(b) { b.classList.remove("top", "middle", "bottom"); });
  currentIndex = direction === "down" ? (currentIndex + 1) % bubbles.length : (currentIndex - 1 + bubbles.length) % bubbles.length;
  var topIndex = (currentIndex - 1 + bubbles.length) % bubbles.length;
  var bottomIndex = (currentIndex + 1) % bubbles.length;
  bubbles[currentIndex].classList.add("middle");
  bubbles[topIndex].classList.add("top");
  bubbles[bottomIndex].classList.add("bottom");
}
function handleTouchStart(event) {
  touchStartY = event.touches[0].clientY;
}
function handleTouchEnd(event) {
  touchEndY = event.changedTouches[0].clientY;
  var swipeDistance = touchStartY - touchEndY;
  if (Math.abs(swipeDistance) > 50) {
    rotateBubbles(swipeDistance > 0 ? "down" : "up");
  }
}
var scrollTimeout;
window.addEventListener("wheel", function(event) {
  if (scrollTimeout) return;
  rotateBubbles(event.deltaY > 0 ? "down" : "up");
  scrollTimeout = setTimeout(function() { scrollTimeout = null; }, 500);
});
window.addEventListener("touchstart", handleTouchStart);
window.addEventListener("touchend", handleTouchEnd);
initializeBubbles();