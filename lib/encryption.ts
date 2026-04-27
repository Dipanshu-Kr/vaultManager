import CryptoJS from 'crypto-js';

export const encryptPassword = (password: string, masterPassword: string): string => {
  return CryptoJS.AES.encrypt(password, masterPassword).toString();
};

export const decryptPassword = (encryptedPassword: string, masterPassword: string): string => {
  const decrypted = CryptoJS.AES.decrypt(encryptedPassword, masterPassword);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const hashMasterPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};
