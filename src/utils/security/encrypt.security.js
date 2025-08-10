import CryptoJS from "crypto-js";

export const generateEncrypt = ({
  plainText = "",
  secretKey = process.env.ENCRYPTION_SECRET_KEY,
} = {}) => {
  return CryptoJS.AES.encrypt(plainText, secretKey).toString();
};

export const generateDecrypt = ({
  cipherText = "",
  secretKey = process.env.ENCRYPTION_SECRET_KEY,
} = {}) => {
  return CryptoJS.AES.decrypt(cipherText, secretKey).toString(
    CryptoJS.enc.Utf8
  );
};
