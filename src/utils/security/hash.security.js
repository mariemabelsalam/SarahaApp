import bcrypt from "bcryptjs";

const saltRound = parseInt(process.env.SALT_ROUND);

export const generateHash = ({ plainText = "", salt = saltRound } = {}) => {
  return bcrypt.hashSync(plainText, salt);
};

export const compareHash = ({ plainText = "", hashValue = "" } = {}) => {
  return bcrypt.compareSync(plainText, hashValue);
};
