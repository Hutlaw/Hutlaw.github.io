function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
function base64ToArrayBuffer(base64) {
  let binary_string = atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
async function aesEncrypt() {
  const message = document.getElementById("aesMessage").value;
  const keyStr = document.getElementById("aesKeyEnc").value;
  if (keyStr.length !== 16) {
    alert("Key must be exactly 16 characters long for AES-128.");
    return;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const keyData = encoder.encode(keyStr);
  try {
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["encrypt"]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, data);
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    const base64 = arrayBufferToBase64(combined.buffer);
    document.getElementById("aesEncrypted").value = base64;
  } catch (e) {
    alert("Encryption failed: " + e.message);
  }
}
async function aesDecrypt() {
  const base64 = document.getElementById("aesCiphertext").value;
  const keyStr = document.getElementById("aesKeyDec").value;
  if (keyStr.length !== 16) {
    alert("Key must be exactly 16 characters long for AES-128.");
    return;
  }
  const keyData = new TextEncoder().encode(keyStr);
  try {
    const combinedBuffer = base64ToArrayBuffer(base64);
    const combined = new Uint8Array(combinedBuffer);
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const cryptoKey = await crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, ["decrypt"]);
    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, cryptoKey, ciphertext);
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    document.getElementById("aesDecrypted").value = decryptedText;
  } catch (e) {
    alert("Decryption failed: " + e.message);
  }
}