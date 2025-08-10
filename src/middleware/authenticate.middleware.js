import userModel from "../DB/models/User.model.js";
import * as DBService from "../DB/service.db.js";
import { asyncHandler } from "../utils/response.js";
import {
  getSignutures,
  verifyToken,
} from "../utils/security/token.security.js";
export const signutureLevelEnum = {
  admin: "admin",
  user: "user",
};
export const signutureEnum = {
  access: "access",
  refresh: "refresh",
};

export const decodeToken = async ({
  token = "",
  typeSignuture,
  signuture = signutureEnum.access,
}) => {
  const [bearer, authorization] = token.split(" ");
  let signutures = await getSignutures({ signtureLeve: bearer });
  let key = "";
  switch (typeSignuture) {
    case signutureEnum.access:
      key = process.env.ACCESS_USER_TOKEN;
      break;
    default:
      key = process.env.REFRESH_USER_TOKEN;
      break;
  }
  const decode = verifyToken({
    token: authorization,
    privateKey: signutures.accessSignuture,
  });

  const user = await DBService.findById({
    model: userModel,
    filter: decode._id,
  });
  if (!user) {
    throw new Error("not register account");
  }
  return user;
};

export const authenticate = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodeToken({
    token: authorization,
    typeSignuture: signutureEnum.access,
  });
  req.user = user;
  next();
});

export const authorization = ({ accessRoles = [] } = {}) => {
  return asyncHandler((req, res, next) => {
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("not authorized account"));
    }
    next();
  });
};
