// src/lib/crypto.js
import CryptoJS from 'crypto-js';

// IMPORTANT: In a real app, this key would be derived from the user's master password
// and held in memory, NEVER hardcoded.
const SECRET_KEY = 'my-super-secret-key-from-user-password';

export const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};