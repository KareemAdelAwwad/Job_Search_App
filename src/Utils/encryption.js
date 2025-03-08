import CryptoJS from "crypto-js";

export const Encrypt = (text, key) => CryptoJS.AES.encrypt(text, key).toString();

export const Decypt = (cipher, key) => {
  const bytes = CryptoJS.AES.decrypt(cipher, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};