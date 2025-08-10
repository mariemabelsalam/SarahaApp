import { roleEnum } from "../../DB/models/User.model.js";
import jwt from "jsonwebtoken";
import { signutureLevelEnum } from "../../middleware/authenticate.middleware.js";

export const generateToken = ({
  payLoad = {},
  privateKey = process.env.ACCESS_USER_TOKEN,
  options = { expiresIn: "1h" },
} = {}) => {
  return jwt.sign(payLoad, privateKey, options);
};

export const verifyToken = ({
  token,
  privateKey = process.env.ACCESS_USER_TOKEN,
} = {}) => {
  return jwt.verify(token, privateKey);
};

export const getSignutures = async ({
  signtureLeve = signutureLevelEnum.user,
} = {}) => {
  let signutures = { accessSignuture: undefined, refreshSignuture: undefined };
  switch (signtureLeve) {
    case signutureLevelEnum.admin:
      signutures.accessSignuture = process.env.ACCESS_ADMIN_TOKEN;
      signutures.refreshSignuture = process.env.REFRESH_ADMIN_TOKEN;
      break;
    case signutureLevelEnum.admin:
      signutures.accessSignuture = process.env.ACCESS_USER_TOKEN;
      signutures.refreshSignuture = process.env.REFRESH_USER_TOKEN;
      break;
  }
  return signutures;
};

export const generateLogicCredentails = async ({ user } = {}) => {
  let signutures = getSignutures({
    signtureLeve: user.role === signutureLevelEnum.user ? "user" : "admin",
  });
  const accessToken = generateToken({
    payLoad: { _id: user._id },
    privateKey: signutures.accessSignuture,
  });
  const refreshToken = generateToken({
    payLoad: { _id: user._id },
    privateKey: signutures.refresgSignuture,
    options: { expiresIn: "1y" },
  });
  return { accessToken, refreshToken };
};
