async function aesEncryptMessage() {
  const message = document.getElementById("aesMessage").value;
  const keyStr = document.getElementById("aesKey").value;
  if(keyStr.length !== 16) {
    alert("Key must be exactly 16 characters long.");
    return;
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(keyStr);
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, {name: "AES-GCM"}, false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const messageData = encoder.encode(message);
  try {
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, messageData);
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    const base64 = arrayBufferToBase64(combined);
    document.getElementById("aesEncrypted").value = base64;
  } catch (err) {
    alert("Encryption failed: " + err);
  }
}
async function aesDecryptMessage() {
  const base64 = document.getElementById("aesCiphertext").value;
  const keyStr = document.getElementById("aesKey").value;
  if(keyStr.length !== 16) {
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
  const cryptoKey = await crypto.subtle.importKey("raw", keyData, {name: "AES-GCM"}, false, ["decrypt"]);
  try {
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, cryptoKey, data);
    const decryptedText = decoder.decode(decryptedBuffer);
    document.getElementById("aesDecrypted").value = decryptedText;
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
  for(let i = 0; i < 16; i++){
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