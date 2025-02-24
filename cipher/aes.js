async function getKeyFromPassword(password) {
  let encoder = new TextEncoder();
  let keyData = encoder.encode(password);
  if (keyData.length < 16) {
    let padded = new Uint8Array(16);
    padded.set(keyData);
    keyData = padded;
  } else if (keyData.length > 16) {
    keyData = keyData.slice(0, 16);
  }
  return await crypto.subtle.importKey("raw", keyData, "AES-GCM", false, ["encrypt", "decrypt"]);
}

async function encryptAES() {
  let message = document.getElementById("aesMessage").value;
  let password = document.getElementById("aesKey").value;
  if (!message || !password || password.length < 16) {
    alert("Enter a message and a key of at least 16 characters.");
    return;
  }
  try {
    let key = await getKeyFromPassword(password);
    let iv = crypto.getRandomValues(new Uint8Array(12));
    let encoder = new TextEncoder();
    let data = encoder.encode(message);
    let encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data);
    let encryptedArray = new Uint8Array(encrypted);
    let combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    let base64 = btoa(String.fromCharCode(...combined));
    document.getElementById("aesEncrypted").value = base64;
  } catch (e) {
    alert("Encryption failed: " + e);
  }
}

async function decryptAES() {
  let base64 = document.getElementById("aesCiphertext").value;
  let password = document.getElementById("aesKeyDec").value;
  if (!base64 || !password || password.length < 16) {
    alert("Enter an encrypted message and a key of at least 16 characters.");
    return;
  }
  try {
    let combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    let iv = combined.slice(0, 12);
    let data = combined.slice(12);
    let key = await getKeyFromPassword(password);
    let decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
    let decoder = new TextDecoder();
    document.getElementById("aesDecrypted").value = decoder.decode(decrypted);
  } catch (e) {
    alert("Decryption failed: " + e);
  }
}