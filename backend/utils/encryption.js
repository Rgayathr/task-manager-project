// AES encryption utility for sensitive data fields
// Used to encrypt/decrypt sensitive payload data as required by the assignment
const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.AES_SECRET;

// Encrypt plaintext string using AES algorithm
// Returns encrypted ciphertext string
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

// Decrypt AES ciphertext back to original plaintext
// Returns decrypted string
const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
